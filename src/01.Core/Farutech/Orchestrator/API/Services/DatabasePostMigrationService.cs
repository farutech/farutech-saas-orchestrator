using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Farutech.Orchestrator.Infrastructure.Persistence;
using System.Data.Common;

namespace Farutech.Orchestrator.API.Services;

/// <summary>
/// Servicio de configuración post-migración para inicialización de base de datos.
/// Se ejecuta DESPUÉS de las migraciones EF Core y ANTES del seeding.
/// Responsabilidades: creación de esquemas físicos adicionales y validaciones.
/// </summary>
public class DatabasePostMigrationService(OrchestratorDbContext context,
                                          ILogger<DatabasePostMigrationService> logger)
{
    private readonly OrchestratorDbContext _context = context;
    private readonly ILogger<DatabasePostMigrationService> _logger = logger;
    private static readonly string[] stringArray = ["identity", "tenants", "catalog", "core"];

    /// <summary>
    /// Ejecuta la configuración post-migración en orden estricto.
    /// </summary>
    public async Task ExecutePostMigrationSetupAsync()
    {
        _logger.LogInformation("🚀 Iniciando configuración post-migración...");

        try
        {
            // PASO 0: Verificar que las migraciones se aplicaron completamente
            await VerifyMigrationsAppliedAsync();

            // PASO 1: Crear esquemas físicos adicionales (si no existen)
            await CreateAdditionalSchemasAsync();

            // PASO 2: Validaciones finales (sanity checks)
            await PerformPostMigrationValidationsAsync();

            _logger.LogInformation("✅ Configuración post-migración completada exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error crítico durante la configuración post-migración");
            throw;
        }
    }

    /// <summary>
    /// Verificar que no hay migraciones pendientes antes de proceder con validaciones.
    /// </summary>
    private async Task VerifyMigrationsAppliedAsync()
    {
        _logger.LogInformation("🔍 Verificando que las migraciones EF Core se aplicaron completamente...");

        var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();

        if (pendingMigrations.Any())
        {
            var migrationList = string.Join(", ", pendingMigrations);
            _logger.LogCritical(
                "❌ Hay {Count} migraciones pendientes que no se aplicaron: {Migrations}. " +
                "Esto indica un problema en el proceso de migración. " +
                "Las validaciones post-migración no pueden continuar.",
                pendingMigrations.Count(), migrationList);

            throw new InvalidOperationException(
                $"Hay {pendingMigrations.Count()} migraciones pendientes: {migrationList}. " +
                "Ejecute las migraciones antes de iniciar la aplicación.");
        }

        _logger.LogInformation("✅ Todas las migraciones EF Core aplicadas correctamente");
    }

    /// <summary>
    /// Método helper para ejecutar operaciones con retry y backoff exponencial.
    /// </summary>
    private async Task<T> ExecuteWithRetryAsync<T>(Func<Task<T>> operation, string operationName, int maxRetries = 10, int initialDelayMs = 1000)
    {
        var delay = initialDelayMs;
        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                _logger.LogInformation($"🔄 Intento {attempt}/{maxRetries} para {operationName}...");
                return await operation();
            }
            catch (Exception ex) when (attempt < maxRetries)
            {
                _logger.LogWarning($"⚠️ Intento {attempt} falló para {operationName}: {ex.Message}. Reintentando en {delay}ms...");
                await Task.Delay(delay);
                delay = Math.Min(delay * 2, 30000); // Backoff exponencial, máximo 30 segundos
            }
        }

        // Último intento sin catch
        _logger.LogInformation($"🔄 Último intento para {operationName}...");
        return await operation();
    }

    /// <summary>
    /// PASO 1: Crear esquemas físicos adicionales requeridos por la aplicación.
    /// Estos esquemas no son manejados por EF Core migrations.
    /// </summary>
    private async Task CreateAdditionalSchemasAsync()
    {
        // Skip schema creation for SQLite since it doesn't support schemas
        if (_context.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        {
            _logger.LogInformation("🏗️ Saltando creación de esquemas (SQLite no soporta schemas)");
            return;
        }

        _logger.LogInformation("🏗️ Creando esquemas físicos adicionales...");

        await ExecuteWithRetryAsync(async () =>
        {
            var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();

            try
            {
                // Lista de esquemas adicionales requeridos
                var additionalSchemas = stringArray;

                foreach (var schema in additionalSchemas)
                {
                    var createSchemaQuery = $"CREATE SCHEMA IF NOT EXISTS \"{schema}\";";
                    using var command = connection.CreateCommand();
                    command.CommandText = createSchemaQuery;
                    await command.ExecuteNonQueryAsync();
                    _logger.LogInformation($"✅ Esquema adicional '{schema}' creado/verificado");
                }

                _logger.LogInformation("✅ Todos los esquemas adicionales creados exitosamente");
                return true;
            }
            finally
            {
                await connection.CloseAsync();
            }
        }, "crear esquemas adicionales", maxRetries: 15, initialDelayMs: 2000);
    }

    /// <summary>
    /// PASO 2: Validaciones post-migración para asegurar integridad.
    /// </summary>
    private async Task PerformPostMigrationValidationsAsync()
    {
        _logger.LogInformation("🔍 Ejecutando validaciones post-migración...");

        // Verificar columna DeploymentType en TenantInstances
        await EnsureDeploymentTypeColumnExistsAsync();

        // Verificar que las tablas críticas existen
        await EnsureCriticalTablesExistAsync();

        _logger.LogInformation("✅ Todas las validaciones post-migración pasaron exitosamente");
    }

    /// <summary>
    /// Auto-healing: Asegurar que la columna DeploymentType existe.
    /// </summary>
    private async Task EnsureDeploymentTypeColumnExistsAsync()
    {
        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();

        try
        {
            // Detectar el tipo de base de datos
            var isSqlite = connection.GetType().Name.Contains("Sqlite");

            string checkColumnQuery;
            if (isSqlite)
            {
                // Para SQLite: usar PRAGMA table_info
                checkColumnQuery = "PRAGMA table_info(TenantInstances)";
            }
            else
            {
                // Para PostgreSQL: usar information_schema
                checkColumnQuery = @"
                    SELECT COUNT(*)
                    FROM information_schema.columns
                    WHERE table_schema = 'tenants'
                    AND table_name = 'TenantInstances'
                    AND column_name = 'DeploymentType'
                ";
            }

            using var command = connection.CreateCommand();
            command.CommandText = checkColumnQuery;

            bool columnExists;
            if (isSqlite)
            {
                // Para SQLite: verificar si DeploymentType existe en los resultados de PRAGMA
                using var reader = await command.ExecuteReaderAsync();
                columnExists = false;
                while (await reader.ReadAsync())
                {
                    var columnName = reader.GetString(1); // name column
                    if (columnName == "DeploymentType")
                    {
                        columnExists = true;
                        break;
                    }
                }
            }
            else
            {
                // Para PostgreSQL: resultado directo del COUNT
                var result = await command.ExecuteScalarAsync();
                columnExists = Convert.ToInt32(result) > 0;
            }

            if (!columnExists)
            {
                _logger.LogWarning("⚠️ Columna DeploymentType no detectada. Aplicando parche de emergencia...");

                string alterTableQuery;
                if (isSqlite)
                {
                    // Para SQLite: sintaxis simple sin esquema
                    alterTableQuery = @"
                        ALTER TABLE TenantInstances
                        ADD COLUMN DeploymentType TEXT DEFAULT 'Shared';
                    ";
                }
                else
                {
                    // Para PostgreSQL: con esquema
                    alterTableQuery = @"
                        ALTER TABLE tenants.""TenantInstances""
                        ADD COLUMN IF NOT EXISTS ""DeploymentType"" text DEFAULT 'Shared';
                    ";
                }

                using var alterCommand = connection.CreateCommand();
                alterCommand.CommandText = alterTableQuery;
                await alterCommand.ExecuteNonQueryAsync();

                _logger.LogInformation("✅ Columna DeploymentType agregada exitosamente");
            }
            else
            {
                _logger.LogInformation("✅ Columna DeploymentType verificada");
            }
        }
        finally
        {
            await connection.CloseAsync();
        }
    }

    /// <summary>
    /// Verificar que las tablas críticas existen.
    /// </summary>
    private async Task EnsureCriticalTablesExistAsync()
    {
        var criticalTables = new[] { "Users", "TenantInstances", "Products", "Roles" };

        var connection = _context.Database.GetDbConnection();
        await connection.OpenAsync();

        try
        {
            // Detectar el tipo de base de datos
            var isSqlite = connection.GetType().Name.Contains("Sqlite");

            foreach (var table in criticalTables)
            {
                bool exists;
                if (isSqlite)
                {
                    // Para SQLite: consultar sqlite_master
                    using var command = connection.CreateCommand();
                    command.CommandText = "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=@tableName";
                    var param = command.CreateParameter();
                    param.ParameterName = "@tableName";
                    param.Value = table;
                    command.Parameters.Add(param);

                    var result = await command.ExecuteScalarAsync();
                    exists = Convert.ToInt32(result) > 0;
                }
                else
                {
                    // Para PostgreSQL: usar information_schema
                    var schema = table switch
                    {
                        "Users" or "Roles" => "identity",
                        "TenantInstances" => "tenants",
                        "Products" => "catalog",
                        _ => "public"
                    };

                    exists = await _context.Database.SqlQueryRaw<bool>($@"
                        SELECT EXISTS (
                            SELECT 1
                            FROM information_schema.tables
                            WHERE table_schema = {{0}}
                              AND table_name = {{1}}
                        ) AS ""Value""
                    ", schema, table).SingleAsync();
                }

                if (!exists)
                {
                    var schema = table switch
                    {
                        "Users" or "Roles" => "identity",
                        "TenantInstances" => "tenants",
                        "Products" => "catalog",
                        _ => "public"
                    };

                    _logger.LogCritical(
                        "❌ Tabla crítica faltante: {Schema}.{Table}. " +
                        "Esto indica que las migraciones de EF Core no se aplicaron correctamente. " +
                        "Verifique la configuración de Identity y el schema '{Schema}'.",
                        schema, table, schema);

                    throw new InvalidOperationException(
                        $"Tabla crítica faltante: {schema}.{table}. " +
                        "Las migraciones de EF Core fallaron o Identity no está configurado correctamente.");
                }
                else
                {
                    _logger.LogInformation("✅ Tabla crítica verificada: {Table}", table);
                }
            }
        }
        finally
        {
            await connection.CloseAsync();
        }
    }
}