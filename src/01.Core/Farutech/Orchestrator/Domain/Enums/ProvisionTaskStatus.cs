namespace Farutech.Orchestrator.Domain.Enums;

/// <summary>
/// Status of a provisioning task
/// </summary>
public enum ProvisionTaskStatus
{
    /// <summary>
    /// Task is queued and waiting to be processed
    /// </summary>
    Queued,

    /// <summary>
    /// Task is currently being processed
    /// </summary>
    Processing,

    /// <summary>
    /// Task completed successfully
    /// </summary>
    Completed,

    /// <summary>
    /// Task failed
    /// </summary>
    Failed,

    /// <summary>
    /// Task was cancelled
    /// </summary>
    Cancelled
}