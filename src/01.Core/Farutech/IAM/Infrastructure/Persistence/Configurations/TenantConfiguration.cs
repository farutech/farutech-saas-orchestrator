using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        builder.ToTable("tenants");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.AllowedIpRanges)
            .HasMaxLength(500);

        builder.Property(t => t.PasswordPolicy)
            .HasColumnType("jsonb");

        builder.Property(t => t.FeatureFlags)
            .HasColumnType("jsonb");

        // Indexes
        builder.HasIndex(t => t.Code)
            .IsUnique()
            .HasDatabaseName("ix_tenants_code");

        builder.HasIndex(t => t.IsActive)
            .HasDatabaseName("ix_tenants_is_active");

        // Relationships
        builder.HasMany(t => t.Memberships)
            .WithOne(tm => tm.Tenant)
            .HasForeignKey(tm => tm.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.CustomRoles)
            .WithOne(r => r.Tenant)
            .HasForeignKey(r => r.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(t => t.PolicyRules)
            .WithOne(p => p.Tenant)
            .HasForeignKey(p => p.TenantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
