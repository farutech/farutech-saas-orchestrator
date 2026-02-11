using Farutech.Orchestrator.Application.DTOs.Auth;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Servicio SEGURO de autenticación y autorización con soporte multi-empresa.
/// Implementa el patrón "Intermediate Token" para flujo de autenticación robusto.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Autentica usuario con credenciales y retorna token intermedio (multi-tenant) o token de acceso (single-tenant).
    /// </summary>
    Task<SecureLoginResponse?> LoginAsync(string email, string password, bool rememberMe = false);

    /// <summary>
    /// Autentica usuario con acceso directo a instancia específica (desde URL con subdominios).
    /// </summary>
    Task<SecureLoginResponse?> LoginAsync(string email, string password, bool rememberMe, string? instanceCode, string? organizationCode);

    /// <summary>
    /// Intercambia un token intermedio por un token de acceso con el tenant seleccionado.
    /// </summary>
    Task<SelectContextResponse?> SelectContextAsync(string intermediateToken, Guid tenantId);

    /// <summary>
    /// Obtiene los tenants disponibles para el usuario actual (basado en JWT token).
    /// </summary>
    Task<List<TenantOptionDto>?> GetAvailableTenantsAsync(Guid userId);

    /// <summary>
    /// Registra nuevo usuario (con opción de crear organización por defecto).
    /// </summary>
    Task<RegisterResponse?> RegisterAsync(RegisterRequest request);

    /// <summary>
    /// Asigna usuario a empresa con rol específico (requiere permisos de admin).
    /// </summary>
    Task<bool> AssignUserToCompanyAsync(Guid userId, Guid customerId, string role, Guid grantedBy);

    /// <summary>
    /// Valida si el usuario tiene acceso a la empresa especificada.
    /// </summary>
    Task<bool> ValidateUserCompanyAccessAsync(Guid userId, Guid customerId);

    /// <summary>
    /// Inicia el proceso de recuperación de contraseña generando un token de reset.
    /// En desarrollo, retorna la URL mock de email para facilitar testing.
    /// </summary>
    Task<ForgotPasswordResponse> ForgotPasswordAsync(string email);

    /// <summary>
    /// Resetea la contraseña del usuario usando el token de recuperación.
    /// Valida que el token sea válido, no haya expirado y coincida con el email.
    /// </summary>
    Task<ResetPasswordResponse> ResetPasswordAsync(string email, string token, string newPassword);

    /// <summary>
    /// Valida si un token de reset de contraseña es válido y no ha expirado.
    /// </summary>
    Task<bool> ValidatePasswordResetTokenAsync(string email, string token);

    /// <summary>
    /// Confirma el email del usuario usando el token de confirmación.
    /// </summary>
    Task<ConfirmEmailResponse> ConfirmEmailAsync(string userId, string code);

    /// <summary>
    /// Obtiene el perfil del usuario actual basado en el userId de los claims del token.
    /// </summary>
    Task<UserProfileDto?> GetUserProfileAsync(Guid userId);

    /// <summary>
    /// Actualiza el perfil del usuario (actualización parcial). Solo los campos no nulos se actualizan.
    /// </summary>
    Task<UpdateProfileResponse> UpdateUserProfileAsync(Guid userId, UpdateProfileRequest request);

    /// <summary>
    /// Obtiene el contexto completo del usuario (organizaciones + instancias basado en permisos).
    /// - Si es Owner: retorna todas las instancias de la organización
    /// - Si no es Owner: retorna solo las instancias asignadas
    /// </summary>
    Task<UserContextResponse> GetUserContextAsync(Guid userId);

    // ===== LEGACY METHODS (Mantener por compatibilidad) =====

    /// <summary>
    /// [LEGACY] Autentica usuario y devuelve lista de empresas disponibles.
    /// DEPRECADO: Usar LoginAsync en su lugar.
    /// </summary>
    [Obsolete("Use LoginAsync para flujo seguro con tokens intermedios")]
    Task<LoginResponse?> AuthenticateAsync(string email, string password);

    /// <summary>
    /// Obtiene información del usuario actual para el frontend (sin exponer JWT).
    /// </summary>
    Task<CurrentUserInfoDto?> GetCurrentUserInfoAsync(Guid userId);

    /// <summary>
    /// [LEGACY] Genera token JWT para empresa seleccionada.
    /// DEPRECADO: Usar SelectContextAsync en su lugar.
    /// </summary>
    [Obsolete("Use SelectContextAsync en su lugar")]
    Task<TokenResponse?> GenerateTokenAsync(Guid userId, Guid customerId);
}
