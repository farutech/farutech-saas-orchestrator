using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class SecurityEventConfiguration : IEntityTypeConfiguration<SecurityEvent>
{
    public void Configure(EntityTypeBuilder<SecurityEvent> builder)
    {
        builder.ToTable("security_events");
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.EventType).HasMaxLength(50).IsRequired();
        builder.Property(e => e.IpAddress).HasMaxLength(45).IsRequired();
        builder.Property(e => e.AnonymizedUserId).HasMaxLength(64);
        
        builder.HasIndex(e => e.UserId).HasDatabaseName("ix_security_events_user_id");
        builder.HasIndex(e => e.TenantId).HasDatabaseName("ix_security_events_tenant_id");
        builder.HasIndex(e => e.OccurredAt).HasDatabaseName("ix_security_events_occurred_at");
        builder.HasIndex(e => e.EventType).HasDatabaseName("ix_security_events_event_type");
        builder.HasIndex(e => e.IpAddress).HasDatabaseName("ix_security_events_ip_address");
        builder.HasIndex(e => e.Success).HasDatabaseName("ix_security_events_success");

        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(e => e.Device)
            .WithMany()
            .HasForeignKey(e => e.DeviceId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(e => e.Tenant)
            .WithMany()
            .HasForeignKey(e => e.TenantId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
