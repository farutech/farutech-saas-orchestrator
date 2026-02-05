using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Billing;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments", "billing");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.PaymentReference)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Currency)
            .IsRequired()
            .HasMaxLength(3)
            .HasDefaultValue("USD");

        builder.Property(p => p.Method)
            .HasConversion<string>();

        builder.Property(p => p.Status)
            .HasConversion<string>()
            .HasDefaultValue(PaymentStatus.Pending);

        builder.Property(p => p.GatewayTransactionId)
            .HasMaxLength(255);

        builder.Property(p => p.ExternalReference)
            .HasMaxLength(255);

        builder.Property(p => p.Notes)
            .HasMaxLength(1000);

        builder.Property(p => p.Metadata)
            .HasColumnType("jsonb");

        builder.HasIndex(p => p.PaymentReference).IsUnique();
        builder.HasIndex(p => p.CustomerId);
        builder.HasIndex(p => p.Status);
        builder.HasIndex(p => p.ProcessedAt);

        // Relationship with Customer - Optional due to global query filter on Customer
        builder.HasOne(p => p.Customer)
            .WithMany() // Customer doesn't have navigation to Payments
            .HasForeignKey(p => p.CustomerId)
            .IsRequired(false) // Make FK optional
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

        // Relationship with Invoices through InvoicePayment
        builder.HasMany(p => p.InvoicePayments)
            .WithOne(ip => ip.Payment)
            .HasForeignKey(ip => ip.PaymentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}