using Farutech.Orchestrator.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

/// <summary>
/// Configuración de EF Core para la entidad UserInvitation.
/// </summary>
public class UserInvitationConfiguration : IEntityTypeConfiguration<UserInvitation>
{
    public void Configure(EntityTypeBuilder<UserInvitation> builder)
    {
        builder.ToTable("UserInvitations");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.Email)
            .IsRequired()
            .HasMaxLength(256);

        // Índice en Email para búsquedas rápidas
        builder.HasIndex(i => i.Email);

        // Índice compuesto para búsquedas por email + status
        builder.HasIndex(i => new { i.Email, i.Status });

        // Índice en Token para validación de invitaciones
        builder.HasIndex(i => i.Token)
            .IsUnique();

        builder.Property(i => i.TargetRole)
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(i => i.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        // Configurar timestamps
        builder.Property(i => i.CreatedAt)
            .IsRequired();

        builder.Property(i => i.ExpirationDate)
            .IsRequired();

        // Soft delete filter
        builder.HasQueryFilter(i => !i.IsDeleted);
    }
}
