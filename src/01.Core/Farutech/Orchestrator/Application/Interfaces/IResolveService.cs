using Farutech.Orchestrator.Application.DTOs.Resolve;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Servicio para resolución de subdominios
/// </summary>
public interface IResolveService
{
    /// <summary>
    /// Resuelve una instancia por códigos de instancia y organización
    /// </summary>
    Task<ResolveResponseDto?> ResolveInstanceAsync(string instanceCode, string organizationCode);
}