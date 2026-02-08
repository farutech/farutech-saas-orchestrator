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
/// Si RequiresContextSelection es true, se debe usar SelectContextRequest para obtener el token final.
/// Campos:
/// - RequiresContextSelection: Indica si el usuario debe seleccionar un tenant
/// - IntermediateToken: Token temporal para selección de contexto (solo si RequiresContextSelection=true)
/// - AccessToken: Token de acceso JWT (solo si RequiresContextSelection=false)
/// - TokenType: Tipo de token (generalmente "Bearer")
/// - ExpiresIn: Segundos hasta expiración del token
/// - AvailableTenants: Lista de tenants disponibles para el usuario
/// - SelectedTenantId: ID del tenant seleccionado (si aplica)
/// - CompanyName: Nombre de la empresa seleccionada
/// - Role: Rol del usuario en el tenant seleccionado
/// </summary>
/// <param name="RequiresContextSelection">Indica si el usuario debe seleccionar un tenant</param>
/// <param name="IntermediateToken">Token temporal para selección de contexto (solo si RequiresContextSelection=true)</param>
/// <param name="AccessToken">Token de acceso JWT (solo si RequiresContextSelection=false)</param>
/// <param name="TokenType">Tipo de token (generalmente "Bearer")</param>
/// <param name="ExpiresIn">Segundos hasta expiración del token</param>
/// <param name="AvailableTenants">Lista de tenants disponibles para el usuario</param>
/// <param name="SelectedTenantId">ID del tenant seleccionado (si aplica)</param>
/// <param name="CompanyName">Nombre de la empresa seleccionada</param>
/// <param name="Role">Rol del usuario en el tenant seleccionado</param>
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
/// Campos:
/// - TenantId: ID único del tenant
/// - CompanyName: Nombre de la empresa
/// - CompanyCode: Código único de la empresa
/// - TaxId: ID fiscal/RUC de la empresa
/// - Role: Rol del usuario en este tenant (Owner, Admin, User, etc.)
/// - IsOwner: Indica si el usuario es propietario del tenant
/// - IsActive: Indica si el tenant está activo
/// - Instances: Lista de instancias disponibles en este tenant
/// </summary>
/// <param name="TenantId">ID único del tenant</param>
/// <param name="CompanyName">Nombre de la empresa</param>
/// <param name="CompanyCode">Código único de la empresa</param>
/// <param name="TaxId">ID fiscal/RUC de la empresa</param>
/// <param name="Role">Rol del usuario en este tenant (Owner, Admin, User, etc.)</param>
/// <param name="IsOwner">Indica si el usuario es propietario del tenant</param>
/// <param name="IsActive">Indica si el tenant está activo</param>
/// <param name="Instances">Lista de instancias disponibles en este tenant</param>
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

/// <summary>
/// DTO que representa una instancia de aplicación dentro de una empresa.
/// Campos: InstanceId (Guid), Name (string), Type (string), Code (string), Status (string), Url (string).
/// </summary>
/// <param name="InstanceId">Identificador único de la instancia.</param>
/// <param name="Name">Nombre descriptivo de la instancia.</param>
/// <param name="Type">Tipo de aplicación (ej: "Veterinaria", "ERP").</param>
/// <param name="Code">Código único de la instancia.</param>
/// <param name="Status">Estado actual de la instancia.</param>
/// <param name="Url">URL de acceso a la instancia.</param>
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
/// Campos: IntermediateToken (string), TenantId (Guid).
/// </summary>
/// <param name="IntermediateToken">Token intermedio obtenido del login para seleccionar contexto.</param>
/// <param name="TenantId">Identificador del tenant/empresa a seleccionar.</param>
public record SelectContextRequest(
    string IntermediateToken,
    Guid TenantId
);

