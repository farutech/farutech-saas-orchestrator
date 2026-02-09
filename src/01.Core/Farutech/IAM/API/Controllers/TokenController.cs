using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Farutech.IAM.API.Controllers;

/// <summary>
/// Token management controller for refresh, revoke, and introspect operations
/// </summary>
[ApiController]
[Route("api/auth/token")]
[Produces("application/json")]
public class TokenController : ControllerBase
{
    private readonly ITokenManagementService _tokenManagement;
    private readonly IIamRepository _repository;
    private readonly ILogger<TokenController> _logger;

    public TokenController(
        ITokenManagementService tokenManagement,
        IIamRepository repository,
        ILogger<TokenController> logger)
    {
        _tokenManagement = tokenManagement;
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Refresh access token using refresh token
    /// </summary>
    /// <param name="request">Refresh token request</param>
    /// <returns>New access and refresh tokens</returns>
    /// <response code="200">Token refreshed successfully</response>
    /// <response code="400">Invalid request</response>
    /// <response code="401">Invalid or expired refresh token</response>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(RefreshTokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // Extract user ID from access token (without full validation since it might be expired)
            var userId = _tokenManagement.GetUserIdFromToken(request.AccessToken);
            if (userId == null)
            {
                _logger.LogWarning("Invalid access token format in refresh request");
                return Unauthorized(new { error = "INVALID_TOKEN", message = "Token inválido" });
            }

            // Find refresh token in database
            var storedToken = await _repository.GetRefreshTokenAsync(request.RefreshToken);

            if (storedToken == null)
            {
                _logger.LogWarning("Refresh token not found - UserId: {UserId}", userId);
                return Unauthorized(new { error = "INVALID_REFRESH_TOKEN", message = "Refresh token inválido" });
            }

            // Validate refresh token
            if (storedToken.UserId != userId.Value)
            {
                _logger.LogWarning("Refresh token user mismatch - TokenUserId: {TokenUserId}, RequestUserId: {UserId}", 
                    storedToken.UserId, userId);
                return Unauthorized(new { error = "INVALID_REFRESH_TOKEN", message = "Refresh token inválido" });
            }

            if (storedToken.RevokedAt.HasValue)
            {
                _logger.LogWarning("Refresh token was revoked - UserId: {UserId}", userId);
                return Unauthorized(new { error = "TOKEN_REVOKED", message = "Token revocado" });
            }

            if (storedToken.ExpiresAt < DateTime.UtcNow)
            {
                _logger.LogWarning("Refresh token expired - UserId: {UserId}", userId);
                return Unauthorized(new { error = "TOKEN_EXPIRED", message = "Token expirado" });
            }

            // Get user and membership data
            var user = await _repository.GetUserByIdAsync(userId.Value);
            if (user == null || !user.IsActive)
            {
                _logger.LogWarning("User not found or inactive - UserId: {UserId}", userId);
                return Unauthorized(new { error = "USER_INACTIVE", message = "Usuario inactivo" });
            }

            var membership = await _repository.GetMembershipAsync(userId.Value, storedToken.TenantId ?? Guid.Empty);
            if (membership == null || !membership.IsActive || storedToken.TenantId == null)
            {
                _logger.LogWarning("Membership not found or inactive - UserId: {UserId}, TenantId: {TenantId}", 
                    userId, storedToken.TenantId);
                return Unauthorized(new { error = "MEMBERSHIP_INACTIVE", message = "Membresía inactiva" });
            }

            // Generate new access token
            var newAccessToken = await _tokenManagement.GenerateAccessTokenAsync(user, membership.Tenant!, membership);

            // Optionally: Rotate refresh token (generate new refresh token and revoke old one)
            var newRefreshTokenValue = _tokenManagement.GenerateRefreshToken();
            
            // Revoke old refresh token
            storedToken.RevokedAt = DateTime.UtcNow;
            await _repository.UpdateRefreshTokenAsync(storedToken);

            // Create new refresh token
            var newRefreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                TenantId = storedToken.TenantId,
                Token = newRefreshTokenValue,
                ExpiresAt = DateTime.UtcNow.AddDays(30), // TODO: Get from configuration
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddRefreshTokenAsync(newRefreshToken);
            await _repository.SaveChangesAsync();

            _logger.LogInformation("Token refreshed successfully - UserId: {UserId}", userId);

            var response = new RefreshTokenResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshTokenValue,
                ExpiresAt = DateTime.UtcNow.AddHours(8) // TODO: Get from configuration
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { error = "INTERNAL_ERROR", message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Revoke a refresh token
    /// </summary>
    /// <param name="request">Revoke token request</param>
    /// <returns>No content</returns>
    /// <response code="204">Token revoked successfully</response>
    /// <response code="400">Invalid request</response>
    /// <response code="401">Unauthorized</response>
    [HttpPost("revoke")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdClaim = User.FindFirst("user_id")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { error = "INVALID_TOKEN", message = "Token inválido" });
        }

        try
        {
            var storedToken = await _repository.GetRefreshTokenAsync(request.RefreshToken);

            if (storedToken == null)
            {
                _logger.LogWarning("Refresh token not found for revocation - UserId: {UserId}", userId);
                return NotFound(new { error = "TOKEN_NOT_FOUND", message = "Token no encontrado" });
            }

            // Verify ownership
            if (storedToken.UserId != userId)
            {
                _logger.LogWarning("Attempted to revoke token of another user - UserId: {UserId}, TokenUserId: {TokenUserId}",
                    userId, storedToken.UserId);
                return Unauthorized(new { error = "UNAUTHORIZED", message = "No autorizado" });
            }

            // Revoke token
            storedToken.RevokedAt = DateTime.UtcNow;
            await _repository.UpdateRefreshTokenAsync(storedToken);
            await _repository.SaveChangesAsync();

            _logger.LogInformation("Refresh token revoked - UserId: {UserId}", userId);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revoking token - UserId: {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { error = "INTERNAL_ERROR", message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Introspect a token to get its information and validity
    /// </summary>
    /// <param name="request">Introspect token request</param>
    /// <returns>Token information</returns>
    /// <response code="200">Token information retrieved</response>
    /// <response code="400">Invalid request</response>
    [HttpPost("introspect")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(TokenIntrospectionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> IntrospectToken([FromBody] IntrospectTokenRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var principal = await _tokenManagement.ValidateAccessTokenAsync(request.Token);

            if (principal == null)
            {
                return Ok(new TokenIntrospectionResponse
                {
                    Active = false
                });
            }

            var response = new TokenIntrospectionResponse
            {
                Active = true,
                UserId = principal.FindFirst("user_id")?.Value,
                Email = principal.FindFirst("email")?.Value,
                Username = principal.FindFirst("username")?.Value,
                TenantId = principal.FindFirst("tenant_id")?.Value,
                TenantCode = principal.FindFirst("tenant_code")?.Value,
                RoleName = principal.FindFirst("role_name")?.Value,
                Permissions = principal.FindAll("permission").Select(c => c.Value).ToList(),
                ExpiresAt = principal.Claims.FirstOrDefault(c => c.Type == "exp")?.Value
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error introspecting token");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { error = "INTERNAL_ERROR", message = "Error interno del servidor" });
        }
    }
}

#region Request/Response Models

/// <summary>
/// Request to refresh access token
/// </summary>
public class RefreshTokenRequest
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}

/// <summary>
/// Response with new tokens after refresh
/// </summary>
public class RefreshTokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

/// <summary>
/// Request to revoke a refresh token
/// </summary>
public class RevokeTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}

/// <summary>
/// Request to introspect a token
/// </summary>
public class IntrospectTokenRequest
{
    public string Token { get; set; } = string.Empty;
}

/// <summary>
/// Response with token introspection information
/// </summary>
public class TokenIntrospectionResponse
{
    public bool Active { get; set; }
    public string? UserId { get; set; }
    public string? Email { get; set; }
    public string? Username { get; set; }
    public string? TenantId { get; set; }
    public string? TenantCode { get; set; }
    public string? RoleName { get; set; }
    public List<string> Permissions { get; set; } = new();
    public string? ExpiresAt { get; set; }
}

#endregion
