using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class EmailVerificationTokenConfiguration : IEntityTypeConfiguration<EmailVerificationToken>
{
    public void Configure(EntityTypeBuilder<EmailVerificationToken> builder)
    {
        builder.ToTable("email_verification_tokens");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Token)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(e => e.IpAddress)
            .HasMaxLength(45); // IPv6 max length

        builder.Property(e => e.UserAgent)
            .HasMaxLength(1000);

        // Ignore computed properties
        builder.Ignore(e => e.IsExpired);
        builder.Ignore(e => e.IsUsed);
        builder.Ignore(e => e.IsValid);

        // Indexes
        builder.HasIndex(e => e.Token)
            .IsUnique()
            .HasDatabaseName("ix_email_verification_tokens_token");

        builder.HasIndex(e => e.UserId)
            .HasDatabaseName("ix_email_verification_tokens_user_id");

        builder.HasIndex(e => e.ExpiresAt)
            .HasDatabaseName("ix_email_verification_tokens_expires_at");

        // Foreign key
        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}