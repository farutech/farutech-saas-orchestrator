using System;
using System.Collections.Generic;
using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Domain.Entities.Catalog;

/// <summary>
/// Represents a module within a product (e.g., "Accounting", "Sales")
/// </summary>
public class Module : BaseEntity
{
    public Guid ProductId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsRequired { get; set; } = false; // Si es requerido para que el producto funcione
    public bool IsActive { get; set; } = true;
    
    /// <summary>
    /// Tipo de despliegue: Shared (recursos compartidos) o Dedicated (recursos dedicados)
    /// Los módulos Shared son más económicos pero con límites
    /// Los módulos Dedicated son más caros pero sin límites y con funciones avanzadas
    /// </summary>
    public string DeploymentType { get; set; } = "Shared"; // Shared, Dedicated
    
    public string? ApiEndpoint { get; set; }
    public string? ProvisioningConfig { get; set; } // JSON config
    
    // Navigation
    public Product Product { get; set; } = null!;
    public ICollection<Feature> Features { get; set; } = [];
}
