namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Regla de política ABAC (Attribute-Based Access Control)
/// Ejemplo: "Aprobar facturas < $10,000 si eres supervisor"
/// </summary>
public class PolicyRule
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Condición JSON
    // Ejemplo: {"user.department": "sales", "resource.amount": {"$lt": 10000}}
    public string Condition { get; set; } = "{}";
    
    // Permisos otorgados si se cumple la condición
    // Ejemplo: ["sales.invoices.approve"]
    public string Permissions { get; set; } = "[]"; // JSON array
    
    // Prioridad (mayor = evaluar primero)
    public int Priority { get; set; }
    
    // Estado
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public Tenant? Tenant { get; set; }
}
