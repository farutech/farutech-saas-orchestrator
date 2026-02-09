using System.ComponentModel.DataAnnotations;

namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Response after setting up 2FA
/// </summary>
public class Setup2faResponse
{
    public string Secret { get; set; } = string.Empty;
    public string QrCodeUri { get; set; } = string.Empty;
    public string QrCodeBase64 { get; set; } = string.Empty;
    public List<string> BackupCodes { get; set; } = new();
    public string Message { get; set; } = "Scan the QR code with your authenticator app.";
}

/// <summary>
/// Request to verify 2FA setup
/// </summary>
public class Verify2faSetupRequest
{
    [Required(ErrorMessage = "Verification code is required")]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "Code must be 6 digits")]
    public string Code { get; set; } = string.Empty;
}

/// <summary>
/// Response after verifying 2FA setup
/// </summary>
public class Verify2faSetupResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool TwoFactorEnabled { get; set; }
}

/// <summary>
/// Request to verify 2FA during login
/// </summary>
public class Verify2faRequest
{
    [Required(ErrorMessage = "Verification code is required")]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Optional: Use backup code instead of TOTP
    /// </summary>
    public bool IsBackupCode { get; set; } = false;
}

/// <summary>
/// Response after 2FA verification during login
/// </summary>
public class Verify2faResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public string Message { get; set; } = "Two-factor authentication successful.";
}

/// <summary>
/// Request to disable 2FA
/// </summary>
public class Disable2faRequest
{
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Verification code is required")]
    public string Code { get; set; } = string.Empty;
}

/// <summary>
/// Response after disabling 2FA
/// </summary>
public class Disable2faResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool TwoFactorEnabled { get; set; }
}