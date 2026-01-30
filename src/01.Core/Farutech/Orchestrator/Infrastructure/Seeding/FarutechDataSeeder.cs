using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Farutech.Orchestrator.Domain.Entities.Catalog;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Infrastructure.Persistence;

namespace Farutech.Orchestrator.Infrastructure.Seeding;

/// <summary>
/// Data seeder for Farutech Orchestrator - Seeds catalog data, permissions, roles, and initial SuperAdmin user
/// </summary>
public class FarutechDataSeeder(
    OrchestratorDbContext context,
    UserManager<ApplicationUser> userManager,
    ILogger<FarutechDataSeeder> logger)
{
    private readonly OrchestratorDbContext _context = context;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly ILogger<FarutechDataSeeder> _logger = logger;

    // Predefined GUIDs for deterministic seeding
    private static readonly Guid SuperAdminRoleId = new("00000000-0000-0000-0001-000000000001");
    private static readonly Guid ManagerRoleId = new("00000000-0000-0000-0001-000000000002");
    private static readonly Guid CashierRoleId = new("00000000-0000-0000-0001-000000000003");
    private static readonly Guid SalespersonRoleId = new("00000000-0000-0000-0001-000000000004");
    private static readonly Guid AuditorRoleId = new("00000000-0000-0000-0001-000000000005");

    private static readonly Guid ProductOrdeonId = new("00000000-0000-0000-0002-000000000001");
    
    private static readonly Guid ModuleSalesId = new("00000000-0000-0000-0003-000000000001");
    private static readonly Guid ModuleInventoryId = new("00000000-0000-0000-0003-000000000002");
    private static readonly Guid ModuleSecurityId = new("00000000-0000-0000-0003-000000000003");

    private static readonly Guid FeaturePosTerminalId = new("00000000-0000-0000-0004-000000000001");
    private static readonly Guid FeatureServiceOrdersId = new("00000000-0000-0000-0004-000000000002");
    private static readonly Guid FeatureStockMgmtId = new("00000000-0000-0000-0004-000000000003");
    private static readonly Guid FeatureWarehousesId = new("00000000-0000-0000-0004-000000000004");
    private static readonly Guid FeatureRbacId = new("00000000-0000-0000-0004-000000000005");

    private static readonly Guid SubscriptionFullId = new("00000000-0000-0000-0005-000000000001");
    private static readonly Guid SubscriptionMostradorId = new("00000000-0000-0000-0005-000000000002");

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("🌱 Iniciando Data Seeding idempotente...");

            // NO ejecutar migraciones aquí - deben ejecutarse ANTES del seeding
            // await _context.Database.MigrateAsync(); // REMOVIDO

            // Seed in order (respecting foreign keys)
            await SeedPermissionsAsync();
            await SeedRolesAsync();
            await SeedRolePermissionsAsync();
            await SeedProductsAsync();
            await SeedModulesAsync();
            await SeedFeaturesAsync();
            await SeedSubscriptionPlansAsync();
            await SeedSubscriptionFeaturesAsync();
            await SeedSuperAdminUserAsync();

            _logger.LogInformation("✅ Data Seeding idempotente completado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error durante Data Seeding");
            throw;
        }
    }

    private async Task SeedPermissionsAsync()
    {
        if (await _context.Permissions.AnyAsync())
        {
            _logger.LogInformation("⏭️  Permissions ya existen, omitiendo...");
            return;
        }

        _logger.LogInformation("📋 Seeding Permissions...");

        var permissions = new List<Permission>
        {
            // Dashboard
            new() { Id = Guid.NewGuid(), Code = "dashboard:access", Name = "Acceso al Dashboard", Description = "Permite acceder al dashboard de la aplicación", Module = "Dashboard", Category = "Access", IsActive = true, IsCritical = false, CreatedBy = "System" },

            // Customers Module
            new() { Id = Guid.NewGuid(), Code = "customers:list", Name = "Listar Clientes", Description = "Permite ver la lista de clientes", Module = "Clientes", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "customers:read", Name = "Ver Detalle de Clientes", Description = "Permite ver el detalle de un cliente", Module = "Clientes", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "customers:create", Name = "Crear Clientes", Description = "Permite crear nuevos clientes", Module = "Clientes", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "customers:update", Name = "Actualizar Clientes", Description = "Permite editar información de clientes", Module = "Clientes", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "customers:delete", Name = "Eliminar Clientes", Description = "Permite eliminar clientes (solo Admin)", Module = "Clientes", Category = "CRUD", IsActive = true, IsCritical = true, CreatedBy = "System" },

            // Products Module
            new() { Id = Guid.NewGuid(), Code = "products:list", Name = "Listar Productos", Description = "Permite ver el catálogo de productos", Module = "Inventario", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "products:create", Name = "Crear Productos", Description = "Permite crear nuevos productos", Module = "Inventario", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "products:update", Name = "Actualizar Productos", Description = "Permite editar productos", Module = "Inventario", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "stock:adjust_in", Name = "Ajuste de Entrada", Description = "Permite realizar ajustes de entrada al inventario", Module = "Inventario", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "stock:adjust_out", Name = "Ajuste de Salida", Description = "Permite realizar ajustes de salida al inventario", Module = "Inventario", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },

            // POS Module
            new() { Id = Guid.NewGuid(), Code = "pos:open_session", Name = "Abrir Sesión POS", Description = "Permite abrir una sesión de punto de venta", Module = "Ventas", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "pos:process_sale", Name = "Procesar Ventas", Description = "Permite procesar ventas en el POS", Module = "Ventas", Category = "Operations", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "pos:close_session", Name = "Cerrar Sesión POS", Description = "Permite cerrar una sesión de punto de venta", Module = "Ventas", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },

            // Master Data
            new() { Id = Guid.NewGuid(), Code = "master_data.items.read", Name = "Consultar Items", Description = "Permite ver items/productos del inventario", Module = "Datos Maestros", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "master_data.items.update", Name = "Modificar Items", Description = "Permite editar items/productos del inventario", Module = "Datos Maestros", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "master_data.items.delete", Name = "Eliminar Items", Description = "Permite eliminar items/productos del inventario", Module = "Datos Maestros", Category = "CRUD", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "master_data.warehouses.manage", Name = "Gestionar Bodegas", Description = "Permite gestionar bodegas/almacenes", Module = "Datos Maestros", Category = "Administration", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "master_data.customers.manage", Name = "Gestionar Clientes", Description = "Permite gestionar clientes y proveedores", Module = "Datos Maestros", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },

            // Cash Control
            new() { Id = Guid.NewGuid(), Code = "cash_control.register.open", Name = "Abrir Caja", Description = "Permite abrir una caja registradora", Module = "Control de Caja", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "cash_control.register.close", Name = "Cerrar Caja", Description = "Permite cerrar una caja registradora y realizar arqueo", Module = "Control de Caja", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "cash_control.withdrawal.create", Name = "Crear Retiro/Sangría", Description = "Permite realizar retiros de efectivo de la caja", Module = "Control de Caja", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "cash_control.blind_count", Name = "Arqueo Ciego", Description = "Permite realizar arqueo sin ver el saldo esperado", Module = "Control de Caja", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "cash_control.reports.view", Name = "Ver Reportes de Caja", Description = "Permite ver reportes y cuadres de caja", Module = "Control de Caja", Category = "Reports", IsActive = true, IsCritical = false, CreatedBy = "System" },

            // Sales
            new() { Id = Guid.NewGuid(), Code = "sales.pos.create", Name = "Crear Venta POS", Description = "Permite crear ventas en punto de venta", Module = "Ventas", Category = "Operations", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "sales.pos.cancel", Name = "Cancelar Venta", Description = "Permite cancelar ventas realizadas", Module = "Ventas", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "sales.discounts.apply", Name = "Aplicar Descuentos", Description = "Permite aplicar descuentos en ventas", Module = "Ventas", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "sales.reports.view", Name = "Ver Reportes de Ventas", Description = "Permite ver reportes de ventas", Module = "Ventas", Category = "Reports", IsActive = true, IsCritical = false, CreatedBy = "System" },

            // Services
            new() { Id = Guid.NewGuid(), Code = "services.orders.create", Name = "Crear Orden de Servicio", Description = "Permite crear órdenes de servicio", Module = "Servicios", Category = "Operations", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "services.orders.manage", Name = "Gestionar Órdenes", Description = "Permite gestionar el estado de órdenes de servicio", Module = "Servicios", Category = "Operations", IsActive = true, IsCritical = false, CreatedBy = "System" },

            // Inventory
            new() { Id = Guid.NewGuid(), Code = "inventory.stock.view", Name = "Ver Inventario", Description = "Permite consultar niveles de inventario", Module = "Inventario", Category = "CRUD", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "inventory.adjustments.create", Name = "Crear Ajustes", Description = "Permite crear ajustes de inventario", Module = "Inventario", Category = "Operations", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "inventory.transfers.create", Name = "Crear Traslados", Description = "Permite crear traslados entre bodegas", Module = "Inventario", Category = "Operations", IsActive = true, IsCritical = false, CreatedBy = "System" },

            // Reports
            new() { Id = Guid.NewGuid(), Code = "reports.financial.view", Name = "Ver Reportes Financieros", Description = "Permite ver reportes financieros", Module = "Reportes", Category = "Reports", IsActive = true, IsCritical = false, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "reports.operational.view", Name = "Ver Reportes Operacionales", Description = "Permite ver reportes operacionales", Module = "Reportes", Category = "Reports", IsActive = true, IsCritical = false, CreatedBy = "System" },

            // Administration
            new() { Id = Guid.NewGuid(), Code = "admin.users.manage", Name = "Gestionar Usuarios", Description = "Permite gestionar usuarios del sistema", Module = "Administración", Category = "Administration", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "admin.roles.manage", Name = "Gestionar Roles", Description = "Permite gestionar roles y permisos", Module = "Administración", Category = "Administration", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "admin.settings.manage", Name = "Gestionar Configuración", Description = "Permite gestionar configuración del sistema", Module = "Administración", Category = "Administration", IsActive = true, IsCritical = true, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Code = "admin.audit.view", Name = "Ver Auditoría", Description = "Permite ver logs de auditoría", Module = "Administración", Category = "Reports", IsActive = true, IsCritical = false, CreatedBy = "System" }
        };

        await _context.Permissions.AddRangeAsync(permissions);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"✅ {permissions.Count} Permissions creados");
    }

    private async Task SeedRolesAsync()
    {
        if (await _context.Roles.AnyAsync())
        {
            _logger.LogInformation("⏭️  Roles ya existen, omitiendo...");
            return;
        }

        _logger.LogInformation("👥 Seeding Roles...");

        var roles = new List<Role>
        {
            new() { Id = SuperAdminRoleId, Code = "super_admin", Name = "Super Administrador", Description = "Acceso total al sistema", Level = 1, IsSystemRole = true, IsActive = true, Scope = "Global", CreatedBy = "System" },
            new() { Id = ManagerRoleId, Code = "manager", Name = "Gerente", Description = "Gestión de sucursal/tenant completo", Level = 2, IsSystemRole = true, IsActive = true, Scope = "Tenant", CreatedBy = "System" },
            new() { Id = CashierRoleId, Code = "cashier", Name = "Cajero", Description = "Operación de caja y ventas", Level = 3, IsSystemRole = true, IsActive = true, Scope = "Warehouse", CreatedBy = "System" },
            new() { Id = SalespersonRoleId, Code = "salesperson", Name = "Vendedor", Description = "Ventas sin acceso a caja", Level = 4, IsSystemRole = true, IsActive = true, Scope = "Warehouse", CreatedBy = "System" },
            new() { Id = AuditorRoleId, Code = "auditor", Name = "Auditor", Description = "Solo lectura y reportes", Level = 5, IsSystemRole = true, IsActive = true, Scope = "Tenant", CreatedBy = "System" }
        };

        await _context.Roles.AddRangeAsync(roles);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"✅ {roles.Count} Roles creados");
    }

    private async Task SeedRolePermissionsAsync()
    {
        if (await _context.RolePermissions.AnyAsync())
        {
            _logger.LogInformation("⏭️  RolePermissions ya existen, omitiendo...");
            return;
        }

        _logger.LogInformation("🔗 Seeding RolePermissions...");

        var permissions = await _context.Permissions.Where(p => !p.IsDeleted).ToListAsync();
        var rolePermissions = new List<RolePermission>();

        // Super Admin: ALL permissions
        var superAdminPerms = permissions.Select(p => new RolePermission
        {
            RoleId = SuperAdminRoleId,
            PermissionId = p.Id,
            GrantedBy = "System",
            GrantedAt = DateTime.UtcNow
        });
        rolePermissions.AddRange(superAdminPerms);

        // Manager: All EXCEPT admin.roles and admin.settings
        var managerPerms = permissions
            .Where(p => !p.Code.StartsWith("admin.roles") && !p.Code.StartsWith("admin.settings"))
            .Select(p => new RolePermission
            {
                RoleId = ManagerRoleId,
                PermissionId = p.Id,
                GrantedBy = "System",
                GrantedAt = DateTime.UtcNow
            });
        rolePermissions.AddRange(managerPerms);

        // Cashier: Specific cash control and basic sales permissions
        var cashierCodes = new[]
        {
            "cash_control.register.open", "cash_control.register.close", "cash_control.withdrawal.create",
            "cash_control.blind_count", "cash_control.reports.view", "sales.pos.create", "sales.discounts.apply",
            "master_data.items.read", "master_data.customers.manage", "inventory.stock.view"
        };
        var cashierPerms = permissions
            .Where(p => cashierCodes.Contains(p.Code))
            .Select(p => new RolePermission
            {
                RoleId = CashierRoleId,
                PermissionId = p.Id,
                GrantedBy = "System",
                GrantedAt = DateTime.UtcNow
            });
        rolePermissions.AddRange(cashierPerms);

        // Salesperson: Sales without cash control
        var salespersonCodes = new[]
        {
            "sales.pos.create", "services.orders.create", "master_data.items.read",
            "master_data.customers.manage", "inventory.stock.view"
        };
        var salespersonPerms = permissions
            .Where(p => salespersonCodes.Contains(p.Code))
            .Select(p => new RolePermission
            {
                RoleId = SalespersonRoleId,
                PermissionId = p.Id,
                GrantedBy = "System",
                GrantedAt = DateTime.UtcNow
            });
        rolePermissions.AddRange(salespersonPerms);

        // Auditor: Read-only and reports
        var auditorPerms = permissions
            .Where(p => p.Category == "Reports" || p.Code.Contains(".read") || p.Code.Contains(".view"))
            .Select(p => new RolePermission
            {
                RoleId = AuditorRoleId,
                PermissionId = p.Id,
                GrantedBy = "System",
                GrantedAt = DateTime.UtcNow
            });
        rolePermissions.AddRange(auditorPerms);

        await _context.RolePermissions.AddRangeAsync(rolePermissions);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"✅ {rolePermissions.Count} RolePermissions creados");
    }

    private async Task SeedProductsAsync()
    {
        if (await _context.Products.IgnoreQueryFilters().AnyAsync())
        {
            _logger.LogInformation("⏭️  Products ya existen, omitiendo...");
            return;
        }

        _logger.LogInformation("📦 Seeding Products...");

        var product = new Product
        {
            Id = ProductOrdeonId,
            Code = "ordeon",
            Name = "Ordeon - Retail & Services",
            Description = "Ordeon: plataforma para puntos de venta y gestión de servicios, control de caja e inventario",
            IsActive = true,
            CreatedBy = "System"
        };

        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("✅ Product 'Farutech POS & Services' creado");
    }

    private async Task SeedModulesAsync()
    {
        if (await _context.Modules.IgnoreQueryFilters().AnyAsync())
        {
            _logger.LogInformation("⏭️  Modules ya existen, omitiendo...");
            return;
        }

        _logger.LogInformation("📚 Seeding Modules...");

        var modules = new List<Module>
        {
            new() { Id = ModuleSalesId, ProductId = ProductOrdeonId, Code = "orders_module", Name = "Orders", Description = "Gestión de órdenes y punto de venta", IsActive = true, CreatedBy = "System" },
            new() { Id = ModuleInventoryId, ProductId = ProductOrdeonId, Code = "inventory_module", Name = "Inventory", Description = "Control de stock y productos", IsActive = true, CreatedBy = "System" },
            new() { Id = ModuleSecurityId, ProductId = ProductOrdeonId, Code = "security_module", Name = "Security", Description = "Gestión de roles, permisos y usuarios", IsActive = true, CreatedBy = "System" }
        };

        await _context.Modules.AddRangeAsync(modules);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"✅ {modules.Count} Modules creados");
    }

    private async Task SeedFeaturesAsync()
    {
        if (await _context.Features.IgnoreQueryFilters().AnyAsync())
        {
            _logger.LogInformation("⏭️  Features ya existen, omitiendo...");
            return;
        }

        _logger.LogInformation("⚡ Seeding Features...");

        var features = new List<Feature>
        {
            new() { Id = FeaturePosTerminalId, ModuleId = ModuleSalesId, Code = "pos_terminal", Name = "Terminal de Punto de Venta", Description = "Terminal POS completa con gestión de sesiones", IsActive = true, RequiresLicense = false, AdditionalCost = 0, CreatedBy = "System" },
            new() { Id = FeatureServiceOrdersId, ModuleId = ModuleSalesId, Code = "service_orders", Name = "Gestión de Servicios", Description = "Órdenes de servicio y seguimiento", IsActive = true, RequiresLicense = false, AdditionalCost = 0, CreatedBy = "System" },
            new() { Id = FeatureStockMgmtId, ModuleId = ModuleInventoryId, Code = "stock_management", Name = "Control de Stock", Description = "Gestión básica de inventario y productos", IsActive = true, RequiresLicense = false, AdditionalCost = 0, CreatedBy = "System" },
            new() { Id = FeatureWarehousesId, ModuleId = ModuleInventoryId, Code = "warehouses", Name = "Multi-bodega (Premium)", Description = "Gestión de múltiples bodegas y traslados", IsActive = true, RequiresLicense = true, AdditionalCost = 29.99m, CreatedBy = "System" },
            new() { Id = FeatureRbacId, ModuleId = ModuleSecurityId, Code = "rbac_core", Name = "Roles y Permisos", Description = "Sistema completo de control de acceso basado en roles", IsActive = true, RequiresLicense = false, AdditionalCost = 0, CreatedBy = "System" }
        };

        await _context.Features.AddRangeAsync(features);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"✅ {features.Count} Features creados");
    }

    private async Task SeedSubscriptionPlansAsync()
    {
        if (await _context.SubscriptionPlans.IgnoreQueryFilters().AnyAsync())
        {
            _logger.LogInformation("⏭️  SubscriptionPlans ya existen, omitiendo...");
            return;
        }

        _logger.LogInformation("💳 Seeding SubscriptionPlans...");

        var plans = new List<Subscription>
        {
            new()
            {
                Id = SubscriptionFullId,
                ProductId = ProductOrdeonId,
                Code = "FARUPOS-FULL",
                Name = "Plan Full - Completo",
                Description = "Acceso completo a todas las funcionalidades: Ventas, Inventario Multi-bodega, Gestión de Servicios y Seguridad con control de roles y permisos.",
                IsFullAccess = true,
                MonthlyPrice = 149.99m,
                AnnualPrice = 1499.99m,
                IsActive = true,
                IsRecommended = true,
                DisplayOrder = 1,
                LimitsConfig = "{\"maxUsers\":-1,\"maxTransactionsPerMonth\":-1,\"storageGB\":-1,\"maxWarehouses\":-1,\"supportLevel\":\"premium\",\"hasAdvancedReports\":true}",
                CreatedBy = "System"
            },
            new()
            {
                Id = SubscriptionMostradorId,
                ProductId = ProductOrdeonId,
                Code = "FARUPOS-MOSTRADOR",
                Name = "Plan Mostrador - Básico",
                Description = "Perfecto para puntos de venta simples. Incluye Terminal POS, Control de Inventario Básico y acceso con permisos estándar para todos los usuarios. Sin gestión de servicios ni multi-bodega.",
                IsFullAccess = false,
                MonthlyPrice = 49.99m,
                AnnualPrice = 499.99m,
                IsActive = true,
                IsRecommended = false,
                DisplayOrder = 2,
                LimitsConfig = "{\"maxUsers\":5,\"maxTransactionsPerMonth\":1000,\"storageGB\":10,\"maxWarehouses\":1,\"supportLevel\":\"standard\",\"hasAdvancedReports\":false}",
                CreatedBy = "System"
            }
        };

        await _context.SubscriptionPlans.AddRangeAsync(plans);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"✅ {plans.Count} SubscriptionPlans creados");
    }

    private async Task SeedSubscriptionFeaturesAsync()
    {
        if (await _context.SubscriptionFeatures.IgnoreQueryFilters().AnyAsync())
        {
            _logger.LogInformation("⏭️  SubscriptionFeatures ya existen, omitiendo...");
            return;
        }

        _logger.LogInformation("🔌 Seeding SubscriptionFeatures...");

        var allFeatures = await _context.Features.Where(f => !f.IsDeleted).ToListAsync();
        var subscriptionFeatures = new List<SubscriptionFeature>();

        // Plan FULL: ALL features
        foreach (var feature in allFeatures)
        {
            subscriptionFeatures.Add(new SubscriptionFeature
            {
                Id = Guid.NewGuid(),
                SubscriptionId = SubscriptionFullId,
                FeatureId = feature.Id,
                IsEnabled = true,
                CreatedBy = "System"
            });
        }

        // Plan MOSTRADOR: Only pos_terminal and stock_management
        var basicFeatures = allFeatures.Where(f => f.Code == "pos_terminal" || f.Code == "stock_management").ToList();
        foreach (var feature in basicFeatures)
        {
            subscriptionFeatures.Add(new SubscriptionFeature
            {
                Id = Guid.NewGuid(),
                SubscriptionId = SubscriptionMostradorId,
                FeatureId = feature.Id,
                IsEnabled = true,
                CreatedBy = "System"
            });
        }

        await _context.SubscriptionFeatures.AddRangeAsync(subscriptionFeatures);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"✅ {subscriptionFeatures.Count} SubscriptionFeatures creados");
    }

    private async Task SeedSuperAdminUserAsync()
    {
        var superAdminEmail = Environment.GetEnvironmentVariable("FARUTECH_SUPERADMIN_EMAIL") ?? "webmaster@farutech.com";
        var superAdminPassword = Environment.GetEnvironmentVariable("FARUTECH_SUPERADMIN_PASSWORD") ?? "Holamundo1*";

        var existingUser = await _userManager.FindByEmailAsync(superAdminEmail);
        if (existingUser != null)
        {
            _logger.LogInformation("⏭️  Usuario SuperAdmin ya existe, omitiendo...");
            return;
        }

        _logger.LogInformation("👤 Creando usuario SuperAdmin...");

        var superAdmin = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = superAdminEmail,
            Email = superAdminEmail,
            EmailConfirmed = true,
            FirstName = "Farid",
            LastName = "Maloof",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var createResult = await _userManager.CreateAsync(superAdmin, superAdminPassword);
        if (!createResult.Succeeded)
        {
            var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
            throw new Exception($"Error creando usuario SuperAdmin: {errors}");
        }

        // Assign SuperAdmin role
        var userRole = new UserRole
        {
            UserId = superAdmin.Id,
            RoleId = SuperAdminRoleId,
            AssignedBy = "System",
            AssignedAt = DateTime.UtcNow
        };

        await _context.UserRoles.AddAsync(userRole);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"✅ Usuario SuperAdmin creado: {superAdminEmail}");
    }
}
