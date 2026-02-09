namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Relación many-to-many entre Users y Tenants con roles
/// </summary>
public class TenantMembership
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Foreign Keys
    public Guid UserId { get; set; }
    public Guid TenantId { get; set; }
    public Guid? RoleId { get; set; }
    
    // Custom Attributes (tenant-specific claims)
    public string CustomAttributes { get; set; } = "{}"; // JSON object
    
    // Estado
    public bool IsActive { get; set; } = true;
    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
    public Guid? GrantedBy { get; set; }
    public DateTime? ExpiresAt { get; set; } // Para membresías temporales
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
    public Role? Role { get; set; }
    public User? GrantedByUser { get; set; }
}
