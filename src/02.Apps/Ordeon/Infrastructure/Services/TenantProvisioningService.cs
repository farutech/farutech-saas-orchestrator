using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.DependencyInjection;
using Farutech.Apps.Ordeon.Application.Common.Interfaces;
using Farutech.Apps.Ordeon.Infrastructure.Persistence;
using System;
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

    private async Task SeedTenantAsync(OrdeonDbContext context, Guid tenantId) =>
        // Aquí podríamos crear el usuario administrador inicial para este tenant
        // y asignar los roles básicos.
        await Task.CompletedTask;
}

