using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Apps.Ordeon.Domain.Aggregates.ThirdParties;
using Farutech.Apps.Ordeon.Domain.Aggregates.Financial;

namespace Farutech.Apps.Ordeon.Infrastructure.Persistence.Configurations;

public sealed class MasterDataConfiguration : 
    IEntityTypeConfiguration<ThirdParty>,
    IEntityTypeConfiguration<PaymentMethod>
{
    public void Configure(EntityTypeBuilder<ThirdParty> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Identification).IsRequired().HasMaxLength(20);
        builder.Property(t => t.Name).IsRequired().HasMaxLength(150);
        builder.Property(t => t.Email).HasMaxLength(100);
        
        builder.HasIndex(t => t.Identification).IsUnique();
    }

    public void Configure(EntityTypeBuilder<PaymentMethod> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Code).IsRequired().HasMaxLength(10);
        builder.Property(p => p.Name).IsRequired().HasMaxLength(50);
        
        builder.HasIndex(p => p.Code).IsUnique();
    }
}

