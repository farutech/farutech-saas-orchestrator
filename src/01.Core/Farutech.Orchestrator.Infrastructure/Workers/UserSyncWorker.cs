using System.Data;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Events;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NATS.Client.Core;
using Npgsql;

namespace Farutech.Orchestrator.Infrastructure.Workers;

/// <summary>
/// Worker que escucha eventos de provisioning de instancias y sincroniza el usuario Owner
/// </summary>
public class UserSyncWorker : BackgroundService
{
    private readonly ILogger<UserSyncWorker> _logger;
    private readonly NatsConnection _natsConnection;
    private readonly IServiceProvider _serviceProvider;

    public UserSyncWorker(
        ILogger<UserSyncWorker> logger,
        NatsConnection natsConnection,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _natsConnection = natsConnection;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("UserSyncWorker started and listening for instance provisioning events");

        try
        {
            // Suscribirse al evento de provisioning
            await foreach (var msg in _natsConnection.SubscribeAsync<InstanceProvisionedEvent>(
                "tenant.instance.provisioned", 
                cancellationToken: stoppingToken))
            {
                try
                {
                    var eventData = msg.Data;
                    if (eventData == null)
                    {
                        _logger.LogWarning("Received null event data, skipping");
                        continue;
                    }

                    _logger.LogInformation(
                        "Received provisioning event for Tenant {TenantId}, Owner {OwnerId}",
                        eventData.TenantId,
                        eventData.OwnerId);

                    await ProcessProvisioningEventAsync(eventData);
                    
                    _logger.LogInformation(
                        "Successfully synced Owner {OwnerId} to Tenant {TenantId}",
                        eventData.OwnerId,
                        eventData.TenantId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, 
                        "Error processing provisioning event for message: {Subject}", 
                        msg.Subject);
                }
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("UserSyncWorker is shutting down");
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "Fatal error in UserSyncWorker");
            throw;
        }
    }

    private async Task ProcessProvisioningEventAsync(InstanceProvisionedEvent eventData)
    {
        // Create a new scope for database operations
        using var scope = _serviceProvider.CreateScope();
        var connectionFactory = scope.ServiceProvider.GetRequiredService<IDatabaseConnectionFactory>();

        // 1. Build connection string for the tenant
        var connectionString = connectionFactory.BuildConnectionString(
            eventData.CustomerId,
            eventData.TenantId,
            eventData.IsDedicated,
            eventData.OrgIdentifier);

        _logger.LogDebug("Built connection string for Tenant {TenantId}", eventData.TenantId);

        // 2. Create schema if not exists
        await CreateTenantSchemaAsync(connectionString, eventData.TenantId);

        // 3. Create tables in tenant schema (mae_users, mae_roles, mae_user_roles)
        await CreateTenantTablesAsync(connectionString, eventData.TenantId);

        // 4. Insert Owner user
        await SyncOwnerUserAsync(connectionString, eventData);

        // 5. Assign SuperAdmin role with all permissions
        await AssignSuperAdminRoleAsync(connectionString, eventData);

        _logger.LogInformation(
            "Completed provisioning for Tenant {TenantId} with Owner {OwnerEmail}",
            eventData.TenantId,
            eventData.OwnerEmail);
    }

    private async Task CreateTenantSchemaAsync(string connectionString, Guid tenantId)
    {
        var schemaName = $"tenant_{tenantId:N}";
        
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        var createSchemaQuery = $"CREATE SCHEMA IF NOT EXISTS {schemaName};";
        await using var command = new NpgsqlCommand(createSchemaQuery, connection);
        await command.ExecuteNonQueryAsync();

        _logger.LogInformation("Schema {SchemaName} created/verified", schemaName);
    }

