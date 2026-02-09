using Farutech.IAM.Domain.Entities;

namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Repository interface for IAM entities
/// </summary>
public interface IIamRepository
{
    // Users
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByIdAsync(Guid userId);
    Task UpdateUserAsync(User user);
    
    // Tenants
    Task<TenantMembership?> GetMembershipAsync(Guid userId, Guid tenantId);
    Task<List<TenantMembership>> GetUserMembershipsAsync(Guid userId);
    
    // Sessions
    Task<Session?> GetSessionByIdAsync(Guid sessionId);
    Task AddSessionAsync(Session session);
    Task UpdateSessionAsync(Session session);
    Task<List<Session>> GetUserSessionsAsync(Guid userId);
    
    // Refresh Tokens
    Task<RefreshToken?> GetRefreshTokenAsync(string token);
    Task AddRefreshTokenAsync(RefreshToken token);
    Task UpdateRefreshTokenAsync(RefreshToken token);
    
    // Audit Logs
    Task AddAuditLogAsync(AuditLog auditLog);
    
    // Save changes
    Task<int> SaveChangesAsync();
}
