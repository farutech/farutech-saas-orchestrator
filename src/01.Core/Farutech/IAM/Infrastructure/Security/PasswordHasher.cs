using Farutech.IAM.Application.Interfaces;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Farutech.IAM.Infrastructure.Security;

/// <summary>
/// Password hasher using PBKDF2 with HMACSHA256
/// Compatible with ASP.NET Core Identity v3 format
/// </summary>
public class PasswordHasher : IPasswordHasher
{
    private const int IterationCount = 100000; // NIST recommendation
    private const int SaltSize = 128 / 8; // 128 bits
    private const int HashSize = 256 / 8; // 256 bits

    public string HashPassword(string password)
    {
        if (string.IsNullOrEmpty(password))
            throw new ArgumentNullException(nameof(password));

        // Generate salt
        byte[] salt = new byte[SaltSize];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        // Generate hash
        byte[] hash = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: IterationCount,
            numBytesRequested: HashSize
        );

        // Combine format marker, salt, and hash
        // Format: [1 byte version][4 bytes iteration][16 bytes salt][32 bytes hash]
        byte[] hashBytes = new byte[1 + 4 + SaltSize + HashSize];
        
        hashBytes[0] = 0x01; // Version 1
        
        BitConverter.GetBytes(IterationCount).CopyTo(hashBytes, 1);
        salt.CopyTo(hashBytes, 5);
        hash.CopyTo(hashBytes, 5 + SaltSize);

        return Convert.ToBase64String(hashBytes);
    }

    public bool VerifyPassword(string password, string hash)
    {
        if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hash))
            return false;

        try
        {
            byte[] hashBytes = Convert.FromBase64String(hash);

            // Verify minimum length
            if (hashBytes.Length < 1 + 4 + SaltSize + HashSize)
                return false;

            // Extract version
            byte version = hashBytes[0];
            if (version != 0x01)
                return false; // Unknown version

            // Extract iteration count
            int iterationCount = BitConverter.ToInt32(hashBytes, 1);

            // Extract salt
            byte[] salt = new byte[SaltSize];
            Array.Copy(hashBytes, 5, salt, 0, SaltSize);

            // Extract stored hash
            byte[] storedHash = new byte[HashSize];
            Array.Copy(hashBytes, 5 + SaltSize, storedHash, 0, HashSize);

            // Compute hash for provided password
            byte[] computedHash = KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: iterationCount,
                numBytesRequested: HashSize
            );

            // Compare hashes using constant-time comparison
            return CryptographicOperations.FixedTimeEquals(storedHash, computedHash);
        }
        catch
        {
            return false;
        }
    }
}
