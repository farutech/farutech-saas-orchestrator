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
    private const int RetryDelaySeconds = 5;

    public static async Task MigrateAsync(
        IServiceProvider services,
        ILogger logger,
        int maxRetries = 10)
    {
        Exception? lastException = null;

        for (var attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                logger.LogInformation(
                    "🔄 Database initialization attempt {Attempt}/{MaxRetries}",
                    attempt,
                    maxRetries);

                using var scope = services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();

                await EnsureDatabaseReadyAsync(db, logger);

                logger.LogInformation("✅ Database is ready");
                return;
            }
            catch (Npgsql.PostgresException pgEx) when (pgEx.SqlState == "42P07")
            {
                // Relation already exists (schema partially created or manually provisioned)
                logger.LogWarning(
                    pgEx,
                    "⚠️ Detected existing database objects (Postgres 42P07). Attempting to reconcile migrations.");

                if (await TryMarkPendingMigrationsAsAppliedAsync(services, logger))
                {
                    logger.LogInformation("✅ Database ready after resolving existing schema");
                    return;
                }

                lastException = pgEx;
            }
            catch (Exception ex)
            {
                lastException = ex;

                if (attempt < maxRetries)
                {
                    logger.LogInformation(
                        "⏳ Database not available yet. Retrying in {Delay}s... ({Attempt}/{MaxRetries})",
                        RetryDelaySeconds,
                        attempt,
                        maxRetries);

                    await Task.Delay(TimeSpan.FromSeconds(RetryDelaySeconds));
                }
            }
        }

        logger.LogCritical(
            lastException,
            "❌ Database did not become available after {MaxRetries} attempts",
            maxRetries);

        throw new InvalidOperationException(
            $"Database initialization failed after {maxRetries} attempts.",
            lastException);
    }

    private static async Task EnsureDatabaseReadyAsync(
        OrchestratorDbContext db,
        ILogger logger)
    {
        await db.Database.EnsureCreatedAsync();

        var pendingMigrations = (await db.Database.GetPendingMigrationsAsync()).ToList();

        if (!pendingMigrations.Any())
        {
            logger.LogInformation("📦 No pending migrations detected");
            return;
        }

        if (await IdentityTablesExistAsync(db))
        {
            logger.LogWarning(
                "⚠️ Existing identity tables detected. Marking migrations as applied.");

            await MarkMigrationsAsAppliedAsync(db, pendingMigrations, logger);
            return;
        }

        logger.LogInformation(
            "📦 Applying {Count} pending migrations",
            pendingMigrations.Count);

        await db.Database.MigrateAsync();

        logger.LogInformation("✅ Migrations applied successfully");
    }

    private static async Task<bool> IdentityTablesExistAsync(OrchestratorDbContext db)
    {
        var result = await db.Database.ExecuteSqlRawAsync("""
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'identity'
              AND table_name = 'AspNetRoles'
            LIMIT 1
        """);

        return result > 0;
    }

    private static async Task MarkMigrationsAsAppliedAsync(
        OrchestratorDbContext db,
        IEnumerable<string> migrations,
        ILogger logger)
    {
        foreach (var migrationId in migrations)
        {
            await db.Database.ExecuteSqlRawAsync("""
                INSERT INTO "__EFMigrationsHistory"
                    ("MigrationId", "ProductVersion")
                VALUES ({0}, {1})
                ON CONFLICT DO NOTHING
            """, migrationId, EfProductVersion);
        }

        logger.LogInformation(
            "📘 {Count} migrations marked as applied",
            migrations.Count());
    }

    private static async Task<bool> TryMarkPendingMigrationsAsAppliedAsync(
        IServiceProvider services,
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
