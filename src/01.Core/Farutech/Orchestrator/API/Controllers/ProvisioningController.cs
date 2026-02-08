using Microsoft.AspNetCore.Mvc;
using Farutech.Orchestrator.Application.DTOs.Provisioning;
using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace Farutech.Orchestrator.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[ApiExplorerSettings(GroupName = "Provisioning")]
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

            // Convert relative URLs to absolute
            if (response.Tracking != null)
            {
                response.Tracking.StatusUrl = $"{Request.Scheme}://{Request.Host}{response.Tracking.StatusUrl}";
                if (!string.IsNullOrEmpty(response.Tracking.WebSocketUrl))
                {
                    var wsScheme = Request.Scheme == "https" ? "wss" : "ws";
                    response.Tracking.WebSocketUrl = $"{wsScheme}://{Request.Host}{response.Tracking.WebSocketUrl}";
                }
            }

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
    [ProducesResponseType(typeof(DeprovisionTenantResponse), StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DeprovisionTenantResponse>> DeprovisionTenant(Guid tenantInstanceId)
    {
        try
        {
            _logger.LogInformation("Deprovisioning tenant {TenantInstanceId}", tenantInstanceId);

            var response = await _provisioningService.DeprovisionTenantAsync(tenantInstanceId);

            // Convert relative URLs to absolute
            if (response.Tracking != null)
            {
                response.Tracking.StatusUrl = $"{Request.Scheme}://{Request.Host}{response.Tracking.StatusUrl}";
                if (!string.IsNullOrEmpty(response.Tracking.WebSocketUrl))
                {
                    var wsScheme = Request.Scheme == "https" ? "wss" : "ws";
                    response.Tracking.WebSocketUrl = $"{wsScheme}://{Request.Host}{response.Tracking.WebSocketUrl}";
                }
            }

            return Accepted(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Tenant not found: {TenantInstanceId}", tenantInstanceId);
            return NotFound(new { error = ex.Message });
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
    [ProducesResponseType(typeof(UpdateFeaturesResponse), StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UpdateFeaturesResponse>> UpdateFeatures(
        Guid tenantInstanceId,
        [FromBody] Dictionary<string, object> features)
    {
        try
        {
            _logger.LogInformation("Updating features for tenant {TenantInstanceId}", tenantInstanceId);

            var response = await _provisioningService.UpdateTenantFeaturesAsync(tenantInstanceId, features);

            // Convert relative URLs to absolute
            if (response.Tracking != null)
            {
                response.Tracking.StatusUrl = $"{Request.Scheme}://{Request.Host}{response.Tracking.StatusUrl}";
                if (!string.IsNullOrEmpty(response.Tracking.WebSocketUrl))
                {
                    var wsScheme = Request.Scheme == "https" ? "wss" : "ws";
                    response.Tracking.WebSocketUrl = $"{wsScheme}://{Request.Host}{response.Tracking.WebSocketUrl}";
                }
            }

            return Accepted(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Tenant not found: {TenantInstanceId}", tenantInstanceId);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating tenant features");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Get the status of a provisioning task
    /// </summary>
    [HttpGet("tasks/{taskId}/status")]
    [ProducesResponseType(typeof(TaskStatusResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskStatusResponse>> GetTaskStatus(string taskId)
    {
        try
        {
            _logger.LogInformation("Getting status for task {TaskId}", taskId);

            var response = await _provisioningService.GetTaskStatusAsync(taskId);

            // Convert relative URLs to absolute
            if (response.Tracking != null)
            {
                response.Tracking.StatusUrl = $"{Request.Scheme}://{Request.Host}{response.Tracking.StatusUrl}";
                if (!string.IsNullOrEmpty(response.Tracking.WebSocketUrl))
                {
                    var wsScheme = Request.Scheme == "https" ? "wss" : "ws";
                    response.Tracking.WebSocketUrl = $"{wsScheme}://{Request.Host}{response.Tracking.WebSocketUrl}";
                }
            }

            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Task not found: {TaskId}", taskId);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting task status");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Update task status (worker callback)
    /// </summary>
    [HttpPost("tasks/{taskId}/status")]
    [Authorize(Policy = "ServiceToken")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateTaskStatus(string taskId, [FromBody] UpdateTaskStatusRequest request)
    {
        try
        {
            _logger.LogInformation("Updating status for task {TaskId} to {Status} ({Progress}%)", taskId, request.Status, request.Progress);

            await _provisioningService.UpdateTaskStatusAsync(taskId, request.Status, request.Progress, request.CurrentStep, request.ErrorMessage);

            return Ok(new { message = "Task status updated successfully" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Task not found: {TaskId}", taskId);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task status");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Add completed step to task (worker callback)
    /// </summary>
    [HttpPost("tasks/{taskId}/steps")]
    [Authorize(Policy = "ServiceToken")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddCompletedStep(string taskId, [FromBody] AddCompletedStepRequest request)
    {
        try
        {
            _logger.LogInformation("Adding completed step '{Step}' to task {TaskId}", request.Step, taskId);

            await _provisioningService.AddCompletedStepAsync(taskId, request.Step);

            return Ok(new { message = "Step added successfully" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Task not found: {TaskId}", taskId);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding completed step");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Mark task as completed (worker callback)
    /// </summary>
    [HttpPost("tasks/{taskId}/complete")]
    [Authorize(Policy = "ServiceToken")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkTaskCompleted(string taskId, [FromBody] MarkTaskCompletedRequest? request = null)
    {
        try
        {
            _logger.LogInformation("Marking task {TaskId} as completed", taskId);

            await _provisioningService.MarkTaskCompletedAsync(taskId);

            return Ok(new { message = "Task marked as completed" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Task not found: {TaskId}", taskId);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking task as completed");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Mark task as failed (worker callback)
    /// </summary>
    [HttpPost("tasks/{taskId}/fail")]
    [Authorize(Policy = "ServiceToken")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkTaskFailed(string taskId, [FromBody] MarkTaskFailedRequest request)
    {
        try
        {
            _logger.LogInformation("Marking task {TaskId} as failed: {ErrorMessage}", taskId, request.ErrorMessage);

            await _provisioningService.MarkTaskFailedAsync(taskId, request.ErrorMessage);

            return Ok(new { message = "Task marked as failed" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Task not found: {TaskId}", taskId);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking task as failed");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}
