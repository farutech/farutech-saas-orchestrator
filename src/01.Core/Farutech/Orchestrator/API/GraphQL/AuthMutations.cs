using Farutech.Orchestrator.Application.DTOs.Auth;
using Farutech.Orchestrator.Application.Interfaces;
using HotChocolate.Authorization;

namespace Farutech.Orchestrator.API.GraphQL;

/// <summary>
/// Mutations de GraphQL para autenticación SEGURA.
/// Implementa el patrón "Intermediate Token" para flujo de autenticación robusto.
/// </summary>
public class AuthMutations
{
    /// <summary>
    /// Login inicial SEGURO: valida credenciales y retorna token intermedio (multi-tenant) o token de acceso (single-tenant).
    /// </summary>
    public async Task<SecureLoginResponse?> Login(
        [Service] IAuthService authService,
        string email,
        string password)
        => await authService.LoginAsync(email, password);

    /// <summary>
    /// Seleccionar contexto empresarial: intercambia token intermedio por token de acceso completo.
    /// </summary>
    public async Task<SelectContextResponse?> SelectContext(
        [Service] IAuthService authService,
        string intermediateToken,
        Guid tenantId)
        => await authService.SelectContextAsync(intermediateToken, tenantId);

    /// <summary>
    /// Registrar nuevo usuario (con opción de crear organización por defecto).
    /// </summary>
    public async Task<RegisterResponse?> Register(
        [Service] IAuthService authService,
        string email,
        string password,
        string firstName,
        string lastName,
        bool createDefaultOrganization = false)
    {
        var request = new RegisterRequest(email, password, firstName, lastName, createDefaultOrganization);
        return await authService.RegisterAsync(request);
    }

    /// <summary>
    /// Asignar usuario a empresa (requiere autenticación y rol CompanyAdmin o Owner).
    /// </summary>
    [Authorize(Roles = new[] { "CompanyAdmin", "Owner" })]
    public async Task<bool> AssignUserToCompany(
        [Service] IAuthService authService,
        Guid userId,
        Guid customerId,
        string role,
        Guid grantedBy)
        => await authService.AssignUserToCompanyAsync(userId, customerId, role, grantedBy);

    // ===== LEGACY MUTATIONS (Mantener por compatibilidad, marcar como obsoleto) =====

    /// <summary>
    /// [LEGACY] Login inicial: valida credenciales y devuelve lista de empresas disponibles.
    /// DEPRECADO: Usar Login con SecureLoginResponse en su lugar.
    /// </summary>
    [Obsolete("Use Login con SecureLoginResponse")]
    [GraphQLDeprecated("Use Login con SecureLoginResponse para flujo seguro con tokens intermedios")]
    public async Task<LoginResponse?> LoginLegacy(
        [Service] IAuthService authService,
        string email,
        string password) =>
#pragma warning disable CS0618 // Type or member is obsolete
        await authService.AuthenticateAsync(email, password);
#pragma warning restore CS0618 // Type or member is obsolete


    /// <summary>
    /// [LEGACY] Seleccionar empresa: genera token JWT para empresa específica.
    /// DEPRECADO: Usar SelectContext con intermediateToken en su lugar.
    /// </summary>
    [Obsolete("Use SelectContext con intermediateToken")]
    [GraphQLDeprecated("Use SelectContext con intermediateToken para flujo seguro")]
    public async Task<TokenResponse?> SelectContextLegacy(
        [Service] IAuthService authService,
        Guid userId,
        Guid customerId) =>
#pragma warning disable CS0618 // Type or member is obsolete
        await authService.GenerateTokenAsync(userId, customerId);
#pragma warning restore CS0618 // Type or member is obsolete

}
