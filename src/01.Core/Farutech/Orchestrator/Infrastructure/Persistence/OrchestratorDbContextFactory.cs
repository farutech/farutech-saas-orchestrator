using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Farutech.Orchestrator.Infrastructure.Persistence;

/// <summary>
/// Factory for creating DbContext instances at design time (migrations, scaffolding)
/// </summary>
public class OrchestratorDbContextFactory : IDesignTimeDbContextFactory<OrchestratorDbContext>
{
    public OrchestratorDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<OrchestratorDbContext>();
        
        // Use PostgreSQL for production and default dev
        var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING") 
            ?? "Host=localhost;Database=farutech_dev;Username=postgres;Password=postgres"; // Default to Postgres for design time
        
        // Always use Npgsql unless explicitly requested otherwise (which is removed for consistency)
        optionsBuilder.UseNpgsql(connectionString,
            b => b.MigrationsAssembly(typeof(OrchestratorDbContext).Assembly.FullName));

        return new OrchestratorDbContext(optionsBuilder.Options);
    }
}
