using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Farutech.Orchestrator.Infrastructure.Persistence;

namespace Farutech.Orchestrator.API.Services;

/// <summary>
/// Servicio de migración automática con auto-healing para esquemas de base de datos.
/// Garantiza que el esquema esté sincronizado antes de que la aplicación acepte tráfico.
/// </summary>
public class MigrationService
{
    private readonly OrchestratorDbContext _context;
    private readonly ILogger<MigrationService> _logger;

    public MigrationService(OrchestratorDbContext context, ILogger<MigrationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Ejecuta verificación y reparación automática del esquema de base de datos.
    /// </summary>
    public async Task EnsureSchemaIntegrityAsync()
    {
        _logger.LogInformation("🔍 Verificando integridad del esquema de base de datos...");

        try
        {
            // 1. Crear esquemas base si no existen
            await CreateBaseSchemasAsync();

            // 2. Aplicar migraciones de EF Core (crea tablas dentro de esquemas)
            await ApplyEfCoreMigrationsAsync();

            // 3. Aplicar parches de columnas faltantes
            await EnsureDeploymentTypeColumnExistsAsync();

            _logger.LogInformation("✅ Integridad del esquema verificada correctamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error crítico durante la verificación del esquema");
            throw;
        }
    }

    /// <summary>
    /// Crea los esquemas base del sistema multi-tenant si no existen.
    /// </summary>
    private async Task CreateBaseSchemasAsync()
    {
        _logger.LogInformation("🏗️ Creando esquemas base del sistema...");

        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();

        try
        {
            // Esquemas del Control Plane (Orchestrator DB)
            var schemas = new[] { "identity", "tenants", "catalog" };

            foreach (var schema in schemas)
            {
                var createSchemaQuery = $"CREATE SCHEMA IF NOT EXISTS \"{schema}\";";
                using var command = connection.CreateCommand();
                command.CommandText = createSchemaQuery;
                await command.ExecuteNonQueryAsync();
                _logger.LogInformation($"✅ Esquema '{schema}' creado/verificado");
            }

            _logger.LogInformation("✅ Todos los esquemas base creados exitosamente");
        }
        finally
        {
            await connection.CloseAsync();
        }
    }

    private async Task EnsureDeploymentTypeColumnExistsAsync()
    {
        const string checkColumnQuery = @"
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_schema = 'tenants' 
            AND table_name = 'TenantInstances' 
            AND column_name = 'DeploymentType'
        ";

        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();

        try
        {
            using var command = connection.CreateCommand();
            command.CommandText = checkColumnQuery;
            var result = await command.ExecuteScalarAsync();
            var columnExists = Convert.ToInt32(result) > 0;

            if (!columnExists)
            {
                _logger.LogWarning("⚠️ Columna DeploymentType no detectada en tenants.TenantInstances. Aplicando parche manual...");

                // Alteración de emergencia
                const string alterTableQuery = @"
                    ALTER TABLE tenants.""TenantInstances"" 
                    ADD COLUMN IF NOT EXISTS ""DeploymentType"" text DEFAULT 'Shared';
                ";

                using var alterCommand = connection.CreateCommand();
                alterCommand.CommandText = alterTableQuery;
                await alterCommand.ExecuteNonQueryAsync();

                _logger.LogInformation("✅ Columna DeploymentType agregada exitosamente con parche manual");
            }
            else
            {
                _logger.LogInformation("✅ Columna DeploymentType ya existe en el esquema");
            }
        }
        finally
        {
            await connection.CloseAsync();
        }
    }

    private async Task ApplyEfCoreMigrationsAsync()
    {
        _logger.LogInformation("🔄 Aplicando migraciones de Entity Framework Core...");

        // Aplicar todas las migraciones pendientes
        await _context.Database.MigrateAsync();

        _logger.LogInformation("✅ Migraciones de EF Core aplicadas exitosamente");
    }
}