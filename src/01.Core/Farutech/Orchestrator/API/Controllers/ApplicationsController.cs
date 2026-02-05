using Farutech.Orchestrator.Application.DTOs.Applications;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Applications API - Gestión de aplicaciones por organización
/// Permite consultar, actualizar y gestionar las instancias de aplicaciones desplegadas para cada organización.
/// </summary>
[ApiController]
[Route("api/organizations/{organizationId}/applications")]
[Authorize]
[ApiExplorerSettings(GroupName = "applications")]
public class ApplicationsController(IInstanceService instanceService) : ControllerBase
{
    private readonly IInstanceService _instanceService = instanceService;

    /// <summary>
    /// Lista todas las aplicaciones (instancias) pertenecientes a una organización específica
    /// </summary>
    /// <param name="organizationId">ID único de la organización (GUID)</param>
    /// <returns>Lista completa de aplicaciones activas de la organización con información resumida</returns>
    /// <response code="200">Lista de aplicaciones obtenida exitosamente</response>
    /// <response code="403">Usuario no autorizado para acceder a esta organización</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ApplicationSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetByOrganization(Guid organizationId)
    {
        // Verificar que el usuario tenga acceso a la organización
        var tenantIdClaim = User.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var userOrgId) || userOrgId != organizationId)
        {
            return Forbid();
        }

        var instances = await _instanceService.GetAllByCustomerAsync(organizationId);

        var result = instances.Select(i => new ApplicationSummaryDto(
            Id: i.Id,
            Code: i.Code ?? i.TenantCode,
            Name: i.Name,
            ApplicationType: i.ApplicationType,
            Environment: i.Environment,
            Status: i.Status,
            LastAccessAt: i.LastAccessAt
        ));

        return Ok(result);
    }

    /// <summary>
    /// Obtiene los detalles completos de una aplicación específica
    /// Incluye configuración, estado, URLs de acceso y características activas
    /// </summary>
    /// <param name="organizationId">ID único de la organización propietaria</param>
    /// <param name="id">ID único de la aplicación a consultar</param>
    /// <returns>Detalles completos de la aplicación incluyendo configuración y estado</returns>
    /// <response code="200">Detalles de la aplicación obtenidos exitosamente</response>
    /// <response code="404">Aplicación no encontrada o no pertenece a la organización</response>
    /// <response code="403">Usuario no autorizado para acceder a esta organización</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApplicationInfoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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

        var result = new ApplicationInfoDto(
            Id: instance.Id,
            CustomerId: instance.CustomerId,
            TenantCode: instance.TenantCode,
            Code: instance.Code,
            Name: instance.Name,
            Environment: instance.Environment,
            ApplicationType: instance.ApplicationType,
            DeploymentType: instance.DeploymentType,
            Status: instance.Status,
            ApiBaseUrl: instance.ApiBaseUrl,
            ProvisionedAt: instance.ProvisionedAt,
            LastAccessAt: instance.LastAccessAt,
            ThemeColor: instance.ThemeColor,
            ActiveFeaturesJson: instance.ActiveFeaturesJson
        );

        return Ok(result);
    }

    /// <summary>
    /// Actualiza el nombre y configuración básica de una aplicación existente
    /// </summary>
    /// <param name="organizationId">ID único de la organización propietaria</param>
    /// <param name="id">ID único de la aplicación a actualizar</param>
    /// <param name="request">Datos de actualización incluyendo el nuevo nombre</param>
    /// <returns>Confirmación de que la aplicación fue actualizada exitosamente</returns>
    /// <response code="200">Aplicación actualizada exitosamente</response>
    /// <response code="400">Datos de entrada inválidos</response>
    /// <response code="404">Aplicación no encontrada</response>
    /// <response code="403">Usuario no autorizado para modificar aplicaciones de esta organización</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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
    /// Cambia el estado operativo de una aplicación (Active, Suspended, etc.)
    /// </summary>
    /// <param name="organizationId">ID único de la organización propietaria</param>
    /// <param name="id">ID único de la aplicación a modificar</param>
    /// <param name="request">Nuevo estado deseado para la aplicación</param>
    /// <returns>Confirmación de que el estado fue cambiado exitosamente</returns>
    /// <response code="200">Estado de la aplicación actualizado exitosamente</response>
    /// <response code="400">Estado inválido o transición no permitida</response>
    /// <response code="404">Aplicación no encontrada</response>
    /// <response code="403">Usuario no autorizado para modificar aplicaciones de esta organización</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpPatch("{id}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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
/// Solicitud para actualizar el nombre de una aplicación
/// </summary>
public record UpdateApplicationRequest(
    /// <summary>Nuevo nombre descriptivo para la aplicación</summary>
    string Name
);

/// <summary>
/// Solicitud para cambiar el estado operativo de una aplicación
/// </summary>
public record UpdateApplicationStatusRequest(
    /// <summary>Nuevo estado deseado (Active, Suspended, Terminated, etc.)</summary>
    string Status
);