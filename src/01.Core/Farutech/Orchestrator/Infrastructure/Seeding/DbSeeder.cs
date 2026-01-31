using Microsoft.EntityFrameworkCore;
using Farutech.Orchestrator.Infrastructure.Persistence;

namespace Farutech.Orchestrator.Infrastructure.Seeding;

public static class DbSeeder
{
    public static async Task SeedAsync(OrchestratorDbContext context)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Create schemas if they don't exist
        await CreateSchemasAsync(context);

        // Apply any missing schema changes
        await ApplySchemaMigrationsAsync(context);

        // Product/module/feature/subscription seeding only
        await SeedProductsAsync(context);

        await context.SaveChangesAsync();
    }

    private static async Task CreateSchemasAsync(OrchestratorDbContext context)
    {
        var schemas = new[] { "identity", "catalog", "tenants", "rbac" };
        foreach (var schema in schemas)
        {
            await context.Database.ExecuteSqlAsync($"CREATE SCHEMA IF NOT EXISTS {schema}");
        }
    }

    private static async Task ApplySchemaMigrationsAsync(OrchestratorDbContext context)
    {
        var checkColumnQuery = @"
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_schema = 'tenants' 
            AND table_name = 'TenantInstances' 
            AND column_name = 'DeploymentType'
        ";
        var connection = context.Database.GetDbConnection();
        await connection.OpenAsync();
        using var command = connection.CreateCommand();
        command.CommandText = checkColumnQuery;
        var result = await command.ExecuteScalarAsync();
        var columnExists = Convert.ToInt32(result) > 0;
        await connection.CloseAsync();
        if (!columnExists)
        {
            Console.WriteLine("Adding DeploymentType column...");
            await context.Database.ExecuteSqlRawAsync(@"
                ALTER TABLE tenants.""TenantInstances"" 
                ADD COLUMN ""DeploymentType"" VARCHAR(50) NOT NULL DEFAULT 'Shared';
            ");
            Console.WriteLine("✅ DeploymentType column added successfully");
        }
        else
        {
            Console.WriteLine("✅ DeploymentType column already exists, skipping migration.");
        }
    }

    private static async Task SeedProductsAsync(OrchestratorDbContext context)
    {
        // Product/module/feature/subscription seeding logic removed for cleanup.
        await Task.CompletedTask;
    }

    private static async Task CreateSubscriptionPlansAsync(
        OrchestratorDbContext context, 
        Guid productId, 
        object features)
    {
        // Subscription plan creation logic removed for cleanup.
        await Task.CompletedTask;
    }
}
