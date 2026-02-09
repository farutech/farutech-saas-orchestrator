using Farutech.IAM.Application.DTOs;

namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Service for user authentication operations
/// </summary>
public interface IAuthenticationService
{
    /// <summary>
    /// Registers a new user
    /// </summary>
    Task<RegisterResponse> RegisterAsync(RegisterRequest request);
    
    /// <summary>
    /// Authenticates a user with email and password
    /// </summary>
    Task<AuthenticationResult> LoginAsync(LoginRequest request);
    
    /// <summary>
    /// Selects a tenant context for authenticated user and generates tokens
    /// </summary>
    Task<SelectContextResponse> SelectContextAsync(Guid userId, Guid tenantId, string? deviceId, string? ipAddress, string? userAgent);
    
    /// <summary>
    /// Validates user credentials
    /// </summary>
    Task<bool> ValidateCredentialsAsync(string email, string password);
    
    /// <summary>
    /// Logs out a user and revokes their session
    /// </summary>
    Task LogoutAsync(Guid userId, Guid? sessionId = null);

    /// <summary>
    /// Gets user information by user ID
    /// </summary>
    Task<UserInfoResponse?> GetUserInfoAsync(Guid userId);

    // 🔐 PHASE 3: Email Confirmation
    /// <summary>
    /// Sends email confirmation to user
    /// </summary>
    Task<SendEmailConfirmationResponse> SendEmailConfirmationAsync(Guid userId, string? ipAddress, string? userAgent);

    /// <summary>
    /// Confirms user email with token
    /// </summary>
    Task<ConfirmEmailResponse> ConfirmEmailAsync(string token);

    /// <summary>
    /// Cancels an email verification token
    /// </summary>
    Task<CancelEmailTokenResponse> CancelEmailVerificationTokenAsync(string token, string? email = null);

    // 🔐 PHASE 4: Password Reset
    /// <summary>
    /// Initiates forgot password flow
    /// </summary>
    Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request, string? ipAddress, string? userAgent);

    /// <summary>
    /// Resets password with token
    /// </summary>
    Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request);

    /// <summary>
    /// Changes password for authenticated user
    /// </summary>
    Task<ChangePasswordResponse> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);

    // 🔐 PHASE 5: Two-Factor Authentication
    /// <summary>
    /// Sets up 2FA for user (generates secret, QR code, backup codes)
    /// </summary>
    Task<Setup2faResponse> Setup2faAsync(Guid userId);

    /// <summary>
    /// Verifies 2FA setup code and enables 2FA
    /// </summary>
    Task<Verify2faSetupResponse> Verify2faSetupAsync(Guid userId, Verify2faSetupRequest request);

    /// <summary>
    /// Verifies 2FA code during login
    /// </summary>
    Task<Verify2faResponse> Verify2faAsync(Guid userId, Guid sessionId, Verify2faRequest request, string? deviceId, string? ipAddress, string? userAgent);

    /// <summary>
    /// Disables 2FA for user
    /// </summary>
    Task<Disable2faResponse> Disable2faAsync(Guid userId, Disable2faRequest request);
}
