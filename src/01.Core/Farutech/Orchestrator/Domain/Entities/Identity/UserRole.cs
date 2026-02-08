namespace Farutech.Orchestrator.Domain.Entities.Identity;

/// <summary>
/// Tabla de unión Many-to-Many entre Usuarios y Roles
/// Incluye contexto de tenant y alcance para multi-tenancy
/// </summary>
public class UserRole
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;

    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;

    /// <summary>
    /// Tenant al que aplica este rol (para multi-tenancy)
    /// Un usuario puede tener diferentes roles en diferentes tenants
    /// </summary>
    public Guid? TenantId { get; set; }

    /// <summary>
    /// Alcance adicional (opcional): ID de bodega, sucursal, etc.
    /// Para roles con scope limitado (ej: Cajero solo en Bodega Norte)
    /// </summary>
    public Guid? ScopeId { get; set; }

    /// <summary>
    /// Tipo de alcance: "Warehouse", "Branch", "Department"
    /// </summary>
    public string? ScopeType { get; set; }

    /// <summary>
    /// Fecha de asignación del rol
    /// </summary>
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Fecha de expiración del rol (opcional)
    /// </summary>
    public DateTime? ExpiresAt { get; set; }

    /// <summary>
    /// Usuario que asignó el rol (para auditoría)
    /// </summary>
    public string? AssignedBy { get; set; }

    /// <summary>
    /// Si la asignación está activa
    /// </summary>
    public bool IsActive { get; set; } = true;
}
