using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Infrastructure.Persistence;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Simplified permission service using only ASP.NET Identity roles
/// </summary>
public class PermissionService(OrchestratorDbContext context,
                               IMemoryCache cache,
                               UserManager<ApplicationUser> userManager,
                               RoleManager<ApplicationRole> roleManager) : IPermissionService
{
    private readonly OrchestratorDbContext _context = context;
    private readonly IMemoryCache _cache = cache;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly RoleManager<ApplicationRole> _roleManager = roleManager;
    private const int CacheExpirationMinutes = 15;

    public async Task<bool> HasPermissionAsync(
        Guid userId,
        string permissionCode,
        Guid? tenantId = null,
        Guid? scopeId = null)
    {
        // Simplified: check if user has a role with the permission code
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

        var roles = await _userManager.GetRolesAsync(user);
        var hasPermission = roles.Contains(permissionCode);

        _cache.Set(cacheKey, hasPermission, TimeSpan.FromMinutes(CacheExpirationMinutes));
        return hasPermission;
    }

    public async Task<IEnumerable<Permission>> GetUserPermissionsAsync(
        Guid userId,
        Guid? tenantId = null)
    {
        // Since custom permissions are removed, return empty
        return await Task.FromResult(new List<Permission>());
    }

    public async Task<IEnumerable<ApplicationRole>> GetUserRolesAsync(
        Guid userId,
        Guid? tenantId = null)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return new List<ApplicationRole>();

        var roleNames = await _userManager.GetRolesAsync(user);
        var roles = new List<ApplicationRole>();

        foreach (var roleName in roleNames)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role != null)
            {
                roles.Add(role);
            }
        }

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

        var result = await _userManager.AddToRoleAsync(user, role.Name!);
        if (result.Succeeded)
        {
            // Invalidate caches
            await InvalidateUserCachesAsync(userId);
        }

        return result.Succeeded;
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

        var result = await _userManager.RemoveFromRoleAsync(user, role.Name!);
        if (result.Succeeded)
        {
            // Invalidate caches
            await InvalidateUserCachesAsync(userId);
        }

        return result.Succeeded;
    }

    public async Task<IEnumerable<Permission>> GetRolePermissionsAsync(Guid roleId)
    {
        // Custom permissions removed, return empty
        return await Task.FromResult(new List<Permission>());
    }

    public async Task<bool> AssignPermissionToRoleAsync(
        Guid roleId,
        Guid permissionId,
        string? grantedBy = null)
    {
        // Not implemented since custom permissions removed
        return await Task.FromResult(false);
    }

    public async Task<bool> RemovePermissionFromRoleAsync(Guid roleId, Guid permissionId)
    {
        // Not implemented since custom permissions removed
        return await Task.FromResult(false);
    }

    public async Task<bool> HasRoleAsync(
        Guid userId,
        string roleCode,
        Guid? tenantId = null)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;

        return await _userManager.IsInRoleAsync(user, roleCode);
    }

    public async Task<IEnumerable<Permission>> GetAllPermissionsAsync()
    {
        // Custom permissions removed, return empty
        return await Task.FromResult(new List<Permission>());
    }

    public async Task<IEnumerable<ApplicationRole>> GetAllRolesAsync()
    {
        const string cacheKey = "all_roles";

        if (_cache.TryGetValue<IEnumerable<ApplicationRole>>(cacheKey, out var cachedRoles) && cachedRoles != null)
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
        // Simplified cache invalidation
        await Task.CompletedTask;
    }
}