using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.DependencyInjection;
using Farutech.Apps.Ordeon.Application.Common.Interfaces;
using Farutech.Apps.Ordeon.Domain.Aggregates.Identity;
using Farutech.Apps.Ordeon.Infrastructure.Persistence;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Farutech.Apps.Ordeon.Infrastructure.Services;

public sealed class TenantProvisioningService(IServiceProvider serviceProvider) : ITenantProvisioningService
{
    private readonly IServiceProvider _serviceProvider = serviceProvider;

    public async Task ProvisionTenantAsync(Guid tenantId)
    {
        var schemaName = $"t_{tenantId:N}";
        
        using var scope = _serviceProvider.CreateScope();
        var tenantService = scope.ServiceProvider.GetRequiredService<ITenantService>();
        
        // Seteamos el tenant en el servicio para que el DbContext sepa qué schema usar
        tenantService.SetTenant(tenantId);
        
        var dbContext = scope.ServiceProvider.GetRequiredService<OrdeonDbContext>();

        // 1. Crear el schema si no existe
        var createSchemaSql = $"CREATE SCHEMA IF NOT EXISTS {schemaName};";
        await dbContext.Database.ExecuteSqlRawAsync(createSchemaSql);

        // 2. Aplicar migraciones
        // OJO: EF Migrations normalmente asumen un solo schema. 
        // Para aplicar migraciones en un schema dinámico, el DbContext ya está configurado con HasDefaultSchema(Schema).
        await dbContext.Database.MigrateAsync();
        
        // 3. (Opcional) Seed inicial para el tenant
        await SeedTenantAsync(dbContext, tenantId);
    }

    private static async Task SeedTenantAsync(OrdeonDbContext context, Guid tenantId)
    {
        // Avoid re-seeding if default roles already exist
        if (await context.Roles.AnyAsync())
            return;

        // ── 1. Create all catalogue permissions ─────────────────────────────
        var allPermissions = new[]
        {
            // Inventory
            Permission.Create(Permissions.Inventory.Read,   "Ver Inventario",   "Ver artículos y niveles de stock"),
            Permission.Create(Permissions.Inventory.Create, "Crear Artículo",   "Crear nuevos artículos en inventario"),
            Permission.Create(Permissions.Inventory.Update, "Editar Artículo",  "Modificar artículos existentes"),
            Permission.Create(Permissions.Inventory.Delete, "Eliminar Artículo","Eliminar artículos del inventario"),

            // Warehouse / Logistics
            Permission.Create(Permissions.Warehouse.Read,   "Ver Bodega",       "Consultar almacenes y stock por bodega"),
            Permission.Create(Permissions.Warehouse.Create, "Crear Bodega",     "Crear nuevas bodegas"),
            Permission.Create(Permissions.Warehouse.Update, "Editar Bodega",    "Modificar bodegas existentes"),

            // Documents
            Permission.Create(Permissions.Documents.Read,              "Ver Documentos",        "Consultar documentos de compra/venta"),
            Permission.Create(Permissions.Documents.Create,            "Crear Documento",       "Emitir facturas, órdenes y notas"),
            Permission.Create(Permissions.Documents.Cancel,            "Anular Documento",      "Anular documentos emitidos"),
            Permission.Create(Permissions.Documents.ManageDefinitions, "Gestionar Definiciones","Administrar tipos y plantillas de documentos"),

            // POS
            Permission.Create(Permissions.POS.OpenSession,              "Abrir Sesión POS",    "Iniciar una sesión de caja"),
            Permission.Create(Permissions.POS.CloseSession,             "Cerrar Sesión POS",   "Cerrar una sesión de caja"),
            Permission.Create(Permissions.POS.WithdrawCash,             "Sangrías",            "Registrar retiros de efectivo"),
            Permission.Create(Permissions.POS.Configuration.Read,       "Ver Config. POS",     "Consultar configuración de puntos de venta"),
            Permission.Create(Permissions.POS.Configuration.Manage,     "Gestionar Config. POS","Administrar configuración de puntos de venta"),
        };

        await context.Permissions.AddRangeAsync(allPermissions);
        await context.SaveChangesAsync();

        // Helper lookup
        Permission Perm(string code) =>
            allPermissions.First(p => p.Code == code.ToLowerInvariant());

        // ── 2. AdminOrdeon — full access ─────────────────────────────────────
        var adminRole = Role.Create(
            "AdminOrdeon",
            "Administrador con acceso total al sistema Ordeon");
        foreach (var p in allPermissions)
            adminRole.AddPermission(p);

        // ── 3. OperadorOrdeon — daily operations ─────────────────────────────
        var operatorRole = Role.Create(
            "OperadorOrdeon",
            "Operador de caja e inventario para uso diario");
        foreach (var perm in new[]
        {
            Permissions.Inventory.Read,
            Permissions.Inventory.Create,
            Permissions.Inventory.Update,
            Permissions.Warehouse.Read,
            Permissions.Documents.Read,
            Permissions.Documents.Create,
            Permissions.POS.OpenSession,
            Permissions.POS.CloseSession,
            Permissions.POS.WithdrawCash,
            Permissions.POS.Configuration.Read,
        })
            operatorRole.AddPermission(Perm(perm));

        // ── 4. LectorOrdeon — read-only ──────────────────────────────────────
        var readerRole = Role.Create(
            "LectorOrdeon",
            "Acceso de sólo lectura a reportes e inventario");
        foreach (var perm in new[]
        {
            Permissions.Inventory.Read,
            Permissions.Warehouse.Read,
            Permissions.Documents.Read,
            Permissions.POS.Configuration.Read,
        })
            readerRole.AddPermission(Perm(perm));

        await context.Roles.AddRangeAsync(adminRole, operatorRole, readerRole);
        await context.SaveChangesAsync();
    }
}

