using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Farutech.Orchestrator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixProvisionTaskConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the problematic constraints with wrong case
            migrationBuilder.DropCheckConstraint(
                name: "CK_ProvisionTask_Progress",
                table: "ProvisionTasks",
                schema: "tasks");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ProvisionTask_Status",
                table: "ProvisionTasks",
                schema: "tasks");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ProvisionTask_TaskType",
                table: "ProvisionTasks",
                schema: "tasks");

            // Recreate constraints with correct case
            migrationBuilder.AddCheckConstraint(
                name: "CK_ProvisionTask_Progress",
                table: "ProvisionTasks",
                schema: "tasks",
                sql: "\"Progress\" >= 0 AND \"Progress\" <= 100");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ProvisionTask_Status",
                table: "ProvisionTasks",
                schema: "tasks",
                sql: "\"Status\" IN ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ProvisionTask_TaskType",
                table: "ProvisionTasks",
                schema: "tasks",
                sql: "\"TaskType\" IN ('TENANT_PROVISION', 'TENANT_DEPROVISION', 'FEATURE_UPDATE', 'INVOICE_GENERATION')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the corrected constraints
            migrationBuilder.DropCheckConstraint(
                name: "CK_ProvisionTask_Progress",
                table: "ProvisionTasks",
                schema: "tasks");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ProvisionTask_Status",
                table: "ProvisionTasks",
                schema: "tasks");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ProvisionTask_TaskType",
                table: "ProvisionTasks",
                schema: "tasks");

            // Recreate the original problematic constraints (for rollback)
            migrationBuilder.AddCheckConstraint(
                name: "CK_ProvisionTask_Progress",
                table: "ProvisionTasks",
                schema: "tasks",
                sql: "progress >= 0 AND progress <= 100");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ProvisionTask_Status",
                table: "ProvisionTasks",
                schema: "tasks",
                sql: "status IN ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ProvisionTask_TaskType",
                table: "ProvisionTasks",
                schema: "tasks",
                sql: "task_type IN ('TENANT_PROVISION', 'TENANT_DEPROVISION', 'FEATURE_UPDATE', 'INVOICE_GENERATION')");
        }
    }
}
