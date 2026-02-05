using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Catalog;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class FeatureConfiguration : IEntityTypeConfiguration<Feature>
{
    public void Configure(EntityTypeBuilder<Feature> builder)
    {
        builder.ToTable("Features");

        builder.HasKey(f => f.Id);

        builder.Property(f => f.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(f => f.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(f => f.Description)
            .HasMaxLength(1000);

        builder.Property(f => f.AdditionalCost)
            .HasPrecision(18, 2);

        builder.Property(f => f.CreatedBy)
            .HasMaxLength(100);

        builder.Property(f => f.UpdatedBy)
            .HasMaxLength(100);

        builder.HasIndex(f => new { f.ModuleId, f.Code }).IsUnique();
        builder.HasIndex(f => f.IsActive);
    }
}
