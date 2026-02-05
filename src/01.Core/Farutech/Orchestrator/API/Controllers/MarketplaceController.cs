using Farutech.Orchestrator.Application.DTOs.Catalog;
using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Marketplace API - Gestión del catálogo de aplicaciones disponibles
/// </summary>
[ApiController]
[Route("api/marketplace")]
[Authorize]
[ApiExplorerSettings(GroupName = "marketplace")]
public class MarketplaceController(ICatalogService catalogService) : ControllerBase
{
    private readonly ICatalogService _catalogService = catalogService;

    /// <summary>
    /// Obtiene el catálogo completo de aplicaciones disponibles en el marketplace
    /// </summary>
    /// <returns>Lista de todas las aplicaciones publicadas activas ordenadas por nombre</returns>
    /// <response code="200">Catálogo obtenido exitosamente</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpGet("applications")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetApplications()
    {
        var products = await _catalogService.GetAllProductsAsync();
        return Ok(products);
    }

    /// <summary>
    /// Obtiene todos los planes de suscripción disponibles para una aplicación específica
    /// </summary>
    /// <param name="appId">ID único de la aplicación</param>
    /// <returns>Lista de planes (módulos) disponibles para la aplicación especificada</returns>
    /// <response code="200">Planes obtenidos exitosamente</response>
    /// <response code="404">Aplicación no encontrada o sin planes disponibles</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpGet("plans/{appId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<ModuleDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ModuleDto>>> GetPlans(Guid appId)
    {
        var modules = await _catalogService.GetModulesByProductIdAsync(appId);
        if (modules == null || !modules.Any())
        {
            return NotFound(new { message = "No se encontraron planes para esta aplicación" });
        }
        return Ok(modules);
    }
}