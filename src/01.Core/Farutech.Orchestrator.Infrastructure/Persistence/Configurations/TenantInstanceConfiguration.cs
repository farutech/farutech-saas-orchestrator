using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class TenantInstanceConfiguration : IEntityTypeConfiguration<TenantInstance>
{
    public void Configure(EntityTypeBuilder<TenantInstance> builder)
    {
        builder.ToTable("TenantInstances", "tenants");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.TenantCode)
            .IsRequired()
            .HasMaxLength(100);

        // User-defined code (unique per customer)
        builder.Property(t => t.Code)
            .HasMaxLength(50);

        builder.Property(t => t.DeploymentType) // Shared or Dedicated
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(t => t.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(t => t.ConnectionString)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(t => t.ApiBaseUrl)
            .HasMaxLength(500);

        // JSONB column for active features with overrides
        builder.Property(t => t.ActiveFeaturesJson)
            .IsRequired()
            .HasColumnType("jsonb")
            .HasDefaultValue("{}");

        builder.Property(t => t.CreatedBy)
            .HasMaxLength(100);

        builder.Property(t => t.UpdatedBy)
            .HasMaxLength(100);

        builder.HasIndex(t => t.TenantCode).IsUnique();
        builder.HasIndex(t => t.Status);
        builder.HasIndex(t => new { t.CustomerId, t.DeploymentType });
        
        // Unique index for user-defined code per customer
        builder.HasIndex(t => new { t.CustomerId, t.Code })
            .IsUnique()
            .HasFilter("\"Code\" IS NOT NULL");
    }
}
