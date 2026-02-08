using System.ComponentModel.DataAnnotations;

namespace Farutech.Orchestrator.Application.DTOs.Catalog;

/// <summary>
/// DTO para el manifest completo de un producto (árbol jerárquico).
/// </summary>
public class ProductManifestDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Módulos con sus features y permisos.
    /// </summary>
    public List<ModuleManifestDto> Modules { get; set; } = [];
    
    /// <summary>
    /// Planes de suscripción disponibles para este producto.
    /// </summary>
    public List<SubscriptionPlanDto> SubscriptionPlans { get; set; } = [];
    
    /// <summary>
    /// Permisos globales asociados al producto.
    /// </summary>
    public List<PermissionDto> Permissions { get; set; } = [];
}

/// <summary>
/// DTO para módulo en el manifest.
/// </summary>
public class ModuleManifestDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Features del módulo con sus permisos.
    /// </summary>
    public List<FeatureManifestDto> Features { get; set; } = [];
}

/// <summary>
/// DTO para feature en el manifest.
/// </summary>
public class FeatureManifestDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool RequiresLicense { get; set; }
    public decimal? AdditionalCost { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Permisos asociados a esta feature.
    /// </summary>
    public List<PermissionDto> Permissions { get; set; } = [];
}

/// <summary>
/// DTO para permiso.
/// </summary>
public class PermissionDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsCritical { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}