using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Farutech.IAM.Infrastructure.Persistence;

public class IamDbContext : DbContext
{
    public IamDbContext(DbContextOptions<IamDbContext> options) : base(options)
    {
    }

    // DbSets for all entities
    public DbSet<User> Users { get; set; }
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<TenantMembership> TenantMemberships { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }
    public DbSet<PolicyRule> PolicyRules { get; set; }
    public DbSet<UserClaim> UserClaims { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Session> Sessions { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    // 🔐 PHASE 3-6: New security entities
    public DbSet<EmailVerificationToken> EmailVerificationTokens { get; set; }
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
    public DbSet<TwoFactorBackupCode> TwoFactorBackupCodes { get; set; }
    public DbSet<TenantSettings> TenantSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure schema name
        modelBuilder.HasDefaultSchema("iam");

        // Apply all entity configurations from this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
