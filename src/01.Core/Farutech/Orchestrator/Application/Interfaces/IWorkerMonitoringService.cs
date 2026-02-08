using Farutech.Orchestrator.Application.DTOs.Workers;

using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Servicio para monitoreo de workers y colas
/// </summary>
public interface IWorkerMonitoringService
{
    /// <summary>
    /// Obtiene el estado de las colas de una aplicación
    /// </summary>
    Task<QueueStatusDto?> GetQueueStatusAsync(Guid appId);

    /// <summary>
    /// Reintenta una tarea fallida
    /// </summary>
    Task<ServiceResult> RetryFailedTaskAsync(Guid appId, string taskId);

    /// <summary>
    /// Obtiene métricas generales de workers
    /// </summary>
    Task<WorkerMetricsDto> GetWorkerMetricsAsync();
}