using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordeon.API.Authorization;
using Ordeon.Domain.Aggregates.Inventory;
using Ordeon.Infrastructure.Persistence;

namespace Ordeon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requiere login JWT
public class ItemsController : ControllerBase
{
    private readonly OrdeonDbContext _context;

    public ItemsController(OrdeonDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [RequireFeature("INV_BASIC")] // Tenant debe tener suscripción de inventario
    [RequirePermission("inv.itm.read")] // Usuario debe tener permiso de lectura
    public async Task<IActionResult> GetAll()
    {
        // El filtro de multi-tenancy en DbContext asegura que solo vemos los del tenant actual
        var items = await _context.Items
            .Select(i => new { i.Id, i.Code, i.Name, i.Type })
            .ToListAsync();
            
        return Ok(items);
    }

    [HttpPost]
    [RequireFeature("INV_BASIC")]
    [RequirePermission("inv.itm.crt")]
    public async Task<IActionResult> Create([FromBody] CreateItemRequest request)
    {
        // En un escenario real usaríamos MediatR o un Service
        var item = Item.Create(
            request.Code, 
            request.Name, 
            request.Description, 
            request.Type, 
            request.CategoryId, 
            request.UomId);
            
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
    Guid UomId);
