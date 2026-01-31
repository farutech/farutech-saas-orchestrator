using Microsoft.AspNetCore.Identity;

namespace Farutech.Orchestrator.Domain.Entities.Identity;

/// <summary>
/// Tabla de unión Many-to-Many entre Roles y Permisos
/// </summary>
public class RolePermission
{
    public Guid RoleId { get; set; }
    public ApplicationRole Role { get; set; } = null!;

    public Guid PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;

    /// <summary>
    /// Fecha en que se asignó el permiso al rol
    /// </summary>
    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Usuario que realizó la asignación (para auditoría)
    /// </summary>
    public string? GrantedBy { get; set; }
}
