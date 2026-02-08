using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Farutech.Orchestrator.Domain.Entities.Catalog;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Catalog = Farutech.Orchestrator.Domain.Entities.Catalog;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Repository interface for data access
/// </summary>
public interface IRepository
{
    // Customers
    Task<Customer?> GetCustomerByIdAsync(Guid customerId);
    
    // Products
    Task<Product?> GetProductByIdAsync(Guid productId);
    
    // Subscription Plans
    Task<Catalog.Subscription?> GetSubscriptionPlanByIdAsync(Guid subscriptionPlanId);
    
    // Tenant Instances
    Task<TenantInstance?> GetTenantInstanceByIdAsync(Guid tenantInstanceId);
    Task<TenantInstance?> GetTenantInstanceByCustomerAndCodeAsync(Guid customerId, string code);
    Task AddTenantInstanceAsync(TenantInstance tenantInstance);
    Task UpdateTenantInstanceAsync(TenantInstance tenantInstance);
    
    // Save changes
    Task<int> SaveChangesAsync();
}
