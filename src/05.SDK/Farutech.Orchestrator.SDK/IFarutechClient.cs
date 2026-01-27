using System;
using System.Threading;
using System.Threading.Tasks;
using Farutech.Orchestrator.SDK.Models;

namespace Farutech.Orchestrator.SDK;

/// <summary>
/// Cliente público para interactuar con el Farutech Orchestrator
/// </summary>
public interface IFarutechClient
{
    /// <summary>
    /// Realizar login y obtener token de acceso
    /// </summary>
    /// <param name="email">Email del usuario</param>
    /// <param name="password">Contraseña</param>
    /// <param name="cancellationToken">Token de cancelación</param>
    /// <returns>Respuesta de login con token o contextos disponibles</returns>
    Task<LoginResponse> LoginAsync(string email, string password, CancellationToken cancellationToken = default);

    /// <summary>
    /// Seleccionar contexto de tenant (para usuarios multi-tenant)
    /// </summary>
    /// <param name="tenantId">ID del tenant a seleccionar</param>
    /// <param name="intermediateToken">Token intermedio recibido en el login</param>
    /// <param name="cancellationToken">Token de cancelación</param>
    /// <returns>Respuesta con token de acceso para el tenant seleccionado</returns>
    Task<SelectContextResponse> SelectContextAsync(Guid tenantId, string intermediateToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtener configuración del tenant actual (con caché inteligente de 10 minutos)
    /// </summary>
    /// <param name="accessToken">Token de acceso JWT</param>
    /// <param name="forceRefresh">Forzar actualización de caché</param>
    /// <param name="cancellationToken">Token de cancelación</param>
    /// <returns>Configuración completa del tenant</returns>
    Task<TenantConfigurationDto> GetMyConfigurationAsync(string accessToken, bool forceRefresh = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validar si una feature específica está habilitada para el tenant actual
    /// </summary>
    /// <param name="featureCode">Código de la feature</param>
    /// <param name="accessToken">Token de acceso JWT</param>
    /// <param name="cancellationToken">Token de cancelación</param>
    /// <returns>Información de la feature</returns>
    Task<FeatureDto> GetFeatureAsync(string featureCode, string accessToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validar si una feature está habilitada (método simplificado)
    /// </summary>
    /// <param name="featureCode">Código de la feature</param>
    /// <param name="accessToken">Token de acceso JWT</param>
    /// <param name="cancellationToken">Token de cancelación</param>
    /// <returns>True si la feature está habilitada</returns>
    Task<bool> IsFeatureEnabledAsync(string featureCode, string accessToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Limpiar caché de configuraciones
    /// </summary>
    void ClearCache();
}
