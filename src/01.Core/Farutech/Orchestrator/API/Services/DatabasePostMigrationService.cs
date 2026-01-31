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
                _logger.LogWarning("⚠️ Columna DeploymentType no detectada. Aplicando parche de emergencia...");

                const string alterTableQuery = @"
                    ALTER TABLE tenants.""TenantInstances""
                    ADD COLUMN IF NOT EXISTS ""DeploymentType"" text DEFAULT 'Shared';
                ";

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
        var criticalTables = new[]
        {
            ("identity", "Users"),
            ("tenants", "TenantInstances"),
            ("catalog", "Products"),
            ("identity", "Roles")
        };

        foreach (var (schema, table) in criticalTables)
        {
            var count = await _context.Database.SqlQueryRaw<int>($@"
                SELECT COUNT(*) as ""Value""
                FROM information_schema.tables
                WHERE table_schema = {{0}}
                AND table_name = {{1}}
            ", schema, table).SingleAsync();
            var exists = count > 0;

            if (!exists)
            {
                _logger.LogError($"❌ Tabla crítica faltante: {schema}.{table}");
                throw new InvalidOperationException($"Tabla crítica faltante: {schema}.{table}");
            }
            else
            {
                _logger.LogInformation($"✅ Tabla crítica verificada: {schema}.{table}");
            }
        }
    }
}