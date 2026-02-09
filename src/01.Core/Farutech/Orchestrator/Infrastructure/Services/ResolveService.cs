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
        // Allow access to instances in provisioning/pending/active states
        // Use case-insensitive comparison
        var instance = await _context.TenantInstances
            .Include(t => t.Customer)
            .FirstOrDefaultAsync(t =>
                t.Code.ToLower() == instanceCode.ToLower() &&
                t.Customer.Code.ToUpper() == organizationCode.ToUpper() &&
                (t.Status == "active" || t.Status == "provisioning" || t.Status == "PENDING_PROVISION"));

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

    /// <summary>
    /// Resolve tenant instance by full hostname
    /// Format: https://{instanceCode}.{organizationCode}.app.farutech.com
    /// </summary>
    public async Task<ResolveResponseDto?> ResolveByHostnameAsync(string hostname)
    {
        // Extract subdomain parts
        // Expected format: {instanceCode}.{organizationCode}.app.farutech.com
        var parts = hostname.Split('.');
        
        // Need at least 4 parts: instance.org.app.domain
        if (parts.Length < 4) return null;
        
        var instanceCode = parts[0].ToLowerInvariant(); // e.g., "8b571b69" (normalized to lowercase)
        var organizationCode = parts[1].ToUpperInvariant(); // e.g., "FARU6128" (normalized to uppercase)
        
        // Validate codes are not empty
        if (string.IsNullOrWhiteSpace(instanceCode) || string.IsNullOrWhiteSpace(organizationCode))
            return null;
        
        // Resolve using existing method
        return await ResolveInstanceAsync(instanceCode, organizationCode);
    }
}