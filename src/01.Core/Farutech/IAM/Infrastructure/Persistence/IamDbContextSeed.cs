using Farutech.IAM.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Farutech.IAM.Infrastructure.Persistence;

/// <summary>
/// Seed data para IAM Service
/// Migrado desde: Infrastructure/Persistence/Migrations/02-migrate-identity-to-iam.sql
/// </summary>
public static class IamDbContextSeed
{
    /// <summary>
    /// Aplica seed data completo al contexto de IAM
    /// </summary>
    public static async Task SeedAsync(IamDbContext context)
    {
        // Orden crítico: Roles → Permissions → RolePermissions → Tenant → User → Membership
        
        if (!await context.Roles.AnyAsync())
            await SeedRolesAsync(context);
            
        if (!await context.Permissions.AnyAsync())
            await SeedPermissionsAsync(context);
            
        if (!await context.RolePermissions.AnyAsync())
            await SeedRolePermissionsAsync(context);
            
        if (!await context.Tenants.AnyAsync())
            await SeedInitialTenantAsync(context);
            
        if (!await context.Users.AnyAsync())
            await SeedAdminUserAsync(context);
            
        if (!await context.TenantMemberships.AnyAsync())
            await SeedTenantMembershipAsync(context);
    }
    
    /// <summary>
    /// Crea 4 roles base del sistema: Owner, Admin, User, Guest
    /// </summary>
    private static async Task SeedRolesAsync(IamDbContext context)
    {
        var roles = new[]
        {
            new Role
            {
                Id = Guid.NewGuid(),
                Name = "Owner",
                NormalizedName = "OWNER",
                Description = "Propietario con acceso completo al sistema",
                IsSystemRole = true,
                CreatedAt = DateTime.UtcNow
            },
            new Role
            {
                Id = Guid.NewGuid(),
                Name = "Admin",
                NormalizedName = "ADMIN",
                Description = "Administrador con permisos de gestión",
                IsSystemRole = true,
                CreatedAt = DateTime.UtcNow
            },
            new Role
            {
                Id = Guid.NewGuid(),
                Name = "User",
                NormalizedName = "USER",
                Description = "Usuario estándar con permisos operativos",
                IsSystemRole = true,
                CreatedAt = DateTime.UtcNow
            },
            new Role
            {
                Id = Guid.NewGuid(),
                Name = "Guest",
                NormalizedName = "GUEST",
                Description = "Invitado con permisos de solo lectura",
                IsSystemRole = true,
                CreatedAt = DateTime.UtcNow
            }
        };
        
        await context.Roles.AddRangeAsync(roles);
        await context.SaveChangesAsync();
    }
    
