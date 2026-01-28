using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Repository interface for Customer entity operations
/// </summary>
public interface ICustomerRepository
{
    /// <summary>
    /// Adds a new customer
    /// </summary>
    Task AddAsync(Customer customer, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a customer by ID
    /// </summary>
    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a customer by code
    /// </summary>
    Task<Customer?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing customer
    /// </summary>
    Task UpdateAsync(Customer customer, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a customer
    /// </summary>
    Task DeleteAsync(Customer customer, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a customer code already exists
    /// </summary>
    Task<bool> CodeExistsAsync(string code, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all customers for a specific user (owner/admin)
    /// </summary>
    Task<IEnumerable<Customer>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}