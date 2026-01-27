using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Servicio para gestión de permisos RBAC
/// </summary>
public interface IPermissionService
{
    /// <summary>
    /// Verifica si un usuario tiene un permiso específico en un contexto de tenant
    /// </summary>
    /// <param name="userId">ID del usuario</param>
    /// <param name="permissionCode">Código del permiso (ej: "sales.create")</param>
    /// <param name="tenantId">ID del tenant (opcional)</param>
    /// <param name="scopeId">ID del scope (bodega, sucursal, etc.) (opcional)</param>
    /// <returns>True si el usuario tiene el permiso</returns>
    Task<bool> HasPermissionAsync(
        Guid userId, 
        string permissionCode, 
        Guid? tenantId = null, 
        Guid? scopeId = null);

    /// <summary>
    /// Obtiene todos los permisos de un usuario en un tenant
    /// </summary>
    Task<IEnumerable<Permission>> GetUserPermissionsAsync(
        Guid userId, 
        Guid? tenantId = null);

    /// <summary>
    /// Obtiene todos los roles de un usuario en un tenant
    /// </summary>
    Task<IEnumerable<Role>> GetUserRolesAsync(
        Guid userId, 
        Guid? tenantId = null);

    /// <summary>
    /// Asigna un rol a un usuario en un tenant específico
    /// </summary>
    Task<bool> AssignRoleToUserAsync(
        Guid userId, 
        Guid roleId, 
        Guid? tenantId = null, 
        Guid? scopeId = null,
        string? scopeType = null,
        string? assignedBy = null);

    /// <summary>
    /// Remueve un rol de un usuario
    /// </summary>
    Task<bool> RemoveRoleFromUserAsync(
        Guid userId, 
        Guid roleId, 
        Guid? tenantId = null);

    /// <summary>
    /// Obtiene todos los permisos de un rol
    /// </summary>
    Task<IEnumerable<Permission>> GetRolePermissionsAsync(Guid roleId);

    /// <summary>
    /// Asigna un permiso a un rol
    /// </summary>
    Task<bool> AssignPermissionToRoleAsync(
        Guid roleId, 
        Guid permissionId, 
        string? grantedBy = null);

    /// <summary>
    /// Remueve un permiso de un rol
    /// </summary>
    Task<bool> RemovePermissionFromRoleAsync(Guid roleId, Guid permissionId);

    /// <summary>
    /// Verifica si un usuario tiene un rol específico
    /// </summary>
    Task<bool> HasRoleAsync(
        Guid userId, 
        string roleCode, 
        Guid? tenantId = null);

    /// <summary>
    /// Obtiene todos los permisos disponibles en el sistema
    /// </summary>
    Task<IEnumerable<Permission>> GetAllPermissionsAsync();

    /// <summary>
    /// Obtiene todos los roles disponibles en el sistema
    /// </summary>
    Task<IEnumerable<Role>> GetAllRolesAsync();
}
