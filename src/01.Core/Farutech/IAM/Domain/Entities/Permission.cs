namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Permiso atómico del sistema (RBAC)
/// </summary>
public class Permission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty; // ej: "catalog.products.create"
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; } // ej: "catalog", "sales", "tenant"
    public Guid? ApplicationId { get; set; } // NULL = permiso global
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
