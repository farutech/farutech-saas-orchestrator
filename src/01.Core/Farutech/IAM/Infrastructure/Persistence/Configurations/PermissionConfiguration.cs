using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder.ToTable("permissions");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Code)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Category)
            .HasMaxLength(100);

        builder.Property(p => p.ApplicationId)
            .HasMaxLength(50);

        // Indexes
        builder.HasIndex(p => new { p.Code, p.ApplicationId })
            .IsUnique()
            .HasDatabaseName("ix_permissions_code_app");

        builder.HasIndex(p => p.Category)
            .HasDatabaseName("ix_permissions_category");

        // Relationships
        builder.HasMany(p => p.RolePermissions)
            .WithOne(rp => rp.Permission)
            .HasForeignKey(rp => rp.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
