using Microsoft.AspNetCore.Mvc;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Application.DTOs.Auth;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Controller for service-to-service authentication
/// </summary>
[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(GroupName = "ServiceAuth")]
public class ServiceAuthController(IServiceTokenGenerator serviceTokenGenerator, ILogger<ServiceAuthController> logger) : ControllerBase
{
    private readonly IServiceTokenGenerator _serviceTokenGenerator = serviceTokenGenerator;
    private readonly ILogger<ServiceAuthController> _logger = logger;

    /// <summary>
    /// Generate a JWT token for service authentication
    /// </summary>
    [HttpPost("token")]
    [ProducesResponseType(typeof(ServiceTokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ServiceTokenResponse>> GenerateToken([FromBody] ServiceTokenRequest request)
    {
        try
        {
            _logger.LogInformation("Generating service token for {ServiceId} ({ServiceType})", request.ServiceId, request.ServiceType);

            // Validate request
            if (string.IsNullOrEmpty(request.ServiceId) || string.IsNullOrEmpty(request.ServiceType))
            {
                return BadRequest(new { error = "ServiceId and ServiceType are required" });
            }

            // Default permissions for provisioning workers
            var permissions = request.Permissions ?? new[] { "tasks:read", "tasks:write", "provisioning:execute" };

            var token = await _serviceTokenGenerator.GenerateServiceTokenAsync(
                request.ServiceId, 
                request.ServiceType, 
                permissions);

            var response = new ServiceTokenResponse
            {
                Token = token,
                ServiceId = request.ServiceId,
                ServiceType = request.ServiceType,
                Permissions = permissions,
                ExpiresAt = DateTime.UtcNow.AddHours(24), // 24 hours
                IssuedAt = DateTime.UtcNow
            };

            _logger.LogInformation("Service token generated successfully for {ServiceId}", request.ServiceId);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating service token for {ServiceId}", request.ServiceId);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Validate a service token
    /// </summary>
    [HttpPost("validate")]
    [ProducesResponseType(typeof(ServiceTokenValidationResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ServiceTokenValidationResponse>> ValidateToken([FromBody] ValidateTokenRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest(new { error = "Token is required" });
            }

            var isValid = await _serviceTokenGenerator.ValidateServiceTokenAsync(request.Token);
            var serviceId = await _serviceTokenGenerator.GetServiceIdFromTokenAsync(request.Token);

            var response = new ServiceTokenValidationResponse
            {
                IsValid = isValid,
                ServiceId = serviceId,
                ValidatedAt = DateTime.UtcNow
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating service token");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}