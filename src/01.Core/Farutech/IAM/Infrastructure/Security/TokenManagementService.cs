using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Domain.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Farutech.IAM.Infrastructure.Security;

/// <summary>
/// Service for JWT token generation, validation, and management using RS256 algorithm
/// </summary>
public class TokenManagementService : ITokenManagementService
{
    private readonly TokenOptions _options;
    private readonly ILogger<TokenManagementService> _logger;
    private readonly RsaSecurityKey _securityKey;
    private readonly SigningCredentials _signingCredentials;

    public TokenManagementService(
        IOptions<TokenOptions> options,
        ILogger<TokenManagementService> logger)
    {
        _options = options.Value;
        _logger = logger;

        // Generate or load RSA keys
        _securityKey = GenerateOrLoadRsaKey();
        _signingCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.RsaSha256);
    }

    public async Task<string> GenerateAccessTokenAsync(User user, Tenant tenant, TenantMembership membership)
    {
        var claims = new List<Claim>
        {
            // Standard JWT claims
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),

            // Custom claims for user
            new Claim("user_id", user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("full_name", $"{user.FirstName} {user.LastName}".Trim()),
            new Claim("first_name", user.FirstName),
            new Claim("last_name", user.LastName),

            // Tenant context claims
            new Claim("tenant_id", tenant.Id.ToString()),
            new Claim("tenant_code", tenant.Code),
            new Claim("tenant_name", tenant.Name),

            // Membership and role claims
            new Claim("membership_id", membership.Id.ToString()),
            new Claim("role_id", membership.Role?.Id.ToString() ?? string.Empty),
            new Claim("role_name", membership.Role?.Name ?? string.Empty),
            new Claim(ClaimTypes.Role, membership.Role?.Name ?? string.Empty)
        };

        // Add permission claims
        if (membership.Role?.RolePermissions?.Any() == true)
        {
            foreach (var rolePermission in membership.Role.RolePermissions)
            {
                if (rolePermission.Permission != null)
                {
                    claims.Add(new Claim("permission", rolePermission.Permission.Code));
                }
            }
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_options.AccessTokenExpirationMinutes),
            Issuer = _options.Issuer,
            Audience = _options.Audience,
            SigningCredentials = _signingCredentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        _logger.LogInformation(
            "Generated access token for user {UserId} in tenant {TenantId} with role {RoleName}",
            user.Id, tenant.Id, membership.Role?.Name ?? "Unknown");

        return await Task.FromResult(tokenString);
    }

    public string GenerateRefreshToken()
    {
        // Generate 32 bytes of random data
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);

        // Convert to URL-safe base64 string
        var token = Convert.ToBase64String(randomBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");

        return token;
    }

    public async Task<ClaimsPrincipal?> ValidateAccessTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _securityKey,
                ValidateIssuer = _options.ValidateIssuer,
                ValidIssuer = _options.Issuer,
                ValidateAudience = _options.ValidateAudience,
                ValidAudience = _options.Audience,
                ValidateLifetime = _options.ValidateLifetime,
                ClockSkew = TimeSpan.FromMinutes(_options.ClockSkewMinutes)
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

            // Verify it's a JWT with RS256 algorithm
            if (validatedToken is JwtSecurityToken jwtToken &&
                jwtToken.Header.Alg.Equals(SecurityAlgorithms.RsaSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                _logger.LogDebug("Token validated successfully");
                return await Task.FromResult(principal);
            }

            _logger.LogWarning("Token validation failed: Invalid algorithm");
            return null;
        }
        catch (SecurityTokenExpiredException ex)
        {
            _logger.LogWarning(ex, "Token validation failed: Token expired");
            return null;
        }
        catch (SecurityTokenInvalidSignatureException ex)
        {
            _logger.LogWarning(ex, "Token validation failed: Invalid signature");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Token validation failed with unexpected error");
            return null;
        }
    }

    public Guid? GetUserIdFromToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);

            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "user_id");
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to extract user ID from token");
            return null;
        }
    }

    public Guid? GetTenantIdFromToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);

            var tenantIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "tenant_id");
            if (tenantIdClaim != null && Guid.TryParse(tenantIdClaim.Value, out var tenantId))
            {
                return tenantId;
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to extract tenant ID from token");
            return null;
        }
    }

    private RsaSecurityKey GenerateOrLoadRsaKey()
    {
        RSA rsa;

        // If a key path is specified, try to load from file
        if (!string.IsNullOrEmpty(_options.RsaKeyPath) && File.Exists(_options.RsaKeyPath))
        {
            try
            {
                var keyData = File.ReadAllText(_options.RsaKeyPath);
                rsa = RSA.Create();
                rsa.ImportFromPem(keyData);
                _logger.LogInformation("RSA key loaded from {KeyPath}", _options.RsaKeyPath);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to load RSA key from {KeyPath}, generating new key", _options.RsaKeyPath);
                rsa = GenerateNewRsaKey();
            }
        }
        else
        {
            // Generate new in-memory key
            rsa = GenerateNewRsaKey();

            // Optionally save to file if path is specified
            if (!string.IsNullOrEmpty(_options.RsaKeyPath))
            {
                try
                {
                    var directory = Path.GetDirectoryName(_options.RsaKeyPath);
                    if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                    {
                        Directory.CreateDirectory(directory);
                    }

                    var privateKeyPem = rsa.ExportRSAPrivateKeyPem();
                    File.WriteAllText(_options.RsaKeyPath, privateKeyPem);
                    _logger.LogInformation("RSA key saved to {KeyPath}", _options.RsaKeyPath);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to save RSA key to {KeyPath}", _options.RsaKeyPath);
                }
            }
        }

        return new RsaSecurityKey(rsa);
    }

    private RSA GenerateNewRsaKey()
    {
        var rsa = RSA.Create(_options.RsaKeySize);
        _logger.LogInformation("Generated new RSA key with size {KeySize}", _options.RsaKeySize);
        return rsa;
    }
}
