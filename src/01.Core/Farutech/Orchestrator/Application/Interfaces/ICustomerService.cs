using Farutech.Orchestrator.Application.DTOs.Tenants;
using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Service interface for Customer business operations
/// </summary>
public interface ICustomerService
{
    /// <summary>
    /// Creates a new customer
    /// </summary>
    Task<Customer> CreateCustomerAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a customer by ID
    /// </summary>
    Task<Customer?> GetCustomerByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a customer by code
    /// </summary>
    Task<Customer?> GetCustomerByCodeAsync(string code, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all customers for a user
    /// </summary>
    Task<IEnumerable<Customer>> GetCustomersByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates a customer
    /// </summary>
    Task<Customer> UpdateCustomerAsync(Guid id, UpdateCustomerRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a customer (soft delete)
    /// </summary>
    Task DeleteCustomerAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a customer code is available
    /// </summary>
    Task<bool> IsCodeAvailableAsync(string code, Guid? excludeId = null, CancellationToken cancellationToken = default);
}