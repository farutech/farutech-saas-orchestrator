using Microsoft.AspNetCore.Mvc;
using Farutech.Apps.Ordeon.Application.Common.Interfaces;
using System;
using System.Threading.Tasks;

namespace Farutech.Apps.Ordeon.API.Controllers;

[ApiController]
[Route("api/internal/orchestrator")]
public class OrchestratorIntegrationController : ControllerBase
{
    private readonly ITenantProvisioningService _provisioningService;
    private readonly IPermissionProvider _permissionProvider;

    public OrchestratorIntegrationController(
        ITenantProvisioningService provisioningService,
        IPermissionProvider permissionProvider)
    {
        _provisioningService = provisioningService;
        _permissionProvider = permissionProvider;
    }

    /// <summary>
    /// Punto de entrada para que el Orchestrator solicite la creación de un nuevo Tenant.
    /// Crea el schema y prepara la base de datos.
    /// </summary>
    [HttpPost("provision")]
    // TODO: Require internal API Key / Orchestrator Token
    public async Task<IActionResult> ProvisionTenant([FromBody] ProvisionTenantRequest request)
    {
        try
        {
            await _provisioningService.ProvisionTenantAsync(request.TenantId);
            return Ok(new { Message = $"Tenant {request.TenantId} provisioned successfully with schema isolated." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Reporta las capacidades (permisos) de la aplicación al Orchestrator.
    /// Esto permite la sincronización automática del catálogo de permisos.
    /// </summary>
    [HttpGet("capabilities")]
    public IActionResult GetCapabilities()
    {
        var permissions = _permissionProvider.GetAllPermissions();
        return Ok(new
        {
            AppName = "Ordeon",
            Permissions = permissions
        });
    }
}

public record ProvisionTenantRequest(Guid TenantId);

