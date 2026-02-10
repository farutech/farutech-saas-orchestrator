using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class TenantSecurityPolicyConfiguration : IEntityTypeConfiguration<TenantSecurityPolicy>
{
    public void Configure(EntityTypeBuilder<TenantSecurityPolicy> builder)
    {
        builder.ToTable("tenant_security_policies");
        builder.HasKey(e => e.Id);
        
        builder.HasIndex(e => e.TenantId).IsUnique().HasDatabaseName("ix_tenant_security_policies_tenant_id");
        
        builder.Property(e => e.AllowedCountries).HasDefaultValue("[]");
        builder.Property(e => e.BlockedIpRanges).HasDefaultValue("[]");

        builder.HasOne(e => e.Tenant)
            .WithOne()
            .HasForeignKey<TenantSecurityPolicy>(e => e.TenantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
