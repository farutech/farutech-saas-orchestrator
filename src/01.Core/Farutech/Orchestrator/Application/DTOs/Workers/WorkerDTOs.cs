namespace Farutech.Orchestrator.Application.DTOs.Workers;

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