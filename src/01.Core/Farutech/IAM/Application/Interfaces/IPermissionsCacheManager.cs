using Farutech.IAM.Domain.Entities;

namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Manager for caching user permissions
/// </summary>
public interface IPermissionsCacheManager
{
    /// <summary>
    /// Get cached permissions for a user in a specific tenant
    /// </summary>
    Task<List<string>?> GetUserPermissionsAsync(Guid userId, Guid tenantId);

    /// <summary>
    /// Cache permissions for a user in a specific tenant
    /// </summary>
    Task SetUserPermissionsAsync(Guid userId, Guid tenantId, List<string> permissions);

    /// <summary>
    /// Invalidate cached permissions for a user in a specific tenant
    /// </summary>
    Task InvalidateUserPermissionsAsync(Guid userId, Guid tenantId);

    /// <summary>
    /// Invalidate all cached permissions for a user (all tenants)
    /// </summary>
    Task InvalidateAllUserPermissionsAsync(Guid userId);

    /// <summary>
    /// Invalidate all cached permissions for a tenant (all users)
    /// </summary>
    Task InvalidateAllTenantPermissionsAsync(Guid tenantId);

    /// <summary>
    /// Get or load user permissions (from cache or database)
    /// </summary>
    Task<List<string>> GetOrLoadUserPermissionsAsync(Guid userId, Guid tenantId);
}
