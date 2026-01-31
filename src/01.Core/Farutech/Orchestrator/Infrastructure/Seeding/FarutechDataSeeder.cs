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
}
