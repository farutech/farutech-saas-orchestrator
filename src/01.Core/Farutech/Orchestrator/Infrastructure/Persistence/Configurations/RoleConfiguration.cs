using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("roles", "identity");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Code)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(r => r.Description)
            .HasMaxLength(500);

        builder.Property(r => r.Scope)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("Tenant");

        // Unique constraint on Code
        builder.HasIndex(r => r.Code)
            .IsUnique()
            .HasDatabaseName("IX_Roles_Code");

        // Index for queries by Level
        builder.HasIndex(r => r.Level)
            .HasDatabaseName("IX_Roles_Level");

        // Soft delete filter
        builder.HasQueryFilter(r => !r.IsDeleted);
    }
}
