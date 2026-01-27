using System;
using System.Threading;
using System.Threading.Tasks;
using Farutech.Orchestrator.SDK.Http;
using Farutech.Orchestrator.SDK.Models;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Farutech.Orchestrator.SDK;

/// <summary>
/// Implementación del cliente de Farutech Orchestrator con caché inteligente
/// </summary>
public class FarutechClient : IFarutechClient
{
    private readonly IFarutechApi _api;
    private readonly IMemoryCache _cache;
    private readonly ILogger<FarutechClient> _logger;
    private readonly FarutechClientOptions _options;

    private const string ConfigCacheKeyPrefix = "tenant_config_";

    public FarutechClient(
        IFarutechApi api,
        IMemoryCache cache,
        ILogger<FarutechClient> logger,
        IOptions<FarutechClientOptions> options)
    {
        _api = api ?? throw new ArgumentNullException(nameof(api));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
    }

    /// <inheritdoc />
    public async Task<LoginResponse> LoginAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email es requerido", nameof(email));

        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password es requerido", nameof(password));

        _logger.LogInformation("Iniciando login para usuario: {Email}", email);

        var request = new LoginRequest
        {
            Email = email,
            Password = password
        };

        try
        {
            var response = await _api.LoginAsync(request, cancellationToken);

            if (response.RequiresContextSelection)
            {
                _logger.LogInformation("Usuario {Email} requiere selección de contexto. Tenants disponibles: {Count}",
                    email, response.AvailableTenants?.Count ?? 0);
            }
            else
            {
                _logger.LogInformation("Login exitoso para usuario {Email}. Tenant: {TenantId}",
                    email, response.SelectedTenantId);
            }

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al realizar login para usuario: {Email}", email);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<SelectContextResponse> SelectContextAsync(
        Guid tenantId,
        string intermediateToken,
        CancellationToken cancellationToken = default)
    {
        if (tenantId == Guid.Empty)
            throw new ArgumentException("TenantId no puede ser vacío", nameof(tenantId));

        if (string.IsNullOrWhiteSpace(intermediateToken))
            throw new ArgumentException("IntermediateToken es requerido", nameof(intermediateToken));

        _logger.LogInformation("Seleccionando contexto de tenant: {TenantId}", tenantId);

        var request = new SelectContextRequest
        {
            TenantId = tenantId
        };

        try
        {
            var bearerToken = intermediateToken.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                ? intermediateToken
                : $"Bearer {intermediateToken}";

            var response = await _api.SelectContextAsync(request, bearerToken, cancellationToken);

            _logger.LogInformation("Contexto seleccionado exitosamente. Tenant: {TenantId}, Empresa: {CompanyName}",
                response.SelectedTenantId, response.CompanyName);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al seleccionar contexto de tenant: {TenantId}", tenantId);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<TenantConfigurationDto> GetMyConfigurationAsync(
        string accessToken,
        bool forceRefresh = false,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
            throw new ArgumentException("AccessToken es requerido", nameof(accessToken));

        // Extraer TenantId del token para crear la clave de caché
        var cacheKey = $"{ConfigCacheKeyPrefix}{accessToken.GetHashCode()}";

        // Si no se fuerza refresh, intentar obtener de caché
        if (!forceRefresh && _cache.TryGetValue(cacheKey, out TenantConfigurationDto? cachedConfig))
        {
            _logger.LogDebug("Configuración obtenida de caché para token: {TokenHash}", accessToken.GetHashCode());
            return cachedConfig!;
        }

        _logger.LogInformation("Obteniendo configuración de tenant desde API (forceRefresh: {ForceRefresh})", forceRefresh);

        try
        {
            var bearerToken = accessToken.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                ? accessToken
                : $"Bearer {accessToken}";

            var config = await _api.GetMyConfigurationAsync(bearerToken, cancellationToken);

            // Cachear por el tiempo configurado (default: 10 minutos)
            var cacheOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_options.CacheExpirationMinutes)
            };

            _cache.Set(cacheKey, config, cacheOptions);

            _logger.LogInformation(
                "Configuración obtenida y cacheada. Tenant: {TenantId}, Empresa: {CompanyName}, Features: {FeaturesCount}",
                config.TenantId, config.CompanyName, config.Features.Count);

            return config;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener configuración de tenant");
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<FeatureDto> GetFeatureAsync(
        string featureCode,
        string accessToken,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(featureCode))
            throw new ArgumentException("FeatureCode es requerido", nameof(featureCode));

        if (string.IsNullOrWhiteSpace(accessToken))
            throw new ArgumentException("AccessToken es requerido", nameof(accessToken));

        _logger.LogInformation("Obteniendo información de feature: {FeatureCode}", featureCode);

        try
        {
            var bearerToken = accessToken.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                ? accessToken
                : $"Bearer {accessToken}";

            var feature = await _api.GetFeatureAsync(featureCode, bearerToken, cancellationToken);

            _logger.LogInformation("Feature obtenida: {FeatureCode}, Habilitada: {IsEnabled}",
                feature.Code, feature.IsEnabled);

            return feature;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener feature: {FeatureCode}", featureCode);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<bool> IsFeatureEnabledAsync(
        string featureCode,
        string accessToken,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var feature = await GetFeatureAsync(featureCode, accessToken, cancellationToken);
            return feature.IsEnabled;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error al validar feature {FeatureCode}, se asume deshabilitada", featureCode);
            return false;
        }
    }

    /// <inheritdoc />
    public void ClearCache()
    {
        _logger.LogInformation("Limpiando caché de configuraciones");
        
        // En .NET Standard 2.1, MemoryCache no tiene un método Clear()
        // Se debe recrear el cache o usar una implementación custom
        // Por ahora, registramos el intento
        _logger.LogWarning("ClearCache no implementado completamente en .NET Standard 2.1");
    }
}
