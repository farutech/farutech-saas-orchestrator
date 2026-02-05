using System.Threading.Tasks;
using Farutech.Orchestrator.Domain.Entities.Tasks;
using Farutech.Orchestrator.Domain.Enums;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Service for tracking async task status and progress
/// </summary>
public interface ITaskTrackerService
{
    Task<ProvisionTask> CreateTaskAsync(string taskId, ProvisionTaskType taskType, string tenantInstanceId);
    Task<ProvisionTask?> GetTaskAsync(string taskId);
    Task UpdateTaskStatusAsync(string taskId, ProvisionTaskStatus status, int progress = 0, string? currentStep = null, string? errorMessage = null);
    Task AddCompletedStepAsync(string taskId, string step);
    Task MarkTaskCompletedAsync(string taskId);
    Task MarkTaskFailedAsync(string taskId, string errorMessage);
    Task<bool> CanRetryTaskAsync(string taskId);
    Task<ProvisionTask?> RetryTaskAsync(string taskId);
}