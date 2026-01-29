using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Ordeon.Application.Common.Interfaces;
using Ordeon.Domain.Aggregates.POS;
using Ordeon.Infrastructure.Persistence;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Ordeon.Infrastructure.Services;

public sealed class CashierContext : ICashierContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly OrdeonDbContext _context;
    private Guid? _cachedCashierId;

    public CashierContext(IHttpContextAccessor httpContextAccessor, OrdeonDbContext context)
    {
        _httpContextAccessor = httpContextAccessor;
        _context = context;
    }

    public Guid? CashierId => _cachedCashierId;

    public async Task<Guid> GetRequiredCashierIdAsync()
    {
        if (_cachedCashierId.HasValue) return _cachedCashierId.Value;

        var userEmail = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Email);
        var userIdStr = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdStr)) 
            throw new UnauthorizedAccessException("User not identified in request context.");

        if (!Guid.TryParse(userIdStr, out var userId))
            throw new UnauthorizedAccessException("Invalid User ID in token.");

        var cashier = await _context.Cashiers
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cashier == null)
            throw new UnauthorizedAccessException("The authenticated user is not registered as a Cashier.");

        if (!cashier.IsActive)
            throw new UnauthorizedAccessException("Cashier account is inactive.");

        _cachedCashierId = cashier.Id;
        return cashier.Id;
    }
}
