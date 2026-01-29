using Microsoft.EntityFrameworkCore;
using Farutech.Orchestrator.Domain.Entities.Catalog;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Catalog = Farutech.Orchestrator.Domain.Entities.Catalog;

namespace Farutech.Orchestrator.Infrastructure.Seeding;

/// <summary>
/// Seeder para datos iniciales del sistema
/// Incluye: Productos, Módulos, Features, Roles y Permisos
/// </summary>
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

        // Seed in order of dependencies
        await SeedPermissionsAsync(context);
        await SeedRolesAsync(context);
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

    public static async Task ApplySchemaMigrationsAsync(OrchestratorDbContext context)
    {
        // Check if DeploymentType column exists in TenantInstances table using a proper query
        var checkColumnQuery = @"
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_schema = 'tenants' 
            AND table_name = 'TenantInstances' 
            AND column_name = 'DeploymentType'
        ";

        // Use a connection to execute scalar query
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
            // Add the missing DeploymentType column
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

    private static async Task SeedPermissionsAsync(OrchestratorDbContext context)
    {
        // Get existing permission codes to avoid duplicates
        var existingCodes = await context.Permissions
            .Select(p => p.Code)
            .ToListAsync();

        Console.WriteLine($"[DbSeeder] Found {existingCodes.Count} existing permissions");

        var permissions = new List<Permission>
        {
            // ========== DASHBOARD PERMISSIONS ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "dashboard:access",
                Name = "Acceso al Dashboard",
                Description = "Permite acceder al dashboard de la aplicación",
                Module = "Dashboard",
                Category = "Access",
                IsActive = true,
                IsCritical = false
            },

            // ========== CUSTOMERS MODULE ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "customers:list",
                Name = "Listar Clientes",
                Description = "Permite ver la lista de clientes",
                Module = "Clientes",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "customers:read",
                Name = "Ver Detalle de Clientes",
                Description = "Permite ver el detalle de un cliente",
                Module = "Clientes",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "customers:create",
                Name = "Crear Clientes",
                Description = "Permite crear nuevos clientes",
                Module = "Clientes",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "customers:update",
                Name = "Actualizar Clientes",
                Description = "Permite editar información de clientes",
                Module = "Clientes",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "customers:delete",
                Name = "Eliminar Clientes",
                Description = "Permite eliminar clientes (solo Admin)",
                Module = "Clientes",
                Category = "CRUD",
                IsActive = true,
                IsCritical = true
            },

            // ========== PRODUCTS MODULE ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "products:list",
                Name = "Listar Productos",
                Description = "Permite ver el catálogo de productos",
                Module = "Inventario",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "products:create",
                Name = "Crear Productos",
                Description = "Permite crear nuevos productos",
                Module = "Inventario",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "products:update",
                Name = "Actualizar Productos",
                Description = "Permite editar productos",
                Module = "Inventario",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },

            // ========== STOCK MODULE ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "stock:adjust_in",
                Name = "Ajuste de Entrada",
                Description = "Permite realizar ajustes de entrada al inventario",
                Module = "Inventario",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "stock:adjust_out",
                Name = "Ajuste de Salida",
                Description = "Permite realizar ajustes de salida al inventario",
                Module = "Inventario",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },

            // ========== POS MODULE ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "pos:open_session",
                Name = "Abrir Sesión POS",
                Description = "Permite abrir una sesión de punto de venta",
                Module = "Ventas",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "pos:process_sale",
                Name = "Procesar Ventas",
                Description = "Permite procesar ventas en el POS",
                Module = "Ventas",
                Category = "Operations",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "pos:close_session",
                Name = "Cerrar Sesión POS",
                Description = "Permite cerrar una sesión de punto de venta",
                Module = "Ventas",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "master_data.items.read",
                Name = "Consultar Items",
                Description = "Permite ver items/productos del inventario",
                Module = "Datos Maestros",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "master_data.items.update",
                Name = "Modificar Items",
                Description = "Permite editar items/productos del inventario",
                Module = "Datos Maestros",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "master_data.items.delete",
                Name = "Eliminar Items",
                Description = "Permite eliminar items/productos del inventario",
                Module = "Datos Maestros",
                Category = "CRUD",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "master_data.warehouses.manage",
                Name = "Gestionar Bodegas",
                Description = "Permite gestionar bodegas/almacenes",
                Module = "Datos Maestros",
                Category = "Administration",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "master_data.customers.manage",
                Name = "Gestionar Clientes",
                Description = "Permite gestionar clientes y proveedores",
                Module = "Datos Maestros",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },

            // ========== CASH CONTROL MODULE ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "cash_control.register.open",
                Name = "Abrir Caja",
                Description = "Permite abrir una caja registradora",
                Module = "Control de Caja",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "cash_control.register.close",
                Name = "Cerrar Caja",
                Description = "Permite cerrar una caja registradora y realizar arqueo",
                Module = "Control de Caja",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "cash_control.withdrawal.create",
                Name = "Crear Retiro/Sangría",
                Description = "Permite realizar retiros de efectivo de la caja",
                Module = "Control de Caja",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "cash_control.blind_count",
                Name = "Arqueo Ciego",
                Description = "Permite realizar arqueo sin ver el saldo esperado",
                Module = "Control de Caja",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "cash_control.reports.view",
                Name = "Ver Reportes de Caja",
                Description = "Permite ver reportes y cuadres de caja",
                Module = "Control de Caja",
                Category = "Reports",
                IsActive = true,
                IsCritical = false
            },

            // ========== SALES MODULE ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "sales.pos.create",
                Name = "Crear Venta POS",
                Description = "Permite crear ventas en punto de venta",
                Module = "Ventas",
                Category = "Operations",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "sales.pos.cancel",
                Name = "Cancelar Venta",
                Description = "Permite cancelar ventas realizadas",
                Module = "Ventas",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "sales.discounts.apply",
                Name = "Aplicar Descuentos",
                Description = "Permite aplicar descuentos en ventas",
                Module = "Ventas",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "sales.reports.view",
                Name = "Ver Reportes de Ventas",
                Description = "Permite ver reportes de ventas",
                Module = "Ventas",
                Category = "Reports",
                IsActive = true,
                IsCritical = false
            },

            // ========== SERVICES MODULE ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "services.orders.create",
                Name = "Crear Orden de Servicio",
                Description = "Permite crear órdenes de servicio",
                Module = "Servicios",
                Category = "Operations",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "services.orders.manage",
                Name = "Gestionar Órdenes",
                Description = "Permite gestionar el estado de órdenes de servicio",
                Module = "Servicios",
                Category = "Operations",
                IsActive = true,
                IsCritical = false
            },

            // ========== INVENTORY MODULE ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "inventory.stock.view",
                Name = "Ver Inventario",
                Description = "Permite consultar niveles de inventario",
                Module = "Inventario",
                Category = "CRUD",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "inventory.adjustments.create",
                Name = "Crear Ajustes",
                Description = "Permite crear ajustes de inventario",
                Module = "Inventario",
                Category = "Operations",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "inventory.transfers.create",
                Name = "Crear Traslados",
                Description = "Permite crear traslados entre bodegas",
                Module = "Inventario",
                Category = "Operations",
                IsActive = true,
                IsCritical = false
            },

            // ========== REPORTS MODULE ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "reports.financial.view",
                Name = "Ver Reportes Financieros",
                Description = "Permite ver reportes financieros",
                Module = "Reportes",
                Category = "Reports",
                IsActive = true,
                IsCritical = false
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "reports.operational.view",
                Name = "Ver Reportes Operacionales",
                Description = "Permite ver reportes operacionales",
                Module = "Reportes",
                Category = "Reports",
                IsActive = true,
                IsCritical = false
            },

            // ========== ADMINISTRATION MODULE ==========
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "admin.users.manage",
                Name = "Gestionar Usuarios",
                Description = "Permite gestionar usuarios del sistema",
                Module = "Administración",
                Category = "Administration",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "admin.roles.manage",
                Name = "Gestionar Roles",
                Description = "Permite gestionar roles y permisos",
                Module = "Administración",
                Category = "Administration",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "admin.settings.manage",
                Name = "Gestionar Configuración",
                Description = "Permite gestionar configuración del sistema",
                Module = "Administración",
                Category = "Administration",
                IsActive = true,
                IsCritical = true
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Code = "admin.audit.view",
                Name = "Ver Auditoría",
                Description = "Permite ver logs de auditoría",
                Module = "Administración",
                Category = "Reports",
                IsActive = true,
                IsCritical = false
            }
        };

        // Filter out existing permissions
        var newPermissions = permissions
            .Where(p => !existingCodes.Contains(p.Code))
            .ToList();

        if (newPermissions.Any())
        {
            Console.WriteLine($"[DbSeeder] Adding {newPermissions.Count} new permissions");
            await context.Permissions.AddRangeAsync(newPermissions);
            await context.SaveChangesAsync();
        }
        else
        {
            Console.WriteLine("[DbSeeder] All permissions already exist, skipping");
        }
    }

    private static async Task SeedRolesAsync(OrchestratorDbContext context)
    {
        // Check if roles already exist
        if (await context.Roles.AnyAsync())
        {
            Console.WriteLine("[DbSeeder] Roles already exist, skipping");
            return; // Already seeded
        }

        Console.WriteLine("[DbSeeder] Creating roles...");

        // Get all permissions for assignment
        var allPermissions = await context.Permissions.ToListAsync();

        // Define roles
        var superAdminRole = new Role
        {
            Id = Guid.NewGuid(),
            Code = "super_admin",
            Name = "Super Administrador",
            Description = "Acceso total al sistema",
            Level = 1,
            IsSystemRole = true,
            IsActive = true,
            Scope = "Global"
        };

        var managerRole = new Role
        {
            Id = Guid.NewGuid(),
            Code = "manager",
            Name = "Gerente",
            Description = "Gestión de sucursal/tenant completo",
            Level = 2,
            IsSystemRole = true,
            IsActive = true,
            Scope = "Tenant"
        };

        var cashierRole = new Role
        {
            Id = Guid.NewGuid(),
            Code = "cashier",
            Name = "Cajero",
            Description = "Operación de caja y ventas",
            Level = 3,
            IsSystemRole = true,
            IsActive = true,
            Scope = "Warehouse"
        };

        var salespersonRole = new Role
        {
            Id = Guid.NewGuid(),
            Code = "salesperson",
            Name = "Vendedor",
            Description = "Ventas sin acceso a caja",
            Level = 4,
            IsSystemRole = true,
            IsActive = true,
            Scope = "Warehouse"
        };

        var auditorRole = new Role
        {
            Id = Guid.NewGuid(),
            Code = "auditor",
            Name = "Auditor",
            Description = "Solo lectura y reportes",
            Level = 5,
            IsSystemRole = true,
            IsActive = true,
            Scope = "Tenant"
        };

        await context.Roles.AddRangeAsync(new[] 
        { 
            superAdminRole, 
            managerRole, 
            cashierRole, 
            salespersonRole, 
            auditorRole 
        });

        await context.SaveChangesAsync(); // Save to get IDs

        // Assign permissions to SuperAdmin (ALL)
        var superAdminPermissions = allPermissions.Select(p => new RolePermission
        {
            RoleId = superAdminRole.Id,
            PermissionId = p.Id,
            GrantedBy = "System"
        });

        // Assign permissions to Manager (ALL except super admin operations)
        var managerPermissions = allPermissions
            .Where(p => !p.Code.StartsWith("admin.roles") && !p.Code.StartsWith("admin.settings"))
            .Select(p => new RolePermission
            {
                RoleId = managerRole.Id,
                PermissionId = p.Id,
                GrantedBy = "System"
            });

        // Assign permissions to Cashier
        var cashierPermissionCodes = new[]
        {
            "cash_control.register.open",
            "cash_control.register.close",
            "cash_control.withdrawal.create",
            "cash_control.blind_count",
            "cash_control.reports.view",
            "sales.pos.create",
            "sales.discounts.apply",
            "master_data.items.read",
            "master_data.customers.manage",
            "inventory.stock.view"
        };
        var cashierPermissions = allPermissions
            .Where(p => cashierPermissionCodes.Contains(p.Code))
            .Select(p => new RolePermission
            {
                RoleId = cashierRole.Id,
                PermissionId = p.Id,
                GrantedBy = "System"
            });

        // Assign permissions to Salesperson
        var salespersonPermissionCodes = new[]
        {
            "sales.pos.create",
            "services.orders.create",
            "master_data.items.read",
            "master_data.customers.manage",
            "inventory.stock.view"
        };
        var salespersonPermissions = allPermissions
            .Where(p => salespersonPermissionCodes.Contains(p.Code))
            .Select(p => new RolePermission
            {
                RoleId = salespersonRole.Id,
                PermissionId = p.Id,
                GrantedBy = "System"
            });

        // Assign permissions to Auditor (READ-ONLY)
        var auditorPermissions = allPermissions
            .Where(p => p.Category == "Reports" || p.Code.Contains(".read") || p.Code.Contains(".view"))
            .Select(p => new RolePermission
            {
                RoleId = auditorRole.Id,
                PermissionId = p.Id,
                GrantedBy = "System"
            });

        await context.RolePermissions.AddRangeAsync(superAdminPermissions);
        await context.RolePermissions.AddRangeAsync(managerPermissions);
        await context.RolePermissions.AddRangeAsync(cashierPermissions);
        await context.RolePermissions.AddRangeAsync(salespersonPermissions);
        await context.RolePermissions.AddRangeAsync(auditorPermissions);
    }

    private static async Task SeedProductsAsync(OrchestratorDbContext context)
    {
        Console.WriteLine("[DbSeeder] Starting product seeding...");
        
        // Limpiar suscripciones existentes para re-crear
        var existingSubscriptionFeatures = await context.SubscriptionFeatures.ToListAsync();
        if (existingSubscriptionFeatures.Any())
        {
            context.SubscriptionFeatures.RemoveRange(existingSubscriptionFeatures);
            Console.WriteLine($"[DbSeeder] Removed {existingSubscriptionFeatures.Count} existing subscription features");
        }
        
        var existingSubscriptions = await context.SubscriptionPlans.ToListAsync();
        if (existingSubscriptions.Any())
        {
            context.SubscriptionPlans.RemoveRange(existingSubscriptions);
            await context.SaveChangesAsync();
            Console.WriteLine($"[DbSeeder] Removed {existingSubscriptions.Count} existing subscription plans");
        }

        // Check if product already exists
        var existingProduct = await context.Products
            .Include(p => p.Modules)
            .FirstOrDefaultAsync(p => p.Code == "farutech_pos");
        
        if (existingProduct != null)
        {
            Console.WriteLine("[DbSeeder] Product 'Farutech POS' already exists, using existing product");
            
            // Get existing modules
            var existingSalesModule = existingProduct.Modules.FirstOrDefault(m => m.Code == "sales_module");
            var existingInventoryModule = existingProduct.Modules.FirstOrDefault(m => m.Code == "inventory_module");
            var existingSecurityModule = existingProduct.Modules.FirstOrDefault(m => m.Code == "security_module");
            
            if (existingSalesModule == null || existingInventoryModule == null || existingSecurityModule == null)
            {
                Console.WriteLine("[DbSeeder] ERROR: Required modules not found!");
                return;
            }
            
            // Get features
            var allFeatures = await context.Features
                .Where(f => f.ModuleId == existingSalesModule.Id || 
                           f.ModuleId == existingInventoryModule.Id || 
                           f.ModuleId == existingSecurityModule.Id)
                .ToListAsync();
            
            if (!allFeatures.Any())
            {
                Console.WriteLine("[DbSeeder] ERROR: No features found!");
                return;
            }
            
            // Create subscription plans
            await CreateSubscriptionPlansAsync(context, existingProduct.Id, allFeatures);
            return;
        }

        // ========== CREATE NEW PRODUCT ==========
        Console.WriteLine("[DbSeeder] Creating new product 'Farutech POS'...");
        
        var posProduct = new Product
        {
            Id = Guid.NewGuid(),
            Code = "farutech_pos",
            Name = "Farutech POS & Services",
            Description = "Sistema punto de venta con gestión de servicios, control de caja e inventario",
            IsActive = true,
            IsDeleted = false
        };

        await context.Products.AddAsync(posProduct);
        await context.SaveChangesAsync();

        // ========== MODULES FOR POS ==========

        // Module A: Ventas (sales_module)
        var salesModule = new Module
        {
            Id = Guid.NewGuid(),
            ProductId = posProduct.Id,
            Code = "sales_module",
            Name = "Ventas",
            Description = "Gestión completa de ventas y servicios",
            IsActive = true,
            IsDeleted = false
        };

        // Module B: Inventario (inventory_module)
        var inventoryModule = new Module
        {
            Id = Guid.NewGuid(),
            ProductId = posProduct.Id,
            Code = "inventory_module",
            Name = "Inventario",
            Description = "Control de stock y productos",
            IsActive = true,
            IsDeleted = false
        };

        // Module C: Seguridad (security_module)
        var securityModule = new Module
        {
            Id = Guid.NewGuid(),
            ProductId = posProduct.Id,
            Code = "security_module",
            Name = "Seguridad",
            Description = "Gestión de roles, permisos y usuarios",
            IsActive = true,
            IsDeleted = false
        };

        await context.Modules.AddRangeAsync(new[]
        {
            salesModule,
            inventoryModule,
            securityModule
        });

        await context.SaveChangesAsync();

        // ========== FEATURES ==========

        var features = new List<Feature>
        {
            // SALES MODULE FEATURES
            new Feature
            {
                Id = Guid.NewGuid(),
                ModuleId = salesModule.Id,
                Code = "pos_terminal",
                Name = "Terminal de Punto de Venta",
                Description = "Terminal POS completa con gestión de sesiones",
                IsActive = true,
                RequiresLicense = false,
                AdditionalCost = 0
            },
            new Feature
            {
                Id = Guid.NewGuid(),
                ModuleId = salesModule.Id,
                Code = "service_orders",
                Name = "Gestión de Servicios",
                Description = "Órdenes de servicio y seguimiento",
                IsActive = true,
                RequiresLicense = false,
                AdditionalCost = 0
            },

            // INVENTORY MODULE FEATURES
            new Feature
            {
                Id = Guid.NewGuid(),
                ModuleId = inventoryModule.Id,
                Code = "stock_management",
                Name = "Control de Stock",
                Description = "Gestión básica de inventario y productos",
                IsActive = true,
                RequiresLicense = false,
                AdditionalCost = 0
            },
            new Feature
            {
                Id = Guid.NewGuid(),
                ModuleId = inventoryModule.Id,
                Code = "warehouses",
                Name = "Multi-bodega (Premium)",
                Description = "Gestión de múltiples bodegas y traslados",
                IsActive = true,
                RequiresLicense = true,
                AdditionalCost = 29.99m
            },

            // SECURITY MODULE FEATURES
            new Feature
            {
                Id = Guid.NewGuid(),
                ModuleId = securityModule.Id,
                Code = "rbac_core",
                Name = "Roles y Permisos",
                Description = "Sistema completo de control de acceso basado en roles",
                IsActive = true,
                RequiresLicense = false,
                AdditionalCost = 0
            }
        };

        await context.Features.AddRangeAsync(features);
        await context.SaveChangesAsync();
        
        Console.WriteLine($"[DbSeeder] ✅ Product '{posProduct.Name}' seeded with {features.Count} features across 3 modules");

        // Create subscription plans
        await CreateSubscriptionPlansAsync(context, posProduct.Id, features);
    }

    private static async Task CreateSubscriptionPlansAsync(
        OrchestratorDbContext context, 
        Guid productId, 
        List<Feature> features)
    {
        Console.WriteLine("[DbSeeder] Creating subscription plans...");
        
        // Plan 1: FULL - Acceso completo a todo (Ventas + Inventario + Seguridad)
        var fullPlan = new Catalog.Subscription
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            Code = "FARUPOS-FULL",
            Name = "Plan Full - Completo",
            Description = "Acceso completo a todas las funcionalidades: Ventas, Inventario Multi-bodega, Gestión de Servicios y Seguridad con control de roles y permisos.",
            IsFullAccess = true,
            MonthlyPrice = 149.99m,
            AnnualPrice = 1499.99m,
            IsActive = true,
            IsRecommended = true,
            DisplayOrder = 1,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false,
            LimitsConfig = @"{
                ""maxUsers"": -1,
                ""maxTransactionsPerMonth"": -1,
                ""storageGB"": -1,
                ""maxWarehouses"": -1,
                ""supportLevel"": ""premium"",
                ""hasAdvancedReports"": true
            }"
        };

        // Plan 2: MOSTRADOR - Solo Ventas e Inventario básico
        var mostradorPlan = new Catalog.Subscription
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            Code = "FARUPOS-MOSTRADOR",
            Name = "Plan Mostrador - Básico",
            Description = "Perfecto para puntos de venta simples. Incluye Terminal POS, Control de Inventario Básico y acceso con permisos estándar para todos los usuarios. Sin gestión de servicios ni multi-bodega.",
            IsFullAccess = false,
            MonthlyPrice = 49.99m,
            AnnualPrice = 499.99m,
            IsActive = true,
            IsRecommended = false,
            DisplayOrder = 2,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false,
            LimitsConfig = @"{
                ""maxUsers"": 5,
                ""maxTransactionsPerMonth"": 1000,
                ""storageGB"": 10,
                ""maxWarehouses"": 1,
                ""supportLevel"": ""standard"",
                ""hasAdvancedReports"": false
            }"
        };

        await context.SubscriptionPlans.AddRangeAsync(new[] { fullPlan, mostradorPlan });
        await context.SaveChangesAsync();
        Console.WriteLine("[DbSeeder] ✅ Subscription plans created");

        // Asociar features a cada plan
        Console.WriteLine("[DbSeeder] Associating features to plans...");

        // PLAN FULL: Todas las features
        var fullPlanFeatures = features.Select(f => new Catalog.SubscriptionFeature
        {
            Id = Guid.NewGuid(),
            SubscriptionId = fullPlan.Id,
            FeatureId = f.Id,
            IsEnabled = true,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        }).ToList();

        // PLAN MOSTRADOR: Solo pos_terminal + stock_management
        var mostradorFeatures = features
            .Where(f => f.Code == "pos_terminal" || f.Code == "stock_management")
            .Select(f => new Catalog.SubscriptionFeature
            {
                Id = Guid.NewGuid(),
                SubscriptionId = mostradorPlan.Id,
                FeatureId = f.Id,
                IsEnabled = true,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            })
            .ToList();

        await context.SubscriptionFeatures.AddRangeAsync(fullPlanFeatures);
        await context.SubscriptionFeatures.AddRangeAsync(mostradorFeatures);
        await context.SaveChangesAsync();

        Console.WriteLine($"[DbSeeder] ✅ Created 2 subscription plans:");
        Console.WriteLine($"  - Full ({fullPlanFeatures.Count} features): Ventas + Inventario + Seguridad");
        Console.WriteLine($"  - Mostrador ({mostradorFeatures.Count} features): Solo Ventas + Inventario básico");
    }
}
