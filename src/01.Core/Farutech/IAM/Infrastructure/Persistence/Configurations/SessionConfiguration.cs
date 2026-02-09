using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.IAM.Infrastructure.Persistence.Configurations;

public class SessionConfiguration : IEntityTypeConfiguration<Session>
{
    public void Configure(EntityTypeBuilder<Session> builder)
    {
        builder.ToTable("sessions");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.SessionToken)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(s => s.UserAgent)
            .HasMaxLength(1000);

        // Ignorar propiedades calculadas
        builder.Ignore(s => s.IsExpired);
        builder.Ignore(s => s.IsRevoked);
        builder.Ignore(s => s.IsActive);

        // Indexes
        builder.HasIndex(s => s.SessionToken)
            .IsUnique()
            .HasDatabaseName("ix_sessions_session_token");

        builder.HasIndex(s => s.UserId)
            .HasDatabaseName("ix_sessions_user_id");

        builder.HasIndex(s => s.TenantId)
            .HasDatabaseName("ix_sessions_tenant_id");

        builder.HasIndex(s => s.ExpiresAt)
            .HasDatabaseName("ix_sessions_expires_at");

        builder.HasIndex(s => new { s.UserId, s.TenantId, s.RevokedAt })
            .HasDatabaseName("ix_sessions_user_tenant_revoked");

        // Relationships
        builder.HasOne(s => s.User)
            .WithMany(u => u.Sessions)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.RefreshToken)
            .WithMany()
            .HasForeignKey(s => s.RefreshTokenId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
