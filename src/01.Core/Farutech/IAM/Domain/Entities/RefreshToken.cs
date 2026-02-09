namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Refresh token opaco (almacenado en BD y Redis)
/// </summary>
public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Token { get; set; } = string.Empty; // Token opaco único
    public Guid UserId { get; set; }
    public Guid? TenantId { get; set; }
    
    // Lifecycle
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public string? ReplacedByToken { get; set; } // Para rotation
    
    // Device Tracking
    public string? DeviceId { get; set; }
    public string? UserAgent { get; set; }
    public string? IpAddress { get; set; }
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public Tenant? Tenant { get; set; }
    
    // Computed Properties
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsRevoked => RevokedAt.HasValue;
    public bool IsActive => !IsExpired && !IsRevoked;
}
