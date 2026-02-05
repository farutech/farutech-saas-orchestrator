using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Farutech.Orchestrator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProvisionTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "tasks");

            migrationBuilder.AddColumn<string>(
                name: "ExternalReference",
                table: "Payments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PaidAmount",
                table: "Invoices",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "ProvisionTasks",
                schema: "tasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TaskId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TenantInstanceId = table.Column<Guid>(type: "uuid", nullable: false),
                    TaskType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "QUEUED"),
                    Progress = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    CurrentStep = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    StepsCompletedJson = table.Column<string>(type: "jsonb", nullable: true, defaultValue: "[]"),
                    ErrorMessage = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    RetryCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    MaxRetries = table.Column<int>(type: "integer", nullable: false, defaultValue: 3),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EstimatedCompletion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    InitiatedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    WorkerId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CorrelationId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProvisionTasks", x => x.Id);
                    table.CheckConstraint("CK_ProvisionTask_Progress", "progress >= 0 AND progress <= 100");
                    table.CheckConstraint("CK_ProvisionTask_Status", "status IN ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')");
                    table.CheckConstraint("CK_ProvisionTask_TaskType", "task_type IN ('TENANT_PROVISION', 'TENANT_DEPROVISION', 'FEATURE_UPDATE', 'INVOICE_GENERATION')");
                    table.ForeignKey(
                        name: "FK_ProvisionTasks_TenantInstances_TenantInstanceId",
                        column: x => x.TenantInstanceId,
                        principalSchema: "tenants",
                        principalTable: "TenantInstances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProvisionTasks_CorrelationId",
                schema: "tasks",
                table: "ProvisionTasks",
                column: "CorrelationId",
                filter: "correlation_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ProvisionTasks_Status_CreatedAt",
                schema: "tasks",
                table: "ProvisionTasks",
                columns: new[] { "Status", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_ProvisionTasks_TaskId",
                schema: "tasks",
                table: "ProvisionTasks",
                column: "TaskId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProvisionTasks_TenantInstanceId",
                schema: "tasks",
                table: "ProvisionTasks",
                column: "TenantInstanceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProvisionTasks",
                schema: "tasks");

            migrationBuilder.DropColumn(
                name: "ExternalReference",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "PaidAmount",
                table: "Invoices");
        }
    }
}
