namespace Farutech.Orchestrator.Application.DTOs.Workers;

/// <summary>
/// Estado actual de las colas de procesamiento de una aplicación
/// </summary>
public record QueueStatusDto(
    /// <summary>ID único de la aplicación</summary>
    Guid AppId,
    /// <summary>Nombre de la aplicación</summary>
    string AppName,
    /// <summary>Número de tareas pendientes en cola</summary>
    int PendingTasks,
    /// <summary>Número de tareas actualmente en procesamiento</summary>
    int ProcessingTasks,
    /// <summary>Número de tareas que fallaron en el último período</summary>
    int FailedTasks,
    /// <summary>Número total de tareas completadas exitosamente</summary>
    int CompletedTasks,
    /// <summary>Lista de las tareas fallidas más recientes para diagnóstico</summary>
    IEnumerable<FailedTaskDto> RecentFailures
);

/// <summary>
/// Información detallada de una tarea que falló durante el procesamiento
/// </summary>
public record FailedTaskDto(
    /// <summary>ID único de la tarea fallida</summary>
    string TaskId,
    /// <summary>Tipo de tarea que se estaba ejecutando (provision, billing, etc.)</summary>
    string TaskType,
    /// <summary>Mensaje de error que causó la falla</summary>
    string ErrorMessage,
    /// <summary>Fecha y hora exacta cuando ocurrió la falla</summary>
    DateTime FailedAt,
    /// <summary>Número de veces que se intentó reejecutar la tarea</summary>
    int RetryCount
);

/// <summary>
/// Métricas agregadas de rendimiento de todos los workers del sistema
/// </summary>
public record WorkerMetricsDto(
    /// <summary>Número total de workers registrados en el sistema</summary>
    int TotalWorkers,
    /// <summary>Número de workers actualmente activos y procesando tareas</summary>
    int ActiveWorkers,
    /// <summary>Número total acumulado de tareas procesadas exitosamente</summary>
    long TotalProcessedTasks,
    /// <summary>Tiempo promedio de procesamiento por tarea en segundos</summary>
    double AverageProcessingTime,
    /// <summary>Fecha y hora de la última actualización de métricas</summary>
    DateTime LastUpdated
);