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
        
        // Connection string for migrations (should match your database)
        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5432;Database=farutec_db;Username=postgres;Password=SuperSecurePassword123",
            b => b.MigrationsAssembly(typeof(OrchestratorDbContext).Assembly.FullName));

        return new OrchestratorDbContext(optionsBuilder.Options);
    }
}
