namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Sesión activa de usuario (para gestión y logout forzado)
/// </summary>
public class Session
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid? TenantId { get; set; }
    
    public string SessionToken { get; set; } = string.Empty;
    public Guid? RefreshTokenId { get; set; }
    
    // Device Info
    public string? DeviceId { get; set; }
    public string? DeviceName { get; set; }
    public string? UserAgent { get; set; }
    public string? IpAddress { get; set; }
    public string SessionType { get; set; } = "Normal";
    
    // Lifecycle
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastActivityAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public Tenant? Tenant { get; set; }
    public RefreshToken? RefreshToken { get; set; }
    
    // Computed Properties
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsRevoked => RevokedAt.HasValue;
    public bool IsActive => !IsExpired && !IsRevoked;
}
