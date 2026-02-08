using Farutech.Orchestrator.Application.DTOs.Workers;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Implementación del servicio de monitoreo de workers
/// </summary>
public class WorkerMonitoringService(OrchestratorDbContext context) : IWorkerMonitoringService
{
    private readonly OrchestratorDbContext _context = context;

    public Task<QueueStatusDto?> GetQueueStatusAsync(Guid appId)
    {
        var instance = _context.TenantInstances.Find(appId);
        if (instance == null) return Task.FromResult<QueueStatusDto?>(null);

        // TODO: Implementar integración con NATS para obtener estado real de colas
        // Por ahora, devolver datos mock

        return Task.FromResult<QueueStatusDto?>(new QueueStatusDto(
            appId,
            instance.Name,
            5, // Pending
            2, // Processing
            1, // Failed
            100, // Completed
            new List<FailedTaskDto>
            {
                new FailedTaskDto("task-123", "provision", "Database timeout", DateTime.UtcNow.AddMinutes(-5), 2)
            }
        ));
    }

    public Task<ServiceResult> RetryFailedTaskAsync(Guid appId, string taskId)
    {
        // TODO: Implementar reintento vía NATS
        return Task.FromResult(ServiceResult.Ok("Tarea reenviada"));
    }

    public Task<WorkerMetricsDto> GetWorkerMetricsAsync()
    {
        // TODO: Implementar métricas reales
        return Task.FromResult(new WorkerMetricsDto(
            3, // Total workers
            2, // Active
            1500, // Total processed
            2.5, // Average time
            DateTime.UtcNow
        ));
    }
}