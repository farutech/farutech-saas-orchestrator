using System;
using Farutech.Orchestrator.Domain.Enums;

namespace Farutech.Orchestrator.Application.DTOs.Provisioning;

/// <summary>
/// Request DTO for provisioning a new tenant instance
/// </summary>
public class ProvisionTenantRequest
{
    public Guid CustomerId { get; set; }
    public Guid ProductId { get; set; }
    
    /// <summary>
    /// Tipo de despliegue: "Shared" (compartido, más económico) o "Dedicated" (dedicado, recursos exclusivos)
    /// Similar a hosting compartido vs dedicado
    /// </summary>
    public string DeploymentType { get; set; } = "Shared";
    
    /// <summary>
    /// ID del plan de suscripción seleccionado
    /// Este plan determina qué features están disponibles
    /// </summary>
    public Guid SubscriptionPlanId { get; set; }
    
    /// <summary>
    /// Código único de la instancia definido por el usuario
    /// Debe ser único por organización/cliente
    /// No puede contener espacios ni caracteres especiales
    /// Solo permite letras, números, guiones y guión bajo
    /// </summary>
    public string? Code { get; set; }
    
    /// <summary>
    /// Nombre descriptivo de la instancia definido por el usuario
    /// </summary>
    public string? Name { get; set; }
    
    /// <summary>
    /// Color personalizado del tema para la aplicación
    /// Heredable de la organización
    /// </summary>
    public string? ThemeColor { get; set; }
    
    /// <summary>
    /// Configuraciones personalizadas opcionales
    /// </summary>
    public Dictionary<string, object>? CustomFeatures { get; set; }
}

/// <summary>
/// Response DTO after initiating provisioning
/// </summary>
public class ProvisionTenantResponse
{
    public Guid TenantInstanceId { get; set; }
    public string TenantCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string TaskId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    
    // Async tracking information
    public TaskTrackingInfo? Tracking { get; set; }
}

/// <summary>
/// Task tracking information for async operations
/// </summary>
public class TaskTrackingInfo
{
    public string StatusUrl { get; set; } = string.Empty;
    public string? WebSocketUrl { get; set; }
    public DateTime? EstimatedCompletion { get; set; }
    public int ProgressUpdateFrequency { get; set; } = 5; // seconds
}

/// <summary>
/// Response DTO for deprovision operation
/// </summary>
public class DeprovisionTenantResponse
{
    public Guid TenantInstanceId { get; set; }
    public string TaskId { get; set; } = string.Empty;
    public DateTime InitiatedAt { get; set; }
    public TaskTrackingInfo? Tracking { get; set; }
}

/// <summary>
/// Response DTO for feature update operation
/// </summary>
public class UpdateFeaturesResponse
{
    public Guid TenantInstanceId { get; set; }
    public string TaskId { get; set; } = string.Empty;
    public DateTime InitiatedAt { get; set; }
    public TaskTrackingInfo? Tracking { get; set; }
}

/// <summary>
/// Response DTO for task status query
/// </summary>
public class TaskStatusResponse
{
    public string TaskId { get; set; } = string.Empty;
    public ProvisionTaskType TaskType { get; set; } = ProvisionTaskType.TenantProvision;
    public ProvisionTaskStatus Status { get; set; } = ProvisionTaskStatus.Queued;
    public int Progress { get; set; } = 0; // 0-100
    public string? CurrentStep { get; set; }
    public List<string>? StepsCompleted { get; set; } = new();
    public string? ErrorMessage { get; set; }
    public int RetryCount { get; set; } = 0;
    public int MaxRetries { get; set; } = 3;
    public DateTime CreatedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? EstimatedCompletion { get; set; }
    public string? InitiatedBy { get; set; }
    public string? WorkerId { get; set; }
    public Guid? TenantInstanceId { get; set; }
    public TaskTrackingInfo? Tracking { get; set; }
}

/// <summary>
/// Request DTO for updating task status
/// </summary>
public class UpdateTaskStatusRequest
{
    public ProvisionTaskStatus Status { get; set; } = ProvisionTaskStatus.Queued;
    public int Progress { get; set; } = 0;
    public string? CurrentStep { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime? Timestamp { get; set; }
}

/// <summary>
/// Request DTO for adding completed step
/// </summary>
public class AddCompletedStepRequest
{
    public string Step { get; set; } = string.Empty;
    public DateTime? Timestamp { get; set; }
}

/// <summary>
/// Request DTO for marking task completed
/// </summary>
public class MarkTaskCompletedRequest
{
    public DateTime? CompletedAt { get; set; }
}

/// <summary>
/// Request DTO for marking task failed
/// </summary>
public class MarkTaskFailedRequest
{
    public string ErrorMessage { get; set; } = string.Empty;
    public DateTime? FailedAt { get; set; }
}

/// <summary>
/// Task message to be sent to NATS
/// </summary>
public class ProvisioningTaskMessage
{
    public string TaskId { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
    public string TaskType { get; set; } = string.Empty;
    public string ModuleId { get; set; } = string.Empty;
    public Dictionary<string, object> Payload { get; set; } = [];
    public int Attempt { get; set; } = 1;
    public int MaxRetries { get; set; } = 5;
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Response for async task operations
/// </summary>
public class AsyncTaskResponse
{
    public string TaskId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string StatusUrl { get; set; } = string.Empty;
    public string? WebSocketUrl { get; set; }
    public DateTime? EstimatedCompletion { get; set; }
}
