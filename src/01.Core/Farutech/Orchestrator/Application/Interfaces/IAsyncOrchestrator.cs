using System.Threading.Tasks;
using Farutech.Orchestrator.Application.DTOs.Provisioning;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Service for orchestrating async operations with NATS
/// </summary>
public interface IAsyncOrchestrator
{
    Task PublishAsync(string subject, object message);
    Task<AsyncTaskResponse> QueueTenantProvisionAsync(Guid tenantInstanceId, ProvisionTenantRequest request, string userId);
    Task<AsyncTaskResponse> QueueTenantDeprovisionAsync(Guid tenantInstanceId);
    Task<AsyncTaskResponse> QueueFeatureUpdateAsync(Guid tenantInstanceId, Dictionary<string, object> features);
}