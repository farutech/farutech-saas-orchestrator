using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Farutech.Apps.Ordeon.API.Authorization;
using Farutech.Apps.Ordeon.Application.Common.Interfaces;
using Farutech.Apps.Ordeon.Application.POS.Commands;
using Farutech.Apps.Ordeon.Domain.Aggregates.Identity;
using Farutech.Apps.Ordeon.Domain.Aggregates.POS;
using Farutech.Apps.Ordeon.Infrastructure.Persistence;

namespace Farutech.Apps.Ordeon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CashierController : ControllerBase
{
    private readonly OrdeonDbContext _context;
    private readonly ICashierContext _cashierContext;

    public CashierController(OrdeonDbContext context, ICashierContext cashierContext)
    {
        _context = context;
        _cashierContext = cashierContext;
    }

    [HttpPost("open")]
    [RequireFeature("POS_BASIC")]
    [RequirePermission(Permissions.POS.OpenSession)]
    public async Task<IActionResult> OpenSession([FromBody] OpenSessionCommand command)
    {
        var cashierId = await _cashierContext.GetRequiredCashierIdAsync();

        // Validar si ya hay una sesión abierta para esta caja o para este cajero
        var activeSession = await _context.CashSessions
            .AnyAsync(s => (s.CashRegisterId == command.CashRegisterId || s.CashierId == cashierId) 
                           && s.Status == SessionStatus.Open);
        
        if (activeSession) return BadRequest("Active session already exists for this register or cashier.");

        var session = CashSession.Open(
            command.CashRegisterId, 
            cashierId, 
            command.OpeningBalance);

        _context.CashSessions.Add(session);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSession), new { id = session.Id }, session);
    }

    [HttpPost("movement")]
    [RequireFeature("POS_BASIC")]
    [RequirePermission(Permissions.POS.WithdrawCash)]
    public async Task<IActionResult> RegisterMovement([FromBody] RegisterCashMovementCommand command)
    {
        var session = await _context.CashSessions
            .Include(s => s.Movements)
            .FirstOrDefaultAsync(s => s.Id == command.CashSessionId);

        if (session == null) return NotFound();

        session.AddMovement(command.Amount, command.Concept, command.IsIncome);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("close")]
    [RequireFeature("POS_BASIC")]
    [RequirePermission(Permissions.POS.CloseSession)]
    public async Task<IActionResult> CloseSession([FromBody] CloseSessionRequest request)
    {
        var session = await _context.CashSessions
            .FirstOrDefaultAsync(s => s.Id == request.CashSessionId);

        if (session == null) return NotFound();

        session.RequestClose(request.DeclaredBalance);
        await _context.SaveChangesAsync();

        return Ok(new { session.CalculatedBalance, session.DeclaredBalance, Difference = session.CalculatedBalance - session.DeclaredBalance });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSession(Guid id)
    {
        var session = await _context.CashSessions
            .Include(s => s.Movements)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null) return NotFound();
        return Ok(session);
    }
}

