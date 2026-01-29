using Microsoft.EntityFrameworkCore;
using Ordeon.Application.Common.Interfaces;
using Ordeon.Domain.Aggregates.Identity;
using Ordeon.Domain.Aggregates.Inventory;
using Ordeon.Domain.Aggregates.Logistics;
using Ordeon.Domain.Aggregates.Documents;
using Ordeon.Domain.Common;
using System.Reflection;

namespace Ordeon.Infrastructure.Persistence;

public sealed class OrdeonDbContext : DbContext
{
    private readonly ITenantService _tenantService;

    public OrdeonDbContext(
        DbContextOptions<OrdeonDbContext> options,
        ITenantService tenantService) : base(options)
    {
        _tenantService = tenantService;
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();

    // Inventory
    public DbSet<Item> Items => Set<Item>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<UnitOfMeasure> UnitsOfMeasure => Set<UnitOfMeasure>();

    // Logistics
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();

    // Documents & Transactions
    public DbSet<DocumentDefinition> DocumentDefinitions => Set<DocumentDefinition>();
    public DbSet<DocumentHeader> DocumentHeaders => Set<DocumentHeader>();
    public DbSet<DocumentLine> DocumentLines => Set<DocumentLine>();
    public DbSet<TransactionRegistry> TransactionRegistries => Set<TransactionRegistry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Configuración de Multi-tenancy para User
        // En una implementación real, podríamos usar una interfaz IHasTenant
        modelBuilder.Entity<User>().HasQueryFilter(u => u.TenantId == _tenantService.TenantId);

        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<Entity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    // En el caso de User, podríamos forzar el TenantId aquí si no viene seteado
                    break;
                case EntityState.Modified:
                    entry.Entity.MarkAsUpdated();
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
