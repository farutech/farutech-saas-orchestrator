using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Apps.Ordeon.Domain.Aggregates.Documents;

namespace Farutech.Apps.Ordeon.Infrastructure.Persistence.Configurations;

public sealed class DocumentConfiguration : 
    IEntityTypeConfiguration<DocumentDefinition>,
    IEntityTypeConfiguration<DocumentHeader>,
    IEntityTypeConfiguration<DocumentLine>,
    IEntityTypeConfiguration<TransactionRegistry>
{
    public void Configure(EntityTypeBuilder<DocumentDefinition> builder)
    {
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Code).IsRequired().HasMaxLength(10);
        builder.Property(d => d.Name).IsRequired().HasMaxLength(100);
        builder.Property(d => d.Prefix).HasMaxLength(10);
        
        builder.HasIndex(d => d.Code).IsUnique();
        
        builder.Property(d => d.ConfigurationJson).HasColumnType("jsonb").HasDefaultValue("{}");
    }

    public void Configure(EntityTypeBuilder<DocumentHeader> builder)
    {
        builder.HasKey(h => h.Id);
        builder.Property(h => h.DocumentNumber).IsRequired().HasMaxLength(20);
        
        builder.HasIndex(h => h.DocumentNumber).IsUnique();

        builder.HasMany(h => h.Lines)
            .WithOne()
            .HasForeignKey(l => l.DocumentHeaderId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasOne<DocumentDefinition>()
            .WithMany()
            .HasForeignKey(h => h.DocumentDefinitionId);
    }

    public void Configure(EntityTypeBuilder<DocumentLine> builder)
    {
        builder.HasKey(l => l.Id);
        builder.Property(l => l.ItemName).IsRequired().HasMaxLength(255);
        
        builder.Property(l => l.Quantity).HasPrecision(18, 4);
        builder.Property(l => l.UnitPrice).HasPrecision(18, 4);

        builder.HasIndex(l => l.ItemId);
    }

    public void Configure(EntityTypeBuilder<TransactionRegistry> builder)
    {
        builder.HasKey(t => t.Id);
        
        builder.HasIndex(t => t.TransactionDate);
        builder.HasIndex(t => t.DocumentHeaderId);
        builder.HasIndex(t => new { t.ItemId, t.WarehouseId, t.Type }); 
        
        builder.Property(t => t.Quantity).HasPrecision(18, 4);
        builder.Property(t => t.Value).HasPrecision(18, 4);
    }
}

