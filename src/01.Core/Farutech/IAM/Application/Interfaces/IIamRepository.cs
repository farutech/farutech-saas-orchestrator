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
    Task AddUserAsync(User user);
    Task UpdateUserAsync(User user);
    
    // Tenants
    Task<Tenant?> GetTenantByCodeAsync(string code);
    Task<TenantMembership?> GetMembershipAsync(Guid userId, Guid tenantId);
    Task<List<TenantMembership>> GetUserMembershipsAsync(Guid userId);
    Task AddMembershipAsync(TenantMembership membership);
    
    // Roles
    Task<Role?> GetRoleByNameAsync(string name);
    
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
    
    // 🔐 PHASE 3-6: New security methods
    // Email Verification
    Task AddEmailVerificationTokenAsync(EmailVerificationToken token);
    Task UpdateEmailVerificationTokenAsync(EmailVerificationToken token);
    Task<EmailVerificationToken?> GetEmailVerificationTokenByTokenAsync(string token);
    
    // Password Reset
    Task AddPasswordResetTokenAsync(PasswordResetToken token);
    Task UpdatePasswordResetTokenAsync(PasswordResetToken token);
    Task<PasswordResetToken?> GetPasswordResetTokenByTokenAsync(string token);
    Task RevokeAllUserSessionsAsync(Guid userId);
    Task RevokeAllUserRefreshTokensAsync(Guid userId);
    
    // Two-Factor Authentication
    Task AddTwoFactorBackupCodesAsync(List<TwoFactorBackupCode> codes);
    Task<List<TwoFactorBackupCode>> GetUserBackupCodesAsync(Guid userId);
    Task<TwoFactorBackupCode?> GetBackupCodeAsync(Guid userId, string codeHash);
    Task UpdateTwoFactorBackupCodeAsync(TwoFactorBackupCode code);
    
    // Tenant Settings
    Task<TenantSettings?> GetTenantSettingsAsync(Guid tenantId);
    Task AddTenantSettingsAsync(TenantSettings settings);
    Task UpdateTenantSettingsAsync(TenantSettings settings);
    
    // Save changes
    Task<int> SaveChangesAsync();
}
