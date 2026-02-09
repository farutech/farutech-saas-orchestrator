using Farutech.IAM.Application.DTOs;

namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Service for user authentication operations
/// </summary>
public interface IAuthenticationService
{
    /// <summary>
    /// Authenticates a user with email and password
    /// </summary>
    Task<AuthenticationResult> LoginAsync(LoginRequest request);
    
    /// <summary>
    /// Selects a tenant context for authenticated user and generates tokens
    /// </summary>
    Task<SelectContextResponse> SelectContextAsync(SelectContextRequest request);
    
    /// <summary>
    /// Validates user credentials
    /// </summary>
    Task<bool> ValidateCredentialsAsync(string email, string password);
    
    /// <summary>
    /// Logs out a user and revokes their session
    /// </summary>
    Task LogoutAsync(Guid userId, Guid? sessionId = null);
}
