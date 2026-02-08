using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Billing;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.ToTable("Invoices", "billing");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.InvoiceNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(i => i.Currency)
            .IsRequired()
            .HasMaxLength(3)
            .HasDefaultValue("USD");

        builder.Property(i => i.Status)
            .HasConversion<string>()
            .HasDefaultValue(InvoiceStatus.Draft);

        builder.Property(i => i.Notes)
            .HasMaxLength(1000);

        builder.Property(i => i.Terms)
            .HasMaxLength(1000);

        builder.Property(i => i.PaymentMethod)
            .HasMaxLength(100);

        builder.Property(i => i.ExternalReference)
            .HasMaxLength(255);

        builder.HasIndex(i => i.InvoiceNumber).IsUnique();
        builder.HasIndex(i => i.CustomerId);
        builder.HasIndex(i => i.Status);
        builder.HasIndex(i => i.DueDate);
        builder.HasIndex(i => i.IssueDate);

        // Relationship with Customer - Optional due to global query filter on Customer
        builder.HasOne(i => i.Customer)
            .WithMany() // Customer doesn't have navigation to Invoices
            .HasForeignKey(i => i.CustomerId)
            .IsRequired(false) // Make FK optional
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

        // Self-referencing relationship for items
        builder.HasMany(i => i.Items)
            .WithOne()
            .HasForeignKey("InvoiceId")
            .OnDelete(DeleteBehavior.Cascade);

        // Relationship with Payments through InvoicePayment
        builder.HasMany(i => i.InvoicePayments)
            .WithOne(ip => ip.Invoice)
            .HasForeignKey(ip => ip.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}