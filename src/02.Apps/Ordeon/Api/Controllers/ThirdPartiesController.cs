using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Farutech.Apps.Ordeon.API.Authorization;
using Farutech.Apps.Ordeon.Application.MasterData.Commands;
using Farutech.Apps.Ordeon.Domain.Aggregates.ThirdParties;
using Farutech.Apps.Ordeon.Infrastructure.Persistence;

namespace Farutech.Apps.Ordeon.API.Controllers;

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
    public async Task<IActionResult> Create([FromBody] CreateThirdPartyRequest request)
    {
        var thirdParty = ThirdParty.Create(
            request.Identification,
            request.Name,
            request.Email,
            request.Type);
            
        thirdParty.UpdateContactInfo(request.Email, request.Phone, request.Address);

        _context.ThirdParties.Add(thirdParty);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = thirdParty.Id }, thirdParty);
    }
}

