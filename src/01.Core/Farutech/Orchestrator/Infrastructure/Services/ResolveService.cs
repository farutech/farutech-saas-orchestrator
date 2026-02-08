using Farutech.Orchestrator.Application.DTOs.Resolve;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Implementación del servicio de resolución de subdominios
/// </summary>
public class ResolveService(OrchestratorDbContext context) : IResolveService
{
    private readonly OrchestratorDbContext _context = context;

    public async Task<ResolveResponseDto?> ResolveInstanceAsync(string instanceCode, string organizationCode)
    {
        var instance = await _context.TenantInstances
            .Include(t => t.Customer)
            .FirstOrDefaultAsync(t =>
                t.Code == instanceCode &&
                t.Customer.Code == organizationCode &&
                t.Status == "active");

        if (instance == null) return null;

        return new ResolveResponseDto(
            instance.Id,
            instance.Name,
            instance.Customer.Id,
            instance.Customer.CompanyName,
            instance.ApiBaseUrl ?? "/dashboard",
            instance.Status,
            true // Requiere autenticación por defecto
        );
    }
}