namespace Farutech.Orchestrator.Application.DTOs.Auth;

/// <summary>
/// Request para login inicial (credenciales).
/// </summary>
public record LoginRequest(
    string Email,
    string Password,
    bool RememberMe = false
);

/// <summary>
/// Response SEGURO de login con soporte para flujo multi-tenant.
/// Implementa el patrón "Intermediate Token" para selección de contexto.
/// </summary>
public record SecureLoginResponse(
    bool RequiresContextSelection,
    string? IntermediateToken,
    string? AccessToken,
    string? TokenType,
    int? ExpiresIn,
    List<TenantOptionDto>? AvailableTenants,
    Guid? SelectedTenantId,
    string? CompanyName,
    string? Role
);

/// <summary>
/// DTO de tenant/empresa disponible para el usuario.
/// </summary>
public record TenantOptionDto(
    Guid TenantId,
    string CompanyName,
    string CompanyCode,
    string TaxId,
    string Role,
    bool IsOwner,
    bool IsActive,
    List<InstanceDto> Instances // Lista de instancias de la empresa
);

public record InstanceDto(
    Guid InstanceId,
    string Name,
    string Type, // "Veterinaria", "ERP", etc.
    string Code,
    string Status,
    string Url // URL de acceso
);

/// <summary>
/// Request para seleccionar contexto de empresa con token intermedio.
/// </summary>
public record SelectContextRequest(
    string IntermediateToken,
    Guid TenantId
);

/// <summary>
/// Response de selección de contexto con token de acceso completo.
/// </summary>
public record SelectContextResponse(
    string AccessToken,
    string TokenType,
    int ExpiresIn,
    Guid TenantId,
    string CompanyName,
    string Role
);

/// <summary>
/// Request para registro de nuevo usuario.
/// </summary>
public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    bool CreateDefaultOrganization = false
);

/// <summary>
/// Response de registro exitoso.
/// </summary>
public record RegisterResponse(
    Guid UserId,
    string Email,
    string FullName,
    Guid? OrganizationId,
    string? OrganizationName
);

/// <summary>
/// Request para inicio de recuperación de contraseña (solicitud de token).
/// </summary>
public record ForgotPasswordRequest(
    string Email
);

/// <summary>
/// Response de solicitud de recuperación de contraseña (desarrollo: retorna URL mock de email).
/// </summary>
public record ForgotPasswordResponse(
    string Message,
    string? MockResetUrl = null
);

/// <summary>
/// Request para resetear contraseña con token de recuperación.
/// </summary>
public record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword,
    string ConfirmPassword
);

/// <summary>
/// Response de reset de contraseña exitoso.
/// </summary>
public record ResetPasswordResponse(
    string Message
);

/// <summary>
/// Response de validación de token de reset de contraseña.
/// </summary>
public record ValidateTokenResponse(
    bool IsValid
);

/// <summary>
/// Response de confirmación de email.
/// </summary>
public record ConfirmEmailResponse(
    bool Success,
    string Message
);

/// <summary>
/// Request para actualización de perfil de usuario (actualización parcial).
/// </summary>
public record UpdateProfileRequest(
    string? FirstName,
    string? LastName,
    string? Phone,
    string? CurrentPassword,
    string? NewPassword
);

/// <summary>
/// Response de actualización de perfil exitosa.
/// </summary>
public record UpdateProfileResponse(
    bool Success,
    string Message,
    UserProfileDto? Profile
);

/// <summary>
/// DTO de perfil de usuario.
/// </summary>
public record UserProfileDto(
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    string FullName,
    string? Phone
);

/// <summary>
/// Response para obtener el contexto completo del usuario (organizaciones + instancias con permisos).
/// </summary>
public record UserContextResponse(
    Guid UserId,
    string Email,
    string FullName,
    List<OrganizationContextDto> Organizations
);

/// <summary>
/// DTO de organización con instancias basado en permisos del usuario.
/// </summary>
public record OrganizationContextDto(
    Guid OrganizationId,
    string OrganizationName,
    string OrganizationCode,
    string TaxId,
    bool IsOwner,
    bool IsActive,
    string Role, // Owner, InstanceAdmin, User, Guest
    List<InstanceContextDto> Instances
);

/// <summary>
/// DTO de instancia con información relevante para el launcher.
/// </summary>
public record InstanceContextDto(
    Guid InstanceId,
    string Code,
    string Name,
    string ApplicationType, // ERP, CRM, POS, VETERINARIA, etc.
    string Status, // Active, Suspended, Inactive
    string Url,
    bool HasDirectAssignment // Indica si el usuario tiene asignación directa a esta instancia
);

// ===== LEGACY DTOs (Mantener por compatibilidad temporal) =====

/// <summary>
/// [LEGACY] Response de login inicial con lista de empresas disponibles.
/// DEPRECADO: Usar SecureLoginResponse en su lugar.
/// </summary>
[Obsolete("Use SecureLoginResponse para flujo seguro con tokens intermedios")]
public record LoginResponse(
    Guid UserId,
    string Email,
    string FullName,
    List<CompanyMembershipDto> Companies
);

/// <summary>
/// [LEGACY] DTO de membresía de empresa.
/// DEPRECADO: Usar TenantOptionDto en su lugar.
/// </summary>
[Obsolete("Use TenantOptionDto en su lugar")]
public record CompanyMembershipDto(
    Guid CustomerId,
    string CompanyName,
    string Role
);

/// <summary>
/// [LEGACY] Response con token JWT firmado para empresa específica.
/// DEPRECADO: Usar SelectContextResponse en su lugar.
/// </summary>
[Obsolete("Use SelectContextResponse en su lugar")]
public record TokenResponse(
    string Token,
    string TokenType,
    int ExpiresIn,
    Guid CustomerId,
    string CompanyName,
    string Role
);
