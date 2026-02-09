namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Tenant-specific security and authentication settings
/// </summary>
public class TenantSettings
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }

    // Password Policies
    public int PasswordMinLength { get; set; } = 8;
    public bool PasswordRequireUppercase { get; set; } = true;
    public bool PasswordRequireLowercase { get; set; } = true;
    public bool PasswordRequireDigit { get; set; } = true;
    public bool PasswordRequireSpecialChar { get; set; } = false;
    public int? PasswordExpirationDays { get; set; } // NULL = never expires

    // MFA Policies
    public bool MfaRequired { get; set; } = false;
    public int MfaGracePeriodDays { get; set; } = 7;

    // Session Policies
    public int AccessTokenLifetimeMinutes { get; set; } = 480; // 8 hours
    public int RefreshTokenLifetimeDays { get; set; } = 30;
    public int? SessionIdleTimeoutMinutes { get; set; } // NULL = no idle timeout
    public int? MaxConcurrentSessions { get; set; } // NULL = unlimited

    // Authentication Methods
    public bool AllowPasswordAuth { get; set; } = true;
    public bool AllowSocialAuth { get; set; } = false;
    public bool AllowSamlAuth { get; set; } = false;

    // Lockout Policies
    public bool LockoutEnabled { get; set; } = true;
    public int LockoutMaxAttempts { get; set; } = 5;
    public int LockoutDurationMinutes { get; set; } = 30;

    // Email Settings
    public bool RequireEmailVerification { get; set; } = true;
    public int EmailVerificationTokenLifetimeHours { get; set; } = 24;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Tenant? Tenant { get; set; }
}