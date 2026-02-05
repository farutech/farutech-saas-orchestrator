using System;
using System.Text.Json;
using Farutech.Orchestrator.Domain.Common;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Domain.Enums;

namespace Farutech.Orchestrator.Domain.Entities.Tasks;

/// <summary>
/// Represents an asynchronous provisioning task
/// </summary>
public class ProvisionTask : BaseEntity
{
    public string TaskId { get; set; } = string.Empty; // ULID or GUID
    public Guid TenantInstanceId { get; set; }
    public ProvisionTaskType TaskType { get; set; } = ProvisionTaskType.TenantProvision;
    public ProvisionTaskStatus Status { get; set; } = ProvisionTaskStatus.Queued;
    public int Progress { get; set; } = 0; // 0-100
    public string? CurrentStep { get; set; }
    public string? StepsCompletedJson { get; set; } = "[]"; // JSON array of completed steps
    public string? ErrorMessage { get; set; }
    public int RetryCount { get; set; } = 0;
    public int MaxRetries { get; set; } = 3;
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? EstimatedCompletion { get; set; }
    public string? InitiatedBy { get; set; } // User ID who initiated the task
    public string? WorkerId { get; set; } // Worker that processed the task
    public string? CorrelationId { get; set; } // For tracking related tasks

    // Navigation
    public TenantInstance TenantInstance { get; set; } = null!;

    // Helper methods
    public List<string> GetStepsCompleted()
        => string.IsNullOrEmpty(StepsCompletedJson)
            ? []
            : System.Text.Json.JsonSerializer.Deserialize<List<string>>(StepsCompletedJson) ?? [];

    public void SetStepsCompleted(List<string> steps)
        => StepsCompletedJson = System.Text.Json.JsonSerializer.Serialize(steps);

    public void AddCompletedStep(string step)
    {
        var steps = GetStepsCompleted();
        if (!steps.Contains(step))
        {
            steps.Add(step);
            SetStepsCompleted(steps);
        }
    }

    public bool CanRetry() => Status == ProvisionTaskStatus.Failed && RetryCount < MaxRetries;
    public bool CanCancel() => Status == ProvisionTaskStatus.Queued || Status == ProvisionTaskStatus.Processing;
}