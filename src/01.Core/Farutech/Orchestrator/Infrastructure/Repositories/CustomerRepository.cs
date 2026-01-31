using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Farutech.Orchestrator.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Customer entity
/// </summary>
public class CustomerRepository(OrchestratorDbContext dbContext) : ICustomerRepository
{
    private readonly OrchestratorDbContext _dbContext = dbContext;

    /// <inheritdoc />
    public async Task AddAsync(Customer customer, CancellationToken cancellationToken = default)
        => await _dbContext.Customers.AddAsync(customer, cancellationToken);

    /// <inheritdoc />
    public async Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _dbContext.Customers
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

    /// <inheritdoc />
    public async Task<Customer?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
        => await _dbContext.Customers
            .FirstOrDefaultAsync(c => c.Code == code, cancellationToken);

    /// <inheritdoc />
    public async Task UpdateAsync(Customer customer, CancellationToken cancellationToken = default)
    {
        _dbContext.Customers.Update(customer);
        await Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Customer customer, CancellationToken cancellationToken = default)
    {
        _dbContext.Customers.Remove(customer);
        await Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task<bool> CodeExistsAsync(string code, CancellationToken cancellationToken = default)
        => await _dbContext.Customers
            .AnyAsync(c => c.Code == code, cancellationToken);

    /// <inheritdoc />
    public async Task<IEnumerable<Customer>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) =>
        // For now, return all customers. This might need to be implemented based on user memberships
        await _dbContext.Customers
            .ToListAsync(cancellationToken);
}