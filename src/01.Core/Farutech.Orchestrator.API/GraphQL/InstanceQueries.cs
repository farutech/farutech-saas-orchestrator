using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using HotChocolate.Authorization;
using HotChocolate.AspNetCore.Authorization;
using System.Security.Claims;

namespace Farutech.Orchestrator.API.GraphQL;

/// <summary>
/// Queries de GraphQL para gestión de instancias.
/// Ejemplo de implementación dual (REST + GraphQL) usando el mismo servicio.
/// </summary>
public class InstanceQueries
{
    /// <summary>
    /// Lista todas las instancias de la empresa actual (obtenida del token JWT).
    /// </summary>
    [Authorize]
    public async Task<IEnumerable<TenantInstance>> GetInstances(
        [Service] IInstanceService instanceService,
        ClaimsPrincipal claimsPrincipal)
    {
        // Obtener tenant_id del token JWT
        var tenantIdClaim = claimsPrincipal.FindFirst("tenant_id")?.Value;
        
        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var customerId))
        {
            throw new GraphQLException("Token JWT inválido o sin contexto de empresa");
        }

        return await instanceService.GetAllByCustomerAsync(customerId);
    }

    /// <summary>
    /// Obtiene una instancia específica por ID.
    /// </summary>
    [Authorize]
    public async Task<TenantInstance?> GetInstanceById(
        [Service] IInstanceService instanceService,
        ClaimsPrincipal claimsPrincipal,
        Guid id)
    {
        var instance = await instanceService.GetByIdAsync(id);
        
        if (instance == null)
        {
            return null;
        }

        // Verificar que la instancia pertenece a la empresa del token
        var tenantIdClaim = claimsPrincipal.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var customerId))
        {
            throw new GraphQLException("Token JWT inválido");
        }

        if (instance.CustomerId != customerId)
        {
            throw new GraphQLException("No tiene permisos para acceder a esta instancia");
        }

        return instance;
    }
}
