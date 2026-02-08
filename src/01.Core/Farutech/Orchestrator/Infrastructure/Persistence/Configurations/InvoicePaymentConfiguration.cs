using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Billing;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class InvoicePaymentConfiguration : IEntityTypeConfiguration<InvoicePayment>
{
    public void Configure(EntityTypeBuilder<InvoicePayment> builder)
    {
        builder.ToTable("InvoicePayments", "billing");

        builder.HasKey(ip => new { ip.InvoiceId, ip.PaymentId });

        builder.Property(ip => ip.Amount)
            .HasPrecision(18, 2);

        builder.Property(ip => ip.AppliedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(ip => ip.Notes)
            .HasMaxLength(500);

        // Relationships
        builder.HasOne(ip => ip.Invoice)
            .WithMany(i => i.InvoicePayments)
            .HasForeignKey(ip => ip.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ip => ip.Payment)
            .WithMany(p => p.InvoicePayments)
            .HasForeignKey(ip => ip.PaymentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(ip => new { ip.InvoiceId, ip.PaymentId });
        builder.HasIndex(ip => ip.AppliedAt);
    }
}