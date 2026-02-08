using System.Threading.Tasks;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Generador de tokens JWT para comunicación service-to-service.
/// </summary>
public interface IServiceTokenGenerator
{
    /// <summary>
    /// Genera un token JWT para un servicio/worker específico.
    /// </summary>
    /// <param name="serviceId">Identificador único del servicio (ej: "worker-001")</param>
    /// <param name="serviceType">Tipo de servicio (ej: "provisioning-worker")</param>
    /// <param name="permissions">Permisos del servicio</param>
    /// <returns>Token JWT firmado</returns>
    Task<string> GenerateServiceTokenAsync(string serviceId, string serviceType, string[] permissions);
    
    /// <summary>
    /// Valida un token JWT de servicio.
    /// </summary>
    /// <param name="token">Token JWT a validar</param>
    /// <returns>True si el token es válido</returns>
    Task<bool> ValidateServiceTokenAsync(string token);
    
    /// <summary>
    /// Extrae el service ID de un token JWT válido.
    /// </summary>
    /// <param name="token">Token JWT</param>
    /// <returns>Service ID si el token es válido</returns>
    Task<string?> GetServiceIdFromTokenAsync(string token);
}