/// <summary>
/// Response de selección de contexto con token de acceso completo.
/// Campos: AccessToken (string), TokenType (string), ExpiresIn (int), TenantId (Guid), CompanyName (string), Role (string).
/// </summary>
/// <param name="AccessToken">Token de acceso JWT completo para el contexto seleccionado.</param>
/// <param name="TokenType">Tipo de token (generalmente "Bearer").</param>
/// <param name="ExpiresIn">Tiempo de expiración del token en segundos.</param>
/// <param name="TenantId">Identificador del tenant/empresa seleccionado.</param>
/// <param name="CompanyName">Nombre de la empresa seleccionada.</param>
/// <param name="Role">Rol del usuario en la empresa seleccionada.</param>
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
/// Campos: Email (string), Password (string), FirstName (string), LastName (string), CreateDefaultOrganization (bool).
/// </summary>
/// <param name="Email">Correo electrónico del nuevo usuario.</param>
/// <param name="Password">Contraseña del nuevo usuario.</param>
/// <param name="FirstName">Nombre del nuevo usuario.</param>
/// <param name="LastName">Apellido del nuevo usuario.</param>
/// <param name="CreateDefaultOrganization">Indica si se debe crear una organización por defecto para el usuario.</param>
public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    bool CreateDefaultOrganization = false
);

/// <summary>
/// Response de registro exitoso.
/// Campos: UserId (Guid), Email (string), FullName (string), OrganizationId (Guid?), OrganizationName (string?).
/// </summary>
/// <param name="UserId">Identificador único del usuario registrado.</param>
/// <param name="Email">Correo electrónico del usuario registrado.</param>
/// <param name="FullName">Nombre completo del usuario registrado.</param>
/// <param name="OrganizationId">Identificador de la organización creada (si aplica).</param>
/// <param name="OrganizationName">Nombre de la organización creada (si aplica).</param>
public record RegisterResponse(
    Guid UserId,
    string Email,
    string FullName,
    Guid? OrganizationId,
    string? OrganizationName
);

/// <summary>
/// Request para inicio de recuperación de contraseña (solicitud de token).
/// Campos: Email (string).
/// </summary>
/// <param name="Email">Correo electrónico del usuario que solicita recuperación de contraseña.</param>
public record ForgotPasswordRequest(
    string Email
);

/// <summary>
/// Response de solicitud de recuperación de contraseña (desarrollo: retorna URL mock de email).
/// Campos: Message (string), MockResetUrl (string?).
/// </summary>
/// <param name="Message">Mensaje informativo sobre el envío del email de recuperación.</param>
/// <param name="MockResetUrl">URL mock para desarrollo/testing (opcional).</param>
public record ForgotPasswordResponse(
    string Message,
    string? MockResetUrl = null
);

/// <summary>
/// Request para resetear contraseña con token de recuperación.
/// Campos: Email (string), Token (string), NewPassword (string), ConfirmPassword (string).
/// </summary>
/// <param name="Email">Correo electrónico del usuario.</param>
/// <param name="Token">Token de recuperación de contraseña recibido por email.</param>
/// <param name="NewPassword">Nueva contraseña a establecer.</param>
/// <param name="ConfirmPassword">Confirmación de la nueva contraseña.</param>
public record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword,
    string ConfirmPassword
);

/// <summary>
/// Response de reset de contraseña exitoso.
/// Campos: Message (string).
/// </summary>
/// <param name="Message">Mensaje confirmando que la contraseña fue reseteada exitosamente.</param>
public record ResetPasswordResponse(
    string Message
);

/// <summary>
/// Response de validación de token de reset de contraseña.
/// Campos: IsValid (bool).
/// </summary>
/// <param name="IsValid">Indica si el token de reset es válido y no ha expirado.</param>
public record ValidateTokenResponse(
    bool IsValid
);

/// <summary>
/// Response de confirmación de email.
/// Campos: Success (bool), Message (string).
/// </summary>
/// <param name="Success">Indica si la confirmación del email fue exitosa.</param>
/// <param name="Message">Mensaje descriptivo del resultado de la confirmación.</param>
public record ConfirmEmailResponse(
    bool Success,
    string Message
);

