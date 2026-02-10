namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Security event for auditing purposes
/// </summary>
public class SecurityEvent
{
    public Guid Id { get; set; }
    
    /// <summary>
    /// User ID (nullable for anonymous events)
    /// </summary>
    public Guid? UserId { get; set; }
    
    /// <summary>
    /// Anonymized/hashed user identifier for logging
    /// </summary>
    public string? AnonymizedUserId { get; set; }
    
    /// <summary>
    /// Type of security event
    /// </summary>
    public string EventType { get; set; } = string.Empty;
    
    /// <summary>
    /// IP address where event originated
    /// </summary>
    public string IpAddress { get; set; } = string.Empty;
    
    /// <summary>
    /// User agent string
    /// </summary>
    public string? UserAgent { get; set; }
    
    /// <summary>
    /// Device ID (if available)
    /// </summary>
    public Guid? DeviceId { get; set; }
    
    /// <summary>
    /// When the event occurred
    /// </summary>
    public DateTime OccurredAt { get; set; }
    
    /// <summary>
    /// Whether the action was successful
    /// </summary>
    public bool Success { get; set; }
    
    /// <summary>
    /// Additional details about the event (JSON)
    /// </summary>
    public string? Details { get; set; }
    
    /// <summary>
    /// Geographic location (JSON with country, city, coordinates)
    /// </summary>
    public string? GeoLocation { get; set; }
    
    /// <summary>
    /// Risk score for this event (0-100)
    /// </summary>
    public int RiskScore { get; set; }
    
    /// <summary>
    /// Whether this event triggered an alert
    /// </summary>
    public bool AlertTriggered { get; set; }
    
    /// <summary>
    /// Tenant ID (if applicable)
    /// </summary>
    public Guid? TenantId { get; set; }

    // Navigation properties
    public User? User { get; set; }
    public UserDevice? Device { get; set; }
    public Tenant? Tenant { get; set; }
}
