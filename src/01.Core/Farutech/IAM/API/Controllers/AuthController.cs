using Farutech.IAM.Application.DTOs;
using Farutech.IAM.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Farutech.IAM.API.Controllers;

/// <summary>
/// Authentication controller for login, context selection, and logout operations
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
    /// Authenticate user with email and password
    /// </summary>
    /// <param name="request">Login request with credentials</param>
    /// <returns>Login response with available contexts or tokens</returns>
    /// <response code="200">Authentication successful</response>
    /// <response code="400">Invalid request</response>
    /// <response code="401">Invalid credentials</response>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Get IP address from request
        request.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        request.UserAgent = Request.Headers["User-Agent"].ToString();

        var result = await _authService.LoginAsync(request);

        if (!result.Success)
        {
            _logger.LogWarning("Login failed for {Email}: {ErrorCode}", request.Email, result.ErrorCode);

            return result.ErrorCode switch
            {
                "USER_INACTIVE" => StatusCode(StatusCodes.Status403Forbidden, new { error = result.ErrorCode, message = result.ErrorMessage }),
                "ACCOUNT_LOCKED" => StatusCode(StatusCodes.Status423Locked, new { error = result.ErrorCode, message = result.ErrorMessage }),
                _ => Unauthorized(new { error = result.ErrorCode, message = result.ErrorMessage })
            };
        }

        return Ok(result.Data);
    }

    /// <summary>
    /// Select tenant context for authenticated user
    /// </summary>
    /// <param name="request">Context selection request</param>
    /// <returns>Context response with access and refresh tokens</returns>
    /// <response code="200">Context selected successfully</response>
    /// <response code="400">Invalid request</response>
    /// <response code="404">Context not found or not accessible</response>
    [HttpPost("select-context")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(SelectContextResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SelectContext([FromBody] SelectContextRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // Get IP address from request
            request.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            request.UserAgent = Request.Headers["User-Agent"].ToString();

            var response = await _authService.SelectContextAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Context selection failed for user {UserId}", request.UserId);
            return NotFound(new { error = "CONTEXT_NOT_FOUND", message = "Contexto no encontrado o no accesible" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error selecting context for user {UserId}", request.UserId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { error = "INTERNAL_ERROR", message = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Logout and revoke session(s)
    /// </summary>
    /// <param name="sessionId">Optional session ID to revoke specific session, if not provided all sessions are revoked</param>
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
    /// Validate credentials without logging in
    /// </summary>
    /// <param name="email">User email</param>
    /// <param name="password">User password</param>
    /// <returns>Validation result</returns>
    /// <response code="200">Credentials are valid</response>
    /// <response code="401">Invalid credentials</response>
    [HttpPost("validate")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ValidateCredentials([FromBody] ValidateCredentialsRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var isValid = await _authService.ValidateCredentialsAsync(request.Email, request.Password);

        if (!isValid)
        {
            return Unauthorized(new { error = "INVALID_CREDENTIALS", message = "Credenciales inválidas" });
        }

        return Ok(new { valid = true, message = "Credenciales válidas" });
    }

    /// <summary>
    /// Get current user information from token
    /// </summary>
    /// <returns>Current user information</returns>
    /// <response code="200">User information retrieved</response>
    /// <response code="401">Unauthorized</response>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult GetCurrentUser()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();

        var userInfo = new
        {
            userId = User.FindFirst("user_id")?.Value,
            email = User.FindFirst("email")?.Value,
            fullName = User.FindFirst("full_name")?.Value,
            tenantId = User.FindFirst("tenant_id")?.Value,
            tenantCode = User.FindFirst("tenant_code")?.Value,
            tenantName = User.FindFirst("tenant_name")?.Value,
            roleName = User.FindFirst("role_name")?.Value,
            permissions = User.FindAll("permission").Select(c => c.Value).ToList(),
            claims = claims
        };

        return Ok(userInfo);
    }
}

/// <summary>
/// Request for credential validation
/// </summary>
public class ValidateCredentialsRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
