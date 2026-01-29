using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ordeon.Domain.Aggregates.Logistics;

namespace Ordeon.Infrastructure.Persistence.Configurations;

public sealed class LogisticsConfiguration : IEntityTypeConfiguration<Warehouse>
{
    public void Configure(EntityTypeBuilder<Warehouse> builder)
    {
        builder.HasKey(w => w.Id);
        builder.Property(w => w.Code).IsRequired().HasMaxLength(50);
        builder.Property(w => w.Name).IsRequired().HasMaxLength(150);
        
        builder.HasIndex(w => new { w.Code, w.TenantId }).IsUnique();
    }
}
