using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Farutech.Orchestrator.Domain.Entities.Catalog;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Catalog = Farutech.Orchestrator.Domain.Entities.Catalog;
using Tenants = Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Infrastructure.Persistence;

/// <summary>
/// Main application DbContext with multi-tenancy support and Identity integration
/// </summary>
public class OrchestratorDbContext(DbContextOptions<OrchestratorDbContext> options) 
    : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>(options)
{
    // Catalog Schema (Global)
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Module> Modules => Set<Module>();
    public DbSet<Feature> Features => Set<Feature>();
    public DbSet<Catalog.Subscription> SubscriptionPlans => Set<Catalog.Subscription>();
    public DbSet<SubscriptionFeature> SubscriptionFeatures => Set<SubscriptionFeature>();

    // Tenants Schema (Multi-tenant)
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<TenantInstance> TenantInstances => Set<TenantInstance>();
    public DbSet<Tenants.Subscription> TenantSubscriptions => Set<Tenants.Subscription>();

    // Identity Schema
    public DbSet<UserCompanyMembership> UserCompanyMemberships => Set<UserCompanyMembership>();
    public DbSet<UserInvitation> UserInvitations => Set<UserInvitation>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

     // Eliminado: tablas custom Permissions y RolePermissions

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Renombrar tablas Identity sin prefijo AspNet
        modelBuilder.Entity<ApplicationUser>().ToTable("Users", "identity");
        modelBuilder.Entity<ApplicationRole>().ToTable("Roles", "identity");
        modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles", "identity");
        modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims", "identity");
        modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins", "identity");
        modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens", "identity");
        modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims", "identity");
        modelBuilder.Entity<PasswordResetToken>().ToTable("PasswordResetTokens", "identity");

        // Apply all configurations from assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(OrchestratorDbContext).Assembly);

        // Global query filter for multi-tenancy on TenantInstance
        // Disabled for migrations - applied at runtime via scoped service
        // if (!string.IsNullOrEmpty(_currentTenantCode))
        // {
        //     modelBuilder.Entity<TenantInstance>()
        //         .HasQueryFilter(t => t.TenantCode == _currentTenantCode);
        // }

        // Soft delete filter
        modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
        modelBuilder.Entity<Module>().HasQueryFilter(m => !m.IsDeleted);
        modelBuilder.Entity<Feature>().HasQueryFilter(f => !f.IsDeleted);
        modelBuilder.Entity<Catalog.Subscription>().HasQueryFilter(s => !s.IsDeleted);
        modelBuilder.Entity<SubscriptionFeature>().HasQueryFilter(sf => !sf.IsDeleted);
        modelBuilder.Entity<Customer>().HasQueryFilter(c => !c.IsDeleted);
        modelBuilder.Entity<TenantInstance>().HasQueryFilter(t => !t.IsDeleted);
        modelBuilder.Entity<Tenants.Subscription>().HasQueryFilter(s => !s.IsDeleted);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Auto-update timestamps
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity is Domain.Common.BaseEntity entity)
            {
                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }
                else
                {
                    entity.UpdatedAt = DateTime.UtcNow;
                }
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
