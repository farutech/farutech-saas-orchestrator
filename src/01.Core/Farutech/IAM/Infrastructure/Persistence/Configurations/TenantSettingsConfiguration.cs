using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class TenantSettingsConfiguration : IEntityTypeConfiguration<TenantSettings>
{
    public void Configure(EntityTypeBuilder<TenantSettings> builder)
    {
        builder.ToTable("tenant_settings");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.PasswordMinLength)
            .HasDefaultValue(8);

        builder.Property(t => t.PasswordRequireUppercase)
            .HasDefaultValue(true);

        builder.Property(t => t.PasswordRequireLowercase)
            .HasDefaultValue(true);

        builder.Property(t => t.PasswordRequireDigit)
            .HasDefaultValue(true);

        builder.Property(t => t.PasswordRequireSpecialChar)
            .HasDefaultValue(false);

        builder.Property(t => t.MfaRequired)
            .HasDefaultValue(false);

        builder.Property(t => t.MfaGracePeriodDays)
            .HasDefaultValue(7);

        builder.Property(t => t.AccessTokenLifetimeMinutes)
            .HasDefaultValue(480); // 8 hours

        builder.Property(t => t.RefreshTokenLifetimeDays)
            .HasDefaultValue(30);

        builder.Property(t => t.AllowPasswordAuth)
            .HasDefaultValue(true);

        builder.Property(t => t.AllowSocialAuth)
            .HasDefaultValue(false);

        builder.Property(t => t.AllowSamlAuth)
            .HasDefaultValue(false);

        builder.Property(t => t.LockoutEnabled)
            .HasDefaultValue(true);

        builder.Property(t => t.LockoutMaxAttempts)
            .HasDefaultValue(5);

        builder.Property(t => t.LockoutDurationMinutes)
            .HasDefaultValue(30);

        builder.Property(t => t.RequireEmailVerification)
            .HasDefaultValue(true);

        builder.Property(t => t.EmailVerificationTokenLifetimeHours)
            .HasDefaultValue(24);

        // Indexes
        builder.HasIndex(t => t.TenantId)
            .IsUnique()
            .HasDatabaseName("ix_tenant_settings_tenant_id");

        // Foreign key
        builder.HasOne(t => t.Tenant)
            .WithMany()
            .HasForeignKey(t => t.TenantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}