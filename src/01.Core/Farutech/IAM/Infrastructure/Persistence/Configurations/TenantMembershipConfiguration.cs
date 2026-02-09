using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class TenantMembershipConfiguration : IEntityTypeConfiguration<TenantMembership>
{
    public void Configure(EntityTypeBuilder<TenantMembership> builder)
    {
        builder.ToTable("tenant_memberships");

        builder.HasKey(tm => tm.Id);

        builder.Property(tm => tm.CustomAttributes)
            .HasColumnType("jsonb");

        // Indexes
        builder.HasIndex(tm => new { tm.UserId, tm.TenantId })
            .IsUnique()
            .HasDatabaseName("ix_tenant_memberships_user_tenant");

        builder.HasIndex(tm => tm.TenantId)
            .HasDatabaseName("ix_tenant_memberships_tenant_id");

        builder.HasIndex(tm => tm.RoleId)
            .HasDatabaseName("ix_tenant_memberships_role_id");

        builder.HasIndex(tm => tm.IsActive)
            .HasDatabaseName("ix_tenant_memberships_is_active");

        builder.HasIndex(tm => tm.ExpiresAt)
            .HasDatabaseName("ix_tenant_memberships_expires_at");

        // Relationships
        builder.HasOne(tm => tm.User)
            .WithMany(u => u.TenantMemberships)
            .HasForeignKey(tm => tm.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tm => tm.Tenant)
            .WithMany(t => t.Memberships)
            .HasForeignKey(tm => tm.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tm => tm.Role)
            .WithMany(r => r.Memberships)
            .HasForeignKey(tm => tm.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
