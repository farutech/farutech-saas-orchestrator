using System;
using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Domain.Entities.Tenants;

/// <summary>
/// Represents a customer's subscription to products/modules
/// </summary>
public class Subscription : BaseEntity
{
    public Guid CustomerId { get; set; }
    public Guid ProductId { get; set; }
    public string SubscriptionType { get; set; } = "monthly"; // monthly, annual, perpetual
    public decimal Price { get; set; }
    public string Status { get; set; } = "active"; // active, suspended, cancelled, expired
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? NextBillingDate { get; set; }
    public int MaxUsers { get; set; } = 10;
    public string? SubscribedModulesJson { get; set; } // Array of module IDs
    public string? CustomFeaturesJson { get; set; } // Custom feature overrides
    
    // Navigation
    public Customer Customer { get; set; } = null!;
}
