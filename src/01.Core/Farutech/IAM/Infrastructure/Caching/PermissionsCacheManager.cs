using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Farutech.IAM.Infrastructure.Caching;

/// <summary>
/// Manager for caching user permissions in Redis
/// </summary>
public class PermissionsCacheManager : IPermissionsCacheManager
{
    private readonly IRedisCacheService _cache;
    private readonly IIamRepository _repository;
    private readonly RedisOptions _options;
    private readonly ILogger<PermissionsCacheManager> _logger;

    public PermissionsCacheManager(
        IRedisCacheService cache,
        IIamRepository repository,
        IOptions<RedisOptions> options,
        ILogger<PermissionsCacheManager> logger)
    {
        _cache = cache;
        _repository = repository;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<List<string>?> GetUserPermissionsAsync(Guid userId, Guid tenantId)
    {
        var key = GetPermissionsKey(userId, tenantId);
        return await _cache.GetAsync<List<string>>(key);
    }

    public async Task SetUserPermissionsAsync(Guid userId, Guid tenantId, List<string> permissions)
    {
        var key = GetPermissionsKey(userId, tenantId);
        var expiration = TimeSpan.FromMinutes(_options.PermissionsExpirationMinutes);
        await _cache.SetAsync(key, permissions, expiration);
        _logger.LogDebug("Cached {Count} permissions for user {UserId} in tenant {TenantId}", 
            permissions.Count, userId, tenantId);
    }

    public async Task InvalidateUserPermissionsAsync(Guid userId, Guid tenantId)
    {
        var key = GetPermissionsKey(userId, tenantId);
        await _cache.RemoveAsync(key);
        _logger.LogInformation("Invalidated permissions cache for user {UserId} in tenant {TenantId}", 
            userId, tenantId);
    }

    public async Task InvalidateAllUserPermissionsAsync(Guid userId)
    {
        var pattern = $"permissions:user:{userId}:*";
        await _cache.RemoveByPatternAsync(pattern);
        _logger.LogInformation("Invalidated all permissions cache for user {UserId}", userId);
    }

    public async Task InvalidateAllTenantPermissionsAsync(Guid tenantId)
    {
        var pattern = $"permissions:user:*:tenant:{tenantId}";
        await _cache.RemoveByPatternAsync(pattern);
        _logger.LogInformation("Invalidated all permissions cache for tenant {TenantId}", tenantId);
    }

    public async Task<List<string>> GetOrLoadUserPermissionsAsync(Guid userId, Guid tenantId)
    {
        var key = GetPermissionsKey(userId, tenantId);
        var expiration = TimeSpan.FromMinutes(_options.PermissionsExpirationMinutes);

        return await _cache.GetOrSetAsync(key, async () =>
        {
            _logger.LogDebug("Loading permissions from database for user {UserId} in tenant {TenantId}", 
                userId, tenantId);

            var membership = await _repository.GetMembershipAsync(userId, tenantId);

            if (membership?.Role?.RolePermissions == null)
            {
                _logger.LogWarning("No permissions found for user {UserId} in tenant {TenantId}", 
                    userId, tenantId);
                return new List<string>();
            }

            var permissions = membership.Role.RolePermissions
                .Where(rp => rp.Permission != null)
                .Select(rp => rp.Permission!.Code)
                .ToList();

            _logger.LogInformation("Loaded {Count} permissions for user {UserId} in tenant {TenantId}", 
                permissions.Count, userId, tenantId);

            return permissions;
        }, expiration);
    }

    private static string GetPermissionsKey(Guid userId, Guid tenantId)
    {
        return $"permissions:user:{userId}:tenant:{tenantId}";
    }
}
