namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Tabla pivot para la relación many-to-many entre Roles y Permissions
/// </summary>
public class RolePermission
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }
    
    // Navigation Properties
    public Role Role { get; set; } = null!;
    public Permission Permission { get; set; } = null!;
}
