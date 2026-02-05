using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Farutech.Orchestrator.Infrastructure.Persistence;

/// <summary>
/// Factory for creating DbContext instances at design time (migrations, scaffolding)
/// </summary>
public class OrchestratorDbContextFactory : IDesignTimeDbContextFactory<OrchestratorDbContext>
{
    public OrchestratorDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Host=localhost;Port=5432;Database=farutec_db;Username=postgres;Password=SuperSecurePassword123";

        var optionsBuilder = new DbContextOptionsBuilder<OrchestratorDbContext>();
        
        if (connectionString.Contains("Data Source=") || connectionString.Contains(".db"))
        {
            // SQLite
            optionsBuilder.UseSqlite(connectionString);
        }
        else
        {
            // PostgreSQL
            optionsBuilder.UseNpgsql(connectionString, 
                b => b.MigrationsAssembly(typeof(OrchestratorDbContext).Assembly.FullName));
        }

        return new OrchestratorDbContext(optionsBuilder.Options);
    }
}
