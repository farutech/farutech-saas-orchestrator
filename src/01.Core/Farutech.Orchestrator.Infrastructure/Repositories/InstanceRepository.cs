using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Farutech.Orchestrator.Infrastructure.Repositories;

/// <summary>
/// Implementación del repositorio de instancias.
/// </summary>
public class InstanceRepository(OrchestratorDbContext context) : IInstanceRepository
{
    private readonly OrchestratorDbContext _context = context;

    public async Task<IEnumerable<TenantInstance>> GetAllByCustomerAsync(Guid customerId) => await _context.TenantInstances
            .Where(t => t.CustomerId == customerId && !t.IsDeleted)
            .Include(t => t.Customer)
            .ToListAsync();

    public async Task<TenantInstance?> GetByIdAsync(Guid instanceId) => await _context.TenantInstances
            .Include(t => t.Customer)
            .FirstOrDefaultAsync(t => t.Id == instanceId && !t.IsDeleted);

    public async Task<TenantInstance> UpdateAsync(TenantInstance instance)
    {
        _context.TenantInstances.Update(instance);
        await _context.SaveChangesAsync();
        return instance;
    }
}
