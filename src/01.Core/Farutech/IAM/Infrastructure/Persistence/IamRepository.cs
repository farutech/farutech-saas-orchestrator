using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Farutech.IAM.Infrastructure.Persistence;

/// <summary>
/// Repository implementation for IAM entities
/// </summary>
public class IamRepository : IIamRepository
{
    private readonly IamDbContext _context;

    public IamRepository(IamDbContext context)
    {
        _context = context;
    }

    // Users
    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        return Task.CompletedTask;
    }

    // Tenants
    public async Task<TenantMembership?> GetMembershipAsync(Guid userId, Guid tenantId)
    {
        return await _context.TenantMemberships
            .Include(tm => tm.User)
            .Include(tm => tm.Tenant)
            .Include(tm => tm.Role)
                .ThenInclude(r => r!.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(tm => 
                tm.UserId == userId && 
                tm.TenantId == tenantId &&
                tm.IsActive);
    }

    public async Task<List<TenantMembership>> GetUserMembershipsAsync(Guid userId)
    {
        return await _context.TenantMemberships
            .Include(tm => tm.Tenant)
            .Include(tm => tm.Role)
            .Where(tm => tm.UserId == userId)
            .ToListAsync();
    }

    // Sessions
    public async Task<Session?> GetSessionByIdAsync(Guid sessionId)
    {
        return await _context.Sessions
            .FirstOrDefaultAsync(s => s.Id == sessionId);
    }

    public async Task AddSessionAsync(Session session)
    {
        await _context.Sessions.AddAsync(session);
    }

    public Task UpdateSessionAsync(Session session)
    {
        _context.Sessions.Update(session);
        return Task.CompletedTask;
    }

    public async Task<List<Session>> GetUserSessionsAsync(Guid userId)
    {
        return await _context.Sessions
            .Where(s => s.UserId == userId)
            .ToListAsync();
    }

    // Refresh Tokens
    public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token);
    }

    public async Task AddRefreshTokenAsync(RefreshToken token)
    {
        await _context.RefreshTokens.AddAsync(token);
    }

    public Task UpdateRefreshTokenAsync(RefreshToken token)
    {
        _context.RefreshTokens.Update(token);
        return Task.CompletedTask;
    }

    // Audit Logs
    public async Task AddAuditLogAsync(AuditLog auditLog)
    {
        await _context.AuditLogs.AddAsync(auditLog);
    }

    // Save changes
    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
