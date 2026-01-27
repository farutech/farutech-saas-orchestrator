using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Servicio para gestionar instancias de tenants.
/// </summary>
public interface IInstanceService
{
    /// <summary>
    /// Obtiene todas las instancias de una empresa específica.
    /// </summary>
    Task<IEnumerable<TenantInstance>> GetAllByCustomerAsync(Guid customerId);
    
    /// <summary>
    /// Obtiene una instancia por ID.
    /// </summary>
    Task<TenantInstance?> GetByIdAsync(Guid instanceId);

    /// <summary>
    /// Actualiza el nombre amigable de una instancia.
    /// Valida que el usuario tenga permisos (Owner/Admin) sobre la organización.
    /// </summary>
    Task<InstanceOperationResult> UpdateInstanceAsync(Guid instanceId, Guid userId, string newName);

    /// <summary>
    /// Actualiza el estado de una instancia (activa, suspendida, inactiva).
    /// Valida que el usuario tenga permisos (Owner/Admin) sobre la organización.
    /// </summary>
    Task<InstanceOperationResult> UpdateInstanceStatusAsync(Guid instanceId, Guid userId, string status);
}

/// <summary>
/// Resultado de operaciones sobre instancias.
/// </summary>
public record InstanceOperationResult(
    bool Success,
    string Message,
    int StatusCode = 200,
    object? Instance = null
);
