using System.ComponentModel.DataAnnotations;

namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Request to initiate password reset
/// </summary>
public class ForgotPasswordRequest
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;
}

/// <summary>
/// Response after forgot password request
/// </summary>
public class ForgotPasswordResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = "If your email is registered, you will receive a password reset link.";
}

/// <summary>
/// Request to reset password with token
/// </summary>
public class ResetPasswordRequest
{
    [Required(ErrorMessage = "Token is required")]
    public string Token { get; set; } = string.Empty;

    [Required(ErrorMessage = "New password is required")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
    public string NewPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password confirmation is required")]
    [Compare(nameof(NewPassword), ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

/// <summary>
/// Response after password reset
/// </summary>
public class ResetPasswordResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// Request to change password (authenticated user)
/// </summary>
public class ChangePasswordRequest
{
    [Required(ErrorMessage = "Current password is required")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "New password is required")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
    public string NewPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password confirmation is required")]
    [Compare(nameof(NewPassword), ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

/// <summary>
/// Response after changing password
/// </summary>
public class ChangePasswordResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}