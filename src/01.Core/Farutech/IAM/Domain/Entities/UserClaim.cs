namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Claims dinámicos por usuario y tenant
/// Ejemplo: department="Sales", cost_center="CC-001"
/// </summary>
public class UserClaim
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid? TenantId { get; set; }
    
    public string ClaimType { get; set; } = string.Empty;
    public string ClaimValue { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public Tenant? Tenant { get; set; }
}
