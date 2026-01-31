using System;
using System.Threading.Tasks;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Catalog;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Catalog = Farutech.Orchestrator.Domain.Entities.Catalog;

namespace Farutech.Orchestrator.Infrastructure.Repositories;

/// <summary>
/// Repository implementation using EF Core
/// </summary>
public class EfRepository(OrchestratorDbContext context) : IRepository
{
    private readonly OrchestratorDbContext _context = context;

    public async Task<Customer?> GetCustomerByIdAsync(Guid customerId)
        => await _context.Customers
            .FirstOrDefaultAsync(c => c.Id == customerId);

    public async Task<Product?> GetProductByIdAsync(Guid productId)
        => await _context.Products
            .Include(p => p.Modules)
            .FirstOrDefaultAsync(p => p.Id == productId);

    public async Task<Catalog.Subscription?> GetSubscriptionPlanByIdAsync(Guid subscriptionPlanId)
        => await _context.SubscriptionPlans
            .Include(s => s.SubscriptionFeatures)
                .ThenInclude(sf => sf.Feature)
            .FirstOrDefaultAsync(s => s.Id == subscriptionPlanId);

    public async Task<TenantInstance?> GetTenantInstanceByIdAsync(Guid tenantInstanceId)
        => await _context.TenantInstances
            .FirstOrDefaultAsync(t => t.Id == tenantInstanceId);

    public async Task<TenantInstance?> GetTenantInstanceByCustomerAndCodeAsync(Guid customerId, string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            return null;
            
        var normalizedCode = code.ToUpperInvariant();
        return await _context.TenantInstances
            .FirstOrDefaultAsync(t => t.CustomerId == customerId && t.Code != null && t.Code.ToUpper() == normalizedCode);
    }

    public async Task AddTenantInstanceAsync(TenantInstance tenantInstance)
        => await _context.TenantInstances.AddAsync(tenantInstance);

    public Task UpdateTenantInstanceAsync(TenantInstance tenantInstance)
    {
        _context.TenantInstances.Update(tenantInstance);
        return Task.CompletedTask;
    }

    public async Task<int> SaveChangesAsync()
        => await _context.SaveChangesAsync();
}
