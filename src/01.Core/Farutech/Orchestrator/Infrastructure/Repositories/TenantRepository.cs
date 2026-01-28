using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Farutech.Orchestrator.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for TenantInstance entity
/// </summary>
public class TenantRepository : ITenantRepository
{
    private readonly OrchestratorDbContext _dbContext;

    public TenantRepository(OrchestratorDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <inheritdoc />
    public async Task AddAsync(TenantInstance tenant, CancellationToken cancellationToken = default)
    {
        await _dbContext.TenantInstances.AddAsync(tenant, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<TenantInstance?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.TenantInstances
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<TenantInstance?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        return await _dbContext.TenantInstances
            .FirstOrDefaultAsync(t => t.Code == code, cancellationToken);
    }

    /// <inheritdoc />
    public async Task UpdateAsync(TenantInstance tenant, CancellationToken cancellationToken = default)
    {
        _dbContext.TenantInstances.Update(tenant);
        await Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task DeleteAsync(TenantInstance tenant, CancellationToken cancellationToken = default)
    {
        _dbContext.TenantInstances.Remove(tenant);
        await Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task<IEnumerable<TenantInstance>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.TenantInstances
            .Where(t => t.CustomerId == customerId)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<bool> CodeExistsAsync(string code, CancellationToken cancellationToken = default)
    {
        return await _dbContext.TenantInstances
            .AnyAsync(t => t.Code == code, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IEnumerable<TenantInstance>> GetByStatusAsync(string status, CancellationToken cancellationToken = default)
    {
        return await _dbContext.TenantInstances
            .Where(t => t.Status == status)
            .ToListAsync(cancellationToken);
    }
}