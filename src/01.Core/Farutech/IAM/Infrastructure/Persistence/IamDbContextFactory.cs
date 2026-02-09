using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Farutech.IAM.Infrastructure.Persistence;

/// <summary>
/// Factory para crear IamDbContext en tiempo de diseño (migraciones)
/// </summary>
public class IamDbContextFactory : IDesignTimeDbContextFactory<IamDbContext>
{
    public IamDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<IamDbContext>();
        
        // Connection string para desarrollo local
        // En producción esto vendrá de configuración/secretos
        var connectionString = "Host=localhost;Port=5432;Database=farutec_db;Username=farutec_admin;Password=SuperSecurePassword123";
        
        optionsBuilder.UseNpgsql(connectionString, options =>
        {
            options.MigrationsHistoryTable("__EFMigrationsHistory", "iam");
        });

        return new IamDbContext(optionsBuilder.Options);
    }
}
