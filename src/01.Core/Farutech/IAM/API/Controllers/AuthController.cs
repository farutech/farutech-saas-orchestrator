using Farutech.IAM.Application.DTOs;
using Farutech.IAM.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Farutech.IAM.API.Controllers;

/// <summary>
/// Authentication controller for registration, login, context selection, and logout
/// </summary>
[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthenticationService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthenticationService authService,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user account
    /// </summary>
    /// <param name="request">Registration request with user details</param>
    /// <returns>Registration confirmation</returns>
    /// <response code="201">User registered successfully</response>
    /// <response code="400">Invalid request or validation errors</response>
    /// <response code="409">User already exists</response>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var response = await _authService.RegisterAsync(request);
            
            _logger.LogInformation("User registered successfully - Email: {Email}, UserId: {UserId}", 
                request.Email, response.PublicUserId);

            return CreatedAtAction(nameof(GetMe), new { }, response);
        }
        catch (InvalidOperationException ex) when (ex.Message == "USER_EXISTS")
        {
            return Conflict(new { error = "USER_EXISTS", message = "El usuario ya existe" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user - Email: {Email}", request.Email);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { error = "INTERNAL_ERROR", message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Authenticate user with email and password
    /// </summary>
    /// <param name="request">Login request with credentials</param>
    /// <returns>Login response with available contexts or tokens</returns>
    /// <response code="200">Authentication successful</response>
    /// <response code="400">Invalid request</response>
    /// <response code="401">Invalid credentials</response>
    /// <response code="403">User account is inactive</response>
    /// <response code="423">Account is locked due to failed attempts</response>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status423Locked)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Get IP address and User-Agent from request context
        request.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        request.UserAgent = Request.Headers["User-Agent"].ToString();

        var result = await _authService.LoginAsync(request);

        if (!result.Success)
        {
            _logger.LogWarning("Login failed for {Email}: {ErrorCode}", request.Email, result.ErrorCode);

            return result.ErrorCode switch
            {
                "USER_INACTIVE" => StatusCode(StatusCodes.Status403Forbidden, 
                    new { error = result.ErrorCode, message = result.ErrorMessage }),
                "ACCOUNT_LOCKED" => StatusCode(StatusCodes.Status423Locked, 
                    new { error = result.ErrorCode, message = result.ErrorMessage }),
                _ => Unauthorized(new { error = result.ErrorCode, message = result.ErrorMessage })
            };
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Select tenant context for authenticated user (uses userId from token)
    /// </summary>
    /// <param name="tenantId">Tenant ID to select</param>
    /// <param name="deviceId">Optional device identifier</param>
    /// <returns>Context response with access and refresh tokens</returns>
    /// <response code="200">Context selected successfully</response>
    /// <response code="400">Invalid request</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">Context not found or not accessible</response>
    [HttpPost("select-context")]
    [Authorize]
    [ProducesResponseType(typeof(SelectContextResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SelectContext(
        [FromBody] Guid tenantId, 
        [FromQuery] string? deviceId = null)
    {
        // Extract userId from JWT token
        var userIdClaim = User.FindFirst("user_id")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { error = "INVALID_TOKEN", message = "Token inválido" });
        }

        try
        {
            // Get IP address and User-Agent from request context
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var userAgent = Request.Headers["User-Agent"].ToString();

            var response = await _authService.SelectContextAsync(userId, tenantId, deviceId, ipAddress, userAgent);
            
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Context selection failed for user {UserId}", userId);
            return NotFound(new { error = "CONTEXT_NOT_FOUND", message = "Contexto no encontrado o no accesible" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error selecting context for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { error = "INTERNAL_ERROR", message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Logout and revoke session(s) (uses userId from token)
    /// </summary>
    /// <param name="sessionId">Optional session ID to revoke specific session</param>
    /// <returns>No content</returns>
    /// <response code="204">Logout successful</response>
    /// <response code="401">Unauthorized</response>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout([FromQuery] Guid? sessionId = null)
    {
        var userIdClaim = User.FindFirst("user_id")?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { error = "INVALID_TOKEN", message = "Token inválido" });
        }

        await _authService.LogoutAsync(userId, sessionId);

        _logger.LogInformation("User logged out - UserId: {UserId}, SessionId: {SessionId}", userId, sessionId);

        return NoContent();
    }

    /// <summary>
    /// Get current user information from token
    /// </summary>
    /// <returns>Current user and context information</returns>
    /// <response code="200">User information retrieved</response>
    /// <response code="401">Unauthorized</response>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(CurrentContextResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult GetMe()
    {
        // Extract information from JWT claims
        var userInfo = new CurrentContextResponse
        {
            PublicUserId = User.FindFirst("public_user_id")?.Value ?? "",
            Email = User.FindFirst("email")?.Value ?? "",
            FullName = User.FindFirst("full_name")?.Value ?? "",
            PublicTenantId = User.FindFirst("public_tenant_id")?.Value ?? "",
            TenantCode = User.FindFirst("tenant_code")?.Value ?? "",
            TenantName = User.FindFirst("tenant_name")?.Value ?? "",
            RoleName = User.FindFirst("role_name")?.Value ?? "",
            Permissions = User.FindAll("permission").Select(c => c.Value).ToList()
        };

        return Ok(userInfo);
    }

    /// <summary>
    /// Confirm user email address using verification token
    /// </summary>
    /// <param name="token">Email verification token</param>
    /// <param name="email">User email address (optional, for validation)</param>
    /// <returns>Confirmation result</returns>
    /// <response code="200">Email confirmed successfully</response>
    /// <response code="400">Invalid or expired token</response>
    [HttpGet("confirm-email")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ConfirmEmailResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ConfirmEmailResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string token, [FromQuery] string? email = null)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return BadRequest(new ConfirmEmailResponse
            {
                Success = false,
                Message = "Token is required",
                EmailConfirmed = false
            });
        }

        try
        {
            var result = await _authService.ConfirmEmailAsync(token);

            if (result.Success)
            {
                _logger.LogInformation("Email confirmed successfully for token: {Token}", token);
                return Ok(result);
            }
            else
            {
                _logger.LogWarning("Email confirmation failed for token: {Token}, Reason: {Message}", token, result.Message);
                return BadRequest(result);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming email for token: {Token}", token);
            return BadRequest(new ConfirmEmailResponse
            {
                Success = false,
                Message = "An error occurred while confirming email",
                EmailConfirmed = false
            });
        }
    }

    /// <summary>
    /// Get detailed user profile information (uses userId from token)
    /// </summary>
    /// <returns>Detailed user profile</returns>
    /// <response code="200">Profile retrieved successfully</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">User not found</response>
    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(typeof(UserInfoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfile()
    {
        var userIdClaim = User.FindFirst("user_id")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { error = "INVALID_TOKEN", message = "Token inválido" });
        }

        var userInfo = await _authService.GetUserInfoAsync(userId);

        if (userInfo == null)
        {
            return NotFound(new { error = "USER_NOT_FOUND", message = "Usuario no encontrado" });
        }

        return Ok(userInfo);
    }

    /// <summary>
    /// Initiate password reset process by sending reset email
    /// </summary>
    /// <param name="request">Email address to send reset link</param>
    /// <returns>Confirmation message</returns>
    /// <response code="200">Reset email sent (always returned for security)</response>
    /// <response code="400">Invalid request</response>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ForgotPasswordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();

            var response = await _authService.ForgotPasswordAsync(request, ipAddress, userAgent);

            _logger.LogInformation("Password reset requested for email: {Email}", request.Email);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing forgot password for {Email}", request.Email);
            return Ok(new ForgotPasswordResponse 
            { 
                Success = true, 
                Message = "If your email is registered, you will receive a password reset link." 
            });
        }
    }

    /// <summary>
    /// Reset password using token from email
    /// </summary>
    /// <param name="request">Reset token and new password</param>
    /// <returns>Password reset result</returns>
    /// <response code="200">Password reset successful</response>
    /// <response code="400">Invalid token or password</response>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ResetPasswordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResetPasswordResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var response = await _authService.ResetPasswordAsync(request);

            if (response.Success)
            {
                _logger.LogInformation("Password reset successfully for token");
                return Ok(response);
            }

            _logger.LogWarning("Password reset failed: {Message}", response.Message);
            return BadRequest(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting password");
            return BadRequest(new ResetPasswordResponse
            {
                Success = false,
                Message = "An error occurred while resetting password"
            });
        }
    }

    /// <summary>
    /// Change password for authenticated user
    /// </summary>
    /// <param name="request">Current and new password</param>
    /// <returns>Password change result</returns>
    /// <response code="200">Password changed successfully</response>
    /// <response code="400">Invalid current password</response>
    /// <response code="401">Unauthorized</response>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(typeof(ChangePasswordResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ChangePasswordResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
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
            var response = await _authService.ChangePasswordAsync(userId, request);

            if (response.Success)
            {
                _logger.LogInformation("Password changed successfully for user: {UserId}", userId);
                return Ok(response);
            }

            _logger.LogWarning("Password change failed for user: {UserId}, Reason: {Message}", userId, response.Message);
            return BadRequest(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password for user: {UserId}", userId);
            return BadRequest(new ChangePasswordResponse
            {
                Success = false,
                Message = "An error occurred while changing password"
            });
        }
    }

    /// <summary>
    /// Resend email confirmation link to authenticated user
    /// </summary>
    /// <returns>Confirmation that email was sent</returns>
    /// <response code="200">Email sent successfully</response>
    /// <response code="400">Email already confirmed or error</response>
    /// <response code="401">Unauthorized</response>
    [HttpPost("resend-confirmation-email")]
    [Authorize]
    [ProducesResponseType(typeof(SendEmailConfirmationResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SendEmailConfirmationResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ResendConfirmationEmail()
    {
        var userIdClaim = User.FindFirst("user_id")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { error = "INVALID_TOKEN", message = "Token inválido" });
        }

        try
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();
            
            var response = await _authService.SendEmailConfirmationAsync(userId, ipAddress, userAgent);

            if (response.Success)
            {
                _logger.LogInformation("Confirmation email resent to user: {UserId}", userId);
                return Ok(response);
            }

            _logger.LogWarning("Failed to resend confirmation email to user: {UserId}, Reason: {Message}", userId, response.Message);
            return BadRequest(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resending confirmation email to user: {UserId}", userId);
            return BadRequest(new SendEmailConfirmationResponse
            {
                Success = false,
                Message = "An error occurred while sending confirmation email"
            });
        }
    }

    /// <summary>
    /// Cancel an email verification token (useful if token was generated by mistake or compromised)
    /// </summary>
    /// <param name="request">Token to cancel and optional email for verification</param>
    /// <returns>Cancellation result</returns>
    /// <response code="200">Token cancelled successfully</response>
    /// <response code="400">Invalid token or already used</response>
    [HttpPost("cancel-email-token")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(CancelEmailTokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(CancelEmailTokenResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CancelEmailToken([FromBody] CancelEmailTokenRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var response = await _authService.CancelEmailVerificationTokenAsync(request.Token, request.Email);

            if (response.Success)
            {
                _logger.LogInformation("Email verification token cancelled: {Token}", request.Token);
                return Ok(response);
            }

            _logger.LogWarning("Failed to cancel email token: {Message}", response.Message);
            return BadRequest(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling email token");
            return BadRequest(new CancelEmailTokenResponse
            {
                Success = false,
                Message = "An error occurred while cancelling token"
            });
        }
    }
}
