using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Farutech.IAM.Infrastructure.Security;

/// <summary>
/// Service for converting internal GUIDs to secure public identifiers using AES-256-GCM encryption
/// </summary>
public class PublicIdService : IPublicIdService
{
    private readonly PublicIdOptions _options;
    private readonly IDistributedCache? _cache;
    private readonly ILogger<PublicIdService> _logger;
    private readonly byte[] _key;

    public PublicIdService(
        IOptions<PublicIdOptions> options,
        IDistributedCache? cache,
        ILogger<PublicIdService> logger)
    {
        _options = options.Value;
        _cache = cache;
        _logger = logger;

        // Derive 32-byte key from secret
        _key = DeriveKey(_options.SecretKey);
    }

    public string ToPublicId(Guid internalId, string entityType)
    {
        try
        {
            var payload = new PublicIdPayload
            {
                Id = internalId,
                EntityType = entityType,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = _options.TokenExpirationMinutes > 0
                    ? DateTime.UtcNow.AddMinutes(_options.TokenExpirationMinutes)
                    : null
            };

            var json = JsonSerializer.Serialize(payload);
            var encrypted = EncryptAesGcm(json);
            var publicId = UrlSafeBase64Encode(encrypted);

            // Cache the mapping if enabled
            if (_options.EnableCaching && _cache != null)
            {
                var cacheKey = $"publicid:{publicId}";
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_options.CacheExpirationMinutes)
                };
                _cache.SetString(cacheKey, internalId.ToString(), cacheOptions);
            }

            return publicId;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error converting internal ID {InternalId} to public ID", internalId);
            throw;
        }
    }

    public Guid? FromPublicId(string publicId)
    {
        try
        {
            // Check cache first if enabled
            if (_options.EnableCaching && _cache != null)
            {
                var cacheKey = $"publicid:{publicId}";
                var cachedValue = _cache.GetString(cacheKey);
                if (!string.IsNullOrEmpty(cachedValue) && Guid.TryParse(cachedValue, out var cachedGuid))
                {
                    return cachedGuid;
                }
            }

            var encrypted = UrlSafeBase64Decode(publicId);
            var json = DecryptAesGcm(encrypted);
            var payload = JsonSerializer.Deserialize<PublicIdPayload>(json);

            if (payload == null)
                return null;

            // Check expiration
            if (payload.ExpiresAt.HasValue && payload.ExpiresAt.Value < DateTime.UtcNow)
            {
                _logger.LogWarning("Public ID {PublicId} has expired", publicId);
                return null;
            }

            return payload.Id;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error converting public ID {PublicId} to internal ID", publicId);
            return null;
        }
    }

    public bool IsValidPublicId(string publicId)
    {
        return FromPublicId(publicId).HasValue;
    }

    public async Task<Dictionary<Guid, string>> ToPublicIdsAsync(IEnumerable<Guid> internalIds, string entityType)
    {
        var result = new Dictionary<Guid, string>();

        foreach (var id in internalIds)
        {
            result[id] = ToPublicId(id, entityType);
        }

        return await Task.FromResult(result);
    }

    public async Task<Dictionary<string, Guid>> FromPublicIdsAsync(IEnumerable<string> publicIds)
    {
        var result = new Dictionary<string, Guid>();

        foreach (var publicId in publicIds)
        {
            var internalId = FromPublicId(publicId);
            if (internalId.HasValue)
            {
                result[publicId] = internalId.Value;
            }
        }

        return await Task.FromResult(result);
    }

    #region Private Helper Methods

    private byte[] DeriveKey(string secret)
    {
        // Use PBKDF2 to derive a 32-byte key from the secret
        return Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(secret),
            Encoding.UTF8.GetBytes("FarutechIAM-Salt-v1"), // Fixed salt for consistency
            100000,
            HashAlgorithmName.SHA256,
            32); // 256 bits
    }

    private byte[] EncryptAesGcm(string plaintext)
    {
        var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);
        var nonce = new byte[AesGcm.NonceByteSizes.MaxSize]; // 12 bytes
        var tag = new byte[AesGcm.TagByteSizes.MaxSize]; // 16 bytes
        var ciphertext = new byte[plaintextBytes.Length];

        RandomNumberGenerator.Fill(nonce);

        using var aesGcm = new AesGcm(_key, AesGcm.TagByteSizes.MaxSize);
        aesGcm.Encrypt(nonce, plaintextBytes, ciphertext, tag);

        // Combine nonce + tag + ciphertext
        var result = new byte[nonce.Length + tag.Length + ciphertext.Length];
        Buffer.BlockCopy(nonce, 0, result, 0, nonce.Length);
        Buffer.BlockCopy(tag, 0, result, nonce.Length, tag.Length);
        Buffer.BlockCopy(ciphertext, 0, result, nonce.Length + tag.Length, ciphertext.Length);

        return result;
    }

    private string DecryptAesGcm(byte[] encrypted)
    {
        var nonceSize = AesGcm.NonceByteSizes.MaxSize;
        var tagSize = AesGcm.TagByteSizes.MaxSize;

        var nonce = new byte[nonceSize];
        var tag = new byte[tagSize];
        var ciphertext = new byte[encrypted.Length - nonceSize - tagSize];

        Buffer.BlockCopy(encrypted, 0, nonce, 0, nonceSize);
        Buffer.BlockCopy(encrypted, nonceSize, tag, 0, tagSize);
        Buffer.BlockCopy(encrypted, nonceSize + tagSize, ciphertext, 0, ciphertext.Length);

        var plaintext = new byte[ciphertext.Length];

        using var aesGcm = new AesGcm(_key, tagSize);
        aesGcm.Decrypt(nonce, ciphertext, tag, plaintext);

        return Encoding.UTF8.GetString(plaintext);
    }

    private static string UrlSafeBase64Encode(byte[] data)
    {
        return Convert.ToBase64String(data)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');
    }

    private static byte[] UrlSafeBase64Decode(string base64)
    {
        var base64Standard = base64
            .Replace('-', '+')
            .Replace('_', '/');

        // Add padding
        switch (base64Standard.Length % 4)
        {
            case 2: base64Standard += "=="; break;
            case 3: base64Standard += "="; break;
        }

        return Convert.FromBase64String(base64Standard);
    }

    #endregion

    private class PublicIdPayload
    {
        public Guid Id { get; set; }
        public string EntityType { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}
