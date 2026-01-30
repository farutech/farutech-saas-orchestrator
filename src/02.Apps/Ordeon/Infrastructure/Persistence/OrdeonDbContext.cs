using Microsoft.EntityFrameworkCore;
using Farutech.Apps.Ordeon.Application.Common.Interfaces;
using Farutech.Apps.Ordeon.Domain.Aggregates.Identity;
using Farutech.Apps.Ordeon.Domain.Aggregates.Inventory;
using Farutech.Apps.Ordeon.Domain.Aggregates.Logistics;
using Farutech.Apps.Ordeon.Domain.Aggregates.Documents;
using Farutech.Apps.Ordeon.Domain.Aggregates.ThirdParties;
using Farutech.Apps.Ordeon.Domain.Aggregates.Financial;
using Farutech.Apps.Ordeon.Domain.Aggregates.POS;
using Farutech.Apps.Ordeon.Domain.Aggregates.Audit;
using Farutech.Apps.Ordeon.Domain.Common;
using System.Reflection;

namespace Farutech.Apps.Ordeon.Infrastructure.Persistence;

public sealed class OrdeonDbContext : DbContext
{
    private readonly ITenantService _tenantService;
    public string Schema { get; }

    public OrdeonDbContext(
        DbContextOptions<OrdeonDbContext> options,
        ITenantService tenantService) : base(options)
    {
        _tenantService = tenantService;
        Schema = _tenantService.TenantId.HasValue 
            ? $"t_{_tenantService.TenantId.Value:N}" 
            : "public";
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

    // Master Data & Financials
    public DbSet<ThirdParty> ThirdParties => Set<ThirdParty>();
    public DbSet<PaymentMethod> PaymentMethods => Set<PaymentMethod>();

    // POS & Cash Management
    public DbSet<CashRegister> CashRegisters => Set<CashRegister>();
    public DbSet<Cashier> Cashiers => Set<Cashier>();
    public DbSet<CashSession> CashSessions => Set<CashSession>();
    public DbSet<CashMovement> CashMovements => Set<CashMovement>();

    // Audit
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

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

