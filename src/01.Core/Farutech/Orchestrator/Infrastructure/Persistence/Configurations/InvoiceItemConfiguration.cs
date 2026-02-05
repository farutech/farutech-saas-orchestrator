using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Billing;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class InvoiceItemConfiguration : IEntityTypeConfiguration<InvoiceItem>
{
    public void Configure(EntityTypeBuilder<InvoiceItem> builder)
    {
        builder.ToTable("InvoiceItems", "billing");

        builder.HasKey(ii => ii.Id);

        builder.Property(ii => ii.Description)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(ii => ii.ItemType)
            .HasConversion<string>();

        builder.Property(ii => ii.ProductCode)
            .HasMaxLength(100);

        builder.Property(ii => ii.Quantity)
            .HasPrecision(18, 4);

        builder.Property(ii => ii.UnitPrice)
            .HasPrecision(18, 4);

        builder.Property(ii => ii.Discount)
            .HasPrecision(18, 4);

        builder.HasIndex(ii => ii.InvoiceId);
        builder.HasIndex(ii => ii.ReferenceId);
        builder.HasIndex(ii => ii.ProductCode);

        // Relationship with Invoice
        builder.HasOne<Invoice>()
            .WithMany(i => i.Items)
            .HasForeignKey(ii => ii.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}