using System.ComponentModel.DataAnnotations;

namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Request to send email confirmation
/// </summary>
public class SendEmailConfirmationRequest
{
    // UserId extracted from JWT, no body needed
}

/// <summary>
/// Response after sending confirmation email
/// </summary>
public class SendEmailConfirmationResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

/// <summary>
/// Request to confirm email with token
/// </summary>
public class ConfirmEmailRequest
{
    [Required(ErrorMessage = "Token is required")]
    public string Token { get; set; } = string.Empty;
}

/// <summary>
/// Response after confirming email
/// </summary>
public class ConfirmEmailResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool EmailConfirmed { get; set; }
}

/// <summary>
/// Request to cancel an email verification token
/// </summary>
public class CancelEmailTokenRequest
{
    [Required(ErrorMessage = "Token is required")]
    public string Token { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; set; }
}

/// <summary>
/// Response after canceling email token
/// </summary>
public class CancelEmailTokenResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}