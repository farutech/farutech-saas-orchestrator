using System;
using System.Threading;
using System.Threading.Tasks;
using Farutech.Orchestrator.SDK.Models;
using Refit;

namespace Farutech.Orchestrator.SDK.Http;

/// <summary>
/// Interfaz Refit para comunicación con la API del Orchestrator
/// </summary>
public interface IFarutechApi
{
    /// <summary>
    /// Login de usuario
    /// </summary>
    [Post("/api/auth/login")]
    Task<LoginResponse> LoginAsync([Body] LoginRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Seleccionar contexto de tenant
    /// </summary>
    [Post("/api/auth/select-context")]
    Task<SelectContextResponse> SelectContextAsync(
        [Body] SelectContextRequest request,
        [Header("Authorization")] string intermediateToken,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtener configuración del tenant actual
    /// </summary>
    [Get("/api/tenant/config")]
    Task<TenantConfigurationDto> GetMyConfigurationAsync(
        [Header("Authorization")] string bearerToken,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Validar si una feature está habilitada
    /// </summary>
    [Get("/api/tenant/features/{featureCode}")]
    Task<FeatureDto> GetFeatureAsync(
        string featureCode,
        [Header("Authorization")] string bearerToken,
        CancellationToken cancellationToken = default);
}
