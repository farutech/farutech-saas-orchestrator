using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Farutech.Orchestrator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ConvertProvisionTaskFieldsToEnums : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_ProvisionTask_TaskType",
                schema: "tasks",
                table: "ProvisionTasks");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ProvisionTask_Status",
                schema: "tasks",
                table: "ProvisionTasks");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                schema: "tasks",
                table: "ProvisionTasks",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Queued",
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldDefaultValue: "QUEUED");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ProvisionTask_Status",
                schema: "tasks",
                table: "ProvisionTasks",
                sql: "status IN ('Queued', 'Processing', 'Completed', 'Failed', 'Cancelled')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ProvisionTask_TaskType",
                schema: "tasks",
                table: "ProvisionTasks",
                sql: "task_type IN ('TenantProvision', 'TenantDeprovision', 'FeatureUpdate', 'InvoiceGeneration')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_ProvisionTask_TaskType",
                schema: "tasks",
                table: "ProvisionTasks");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ProvisionTask_Status",
                schema: "tasks",
                table: "ProvisionTasks");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                schema: "tasks",
                table: "ProvisionTasks",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "QUEUED",
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldDefaultValue: "Queued");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ProvisionTask_Status",
                schema: "tasks",
                table: "ProvisionTasks",
                sql: "status IN ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ProvisionTask_TaskType",
                schema: "tasks",
                table: "ProvisionTasks",
                sql: "task_type IN ('TENANT_PROVISION', 'TENANT_DEPROVISION', 'FEATURE_UPDATE', 'INVOICE_GENERATION')");
        }
    }
}
