using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Farutech.Orchestrator.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateIdentityTableNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                schema: "identity",
                table: "AspNetRoleClaims");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                schema: "identity",
                table: "AspNetUserClaims");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                schema: "identity",
                table: "AspNetUserLogins");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                schema: "identity",
                table: "AspNetUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                schema: "identity",
                table: "AspNetUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                schema: "identity",
                table: "AspNetUserTokens");

            migrationBuilder.DropForeignKey(
                name: "FK_role_permissions_roles_RoleId",
                schema: "identity",
                table: "role_permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_user_roles_roles_RoleId",
                schema: "identity",
                table: "user_roles");

            migrationBuilder.DropTable(
                name: "AspNetRoles",
                schema: "identity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_roles",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropIndex(
                name: "IX_Roles_Code",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropIndex(
                name: "IX_Roles_Level",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AspNetUserTokens",
                schema: "identity",
                table: "AspNetUserTokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AspNetUserRoles",
                schema: "identity",
                table: "AspNetUserRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AspNetUserLogins",
                schema: "identity",
                table: "AspNetUserLogins");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AspNetUserClaims",
                schema: "identity",
                table: "AspNetUserClaims");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AspNetRoleClaims",
                schema: "identity",
                table: "AspNetRoleClaims");

            migrationBuilder.DropColumn(
                name: "Code",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "Description",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "IsSystemRole",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "Level",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "Scope",
                schema: "identity",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                schema: "identity",
                table: "roles");

            migrationBuilder.RenameTable(
                name: "roles",
                schema: "identity",
                newName: "Roles",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "AspNetUserTokens",
                schema: "identity",
                newName: "UserTokens",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "AspNetUserRoles",
                schema: "identity",
                newName: "UserRoles",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "AspNetUserLogins",
                schema: "identity",
                newName: "UserLogins",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "AspNetUserClaims",
                schema: "identity",
                newName: "UserClaims",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "AspNetRoleClaims",
                schema: "identity",
                newName: "RoleClaims",
                newSchema: "identity");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                schema: "identity",
                table: "Roles",
                newName: "ConcurrencyStamp");

            migrationBuilder.RenameIndex(
                name: "IX_AspNetUserRoles_RoleId",
                schema: "identity",
                table: "UserRoles",
                newName: "IX_UserRoles_RoleId1");

            migrationBuilder.RenameIndex(
                name: "IX_AspNetUserLogins_UserId",
                schema: "identity",
                table: "UserLogins",
                newName: "IX_UserLogins_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_AspNetUserClaims_UserId",
                schema: "identity",
                table: "UserClaims",
                newName: "IX_UserClaims_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                schema: "identity",
                table: "RoleClaims",
                newName: "IX_RoleClaims_RoleId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "identity",
                table: "Roles",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedName",
                schema: "identity",
                table: "Roles",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "RoleId1",
                schema: "identity",
                table: "role_permissions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Roles",
                schema: "identity",
                table: "Roles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserTokens",
                schema: "identity",
                table: "UserTokens",
                columns: new[] { "UserId", "LoginProvider", "Name" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRoles",
                schema: "identity",
                table: "UserRoles",
                columns: new[] { "UserId", "RoleId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserLogins",
                schema: "identity",
                table: "UserLogins",
                columns: new[] { "LoginProvider", "ProviderKey" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserClaims",
                schema: "identity",
                table: "UserClaims",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RoleClaims",
                schema: "identity",
                table: "RoleClaims",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "roles",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    IsSystemRole = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Scope = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Tenant"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "identity",
                table: "Roles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_role_permissions_RoleId1",
                schema: "identity",
                table: "role_permissions",
                column: "RoleId1");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Code",
                schema: "identity",
                table: "roles",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Level",
                schema: "identity",
                table: "roles",
                column: "Level");

            migrationBuilder.AddForeignKey(
                name: "FK_role_permissions_Roles_RoleId",
                schema: "identity",
                table: "role_permissions",
                column: "RoleId",
                principalSchema: "identity",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_role_permissions_roles_RoleId1",
                schema: "identity",
                table: "role_permissions",
                column: "RoleId1",
                principalSchema: "identity",
                principalTable: "roles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RoleClaims_Roles_RoleId",
                schema: "identity",
                table: "RoleClaims",
                column: "RoleId",
                principalSchema: "identity",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_roles_roles_RoleId",
                schema: "identity",
                table: "user_roles",
                column: "RoleId",
                principalSchema: "identity",
                principalTable: "roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserClaims_AspNetUsers_UserId",
                schema: "identity",
                table: "UserClaims",
                column: "UserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserLogins_AspNetUsers_UserId",
                schema: "identity",
                table: "UserLogins",
                column: "UserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_AspNetUsers_UserId",
                schema: "identity",
                table: "UserRoles",
                column: "UserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_Roles_RoleId",
                schema: "identity",
                table: "UserRoles",
                column: "RoleId",
                principalSchema: "identity",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserTokens_AspNetUsers_UserId",
                schema: "identity",
                table: "UserTokens",
                column: "UserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_role_permissions_Roles_RoleId",
                schema: "identity",
                table: "role_permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_role_permissions_roles_RoleId1",
                schema: "identity",
                table: "role_permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_RoleClaims_Roles_RoleId",
                schema: "identity",
                table: "RoleClaims");

            migrationBuilder.DropForeignKey(
                name: "FK_user_roles_roles_RoleId",
                schema: "identity",
                table: "user_roles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserClaims_AspNetUsers_UserId",
                schema: "identity",
                table: "UserClaims");

            migrationBuilder.DropForeignKey(
                name: "FK_UserLogins_AspNetUsers_UserId",
                schema: "identity",
                table: "UserLogins");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_AspNetUsers_UserId",
                schema: "identity",
                table: "UserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_Roles_RoleId",
                schema: "identity",
                table: "UserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTokens_AspNetUsers_UserId",
                schema: "identity",
                table: "UserTokens");

            migrationBuilder.DropTable(
                name: "roles",
                schema: "identity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Roles",
                schema: "identity",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "RoleNameIndex",
                schema: "identity",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_role_permissions_RoleId1",
                schema: "identity",
                table: "role_permissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserTokens",
                schema: "identity",
                table: "UserTokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRoles",
                schema: "identity",
                table: "UserRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserLogins",
                schema: "identity",
                table: "UserLogins");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserClaims",
                schema: "identity",
                table: "UserClaims");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RoleClaims",
                schema: "identity",
                table: "RoleClaims");

            migrationBuilder.DropColumn(
                name: "NormalizedName",
                schema: "identity",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "RoleId1",
                schema: "identity",
                table: "role_permissions");

            migrationBuilder.RenameTable(
                name: "Roles",
                schema: "identity",
                newName: "roles",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "UserTokens",
                schema: "identity",
                newName: "AspNetUserTokens",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "UserRoles",
                schema: "identity",
                newName: "AspNetUserRoles",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "UserLogins",
                schema: "identity",
                newName: "AspNetUserLogins",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "UserClaims",
                schema: "identity",
                newName: "AspNetUserClaims",
                newSchema: "identity");

            migrationBuilder.RenameTable(
                name: "RoleClaims",
                schema: "identity",
                newName: "AspNetRoleClaims",
                newSchema: "identity");

            migrationBuilder.RenameColumn(
                name: "ConcurrencyStamp",
                schema: "identity",
                table: "roles",
                newName: "UpdatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_UserRoles_RoleId1",
                schema: "identity",
                table: "AspNetUserRoles",
                newName: "IX_AspNetUserRoles_RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_UserLogins_UserId",
                schema: "identity",
                table: "AspNetUserLogins",
                newName: "IX_AspNetUserLogins_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserClaims_UserId",
                schema: "identity",
                table: "AspNetUserClaims",
                newName: "IX_AspNetUserClaims_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_RoleClaims_RoleId",
                schema: "identity",
                table: "AspNetRoleClaims",
                newName: "IX_AspNetRoleClaims_RoleId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "identity",
                table: "roles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                schema: "identity",
                table: "roles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "identity",
                table: "roles",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "identity",
                table: "roles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "identity",
                table: "roles",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "identity",
                table: "roles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "identity",
                table: "roles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSystemRole",
                schema: "identity",
                table: "roles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Level",
                schema: "identity",
                table: "roles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Scope",
                schema: "identity",
                table: "roles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Tenant");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                schema: "identity",
                table: "roles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_roles",
                schema: "identity",
                table: "roles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AspNetUserTokens",
                schema: "identity",
                table: "AspNetUserTokens",
                columns: new[] { "UserId", "LoginProvider", "Name" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_AspNetUserRoles",
                schema: "identity",
                table: "AspNetUserRoles",
                columns: new[] { "UserId", "RoleId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_AspNetUserLogins",
                schema: "identity",
                table: "AspNetUserLogins",
                columns: new[] { "LoginProvider", "ProviderKey" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_AspNetUserClaims",
                schema: "identity",
                table: "AspNetUserClaims",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AspNetRoleClaims",
                schema: "identity",
                table: "AspNetRoleClaims",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Code",
                schema: "identity",
                table: "roles",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Level",
                schema: "identity",
                table: "roles",
                column: "Level");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "identity",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                schema: "identity",
                table: "AspNetRoleClaims",
                column: "RoleId",
                principalSchema: "identity",
                principalTable: "AspNetRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                schema: "identity",
                table: "AspNetUserClaims",
                column: "UserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                schema: "identity",
                table: "AspNetUserLogins",
                column: "UserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                schema: "identity",
                table: "AspNetUserRoles",
                column: "RoleId",
                principalSchema: "identity",
                principalTable: "AspNetRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                schema: "identity",
                table: "AspNetUserRoles",
                column: "UserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                schema: "identity",
                table: "AspNetUserTokens",
                column: "UserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_role_permissions_roles_RoleId",
                schema: "identity",
                table: "role_permissions",
                column: "RoleId",
                principalSchema: "identity",
                principalTable: "roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_user_roles_roles_RoleId",
                schema: "identity",
                table: "user_roles",
                column: "RoleId",
                principalSchema: "identity",
                principalTable: "roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
