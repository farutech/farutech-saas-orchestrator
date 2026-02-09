namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Rol del sistema (RBAC) - puede ser global o específico de un tenant
/// </summary>
public class Role
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Scope
    public Guid? TenantId { get; set; } // NULL = rol global
    public Guid? ApplicationId { get; set; } // NULL = todas las apps
    
    // Flags
    public bool IsSystemRole { get; set; } // No editable por usuarios
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public Tenant? Tenant { get; set; }
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    public ICollection<TenantMembership> Memberships { get; set; } = new List<TenantMembership>();
}
