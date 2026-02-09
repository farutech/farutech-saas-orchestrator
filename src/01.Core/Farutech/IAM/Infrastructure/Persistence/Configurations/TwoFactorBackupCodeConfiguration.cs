using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class TwoFactorBackupCodeConfiguration : IEntityTypeConfiguration<TwoFactorBackupCode>
{
    public void Configure(EntityTypeBuilder<TwoFactorBackupCode> builder)
    {
        builder.ToTable("two_factor_backup_codes");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.CodeHash)
            .IsRequired()
            .HasMaxLength(255);

        // Ignore computed properties
        builder.Ignore(t => t.IsUsed);

        // Indexes
        builder.HasIndex(t => t.UserId)
            .HasDatabaseName("ix_two_factor_backup_codes_user_id");

        builder.HasIndex(t => new { t.UserId, t.UsedAt })
            .HasDatabaseName("ix_two_factor_backup_codes_user_id_used_at");

        // Foreign key
        builder.HasOne(t => t.User)
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}