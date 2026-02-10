namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Security event data transfer object
/// </summary>
public class SecurityEventDto
{
    public string PublicEventId { get; set; } = string.Empty;
    public string? PublicUserId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public string? UserAgent { get; set; }
    public string? DeviceId { get; set; }
    public DateTime OccurredAt { get; set; }
    public bool Success { get; set; }
    public string? Details { get; set; }
    public string? GeoLocation { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
}

/// <summary>
/// Security event types
/// </summary>
public static class SecurityEventTypes
{
    public const string LoginSuccess = "LoginSuccess";
    public const string LoginFailure = "LoginFailure";
    public const string Logout = "Logout";
    public const string PasswordChange = "PasswordChange";
    public const string PasswordReset = "PasswordReset";
    public const string EmailVerification = "EmailVerification";
    public const string TwoFactorEnabled = "TwoFactorEnabled";
    public const string TwoFactorDisabled = "TwoFactorDisabled";
    public const string SessionCreated = "SessionCreated";
    public const string SessionExpired = "SessionExpired";
    public const string SessionRevoked = "SessionRevoked";
    public const string NewDeviceDetected = "NewDeviceDetected";
    public const string DeviceTrusted = "DeviceTrusted";
    public const string DeviceBlocked = "DeviceBlocked";
    public const string PermissionGranted = "PermissionGranted";
    public const string PermissionRevoked = "PermissionRevoked";
    public const string SuspiciousActivity = "SuspiciousActivity";
    public const string AccountLocked = "AccountLocked";
    public const string AccountUnlocked = "AccountUnlocked";
}
