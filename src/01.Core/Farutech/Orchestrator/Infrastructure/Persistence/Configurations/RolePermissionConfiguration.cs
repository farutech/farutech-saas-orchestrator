using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ToTable("role_permissions", "identity");

        // Composite primary key
        builder.HasKey(rp => new { rp.RoleId, rp.PermissionId });

        // Relationship: Role -> RolePermissions
        builder.HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false); // Make navigation optional to avoid filter conflicts

        // Relationship: Permission -> RolePermissions
        builder.HasOne(rp => rp.Permission)
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false); // Make navigation optional to avoid filter conflicts

        // Add matching query filters to avoid conflicts with parent entity filters
        builder.HasQueryFilter(rp =>
            rp.Role != null && !rp.Role.IsDeleted &&
            rp.Permission != null && !rp.Permission.IsDeleted);

        builder.Property(rp => rp.GrantedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(rp => rp.GrantedBy)
            .HasMaxLength(200);

        // Index for queries
        builder.HasIndex(rp => rp.RoleId)
            .HasDatabaseName("IX_RolePermissions_RoleId");

        builder.HasIndex(rp => rp.PermissionId)
            .HasDatabaseName("IX_RolePermissions_PermissionId");
    }
}
