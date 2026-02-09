namespace Farutech.IAM.Application.Configuration;

/// <summary>
/// Configuration options for Redis caching
/// </summary>
public class RedisOptions
{
    public const string SectionName = "RedisOptions";

    /// <summary>
    /// Redis connection string
    /// </summary>
    public string ConnectionString { get; set; } = "localhost:6379";

    /// <summary>
    /// Instance name prefix for keys
    /// </summary>
    public string InstanceName { get; set; } = "iam:";

    /// <summary>
    /// Default cache expiration in minutes
    /// </summary>
    public int DefaultExpirationMinutes { get; set; } = 60;

    /// <summary>
    /// Token cache expiration in minutes (should match JWT expiration)
    /// </summary>
    public int TokenExpirationMinutes { get; set; } = 480;

    /// <summary>
    /// Permissions cache expiration in minutes
    /// </summary>
    public int PermissionsExpirationMinutes { get; set; } = 30;

    /// <summary>
    /// Whether to enable Redis caching (can be disabled for development)
    /// </summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// Connection timeout in milliseconds
    /// </summary>
    public int ConnectTimeout { get; set; } = 5000;

    /// <summary>
    /// Sync timeout in milliseconds
    /// </summary>
    public int SyncTimeout { get; set; } = 5000;
}
