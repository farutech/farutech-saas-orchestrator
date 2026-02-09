using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class PolicyRuleConfiguration : IEntityTypeConfiguration<PolicyRule>
{
    public void Configure(EntityTypeBuilder<PolicyRule> builder)
    {
        builder.ToTable("policy_rules");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Condition)
            .IsRequired()
            .HasColumnType("jsonb");

        builder.Property(p => p.Permissions)
            .IsRequired()
            .HasColumnType("jsonb");

        // Indexes
        builder.HasIndex(p => p.TenantId)
            .HasDatabaseName("ix_policy_rules_tenant_id");

        builder.HasIndex(p => p.Priority)
            .HasDatabaseName("ix_policy_rules_priority");

        builder.HasIndex(p => p.IsActive)
            .HasDatabaseName("ix_policy_rules_is_active");

        // Relationships
        builder.HasOne(p => p.Tenant)
            .WithMany(t => t.PolicyRules)
            .HasForeignKey(p => p.TenantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
