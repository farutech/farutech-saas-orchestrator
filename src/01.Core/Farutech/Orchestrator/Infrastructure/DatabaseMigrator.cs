using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Npgsql;
using Farutech.Orchestrator.Infrastructure.Persistence;

namespace Farutech.Orchestrator.Infrastructure;

/// <summary>
/// Handles resilient database initialization and migrations during application startup.
/// Designed for containerized and orchestrated environments.
/// </summary>
public static class DatabaseMigrator
{
    private const string EfProductVersion = "9.0.1";
    private const int MaxRetries = 60;
    private const int RetryDelaySeconds = 1;

    public static async Task MigrateAsync(IServiceProvider services,
                                          ILogger logger)
    {
        Exception? lastException = null;

        for (var attempt = 1; attempt <= MaxRetries; attempt++)
        {
            try
            {
                using var scope = services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();

                // 1. Simple connectivity check
                if (!await db.Database.CanConnectAsync())
                {
                     throw new Exception("Database not accessible yet.");
                }

                // 2. Run migrations
                await EnsureDatabaseReadyAsync(db, logger);

                logger.LogInformation("✅ Database is ready and migrations are applied.");
                return;
            }
            catch (Exception ex)
            {
                lastException = ex;

                if (attempt < MaxRetries)
                {
                    logger.LogInformation("ℹ️ [INFO] Database not available yet. Retry {Attempt}/{MaxRetries}. ({Message})",
                                          attempt,
                                          MaxRetries,
                                          ex.Message);

                    await Task.Delay(TimeSpan.FromSeconds(RetryDelaySeconds));
                }
            }
        }

        logger.LogCritical(lastException,
                           "❌ Database did not become available after {MaxRetries} attempts",
                           MaxRetries);

        throw new InvalidOperationException($"Database initialization failed after {MaxRetries} attempts.",
                                            lastException);
    }

