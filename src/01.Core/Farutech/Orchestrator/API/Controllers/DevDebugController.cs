using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Farutech.Orchestrator.Application.Interfaces;

namespace Farutech.Orchestrator.API.Controllers;

[ApiController]
[Route("api/dev/debug")]
[AllowAnonymous]
[ApiExplorerSettings(GroupName = "Development")]
public class DevDebugController(IConfiguration configuration, ICatalogRepository catalogRepository) : ControllerBase
{
    private readonly IConfiguration _configuration = configuration;
    private readonly ICatalogRepository _catalogRepository = catalogRepository;

    [HttpGet("manifest-info/{productId:guid}")]
    public async Task<IActionResult> GetManifestInfo(Guid productId)
    {
        var conn = _configuration.GetConnectionString("DefaultConnection") ?? string.Empty;
        var safe = conn;
        try
        {
            // Mask password if present
            var parts = conn.Split(';').Select(p => p.Trim()).Where(p => !string.IsNullOrEmpty(p)).ToList();
            for (int i = 0; i < parts.Count; i++)
            {
                if (parts[i].StartsWith("Password=", StringComparison.OrdinalIgnoreCase) || parts[i].StartsWith("Pwd=", StringComparison.OrdinalIgnoreCase))
                {
                    parts[i] = parts[i].Split('=')[0] + "=***";
                }
            }
            safe = string.Join(";", parts);
        }
        catch { }

        var plans = await _catalogRepository.GetSubscriptionPlansByProductIdAsync(productId);
        var planList = plans.Select(p => new { p.Id, p.Code, p.Name }).ToList();

        return Ok(new
        {
            Connection = safe,
            SubscriptionPlanCount = planList.Count,
            Plans = planList
        });
    }
}
