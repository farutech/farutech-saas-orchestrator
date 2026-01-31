using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Farutech.Orchestrator.Infrastructure.Seeding;
using System.Data.Common;

namespace Farutech.Orchestrator.API.Services;

/// <summary>
/// Servicio de bootstrap inteligente para inicialización de base de datos.
/// Garantiza que la base de datos se cree en el orden correcto: Esquemas -> Estructura -> Datos.
/// </summary>
public class DatabaseBootstrapService(OrchestratorDbContext context,
                                      ILogger<DatabaseBootstrapService> logger,
                                      IServiceProvider serviceProvider,
                                      IConfiguration configuration)
{
    private readonly OrchestratorDbContext _context = context;
    private readonly ILogger<DatabaseBootstrapService> _logger = logger;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly IConfiguration _configuration = configuration;
    private static readonly string[] stringArray = ["identity", "tenants", "catalog", "core"];

    private string CommonDatabaseName => _configuration["Database:CommonName"] ?? "farutech_db_custs";
    private string DedicatedDatabasePrefix => _configuration["Database:DedicatedPrefix"] ?? "farutech_db_cust_";

    /// <summary>
    /// Ejecuta el bootstrap completo de la base de datos en orden estricto.
    /// </summary>
    public async Task BootstrapDatabaseAsync()
    {
        _logger.LogInformation("🚀 Iniciando bootstrap inteligente de base de datos...");

        try
        {
            // PASO 1: Crear cimientos (esquemas físicos)
            await CreateDatabaseFoundationsAsync();

            // PASO 2: Crear estructura (migraciones EF Core)
            await CreateDatabaseStructureAsync();

            // PASO 3: Poblar datos iniciales (seeding)
            await SeedInitialDataAsync();

            // PASO 4: Validación final (sanity check)
            await PerformSanityChecksAsync();

            _logger.LogInformation("✅ Bootstrap de base de datos completado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error crítico durante el bootstrap de base de datos");
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
    /// PASO 1: Crear los esquemas físicos base antes de cualquier operación EF Core.
    /// </summary>
    private async Task CreateDatabaseFoundationsAsync()
    {
        _logger.LogInformation("🏗️ Creando cimientos de base de datos (esquemas físicos)...");

        await ExecuteWithRetryAsync(async () =>
        {
            var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();

            try
            {
                var schemas = stringArray;

                foreach (var schema in schemas)
                {
                    var createSchemaQuery = $"CREATE SCHEMA IF NOT EXISTS \"{schema}\";";
                    using var command = connection.CreateCommand();
                    command.CommandText = createSchemaQuery;
                    await command.ExecuteNonQueryAsync();
                    _logger.LogInformation($"✅ Esquema '{schema}' creado/verificado");
                }

                // Asegurar que exista la base de datos para customers (configurable)
                try
                {
                    var connStringBuilder = new NpgsqlConnectionStringBuilder(connection.ConnectionString)
                    {
                        Database = "postgres"
                    };

                    await using var adminConn = new NpgsqlConnection(connStringBuilder.ConnectionString);
                    await adminConn.OpenAsync();

                    try
                    {
                        await using var checkCmd = adminConn.CreateCommand();
                        checkCmd.CommandText = $"SELECT 1 FROM pg_database WHERE datname = '{CommonDatabaseName}'";
                        var exists = await checkCmd.ExecuteScalarAsync();
                        if (exists == null)
                        {
                            await using var createCmd = adminConn.CreateCommand();
                            createCmd.CommandText = $"CREATE DATABASE \"{CommonDatabaseName}\"";
                            await createCmd.ExecuteNonQueryAsync();
                            _logger.LogInformation($"✅ Database '{CommonDatabaseName}' creada");
                        }
                        else
                        {
                            _logger.LogInformation($"✅ Database '{CommonDatabaseName}' ya existe");
                        }
                    }
                    finally
                    {
                        await adminConn.CloseAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"No se pudo crear/verificar la base '{CommonDatabaseName}' -- continuando");
                }

                _logger.LogInformation("✅ Todos los esquemas base creados exitosamente");
                return true; // Retornar algo para que el método funcione
            }
            finally
            {
                await connection.CloseAsync();
            }
        }, "crear esquemas de base de datos", maxRetries: 15, initialDelayMs: 2000);
    }

    /// <summary>
    /// PASO 2: Aplicar migraciones de EF Core para crear tablas dentro de esquemas existentes.
    /// </summary>
    private async Task CreateDatabaseStructureAsync()
    {
        _logger.LogInformation("🔄 Creando estructura de base de datos (migraciones EF Core)...");

        await ExecuteWithRetryAsync(async () =>
        {
            // Aplicar todas las migraciones pendientes
            await _context.Database.MigrateAsync();
            return true;
        }, "aplicar migraciones EF Core", maxRetries: 10, initialDelayMs: 1000);

        _logger.LogInformation("✅ Estructura de base de datos creada exitosamente");
    }

    /// <summary>
    /// PASO 3: Poblar datos iniciales si la base de datos está vacía.
    /// </summary>
    private async Task SeedInitialDataAsync()
    {
        _logger.LogInformation("🌱 Verificando necesidad de seeding inicial...");
        // Ejecutar el seeder idempotente siempre para garantizar que los datos críticos
        // (producto 'ordeon', roles, SuperAdmin, etc.) existan después de reinicios
        // o recreaciones del servicio en Aspire/Podman.
        _logger.LogInformation("📝 Ejecutando seeding idempotente (asegura datos críticos)...");

        // Crear scope para obtener servicios necesarios
        using var scope = _serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var seederLogger = scope.ServiceProvider.GetRequiredService<ILogger<FarutechDataSeeder>>();

        var seeder = new FarutechDataSeeder(_context, userManager, roleManager, seederLogger);
        await seeder.SeedAsync();

        _logger.LogInformation("✅ Seeding idempotente completado (datos críticos verificados/creados)");
    }

    /// <summary>
    /// PASO 4: Validaciones finales y auto-healing si es necesario.
    /// </summary>
    private async Task PerformSanityChecksAsync()
    {
        _logger.LogInformation("🔍 Ejecutando validaciones finales (sanity checks)...");

        // Verificar columna DeploymentType en TenantInstances
        await EnsureDeploymentTypeColumnExistsAsync();

        // Verificar que las tablas críticas existen
        await EnsureCriticalTablesExistAsync();

        _logger.LogInformation("✅ Todas las validaciones pasaron exitosamente");
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
            ("identity", "AspNetUsers"),
            ("tenants", "TenantInstances"),
            ("catalog", "Products"),
            ("identity", "permissions")
        };

        foreach (var (schema, table) in criticalTables)
        {
            var exists = await _context.Database.SqlQueryRaw<int>($@"
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = {{0}}
                AND table_name = {{1}}
            ", schema, table).SingleAsync() > 0;

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