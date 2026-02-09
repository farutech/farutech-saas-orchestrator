using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using System.Text.Json;

namespace Farutech.IAM.Infrastructure.Caching;

/// <summary>
/// Redis cache service implementation
/// </summary>
public class RedisCacheService : IRedisCacheService
{
    private readonly RedisOptions _options;
    private readonly ILogger<RedisCacheService> _logger;
    private readonly IConnectionMultiplexer? _redis;
    private readonly IDatabase? _database;

    public RedisCacheService(
        IOptions<RedisOptions> options,
        ILogger<RedisCacheService> logger)
    {
        _options = options.Value;
        _logger = logger;

        if (_options.Enabled)
        {
            try
            {
                var configOptions = ConfigurationOptions.Parse(_options.ConnectionString);
                configOptions.ConnectTimeout = _options.ConnectTimeout;
                configOptions.SyncTimeout = _options.SyncTimeout;
                configOptions.AbortOnConnectFail = false;

                _redis = ConnectionMultiplexer.Connect(configOptions);
                _database = _redis.GetDatabase();

                _logger.LogInformation("Redis connection established: {ConnectionString}", _options.ConnectionString);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to connect to Redis. Caching will be disabled.");
            }
        }
        else
        {
            _logger.LogWarning("Redis caching is disabled");
        }
    }

    public async Task<T?> GetAsync<T>(string key) where T : class
    {
        if (_database == null) return null;

        try
        {
            var fullKey = GetFullKey(key);
            var value = await _database.StringGetAsync(fullKey);

            if (value.IsNullOrEmpty)
            {
                _logger.LogDebug("Cache miss for key: {Key}", key);
                return null;
            }

            _logger.LogDebug("Cache hit for key: {Key}", key);
            return JsonSerializer.Deserialize<T>((string)value!);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting value from Redis for key: {Key}", key);
            return null;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class
    {
        if (_database == null) return;

        try
        {
            var fullKey = GetFullKey(key);
            var serialized = JsonSerializer.Serialize(value);
            var exp = expiration ?? TimeSpan.FromMinutes(_options.DefaultExpirationMinutes);

            await _database.StringSetAsync(fullKey, serialized, exp);
            _logger.LogDebug("Cached value for key: {Key} with expiration: {Expiration}", key, exp);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting value in Redis for key: {Key}", key);
        }
    }

    public async Task RemoveAsync(string key)
    {
        if (_database == null) return;

        try
        {
            var fullKey = GetFullKey(key);
            await _database.KeyDeleteAsync(fullKey);
            _logger.LogDebug("Removed cache key: {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing value from Redis for key: {Key}", key);
        }
    }

    public async Task<bool> ExistsAsync(string key)
    {
        if (_database == null) return false;

        try
        {
            var fullKey = GetFullKey(key);
            return await _database.KeyExistsAsync(fullKey);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if key exists in Redis: {Key}", key);
            return false;
        }
    }

    public async Task RemoveByPatternAsync(string pattern)
    {
        if (_redis == null || _database == null) return;

        try
        {
            var fullPattern = GetFullKey(pattern);
            var endpoints = _redis.GetEndPoints();

            foreach (var endpoint in endpoints)
            {
                var server = _redis.GetServer(endpoint);
                var keys = server.Keys(pattern: fullPattern).ToArray();

                if (keys.Length > 0)
                {
                    await _database.KeyDeleteAsync(keys);
                    _logger.LogDebug("Removed {Count} keys matching pattern: {Pattern}", keys.Length, pattern);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing keys by pattern: {Pattern}", pattern);
        }
    }

    public async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null) where T : class
    {
        // Try to get from cache first
        var cached = await GetAsync<T>(key);
        if (cached != null)
        {
            return cached;
        }

        // Not in cache, call factory to get value
        var value = await factory();

        // Cache the value
        await SetAsync(key, value, expiration);

        return value;
    }

    private string GetFullKey(string key)
    {
        return $"{_options.InstanceName}{key}";
    }
}
