using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Repository interface for TenantInstance entity operations
/// </summary>
public interface ITenantRepository
{
    /// <summary>
    /// Adds a new tenant instance
    /// </summary>
    Task AddAsync(TenantInstance tenant, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a tenant instance by ID
    /// </summary>
    Task<TenantInstance?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a tenant instance by code
    /// </summary>
    Task<TenantInstance?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing tenant instance
    /// </summary>
    Task UpdateAsync(TenantInstance tenant, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a tenant instance
    /// </summary>
    Task DeleteAsync(TenantInstance tenant, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all tenant instances for a specific customer
    /// </summary>
    Task<IEnumerable<TenantInstance>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a tenant code already exists
    /// </summary>
    Task<bool> CodeExistsAsync(string code, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets tenant instances by status
    /// </summary>
    Task<IEnumerable<TenantInstance>> GetByStatusAsync(string status, CancellationToken cancellationToken = default);
}