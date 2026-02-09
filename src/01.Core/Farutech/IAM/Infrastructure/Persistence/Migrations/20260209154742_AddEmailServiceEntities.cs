using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Farutech.IAM.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailServiceEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "email_verification_tokens",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Token = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_email_verification_tokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_email_verification_tokens_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "iam",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "password_reset_tokens",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Token = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_password_reset_tokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_password_reset_tokens_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "iam",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tenant_settings",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    PasswordMinLength = table.Column<int>(type: "integer", nullable: false, defaultValue: 8),
                    PasswordRequireUppercase = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    PasswordRequireLowercase = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    PasswordRequireDigit = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    PasswordRequireSpecialChar = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    PasswordExpirationDays = table.Column<int>(type: "integer", nullable: true),
                    MfaRequired = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    MfaGracePeriodDays = table.Column<int>(type: "integer", nullable: false, defaultValue: 7),
                    AccessTokenLifetimeMinutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 480),
                    RefreshTokenLifetimeDays = table.Column<int>(type: "integer", nullable: false, defaultValue: 30),
                    SessionIdleTimeoutMinutes = table.Column<int>(type: "integer", nullable: true),
                    MaxConcurrentSessions = table.Column<int>(type: "integer", nullable: true),
                    AllowPasswordAuth = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    AllowSocialAuth = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    AllowSamlAuth = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    LockoutMaxAttempts = table.Column<int>(type: "integer", nullable: false, defaultValue: 5),
                    LockoutDurationMinutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 30),
                    RequireEmailVerification = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    EmailVerificationTokenLifetimeHours = table.Column<int>(type: "integer", nullable: false, defaultValue: 24),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenant_settings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tenant_settings_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "iam",
                        principalTable: "tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "two_factor_backup_codes",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CodeHash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    UsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_two_factor_backup_codes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_two_factor_backup_codes_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "iam",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_email_verification_tokens_expires_at",
                schema: "iam",
                table: "email_verification_tokens",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "ix_email_verification_tokens_token",
                schema: "iam",
                table: "email_verification_tokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_email_verification_tokens_user_id",
                schema: "iam",
                table: "email_verification_tokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "ix_password_reset_tokens_expires_at",
                schema: "iam",
                table: "password_reset_tokens",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "ix_password_reset_tokens_token",
                schema: "iam",
                table: "password_reset_tokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_password_reset_tokens_user_id",
                schema: "iam",
                table: "password_reset_tokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "ix_tenant_settings_tenant_id",
                schema: "iam",
                table: "tenant_settings",
                column: "TenantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_two_factor_backup_codes_user_id",
                schema: "iam",
                table: "two_factor_backup_codes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "ix_two_factor_backup_codes_user_id_used_at",
                schema: "iam",
                table: "two_factor_backup_codes",
                columns: new[] { "UserId", "UsedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "email_verification_tokens",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "password_reset_tokens",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "tenant_settings",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "two_factor_backup_codes",
                schema: "iam");
        }
    }
}
