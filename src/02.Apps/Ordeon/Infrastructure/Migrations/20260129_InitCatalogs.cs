using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Farutech.Apps.Ordeon.Infrastructure.Migrations;

public partial class InitCatalogs : Migration
{
    private static readonly string[] columns = ["Id", "Name", "Description", "IsActive", "CreatedAt"];

    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.EnsureSchema(name: "catalog");

        migrationBuilder.CreateTable(
            name: "Products",
            schema: "catalog",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Name = table.Column<string>(type: "text", nullable: false),
                Description = table.Column<string>(type: "text", nullable: true),
                IsActive = table.Column<bool>(type: "bool", nullable: false, defaultValue: true),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Products", x => x.Id);
            });

        // Seed minimal catalog data (idempotent via migration)
        migrationBuilder.InsertData(
            schema: "catalog",
            table: "Products",
            columns: columns,
            values: new object[,]
            {
                { new Guid("00000000-0000-0000-0000-000000000001"), "Default Product", "Producto por defecto", true, new DateTime(2026, 1, 29, 0, 0, 0, DateTimeKind.Utc) },
                { new Guid("00000000-0000-0000-0000-000000000002"), "Service Fee", "Tarifa de servicio por defecto", true, new DateTime(2026, 1, 29, 0, 0, 0, DateTimeKind.Utc) }
            }
        );
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Products", schema: "catalog");
    }
}

