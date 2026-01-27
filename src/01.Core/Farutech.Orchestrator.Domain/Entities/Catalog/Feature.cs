using System;
using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Domain.Entities.Catalog;

/// <summary>
/// Represents a feature within a module (e.g., "Advanced Reports", "Multi-currency")
/// </summary>
public class Feature : BaseEntity
{
    public Guid ModuleId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public bool RequiresLicense { get; set; } = false;
    public decimal? AdditionalCost { get; set; }
    
    // Navigation
    public Module Module { get; set; } = null!;
}
