using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Resolve API - Resolución de subdominios y redireccionamiento
/// </summary>
[ApiController]
[Route("api/resolve")]
public class ResolveController(IResolveService resolveService) : ControllerBase
{
    private readonly IResolveService _resolveService = resolveService;

    /// <summary>
    /// Resuelve una instancia por subdominio
    /// </summary>
    /// <param name="instance">Código de la instancia</param>
    /// <param name="organization">Código de la organización</param>
    /// <returns>Información de la aplicación para login</returns>
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