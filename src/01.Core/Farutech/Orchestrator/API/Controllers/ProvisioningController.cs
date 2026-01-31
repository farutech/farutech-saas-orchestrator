using Microsoft.AspNetCore.Mvc;
using Farutech.Orchestrator.Application.DTOs.Provisioning;
using Farutech.Orchestrator.Application.Interfaces;

namespace Farutech.Orchestrator.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProvisioningController(IProvisioningService provisioningService,
                                    ILogger<ProvisioningController> logger) : ControllerBase
{
    private readonly IProvisioningService _provisioningService = provisioningService;
    private readonly ILogger<ProvisioningController> _logger = logger;

    /// <summary>
    /// Provision a new tenant instance
    /// </summary>
    [HttpPost("provision")]
    [ProducesResponseType(typeof(ProvisionTenantResponse), StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProvisionTenantResponse>> ProvisionTenant(
        [FromBody] ProvisionTenantRequest request)
    {
        try
        {
            _logger.LogInformation("Provisioning tenant for customer {CustomerId}", request.CustomerId);

            var response = await _provisioningService.ProvisionTenantAsync(request);

            _logger.LogInformation("Tenant provisioning initiated: {TenantCode}", response.TenantCode);

            return Accepted(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid provisioning request");
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error provisioning tenant");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Deprovision a tenant instance
    /// </summary>
    [HttpDelete("{tenantInstanceId}")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeprovisionTenant(Guid tenantInstanceId)
    {
        try
        {
            _logger.LogInformation("Deprovisioning tenant {TenantInstanceId}", tenantInstanceId);

            var result = await _provisioningService.DeprovisionTenantAsync(tenantInstanceId);

            if (!result)
            {
                return NotFound(new { error = "Tenant not found" });
            }

            return Accepted(new { message = "Deprovision initiated", tenantInstanceId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deprovisioning tenant");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Update tenant features
    /// </summary>
    [HttpPut("{tenantInstanceId}/features")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateFeatures(
        Guid tenantInstanceId,
        [FromBody] Dictionary<string, object> features)
    {
        try
        {
            _logger.LogInformation("Updating features for tenant {TenantInstanceId}", tenantInstanceId);

            var result = await _provisioningService.UpdateTenantFeaturesAsync(tenantInstanceId, features);

            if (!result)
            {
                return NotFound(new { error = "Tenant not found" });
            }

            return Accepted(new { message = "Feature update initiated", tenantInstanceId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating tenant features");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}
