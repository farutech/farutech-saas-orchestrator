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
public class FarutechDataSeeder
{
    private readonly OrchestratorDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly ILogger<FarutechDataSeeder> _logger;

    // Predefined GUIDs for deterministic seeding
    private static readonly Guid SuperAdminRoleId = new("00000000-0000-0000-0001-000000000001");
    private static readonly Guid ManagerRoleId = new("00000000-0000-0000-0001-000000000002");
    private static readonly Guid CashierRoleId = new("00000000-0000-0000-0001-000000000003");
    private static readonly Guid SalespersonRoleId = new("00000000-0000-0000-0001-000000000004");
    private static readonly Guid AuditorRoleId = new("00000000-0000-0000-0001-000000000005");

    // Catalog seeding GUIDs
    private static readonly Guid FarutechPosProductId = new("10000000-0000-0000-0001-000000000001");
    private static readonly Guid SalesModuleId = new("10000000-0000-0000-0001-000000000002");
    private static readonly Guid InventoryModuleId = new("10000000-0000-0000-0001-000000000003");
    private static readonly Guid SecurityModuleId = new("10000000-0000-0000-0001-000000000004");

    public FarutechDataSeeder(
        OrchestratorDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        ILogger<FarutechDataSeeder> logger)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("🌱 Iniciando Data Seeding idempotente...");

            // NO ejecutar migraciones aquí - deben ejecutarse ANTES del seeding
            // await _context.Database.MigrateAsync(); // REMOVIDO

            // Seed catalog data first (products, modules, features)
            await SeedCatalogDataAsync();

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

        _logger.LogInformation("✅ Seeding de catálogo completado");
    }

    private async Task SeedProductAsync()
    {
        var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.Code == "farutech_pos");
        if (existingProduct != null)
        {
            _logger.LogInformation("⏭️  Producto 'Farutech POS & Services' ya existe, omitiendo...");
            return;
        }

        var product = new Product
        {
            Id = FarutechPosProductId,
            Code = "farutech_pos",
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
}