/// <summary>
/// Request para actualización de perfil de usuario (actualización parcial).
/// Campos: FirstName (string?), LastName (string?), Phone (string?), CurrentPassword (string?), NewPassword (string?).
/// </summary>
/// <param name="FirstName">Nuevo nombre del usuario (opcional).</param>
/// <param name="LastName">Nuevo apellido del usuario (opcional).</param>
/// <param name="Phone">Nuevo teléfono del usuario (opcional).</param>
/// <param name="CurrentPassword">Contraseña actual para verificación (requerido si se cambia la contraseña).</param>
/// <param name="NewPassword">Nueva contraseña (opcional).</param>
public record UpdateProfileRequest(
    string? FirstName,
    string? LastName,
    string? Phone,
    string? CurrentPassword,
    string? NewPassword
);

/// <summary>
/// Response de actualización de perfil exitosa.
/// Campos: Success (bool), Message (string), Profile (UserProfileDto?).
/// </summary>
/// <param name="Success">Indica si la actualización fue exitosa.</param>
/// <param name="Message">Mensaje descriptivo del resultado de la actualización.</param>
/// <param name="Profile">Perfil actualizado del usuario (opcional).</param>
public record UpdateProfileResponse(
    bool Success,
    string Message,
    UserProfileDto? Profile
);

/// <summary>
/// DTO de perfil de usuario.
/// Campos: UserId (Guid), Email (string), FirstName (string), LastName (string), FullName (string), Phone (string?).
/// </summary>
/// <param name="UserId">Identificador único del usuario.</param>
/// <param name="Email">Correo electrónico del usuario.</param>
/// <param name="FirstName">Nombre del usuario.</param>
/// <param name="LastName">Apellido del usuario.</param>
/// <param name="FullName">Nombre completo del usuario.</param>
/// <param name="Phone">Teléfono del usuario (opcional).</param>
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
/// Campos: UserId (Guid), Email (string), FullName (string), Organizations (List&lt;OrganizationContextDto&gt;).
/// </summary>
/// <param name="UserId">Identificador único del usuario.</param>
/// <param name="Email">Correo electrónico del usuario.</param>
/// <param name="FullName">Nombre completo del usuario.</param>
/// <param name="Organizations">Lista de organizaciones a las que pertenece el usuario con sus instancias.</param>
public record UserContextResponse(
    Guid UserId,
    string Email,
    string FullName,
    List<OrganizationContextDto> Organizations
);

/// <summary>
/// DTO de organización con instancias basado en permisos del usuario.
/// Campos: OrganizationId (Guid), OrganizationName (string), OrganizationCode (string), TaxId (string), IsOwner (bool), IsActive (bool), Role (string), Instances (List&lt;InstanceContextDto&gt;).
/// </summary>
/// <param name="OrganizationId">Identificador único de la organización.</param>
/// <param name="OrganizationName">Nombre de la organización.</param>
/// <param name="OrganizationCode">Código único de la organización.</param>
/// <param name="TaxId">Identificación tributaria de la organización.</param>
/// <param name="IsOwner">Indica si el usuario es propietario de la organización.</param>
/// <param name="IsActive">Indica si la organización está activa.</param>
/// <param name="Role">Rol del usuario en la organización (Owner, InstanceAdmin, User, Guest).</param>
/// <param name="Instances">Lista de instancias de la organización accesibles por el usuario.</param>
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
/// DTO de instancia con información relevante para el home.
/// Campos: InstanceId (Guid), Code (string), Name (string), ApplicationType (string), Status (string), Url (string), HasDirectAssignment (bool).
/// </summary>
/// <param name="InstanceId">Identificador único de la instancia.</param>
/// <param name="Code">Código único de la instancia.</param>
/// <param name="Name">Nombre descriptivo de la instancia.</param>
/// <param name="ApplicationType">Tipo de aplicación (ERP, CRM, POS, VETERINARIA, etc.).</param>
/// <param name="Status">Estado de la instancia (Active, Suspended, Inactive).</param>
/// <param name="Url">URL de acceso a la instancia.</param>
/// <param name="HasDirectAssignment">Indica si el usuario tiene asignación directa a esta instancia.</param>
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
