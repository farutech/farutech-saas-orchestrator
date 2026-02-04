using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Applications API - Gestión de aplicaciones por organización
/// </summary>
[ApiController]
[Route("api/organizations/{organizationId}/applications")]
[Authorize]
[ApiExplorerSettings(GroupName = "applications")]
public class ApplicationsController(IInstanceService instanceService) : ControllerBase
{
    private readonly IInstanceService _instanceService = instanceService;

    /// <summary>
    /// Lista todas las aplicaciones de una organización
    /// </summary>
    /// <param name="organizationId">ID de la organización</param>
    /// <returns>Lista de aplicaciones</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TenantInstance>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetByOrganization(Guid organizationId)
    {
        // Verificar que el usuario tenga acceso a la organización
        var tenantIdClaim = User.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var userOrgId) || userOrgId != organizationId)
        {
            return Forbid();
        }

        var instances = await _instanceService.GetAllByCustomerAsync(organizationId);
        return Ok(instances);
    }

    /// <summary>
    /// Obtiene una aplicación específica
    /// </summary>
    /// <param name="organizationId">ID de la organización</param>
    /// <param name="id">ID de la aplicación</param>
    /// <returns>Detalles de la aplicación</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TenantInstance), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetById(Guid organizationId, Guid id)
    {
        var instance = await _instanceService.GetByIdAsync(id);
        if (instance == null || instance.CustomerId != organizationId)
        {
            return NotFound();
        }

        // Verificar acceso
        var tenantIdClaim = User.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var userOrgId) || userOrgId != organizationId)
        {
            return Forbid();
        }

        return Ok(instance);
    }

    /// <summary>
    /// Actualiza el nombre de una aplicación
    /// </summary>
    /// <param name="organizationId">ID de la organización</param>
    /// <param name="id">ID de la aplicación</param>
    /// <param name="request">Datos de actualización</param>
    /// <returns>Resultado de la operación</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateApplication(Guid organizationId, Guid id, [FromBody] UpdateApplicationRequest request)
    {
        // Verificar acceso
        var tenantIdClaim = User.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var userOrgId) || userOrgId != organizationId)
        {
            return Forbid();
        }

        var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var result = await _instanceService.UpdateInstanceAsync(id, userId, request.Name);
        if (!result.Success)
        {
            return result.StatusCode switch
            {
                404 => NotFound(new { message = result.Message }),
                403 => Forbid(),
                _ => BadRequest(new { message = result.Message })
            };
        }

        return Ok(new { message = result.Message });
    }

    /// <summary>
    /// Cambia el estado de una aplicación
    /// </summary>
    /// <param name="organizationId">ID de la organización</param>
    /// <param name="id">ID de la aplicación</param>
    /// <param name="request">Nuevo estado</param>
    /// <returns>Resultado de la operación</returns>
    [HttpPatch("{id}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateStatus(Guid organizationId, Guid id, [FromBody] UpdateApplicationStatusRequest request)
    {
        // Verificar acceso
        var tenantIdClaim = User.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var userOrgId) || userOrgId != organizationId)
        {
            return Forbid();
        }

        var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var result = await _instanceService.UpdateInstanceStatusAsync(id, userId, request.Status);
        if (!result.Success)
        {
            return result.StatusCode switch
            {
                404 => NotFound(new { message = result.Message }),
                403 => Forbid(),
                _ => BadRequest(new { message = result.Message })
            };
        }

        return Ok(new { message = result.Message });
    }
}

/// <summary>
/// DTO para actualizar aplicación
/// </summary>
public record UpdateApplicationRequest(string Name);

/// <summary>
/// DTO para cambiar estado de aplicación
/// </summary>
public record UpdateApplicationStatusRequest(string Status);