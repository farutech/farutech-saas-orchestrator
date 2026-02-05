using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Entities.Tasks;
using Farutech.Orchestrator.Domain.Enums;

namespace Farutech.Orchestrator.Infrastructure.Persistence.Configurations;

public class ProvisionTaskConfiguration : IEntityTypeConfiguration<ProvisionTask>
{
    public void Configure(EntityTypeBuilder<ProvisionTask> builder)
    {
        builder.ToTable("ProvisionTasks", t =>
        {
            t.HasCheckConstraint("CK_ProvisionTask_Progress", "progress >= 0 AND progress <= 100");
            t.HasCheckConstraint("CK_ProvisionTask_Status", "Status IN ('Queued', 'Processing', 'Completed', 'Failed', 'Cancelled')");
            t.HasCheckConstraint("CK_ProvisionTask_TaskType", "TaskType IN ('TenantProvision', 'TenantDeprovision', 'FeatureUpdate', 'InvoiceGeneration')");
        });

        builder.Property(t => t.TaskId)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(t => t.TaskType)
            .HasMaxLength(50)
            .IsRequired()
            .HasConversion<string>(); // Store enum as string in database

        builder.Property(t => t.Status)
            .HasMaxLength(20)
            .IsRequired()
            .HasDefaultValue(ProvisionTaskStatus.Queued)
            .HasConversion<string>(); // Store enum as string in database

        builder.Property(t => t.Progress)
            .HasDefaultValue(0);

        builder.Property(t => t.CurrentStep)
            .HasMaxLength(100);

        builder.Property(t => t.StepsCompletedJson)
            .HasColumnType("jsonb")
            .HasDefaultValue("[]");

        builder.Property(t => t.ErrorMessage)
            .HasMaxLength(2000);

        builder.Property(t => t.RetryCount)
            .HasDefaultValue(0);

        builder.Property(t => t.MaxRetries)
            .HasDefaultValue(3);

        builder.Property(t => t.InitiatedBy)
            .HasMaxLength(100);

        builder.Property(t => t.WorkerId)
            .HasMaxLength(100);

        builder.Property(t => t.CorrelationId)
            .HasMaxLength(100);

        // Indexes
        builder.HasIndex(t => t.TaskId)
            .IsUnique();

        builder.HasIndex(t => t.TenantInstanceId);

        builder.HasIndex(t => new { t.Status, t.CreatedAt });

        builder.HasIndex(t => t.CorrelationId)
            .HasFilter("CorrelationId IS NOT NULL");

        // Relationships
        builder.HasOne(t => t.TenantInstance)
            .WithMany()
            .HasForeignKey(t => t.TenantInstanceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}