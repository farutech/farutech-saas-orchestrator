using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Resolve API - Resolución de subdominios y redireccionamiento
/// </summary>
[ApiController]
[Route("api/resolve")]
[AllowAnonymous]
[ApiExplorerSettings(GroupName = "Resolve")]
public class ResolveController(IResolveService resolveService) : ControllerBase
{
    private readonly IResolveService _resolveService = resolveService;

    /// <summary>
    /// Resuelve una instancia de aplicación por subdominio para redireccionamiento automático
    /// </summary>
    /// <param name="instance">Código único de la instancia (subdominio)</param>
    /// <param name="organization">Código único de la organización</param>
    /// <returns>Información completa de la aplicación para login y configuración del cliente</returns>
    /// <response code="200">Instancia resuelta exitosamente</response>
    /// <response code="404">Instancia u organización no encontrada</response>
    [HttpGet("{instance}/{organization}")]
    [ProducesResponseType(typeof(ResolveResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ResolveResponseDto>> ResolveInstance(string instance, string organization)
    {
        var result = await _resolveService.ResolveInstanceAsync(instance, organization);
        if (result == null)
        {
            return NotFound(new { message = "Instancia no encontrada" });
        }
        return Ok(result);
    }

    /// <summary>
    /// Resuelve una instancia por hostname completo (usado por dashboard cuando accede por URL directa)
    /// </summary>
    /// <param name="hostname">Hostname completo (ej: 8b571b69.FARU6128.app.farutech.com)</param>
    /// <returns>Información de la instancia resuelta</returns>
    /// <response code="200">Instancia resuelta exitosamente</response>
    /// <response code="404">Instancia no encontrada</response>
    [HttpGet("by-hostname")]
    [ProducesResponseType(typeof(ResolveResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ResolveResponseDto>> ResolveByHostname([FromQuery] string hostname)
    {
        if (string.IsNullOrWhiteSpace(hostname))
        {
            return BadRequest(new { message = "Hostname es requerido" });
        }

        var result = await _resolveService.ResolveByHostnameAsync(hostname);
        if (result == null)
        {
            return NotFound(new { message = "Instancia no encontrada para el hostname especificado" });
        }
        
        return Ok(result);
    }
}

/// <summary>
/// DTO para respuesta de resolución
/// </summary>
public record ResolveResponseDto(
    Guid InstanceId,
    string InstanceName,
    Guid OrganizationId,
    string OrganizationName,
    string ApplicationUrl,
    string Status,
    bool RequiresAuthentication
);