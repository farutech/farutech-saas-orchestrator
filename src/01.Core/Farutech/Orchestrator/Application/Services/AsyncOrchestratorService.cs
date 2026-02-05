using System;
using System.Threading.Tasks;
using Farutech.Orchestrator.Application.DTOs.Provisioning;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tasks;
using Farutech.Orchestrator.Domain.Enums;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Service for orchestrating async operations with NATS and task tracking
/// </summary>
public class AsyncOrchestratorService(
    IMessageBus messageBus,
    ITaskTrackerService taskTracker,
    IRepository repository) : IAsyncOrchestrator
{
    private readonly IMessageBus _messageBus = messageBus;
    private readonly ITaskTrackerService _taskTracker = taskTracker;
    private readonly IRepository _repository = repository;

    public async Task PublishAsync(string subject, object message)
    {
        await _messageBus.PublishAsync(subject, message);
    }

    public async Task<AsyncTaskResponse> QueueTenantProvisionAsync(Guid tenantInstanceId, ProvisionTenantRequest request, string userId)
    {
        // Generate task ID
        var taskId = Guid.NewGuid().ToString();

        // Get tenant instance
        var tenantInstance = await _repository.GetTenantInstanceByIdAsync(tenantInstanceId);
        if (tenantInstance == null)
            throw new InvalidOperationException("Tenant instance not found");

        // Create task tracking record
        await _taskTracker.CreateTaskAsync(taskId, ProvisionTaskType.TenantProvision, tenantInstanceId.ToString());

        // Create NATS message
        var message = new ProvisioningTaskMessage
        {
            TaskId = taskId,
            TenantId = tenantInstanceId.ToString(),
            TaskType = "provision",
            ModuleId = "all",
            Payload = new Dictionary<string, object>
            {
                ["tenant_code"] = tenantInstance.TenantCode,
                ["customer_id"] = request.CustomerId.ToString(),
                ["deployment_type"] = request.DeploymentType,
                ["subscription_plan_id"] = request.SubscriptionPlanId.ToString(),
                ["custom_features"] = request.CustomFeatures ?? new Dictionary<string, object>(),
                ["user_id"] = userId
            },
            Attempt = 1,
            MaxRetries = 3,
            CreatedAt = DateTime.UtcNow
        };

        // Publish to NATS
        await _messageBus.PublishProvisioningTaskAsync(message);

        // Return response
        return new AsyncTaskResponse
        {
            TaskId = taskId,
            Status = "QUEUED",
            StatusUrl = $"/api/provisioning/tasks/{taskId}/status",
            WebSocketUrl = $"/ws/tasks/{taskId}",
            EstimatedCompletion = DateTime.UtcNow.AddMinutes(5)
        };
    }

    public async Task<AsyncTaskResponse> QueueTenantDeprovisionAsync(Guid tenantInstanceId)
    {
        var taskId = Guid.NewGuid().ToString();

        var tenantInstance = await _repository.GetTenantInstanceByIdAsync(tenantInstanceId);
        if (tenantInstance == null)
            throw new InvalidOperationException("Tenant instance not found");

        await _taskTracker.CreateTaskAsync(taskId, ProvisionTaskType.TenantDeprovision, tenantInstanceId.ToString());

        var message = new ProvisioningTaskMessage
        {
            TaskId = taskId,
            TenantId = tenantInstanceId.ToString(),
            TaskType = "deprovision",
            ModuleId = "all",
            Payload = new Dictionary<string, object>
            {
                ["tenant_code"] = tenantInstance.TenantCode,
                ["reason"] = "user_request"
            },
            Attempt = 1,
            MaxRetries = 3,
            CreatedAt = DateTime.UtcNow
        };

        await _messageBus.PublishProvisioningTaskAsync(message);

        return new AsyncTaskResponse
        {
            TaskId = taskId,
            Status = "QUEUED",
            StatusUrl = $"/api/provisioning/tasks/{taskId}/status",
            WebSocketUrl = $"/ws/tasks/{taskId}",
            EstimatedCompletion = DateTime.UtcNow.AddMinutes(3)
        };
    }

    public async Task<AsyncTaskResponse> QueueFeatureUpdateAsync(Guid tenantInstanceId, Dictionary<string, object> features)
    {
        var taskId = Guid.NewGuid().ToString();

        var tenantInstance = await _repository.GetTenantInstanceByIdAsync(tenantInstanceId);
        if (tenantInstance == null)
            throw new InvalidOperationException("Tenant instance not found");

        await _taskTracker.CreateTaskAsync(taskId, ProvisionTaskType.FeatureUpdate, tenantInstanceId.ToString());

        var message = new ProvisioningTaskMessage
        {
            TaskId = taskId,
            TenantId = tenantInstanceId.ToString(),
            TaskType = "update",
            ModuleId = "all",
            Payload = new Dictionary<string, object>
            {
                ["tenant_code"] = tenantInstance.TenantCode,
                ["features"] = features
            },
            Attempt = 1,
            MaxRetries = 2,
            CreatedAt = DateTime.UtcNow
        };

        await _messageBus.PublishProvisioningTaskAsync(message);

        return new AsyncTaskResponse
        {
            TaskId = taskId,
            Status = "QUEUED",
            StatusUrl = $"/api/provisioning/tasks/{taskId}/status",
            WebSocketUrl = $"/ws/tasks/{taskId}",
            EstimatedCompletion = DateTime.UtcNow.AddMinutes(2)
        };
    }
}