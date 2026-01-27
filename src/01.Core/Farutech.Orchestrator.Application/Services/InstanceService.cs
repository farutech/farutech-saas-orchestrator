using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Domain.Enums;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Implementación del servicio de gestión de instancias.
/// </summary>
public class InstanceService(
    IInstanceRepository instanceRepository,
    IAuthRepository authRepository) : IInstanceService
{
    private readonly IInstanceRepository _instanceRepository = instanceRepository;
    private readonly IAuthRepository _authRepository = authRepository;

    public async Task<IEnumerable<TenantInstance>> GetAllByCustomerAsync(Guid customerId) 
        => await _instanceRepository.GetAllByCustomerAsync(customerId);

    public async Task<TenantInstance?> GetByIdAsync(Guid instanceId) 
        => await _instanceRepository.GetByIdAsync(instanceId);

    /// <summary>
    /// Actualiza el nombre amigable de una instancia.
    /// Valida que el usuario tenga permisos (Owner/Admin) sobre la organización.
    /// </summary>
    public async Task<InstanceOperationResult> UpdateInstanceAsync(Guid instanceId, Guid userId, string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
        {
            return new InstanceOperationResult(false, "El nombre no puede estar vacío", 400);
        }

        // 1. Obtener la instancia
        var instance = await _instanceRepository.GetByIdAsync(instanceId);
        if (instance == null)
        {
            return new InstanceOperationResult(false, "Instancia no encontrada", 404);
        }

        // 2. Validar permisos del usuario sobre la organización de la instancia
        var membership = await _authRepository.GetUserMembershipAsync(userId, instance.CustomerId);
        if (membership == null || !membership.IsActive)
        {
            return new InstanceOperationResult(false, "No tienes acceso a esta organización", 403);
        }

        // Solo Owner o InstanceAdmin pueden actualizar
        if (membership.Role != FarutechRole.Owner && membership.Role != FarutechRole.InstanceAdmin)
        {
            return new InstanceOperationResult(false, "Solo Owner o Admin pueden actualizar instancias", 403);
        }

        // 3. Actualizar el nombre
        instance.Name = newName;
        await _instanceRepository.UpdateAsync(instance);

        return new InstanceOperationResult(true, "Instancia actualizada correctamente", 200, new
        {
            id = instance.Id,
            name = instance.Name,
            type = instance.ApplicationType,
            code = instance.TenantCode
        });
    }

    /// <summary>
    /// Actualiza el estado de una instancia (activa, suspendida, inactiva).
    /// Valida que el usuario tenga permisos (Owner/Admin) sobre la organización.
    /// </summary>
    public async Task<InstanceOperationResult> UpdateInstanceStatusAsync(Guid instanceId, Guid userId, string status)
    {
        var validStatuses = new[] { "active", "suspended", "inactive" };
        if (!validStatuses.Contains(status.ToLower()))
        {
            return new InstanceOperationResult(false, "Estado inválido. Valores permitidos: active, suspended, inactive", 400);
        }

        // 1. Obtener la instancia
        var instance = await _instanceRepository.GetByIdAsync(instanceId);
        if (instance == null)
        {
            return new InstanceOperationResult(false, "Instancia no encontrada", 404);
        }

        // 2. Validar permisos del usuario sobre la organización de la instancia
        var membership = await _authRepository.GetUserMembershipAsync(userId, instance.CustomerId);
        if (membership == null || !membership.IsActive)
        {
            return new InstanceOperationResult(false, "No tienes acceso a esta organización", 403);
        }

        // Solo Owner o InstanceAdmin pueden cambiar el estado
        if (membership.Role != FarutechRole.Owner && membership.Role != FarutechRole.InstanceAdmin)
        {
            return new InstanceOperationResult(false, "Solo Owner o Admin pueden cambiar el estado de instancias", 403);
        }

        // 3. Actualizar el estado
        instance.Status = status.ToLower();
        await _instanceRepository.UpdateAsync(instance);

        return new InstanceOperationResult(true, $"Estado de instancia actualizado a '{status}'", 200, new
        {
            id = instance.Id,
            name = instance.Name,
            status = instance.Status,
            code = instance.TenantCode
        });
    }
}
