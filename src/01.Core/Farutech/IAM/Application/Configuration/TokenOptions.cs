namespace Farutech.IAM.Application.Configuration;

/// <summary>
/// Configuration options for JWT token generation and validation
/// </summary>
public class TokenOptions
{
    public const string SectionName = "TokenOptions";

    /// <summary>
    /// Token issuer (typically the application URL)
    /// </summary>
    public string Issuer { get; set; } = "https://localhost:7001";

    /// <summary>
    /// Token audience (typically the API URL or client ID)
    /// </summary>
    public string Audience { get; set; } = "farutech-api";

    /// <summary>
    /// Access token expiration time in minutes (default: 480 = 8 hours)
    /// </summary>
    public int AccessTokenExpirationMinutes { get; set; } = 480;

    /// <summary>
    /// Refresh token expiration time in days (default: 30 days)
    /// </summary>
    public int RefreshTokenExpirationDays { get; set; } = 30;

    /// <summary>
    /// RSA key size in bits (2048, 3072, or 4096)
    /// </summary>
    public int RsaKeySize { get; set; } = 2048;

    /// <summary>
    /// Path to store/load RSA keys (optional, if not provided, generates in-memory keys)
    /// </summary>
    public string? RsaKeyPath { get; set; }

    /// <summary>
    /// Whether to validate token lifetime
    /// </summary>
    public bool ValidateLifetime { get; set; } = true;

    /// <summary>
    /// Whether to validate the issuer
    /// </summary>
    public bool ValidateIssuer { get; set; } = true;

    /// <summary>
    /// Whether to validate the audience
    /// </summary>
    public bool ValidateAudience { get; set; } = true;

    /// <summary>
    /// Clock skew tolerance in minutes (default: 5 minutes)
    /// </summary>
    public int ClockSkewMinutes { get; set; } = 5;
}
