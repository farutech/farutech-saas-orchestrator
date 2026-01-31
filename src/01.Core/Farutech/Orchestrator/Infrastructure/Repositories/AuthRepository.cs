using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Farutech.Orchestrator.Infrastructure.Repositories;

/// <summary>
/// Implementación del repositorio para operaciones de autenticación.
/// </summary>
public class AuthRepository(OrchestratorDbContext context) : IAuthRepository
{
    private readonly OrchestratorDbContext _context = context;

    public async Task<IEnumerable<UserCompanyMembership>> GetUserMembershipsAsync(Guid userId)
        => await _context.UserCompanyMemberships
            .Where(m => m.UserId == userId && !m.IsDeleted)
            .Include(m => m.Customer)
            .ToListAsync();

    public async Task<UserCompanyMembership?> GetUserMembershipAsync(Guid userId, Guid customerId)
        => await _context.UserCompanyMemberships
            .FirstOrDefaultAsync(m => m.UserId == userId && m.CustomerId == customerId && !m.IsDeleted);

    public async Task<Customer?> GetCustomerByIdAsync(Guid customerId)
        => await _context.Customers
            .FirstOrDefaultAsync(c => c.Id == customerId && !c.IsDeleted);

    public async Task<IEnumerable<TenantInstance>> GetTenantInstancesAsync(Guid customerId)
        => await _context.TenantInstances
            .Where(i => i.CustomerId == customerId && i.Status != "deprovisioned") // Excluir eliminados
            .ToListAsync();

    public async Task<bool> AddMembershipAsync(UserCompanyMembership membership)
    {
        await _context.UserCompanyMemberships.AddAsync(membership);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<PasswordResetToken> CreatePasswordResetTokenAsync(PasswordResetToken token)
    {
        await _context.PasswordResetTokens.AddAsync(token);
        await _context.SaveChangesAsync();
        return token;
    }

    public async Task<PasswordResetToken?> GetPasswordResetTokenAsync(string token)
        => await _context.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.Token == token);

    public async Task<bool> UpdatePasswordResetTokenAsync(PasswordResetToken token)
    {
        _context.PasswordResetTokens.Update(token);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }
}
