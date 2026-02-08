using System;
using System.Text.Json;
using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Domain.Entities.Tenants;

/// <summary>
/// Represents a tenant's provisioned instance (e.g., "acme-prod", "acme-test")
/// </summary>
public class TenantInstance : BaseEntity
{
    public Guid CustomerId { get; set; }
    public required string TenantCode { get; set; } // Auto-generated unique code
    
    /// <summary>
    /// Código definido por el usuario (unique per customer)
    /// Solo permite letras, números, guiones y guión bajo
    /// Ejemplos: "SEDE-NORTE", "FAR-001"
    /// </summary>
    public string? Code { get; set; }
    
    public required string Name { get; set; } // e.g. "Sede Norte", "Farmacia Central"
    public string Environment { get; set; } = "production"; // production, staging, development
    public string ApplicationType { get; set; } = "Generic"; // e.g. "Veterinaria", "ERP", "POS"
    
    /// <summary>
    /// Deployment type: Shared (recursos compartidos, más económico) o Dedicated (recursos dedicados, más caro)
    /// Similar a hosting compartido vs dedicado
    /// </summary>
    public string DeploymentType { get; set; } = "Shared"; // Shared, Dedicated
    
    public string Status { get; set; } = "provisioning"; // provisioning, active, suspended, deprovisioned
    public required string ConnectionString { get; set; }
    public string? ApiBaseUrl { get; set; }
    
    /// <summary>
    /// JSONB field storing active features with overrides
    /// Example: { "feature_advanced_reports": true, "feature_user_limit": 100 }
    /// </summary>
    public string ActiveFeaturesJson { get; set; } = "{}";
    
    public DateTime? ProvisionedAt { get; set; }
    public DateTime? LastAccessAt { get; set; }
    
    /// <summary>
    /// Color personalizado del tema para la aplicación
    /// Heredable de la organización
    /// </summary>
    public string? ThemeColor { get; set; }
    
    /// <summary>
    /// ID de la instancia de base de datos dedicada (nullable para shared)
    /// </summary>
    public Guid? DatabaseInstanceId { get; set; }
    
    // Navigation
    public Customer Customer { get; set; } = null!;

    // Helper methods
    public Dictionary<string, object> GetActiveFeatures()
        => JsonSerializer.Deserialize<Dictionary<string, object>>(ActiveFeaturesJson)
               ?? [];

    public void SetActiveFeatures(Dictionary<string, object> features)
        => ActiveFeaturesJson = JsonSerializer.Serialize(features);
}
