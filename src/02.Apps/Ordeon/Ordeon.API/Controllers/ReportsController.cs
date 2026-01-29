using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordeon.API.Authorization;
using Ordeon.Domain.Aggregates.Identity;
using Ordeon.Infrastructure.Persistence;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Ordeon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly OrdeonDbContext _context;

    public ReportsController(OrdeonDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Consulta el stock consolidado por artículo y bodega.
    /// Basado en la tabla TransactionRegistry para máxima performance.
    /// </summary>
    [HttpGet("inventory/stock")]
    [RequireFeature("INV_BASIC")]
    [RequirePermission(Permissions.Inventory.Read)]
    public async Task<IActionResult> GetStockBalance(Guid? warehouseId, Guid? itemId)
    {
        var query = _context.TransactionRegistries.AsQueryCollection();

        if (warehouseId.HasValue) query = query.Where(t => t.WarehouseId == warehouseId.Value);
        if (itemId.HasValue) query = query.Where(t => t.ItemId == itemId.Value);

        var stock = await query
            .GroupBy(t => new { t.ItemId, t.WarehouseId })
            .Select(g => new
            {
                g.Key.ItemId,
                g.Key.WarehouseId,
                CurrentStock = g.Sum(t => t.Quantity)
            })
            .ToListAsync();

        return Ok(stock);
    }

    /// <summary>
    /// Resumen de movimientos de una sesión de caja (Z-Report).
    /// </summary>
    [HttpGet("pos/session-summary/{sessionId}")]
    [RequireFeature("POS_BASIC")]
    [RequirePermission(Permissions.POS.CloseSession)]
    public async Task<IActionResult> GetSessionSummary(Guid sessionId)
    {
        var session = await _context.CashSessions
            .Include(s => s.Movements)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null) return NotFound();

        var summary = new
        {
            session.Id,
            session.CashierId,
            session.OpeningBalance,
            session.CalculatedBalance,
            session.DeclaredBalance,
            Difference = session.CalculatedBalance - session.DeclaredBalance,
            Incomes = session.Movements.Where(m => m.IsIncome).Sum(m => m.Amount),
            Withdrawals = session.Movements.Where(m => !m.IsIncome).Sum(m => m.Amount),
            TotalMovements = session.Movements.Count
        };

        return Ok(summary);
    }
}

public static class QueryExtensions 
{
    public static IQueryable<T> AsQueryCollection<T>(this DbSet<T> set) where T : class => set.AsQueryable();
}
