using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Farutech.Orchestrator.API.Middleware;

/// <summary>
/// Middleware para resolución de subdominios
/// Patrón: {instance}.{organization}.app.{domain}
/// </summary>
public class SubdomainMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context, IResolveService resolveService)
    {
        var host = context.Request.Host.Host.ToLower();

        // Verificar si es un subdominio de aplicación
        if (IsApplicationSubdomain(host, out var instanceCode, out var organizationCode))
        {
            // Resolver la instancia
            var resolveResult = await resolveService.ResolveInstanceAsync(instanceCode, organizationCode);
            if (resolveResult != null)
            {
                // Agregar información al contexto para uso posterior
                context.Items["ResolvedInstance"] = resolveResult;

                // Si la aplicación requiere autenticación y el usuario no está autenticado, redirigir a login
                if (resolveResult.RequiresAuthentication && !context.User.Identity?.IsAuthenticated == true)
                {
                    // Redirigir a página de login con contexto
                    var loginUrl = $"/auth/login?instance={instanceCode}&organization={organizationCode}";
                    context.Response.Redirect(loginUrl);
                    return;
                }

                // Log de acceso
                // TODO: Implementar logging de acceso
            }
            else
            {
                // Subdominio no válido
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                await context.Response.WriteAsJsonAsync(new { error = "Application not found" });
                return;
            }
        }

        await _next(context);
    }

    private bool IsApplicationSubdomain(string host, out string instanceCode, out string organizationCode)
    {
        instanceCode = null!;
        organizationCode = null!;

        // Ejemplo: myapp.mycompany.app.farutech.com
        var parts = host.Split('.');
        if (parts.Length >= 4 && parts[^3] == "app")
        {
            instanceCode = parts[0];
            organizationCode = parts[1];
            return true;
        }

        return false;
    }
}