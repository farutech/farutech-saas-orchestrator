using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Controlador REST para gestión de instancias tenant.
/// Ejemplo de implementación dual (REST + GraphQL) usando el mismo servicio.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
[ApiExplorerSettings(GroupName = "Instances")]
public class InstancesController(IInstanceService instanceService) : ControllerBase
{
    private readonly IInstanceService _instanceService = instanceService;

    /// <summary>
    /// Lista todas las instancias de la empresa actual (obtenida del token JWT).
    /// </summary>
    /// <returns>Lista de instancias tenant</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TenantInstance>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll()
    {
        // Obtener tenant_id del token JWT
        var tenantIdClaim = User.FindFirst("tenant_id")?.Value;
        
        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var customerId))
        {
            return Unauthorized(new { message = "Token JWT inválido o sin contexto de empresa" });
        }

        var instances = await _instanceService.GetAllByCustomerAsync(customerId);
        return Ok(instances);
    }

    /// <summary>
    /// Obtiene una instancia específica por ID.
    /// </summary>
    /// <param name="id">ID de la instancia</param>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TenantInstance), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var instance = await _instanceService.GetByIdAsync(id);
        
        if (instance == null)
        {
            return NotFound();
        }

        // Verificar que la instancia pertenece a la empresa del token
        var tenantIdClaim = User.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var customerId))
        {
            return Unauthorized();
        }

        if (instance.CustomerId != customerId)
        {
            return Forbid();
        }

        return Ok(instance);
    }

    /// <summary>
    /// Actualiza el nombre amigable de una instancia.
    /// Solo Owner o Admin de la organización puede ejecutarlo.
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateInstance(Guid id, [FromBody] UpdateInstanceRequest request)
    {
        // Extraer userId del token
        var userIdClaim = User.FindFirst("sub")?.Value 
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token inválido" });
        }

        var result = await _instanceService.UpdateInstanceAsync(id, userId, request.Name);
        
        if (!result.Success)
        {
            return result.StatusCode switch
            {
                404 => NotFound(new { message = result.Message }),
                403 => StatusCode(403, new { message = result.Message }),
                _ => BadRequest(new { message = result.Message })
            };
        }

        return Ok(new { message = result.Message, instance = result.Instance });
    }

    /// <summary>
    /// Inactiva o cambia el estado de una instancia.
    /// Solo Owner o Admin de la organización puede ejecutarlo.
    /// </summary>
    [HttpPatch("{id}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateInstanceStatus(Guid id, [FromBody] UpdateInstanceStatusRequest request)
    {
        // Extraer userId del token
        var userIdClaim = User.FindFirst("sub")?.Value 
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token inválido" });
        }

        var result = await _instanceService.UpdateInstanceStatusAsync(id, userId, request.Status);
        
        if (!result.Success)
        {
            return result.StatusCode switch
            {
                404 => NotFound(new { message = result.Message }),
                403 => StatusCode(403, new { message = result.Message }),
                _ => BadRequest(new { message = result.Message })
            };
        }

        return Ok(new { message = result.Message, instance = result.Instance });
    }
}

/// <summary>
/// Request para actualizar instancia.
/// </summary>
public record UpdateInstanceRequest(string Name);

/// <summary>
/// Request para cambiar estado de instancia.
/// </summary>
public record UpdateInstanceStatusRequest(string Status); // "active", "suspended", "inactive"
