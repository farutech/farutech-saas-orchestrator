namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Service for caching data in Redis
/// </summary>
public interface IRedisCacheService
{
    /// <summary>
    /// Get a value from cache
    /// </summary>
    Task<T?> GetAsync<T>(string key) where T : class;

    /// <summary>
    /// Set a value in cache with expiration
    /// </summary>
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class;

    /// <summary>
    /// Remove a value from cache
    /// </summary>
    Task RemoveAsync(string key);

    /// <summary>
    /// Check if a key exists in cache
    /// </summary>
    Task<bool> ExistsAsync(string key);

    /// <summary>
    /// Remove all keys matching a pattern
    /// </summary>
    Task RemoveByPatternAsync(string pattern);

    /// <summary>
    /// Get or set a value in cache (get if exists, set if not)
    /// </summary>
    Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null) where T : class;
}
