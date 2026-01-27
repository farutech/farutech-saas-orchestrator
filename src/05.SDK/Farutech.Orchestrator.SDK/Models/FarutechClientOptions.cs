namespace Farutech.Orchestrator.SDK.Models;

/// <summary>
/// Opciones de configuración para el cliente de Farutech Orchestrator
/// </summary>
public class FarutechClientOptions
{
    /// <summary>
    /// URL base de la API del Orchestrator
    /// </summary>
    public string BaseUrl { get; set; } = null!;

    /// <summary>
    /// Tiempo de expiración de caché para configuraciones (en minutos)
    /// Default: 10 minutos
    /// </summary>
    public int CacheExpirationMinutes { get; set; } = 10;

    /// <summary>
    /// Timeout para peticiones HTTP (en segundos)
    /// Default: 30 segundos
    /// </summary>
    public int TimeoutSeconds { get; set; } = 30;

    /// <summary>
    /// Número de reintentos para peticiones fallidas
    /// Default: 3
    /// </summary>
    public int RetryCount { get; set; } = 3;

    /// <summary>
    /// Tiempo de espera entre reintentos (en milisegundos)
    /// Default: 1000ms (exponencial)
    /// </summary>
    public int RetryDelayMilliseconds { get; set; } = 1000;
}
