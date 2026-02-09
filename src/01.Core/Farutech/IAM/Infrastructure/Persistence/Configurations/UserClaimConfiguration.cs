using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class UserClaimConfiguration : IEntityTypeConfiguration<UserClaim>
{
    public void Configure(EntityTypeBuilder<UserClaim> builder)
    {
        builder.ToTable("user_claims");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.ClaimType)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.ClaimValue)
            .HasMaxLength(500);

        // Indexes
        builder.HasIndex(c => new { c.UserId, c.TenantId, c.ClaimType })
            .HasDatabaseName("ix_user_claims_user_tenant_type");

        builder.HasIndex(c => c.TenantId)
            .HasDatabaseName("ix_user_claims_tenant_id");

        // Relationships
        builder.HasOne(c => c.User)
            .WithMany(u => u.Claims)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
