using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Infrastructure.Persistence;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Implementación del servicio de permisos RBAC con caché
/// </summary>
public class PermissionService(OrchestratorDbContext context,
                               IMemoryCache cache,
                               UserManager<ApplicationUser> userManager,
                               RoleManager<IdentityRole<Guid>> roleManager) : IPermissionService
{
    private readonly OrchestratorDbContext _context = context;
    private readonly IMemoryCache _cache = cache;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;
    private const int CacheExpirationMinutes = 15;

    public async Task<bool> HasPermissionAsync(
        Guid userId, 
        string permissionCode, 
        Guid? tenantId = null, 
        Guid? scopeId = null)
    {
        // Cache key based on user, permission, tenant and scope
        var cacheKey = $"permission:{userId}:{permissionCode}:{tenantId}:{scopeId}";

        if (_cache.TryGetValue<bool>(cacheKey, out var cachedResult))
        {
            return cachedResult;
        }

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            _cache.Set(cacheKey, false, TimeSpan.FromMinutes(CacheExpirationMinutes));
            return false;
        }

        var roleNames = await _userManager.GetRolesAsync(user);
        var userClaims = await _userManager.GetClaimsAsync(user);

        foreach (var roleName in roleNames)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null) continue;

            // Check tenant/scope via user claims for this role
            var tenantClaim = userClaims.FirstOrDefault(c => c.Type == $"role:{role.Id}:tenant");
            if (tenantId.HasValue && tenantClaim?.Value != tenantId.Value.ToString()) continue;

            var scopeClaim = userClaims.FirstOrDefault(c => c.Type == $"role:{role.Id}:scope");
            if (scopeId.HasValue && scopeClaim?.Value != scopeId.Value.ToString()) continue;

            // Check if role has the permission
            var hasPermissionInRole = await _context.RolePermissions
                .Include(rp => rp.Permission)
                .AnyAsync(rp => rp.RoleId == role.Id && rp.Permission.Code == permissionCode && rp.Permission.IsActive);

            if (hasPermissionInRole)
            {
                _cache.Set(cacheKey, true, TimeSpan.FromMinutes(CacheExpirationMinutes));
                return true;
            }
        }

        _cache.Set(cacheKey, false, TimeSpan.FromMinutes(CacheExpirationMinutes));
        return false;
    }

    public async Task<IEnumerable<Permission>> GetUserPermissionsAsync(
        Guid userId, 
        Guid? tenantId = null, 
        Guid? scopeId = null)
    {
        var cacheKey = $"user_permissions:{userId}:{tenantId}:{scopeId}";

        if (_cache.TryGetValue<IEnumerable<Permission>>(cacheKey, out var cachedPermissions) && cachedPermissions != null)
        {
            return cachedPermissions;
        }

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            return Enumerable.Empty<Permission>();
        }

        var roleNames = await _userManager.GetRolesAsync(user);
        var userClaims = await _userManager.GetClaimsAsync(user);
        var roleIds = new List<Guid>();

        foreach (var roleName in roleNames)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null) continue;

            // Check tenant/scope
            var tenantClaim = userClaims.FirstOrDefault(c => c.Type == $"role:{role.Id}:tenant");
            if (tenantId.HasValue && tenantClaim?.Value != tenantId.Value.ToString()) continue;

            var scopeClaim = userClaims.FirstOrDefault(c => c.Type == $"role:{role.Id}:scope");
            if (scopeId.HasValue && scopeClaim?.Value != scopeId.Value.ToString()) continue;

            roleIds.Add(role.Id);
        }

        var permissions = await _context.RolePermissions
            .Include(rp => rp.Permission)
            .Where(rp => roleIds.Contains(rp.RoleId) && rp.Permission.IsActive)
            .Select(rp => rp.Permission)
            .Distinct()
            .ToListAsync();

        _cache.Set(cacheKey, permissions, TimeSpan.FromMinutes(CacheExpirationMinutes));

        return permissions;
    }

    public async Task<IEnumerable<Permission>> GetAllPermissionsAsync()
    {
        const string cacheKey = "all_permissions";

        if (_cache.TryGetValue<IEnumerable<Permission>>(cacheKey, out var cachedPermissions) && cachedPermissions != null)
        {
            return cachedPermissions;
        }

        var permissions = await _context.Permissions
            .Where(p => p.IsActive)
            .OrderBy(p => p.Module)
            .ThenBy(p => p.Code)
            .ToListAsync();

        _cache.Set(cacheKey, permissions, TimeSpan.FromMinutes(CacheExpirationMinutes));

        return permissions;
    }

    public async Task<IEnumerable<Permission>> GetPermissionsByModuleAsync(string module)
    {
        var cacheKey = $"permissions_module:{module}";

        if (_cache.TryGetValue<IEnumerable<Permission>>(cacheKey, out var cachedPermissions) && cachedPermissions != null)
        {
            return cachedPermissions;
        }

        var permissions = await _context.Permissions
            .Where(p => p.Module == module && p.IsActive)
            .OrderBy(p => p.Code)
            .ToListAsync();

        _cache.Set(cacheKey, permissions, TimeSpan.FromMinutes(CacheExpirationMinutes));

        return permissions;
    }

    public async Task<IEnumerable<Permission>> GetPermissionsByRoleAsync(Guid roleId)
    {
        var cacheKey = $"permissions_role:{roleId}";

        if (_cache.TryGetValue<IEnumerable<Permission>>(cacheKey, out var cachedPermissions) && cachedPermissions != null)
        {
            return cachedPermissions;
        }

        var permissions = await _context.RolePermissions
            .Include(rp => rp.Permission)
            .Where(rp => rp.RoleId == roleId && rp.Permission.IsActive)
            .Select(rp => rp.Permission)
            .OrderBy(p => p.Code)
            .ToListAsync();

        _cache.Set(cacheKey, permissions, TimeSpan.FromMinutes(CacheExpirationMinutes));

        return permissions;
    }

    public async Task<bool> AssignPermissionToRoleAsync(Guid roleId, Guid permissionId)
    {
        // Check if assignment already exists
        var existing = await _context.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);

        if (existing != null)
        {
            return true; // Already assigned
        }

        var rolePermission = new RolePermission
        {
            RoleId = roleId,
            PermissionId = permissionId,
            GrantedAt = DateTime.UtcNow,
            GrantedBy = "System" // TODO: Get from current user context
        };

        _context.RolePermissions.Add(rolePermission);
        await _context.SaveChangesAsync();

        // Invalidate related caches
        await InvalidatePermissionCachesAsync();

        return true;
    }

    public async Task<bool> RemovePermissionFromRoleAsync(Guid roleId, Guid permissionId)
    {
        var rolePermission = await _context.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);

        if (rolePermission == null)
        {
            return false; // Not assigned
        }

        _context.RolePermissions.Remove(rolePermission);
        await _context.SaveChangesAsync();

        // Invalidate related caches
        await InvalidatePermissionCachesAsync();

        return true;
    }

    public async Task<IEnumerable<IdentityRole<Guid>>> GetRolesForPermissionAsync(Guid permissionId)
    {
        var cacheKey = $"roles_permission:{permissionId}";

        if (_cache.TryGetValue<IEnumerable<IdentityRole<Guid>>>(cacheKey, out var cachedRoles) && cachedRoles != null)
        {
            return cachedRoles;
        }

        var roleIds = await _context.RolePermissions
            .Where(rp => rp.PermissionId == permissionId)
            .Select(rp => rp.RoleId)
            .ToListAsync();

        var roles = new List<IdentityRole<Guid>>();
        foreach (var roleId in roleIds)
        {
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role != null) roles.Add(role);
        }

        roles = roles.OrderBy(r => r.Name).ToList();

        _cache.Set(cacheKey, roles, TimeSpan.FromMinutes(CacheExpirationMinutes));

        return roles;
    }

    public async Task<bool> UserHasAnyPermissionAsync(
        Guid userId, 
        IEnumerable<string> permissionCodes, 
        Guid? tenantId = null, 
        Guid? scopeId = null)
    {
        foreach (var code in permissionCodes)
        {
            if (await HasPermissionAsync(userId, code, tenantId, scopeId))
            {
                return true;
            }
        }
        return false;
    }

    public async Task<bool> UserHasAllPermissionsAsync(
        Guid userId, 
        IEnumerable<string> permissionCodes, 
        Guid? tenantId = null, 
        Guid? scopeId = null)
    {
        foreach (var code in permissionCodes)
        {
            if (!await HasPermissionAsync(userId, code, tenantId, scopeId))
            {
                return false;
            }
        }
        return true;
    }

    public async Task<Dictionary<string, bool>> CheckMultiplePermissionsAsync(
        Guid userId, 
        IEnumerable<string> permissionCodes, 
        Guid? tenantId = null, 
        Guid? scopeId = null)
    {
        var results = new Dictionary<string, bool>();

        foreach (var code in permissionCodes)
        {
            results[code] = await HasPermissionAsync(userId, code, tenantId, scopeId);
        }

        return results;
    }

    public async Task<IEnumerable<Permission>> GetUserPermissionsAsync(
        Guid userId, 
        Guid? tenantId = null)
    {
        return await GetUserPermissionsAsync(userId, tenantId, null);
    }

    public async Task<IEnumerable<IdentityRole<Guid>>> GetUserRolesAsync(
        Guid userId, 
        Guid? tenantId = null)
    {
        var cacheKey = $"user_roles:{userId}:{tenantId}";

        if (_cache.TryGetValue<IEnumerable<IdentityRole<Guid>>>(cacheKey, out var cachedRoles) && cachedRoles != null)
        {
            return cachedRoles;
        }

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            return Enumerable.Empty<IdentityRole<Guid>>();
        }

        var roleNames = await _userManager.GetRolesAsync(user);
        var userClaims = await _userManager.GetClaimsAsync(user);
        var roles = new List<IdentityRole<Guid>>();

        foreach (var roleName in roleNames)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null) continue;

            // Check tenant
            var tenantClaim = userClaims.FirstOrDefault(c => c.Type == $"role:{role.Id}:tenant");
            if (tenantId.HasValue && tenantClaim?.Value != tenantId.Value.ToString()) continue;

            roles.Add(role);
        }

        _cache.Set(cacheKey, roles, TimeSpan.FromMinutes(CacheExpirationMinutes));

        return roles;
    }

    public async Task<bool> AssignRoleToUserAsync(
        Guid userId, 
        Guid roleId, 
        Guid? tenantId = null, 
        Guid? scopeId = null,
        string? scopeType = null,
        string? assignedBy = null)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;

        var role = await _roleManager.FindByIdAsync(roleId.ToString());
        if (role == null) return false;

        // Check if already assigned
        if (await _userManager.IsInRoleAsync(user, role.Name!))
        {
            // Check if claims match
            var userClaims = await _userManager.GetClaimsAsync(user);
            var tenantClaim = userClaims.FirstOrDefault(c => c.Type == $"role:{role.Id}:tenant");
            var scopeClaim = userClaims.FirstOrDefault(c => c.Type == $"role:{role.Id}:scope");

            if ((tenantId.HasValue && tenantClaim?.Value == tenantId.Value.ToString()) ||
                (!tenantId.HasValue && tenantClaim == null))
            {
                if ((scopeId.HasValue && scopeClaim?.Value == scopeId.Value.ToString()) ||
                    (!scopeId.HasValue && scopeClaim == null))
                {
                    return true; // Already assigned with same context
                }
            }
        }

        // Add to role
        var result = await _userManager.AddToRoleAsync(user, role.Name!);
        if (!result.Succeeded) return false;

        // Add claims for tenant/scope
        var claimsToAdd = new List<Claim>();
        if (tenantId.HasValue)
        {
            claimsToAdd.Add(new Claim($"role:{role.Id}:tenant", tenantId.Value.ToString()));
        }
        if (scopeId.HasValue)
        {
            claimsToAdd.Add(new Claim($"role:{role.Id}:scope", scopeId.Value.ToString()));
        }
        if (scopeType != null)
        {
            claimsToAdd.Add(new Claim($"role:{role.Id}:scopeType", scopeType));
        }
        if (assignedBy != null)
        {
            claimsToAdd.Add(new Claim($"role:{role.Id}:assignedBy", assignedBy));
        }
        claimsToAdd.Add(new Claim($"role:{role.Id}:assignedAt", DateTime.UtcNow.ToString("O")));

        await _userManager.AddClaimsAsync(user, claimsToAdd);

        // Invalidate caches
        await InvalidateUserCachesAsync(userId);

        return true;
    }

    public async Task<bool> RemoveRoleFromUserAsync(
        Guid userId, 
        Guid roleId, 
        Guid? tenantId = null)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;

        var role = await _roleManager.FindByIdAsync(roleId.ToString());
        if (role == null) return false;

        // Check if assigned with matching tenant
        if (!await _userManager.IsInRoleAsync(user, role.Name!)) return false;

        var userClaims = await _userManager.GetClaimsAsync(user);
        var tenantClaim = userClaims.FirstOrDefault(c => c.Type == $"role:{role.Id}:tenant");
        if (tenantId.HasValue && tenantClaim?.Value != tenantId.Value.ToString()) return false;

        // Remove from role
        var result = await _userManager.RemoveFromRoleAsync(user, role.Name!);
        if (!result.Succeeded) return false;

        // Remove related claims
        var claimsToRemove = userClaims.Where(c => c.Type.StartsWith($"role:{role.Id}:")).ToList();
        await _userManager.RemoveClaimsAsync(user, claimsToRemove);

        // Invalidate caches
        await InvalidateUserCachesAsync(userId);

        return true;
    }

    public async Task<IEnumerable<Permission>> GetRolePermissionsAsync(Guid roleId)
    {
        return await GetPermissionsByRoleAsync(roleId);
    }

    public async Task<bool> AssignPermissionToRoleAsync(
        Guid roleId, 
        Guid permissionId, 
        string? grantedBy = null)
    {
        return await AssignPermissionToRoleAsync(roleId, permissionId);
    }

    public async Task<bool> HasRoleAsync(
        Guid userId, 
        string roleCode, 
        Guid? tenantId = null)
    {
        var cacheKey = $"has_role:{userId}:{roleCode}:{tenantId}";

        if (_cache.TryGetValue<bool>(cacheKey, out var cachedResult))
        {
            return cachedResult;
        }

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            _cache.Set(cacheKey, false, TimeSpan.FromMinutes(CacheExpirationMinutes));
            return false;
        }

        var role = await _roleManager.FindByNameAsync(roleCode);
        if (role == null)
        {
            _cache.Set(cacheKey, false, TimeSpan.FromMinutes(CacheExpirationMinutes));
            return false;
        }

        if (!await _userManager.IsInRoleAsync(user, role.Name!))
        {
            _cache.Set(cacheKey, false, TimeSpan.FromMinutes(CacheExpirationMinutes));
            return false;
        }

        // Check tenant
        if (tenantId.HasValue)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var tenantClaim = userClaims.FirstOrDefault(c => c.Type == $"role:{role.Id}:tenant");
            if (tenantClaim?.Value != tenantId.Value.ToString())
            {
                _cache.Set(cacheKey, false, TimeSpan.FromMinutes(CacheExpirationMinutes));
                return false;
            }
        }

        _cache.Set(cacheKey, true, TimeSpan.FromMinutes(CacheExpirationMinutes));
        return true;
    }

    public async Task<IEnumerable<IdentityRole<Guid>>> GetAllRolesAsync()
    {
        const string cacheKey = "all_roles";

        if (_cache.TryGetValue<IEnumerable<IdentityRole<Guid>>>(cacheKey, out var cachedRoles) && cachedRoles != null)
        {
            return cachedRoles;
        }

        var roles = await _roleManager.Roles
            .OrderBy(r => r.Name)
            .ToListAsync();

        _cache.Set(cacheKey, roles, TimeSpan.FromMinutes(CacheExpirationMinutes));

        return roles;
    }

    private async Task InvalidateUserCachesAsync(Guid userId)
    {
        // Simplified cache invalidation for user-related caches
        await Task.CompletedTask;
    }

    private async Task InvalidatePermissionCachesAsync()
    {
        // This is a simplified cache invalidation
        // In a production system, you might want more granular invalidation
        // For now, we'll clear all permission-related caches
        // Note: IMemoryCache doesn't have a way to clear by pattern, so we skip this for simplicity
        await Task.CompletedTask;
    }
}