namespace Farutech.IAM.Application.Configuration;

/// <summary>
/// Configuration options for Public ID generation and encryption
/// </summary>
public class PublicIdOptions
{
    /// <summary>
    /// Secret key for encryption (must be 32 bytes for AES-256)
    /// </summary>
    public string SecretKey { get; set; } = string.Empty;

    /// <summary>
    /// Encryption algorithm (default: AES-256-GCM)
    /// </summary>
    public string Algorithm { get; set; } = "AES-256-GCM";

    /// <summary>
    /// Token expiration in minutes (0 = no expiration)
    /// </summary>
    public int TokenExpirationMinutes { get; set; } = 0;

    /// <summary>
    /// Enable caching of mappings in Redis
    /// </summary>
    public bool EnableCaching { get; set; } = true;

    /// <summary>
    /// Cache expiration in minutes
    /// </summary>
    public int CacheExpirationMinutes { get; set; } = 60;
}
