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
    /// Obtiene el estado actual de las colas de procesamiento de una aplicación específica
    /// </summary>
    /// <param name="appId">ID único de la aplicación (tenant instance)</param>
    /// <returns>Estado detallado de las colas incluyendo tareas pendientes, procesando, fallidas y completadas</returns>
    /// <response code="200">Estado de colas obtenido exitosamente</response>
    /// <response code="404">Aplicación no encontrada</response>
    /// <response code="401">Usuario no autenticado</response>
    /// <response code="403">Usuario no autorizado para acceder a esta aplicación</response>
    [HttpGet("{appId:guid}/queue")]
    [ProducesResponseType(typeof(QueueStatusDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
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
    /// Reintenta ejecutar una tarea que previamente falló
    /// </summary>
    /// <param name="appId">ID único de la aplicación donde se ejecuta la tarea</param>
    /// <param name="taskId">ID único de la tarea fallida a reintentar</param>
    /// <returns>Confirmación de que la tarea fue reenviada para reintento</returns>
    /// <response code="200">Tarea reenviada exitosamente</response>
    /// <response code="400">Tarea no encontrada, ya está procesándose, o no se puede reintentar</response>
    /// <response code="401">Usuario no autenticado</response>
    /// <response code="403">Usuario no autorizado para gestionar tareas de esta aplicación</response>
    [HttpPost("{appId:guid}/retry/{taskId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
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
    /// Obtiene métricas generales de rendimiento de todos los workers del sistema
    /// </summary>
    /// <returns>Métricas agregadas incluyendo número de workers, tareas procesadas y tiempos promedio</returns>
    /// <response code="200">Métricas obtenidas exitosamente</response>
    /// <response code="401">Usuario no autenticado</response>
    /// <response code="403">Usuario no autorizado para ver métricas del sistema</response>
    [HttpGet("metrics")]
    [ProducesResponseType(typeof(WorkerMetricsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
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