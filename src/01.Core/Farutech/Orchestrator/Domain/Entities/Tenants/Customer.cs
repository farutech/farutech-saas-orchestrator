using System;
using System.Collections.Generic;
using Farutech.Orchestrator.Domain.Common;
using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Domain.Entities.Tenants;

/// <summary>
/// Represents a customer/company that uses the platform
/// </summary>
public class Customer : BaseEntity
{
    public required string Code { get; set; }
    public required string CompanyName { get; set; }
    public required string TaxId { get; set; }
    public required string Email { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    
    // Navigation
    public ICollection<TenantInstance> TenantInstances { get; set; } = [];
    public ICollection<Subscription> Subscriptions { get; set; } = [];
    public ICollection<UserCompanyMembership> UserMemberships { get; set; } = [];
}
