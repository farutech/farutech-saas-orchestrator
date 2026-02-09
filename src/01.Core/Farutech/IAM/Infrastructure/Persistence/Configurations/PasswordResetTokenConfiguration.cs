using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class PasswordResetTokenConfiguration : IEntityTypeConfiguration<PasswordResetToken>
{
    public void Configure(EntityTypeBuilder<PasswordResetToken> builder)
    {
        builder.ToTable("password_reset_tokens");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Token)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(p => p.IpAddress)
            .HasMaxLength(45); // IPv6 max length

        builder.Property(p => p.UserAgent)
            .HasMaxLength(1000);

        // Ignore computed properties
        builder.Ignore(p => p.IsExpired);
        builder.Ignore(p => p.IsUsed);
        builder.Ignore(p => p.IsValid);

        // Indexes
        builder.HasIndex(p => p.Token)
            .IsUnique()
            .HasDatabaseName("ix_password_reset_tokens_token");

        builder.HasIndex(p => p.UserId)
            .HasDatabaseName("ix_password_reset_tokens_user_id");

        builder.HasIndex(p => p.ExpiresAt)
            .HasDatabaseName("ix_password_reset_tokens_expires_at");

        // Foreign key
        builder.HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}