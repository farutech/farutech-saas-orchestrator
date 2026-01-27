using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Farutech.Orchestrator.API.Middleware;

/// <summary>
/// Middleware para validar que la organización seleccionada esté activa antes de procesar la petición.
/// Evita que usuarios accedan a organizaciones inactivas incluso si intentan forzar el tenant_id.
/// </summary>
public class ActiveOrganizationMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context, IAuthRepository authRepository)
    {
        // Permitir rutas públicas sin validación
        var path = context.Request.Path.Value?.ToLower() ?? string.Empty;
        if (path.Contains("/auth/") || 
            path.Contains("/swagger") || 
            path.Contains("/health") ||
            !context.User.Identity?.IsAuthenticated == true)
        {
            await _next(context);
            return;
        }

        // Obtener tenant_id del claim
        var tenantIdClaim = context.User.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var tenantId))
        {
            // Sin tenant_id válido, permitir continuar (onboarding o perfil)
            await _next(context);
            return;
        }

        // Validar que la organización esté activa
        var customer = await authRepository.GetCustomerByIdAsync(tenantId);
        if (customer == null)
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Organization_Not_Found",
                message = "La organización seleccionada no existe"
            });
            return;
        }

        if (!customer.IsActive)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Organization_Inactive",
                message = "La organización seleccionada está inactiva. Contacte al administrador.",
                organizationName = customer.CompanyName
            });
            return;
        }

        // Organización válida y activa, continuar
        await _next(context);
    }
}
