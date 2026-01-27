using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Farutech.Orchestrator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCodeToTenantInstance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                schema: "tenants",
                table: "TenantInstances",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TenantInstances_CustomerId_Code",
                schema: "tenants",
                table: "TenantInstances",
                columns: new[] { "CustomerId", "Code" },
                unique: true,
                filter: "\"Code\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TenantInstances_CustomerId_Code",
                schema: "tenants",
                table: "TenantInstances");

            migrationBuilder.DropColumn(
                name: "Code",
                schema: "tenants",
                table: "TenantInstances");
        }
    }
}