    private static async Task<bool> IsDatabaseInBrokenStateAsync(OrchestratorDbContext db, ILogger logger)
    {
        try 
        {
             // Check if we are in Postgres
             if (db.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite") return false;

             var usersExist = await IdentityTablesExistAsync(db);
             
             // Check if Customers exists (tenants schema)
             var customersExist = (await db.Database.ExecuteSqlRawAsync("""
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'tenants' AND table_name = 'Customers'
                LIMIT 1
             """)) > 0;

             // NEW CHECK: If Customers exists, check if IsDeleted is an INTEGER (SQLite artifact) instead of BOOLEAN
             if (customersExist) 
             {
                 var isDeletedIsInteger = (await db.Database.ExecuteSqlRawAsync("""
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_schema = 'tenants' AND table_name = 'Customers' 
                    AND column_name = 'IsDeleted' AND data_type = 'integer'
                    LIMIT 1
                 """)) > 0;

                 if (isDeletedIsInteger)
                 {
                     logger.LogWarning("⚠️ Detected SQLite-style integers for boolean columns in Postgres. Resetting schema...");
                     return true; // Broken state!
                 }
             }

             // If Customers exists but Users (Identity) missing, we have a partial broken migration
             if (customersExist && !usersExist)
             {
                 return true;
             }
             return false;
        }
        catch 
        {
            return false;
        }
    }

    private static async Task ResetDatabaseSchemasAsync(OrchestratorDbContext db, ILogger logger)
    {
        try
        {
            // DROP SCHEMAS CASCADE
            await db.Database.ExecuteSqlRawAsync("DROP SCHEMA IF EXISTS identity CASCADE;");
            await db.Database.ExecuteSqlRawAsync("DROP SCHEMA IF EXISTS tenants CASCADE;");
            await db.Database.ExecuteSqlRawAsync("DROP SCHEMA IF EXISTS catalog CASCADE;");
            // Also clean migration history
            await db.Database.ExecuteSqlRawAsync("DELETE FROM \"__EFMigrationsHistory\" WHERE \"MigrationId\" LIKE '%InitialCreate%';");
            
            logger.LogInformation("🧹 Database schemas dropped successfully.");
        }
        catch (Exception ex)
        {
             logger.LogError(ex, "Failed to reset database schemas.");
             throw;
        }
    }

    private static async Task EnsureDatabaseReadyAsync(OrchestratorDbContext db,
                                                       ILogger logger)
    {
        // NO usar EnsureCreatedAsync() - puede crear tablas con nombres incorrectos
        // Solo usar MigrateAsync() que respeta las configuraciones de ToTable()

        var pendingMigrations = (await db.Database.GetPendingMigrationsAsync()).ToList();

        if (pendingMigrations.Count == 0)
        {
            logger.LogInformation("📦 No pending migrations detected");
            return;
        }

        // Verificar si las tablas críticas ya existen (posiblemente creadas por migraciones previas)
        if (await IdentityTablesExistAsync(db))
        {
            logger.LogWarning("⚠️ Existing identity tables detected. " +
                              "This may indicate previous migrations or manual table creation. " +
                              "Marking migrations as applied to avoid conflicts.");

            await MarkMigrationsAsAppliedAsync(db, pendingMigrations, logger);
            return;
        }

        logger.LogInformation("📦 Applying {Count} pending migrations",
                              pendingMigrations.Count);

        await db.Database.MigrateAsync();

        logger.LogInformation("✅ Migrations applied successfully");
    }

    private static async Task<bool> IdentityTablesExistAsync(OrchestratorDbContext db)
    {
        try
        {
            // Check if we're using SQLite
            if (db.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
            {
                // For SQLite, check if the Roles table exists using SQLite syntax
                var result = await db.Database.ExecuteSqlRawAsync("""
                    SELECT 1
                    FROM sqlite_master
                    WHERE type = 'table'
                      AND name = 'Users'
                    LIMIT 1
                """);
                return result > 0;
            }
            else
            {
                // For PostgreSQL, use information_schema
                // CRITICAL: Check for Users, not Roles, as Roles might have schema issues
                var result = await db.Database.ExecuteSqlRawAsync("""
                    SELECT 1
                    FROM information_schema.tables
                    WHERE table_schema = 'identity'
                      AND table_name = 'Users'
                    LIMIT 1
                """);
                return result > 0;
            }
        }
        catch
        {
            // If query fails, assume tables don't exist
            return false;
        }
    }

    private static async Task MarkMigrationsAsAppliedAsync(OrchestratorDbContext db,
                                                           IEnumerable<string> migrations,
                                                           ILogger logger)
    {
        var isSqlite = db.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite";

        foreach (var migrationId in migrations)
        {
            if (isSqlite)
            {
                // SQLite syntax
                await db.Database.ExecuteSqlRawAsync("""
                    INSERT OR IGNORE INTO "__EFMigrationsHistory"
                        ("MigrationId", "ProductVersion")
                    VALUES ({0}, {1})
                """, migrationId, EfProductVersion);
            }
            else
            {
                // PostgreSQL syntax
                await db.Database.ExecuteSqlRawAsync("""
                    INSERT INTO "__EFMigrationsHistory"
                        ("MigrationId", "ProductVersion")
                    VALUES ({0}, {1})
                    ON CONFLICT DO NOTHING
                """, migrationId, EfProductVersion);
            }
        }

        logger.LogInformation(
            "📘 {Count} migrations marked as applied",
            migrations.Count());
    }

    private static async Task<bool> TryMarkPendingMigrationsAsAppliedAsync(IServiceProvider services,
                                                                           ILogger logger)
    {
        try
        {
            using var scope = services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();

            var pending = await db.Database.GetPendingMigrationsAsync();
            await MarkMigrationsAsAppliedAsync(db, pending, logger);

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "❌ Failed to mark migrations as applied after schema conflict");

            return false;
        }
    }
}
