using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Apps.Ordeon.Domain.Aggregates.POS;

namespace Farutech.Apps.Ordeon.Infrastructure.Persistence.Configurations;

public sealed class POSConfiguration : 
    IEntityTypeConfiguration<CashRegister>,
    IEntityTypeConfiguration<Cashier>,
    IEntityTypeConfiguration<CashSession>,
    IEntityTypeConfiguration<CashMovement>
{
    public void Configure(EntityTypeBuilder<CashRegister> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Code).IsRequired().HasMaxLength(10);
        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        
        builder.HasIndex(c => c.Code).IsUnique();
        builder.HasIndex(c => c.WarehouseId);
    }

    public void Configure(EntityTypeBuilder<Cashier> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Name).IsRequired().HasMaxLength(150);
        
        builder.HasIndex(c => c.UserId).IsUnique();
    }

    public void Configure(EntityTypeBuilder<CashSession> builder)
    {
        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.OpeningBalance).HasPrecision(18, 2);
        builder.Property(s => s.DeclaredBalance).HasPrecision(18, 2);
        builder.Property(s => s.CalculatedBalance).HasPrecision(18, 2);

        builder.HasMany(s => s.Movements)
            .WithOne()
            .HasForeignKey(m => m.CashSessionId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public void Configure(EntityTypeBuilder<CashMovement> builder)
    {
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Concept).IsRequired().HasMaxLength(255);
        builder.Property(m => m.Amount).HasPrecision(18, 2);
    }
}

