using System;
using System.Collections.Generic;
using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Domain.Entities.Catalog;

/// <summary>
/// Represents a software product in the catalog (e.g., "ERP", "CRM")
/// </summary>
public class Product : BaseEntity
{
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    
    // Navigation
    public ICollection<Module> Modules { get; set; } = [];
}
