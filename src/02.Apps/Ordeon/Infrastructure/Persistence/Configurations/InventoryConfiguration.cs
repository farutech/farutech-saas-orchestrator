using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Apps.Ordeon.Domain.Aggregates.Inventory;

namespace Farutech.Apps.Ordeon.Infrastructure.Persistence.Configurations;

public sealed class InventoryConfiguration : 
    IEntityTypeConfiguration<Item>,
    IEntityTypeConfiguration<Category>,
    IEntityTypeConfiguration<UnitOfMeasure>
{
    public void Configure(EntityTypeBuilder<Item> builder)
    {
        builder.HasKey(i => i.Id);
        builder.Property(i => i.Code).IsRequired().HasMaxLength(10);
        builder.Property(i => i.Name).IsRequired().HasMaxLength(200);
        
        builder.HasIndex(i => i.Code).IsUnique();
        builder.HasIndex(i => i.CategoryId);
        builder.HasIndex(i => i.BaseUnitOfMeasureId);

        // Mapeo de JSONB para Postgres
        builder.Property(i => i.MetadataJson)
            .HasColumnType("jsonb")
            .HasDefaultValue("{}");

        builder.HasOne<Category>()
            .WithMany()
            .HasForeignKey(i => i.CategoryId);

        builder.HasOne<UnitOfMeasure>()
            .WithMany()
            .HasForeignKey(i => i.BaseUnitOfMeasureId);
    }

    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Code).IsRequired().HasMaxLength(10);
        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);

        builder.HasIndex(c => c.Code).IsUnique();
        builder.HasIndex(c => c.ParentCategoryId);
    }

    public void Configure(EntityTypeBuilder<UnitOfMeasure> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Name).IsRequired().HasMaxLength(50);
        builder.Property(u => u.Symbol).IsRequired().HasMaxLength(10);

        builder.HasIndex(u => u.Symbol).IsUnique();
    }
}

