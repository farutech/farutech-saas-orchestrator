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
public class CategoriesController : ControllerBase
{
    private readonly OrdeonDbContext _context;

    public CategoriesController(OrdeonDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [RequirePermission(Permissions.Inventory.Read)]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Categories.ToListAsync());
    }

    [HttpPost]
    [RequirePermission(Permissions.Inventory.Create)]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
    {
        var category = Category.Create(
            request.Code,
            request.Name,
            request.Description,
            request.ParentCategoryId);

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = category.Id }, category);
    }
}

public record CreateCategoryRequest(
    string Code,
    string Name,
    string Description,
    Guid? ParentCategoryId);

