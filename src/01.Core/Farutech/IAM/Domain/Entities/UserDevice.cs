namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Represents a device used by a user to access the system
/// </summary>
public class UserDevice
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    
    /// <summary>
    /// Unique device identifier (hash of IP + UserAgent + fingerprint)
    /// </summary>
    public string DeviceHash { get; set; } = string.Empty;
    
    /// <summary>
    /// User-friendly device name
    /// </summary>
    public string DeviceName { get; set; } = string.Empty;
    
    /// <summary>
    /// Device type: Mobile, Desktop, Tablet, Other
    /// </summary>
    public string DeviceType { get; set; } = string.Empty;
    
    /// <summary>
    /// Operating system (Windows, macOS, iOS, Android, Linux)
    /// </summary>
    public string OperatingSystem { get; set; } = string.Empty;
    
    /// <summary>
    /// Browser name and version
    /// </summary>
    public string Browser { get; set; } = string.Empty;
    
    /// <summary>
    /// Last known IP address
    /// </summary>
    public string LastIpAddress { get; set; } = string.Empty;
    
    /// <summary>
    /// Geographic location (city, country)
    /// </summary>
    public string? GeoLocation { get; set; }
    
    /// <summary>
    /// First time this device was seen
    /// </summary>
    public DateTime FirstSeen { get; set; }
    
    /// <summary>
    /// Last time this device was used
    /// </summary>
    public DateTime LastSeen { get; set; }
    
    /// <summary>
    /// Whether this device is marked as trusted
    /// </summary>
    public bool IsTrusted { get; set; }
    
    /// <summary>
    /// Whether this device is blocked
    /// </summary>
    public bool IsBlocked { get; set; }
    
    /// <summary>
    /// Reason for blocking (if blocked)
    /// </summary>
    public string? BlockReason { get; set; }
    
    /// <summary>
    /// Trust score (0-100)
    /// </summary>
    public int TrustScore { get; set; }
    
    /// <summary>
    /// Additional device metadata (JSON)
    /// </summary>
    public string? Metadata { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}
