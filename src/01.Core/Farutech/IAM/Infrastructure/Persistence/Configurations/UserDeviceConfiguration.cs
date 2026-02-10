using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class UserDeviceConfiguration : IEntityTypeConfiguration<UserDevice>
{
    public void Configure(EntityTypeBuilder<UserDevice> builder)
    {
        builder.ToTable("user_devices");
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.DeviceHash).HasMaxLength(128).IsRequired();
        builder.Property(e => e.DeviceName).HasMaxLength(100).IsRequired();
        builder.Property(e => e.DeviceType).HasMaxLength(20).IsRequired();
        builder.Property(e => e.OperatingSystem).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Browser).HasMaxLength(50).IsRequired();
        builder.Property(e => e.LastIpAddress).HasMaxLength(45).IsRequired();
        
        builder.HasIndex(e => e.UserId).HasDatabaseName("ix_user_devices_user_id");
        builder.HasIndex(e => e.DeviceHash).HasDatabaseName("ix_user_devices_device_hash");
        builder.HasIndex(e => e.LastSeen).HasDatabaseName("ix_user_devices_last_seen");
        builder.HasIndex(e => new { e.UserId, e.DeviceHash }).IsUnique().HasDatabaseName("ix_user_devices_user_device_unique");

        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
