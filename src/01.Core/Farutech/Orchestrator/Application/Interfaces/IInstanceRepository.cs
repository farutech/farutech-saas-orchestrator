using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Repositorio para operaciones con instancias tenant.
/// </summary>
public interface IInstanceRepository
{
    Task<IEnumerable<TenantInstance>> GetAllByCustomerAsync(Guid customerId);
    Task<TenantInstance?> GetByIdAsync(Guid instanceId);
    Task<TenantInstance> UpdateAsync(TenantInstance instance);
}
