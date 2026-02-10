using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Application.DTOs;
using System.Security.Claims;

namespace Farutech.IAM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[EnableRateLimiting("Global")]
public class SecurityController : ControllerBase
{
    private readonly IDeviceManagementService _deviceManagement;
    private readonly ISecurityAuditService _securityAudit;
    private readonly ISessionManagementService _sessionManagement;
    private readonly IPublicIdService _publicIdService;
    private readonly ILogger<SecurityController> _logger;

    public SecurityController(
        IDeviceManagementService deviceManagement,
        ISecurityAuditService securityAudit,
        ISessionManagementService sessionManagement,
        IPublicIdService publicIdService,
        ILogger<SecurityController> logger)
    {
        _deviceManagement = deviceManagement;
        _securityAudit = securityAudit;
        _sessionManagement = sessionManagement;
        _publicIdService = publicIdService;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user context");
        }
        return userId;
    }

    /// <summary>
    /// Get all devices for the authenticated user
    /// </summary>
    [HttpGet("devices")]
    [ProducesResponseType(typeof(List<UserDeviceDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDevices()
    {
        try
        {
            var userId = GetUserId();
            var devices = await _deviceManagement.GetUserDevicesAsync(userId);

            return Ok(devices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting devices");
            return StatusCode(500, new { message = "Error retrieving devices" });
        }
    }

    /// <summary>
    /// Trust a specific device
    /// </summary>
    [HttpPost("devices/{publicDeviceId}/trust")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> TrustDevice(string publicDeviceId)
    {
        try
        {
            var userId = GetUserId();
            var deviceId = _publicIdService.FromPublicId(publicDeviceId);
            
            if (!deviceId.HasValue)
                return BadRequest(new { message = "Invalid device identifier" });

            await _deviceManagement.TrustDeviceAsync(userId, deviceId.Value);

            return Ok(new { message = "Device trusted successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error trusting device");
            return StatusCode(500, new { message = "Error trusting device" });
        }
    }

    /// <summary>
    /// Block a specific device
    /// </summary>
    [HttpPost("devices/{publicDeviceId}/block")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> BlockDevice(string publicDeviceId)
    {
        try
        {
            var userId = GetUserId();
            var deviceId = _publicIdService.FromPublicId(publicDeviceId);
            
            if (!deviceId.HasValue)
                return BadRequest(new { message = "Invalid device identifier" });

            await _deviceManagement.BlockDeviceAsync(userId, deviceId.Value);

            return Ok(new { message = "Device blocked successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error blocking device");
            return StatusCode(500, new { message = "Error blocking device" });
        }
    }

    /// <summary>
    /// Remove a device (delete)
    /// </summary>
    [HttpDelete("devices/{publicDeviceId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveDevice(string publicDeviceId)
    {
        try
        {
            var userId = GetUserId();
            var deviceId = _publicIdService.FromPublicId(publicDeviceId);
            
            if (!deviceId.HasValue)
                return BadRequest(new { message = "Invalid device identifier" });

            await _deviceManagement.RemoveDeviceAsync(userId, deviceId.Value);

            return Ok(new { message = "Device removed successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing device");
            return StatusCode(500, new { message = "Error removing device" });
        }
    }

    /// <summary>
    /// Get security events for the authenticated user
    /// </summary>
    [HttpGet("events")]
    [ProducesResponseType(typeof(List<SecurityEventDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSecurityEvents(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var userId = GetUserId();
            var publicUserId = _publicIdService.ToPublicId(userId, "User");

            var events = await _securityAudit.GetUserEventsAsync(publicUserId, page, pageSize);

            return Ok(events);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting security events");
            return StatusCode(500, new { message = "Error retrieving security events" });
        }
    }

    /// <summary>
    /// Get active sessions for the authenticated user
    /// </summary>
    [HttpGet("sessions")]
    [ProducesResponseType(typeof(List<SessionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActiveSessions()
    {
        try
        {
            var userId = GetUserId();
            var sessions = await _sessionManagement.GetUserActiveSessionsAsync(userId);

            var sessionDtos = sessions.Select(s => new SessionDto
            {
                PublicSessionId = _publicIdService.ToPublicId(s.Id, "Session"),
                DeviceId = s.DeviceId ?? "unknown",
                IpAddress = s.IpAddress ?? "unknown",
                UserAgent = s.UserAgent ?? "unknown",
                CreatedAt = s.CreatedAt,
                LastActivityAt = s.LastActivityAt,
                ExpiresAt = s.ExpiresAt
            }).ToList();

            return Ok(sessionDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting active sessions");
            return StatusCode(500, new { message = "Error retrieving sessions" });
        }
    }

    /// <summary>
    /// Revoke a specific session
    /// </summary>
    [HttpPost("sessions/{publicSessionId}/revoke")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RevokeSession(string publicSessionId)
    {
        try
        {
            var userId = GetUserId();
            var sessionId = _publicIdService.FromPublicId(publicSessionId);
            
            if (!sessionId.HasValue)
                return BadRequest(new { message = "Invalid session identifier" });

            // Verify session belongs to user
            var sessions = await _sessionManagement.GetUserActiveSessionsAsync(userId);
            if (!sessions.Any(s => s.Id == sessionId.Value))
            {
                return NotFound(new { message = "Session not found" });
            }

            await _sessionManagement.RevokeSessionAsync(sessionId.Value, "Manually revoked by user");

            return Ok(new { message = "Session revoked successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revoking session");
            return StatusCode(500, new { message = "Error revoking session" });
        }
    }

    /// <summary>
    /// Revoke all sessions except the current one
    /// </summary>
    [HttpPost("sessions/revoke-others")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> RevokeOtherSessions()
    {
        try
        {
            var userId = GetUserId();
            var currentSessionId = User.FindFirst("session_id")?.Value;

            var sessions = await _sessionManagement.GetUserActiveSessionsAsync(userId);
            
            int revokedCount = 0;
            foreach (var session in sessions)
            {
                if (currentSessionId == null || session.SessionToken != currentSessionId)
                {
                    await _sessionManagement.RevokeSessionAsync(session.Id, "Revoked by user from another session");
                    revokedCount++;
                }
            }

            return Ok(new { message = $"{revokedCount} session(s) revoked successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revoking other sessions");
            return StatusCode(500, new { message = "Error revoking sessions" });
        }
    }
}

/// <summary>
/// DTO for session display
/// </summary>
public class SessionDto
{
    public string PublicSessionId { get; set; } = string.Empty;
    public string DeviceId { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime LastActivityAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}
