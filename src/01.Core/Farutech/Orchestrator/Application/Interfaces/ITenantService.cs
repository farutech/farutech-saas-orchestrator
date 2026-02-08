using Farutech.Orchestrator.Application.DTOs.Tenants;
using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Service interface for Tenant business operations
/// </summary>
public interface ITenantService
{
    /// <summary>
    /// Creates a new tenant instance
    /// </summary>
    Task<TenantInstance> CreateTenantAsync(CreateTenantRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a tenant by ID
    /// </summary>
    Task<TenantInstance?> GetTenantByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a tenant by code
    /// </summary>
    Task<TenantInstance?> GetTenantByCodeAsync(string code, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all tenants for a customer
    /// </summary>
    Task<IEnumerable<TenantInstance>> GetTenantsByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates a tenant
    /// </summary>
    Task<TenantInstance> UpdateTenantAsync(Guid id, UpdateTenantRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a tenant (soft delete)
    /// </summary>
    Task DeleteTenantAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Changes tenant status
    /// </summary>
    Task<TenantInstance> ChangeTenantStatusAsync(Guid id, string status, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a tenant code is available
    /// </summary>
    Task<bool> IsCodeAvailableAsync(string code, Guid? excludeId = null, CancellationToken cancellationToken = default);
}