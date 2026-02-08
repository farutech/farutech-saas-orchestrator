using System.Threading.Tasks;
using Farutech.Orchestrator.Application.DTOs.Provisioning;
using Farutech.Orchestrator.Domain.Enums;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Service for provisioning tenant instances
/// </summary>
public interface IProvisioningService
{
    Task<ProvisionTenantResponse> ProvisionTenantAsync(ProvisionTenantRequest request);
    Task<DeprovisionTenantResponse> DeprovisionTenantAsync(Guid tenantInstanceId);
    Task<UpdateFeaturesResponse> UpdateTenantFeaturesAsync(Guid tenantInstanceId, Dictionary<string, object> features);
    Task<TaskStatusResponse> GetTaskStatusAsync(string taskId);
    
    // Worker callback methods
    Task UpdateTaskStatusAsync(string taskId, ProvisionTaskStatus status, int progress, string? currentStep = null, string? errorMessage = null);
    Task AddCompletedStepAsync(string taskId, string step);
    Task MarkTaskCompletedAsync(string taskId);
    Task MarkTaskFailedAsync(string taskId, string errorMessage);
}
