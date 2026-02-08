using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Npgsql;

namespace Farutech.Orchestrator.Infrastructure.Extensions;

/// <summary>
/// Extensiones para ejecutar migraciones automáticamente al iniciar la aplicación
/// </summary>
public static class MigrationExtensions
{
    /// <summary>
    /// Aplica las migraciones pendientes y ejecuta el seeder en desarrollo
    /// </summary>
    /// <param name="app">La aplicación web</param>
    /// <returns>La aplicación web para encadenamiento</returns>
    public static async Task<IHost> ApplyMigrationsAsync(this IHost app, bool allowResetOnFailure = false)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<OrchestratorDbContext>>();

        try
        {
            logger.LogInformation("🔄 Aplicando migraciones de base de datos...");
            
            var context = services.GetRequiredService<OrchestratorDbContext>();
            
            // Ensure we're in the correct schema context for migrations
            await context.Database.ExecuteSqlRawAsync("SET search_path TO public, identity, tenants, catalog, core;");
            
            // Aplicar migraciones
            await context.Database.MigrateAsync();
            logger.LogInformation("✅ Migraciones aplicadas exitosamente");

            // Log de estado post-migración
            var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
            if (pendingMigrations.Any())
            {
                logger.LogWarning("⚠️  Migraciones pendientes detectadas: {Count}", pendingMigrations.Count());
                foreach (var migration in pendingMigrations)
                {
                    logger.LogInformation("  📋 {Migration}", migration);
                }
            }
            else
            {
                logger.LogInformation("✅ Base de datos actualizada - No hay migraciones pendientes");
            }

            // Verificar que las tablas existan
            var canConnect = await context.Database.CanConnectAsync();
            if (canConnect)
            {
                logger.LogInformation("✅ Conexión a base de datos verificada");
            }
            else
            {
                logger.LogError("❌ No se pudo conectar a la base de datos");
            }
        }
        catch (PostgresException ex) when (allowResetOnFailure && ex.SqlState == "42P07")
        {
            logger.LogWarning("⚠️  Conflicto de migración detectado: {Message}", ex.MessageText);
            logger.LogWarning("⚠️  Reiniciando base de datos (solo desarrollo)...");

            var context = services.GetRequiredService<OrchestratorDbContext>();
            await context.Database.EnsureDeletedAsync();
            await context.Database.MigrateAsync();
            logger.LogInformation("✅ Base de datos recreada y migrada correctamente");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "❌ Error aplicando migraciones de base de datos");
            logger.LogError("Detalles del error: {Message}", ex.Message);
            logger.LogError("Stack trace: {StackTrace}", ex.StackTrace);
            
            throw; // Re-lanzar para que la aplicación no inicie con base de datos rota
        }

        return app;
    }

    /// <summary>
    /// Obtiene información sobre el estado de la base de datos
    /// </summary>
    public static async Task<DatabaseStatus> GetDatabaseStatusAsync(this IHost app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<OrchestratorDbContext>();

        try
        {
            var canConnect = await context.Database.CanConnectAsync();
            var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
            var appliedMigrations = await context.Database.GetAppliedMigrationsAsync();

            return new DatabaseStatus
            {
                CanConnect = canConnect,
                PendingMigrationsCount = pendingMigrations.Count(),
                AppliedMigrationsCount = appliedMigrations.Count(),
                PendingMigrations = pendingMigrations.ToList(),
                AppliedMigrations = appliedMigrations.ToList()
            };
        }
        catch (Exception ex)
        {
            return new DatabaseStatus
            {
                CanConnect = false,
                Error = ex.Message
            };
        }
    }
}

public class DatabaseStatus
{
    public bool CanConnect { get; set; }
    public int PendingMigrationsCount { get; set; }
    public int AppliedMigrationsCount { get; set; }
    public List<string> PendingMigrations { get; set; } = [];
    public List<string> AppliedMigrations { get; set; } = [];
    public string? Error { get; set; }
}