    /// <summary>
    /// Crea 30+ permisos categorizados: Catálogo, Ventas, Inventario, Finanzas, Reportes, Administración
    /// </summary>
    private static async Task SeedPermissionsAsync(IamDbContext context)
    {
        var permissions = new List<Permission>();
        var now = DateTime.UtcNow;
        
        // Catálogo (5 permisos)
        permissions.AddRange(new[]
        {
            new Permission { Id = Guid.NewGuid(), Code = "catalog.products.view", Name = "Ver Productos", Description = "Permite visualizar productos del catálogo", Category = "Catálogo", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "catalog.products.create", Name = "Crear Productos", Description = "Permite crear nuevos productos", Category = "Catálogo", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "catalog.products.edit", Name = "Editar Productos", Description = "Permite modificar productos existentes", Category = "Catálogo", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "catalog.products.delete", Name = "Eliminar Productos", Description = "Permite eliminar productos", Category = "Catálogo", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "catalog.categories.manage", Name = "Gestionar Categorías", Description = "Permite administrar categorías de productos", Category = "Catálogo", ApplicationId = null, CreatedAt = now }
        });
        
        // Ventas (5 permisos)
        permissions.AddRange(new[]
        {
            new Permission { Id = Guid.NewGuid(), Code = "sales.orders.view", Name = "Ver Pedidos", Description = "Permite visualizar pedidos de venta", Category = "Ventas", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "sales.orders.create", Name = "Crear Pedidos", Description = "Permite crear nuevos pedidos", Category = "Ventas", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "sales.orders.edit", Name = "Editar Pedidos", Description = "Permite modificar pedidos", Category = "Ventas", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "sales.orders.cancel", Name = "Cancelar Pedidos", Description = "Permite cancelar pedidos", Category = "Ventas", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "sales.invoices.generate", Name = "Generar Facturas", Description = "Permite generar facturas de venta", Category = "Ventas", ApplicationId = null, CreatedAt = now }
        });
        
        // Finanzas (5 permisos)
        permissions.AddRange(new[]
        {
            new Permission { Id = Guid.NewGuid(), Code = "finance.payments.view", Name = "Ver Pagos", Description = "Permite visualizar pagos", Category = "Finanzas", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "finance.payments.process", Name = "Procesar Pagos", Description = "Permite procesar pagos", Category = "Finanzas", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "finance.expenses.view", Name = "Ver Gastos", Description = "Permite visualizar gastos", Category = "Finanzas", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "finance.expenses.create", Name = "Crear Gastos", Description = "Permite registrar gastos", Category = "Finanzas", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "finance.reconciliation", Name = "Conciliación Bancaria", Description = "Permite realizar conciliación bancaria", Category = "Finanzas", ApplicationId = null, CreatedAt = now }
        });
        
        // Inventario (3 permisos)
        permissions.AddRange(new[]
        {
            new Permission { Id = Guid.NewGuid(), Code = "inventory.view", Name = "Ver Inventario", Description = "Permite visualizar inventario", Category = "Inventario", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "inventory.adjust", Name = "Ajustar Inventario", Description = "Permite ajustar stock de inventario", Category = "Inventario", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "inventory.transfer", Name = "Transferir Inventario", Description = "Permite transferir inventario entre almacenes", Category = "Inventario", ApplicationId = null, CreatedAt = now }
        });
        
        // Reportes (3 permisos)
        permissions.AddRange(new[]
        {
            new Permission { Id = Guid.NewGuid(), Code = "reports.sales.view", Name = "Ver Reportes de Ventas", Description = "Permite visualizar reportes de ventas", Category = "Reportes", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "reports.inventory.view", Name = "Ver Reportes de Inventario", Description = "Permite visualizar reportes de inventario", Category = "Reportes", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "reports.financial.view", Name = "Ver Reportes Financieros", Description = "Permite visualizar reportes financieros", Category = "Reportes", ApplicationId = null, CreatedAt = now }
        });
        
        // Administración (4 permisos)
        permissions.AddRange(new[]
        {
            new Permission { Id = Guid.NewGuid(), Code = "admin.users.manage", Name = "Gestionar Usuarios", Description = "Permite administrar usuarios del sistema", Category = "Administración", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "admin.roles.manage", Name = "Gestionar Roles", Description = "Permite administrar roles y permisos", Category = "Administración", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "admin.settings.manage", Name = "Gestionar Configuración", Description = "Permite modificar configuración del sistema", Category = "Administración", ApplicationId = null, CreatedAt = now },
            new Permission { Id = Guid.NewGuid(), Code = "admin.audit.view", Name = "Ver Auditoría", Description = "Permite visualizar logs de auditoría", Category = "Administración", ApplicationId = null, CreatedAt = now }
        });
        
        await context.Permissions.AddRangeAsync(permissions);
        await context.SaveChangesAsync();
    }
    
