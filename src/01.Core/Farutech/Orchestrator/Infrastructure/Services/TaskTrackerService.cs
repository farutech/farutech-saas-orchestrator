using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tasks;
using Farutech.Orchestrator.Domain.Enums;
using Farutech.Orchestrator.Infrastructure.Persistence;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Service for tracking async task status and progress
/// </summary>
public class TaskTrackerService(OrchestratorDbContext context) : ITaskTrackerService
{
    private readonly OrchestratorDbContext _context = context;

    public async Task<ProvisionTask> CreateTaskAsync(string taskId, ProvisionTaskType taskType, string tenantInstanceId)
    {
        var task = new ProvisionTask
        {
            TaskId = taskId,
            TaskType = taskType,
            TenantInstanceId = Guid.Parse(tenantInstanceId),
            Status = ProvisionTaskStatus.Queued,
            Progress = 0,
            RetryCount = 0,
            MaxRetries = 3,
            CreatedAt = DateTime.UtcNow,
            EstimatedCompletion = DateTime.UtcNow.AddMinutes(5) // Default 5 minutes
        };

        _context.ProvisionTasks.Add(task);
        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<ProvisionTask?> GetTaskAsync(string taskId)
    {
        return await _context.ProvisionTasks
            .FirstOrDefaultAsync(t => t.TaskId == taskId);
    }

    public async Task UpdateTaskStatusAsync(string taskId, ProvisionTaskStatus status, int progress = 0, string? currentStep = null, string? errorMessage = null)
    {
        var task = await GetTaskAsync(taskId);
        if (task == null) return;

        task.Status = status;
        task.Progress = progress;

        if (currentStep != null)
            task.CurrentStep = currentStep;

        if (errorMessage != null)
            task.ErrorMessage = errorMessage;

        if (status == ProvisionTaskStatus.Processing && task.StartedAt == null)
            task.StartedAt = DateTime.UtcNow;

        if (status == ProvisionTaskStatus.Completed || status == ProvisionTaskStatus.Failed)
            task.CompletedAt = DateTime.UtcNow;

        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task AddCompletedStepAsync(string taskId, string step)
    {
        var task = await GetTaskAsync(taskId);
        if (task == null) return;

        task.AddCompletedStep(step);
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task MarkTaskCompletedAsync(string taskId)
    {
        await UpdateTaskStatusAsync(taskId, ProvisionTaskStatus.Completed, 100, "Task completed successfully");
    }

    public async Task MarkTaskFailedAsync(string taskId, string errorMessage)
    {
        await UpdateTaskStatusAsync(taskId, ProvisionTaskStatus.Failed, 0, null, errorMessage);
    }

    public async Task<bool> CanRetryTaskAsync(string taskId)
    {
        var task = await GetTaskAsync(taskId);
        return task?.CanRetry() ?? false;
    }

    public async Task<ProvisionTask?> RetryTaskAsync(string taskId)
    {
        var task = await GetTaskAsync(taskId);
        if (task == null || !task.CanRetry()) return null;

        task.Status = ProvisionTaskStatus.Queued;
        task.Progress = 0;
        task.CurrentStep = null;
        task.ErrorMessage = null;
        task.RetryCount++;
        task.StartedAt = null;
        task.CompletedAt = null;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return task;
    }
}