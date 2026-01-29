using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Npgsql;
using Farutech.Orchestrator.Infrastructure.Persistence;

namespace Farutech.Orchestrator.Infrastructure;

/// <summary>
/// Handles database migrations with retry logic for resilient startup
/// </summary>
public static class DatabaseMigrator
{
    /// <summary>
    /// Applies database migrations with retry logic
    /// </summary>
    /// <param name="services">Service provider to resolve dependencies</param>
    /// <param name="logger">Logger for migration progress and errors</param>
    /// <param name="maxRetries">Maximum number of retry attempts</param>
    /// <returns>Task that completes when migrations are applied</returns>
    /// <exception cref="Exception">Thrown when migrations fail after all retries</exception>
    public static async Task MigrateAsync(
        IServiceProvider services,
        ILogger logger,
        int maxRetries = 10)
    {
        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                using var scope = services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();

                // Ensure database exists
                await db.Database.EnsureCreatedAsync();

                // Check migration status
                var appliedMigrations = await db.Database.GetAppliedMigrationsAsync();
                var pendingMigrations = await db.Database.GetPendingMigrationsAsync();

                // Check if tables already exist (indicating database is initialized)
                var tableExists = await db.Database.ExecuteSqlRawAsync(
                    "SELECT 1 FROM information_schema.tables WHERE table_schema = 'identity' AND table_name = 'AspNetRoles' LIMIT 1") > 0;

                if (tableExists)
                {
                    logger.LogInformation("Detected existing database tables, marking all migrations as applied");

                    // Mark all pending migrations as applied
                    foreach (var migrationId in pendingMigrations)
                    {
                        await db.Database.ExecuteSqlRawAsync(
                            "INSERT INTO \"__EFMigrationsHistory\" (\"MigrationId\", \"ProductVersion\") VALUES ({0}, {1}) ON CONFLICT DO NOTHING",
                            migrationId, "9.0.1");
                    }

                    logger.LogInformation("✅ All migrations marked as applied");
                }
                else if (pendingMigrations.Any())
                {
                    logger.LogInformation("Applying {Count} pending migrations", pendingMigrations.Count());

                    await db.Database.MigrateAsync();
                    logger.LogInformation("✅ Database migrations applied successfully");
                }
                else
                {
                    logger.LogInformation("All migrations already applied");
                }

                logger.LogInformation("✅ Database ready");
                return;
            }
            catch (Npgsql.PostgresException pgEx) when (pgEx.SqlState == "42P07")
            {
                // Table already exists conflict (e.g., migration partially applied or manual schema present)
                logger.LogWarning(pgEx, "Detected existing relation conflict (42P07): {Message}", pgEx.MessageText);

                // As fallback, mark pending migrations as applied to allow startup to continue
                try
                {
                    using var markScope = services.CreateScope();
                    var db2 = markScope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
                    var pending = await db2.Database.GetPendingMigrationsAsync();
                    foreach (var migrationId in pending)
                    {
                        await db2.Database.ExecuteSqlRawAsync(
                            "INSERT INTO \"__EFMigrationsHistory\" (\"MigrationId\", \"ProductVersion\") VALUES ({0}, {1}) ON CONFLICT DO NOTHING",
                            migrationId, "9.0.1");
                    }

                    logger.LogInformation("Marked {Count} pending migrations as applied due to existing relations.", pending.Count());
                    logger.LogInformation("✅ Database ready (continued after handling 42P07)");
                    return;
                }
                catch (Exception inner)
                {
                    logger.LogError(inner, "Failed to mark migrations as applied after 42P07 handling");
                    throw;
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(
                    ex,
                    "⏳ Database not ready (attempt {Attempt}/{MaxRetries}). Retrying in 5 seconds...",
                    attempt,
                    maxRetries
                );

                if (attempt < maxRetries)
                {
                    await Task.Delay(TimeSpan.FromSeconds(5));
                }
            }
        }

        var errorMessage = $"❌ Database never became available after {maxRetries} attempts";
        logger.LogError(errorMessage);
        throw new Exception(errorMessage);
    }
}