    /// <summary>
    /// Asigna permisos a roles según matriz de permisos:
    /// - Owner: TODOS los permisos
    /// - Admin: Todos excepto admin.settings.manage
    /// - User: Permisos operativos (view, create, edit en catalog, sales, inventory)
    /// - Guest: Solo permisos de lectura (view)
    /// </summary>
    private static async Task SeedRolePermissionsAsync(IamDbContext context)
    {
        var ownerRole = await context.Roles.FirstAsync(r => r.NormalizedName == "OWNER");
        var adminRole = await context.Roles.FirstAsync(r => r.NormalizedName == "ADMIN");
        var userRole = await context.Roles.FirstAsync(r => r.NormalizedName == "USER");
        var guestRole = await context.Roles.FirstAsync(r => r.NormalizedName == "GUEST");
        
        var allPermissions = await context.Permissions.ToListAsync();
        
        var rolePermissions = new List<RolePermission>();
        
        // Owner: TODOS los permisos
        rolePermissions.AddRange(
            allPermissions.Select(p => new RolePermission { RoleId = ownerRole.Id, PermissionId = p.Id })
        );
        
        // Admin: Todos excepto admin.settings.manage
        var adminPermissions = allPermissions.Where(p => p.Code != "admin.settings.manage");
        rolePermissions.AddRange(
            adminPermissions.Select(p => new RolePermission { RoleId = adminRole.Id, PermissionId = p.Id })
        );
        
        // User: Permisos operativos
        var userPermissionCodes = new[]
        {
            "catalog.products.view",
            "catalog.products.create",
            "catalog.products.edit",
            "sales.orders.view",
            "sales.orders.create",
            "inventory.view",
            "reports.sales.view",
            "reports.inventory.view"
        };
        var userPermissions = allPermissions.Where(p => userPermissionCodes.Contains(p.Code));
        rolePermissions.AddRange(
            userPermissions.Select(p => new RolePermission { RoleId = userRole.Id, PermissionId = p.Id })
        );
        
        // Guest: Solo lectura
        var guestPermissionCodes = new[]
        {
            "catalog.products.view",
            "sales.orders.view",
            "inventory.view"
        };
        var guestPermissions = allPermissions.Where(p => guestPermissionCodes.Contains(p.Code));
        rolePermissions.AddRange(
            guestPermissions.Select(p => new RolePermission { RoleId = guestRole.Id, PermissionId = p.Id })
        );
        
        await context.RolePermissions.AddRangeAsync(rolePermissions);
        await context.SaveChangesAsync();
    }
    
    /// <summary>
    /// Crea tenant inicial: Farutech Corporation
    /// </summary>
    private static async Task SeedInitialTenantAsync(IamDbContext context)
    {
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Code = "farutech",
            Name = "Farutech Corporation",
            TaxId = "20123456789",
            RequireMfa = false,
            AllowedIpRanges = null,
            SessionTimeoutMinutes = 480, // 8 horas
            PasswordPolicy = @"{""minLength"":8,""requireUppercase"":true,""requireLowercase"":true,""requireDigit"":true,""requireSpecialChar"":true}",
            FeatureFlags = @"{""allowMultipleSessions"":true,""maxConcurrentSessions"":3}",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        await context.Tenants.AddAsync(tenant);
        await context.SaveChangesAsync();
    }
    
    /// <summary>
    /// Crea usuario administrador: admin@farutech.com / Admin123!
    /// Hash generado con BCrypt (work factor 12)
    /// </summary>
    private static async Task SeedAdminUserAsync(IamDbContext context)
    {
        // BCrypt hash para "Admin123!" (work factor 12)
        // IMPORTANTE: En producción, cambiar esta contraseña inmediatamente
        const string passwordHash = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq/tYGFja";
        
        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@farutech.com",
            EmailConfirmed = true,
            PasswordHash = passwordHash,
            PhoneNumber = null,
            PhoneNumberConfirmed = false,
            TwoFactorEnabled = false,
            TwoFactorSecret = null,
            LockoutEnabled = true,
            LockoutEnd = null,
            AccessFailedCount = 0,
            FirstName = "Admin",
            LastName = "Farutech",
            ProfilePictureUrl = null,
            Locale = "es-PE",
            Timezone = "America/Lima",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            LastLoginAt = null,
            ExternalProvider = null,
            ExternalUserId = null
        };
        
        await context.Users.AddAsync(adminUser);
        await context.SaveChangesAsync();
    }
    
    /// <summary>
    /// Vincula usuario admin con tenant Farutech usando rol Owner
    /// </summary>
    private static async Task SeedTenantMembershipAsync(IamDbContext context)
    {
        var adminUser = await context.Users.FirstAsync(u => u.Email == "admin@farutech.com");
        var farutechTenant = await context.Tenants.FirstAsync(t => t.Code == "farutech");
        var ownerRole = await context.Roles.FirstAsync(r => r.NormalizedName == "OWNER");
        
        var membership = new TenantMembership
        {
            Id = Guid.NewGuid(),
            UserId = adminUser.Id,
            TenantId = farutechTenant.Id,
            RoleId = ownerRole.Id,
            CustomAttributes = "{}",
            IsActive = true,
            GrantedAt = DateTime.UtcNow,
            GrantedBy = adminUser.Id, // Auto-granted
            ExpiresAt = null
        };
        
        await context.TenantMemberships.AddAsync(membership);
        await context.SaveChangesAsync();
    }
}
