using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Servicio para generación de tokens JWT con soporte para flujo de autenticación multi-tenant seguro.
/// Implementa el patrón "Intermediate Token" para selección de contexto empresarial.
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Genera un token JWT intermedio de corta duración (5 minutos) para usuarios multi-tenant.
    /// Este token SOLO permite seleccionar el contexto empresarial, no da acceso a recursos.
    /// SEGURIDAD: Incluye los tenantIds permitidos en el token para validación posterior.
    /// </summary>
    /// <param name="user">Usuario autenticado</param>
    /// <param name="allowedTenantIds">Lista de tenantIds a los que el usuario tiene acceso</param>
    /// <returns>Token JWT con claims mínimos: sub (UserId), purpose:context_selection, y allowed_tenant claims</returns>
    string GenerateIntermediateToken(ApplicationUser user, List<Guid> allowedTenantIds);

    /// <summary>
    /// Genera un token JWT de acceso completo con contexto empresarial establecido.
    /// Este token da acceso completo a los recursos del tenant seleccionado.
    /// Si los parámetros tenantId, companyName y role son null, genera un token de onboarding
    /// que permite crear la primera empresa pero sin acceso a recursos multi-tenant.
    /// </summary>
    /// <param name="user">Usuario autenticado</param>
    /// <param name="tenantId">ID del tenant/empresa seleccionado (opcional para onboarding)</param>
    /// <param name="companyName">Nombre de la empresa (opcional para onboarding)</param>
    /// <param name="role">Rol del usuario en la empresa (opcional para onboarding)</param>
    /// <param name="rememberMe">Si true, genera token de larga duración (48h), si false duración corta (30min)</param>
    /// <returns>Token JWT con claims completos o token de onboarding sin tenant_id</returns>
    string GenerateAccessToken(ApplicationUser user, Guid? tenantId, string? companyName, string? role, bool rememberMe = false);

    /// <summary>
    /// Valida un token intermedio y extrae el UserId y los tenantIds permitidos.
    /// SEGURIDAD: Valida que el token incluya los tenantIds permitidos para prevenir manipulación.
    /// </summary>
    /// <param name="intermediateToken">Token intermedio a validar</param>
    /// <returns>Tupla (UserId, Lista de TenantIds permitidos) si el token es válido, null en caso contrario</returns>
    (Guid userId, List<Guid> allowedTenantIds)? ValidateIntermediateToken(string intermediateToken);
}
