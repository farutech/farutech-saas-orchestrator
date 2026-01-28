using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("user_roles", "identity");

        // Composite primary key: User + Role + Tenant + Scope
        builder.HasKey(ur => new { ur.UserId, ur.RoleId, ur.TenantId, ur.ScopeId });

        // Relationship: User -> UserRoles
        builder.HasOne(ur => ur.User)
            .WithMany()
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired(false); // Make navigation optional to avoid filter conflicts

        // Relationship: Role -> UserRoles
        builder.HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired(false); // Make navigation optional to avoid filter conflicts

        // Add matching query filter to avoid conflicts with Role filter
        builder.HasQueryFilter(ur => ur.Role != null && !ur.Role.IsDeleted);

        builder.Property(ur => ur.AssignedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ur => ur.AssignedBy)
            .HasMaxLength(200);

        builder.Property(ur => ur.ScopeType)
            .HasMaxLength(50);

        // Indexes for common queries
        builder.HasIndex(ur => ur.UserId)
            .HasDatabaseName("IX_UserRoles_UserId");

        builder.HasIndex(ur => ur.RoleId)
            .HasDatabaseName("IX_UserRoles_RoleId");

        builder.HasIndex(ur => ur.TenantId)
            .HasDatabaseName("IX_UserRoles_TenantId");

        builder.HasIndex(ur => new { ur.UserId, ur.TenantId })
            .HasDatabaseName("IX_UserRoles_UserId_TenantId");

        // Filter for active assignments
        builder.HasIndex(ur => ur.IsActive)
            .HasDatabaseName("IX_UserRoles_IsActive");
    }
}
