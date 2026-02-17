using System.Security.Claims;
using Farutech.Orchestrator.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Farutech.Orchestrator.API.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class UsageTrackingController(
    IUsageTrackingService usageTrackingService,
    ILogger<UsageTrackingController> logger) : ControllerBase
{
    private readonly IUsageTrackingService _usageTrackingService = usageTrackingService;
    private readonly ILogger<UsageTrackingController> _logger = logger;

    [HttpPost("usage-log")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RegisterUsageEvent(
        [FromBody] UsageLogRequest request,
        CancellationToken cancellationToken)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.OrganizationId))
        {
            return BadRequest(new { message = "organizationId is required" });
        }

        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "Token JWT inválido" });
        }

        var action = string.IsNullOrWhiteSpace(request.Action)
            ? UsageActions.View
            : request.Action.Trim().ToUpperInvariant();

        if (!UsageActions.Allowed.Contains(action))
        {
            return BadRequest(new { message = "action must be one of VIEW, ACCESS, SELECT" });
        }

        var timestamp = DateTime.UtcNow;

        await _usageTrackingService.TrackUsageAsync(
            userId,
            request.OrganizationId,
            action,
            timestamp,
            cancellationToken);

        _logger.LogInformation(
            "Usage event registered. UserId={UserId}, OrganizationId={OrganizationId}, Action={Action}",
            userId,
            request.OrganizationId,
            action);

        return Accepted();
    }

    [HttpGet("users/me/most-used")]
    [ProducesResponseType(typeof(List<MostUsedOrganizationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMostUsedOrganizations(
        [FromQuery] int limit = 10,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized(new { message = "Token JWT inválido" });
        }

        var mostUsed = await _usageTrackingService.GetMostUsedAsync(userId, limit, cancellationToken);

        var response = mostUsed
            .Select(x => new MostUsedOrganizationResponse(x.OrganizationId, x.Count, x.LastAccessed))
            .ToList();

        _logger.LogInformation(
            "Most-used organizations requested. UserId={UserId}, Returned={Count}",
            userId,
            response.Count);

        return Ok(response);
    }

    private string? GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
    }
}

public sealed record UsageLogRequest
{
    public required string OrganizationId { get; init; }
    public string Action { get; init; } = UsageActions.View;
}

public sealed record MostUsedOrganizationResponse(string OrganizationId, long Count, DateTime LastAccessed);
