using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Farutech.Orchestrator.Application.Interfaces;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Health check and metrics controller
/// </summary>
[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(GroupName = "Health")]
public class HealthController(HealthCheckService healthCheckService, IMetricsService metricsService) : ControllerBase
{
    private readonly HealthCheckService _healthCheckService = healthCheckService;
    private readonly IMetricsService _metricsService = metricsService;

    /// <summary>
    /// Basic health check endpoint
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> GetHealth()
    {
        var report = await _healthCheckService.CheckHealthAsync();

        var result = new
        {
            status = report.Status.ToString(),
            timestamp = DateTime.UtcNow,
            duration = report.TotalDuration,
            services = report.Entries.ToDictionary(
                entry => entry.Key,
                entry => new
                {
                    status = entry.Value.Status.ToString(),
                    description = entry.Value.Description,
                    duration = entry.Value.Duration,
                    data = entry.Value.Data
                })
        };

        return report.Status == HealthStatus.Healthy
            ? Ok(result)
            : StatusCode(StatusCodes.Status503ServiceUnavailable, result);
    }

    /// <summary>
    /// Detailed health check with system metrics
    /// </summary>
    [HttpGet("detailed")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDetailedHealth()
    {
        var report = await _healthCheckService.CheckHealthAsync();

        // Get system information
        var systemInfo = new
        {
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
            machineName = Environment.MachineName,
            osVersion = Environment.OSVersion.ToString(),
            processId = Environment.ProcessId,
            processArchitecture = Environment.GetEnvironmentVariable("PROCESSOR_ARCHITECTURE"),
            workingSet = Environment.WorkingSet,
            uptime = DateTime.UtcNow - System.Diagnostics.Process.GetCurrentProcess().StartTime.ToUniversalTime()
        };

        var result = new
        {
            status = report.Status.ToString(),
            timestamp = DateTime.UtcNow,
            duration = report.TotalDuration,
            system = systemInfo,
            services = report.Entries.ToDictionary(
                entry => entry.Key,
                entry => new
                {
                    status = entry.Value.Status.ToString(),
                    description = entry.Value.Description,
                    duration = entry.Value.Duration,
                    data = entry.Value.Data
                })
        };

        return Ok(result);
    }

    /// <summary>
    /// Readiness probe for Kubernetes
    /// </summary>
    [HttpGet("ready")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> GetReadiness()
    {
        var report = await _healthCheckService.CheckHealthAsync();

        // For readiness, we consider the service ready if critical services are healthy
        var criticalServices = new[] { "postgresql", "nats" };
        var criticalHealthy = criticalServices.All(service =>
            report.Entries.TryGetValue(service, out var entry) &&
            entry.Status == HealthStatus.Healthy);

        if (report.Status == HealthStatus.Healthy && criticalHealthy)
        {
            return Ok(new { status = "ready", timestamp = DateTime.UtcNow });
        }

        return StatusCode(StatusCodes.Status503ServiceUnavailable,
            new { status = "not ready", timestamp = DateTime.UtcNow });
    }

    /// <summary>
    /// Liveness probe for Kubernetes
    /// </summary>
    [HttpGet("live")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetLiveness()
    {
        // Liveness is simpler - just check if the application is running
        return Ok(new { status = "alive", timestamp = DateTime.UtcNow });
    }
}