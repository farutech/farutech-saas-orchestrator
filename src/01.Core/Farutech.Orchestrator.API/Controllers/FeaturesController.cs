using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// API para evaluación de features y permisos
/// Usado por aplicaciones satélite (App01: POS) para validar licencias
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FeaturesController(
    OrchestratorDbContext context,
    IPermissionService permissionService,
    ILogger<FeaturesController> logger) : ControllerBase
{
    private readonly OrchestratorDbContext _context = context;
    private readonly IPermissionService _permissionService = permissionService;
    private readonly ILogger<FeaturesController> _logger = logger;

    /// <summary>
    /// Evalúa si una feature está habilitada para el tenant actual
    /// </summary>
    /// <param name="request">Datos de evaluación: featureCode, contextData</param>
    /// <returns>Resultado de evaluación con metadatos</returns>
    [HttpPost("evaluate")]
    [ProducesResponseType(typeof(FeatureEvaluationResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FeatureEvaluationResponse>> EvaluateFeature(
        [FromBody] FeatureEvaluationRequest request)
    {
        try
        {
            // Extract user and tenant from token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var tenantIdClaim = User.FindFirst("tenant_id")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(tenantIdClaim))
            {
                return Unauthorized(new { message = "Invalid token: missing user or tenant information" });
            }

            var userId = Guid.Parse(userIdClaim);
            var tenantId = Guid.Parse(tenantIdClaim);

            _logger.LogInformation(
                "Evaluating feature {FeatureCode} for user {UserId} in tenant {TenantId}",
                request.FeatureCode,
                userId,
                tenantId);

            // 1. Check if feature exists and is active
            var feature = await _context.Features
                .Include(f => f.Module)
                    .ThenInclude(m => m.Product)
                .FirstOrDefaultAsync(f => f.Code == request.FeatureCode && f.IsActive);

            if (feature == null)
            {
                _logger.LogWarning("Feature {FeatureCode} not found or inactive", request.FeatureCode);
                return NotFound(new { message = $"Feature '{request.FeatureCode}' not found or inactive" });
            }

            // 2. Check RBAC permissions for the feature
            var hasPermission = await _permissionService.HasPermissionAsync(
                userId,
                request.FeatureCode, // Use feature code as permission code
                tenantId,
                request.ScopeId);

            _logger.LogInformation(
                "Permission check for feature {FeatureCode} = {HasPermission}",
                request.FeatureCode,
                hasPermission);

            // 3. Evaluate final result (simplified - just check permission)
            var isEnabled = hasPermission;

            var response = new FeatureEvaluationResponse
            {
                FeatureCode = request.FeatureCode,
                IsEnabled = isEnabled,
                HasPermission = hasPermission,
                FeatureMetadata = new FeatureMetadata
                {
                    Name = feature.Name,
                    Description = feature.Description,
                    ModuleName = feature.Module.Name,
                    ProductName = feature.Module.Product.Name,
                    RequiresLicense = feature.RequiresLicense,
                    AdditionalCost = feature.AdditionalCost ?? 0
                },
                EvaluatedAt = DateTime.UtcNow
            };

            _logger.LogInformation(
                "Feature evaluation result: {FeatureCode} = {IsEnabled} (Permission: {HasPermission})",
                request.FeatureCode,
                isEnabled,
                hasPermission);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error evaluating feature {FeatureCode}", request.FeatureCode);
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtiene todas las features disponibles para el tenant actual
    /// </summary>
    [HttpGet("available")]
    [ProducesResponseType(typeof(IEnumerable<FeatureSummary>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<FeatureSummary>>> GetAvailableFeatures()
    {
        try
        {
            var tenantIdClaim = User.FindFirst("tenant_id")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
            {
                return Unauthorized(new { message = "Invalid token: missing tenant information" });
            }

            var tenantId = Guid.Parse(tenantIdClaim);

            // Get all active features (simplified - no subscription check)
            var availableFeatures = await _context.Features
                .Include(f => f.Module)
                .Where(f => f.IsActive)
                .Select(f => new FeatureSummary
                {
                    Code = f.Code,
                    Name = f.Name,
                    Description = f.Description,
                    ModuleName = f.Module.Name,
                    RequiresLicense = f.RequiresLicense
                })
                .ToListAsync();

            return Ok(availableFeatures);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving available features");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Obtiene los permisos del usuario actual en el tenant
    /// </summary>
    [HttpGet("my-permissions")]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<string>>> GetMyPermissions()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var tenantIdClaim = User.FindFirst("tenant_id")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(tenantIdClaim))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var userId = Guid.Parse(userIdClaim);
            var tenantId = Guid.Parse(tenantIdClaim);

            var permissions = await _permissionService.GetUserPermissionsAsync(userId, tenantId);
            var permissionCodes = permissions.Select(p => p.Code).ToList();

            return Ok(permissionCodes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user permissions");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}

// ========== DTOs ==========

public class FeatureEvaluationRequest
{
    /// <summary>
    /// Código de la feature a evaluar (ej: "blind_cash_count", "pos_sales")
    /// </summary>
    public string FeatureCode { get; set; } = string.Empty;

    /// <summary>
    /// Permiso RBAC requerido (opcional)
    /// Ej: "cash_control.register.open"
    /// </summary>
    public string? RequiredPermission { get; set; }

    /// <summary>
    /// ID de scope adicional (bodega, sucursal)
    /// </summary>
    public Guid? ScopeId { get; set; }

    /// <summary>
    /// Datos de contexto adicionales (JSON flexible)
    /// </summary>
    public Dictionary<string, object>? ContextData { get; set; }
}

public class FeatureEvaluationResponse
{
    public string FeatureCode { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public bool HasPermission { get; set; }
    public FeatureMetadata FeatureMetadata { get; set; } = null!;
    public DateTime EvaluatedAt { get; set; }
}

public class FeatureMetadata
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ModuleName { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public bool RequiresLicense { get; set; }
    public decimal AdditionalCost { get; set; }
}

public class FeatureSummary
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ModuleName { get; set; } = string.Empty;
    public bool RequiresLicense { get; set; }
}
