using Farutech.Orchestrator.Application.DTOs.Catalog;
using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Controlador para gestión de catálogos maestros (Products, Modules, Features).
/// Requiere autenticación y permisos de administrador global.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // Requiere autenticación
public class CatalogController(
    ICatalogService catalogService,
    ILogger<CatalogController> logger) : ControllerBase
{
    private readonly ICatalogService _catalogService = catalogService;
    private readonly ILogger<CatalogController> _logger = logger;

    #region Products

    /// <summary>
    /// Lista todos los productos del catálogo.
    /// </summary>
    [HttpGet("products")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        try
        {
            var products = await _catalogService.GetAllProductsAsync();
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener productos del catálogo");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al obtener productos" });
        }
    }

    /// <summary>
    /// Obtiene un producto específico por su ID.
    /// </summary>
    [HttpGet("products/{id:guid}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetProduct(Guid id)
    {
        try
        {
            var product = await _catalogService.GetProductByIdAsync(id);
            if (product == null)
                return NotFound(new { message = $"Producto con ID {id} no encontrado" });

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener producto {ProductId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al obtener producto" });
        }
    }

    /// <summary>
    /// Crea un nuevo producto en el catálogo.
    /// Solo administradores globales.
    /// </summary>
    [HttpPost("products")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = await _catalogService.CreateProductAsync(request);
            
            return CreatedAtAction(
                nameof(GetProduct), 
                new { id = product.Id }, 
                product);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operación inválida al crear producto");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear producto");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al crear producto" });
        }
    }

    /// <summary>
    /// Actualiza un producto existente.
    /// Solo administradores globales.
    /// </summary>
    [HttpPut("products/{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> UpdateProduct(Guid id, [FromBody] UpdateProductDto request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = await _catalogService.UpdateProductAsync(id, request);
            if (product == null)
                return NotFound(new { message = $"Producto con ID {id} no encontrado" });

            return Ok(product);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operación inválida al actualizar producto {ProductId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar producto {ProductId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al actualizar producto" });
        }
    }

    /// <summary>
    /// Elimina un producto del catálogo (soft delete).
    /// Solo administradores globales.
    /// </summary>
    [HttpDelete("products/{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        try
        {
            var result = await _catalogService.DeleteProductAsync(id);
            if (!result)
                return NotFound(new { message = $"Producto con ID {id} no encontrado" });

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operación inválida al eliminar producto {ProductId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar producto {ProductId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al eliminar producto" });
        }
    }

    /// <summary>
    /// Obtiene el manifiesto completo de un producto incluyendo módulos, features y permisos.
    /// </summary>
    [HttpGet("products/{productId:guid}/manifest")]
    [ProducesResponseType(typeof(ProductManifestDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductManifestDto>> GetProductManifest(Guid productId)
    {
        try
        {
            var manifest = await _catalogService.GetProductManifestAsync(productId);
            if (manifest == null)
                return NotFound(new { message = $"Producto con ID {productId} no encontrado" });

            return Ok(manifest);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener manifiesto del producto {ProductId}", productId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al obtener manifiesto del producto" });
        }
    }

    #endregion

    #region Modules

    /// <summary>
    /// Lista todos los módulos de un producto específico.
    /// </summary>
    [HttpGet("products/{productId:guid}/modules")]
    [ProducesResponseType(typeof(IEnumerable<ModuleDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ModuleDto>>> GetModules(Guid productId)
    {
        try
        {
            var modules = await _catalogService.GetModulesByProductIdAsync(productId);
            return Ok(modules);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener módulos del producto {ProductId}", productId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al obtener módulos" });
        }
    }

    /// <summary>
    /// Obtiene un módulo específico por su ID.
    /// </summary>
    [HttpGet("modules/{id:guid}")]
    [ProducesResponseType(typeof(ModuleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ModuleDto>> GetModule(Guid id)
    {
        try
        {
            var module = await _catalogService.GetModuleByIdAsync(id);
            if (module == null)
                return NotFound(new { message = $"Módulo con ID {id} no encontrado" });

            return Ok(module);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener módulo {ModuleId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al obtener módulo" });
        }
    }

    /// <summary>
    /// Crea un nuevo módulo en el catálogo.
    /// Solo administradores globales.
    /// </summary>
    [HttpPost("modules")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(ModuleDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ModuleDto>> CreateModule([FromBody] CreateModuleDto request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var module = await _catalogService.CreateModuleAsync(request);
            
            return CreatedAtAction(
                nameof(GetModule), 
                new { id = module.Id }, 
                module);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operación inválida al crear módulo");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear módulo");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al crear módulo" });
        }
    }

    /// <summary>
    /// Actualiza un módulo existente.
    /// Solo administradores globales.
    /// </summary>
    [HttpPut("modules/{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(ModuleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ModuleDto>> UpdateModule(Guid id, [FromBody] UpdateModuleDto request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var module = await _catalogService.UpdateModuleAsync(id, request);
            if (module == null)
                return NotFound(new { message = $"Módulo con ID {id} no encontrado" });

            return Ok(module);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operación inválida al actualizar módulo {ModuleId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar módulo {ModuleId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al actualizar módulo" });
        }
    }

    /// <summary>
    /// Elimina un módulo del catálogo (soft delete).
    /// Solo administradores globales.
    /// </summary>
    [HttpDelete("modules/{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteModule(Guid id)
    {
        try
        {
            var result = await _catalogService.DeleteModuleAsync(id);
            if (!result)
                return NotFound(new { message = $"Módulo con ID {id} no encontrado" });

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operación inválida al eliminar módulo {ModuleId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar módulo {ModuleId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al eliminar módulo" });
        }
    }

    #endregion

    #region Features

    /// <summary>
    /// Lista todas las features de un módulo específico.
    /// </summary>
    [HttpGet("modules/{moduleId:guid}/features")]
    [ProducesResponseType(typeof(IEnumerable<FeatureDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<FeatureDto>>> GetFeatures(Guid moduleId)
    {
        try
        {
            var features = await _catalogService.GetFeaturesByModuleIdAsync(moduleId);
            return Ok(features);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener features del módulo {ModuleId}", moduleId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al obtener features" });
        }
    }

    /// <summary>
    /// Obtiene una feature específica por su ID.
    /// </summary>
    [HttpGet("features/{id:guid}")]
    [ProducesResponseType(typeof(FeatureDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FeatureDto>> GetFeature(Guid id)
    {
        try
        {
            var feature = await _catalogService.GetFeatureByIdAsync(id);
            if (feature == null)
                return NotFound(new { message = $"Feature con ID {id} no encontrado" });

            return Ok(feature);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener feature {FeatureId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al obtener feature" });
        }
    }

    /// <summary>
    /// Crea una nueva feature en el catálogo.
    /// Solo administradores globales.
    /// </summary>
    [HttpPost("features")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(FeatureDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<FeatureDto>> CreateFeature([FromBody] CreateFeatureDto request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var feature = await _catalogService.CreateFeatureAsync(request);
            
            return CreatedAtAction(
                nameof(GetFeature), 
                new { id = feature.Id }, 
                feature);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operación inválida al crear feature");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear feature");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al crear feature" });
        }
    }

    /// <summary>
    /// Actualiza una feature existente.
    /// Solo administradores globales.
    /// </summary>
    [HttpPut("features/{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(FeatureDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FeatureDto>> UpdateFeature(Guid id, [FromBody] UpdateFeatureDto request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var feature = await _catalogService.UpdateFeatureAsync(id, request);
            if (feature == null)
                return NotFound(new { message = $"Feature con ID {id} no encontrado" });

            return Ok(feature);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operación inválida al actualizar feature {FeatureId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar feature {FeatureId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al actualizar feature" });
        }
    }

    /// <summary>
    /// Elimina una feature del catálogo (soft delete).
    /// Solo administradores globales.
    /// </summary>
    [HttpDelete("features/{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteFeature(Guid id)
    {
        try
        {
            var result = await _catalogService.DeleteFeatureAsync(id);
            if (!result)
                return NotFound(new { message = $"Feature con ID {id} no encontrado" });

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operación inválida al eliminar feature {FeatureId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar feature {FeatureId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error al eliminar feature" });
        }
    }

    #endregion
}
