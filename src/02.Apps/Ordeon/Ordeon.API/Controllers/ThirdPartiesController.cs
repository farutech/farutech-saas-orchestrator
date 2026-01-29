using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordeon.API.Authorization;
using Ordeon.Application.MasterData.Commands;
using Ordeon.Domain.Aggregates.ThirdParties;
using Ordeon.Infrastructure.Persistence;

namespace Ordeon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ThirdPartiesController : ControllerBase
{
    private readonly OrdeonDbContext _context;

    public ThirdPartiesController(OrdeonDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _context.ThirdParties.ToListAsync();
        return Ok(result);
    }

    [HttpPost]
    [RequirePermission("mst.trc.crt")]
    public async Task<IActionResult> Create([FromBody] CreateThirdPartyRequest request, [FromHeader(Name = "X-Tenant-ID")] Guid tenantId)
    {
        var thirdParty = ThirdParty.Create(
            request.Identification,
            request.Name,
            request.Email,
            request.Type,
            tenantId);
            
        thirdParty.UpdateContactInfo(request.Email, request.Phone, request.Address);

        _context.ThirdParties.Add(thirdParty);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = thirdParty.Id }, thirdParty);
    }
}
