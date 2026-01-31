using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Domain.Entities.Identity;

/// <summary>
/// Representa un rol en el sistema RBAC.
/// Ejemplos: "SuperAdmin", "Gerente", "Cajero", "Vendedor", "Auditor"
/// </summary>
public class Role : BaseEntity
{
    /// <summary>
    /// Código único del rol
    /// Ejemplos: "super_admin", "store_manager", "cashier", "salesperson"
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Nombre descriptivo del rol
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Descripción del rol y sus responsabilidades
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Nivel jerárquico del rol (1 = más alto, ej: SuperAdmin)
    /// Usado para validaciones de seguridad (no puedes editar roles superiores)
    /// </summary>
    public int Level { get; set; }

    /// <summary>
    /// Si es un rol del sistema (no puede eliminarse)
    /// </summary>
    public bool IsSystemRole { get; set; }

    /// <summary>
    /// Si está activo
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Alcance del rol (Global, Tenant, Warehouse)
    /// </summary>
    public string Scope { get; set; } = "Tenant"; // Global, Tenant, Warehouse, User

    /// <summary>
    /// Permisos asignados a este rol (Many-to-Many)
    /// </summary>
    public ICollection<RolePermission> RolePermissions { get; set; } = [];

    /// <summary>
    /// Usuarios que tienen este rol (Many-to-Many)
    /// </summary>
    public ICollection<UserRole> UserRoles { get; set; } = [];
}
