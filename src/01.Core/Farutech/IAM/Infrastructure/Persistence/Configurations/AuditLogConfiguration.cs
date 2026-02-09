using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Event)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.Result)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(a => a.Details)
            .HasColumnType("jsonb");

        builder.Property(a => a.IpAddress)
            .HasMaxLength(45);

        builder.Property(a => a.UserAgent)
            .HasMaxLength(500);

        // Indexes
        builder.HasIndex(a => a.UserId)
            .HasDatabaseName("ix_audit_logs_user_id");

        builder.HasIndex(a => a.TenantId)
            .HasDatabaseName("ix_audit_logs_tenant_id");

        builder.HasIndex(a => a.Event)
            .HasDatabaseName("ix_audit_logs_event");

        builder.HasIndex(a => a.Timestamp)
            .HasDatabaseName("ix_audit_logs_timestamp");

        builder.HasIndex(a => new { a.UserId, a.Event, a.Timestamp })
            .HasDatabaseName("ix_audit_logs_user_event_timestamp");
    }
}
