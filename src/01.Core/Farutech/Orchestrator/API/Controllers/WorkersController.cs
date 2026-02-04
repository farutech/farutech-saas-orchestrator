using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Workers API - Monitoreo y gestión de colas de procesamiento
/// </summary>
[ApiController]
[Route("api/workers")]
[Authorize]
[ApiExplorerSettings(GroupName = "workers")]
public class WorkersController(IWorkerMonitoringService workerService) : ControllerBase
{
    private readonly IWorkerMonitoringService _workerService = workerService;

    /// <summary>
    /// Obtiene el estado de las colas de una aplicación específica
    /// </summary>
    /// <param name="appId">ID de la aplicación</param>
    /// <returns>Estado de las colas de procesamiento</returns>
    [HttpGet("{appId:guid}/queue")]
    [ProducesResponseType(typeof(QueueStatusDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<QueueStatusDto>> GetQueueStatus(Guid appId)
    {
        var status = await _workerService.GetQueueStatusAsync(appId);
        if (status == null)
        {
            return NotFound(new { message = "Aplicación no encontrada" });
        }
        return Ok(status);
    }

    /// <summary>
    /// Reintenta una tarea fallida
    /// </summary>
    /// <param name="appId">ID de la aplicación</param>
    /// <param name="taskId">ID de la tarea</param>
    /// <returns>Resultado de la operación</returns>
    [HttpPost("{appId:guid}/retry/{taskId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RetryTask(Guid appId, string taskId)
    {
        var result = await _workerService.RetryFailedTaskAsync(appId, taskId);
        if (!result.Success)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = "Tarea reenviada para reintento" });
    }

    /// <summary>
    /// Obtiene métricas generales de workers
    /// </summary>
    /// <returns>Métricas de rendimiento</returns>
    [HttpGet("metrics")]
    [ProducesResponseType(typeof(WorkerMetricsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<WorkerMetricsDto>> GetMetrics()
    {
        var metrics = await _workerService.GetWorkerMetricsAsync();
        return Ok(metrics);
    }
}

/// <summary>
/// DTO para estado de cola
/// </summary>
public record QueueStatusDto(
    Guid AppId,
    string AppName,
    int PendingTasks,
    int ProcessingTasks,
    int FailedTasks,
    int CompletedTasks,
    IEnumerable<FailedTaskDto> RecentFailures
);

/// <summary>
/// DTO para tarea fallida
/// </summary>
public record FailedTaskDto(
    string TaskId,
    string TaskType,
    string ErrorMessage,
    DateTime FailedAt,
    int RetryCount
);

/// <summary>
/// DTO para métricas de workers
/// </summary>
public record WorkerMetricsDto(
    int TotalWorkers,
    int ActiveWorkers,
    long TotalProcessedTasks,
    double AverageProcessingTime,
    DateTime LastUpdated
);