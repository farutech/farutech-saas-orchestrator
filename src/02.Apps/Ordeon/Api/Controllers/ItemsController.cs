using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Farutech.Apps.Ordeon.API.Authorization;
using Farutech.Apps.Ordeon.Domain.Aggregates.Identity;
using Farutech.Apps.Ordeon.Domain.Aggregates.Inventory;
using Farutech.Apps.Ordeon.Infrastructure.Persistence;
using System;
using System.Threading.Tasks;

namespace Farutech.Apps.Ordeon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ItemsController(OrdeonDbContext context) : ControllerBase
{
    private readonly OrdeonDbContext _context = context;

    [HttpGet]
    [RequirePermission(Permissions.Inventory.Read)]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.Items.ToListAsync();
        return Ok(items);
    }

    [HttpPost]
    [RequirePermission(Permissions.Inventory.Create)]
    public async Task<IActionResult> Create([FromBody] CreateItemRequest request)
    {
        var item = Item.Create(
            request.Code,
            request.Name,
            request.Description,
            request.Type,
            request.CategoryId,
            request.BaseUnitOfMeasureId);

        if (!string.IsNullOrEmpty(request.MetadataJson))
        {
            item.UpdateMetadata(request.MetadataJson);
        }

        _context.Items.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = item.Id }, item);
    }
}

public record CreateItemRequest(
    string Code,
    string Name,
    string Description,
    ItemType Type,
    Guid CategoryId,
    Guid BaseUnitOfMeasureId,
    string MetadataJson = "{}");

