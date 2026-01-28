using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.ToTable("Subscriptions", "tenants");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.SubscriptionType)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(s => s.Price)
            .HasPrecision(18, 2);

        builder.Property(s => s.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(s => s.SubscribedModulesJson)
            .HasColumnType("jsonb");

        builder.Property(s => s.CustomFeaturesJson)
            .HasColumnType("jsonb");

        builder.Property(s => s.CreatedBy)
            .HasMaxLength(100);

        builder.Property(s => s.UpdatedBy)
            .HasMaxLength(100);

        builder.HasIndex(s => s.Status);
        builder.HasIndex(s => new { s.CustomerId, s.ProductId });
        builder.HasIndex(s => s.StartDate);
        builder.HasIndex(s => s.NextBillingDate);
    }
}
