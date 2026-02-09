namespace Farutech.IAM.Application.Configuration;

/// <summary>
/// Configuration options for NATS messaging
/// </summary>
public class NatsOptions
{
    /// <summary>
    /// Configuration section name
    /// </summary>
    public const string SectionName = "NatsOptions";

    /// <summary>
    /// NATS server URL (e.g., "nats://localhost:4222")
    /// </summary>
    public string Url { get; set; } = "nats://localhost:4222";

    /// <summary>
    /// Enable NATS event publishing
    /// </summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// Connection name for identification
    /// </summary>
    public string ConnectionName { get; set; } = "iam-service";

    /// <summary>
    /// Maximum reconnection attempts
    /// </summary>
    public int MaxReconnectAttempts { get; set; } = 10;

    /// <summary>
    /// Reconnect wait time in milliseconds
    /// </summary>
    public int ReconnectWaitMs { get; set; } = 2000;

    /// <summary>
    /// Connection timeout in milliseconds
    /// </summary>
    public int ConnectionTimeoutMs { get; set; } = 5000;

    /// <summary>
    /// Subject prefix for IAM events
    /// </summary>
    public string SubjectPrefix { get; set; } = "iam.events";
}
