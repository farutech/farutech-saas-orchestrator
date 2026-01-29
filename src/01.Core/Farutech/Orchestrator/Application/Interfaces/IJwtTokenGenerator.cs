using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Generador de tokens JWT.
/// </summary>
public interface IJwtTokenGenerator
{
    /// <summary>
    /// Genera token JWT con claims específicos de usuario y empresa.
    /// </summary>
    string GenerateToken(ApplicationUser user, Guid customerId, string companyName, string role);
}
