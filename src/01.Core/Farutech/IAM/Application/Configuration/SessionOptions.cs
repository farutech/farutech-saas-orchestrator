namespace Farutech.IAM.Application.Configuration;

/// <summary>
/// Advanced session management configuration
/// </summary>
public class SessionOptions
{
    // Session Types
    /// <summary>
    /// Normal session duration in seconds (default: 1 hour)
    /// </summary>
    public int NormalSessionSeconds { get; set; } = 3600;

    /// <summary>
    /// Extended session duration in seconds (default: 24 hours)
    /// </summary>
    public int ExtendedSessionSeconds { get; set; } = 86400;

    /// <summary>
    /// Admin session duration in seconds (default: 8 hours)
    /// </summary>
    public int AdminSessionSeconds { get; set; } = 28800;

    // Device Control
    /// <summary>
    /// Maximum devices allowed per user
    /// </summary>
    public int MaxDevicesPerUser { get; set; } = 5;

    /// <summary>
    /// Force only one active session per user
    /// </summary>
    public bool ForceSingleSession { get; set; } = false;

    /// <summary>
    /// Inactivity timeout in seconds (0 = disabled)
    /// </summary>
    public int InactivityTimeoutSeconds { get; set; } = 1800; // 30 minutes

    // Security Policies
    /// <summary>
    /// Require IP address validation for sessions
    /// </summary>
    public bool RequireIpValidation { get; set; } = true;

    /// <summary>
    /// Require User-Agent validation for sessions
    /// </summary>
    public bool RequireUserAgentValidation { get; set; } = true;

    /// <summary>
    /// Send alert email when new device is detected
    /// </summary>
    public bool AlertOnNewDevice { get; set; } = true;

    /// <summary>
    /// Maximum concurrent sessions per user
    /// </summary>
    public int MaxConcurrentSessions { get; set; } = 3;
}
