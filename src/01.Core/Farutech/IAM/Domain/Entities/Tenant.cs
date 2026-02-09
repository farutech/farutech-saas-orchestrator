namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Representa una organización/empresa en el sistema multi-tenant
/// </summary>
public class Tenant
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty; // ej: "FARU6128"
    public string Name { get; set; } = string.Empty;
    public string? TaxId { get; set; }
    
    // Security Settings
    public bool RequireMfa { get; set; }
    public string? AllowedIpRanges { get; set; } // JSON array: ["192.168.1.0/24"]
    public int SessionTimeoutMinutes { get; set; } = 30;
    public string? PasswordPolicy { get; set; } // JSON object
    
    // Feature Flags
    public string FeatureFlags { get; set; } = "{}"; // JSON object
    
    // Estado
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public ICollection<TenantMembership> Memberships { get; set; } = new List<TenantMembership>();
    public ICollection<Role> CustomRoles { get; set; } = new List<Role>();
    public ICollection<PolicyRule> PolicyRules { get; set; } = new List<PolicyRule>();
}
