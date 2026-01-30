using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Npgsql;
using Farutech.Apps.Ordeon.Infrastructure.Persistence;

namespace Farutech.Apps.Ordeon.Infrastructure;

public static class DatabaseMigrator
{
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
                var db = scope.ServiceProvider.GetRequiredService<OrdeonDbContext>();

                // Ensure database exists (creates DB objects for simple setups)
                await db.Database.EnsureCreatedAsync();

                var pendingMigrations = await db.Database.GetPendingMigrationsAsync();

                if (pendingMigrations.Any())
                {
                    logger.LogInformation("Applying {Count} pending migrations for Ordeon", pendingMigrations.Count());
                    await db.Database.MigrateAsync();
                    logger.LogInformation("✅ Ordeon migrations applied successfully");
                }
                else
                {
                    logger.LogInformation("No pending migrations for Ordeon");
                }

                logger.LogInformation("✅ Ordeon database ready");
                return;
            }
            catch (Npgsql.PostgresException pgEx) when (pgEx.SqlState == "42P07")
            {
                logger.LogWarning(pgEx, "Detected existing relation conflict (42P07) for Ordeon: {Message}", pgEx.MessageText);
                try
                {
                    using var markScope = services.CreateScope();
                    var db2 = markScope.ServiceProvider.GetRequiredService<OrdeonDbContext>();
                    var pending = await db2.Database.GetPendingMigrationsAsync();
                    foreach (var migrationId in pending)
                    {
                        await db2.Database.ExecuteSqlRawAsync(
                            "INSERT INTO \"__EFMigrationsHistory\" (\"MigrationId\", \"ProductVersion\") VALUES ({0}, {1}) ON CONFLICT DO NOTHING",
                            migrationId, "9.0.1");
                    }

                    logger.LogInformation("Marked {Count} pending migrations as applied for Ordeon due to existing relations.", pending.Count());
                    logger.LogInformation("✅ Ordeon database ready (continued after handling 42P07)");
                    return;
                }
                catch (Exception inner)
                {
                    logger.LogError(inner, "Failed to mark Ordeon migrations as applied after 42P07 handling");
                    throw;
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "⏳ Ordeon database not ready (attempt {Attempt}/{MaxRetries}). Retrying in 5 seconds...", attempt, maxRetries);
                if (attempt < maxRetries)
                {
                    await Task.Delay(TimeSpan.FromSeconds(5));
                }
            }
        }

        var errorMessage = $"❌ Ordeon database never became available after {maxRetries} attempts";
        throw new Exception(errorMessage);
    }
}

