using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Catalog;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

/// <summary>
/// Configuración para Subscription Plan (Catálogo de planes disponibles)
/// </summary>
public class SubscriptionPlanConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.ToTable("SubscriptionPlans", "catalog");
        
        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.Code)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(200);
        
        builder.Property(s => s.Description)
            .IsRequired()
            .HasMaxLength(1000);
        
        builder.Property(s => s.MonthlyPrice)
            .HasPrecision(18, 2);
        
        builder.Property(s => s.AnnualPrice)
            .HasPrecision(18, 2);
        
        builder.Property(s => s.LimitsConfig)
            .HasColumnType("jsonb");
        
        // Relaciones
        builder.HasOne(s => s.Product)
            .WithMany()
            .HasForeignKey(s => s.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Índices
        builder.HasIndex(s => s.ProductId);
        builder.HasIndex(s => new { s.ProductId, s.Code }).IsUnique();
        builder.HasIndex(s => s.IsActive);
    }
}

public class SubscriptionFeatureConfiguration : IEntityTypeConfiguration<SubscriptionFeature>
{
    public void Configure(EntityTypeBuilder<SubscriptionFeature> builder)
    {
        builder.ToTable("SubscriptionPlanFeatures", "catalog");
        
        builder.HasKey(sf => sf.Id);
        
        // Relaciones
        builder.HasOne(sf => sf.Subscription)
            .WithMany(s => s.SubscriptionFeatures)
            .HasForeignKey(sf => sf.SubscriptionId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(sf => sf.Feature)
            .WithMany()
            .HasForeignKey(sf => sf.FeatureId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Índices
        builder.HasIndex(sf => new { sf.SubscriptionId, sf.FeatureId }).IsUnique();
    }
}
