using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Farutech.Apps.Ordeon.API.Authorization;
using Farutech.Apps.Ordeon.Domain.Aggregates.Identity;
using Farutech.Apps.Ordeon.Domain.Aggregates.POS;
using Farutech.Apps.Ordeon.Infrastructure.Persistence;
using System;
using System.Threading.Tasks;

namespace Farutech.Apps.Ordeon.API.Controllers;

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
    [RequirePermission(Permissions.POS.Configuration.Read)]
    public async Task<IActionResult> GetCashiers()
    {
        var cashiers = await _context.Cashiers.ToListAsync();
        return Ok(cashiers);
    }

    [HttpPost]
    [RequirePermission(Permissions.POS.Configuration.Manage)]
    public async Task<IActionResult> CreateCashier([FromBody] CreateCashierRequest request)
    {
        var cashier = Cashier.Create(request.UserId, request.Name);
        if (request.DefaultCashRegisterId.HasValue)
        {
            cashier.AssignDefaultRegister(request.DefaultCashRegisterId.Value);
        }

        _context.Cashiers.Add(cashier);
        await _context.SaveChangesAsync();

        return Ok(cashier);
    }

    [HttpGet("registers")]
    [RequirePermission(Permissions.POS.Configuration.Read)]
    public async Task<IActionResult> GetRegisters()
    {
        var registers = await _context.CashRegisters.ToListAsync();
        return Ok(registers);
    }

    [HttpPost("registers")]
    [RequirePermission(Permissions.POS.Configuration.Manage)]
    public async Task<IActionResult> CreateRegister([FromBody] CreateRegisterRequest request)
    {
        var register = CashRegister.Create(request.Name, request.Code, request.WarehouseId);
        _context.CashRegisters.Add(register);
        await _context.SaveChangesAsync();

        return Ok(register);
    }
}

public record CreateCashierRequest(Guid UserId, string Name, Guid? DefaultCashRegisterId);
public record CreateRegisterRequest(string Name, string Code, Guid WarehouseId);

