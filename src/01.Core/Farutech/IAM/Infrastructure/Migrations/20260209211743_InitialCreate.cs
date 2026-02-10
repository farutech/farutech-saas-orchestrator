using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Farutech.IAM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "iam");

            migrationBuilder.CreateTable(
                name: "permissions",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ApplicationId = table.Column<Guid>(type: "uuid", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tenants",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TaxId = table.Column<string>(type: "text", nullable: true),
                    RequireMfa = table.Column<bool>(type: "boolean", nullable: false),
                    AllowedIpRanges = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    SessionTimeoutMinutes = table.Column<int>(type: "integer", nullable: false),
                    PasswordPolicy = table.Column<string>(type: "jsonb", nullable: true),
                    FeatureFlags = table.Column<string>(type: "jsonb", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenants", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorSecret = table.Column<string>(type: "text", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProfilePictureUrl = table.Column<string>(type: "text", nullable: true),
                    Locale = table.Column<string>(type: "text", nullable: false),
                    Timezone = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ExternalProvider = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ExternalUserId = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "policy_rules",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Condition = table.Column<string>(type: "jsonb", nullable: false),
                    Permissions = table.Column<string>(type: "jsonb", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_policy_rules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_policy_rules_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "iam",
                        principalTable: "tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NormalizedName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    ApplicationId = table.Column<Guid>(type: "uuid", maxLength: 50, nullable: true),
                    IsSystemRole = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_roles_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "iam",
                        principalTable: "tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tenant_security_policies",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    MaxConcurrentSessions = table.Column<int>(type: "integer", nullable: false),
                    MaxDevicesPerUser = table.Column<int>(type: "integer", nullable: false),
                    ForceLogoutOnPasswordChange = table.Column<bool>(type: "boolean", nullable: false),
                    NotifyOnNewDevice = table.Column<bool>(type: "boolean", nullable: false),
                    RequireReauthenticationForSensitiveOperations = table.Column<bool>(type: "boolean", nullable: false),
                    SessionInactivityTimeoutSeconds = table.Column<int>(type: "integer", nullable: false),
                    AllowedCountries = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    BlockedIpRanges = table.Column<string>(type: "text", nullable: false, defaultValue: "[]"),
                    Require2FA = table.Column<bool>(type: "boolean", nullable: false),
                    MinPasswordLength = table.Column<int>(type: "integer", nullable: false),
                    RequirePasswordComplexity = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordExpirationDays = table.Column<int>(type: "integer", nullable: false),
                    PasswordHistoryCount = table.Column<int>(type: "integer", nullable: false),
                    MaxFailedLoginAttempts = table.Column<int>(type: "integer", nullable: false),
                    AccountLockoutDurationMinutes = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenant_security_policies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tenant_security_policies_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "iam",
                        principalTable: "tenants",
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
                name: "audit_logs",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Event = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Result = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Details = table.Column<string>(type: "jsonb", nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_logs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_audit_logs_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "iam",
                        principalTable: "tenants",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_audit_logs_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "iam",
                        principalTable: "users",
                        principalColumn: "Id");
                });

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
                name: "refresh_tokens",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Token = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReplacedByToken = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    DeviceId = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    IpAddress = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refresh_tokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_refresh_tokens_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "iam",
                        principalTable: "tenants",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_refresh_tokens_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "iam",
                        principalTable: "users",
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

            migrationBuilder.CreateTable(
                name: "user_claims",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    ClaimType = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ClaimValue = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_claims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_claims_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "iam",
                        principalTable: "tenants",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_user_claims_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "iam",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_devices",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    DeviceHash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    DeviceName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DeviceType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    OperatingSystem = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Browser = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    LastIpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: false),
                    GeoLocation = table.Column<string>(type: "text", nullable: true),
                    FirstSeen = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastSeen = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsTrusted = table.Column<bool>(type: "boolean", nullable: false),
                    IsBlocked = table.Column<bool>(type: "boolean", nullable: false),
                    BlockReason = table.Column<string>(type: "text", nullable: true),
                    TrustScore = table.Column<int>(type: "integer", nullable: false),
                    Metadata = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_devices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_devices_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "iam",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "role_permissions",
                schema: "iam",
                columns: table => new
                {
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false),
                    PermissionId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role_permissions", x => new { x.RoleId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_role_permissions_permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalSchema: "iam",
                        principalTable: "permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_role_permissions_roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "iam",
                        principalTable: "roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tenant_memberships",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: true),
                    CustomAttributes = table.Column<string>(type: "jsonb", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    GrantedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GrantedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    GrantedByUserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenant_memberships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tenant_memberships_roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "iam",
                        principalTable: "roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_tenant_memberships_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "iam",
                        principalTable: "tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tenant_memberships_users_GrantedByUserId",
                        column: x => x.GrantedByUserId,
                        principalSchema: "iam",
                        principalTable: "users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_tenant_memberships_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "iam",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sessions",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    SessionToken = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    RefreshTokenId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeviceId = table.Column<string>(type: "text", nullable: true),
                    DeviceName = table.Column<string>(type: "text", nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    SessionType = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastActivityAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_sessions_refresh_tokens_RefreshTokenId",
                        column: x => x.RefreshTokenId,
                        principalSchema: "iam",
                        principalTable: "refresh_tokens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_sessions_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "iam",
                        principalTable: "tenants",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_sessions_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "iam",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "security_events",
                schema: "iam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    AnonymizedUserId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    EventType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: false),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    DeviceId = table.Column<Guid>(type: "uuid", nullable: true),
                    OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Success = table.Column<bool>(type: "boolean", nullable: false),
                    Details = table.Column<string>(type: "text", nullable: true),
                    GeoLocation = table.Column<string>(type: "text", nullable: true),
                    RiskScore = table.Column<int>(type: "integer", nullable: false),
                    AlertTriggered = table.Column<bool>(type: "boolean", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_security_events", x => x.Id);
                    table.ForeignKey(
                        name: "FK_security_events_tenants_TenantId",
                        column: x => x.TenantId,
                        principalSchema: "iam",
                        principalTable: "tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_security_events_user_devices_DeviceId",
                        column: x => x.DeviceId,
                        principalSchema: "iam",
                        principalTable: "user_devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_security_events_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "iam",
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_event",
                schema: "iam",
                table: "audit_logs",
                column: "Event");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_tenant_id",
                schema: "iam",
                table: "audit_logs",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_timestamp",
                schema: "iam",
                table: "audit_logs",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_user_event_timestamp",
                schema: "iam",
                table: "audit_logs",
                columns: new[] { "UserId", "Event", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "ix_audit_logs_user_id",
                schema: "iam",
                table: "audit_logs",
                column: "UserId");

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
                name: "ix_permissions_category",
                schema: "iam",
                table: "permissions",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "ix_permissions_code_app",
                schema: "iam",
                table: "permissions",
                columns: new[] { "Code", "ApplicationId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_policy_rules_is_active",
                schema: "iam",
                table: "policy_rules",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "ix_policy_rules_priority",
                schema: "iam",
                table: "policy_rules",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "ix_policy_rules_tenant_id",
                schema: "iam",
                table: "policy_rules",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "ix_refresh_tokens_expires_at",
                schema: "iam",
                table: "refresh_tokens",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_refresh_tokens_TenantId",
                schema: "iam",
                table: "refresh_tokens",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "ix_refresh_tokens_token",
                schema: "iam",
                table: "refresh_tokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_refresh_tokens_user_id",
                schema: "iam",
                table: "refresh_tokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "ix_refresh_tokens_user_tenant_device",
                schema: "iam",
                table: "refresh_tokens",
                columns: new[] { "UserId", "TenantId", "DeviceId" });

            migrationBuilder.CreateIndex(
                name: "ix_role_permissions_permission_id",
                schema: "iam",
                table: "role_permissions",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "ix_roles_is_system_role",
                schema: "iam",
                table: "roles",
                column: "IsSystemRole");

            migrationBuilder.CreateIndex(
                name: "ix_roles_normalized_name_tenant_app",
                schema: "iam",
                table: "roles",
                columns: new[] { "NormalizedName", "TenantId", "ApplicationId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_roles_tenant_id",
                schema: "iam",
                table: "roles",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_security_events_DeviceId",
                schema: "iam",
                table: "security_events",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "ix_security_events_event_type",
                schema: "iam",
                table: "security_events",
                column: "EventType");

            migrationBuilder.CreateIndex(
                name: "ix_security_events_ip_address",
                schema: "iam",
                table: "security_events",
                column: "IpAddress");

            migrationBuilder.CreateIndex(
                name: "ix_security_events_occurred_at",
                schema: "iam",
                table: "security_events",
                column: "OccurredAt");

            migrationBuilder.CreateIndex(
                name: "ix_security_events_success",
                schema: "iam",
                table: "security_events",
                column: "Success");

            migrationBuilder.CreateIndex(
                name: "ix_security_events_tenant_id",
                schema: "iam",
                table: "security_events",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "ix_security_events_user_id",
                schema: "iam",
                table: "security_events",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "ix_sessions_expires_at",
                schema: "iam",
                table: "sessions",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_sessions_RefreshTokenId",
                schema: "iam",
                table: "sessions",
                column: "RefreshTokenId");

            migrationBuilder.CreateIndex(
                name: "ix_sessions_session_token",
                schema: "iam",
                table: "sessions",
                column: "SessionToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_sessions_tenant_id",
                schema: "iam",
                table: "sessions",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "ix_sessions_user_id",
                schema: "iam",
                table: "sessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "ix_sessions_user_tenant_revoked",
                schema: "iam",
                table: "sessions",
                columns: new[] { "UserId", "TenantId", "RevokedAt" });

            migrationBuilder.CreateIndex(
                name: "ix_tenant_memberships_expires_at",
                schema: "iam",
                table: "tenant_memberships",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_tenant_memberships_GrantedByUserId",
                schema: "iam",
                table: "tenant_memberships",
                column: "GrantedByUserId");

            migrationBuilder.CreateIndex(
                name: "ix_tenant_memberships_is_active",
                schema: "iam",
                table: "tenant_memberships",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "ix_tenant_memberships_role_id",
                schema: "iam",
                table: "tenant_memberships",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "ix_tenant_memberships_tenant_id",
                schema: "iam",
                table: "tenant_memberships",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "ix_tenant_memberships_user_tenant",
                schema: "iam",
                table: "tenant_memberships",
                columns: new[] { "UserId", "TenantId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_tenant_security_policies_tenant_id",
                schema: "iam",
                table: "tenant_security_policies",
                column: "TenantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_tenant_settings_tenant_id",
                schema: "iam",
                table: "tenant_settings",
                column: "TenantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_tenants_code",
                schema: "iam",
                table: "tenants",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_tenants_is_active",
                schema: "iam",
                table: "tenants",
                column: "IsActive");

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

            migrationBuilder.CreateIndex(
                name: "ix_user_claims_tenant_id",
                schema: "iam",
                table: "user_claims",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "ix_user_claims_user_tenant_type",
                schema: "iam",
                table: "user_claims",
                columns: new[] { "UserId", "TenantId", "ClaimType" });

            migrationBuilder.CreateIndex(
                name: "ix_user_devices_device_hash",
                schema: "iam",
                table: "user_devices",
                column: "DeviceHash");

            migrationBuilder.CreateIndex(
                name: "ix_user_devices_last_seen",
                schema: "iam",
                table: "user_devices",
                column: "LastSeen");

            migrationBuilder.CreateIndex(
                name: "ix_user_devices_user_device_unique",
                schema: "iam",
                table: "user_devices",
                columns: new[] { "UserId", "DeviceHash" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_user_devices_user_id",
                schema: "iam",
                table: "user_devices",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "ix_users_created_at",
                schema: "iam",
                table: "users",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "ix_users_email",
                schema: "iam",
                table: "users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_external_provider",
                schema: "iam",
                table: "users",
                columns: new[] { "ExternalProvider", "ExternalUserId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "audit_logs",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "email_verification_tokens",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "password_reset_tokens",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "policy_rules",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "role_permissions",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "security_events",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "sessions",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "tenant_memberships",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "tenant_security_policies",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "tenant_settings",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "two_factor_backup_codes",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "user_claims",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "permissions",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "user_devices",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "refresh_tokens",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "roles",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "users",
                schema: "iam");

            migrationBuilder.DropTable(
                name: "tenants",
                schema: "iam");
        }
    }
}
