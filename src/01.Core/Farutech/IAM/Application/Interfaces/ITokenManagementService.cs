using Farutech.IAM.Domain.Entities;

namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Service responsible for JWT token generation, validation, and management
/// </summary>
public interface ITokenManagementService
{
    /// <summary>
    /// Generate an access token (JWT) with user, tenant, and permissions claims
    /// </summary>
    /// <param name="user">The authenticated user</param>
    /// <param name="tenant">The selected tenant context</param>
    /// <param name="membership">The user's membership with role and permissions</param>
    /// <param name="session">Optional session for session_id claim</param>
    /// <param name="deviceId">Optional device ID for device tracking</param>
    /// <returns>JWT access token string</returns>
    Task<string> GenerateAccessTokenAsync(User user, Tenant tenant, TenantMembership membership, Session? session = null, string? deviceId = null);

    /// <summary>
    /// Generate a refresh token string
    /// </summary>
    /// <returns>Cryptographically secure random token string</returns>
    string GenerateRefreshToken();

    /// <summary>
    /// Validate an access token and return its principal
    /// </summary>
    /// <param name="token">JWT token string</param>
    /// <returns>ClaimsPrincipal if valid, null if invalid</returns>
    Task<System.Security.Claims.ClaimsPrincipal?> ValidateAccessTokenAsync(string token);

    /// <summary>
    /// Extract user ID from token without full validation (for refresh scenarios)
    /// </summary>
    /// <param name="token">JWT token string</param>
    /// <returns>User ID if token is parseable, null otherwise</returns>
    Guid? GetUserIdFromToken(string token);

    /// <summary>
    /// Extract tenant ID from token without full validation
    /// </summary>
    /// <param name="token">JWT token string</param>
    /// <returns>Tenant ID if token is parseable, null otherwise</returns>
    Guid? GetTenantIdFromToken(string token);
}
