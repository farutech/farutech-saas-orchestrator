using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Apps.Ordeon.Domain.Aggregates.Logistics;

namespace Farutech.Apps.Ordeon.Infrastructure.Persistence.Configurations;

public sealed class LogisticsConfiguration : IEntityTypeConfiguration<Warehouse>
{
    public void Configure(EntityTypeBuilder<Warehouse> builder)
    {
        builder.HasKey(w => w.Id);
        builder.Property(w => w.Code).IsRequired().HasMaxLength(10);
        builder.Property(w => w.Name).IsRequired().HasMaxLength(150);
        
        builder.HasIndex(w => w.Code).IsUnique();
    }
}

