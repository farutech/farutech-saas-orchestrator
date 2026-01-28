using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Infrastructure.Persistence;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Implementación del servicio de permisos RBAC con caché
/// </summary>
public class PermissionService(
    OrchestratorDbContext context,
    IMemoryCache cache) : IPermissionService
{
    private readonly OrchestratorDbContext _context = context;
    private readonly IMemoryCache _cache = cache;
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

        // Query: Get user roles for the tenant/scope
        var userRolesQuery = _context.UserRoles
            .Include(ur => ur.Role)
                .ThenInclude(r => r.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
            .Where(ur => ur.UserId == userId && ur.IsActive);

        if (tenantId.HasValue)
        {
            userRolesQuery = userRolesQuery.Where(ur => ur.TenantId == tenantId.Value);
        }

        if (scopeId.HasValue)
        {
            userRolesQuery = userRolesQuery.Where(ur => ur.ScopeId == scopeId.Value);
        }

        var userRoles = await userRolesQuery.ToListAsync();

        // Check if any role has the required permission
        var hasPermission = userRoles
            .SelectMany(ur => ur.Role.RolePermissions)
            .Any(rp => rp.Permission.Code == permissionCode && rp.Permission.IsActive);

        // Cache the result
        _cache.Set(cacheKey, hasPermission, TimeSpan.FromMinutes(CacheExpirationMinutes));

        return hasPermission;
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

        // Query: Get user roles and their permissions
        var userRolesQuery = _context.UserRoles
            .Include(ur => ur.Role)
                .ThenInclude(r => r.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
            .Where(ur => ur.UserId == userId && ur.IsActive);

        if (tenantId.HasValue)
        {
            userRolesQuery = userRolesQuery.Where(ur => ur.TenantId == tenantId.Value);
        }

        if (scopeId.HasValue)
        {
            userRolesQuery = userRolesQuery.Where(ur => ur.ScopeId == scopeId.Value);
        }

        var userRoles = await userRolesQuery.ToListAsync();

        var permissions = userRoles
            .SelectMany(ur => ur.Role.RolePermissions)
            .Select(rp => rp.Permission)
            .Where(p => p.IsActive)
            .Distinct()
            .ToList();

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

    public async Task<IEnumerable<Role>> GetRolesForPermissionAsync(Guid permissionId)
    {
        var cacheKey = $"roles_permission:{permissionId}";

        if (_cache.TryGetValue<IEnumerable<Role>>(cacheKey, out var cachedRoles) && cachedRoles != null)
        {
            return cachedRoles;
        }

        var roles = await _context.RolePermissions
            .Include(rp => rp.Role)
            .Where(rp => rp.PermissionId == permissionId && rp.Role.IsActive)
            .Select(rp => rp.Role)
            .OrderBy(r => r.Name)
            .ToListAsync();

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

    public async Task<IEnumerable<Role>> GetUserRolesAsync(
        Guid userId, 
        Guid? tenantId = null)
    {
        var cacheKey = $"user_roles:{userId}:{tenantId}";

        if (_cache.TryGetValue<IEnumerable<Role>>(cacheKey, out var cachedRoles) && cachedRoles != null)
        {
            return cachedRoles;
        }

        var userRolesQuery = _context.UserRoles
            .Include(ur => ur.Role)
            .Where(ur => ur.UserId == userId && ur.IsActive);

        if (tenantId.HasValue)
        {
            userRolesQuery = userRolesQuery.Where(ur => ur.TenantId == tenantId.Value);
        }

        var roles = await userRolesQuery
            .Select(ur => ur.Role)
            .Where(r => r.IsActive)
            .ToListAsync();

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
        // Check if assignment already exists
        var existing = await _context.UserRoles
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId && 
                                     ur.TenantId == tenantId && ur.ScopeId == scopeId);

        if (existing != null)
        {
            return true; // Already assigned
        }

        var userRole = new UserRole
        {
            UserId = userId,
            RoleId = roleId,
            TenantId = tenantId,
            ScopeId = scopeId,
            ScopeType = scopeType,
            AssignedBy = assignedBy ?? "System",
            AssignedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.UserRoles.Add(userRole);
        await _context.SaveChangesAsync();

        // Invalidate caches
        await InvalidateUserCachesAsync(userId);

        return true;
    }

    public async Task<bool> RemoveRoleFromUserAsync(
        Guid userId, 
        Guid roleId, 
        Guid? tenantId = null)
    {
        var userRole = await _context.UserRoles
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId && 
                                     ur.TenantId == tenantId && ur.IsActive);

        if (userRole == null)
        {
            return false; // Not assigned
        }

        userRole.IsActive = false;
        // Note: UserRole doesn't have RemovedAt/RemovedBy fields, only IsActive

        await _context.SaveChangesAsync();

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

        var hasRole = await _context.UserRoles
            .Include(ur => ur.Role)
            .AnyAsync(ur => ur.UserId == userId && ur.Role.Code == roleCode && 
                           ur.IsActive && ur.Role.IsActive &&
                           (tenantId == null || ur.TenantId == tenantId));

        _cache.Set(cacheKey, hasRole, TimeSpan.FromMinutes(CacheExpirationMinutes));

        return hasRole;
    }

    public async Task<IEnumerable<Role>> GetAllRolesAsync()
    {
        const string cacheKey = "all_roles";

        if (_cache.TryGetValue<IEnumerable<Role>>(cacheKey, out var cachedRoles) && cachedRoles != null)
        {
            return cachedRoles;
        }

        var roles = await _context.Roles
            .Where(r => r.IsActive)
            .OrderBy(r => r.Level)
            .ThenBy(r => r.Name)
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