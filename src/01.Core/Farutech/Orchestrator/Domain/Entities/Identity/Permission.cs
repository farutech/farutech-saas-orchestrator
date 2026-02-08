using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Domain.Entities.Identity;

/// <summary>
/// Representa un permiso granular en el sistema RBAC.
/// Ejemplos: "sales.create", "cash_register.open", "reports.view_financial"
/// 
/// Estructura jerárquica:
/// - Módulo (sales, inventory, cash_control)
/// - Recurso (cash_register, items, customers)
/// - Acción (create, read, update, delete, execute)
/// </summary>
public class Permission : BaseEntity
{
    /// <summary>
    /// Código único del permiso. Formato: "modulo.recurso.accion"
    /// Ejemplos: "sales.create", "inventory.items.manage", "reports.financial.view"
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Nombre descriptivo para mostrar en UI
    /// Ejemplo: "Crear Ventas", "Gestionar Inventario"
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Descripción detallada del permiso
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Módulo al que pertenece (para agrupar en UI)
    /// Ejemplos: "Ventas", "Inventario", "Caja", "Reportes"
    /// </summary>
    public string Module { get; set; } = string.Empty;

    /// <summary>
    /// Categoría del permiso para organización
    /// Ejemplos: "CRUD", "Reports", "Administration"
    /// </summary>
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Si es un permiso crítico que requiere auditoría especial
    /// </summary>
    public bool IsCritical { get; set; }

    /// <summary>
    /// Si está activo (para poder desactivar sin eliminar)
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Roles que tienen este permiso (Many-to-Many)
    /// </summary>
    public ICollection<RolePermission> RolePermissions { get; set; } = [];
}
