namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Tenant-specific security policies
/// </summary>
public class TenantSecurityPolicy
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    
    /// <summary>
    /// Maximum concurrent sessions allowed per user
    /// </summary>
    public int MaxConcurrentSessions { get; set; } = 3;
    
    /// <summary>
    /// Maximum devices allowed per user
    /// </summary>
    public int MaxDevicesPerUser { get; set; } = 5;
    
    /// <summary>
    /// Force logout on all sessions when password changes
    /// </summary>
    public bool ForceLogoutOnPasswordChange { get; set; } = true;
    
    /// <summary>
    /// Send notification when new device is detected
    /// </summary>
    public bool NotifyOnNewDevice { get; set; } = true;
    
    /// <summary>
    /// Require re-authentication for sensitive operations
    /// </summary>
    public bool RequireReauthenticationForSensitiveOperations { get; set; } = true;
    
    /// <summary>
    /// Session inactivity timeout in seconds (0 = disabled)
    /// </summary>
    public int SessionInactivityTimeoutSeconds { get; set; } = 1800;
    
    /// <summary>
    /// Allowed countries (ISO codes, empty = all allowed)
    /// </summary>
    public string AllowedCountries { get; set; } = "[]";
    
    /// <summary>
    /// Blocked IP ranges (CIDR notation)
    /// </summary>
    public string BlockedIpRanges { get; set; } = "[]";
    
    /// <summary>
    /// Require 2FA for all users in this tenant
    /// </summary>
    public bool Require2FA { get; set; } = false;
    
    /// <summary>
    /// Minimum password length
    /// </summary>
    public int MinPasswordLength { get; set; } = 8;
    
    /// <summary>
    /// Require password complexity
    /// </summary>
    public bool RequirePasswordComplexity { get; set; } = true;
    
    /// <summary>
    /// Password expiration in days (0 = never)
    /// </summary>
    public int PasswordExpirationDays { get; set; } = 0;
    
    /// <summary>
    /// Number of previous passwords to remember
    /// </summary>
    public int PasswordHistoryCount { get; set; } = 5;
    
    /// <summary>
    /// Lock account after N failed login attempts (0 = disabled)
    /// </summary>
    public int MaxFailedLoginAttempts { get; set; } = 5;
    
    /// <summary>
    /// Account lockout duration in minutes
    /// </summary>
    public int AccountLockoutDurationMinutes { get; set; } = 30;
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public Tenant Tenant { get; set; } = null!;
}