    private async Task CreateTenantTablesAsync(string connectionString, Guid tenantId)
    {
        var schemaName = $"tenant_{tenantId:N}";

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        // Create mae_users table
        var createUsersTable = $@"
            CREATE TABLE IF NOT EXISTS {schemaName}.mae_users (
                user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                global_user_id UUID NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                full_name VARCHAR(255) NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE
            );
            
            CREATE INDEX IF NOT EXISTS idx_mae_users_global_id 
            ON {schemaName}.mae_users(global_user_id);
            
            CREATE INDEX IF NOT EXISTS idx_mae_users_email 
            ON {schemaName}.mae_users(email);
        ";

        // Create mae_roles table
        var createRolesTable = $@"
            CREATE TABLE IF NOT EXISTS {schemaName}.mae_roles (
                role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                role_code VARCHAR(100) NOT NULL UNIQUE,
                role_name VARCHAR(200) NOT NULL,
                description TEXT,
                level INT NOT NULL DEFAULT 0,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_mae_roles_code 
            ON {schemaName}.mae_roles(role_code);
        ";

        // Create mae_user_roles table
        var createUserRolesTable = $@"
            CREATE TABLE IF NOT EXISTS {schemaName}.mae_user_roles (
                user_id UUID NOT NULL,
                role_id UUID NOT NULL,
                granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                granted_by VARCHAR(255),
                PRIMARY KEY (user_id, role_id),
                FOREIGN KEY (user_id) REFERENCES {schemaName}.mae_users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES {schemaName}.mae_roles(role_id) ON DELETE CASCADE
            );
        ";

        // Create mae_permissions table
        var createPermissionsTable = $@"
            CREATE TABLE IF NOT EXISTS {schemaName}.mae_permissions (
                permission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                permission_code VARCHAR(100) NOT NULL UNIQUE,
                permission_name VARCHAR(200) NOT NULL,
                category VARCHAR(50) NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_mae_permissions_code 
            ON {schemaName}.mae_permissions(permission_code);
        ";

        // Create mae_role_permissions table
        var createRolePermissionsTable = $@"
            CREATE TABLE IF NOT EXISTS {schemaName}.mae_role_permissions (
                role_id UUID NOT NULL,
                permission_id UUID NOT NULL,
                granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (role_id, permission_id),
                FOREIGN KEY (role_id) REFERENCES {schemaName}.mae_roles(role_id) ON DELETE CASCADE,
                FOREIGN KEY (permission_id) REFERENCES {schemaName}.mae_permissions(permission_id) ON DELETE CASCADE
            );
        ";

        await using var command = new NpgsqlCommand(
            createUsersTable + createRolesTable + createUserRolesTable + 
            createPermissionsTable + createRolePermissionsTable, 
            connection);
        
        await command.ExecuteNonQueryAsync();

        _logger.LogInformation("Tenant tables created/verified in schema {SchemaName}", schemaName);
    }

    private async Task SyncOwnerUserAsync(string connectionString, InstanceProvisionedEvent eventData)
    {
        var schemaName = $"tenant_{eventData.TenantId:N}";

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        var insertUserQuery = $@"
            INSERT INTO {schemaName}.mae_users 
                (global_user_id, email, full_name, is_active, created_at)
            VALUES 
                (@globalUserId, @email, @fullName, TRUE, @createdAt)
            ON CONFLICT (global_user_id) 
            DO UPDATE SET
                email = EXCLUDED.email,
                full_name = EXCLUDED.full_name,
                updated_at = @updatedAt;
        ";

        await using var command = new NpgsqlCommand(insertUserQuery, connection);
        command.Parameters.AddWithValue("globalUserId", eventData.OwnerId);
        command.Parameters.AddWithValue("email", eventData.OwnerEmail);
        command.Parameters.AddWithValue("fullName", eventData.OwnerFullName);
        command.Parameters.AddWithValue("createdAt", DateTime.UtcNow);
        command.Parameters.AddWithValue("updatedAt", DateTime.UtcNow);

        await command.ExecuteNonQueryAsync();

        _logger.LogInformation(
            "Owner user {Email} synced to schema {SchemaName}",
            eventData.OwnerEmail,
            schemaName);
    }

    private async Task AssignSuperAdminRoleAsync(string connectionString, InstanceProvisionedEvent eventData)
    {
        var schemaName = $"tenant_{eventData.TenantId:N}";

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        // First, ensure SuperAdmin role exists
        var createSuperAdminRole = $@"
            INSERT INTO {schemaName}.mae_roles 
                (role_code, role_name, description, level, is_active, created_at)
            VALUES 
                ('SUPER_ADMIN', 'Super Administrador', 'Acceso total al sistema', 100, TRUE, @createdAt)
            ON CONFLICT (role_code) 
            DO NOTHING
            RETURNING role_id;
        ";

        await using var roleCommand = new NpgsqlCommand(createSuperAdminRole, connection);
        roleCommand.Parameters.AddWithValue("createdAt", DateTime.UtcNow);
        
        var roleIdObj = await roleCommand.ExecuteScalarAsync();
        Guid roleId;

        if (roleIdObj == null)
        {
            // Role already exists, get its ID
            var getRoleIdQuery = $"SELECT role_id FROM {schemaName}.mae_roles WHERE role_code = 'SUPER_ADMIN';";
            await using var getRoleCommand = new NpgsqlCommand(getRoleIdQuery, connection);
            roleIdObj = await getRoleCommand.ExecuteScalarAsync();
            roleId = (Guid)roleIdObj!;
        }
        else
        {
            roleId = (Guid)roleIdObj;
        }

        // Sync all active permissions from global catalog
        await SyncPermissionsToTenantAsync(connection, schemaName, eventData.ActiveFeatureIds);

        // Assign all permissions to SuperAdmin role
        var assignAllPermissions = $@"
            INSERT INTO {schemaName}.mae_role_permissions (role_id, permission_id, granted_at)
            SELECT @roleId, permission_id, @grantedAt
            FROM {schemaName}.mae_permissions
            WHERE is_active = TRUE
            ON CONFLICT (role_id, permission_id) DO NOTHING;
        ";

        await using var permCommand = new NpgsqlCommand(assignAllPermissions, connection);
        permCommand.Parameters.AddWithValue("roleId", roleId);
        permCommand.Parameters.AddWithValue("grantedAt", DateTime.UtcNow);
        await permCommand.ExecuteNonQueryAsync();

        // Assign SuperAdmin role to Owner
        var assignRoleToOwner = $@"
            INSERT INTO {schemaName}.mae_user_roles (user_id, role_id, granted_at, granted_by)
            SELECT u.user_id, @roleId, @grantedAt, 'SYSTEM'
            FROM {schemaName}.mae_users u
            WHERE u.global_user_id = @ownerId
            ON CONFLICT (user_id, role_id) DO NOTHING;
        ";

        await using var userRoleCommand = new NpgsqlCommand(assignRoleToOwner, connection);
        userRoleCommand.Parameters.AddWithValue("roleId", roleId);
        userRoleCommand.Parameters.AddWithValue("ownerId", eventData.OwnerId);
        userRoleCommand.Parameters.AddWithValue("grantedAt", DateTime.UtcNow);
        await userRoleCommand.ExecuteNonQueryAsync();

        _logger.LogInformation(
            "SuperAdmin role assigned to Owner {OwnerId} in schema {SchemaName}",
            eventData.OwnerId,
            schemaName);
    }

    private async Task SyncPermissionsToTenantAsync(
        NpgsqlConnection connection, 
        string schemaName, 
        List<Guid> activeFeatureIds)
    {
        // This would query the global identity.permissions table filtered by active features
        // For now, we'll sync all permissions (simplified)
        var syncPermissionsQuery = $@"
            INSERT INTO {schemaName}.mae_permissions 
                (permission_id, permission_code, permission_name, category, is_active, created_at)
            SELECT 
                p.""Id"",
                p.""Code"",
                p.""Name"",
                p.""Category"",
                p.""IsActive"",
                @createdAt
            FROM identity.permissions p
            WHERE p.""IsActive"" = TRUE 
              AND p.""IsDeleted"" = FALSE
            ON CONFLICT (permission_code) 
            DO UPDATE SET
                permission_name = EXCLUDED.permission_name,
                is_active = EXCLUDED.is_active;
        ";

        await using var command = new NpgsqlCommand(syncPermissionsQuery, connection);
        command.Parameters.AddWithValue("createdAt", DateTime.UtcNow);
        
        var syncedCount = await command.ExecuteNonQueryAsync();
        _logger.LogInformation(
            "Synced {Count} permissions to schema {SchemaName}",
            syncedCount,
            schemaName);
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("UserSyncWorker is stopping");
        return base.StopAsync(cancellationToken);
    }
}
