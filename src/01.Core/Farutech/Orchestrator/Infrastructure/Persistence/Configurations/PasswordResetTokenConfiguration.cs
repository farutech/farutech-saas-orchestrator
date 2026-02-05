using Farutech.Orchestrator.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class PasswordResetTokenConfiguration : IEntityTypeConfiguration<PasswordResetToken>
{
    public void Configure(EntityTypeBuilder<PasswordResetToken> builder)
    {
        builder.ToTable("PasswordResetTokens");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(t => t.Token)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(t => t.ExpirationDate)
            .IsRequired();

        builder.Property(t => t.IsUsed)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(t => t.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Índices
        builder.HasIndex(t => t.Token)
            .IsUnique()
            .HasDatabaseName("IX_PasswordResetTokens_Token");

        builder.HasIndex(t => t.Email)
            .HasDatabaseName("IX_PasswordResetTokens_Email");

        builder.HasIndex(t => t.IsUsed)
            .HasDatabaseName("IX_PasswordResetTokens_IsUsed");

        builder.HasIndex(t => t.ExpirationDate)
            .HasDatabaseName("IX_PasswordResetTokens_ExpirationDate");
    }
}
