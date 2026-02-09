using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("roles");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(r => r.NormalizedName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(r => r.ApplicationId)
            .HasMaxLength(50);

        // Indexes
        builder.HasIndex(r => new { r.NormalizedName, r.TenantId, r.ApplicationId })
            .IsUnique()
            .HasDatabaseName("ix_roles_normalized_name_tenant_app");

        builder.HasIndex(r => r.TenantId)
            .HasDatabaseName("ix_roles_tenant_id");

        builder.HasIndex(r => r.IsSystemRole)
            .HasDatabaseName("ix_roles_is_system_role");

        // Relationships
        builder.HasOne(r => r.Tenant)
            .WithMany(t => t.CustomRoles)
            .HasForeignKey(r => r.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(r => r.RolePermissions)
            .WithOne(rp => rp.Role)
            .HasForeignKey(rp => rp.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(r => r.Memberships)
            .WithOne(tm => tm.Role)
            .HasForeignKey(tm => tm.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
