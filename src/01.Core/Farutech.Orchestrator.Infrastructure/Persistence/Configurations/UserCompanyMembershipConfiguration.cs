using Farutech.Orchestrator.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class UserCompanyMembershipConfiguration : IEntityTypeConfiguration<UserCompanyMembership>
{
    public void Configure(EntityTypeBuilder<UserCompanyMembership> builder)
    {
        builder.ToTable("UserCompanyMemberships", "identity");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Role)
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(m => m.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(m => m.GrantedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Índices
        builder.HasIndex(m => new { m.UserId, m.CustomerId })
            .IsUnique()
            .HasDatabaseName("IX_UserCompanyMemberships_User_Customer");

        builder.HasIndex(m => m.CustomerId)
            .HasDatabaseName("IX_UserCompanyMemberships_CustomerId");

        builder.HasIndex(m => m.IsActive)
            .HasDatabaseName("IX_UserCompanyMemberships_IsActive");

        // Relationships
        builder.HasOne(m => m.User)
            .WithMany(u => u.CompanyMemberships)
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.Customer)
            .WithMany(c => c.UserMemberships)
            .HasForeignKey(m => m.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        // Soft Delete Filter
        builder.HasQueryFilter(m => !m.IsDeleted);
    }
}
