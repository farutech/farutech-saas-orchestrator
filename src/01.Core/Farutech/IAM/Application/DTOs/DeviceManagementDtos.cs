namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// User device information response
/// </summary>
public class UserDeviceDto
{
    public string PublicDeviceId { get; set; } = string.Empty;
    public string DeviceName { get; set; } = string.Empty;
    public string DeviceType { get; set; } = string.Empty;
    public string OperatingSystem { get; set; } = string.Empty;
    public string Browser { get; set; } = string.Empty;
    public string LastIpAddress { get; set; } = string.Empty;
    public string? GeoLocation { get; set; }
    public DateTime FirstSeen { get; set; }
    public DateTime LastSeen { get; set; }
    public bool IsTrusted { get; set; }
    public bool IsBlocked { get; set; }
    public string? BlockReason { get; set; }
    public int TrustScore { get; set; }
    public bool IsCurrentDevice { get; set; }
}

/// <summary>
/// Request to trust a device
/// </summary>
public class TrustDeviceRequest
{
    public string PublicDeviceId { get; set; } = string.Empty;
}

/// <summary>
/// Request to block a device
/// </summary>
public class BlockDeviceRequest
{
    public string PublicDeviceId { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}

/// <summary>
/// Active session information
/// </summary>
public class ActiveSessionDto
{
    public string PublicSessionId { get; set; } = string.Empty;
    public string DeviceName { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public string? GeoLocation { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastActivityAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsCurrentSession { get; set; }
    public string SessionType { get; set; } = string.Empty;
}

/// <summary>
/// Request to revoke a session
/// </summary>
public class RevokeSessionRequest
{
    public string PublicSessionId { get; set; } = string.Empty;
}

/// <summary>
/// Session statistics
/// </summary>
public class SessionStatisticsDto
{
    public int ActiveSessions { get; set; }
    public int TotalDevices { get; set; }
    public int TrustedDevices { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string? LastLoginFrom { get; set; }
}
