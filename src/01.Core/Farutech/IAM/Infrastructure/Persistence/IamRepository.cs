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

    public async Task AddUserAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        return Task.CompletedTask;
    }

    // Tenants
    public async Task<Tenant?> GetTenantByCodeAsync(string code)
    {
        return await _context.Tenants
            .FirstOrDefaultAsync(t => t.Code.ToLower() == code.ToLower() && t.IsActive);
    }

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

    public async Task AddMembershipAsync(TenantMembership membership)
    {
        await _context.TenantMemberships.AddAsync(membership);
    }

    // Roles
    public async Task<Role?> GetRoleByNameAsync(string name)
    {
        return await _context.Roles
            .FirstOrDefaultAsync(r => r.Name.ToLower() == name.ToLower() && r.IsActive);
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

    // 🔐 PHASE 3-6: New security method implementations
    // Email Verification
    public async Task AddEmailVerificationTokenAsync(EmailVerificationToken token)
    {
        await _context.EmailVerificationTokens.AddAsync(token);
    }

    public Task UpdateEmailVerificationTokenAsync(EmailVerificationToken token)
    {
        _context.EmailVerificationTokens.Update(token);
        return Task.CompletedTask;
    }

    public async Task<EmailVerificationToken?> GetEmailVerificationTokenByTokenAsync(string token)
    {
        return await _context.EmailVerificationTokens
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.Token == token);
    }

    // Password Reset
    public async Task AddPasswordResetTokenAsync(PasswordResetToken token)
    {
        await _context.PasswordResetTokens.AddAsync(token);
    }

    public Task UpdatePasswordResetTokenAsync(PasswordResetToken token)
    {
        _context.PasswordResetTokens.Update(token);
        return Task.CompletedTask;
    }

    public async Task<PasswordResetToken?> GetPasswordResetTokenByTokenAsync(string token)
    {
        return await _context.PasswordResetTokens
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Token == token);
    }

    public async Task RevokeAllUserSessionsAsync(Guid userId)
    {
        var sessions = await _context.Sessions
            .Where(s => s.UserId == userId && s.RevokedAt == null)
            .ToListAsync();

        foreach (var session in sessions)
        {
            session.RevokedAt = DateTime.UtcNow;
        }

        _context.Sessions.UpdateRange(sessions);
    }

    public async Task RevokeAllUserRefreshTokensAsync(Guid userId)
    {
        var refreshTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAt == null)
            .ToListAsync();

        foreach (var token in refreshTokens)
        {
            token.RevokedAt = DateTime.UtcNow;
        }

        _context.RefreshTokens.UpdateRange(refreshTokens);
    }

    // Two-Factor Authentication
    public async Task AddTwoFactorBackupCodesAsync(List<TwoFactorBackupCode> codes)
    {
        await _context.TwoFactorBackupCodes.AddRangeAsync(codes);
    }

    public async Task<List<TwoFactorBackupCode>> GetUserBackupCodesAsync(Guid userId)
    {
        return await _context.TwoFactorBackupCodes
            .Where(c => c.UserId == userId && c.UsedAt == null)
            .ToListAsync();
    }

    public async Task<TwoFactorBackupCode?> GetBackupCodeAsync(Guid userId, string codeHash)
    {
        return await _context.TwoFactorBackupCodes
            .FirstOrDefaultAsync(c => c.UserId == userId && c.CodeHash == codeHash);
    }

    public Task UpdateTwoFactorBackupCodeAsync(TwoFactorBackupCode code)
    {
        _context.TwoFactorBackupCodes.Update(code);
        return Task.CompletedTask;
    }

    // Tenant Settings
    public async Task<TenantSettings?> GetTenantSettingsAsync(Guid tenantId)
    {
        return await _context.TenantSettings
            .Include(ts => ts.Tenant)
            .FirstOrDefaultAsync(ts => ts.TenantId == tenantId);
    }

    public async Task AddTenantSettingsAsync(TenantSettings settings)
    {
        await _context.TenantSettings.AddAsync(settings);
    }

    public Task UpdateTenantSettingsAsync(TenantSettings settings)
    {
        _context.TenantSettings.Update(settings);
        return Task.CompletedTask;
    }

    // Save changes
    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
