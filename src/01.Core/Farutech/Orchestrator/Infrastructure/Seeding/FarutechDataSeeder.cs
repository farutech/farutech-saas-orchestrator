using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
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
    RoleManager<ApplicationRole> roleManager,
    ILogger<FarutechDataSeeder> logger)
{
    private readonly OrchestratorDbContext _context = context;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly RoleManager<ApplicationRole> _roleManager = roleManager;
    private readonly ILogger<FarutechDataSeeder> _logger = logger;

    // Predefined GUIDs for deterministic seeding
    private static readonly Guid SuperAdminRoleId = new("00000000-0000-0000-0001-000000000001");
    private static readonly Guid ManagerRoleId = new("00000000-0000-0000-0001-000000000002");
    private static readonly Guid CashierRoleId = new("00000000-0000-0000-0001-000000000003");
    private static readonly Guid SalespersonRoleId = new("00000000-0000-0000-0001-000000000004");
    private static readonly Guid AuditorRoleId = new("00000000-0000-0000-0001-000000000005");

    // Catalog seeding GUIDs
    private static readonly Guid FarutechPosProductId = new("00000000-0000-0000-0000-000000000001");
    private static readonly Guid SalesModuleId = new("10000000-0000-0000-0001-000000000002");
    private static readonly Guid InventoryModuleId = new("10000000-0000-0000-0001-000000000003");
    private static readonly Guid SecurityModuleId = new("10000000-0000-0000-0001-000000000004");

    // Subscription plan GUIDs
    private static readonly Guid BasicPlanId = new("20000000-0000-0000-0001-000000000001");
    private static readonly Guid StandardPlanId = new("20000000-0000-0000-0001-000000000002");
    private static readonly Guid ProfessionalPlanId = new("20000000-0000-0000-0001-000000000003");
    private static readonly Guid EnterprisePlanId = new("20000000-0000-0000-0001-000000000004");

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("🌱 Iniciando Data Seeding idempotente...");

            // NO ejecutar migraciones aquí - deben ejecutarse ANTES del seeding
            // await _context.Database.MigrateAsync(); // REMOVIDO

            // Seed catalog data first (products, modules, features)
            await SeedCatalogDataAsync();

            // Seed subscription plans and their feature associations
            await SeedSubscriptionPlansAsync();

            // Seed sample data for development/demo
            await SeedSampleDataAsync();

            // Solo seed de roles y SuperAdmin
            await SeedRolesAsync();
            await SeedSuperAdminUserAsync();

            _logger.LogInformation("✅ Data Seeding idempotente completado exitosamente");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error durante Data Seeding");
            throw;
        }
    }

    private async Task SeedRolesAsync()
    {
        var roles = new[]
        {
            new ApplicationRole { Id = SuperAdminRoleId, Name = "Super Administrador", NormalizedName = "SUPER ADMINISTRADOR" },
            new ApplicationRole { Id = ManagerRoleId, Name = "Gerente", NormalizedName = "GERENTE" },
            new ApplicationRole { Id = CashierRoleId, Name = "Cajero", NormalizedName = "CAJERO" },
            new ApplicationRole { Id = SalespersonRoleId, Name = "Vendedor", NormalizedName = "VENDEDOR" },
            new ApplicationRole { Id = AuditorRoleId, Name = "Auditor", NormalizedName = "AUDITOR" }
        };

        foreach (var role in roles)
        {
            var exists = await _roleManager.RoleExistsAsync(role.Name!);
            if (!exists)
            {
                var result = await _roleManager.CreateAsync(role);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.LogError($"Error creando rol {role.Name}: {errors}");
                }
                else
                {
                    _logger.LogInformation($"✅ Rol creado: {role.Name}");
                }
            }
            else
            {
                _logger.LogInformation($"⏭️  Rol ya existe: {role.Name}, omitiendo...");
            }
        }
    }

    /// <summary>
    /// Seeds the initial SuperAdmin user with a predefined email and password, and assigns the SuperAdmin role.
    /// El usuario SuperAdmin tiene acceso completo a todas las funcionalidades y es ideal para administración inicial y pruebas.
    /// Las credenciales por defecto se pueden configurar mediante variables de entorno:
    /// - FARUTECH_SUPERADMIN_EMAIL (default: webmaster@farutech.com)
    /// - FARUTECH_SUPERADMIN_PASSWORD (default: Holamundo1*)
    /// Nota: En producción, es crucial cambiar estas credenciales por defecto para garantizar la seguridad. Se recomienda usar un password manager para generar y almacenar una contraseña fuerte.
    /// El proceso de creación es idempotente, por lo que si el usuario ya existe, se omite la creación y se registra un mensaje en los logs. Si el usuario no existe, se crea, se le asigna el rol de SuperAdmin y se le agregan claims personalizados para TenantId y ScopeId con valores vacíos (indicating acceso global). Cualquier error durante la creación o asignación de roles se registra en los logs con detalles del error.
    /// </summary>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
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

        // Assign SuperAdmin role using Identity
        var addRoleResult = await _userManager.AddToRoleAsync(superAdmin, "Super Administrador");
        if (!addRoleResult.Succeeded)
        {
            var errors = string.Join(", ", addRoleResult.Errors.Select(e => e.Description));
            throw new Exception($"Error asignando rol SuperAdmin: {errors}");
        }

        // Add custom claims for tenant and scope
        await _userManager.AddClaimAsync(superAdmin, new Claim("TenantId", Guid.Empty.ToString()));
        await _userManager.AddClaimAsync(superAdmin, new Claim("ScopeId", Guid.Empty.ToString()));

        _logger.LogInformation($"✅ Usuario SuperAdmin creado: {superAdminEmail}");
    }

    private async Task SeedCatalogDataAsync()
    {
        _logger.LogInformation("📦 Iniciando seeding de datos de catálogo...");

        // Seed Product
        await SeedProductAsync();

        // Seed Modules
        await SeedModulesAsync();

        // Seed Features
        await SeedFeaturesAsync();

        // Seed Subscription Plans
        await SeedSubscriptionPlansAsync();

        _logger.LogInformation("✅ Seeding de catálogo completado");
    }

    private async Task SeedProductAsync()
    {
        var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.Code == "FARUPOS");
        if (existingProduct != null)
        {
            _logger.LogInformation("⏭️  Producto 'Farutech POS & Services' ya existe, omitiendo...");
            return;
        }

        var product = new Product
        {
            Id = FarutechPosProductId,
            Code = "FARUPOS",
            Name = "Farutech POS & Services",
            Description = "Sistema de gestión de punto de venta, servicios y control de inventario.",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("✅ Producto creado: Farutech POS & Services");
    }

    private async Task SeedModulesAsync()
    {
        var modules = new[]
        {
            new Module
            {
                Id = SalesModuleId,
                ProductId = FarutechPosProductId,
                Code = "sales_module",
                Name = "Ventas",
                Description = "Módulo de gestión de ventas y punto de venta",
                IsRequired = true,
                IsActive = true,
                DeploymentType = "Shared",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new Module
            {
                Id = InventoryModuleId,
                ProductId = FarutechPosProductId,
                Code = "inventory_module",
                Name = "Inventario",
                Description = "Módulo de control de inventario y stock",
                IsRequired = true,
                IsActive = true,
                DeploymentType = "Shared",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new Module
            {
                Id = SecurityModuleId,
                ProductId = FarutechPosProductId,
                Code = "security_module",
                Name = "Seguridad",
                Description = "Módulo de gestión de seguridad y permisos",
                IsRequired = true,
                IsActive = true,
                DeploymentType = "Shared",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            }
        };

        foreach (var module in modules)
        {
            var existingModule = await _context.Modules.FirstOrDefaultAsync(m => m.Code == module.Code);
            if (existingModule == null)
            {
                _context.Modules.Add(module);
                _logger.LogInformation($"✅ Módulo creado: {module.Name}");
            }
            else
            {
                _logger.LogInformation($"⏭️  Módulo ya existe: {module.Name}, omitiendo...");
            }
        }

        await _context.SaveChangesAsync();
    }

    private async Task SeedFeaturesAsync()
    {
        var features = new[]
        {
            // Sales Module Features
            new Feature
            {
                Id = Guid.NewGuid(),
                ModuleId = SalesModuleId,
                Code = "pos_terminal",
                Name = "Terminal de Punto de Venta",
                Description = "Funcionalidad básica de terminal POS",
                IsActive = true,
                RequiresLicense = false,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new Feature
            {
                Id = Guid.NewGuid(),
                ModuleId = SalesModuleId,
                Code = "service_orders",
                Name = "Gestión de Servicios",
                Description = "Gestión de órdenes de servicio",
                IsActive = true,
                RequiresLicense = false,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },

            // Inventory Module Features
            new Feature
            {
                Id = Guid.NewGuid(),
                ModuleId = InventoryModuleId,
                Code = "stock_management",
                Name = "Control de Stock",
                Description = "Gestión básica de inventario y stock",
                IsActive = true,
                RequiresLicense = false,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new Feature
            {
                Id = Guid.NewGuid(),
                ModuleId = InventoryModuleId,
                Code = "warehouses",
                Name = "Multi-bodega",
                Description = "Gestión de múltiples bodegas y transferencias",
                IsActive = true,
                RequiresLicense = true,
                AdditionalCost = 50.00m,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },

            // Security Module Features
            new Feature
            {
                Id = Guid.NewGuid(),
                ModuleId = SecurityModuleId,
                Code = "rbac_core",
                Name = "Roles y Permisos",
                Description = "Sistema básico de roles y permisos RBAC",
                IsActive = true,
                RequiresLicense = false,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            }
        };

        foreach (var feature in features)
        {
            var existingFeature = await _context.Features.FirstOrDefaultAsync(f => f.Code == feature.Code);
            if (existingFeature == null)
            {
                _context.Features.Add(feature);
                _logger.LogInformation($"✅ Feature creada: {feature.Name}");
            }
            else
            {
                _logger.LogInformation($"⏭️  Feature ya existe: {feature.Name}, omitiendo...");
            }
        }

        await _context.SaveChangesAsync();
    }

    private async Task SeedSubscriptionPlansAsync()
    {
        _logger.LogInformation("📋 Iniciando seeding de planes de suscripción...");

        var subscriptionPlans = new[]
        {
            new Subscription
            {
                Id = BasicPlanId,
                ProductId = FarutechPosProductId,
                Code = "farupos_basic",
                Name = "Plan Básico",
                Description = "Ideal para pequeños negocios que están comenzando. Incluye funcionalidades esenciales de ventas e inventario básico.",
                IsFullAccess = false,
                MonthlyPrice = 29.99m,
                AnnualPrice = 299.99m, // ~20% descuento
                IsActive = true,
                IsRecommended = false,
                DisplayOrder = 1,
                LimitsConfig = @"{
                    ""maxUsers"": 3,
                    ""maxTransactions"": 500,
                    ""storageGB"": 5,
                    ""support"": ""email""
                }",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new Subscription
            {
                Id = StandardPlanId,
                ProductId = FarutechPosProductId,
                Code = "farupos_standard",
                Name = "Plan Estándar",
                Description = "Perfecto para negocios en crecimiento. Incluye todas las funcionalidades básicas con límites ampliados.",
                IsFullAccess = false,
                MonthlyPrice = 79.99m,
                AnnualPrice = 799.99m, // ~17% descuento
                IsActive = true,
                IsRecommended = true,
                DisplayOrder = 2,
                LimitsConfig = @"{
                    ""maxUsers"": 10,
                    ""maxTransactions"": 2500,
                    ""storageGB"": 25,
                    ""support"": ""email+chat""
                }",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new Subscription
            {
                Id = ProfessionalPlanId,
                ProductId = FarutechPosProductId,
                Code = "farupos_professional",
                Name = "Plan Profesional",
                Description = "Para negocios establecidos. Incluye funcionalidades avanzadas y gestión de múltiples bodegas.",
                IsFullAccess = false,
                MonthlyPrice = 149.99m,
                AnnualPrice = 1499.99m, // ~17% descuento
                IsActive = true,
                IsRecommended = false,
                DisplayOrder = 3,
                LimitsConfig = @"{
                    ""maxUsers"": 25,
                    ""maxTransactions"": 10000,
                    ""storageGB"": 100,
                    ""support"": ""priority"",
                    ""warehouses"": true
                }",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new Subscription
            {
                Id = EnterprisePlanId,
                ProductId = FarutechPosProductId,
                Code = "farupos_enterprise",
                Name = "Plan Enterprise",
                Description = "Solución completa para grandes empresas. Acceso ilimitado a todas las funcionalidades y soporte premium.",
                IsFullAccess = true,
                MonthlyPrice = 299.99m,
                AnnualPrice = 2999.99m, // ~17% descuento
                IsActive = true,
                IsRecommended = false,
                DisplayOrder = 4,
                LimitsConfig = @"{
                    ""maxUsers"": -1,
                    ""maxTransactions"": -1,
                    ""storageGB"": -1,
                    ""support"": ""dedicated"",
                    ""warehouses"": true,
                    ""customizations"": true,
                    ""api"": true
                }",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            }
        };

        foreach (var plan in subscriptionPlans)
        {
            var existingPlan = await _context.SubscriptionPlans.FirstOrDefaultAsync(s => s.Code == plan.Code);
            if (existingPlan == null)
            {
                _context.SubscriptionPlans.Add(plan);
                _logger.LogInformation($"✅ Plan de suscripción creado: {plan.Name} (${plan.MonthlyPrice}/mes)");
            }
            else
            {
                _logger.LogInformation($"⏭️  Plan de suscripción ya existe: {plan.Name}, omitiendo...");
            }
        }

        await _context.SaveChangesAsync();

        // Associate features with subscription plans
        await SeedSubscriptionPlanFeaturesAsync();

        _logger.LogInformation("✅ Seeding de planes de suscripción completado");
    }

    private async Task SeedSubscriptionPlanFeaturesAsync()
    {
        _logger.LogInformation("🔗 Asociando features a planes de suscripción...");

        // Get all features
        var features = await _context.Features.ToListAsync();
        var posTerminal = features.First(f => f.Code == "pos_terminal");
        var serviceOrders = features.First(f => f.Code == "service_orders");
        var stockManagement = features.First(f => f.Code == "stock_management");
        var warehouses = features.First(f => f.Code == "warehouses");
        var rbacCore = features.First(f => f.Code == "rbac_core");

        // Define which features are included in each plan
        var planFeatures = new[]
        {
            // Basic Plan - Only essential features
            new { PlanId = BasicPlanId, FeatureIds = new[] { posTerminal.Id, stockManagement.Id, rbacCore.Id } },

            // Standard Plan - All basic features
            new { PlanId = StandardPlanId, FeatureIds = new[] { posTerminal.Id, serviceOrders.Id, stockManagement.Id, rbacCore.Id } },

            // Professional Plan - All features except full access
            new { PlanId = ProfessionalPlanId, FeatureIds = new[] { posTerminal.Id, serviceOrders.Id, stockManagement.Id, warehouses.Id, rbacCore.Id } },

            // Enterprise Plan - All features (full access)
            new { PlanId = EnterprisePlanId, FeatureIds = new[] { posTerminal.Id, serviceOrders.Id, stockManagement.Id, warehouses.Id, rbacCore.Id } }
        };

        foreach (var planFeature in planFeatures)
        {
            foreach (var featureId in planFeature.FeatureIds)
            {
                var existingAssociation = await _context.SubscriptionFeatures
                    .FirstOrDefaultAsync(spf => spf.SubscriptionId == planFeature.PlanId && spf.FeatureId == featureId);

                if (existingAssociation == null)
                {
                    var subscriptionFeature = new SubscriptionFeature
                    {
                        SubscriptionId = planFeature.PlanId,
                        FeatureId = featureId,
                        IsEnabled = true,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "System"
                    };

                    _context.SubscriptionFeatures.Add(subscriptionFeature);
                }
            }
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("✅ Asociación de features a planes completada");
    }

    private async Task SeedSampleDataAsync()
    {
        _logger.LogInformation("🏢 Iniciando seeding de datos de ejemplo...");

        // Seed sample customers and tenants for development/demo
        await SeedSampleCustomersAsync();
        await SeedSampleTenantsAsync();

        _logger.LogInformation("✅ Seeding de datos de ejemplo completado");
    }

    private async Task SeedSampleCustomersAsync()
    {
        var sampleCustomers = new[]
        {
            new Domain.Entities.Tenants.Customer
            {
                Id = new Guid("30000000-0000-0000-0001-000000000001"),
                Code = "DEMO001",
                CompanyName = "Tienda Demo S.A.",
                TaxId = "12345678-9",
                Email = "contacto@tiendademo.com",
                Phone = "+56912345678",
                Address = "Av. Providencia 123, Santiago, Chile",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new Domain.Entities.Tenants.Customer
            {
                Id = new Guid("30000000-0000-0000-0001-000000000002"),
                Code = "FARUTECH001",
                CompanyName = "Farutech SpA",
                TaxId = "87654321-0",
                Email = "admin@farutech.com",
                Phone = "+56987654321",
                Address = "Calle Tech 456, Santiago, Chile",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            }
        };

        foreach (var customer in sampleCustomers)
        {
            var existing = await _context.Customers.FirstOrDefaultAsync(c => c.Code == customer.Code);
            if (existing == null)
            {
                _context.Customers.Add(customer);
                _logger.LogInformation($"✅ Cliente de ejemplo creado: {customer.CompanyName}");
            }
            else
            {
                _logger.LogInformation($"⏭️  Cliente ya existe: {customer.CompanyName}, omitiendo...");
            }
        }

        await _context.SaveChangesAsync();
    }

    private async Task SeedSampleTenantsAsync()
    {
        var sampleTenants = new[]
        {
            new Domain.Entities.Tenants.TenantInstance
            {
                Id = new Guid("40000000-0000-0000-0001-000000000001"),
                CustomerId = new Guid("30000000-0000-0000-0001-000000000001"), // Tienda Demo
                TenantCode = "demo001",
                Code = "DEMO001_POS",
                Name = "Tienda Demo - POS Principal",
                DeploymentType = "Shared",
                ApplicationType = "FaruPOS",
                Status = "Active",
                ConnectionString = "Host=localhost;Database=farutech_demo001;Username=postgres;Password=password",
                ApiBaseUrl = "https://api-demo.farutech.com",
                ActiveFeaturesJson = "{\"pos\": true, \"inventory\": true}",
                ThemeColor = "#3B82F6",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            },
            new Domain.Entities.Tenants.TenantInstance
            {
                Id = new Guid("40000000-0000-0000-0001-000000000002"),
                CustomerId = new Guid("30000000-0000-0000-0001-000000000002"), // Farutech
                TenantCode = "farutech001",
                Code = "FARUTECH001_DEV",
                Name = "Farutech - Desarrollo",
                DeploymentType = "Dedicated",
                ApplicationType = "Orchestrator",
                Status = "Active",
                ConnectionString = "Host=localhost;Database=farutech_dev;Username=postgres;Password=password",
                ApiBaseUrl = "https://api-dev.farutech.com",
                ActiveFeaturesJson = "{\"orchestrator\": true, \"billing\": true, \"monitoring\": true}",
                ThemeColor = "#10B981",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            }
        };

        foreach (var tenant in sampleTenants)
        {
            var existing = await _context.TenantInstances.FirstOrDefaultAsync(t => t.TenantCode == tenant.TenantCode);
            if (existing == null)
            {
                _context.TenantInstances.Add(tenant);
                _logger.LogInformation($"✅ Tenant de ejemplo creado: {tenant.Name}");
            }
            else
            {
                _logger.LogInformation($"⏭️  Tenant ya existe: {tenant.Name}, omitiendo...");
            }
        }

        await _context.SaveChangesAsync();
    }
}
