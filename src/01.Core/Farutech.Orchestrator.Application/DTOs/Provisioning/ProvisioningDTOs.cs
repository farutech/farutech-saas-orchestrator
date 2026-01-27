using System;

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
    public Dictionary<string, object> Payload { get; set; } = new();
    public int Attempt { get; set; } = 1;
    public int MaxRetries { get; set; } = 5;
    public DateTime CreatedAt { get; set; }
}
