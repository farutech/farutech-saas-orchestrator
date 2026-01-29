using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordeon.API.Authorization;
using Ordeon.Domain.Aggregates.POS;
using Ordeon.Infrastructure.Persistence;
using System;
using System.Threading.Tasks;

namespace Ordeon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CashierConfigurationController : ControllerBase
{
    private readonly OrdeonDbContext _context;

    public CashierConfigurationController(OrdeonDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [RequirePermission("pos.cfg.read")]
    public async Task<IActionResult> GetCashiers()
    {
        var cashiers = await _context.Cashiers.ToListAsync();
        return Ok(cashiers);
    }

    [HttpPost]
    [RequirePermission("pos.cfg.mng")]
    public async Task<IActionResult> CreateCashier([FromBody] CreateCashierRequest request, [FromHeader(Name = "X-Tenant-ID")] Guid tenantId)
    {
        var cashier = Cashier.Create(request.UserId, request.Name, tenantId);
        if (request.DefaultCashRegisterId.HasValue)
        {
            cashier.AssignDefaultRegister(request.DefaultCashRegisterId.Value);
        }

        _context.Cashiers.Add(cashier);
        await _context.SaveChangesAsync();

        return Ok(cashier);
    }

    [HttpGet("registers")]
    [RequirePermission("pos.cfg.read")]
    public async Task<IActionResult> GetRegisters()
    {
        var registers = await _context.CashRegisters.ToListAsync();
        return Ok(registers);
    }

    [HttpPost("registers")]
    [RequirePermission("pos.cfg.mng")]
    public async Task<IActionResult> CreateRegister([FromBody] CreateRegisterRequest request, [FromHeader(Name = "X-Tenant-ID")] Guid tenantId)
    {
        var register = CashRegister.Create(request.Name, request.Code, request.WarehouseId, tenantId);
        _context.CashRegisters.Add(register);
        await _context.SaveChangesAsync();

        return Ok(register);
    }
}

public record CreateCashierRequest(Guid UserId, string Name, Guid? DefaultCashRegisterId);
public record CreateRegisterRequest(string Name, string Code, Guid WarehouseId);
