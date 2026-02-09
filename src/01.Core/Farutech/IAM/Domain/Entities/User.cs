namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Representa un usuario del sistema IAM (fuente única de identidad)
/// </summary>
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Credenciales
    public string Email { get; set; } = string.Empty;
    public bool EmailConfirmed { get; set; }
    public string? PasswordHash { get; set; } // NULL si usa OAuth2/SAML
    public string? PhoneNumber { get; set; }
    public bool PhoneNumberConfirmed { get; set; }
    
    // Two-Factor Authentication
    public bool TwoFactorEnabled { get; set; }
    public string? TwoFactorSecret { get; set; }
    
    // Lockout
    public bool LockoutEnabled { get; set; } = true;
    public DateTime? LockoutEnd { get; set; }
    public int AccessFailedCount { get; set; }
    
    // Información Personal
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string Locale { get; set; } = "es-PE";
    public string Timezone { get; set; } = "America/Lima";
    
    // Estado
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    
    // External Identity Providers (futuro)
    public string? ExternalProvider { get; set; } // 'google', 'microsoft', 'saml'
    public string? ExternalUserId { get; set; }
    
    // Navigation Properties
    public ICollection<TenantMembership> TenantMemberships { get; set; } = new List<TenantMembership>();
    public ICollection<UserClaim> Claims { get; set; } = new List<UserClaim>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
    
    // Computed Properties
    public string FullName => $"{FirstName} {LastName}".Trim();
    public bool IsLocked => LockoutEnabled && LockoutEnd.HasValue && LockoutEnd.Value > DateTime.UtcNow;
}
