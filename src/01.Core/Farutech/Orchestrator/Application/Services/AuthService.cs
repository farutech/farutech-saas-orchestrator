using Farutech.Orchestrator.Application.DTOs.Auth;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Implementación SEGURA del servicio de autenticación con soporte multi-empresa.
/// Implementa el patrón "Intermediate Token" para flujo de autenticación robusto.
/// </summary>
public class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ITokenService tokenService,
    IAuthRepository authRepository) : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
    private readonly ITokenService _tokenService = tokenService;
    private readonly IAuthRepository _authRepository = authRepository;

    /// <summary>
    /// Autentica al usuario y retorna token intermedio (si multi-tenant) o token de acceso directo (si single-tenant).
    /// </summary>
    public async Task<SecureLoginResponse?> LoginAsync(string email, string password, bool rememberMe = false)
    {
        return await LoginAsync(email, password, rememberMe, null, null);
    }

    /// <summary>
    /// Autentica al usuario con acceso directo a una instancia específica (cuando viene desde URL con subdominios).
    /// </summary>
    public async Task<SecureLoginResponse?> LoginAsync(
        string email, 
        string password, 
        bool rememberMe = false, 
        string? instanceCode = null, 
        string? organizationCode = null)
    {
        Console.WriteLine($"[AuthService] LoginAsync called for email: {email}");
        
        // Buscar usuario por email
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            Console.WriteLine($"[AuthService] User not found for email: {email}");
            return null;
        }
        
        if (!user.IsActive)
        {
            Console.WriteLine($"[AuthService] User {email} is not active");
            return null;
        }
        
        Console.WriteLine($"[AuthService] User found: {user.Email}, IsActive: {user.IsActive}");

        // Validar password
        var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            Console.WriteLine($"[AuthService] Password check failed for {email}. Result: {result}");
            return null;
        }
        
        Console.WriteLine($"[AuthService] Password validated for {email}");

        // Actualizar último login
        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        // Obtener membresías activas
        Console.WriteLine($"[AuthService] Getting memberships for user {user.Id}");
        var memberships = await _authRepository.GetUserMembershipsAsync(user.Id);
        Console.WriteLine($"[AuthService] Found {memberships.Count()} memberships for user {user.Id}");
        var activeMemberships = await GetAvailableTenantsForUserAsync(user.Id);

        // CASO 0: Acceso directo con instanceCode y organizationCode (desde URL directa)
        if (!string.IsNullOrWhiteSpace(instanceCode) && !string.IsNullOrWhiteSpace(organizationCode))
        {
            Console.WriteLine($"[AuthService] Direct access requested for instance: {instanceCode}, organization: {organizationCode}");
            
            // Buscar la instancia específica en los tenants disponibles
            var targetTenant = activeMemberships
                .Where(t => t.CompanyCode.Equals(organizationCode, StringComparison.OrdinalIgnoreCase))
                .SelectMany(t => t.Instances)
                .FirstOrDefault(i => i.Code.Equals(instanceCode, StringComparison.OrdinalIgnoreCase));
            
            if (targetTenant == null)
            {
                Console.WriteLine($"[AuthService] User {email} does not have access to instance {instanceCode} in organization {organizationCode}");
                return null; // Usuario no tiene acceso a esta instancia
            }
            
            // Obtener el tenant owner de esta instancia
            var ownerTenant = activeMemberships
                .First(t => t.Instances.Any(i => i.InstanceId == targetTenant.InstanceId));
            
            // Generar token de acceso directo
            var accessToken = _tokenService.GenerateAccessToken(
                user,
                ownerTenant.TenantId,
                ownerTenant.CompanyName,
                ownerTenant.Role,
                rememberMe
            );
            
            Console.WriteLine($"[AuthService] Direct access token generated for {email} on instance {instanceCode}");
            
            return new SecureLoginResponse(
                RequiresContextSelection: false,
                IntermediateToken: null,
                AccessToken: accessToken,
                TokenType: "Bearer",
                ExpiresIn: rememberMe ? 2592000 : 3600, // 30 días o 1 hora
                AvailableTenants: null,
                SelectedTenantId: ownerTenant.TenantId,
                CompanyName: ownerTenant.CompanyName,
                Role: ownerTenant.Role
            );
        }

        // CASO 1: Usuario SIN tenants → Retornar token limpio para ONBOARDING
        if (activeMemberships.Count == 0)
        {
            var onboardingToken = _tokenService.GenerateAccessToken(
                user,
                null, // Sin tenant_id (permite crear primera empresa)
                null,
                null,
                rememberMe
            );

            return new SecureLoginResponse(
                RequiresContextSelection: false,
                IntermediateToken: null,
                AccessToken: onboardingToken,
                TokenType: "Bearer",
                ExpiresIn: 3600,
                AvailableTenants: null,
                SelectedTenantId: null,
                CompanyName: null,
                Role: null
            );
        }

        // CASO 2: Portal de Gestión (Siempre retornar Dashboard)
        // Se unifica el flujo: siempre paso por el dashboard de instancias.
        var allowedTenantIds = activeMemberships.Select(m => m.TenantId).ToList();
        var intermediateToken = _tokenService.GenerateIntermediateToken(user, allowedTenantIds);
        
        return new SecureLoginResponse(
            RequiresContextSelection: true,
            IntermediateToken: intermediateToken,
            AccessToken: null,
            TokenType: null,
            ExpiresIn: null,
            AvailableTenants: activeMemberships,
            SelectedTenantId: null,
            CompanyName: null,
            Role: null
        );
    }

    /// <summary>
    /// Intercambia un token intermedio por un token de acceso completo con el tenant seleccionado.
    /// </summary>
    public async Task<SelectContextResponse?> SelectContextAsync(string intermediateToken, Guid tenantId)
    {
        // Validar token intermedio y extraer userId + tenantIds permitidos
        var validationResult = _tokenService.ValidateIntermediateToken(intermediateToken);
        if (validationResult == null)
        {
            Console.WriteLine("[SelectContextAsync] Token validation returned null");
            return null; // Token inválido, expirado o no es intermedio
        }

        var (userId, allowedTenantIds) = validationResult.Value;

        // COMPATIBILIDAD: Si el token no tiene allowed_tenant claims (token antiguo),
        // verificar directamente en la base de datos
        if (allowedTenantIds.Count == 0)
        {
            Console.WriteLine("[SelectContextAsync] Token without allowed_tenant claims detected (legacy token)");
            Console.WriteLine("[SelectContextAsync] Verifying tenant access from database...");
            
            // Validar usuario
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || !user.IsActive)
            {
                Console.WriteLine($"[SelectContextAsync] User not found or inactive: {userId}");
                return null;
            }

            // Verificar membresía desde la base de datos
            var membership = await _authRepository.GetUserMembershipAsync(userId, tenantId);
            if (membership == null || !membership.IsActive)
            {
                Console.WriteLine($"[SelectContextAsync] LEGACY TOKEN: No active membership found for user {userId} in tenant {tenantId}");
                return null;
            }
            
            Console.WriteLine($"[SelectContextAsync] LEGACY TOKEN: Access verified from database for user {userId} in tenant {tenantId}");
        }
        else
        {
            // SEGURIDAD: Validar que el tenantId solicitado esté en la lista permitida del token
            if (!allowedTenantIds.Contains(tenantId))
            {
                Console.WriteLine($"[SelectContextAsync] SECURITY: Attempted to access unauthorized tenant. UserId: {userId}, Requested: {tenantId}, Allowed: {string.Join(",", allowedTenantIds)}");
                return null; // Intento de acceso a tenant no autorizado
            }
        }

        // Validar usuario
        var user2 = await _userManager.FindByIdAsync(userId.ToString());
        if (user2 == null || !user2.IsActive)
        {
            Console.WriteLine($"[SelectContextAsync] User not found or inactive: {userId}");
            return null;
        }

        // Validar membresía al tenant solicitado (doble verificación)
        var membership2 = await _authRepository.GetUserMembershipAsync(userId, tenantId);
        if (membership2 == null || !membership2.IsActive)
        {
            Console.WriteLine($"[SelectContextAsync] No active membership found for user {userId} in tenant {tenantId}");
            return null;
        }

        // Obtener información del tenant
        var customer = await _authRepository.GetCustomerByIdAsync(tenantId);
        if (customer == null || !customer.IsActive)
        {
            Console.WriteLine($"[SelectContextAsync] Customer not found or inactive: {tenantId}");
            return null;
        }

        // Generar token de acceso completo
        var accessToken = _tokenService.GenerateAccessToken(
            user2,
            tenantId,
            customer.CompanyName,
            membership2.Role.ToString()
        );

        Console.WriteLine($"[SelectContextAsync] Access token generated successfully for user {userId} in tenant {tenantId}");

        return new SelectContextResponse(
            AccessToken: accessToken,
            TokenType: "Bearer",
            ExpiresIn: 3600,
            TenantId: tenantId,
            CompanyName: customer.CompanyName,
            Role: membership2.Role.ToString()
        );
    }

    public async Task<RegisterResponse?> RegisterAsync(RegisterRequest request)
    {
        // Validar si el email ya existe
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return null;
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return null;
        }

        // Generar token de confirmación de email
        var confirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = Uri.EscapeDataString(confirmationToken);
        
        // TODO: En producción, enviar email con el link de confirmación
        // Por ahora, loguear el link para desarrollo/testing
        var confirmationUrl = $"http://localhost:8081/confirm-email?userId={user.Id}&code={encodedToken}";
        Console.WriteLine($"[DEV] Email Confirmation URL: {confirmationUrl}");

        // Si se solicita, crear organización por defecto
        Guid? organizationId = null;
        string? organizationName = null;

        if (request.CreateDefaultOrganization)
        {
            var defaultOrgName = $"{user.FirstName} {user.LastName} Organization";
            var organization = new Customer
            {
                CompanyName = defaultOrgName,
                Email = user.Email,
                Code = Guid.NewGuid().ToString("N")[..8].ToUpperInvariant(),
                TaxId = "PendingRegistration", // Placeholder - user can update later
                IsActive = true,
                CreatedBy = user.Id.ToString()
            };

            // Guardar organización (esto requeriría un repository de Customer)
            // Por ahora, se deja pendiente la implementación completa
            organizationId = organization.Id;
            organizationName = defaultOrgName;

            // Asignar el usuario como Owner de la organización
            await AssignUserToCompanyAsync(user.Id, organization.Id, FarutechRole.Owner.ToString(), user.Id);
        }

        return new RegisterResponse(
            user.Id,
            user.Email,
            user.FullName,
            organizationId,
            organizationName
        );
    }

    public async Task<bool> AssignUserToCompanyAsync(Guid userId, Guid customerId, string role, Guid grantedBy)
    {
        if (!Enum.TryParse<FarutechRole>(role, true, out var roleEnum))
        {
            return false;
        }

        // Validar que no exista la membresía
        var existing = await _authRepository.GetUserMembershipAsync(userId, customerId);
        if (existing != null)
        {
            return false;
        }

        // Validar que el usuario y la empresa existan
        var user = await _userManager.FindByIdAsync(userId.ToString());
        var customer = await _authRepository.GetCustomerByIdAsync(customerId);

        if (user == null || customer == null)
        {
            return false;
        }

        var membership = new UserCompanyMembership
        {
            UserId = userId,
            CustomerId = customerId,
            Role = roleEnum,
            IsActive = true,
            GrantedAt = DateTime.UtcNow,
            GrantedBy = grantedBy
        };

        return await _authRepository.AddMembershipAsync(membership);
    }

    public async Task<bool> ValidateUserCompanyAccessAsync(Guid userId, Guid customerId)
    {
        var membership = await _authRepository.GetUserMembershipAsync(userId, customerId);
        return membership != null && membership.IsActive;
    }

    // ===== LEGACY METHODS (Mantener por compatibilidad temporal) =====

    [Obsolete("Use LoginAsync en su lugar")]
    public async Task<LoginResponse?> AuthenticateAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !user.IsActive)
        {
            return null;
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            return null;
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var memberships = await _authRepository.GetUserMembershipsAsync(user.Id);

        var companies = new List<CompanyMembershipDto>();
        foreach (var membership in memberships.Where(m => m.IsActive))
        {
            var customer = await _authRepository.GetCustomerByIdAsync(membership.CustomerId);
            if (customer != null && customer.IsActive)
            {
#pragma warning disable CS0618 // Type or member is obsolete
                companies.Add(new CompanyMembershipDto(
                    customer.Id,
                    customer.CompanyName,
                    membership.Role.ToString()
                ));
#pragma warning restore CS0618 // Type or member is obsolete
            }
        }

#pragma warning disable CS0618 // Type or member is obsolete
        return new LoginResponse(
            user.Id,
            user.Email!,
            user.FullName,
            companies
        );
#pragma warning restore CS0618 // Type or member is obsolete
    }

    [Obsolete("Use SelectContextAsync en su lugar")]
    public async Task<TokenResponse?> GenerateTokenAsync(Guid userId, Guid customerId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null || !user.IsActive)
        {
            return null;
        }

        var membership = await _authRepository.GetUserMembershipAsync(userId, customerId);
        if (membership == null || !membership.IsActive)
        {
            return null;
        }

        var customer = await _authRepository.GetCustomerByIdAsync(customerId);
        if (customer == null || !customer.IsActive)
        {
            return null;
        }

        var token = _tokenService.GenerateAccessToken(
            user,
            customerId,
            customer.CompanyName,
            membership.Role.ToString()
        );

#pragma warning disable CS0618 // Type or member is obsolete
        return new TokenResponse(
            token,
            "Bearer",
            3600,
            customerId,
            customer.CompanyName,
            membership.Role.ToString()
        );
#pragma warning restore CS0618 // Type or member is obsolete
    }

    /// <summary>
    /// Inicia el proceso de recuperación de contraseña generando un token de reset.
    /// En desarrollo, retorna la URL mock de email para facilitar testing.
    /// </summary>
    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        
        // Por seguridad, siempre retornar respuesta exitosa aunque el usuario no exista
        // para evitar revelar si un email está registrado
        if (user == null || !user.IsActive)
        {
            return new ForgotPasswordResponse(
                "Si el correo existe en nuestro sistema, recibirás un enlace de recuperación."
            );
        }

        // Generar token único (GUID)
        var resetToken = Guid.NewGuid().ToString();
        var expirationDate = DateTime.UtcNow.AddHours(2);

        var passwordResetToken = new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            Email = email,
            Token = resetToken,
            ExpirationDate = expirationDate,
            IsUsed = false,
            UserId = user.Id
        };

        await _authRepository.CreatePasswordResetTokenAsync(passwordResetToken);

        // En desarrollo, retornar URL mock para facilitar testing
        var mockResetUrl = $"http://localhost:8081/auth/reset-password?token={resetToken}&email={Uri.EscapeDataString(email)}";

        return new ForgotPasswordResponse(
            "Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.",
            mockResetUrl
        );
    }

    /// <summary>
    /// Resetea la contraseña del usuario usando el token de recuperación.
    /// Valida que el token sea válido, no haya expirado y coincida con el email.
    /// </summary>
    public async Task<ResetPasswordResponse> ResetPasswordAsync(string email, string token, string newPassword)
    {
        // Buscar token en base de datos
        var resetToken = await _authRepository.GetPasswordResetTokenAsync(token);

        if (resetToken == null || 
            resetToken.Email != email || 
            resetToken.IsUsed || 
            resetToken.ExpirationDate < DateTime.UtcNow)
        {
            throw new InvalidOperationException("El token de recuperación es inválido o ha expirado.");
        }

        // Buscar usuario
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !user.IsActive)
        {
            throw new InvalidOperationException("Usuario no encontrado o inactivo.");
        }

        // Resetear contraseña usando Identity
        var resetPasswordToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, resetPasswordToken, newPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Error al resetear contraseña: {errors}");
        }

        // Marcar token como usado
        resetToken.IsUsed = true;
        await _authRepository.UpdatePasswordResetTokenAsync(resetToken);

        return new ResetPasswordResponse("Contraseña actualizada exitosamente.");
    }

    /// <summary>
    /// Valida si un token de reset de contraseña es válido y no ha expirado.
    /// </summary>
    public async Task<bool> ValidatePasswordResetTokenAsync(string email, string token)
    {
        try
        {
            var resetToken = await _authRepository.GetPasswordResetTokenAsync(token);

            if (resetToken == null || 
                resetToken.Email != email || 
                resetToken.IsUsed || 
                resetToken.ExpirationDate < DateTime.UtcNow)
            {
                return false;
            }

            return true;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Confirma el email del usuario usando el token de confirmación.
    /// </summary>
    public async Task<ConfirmEmailResponse> ConfirmEmailAsync(string userId, string code)
    {
        if (!Guid.TryParse(userId, out var userGuid))
        {
            return new ConfirmEmailResponse(false, "ID de usuario inválido");
        }

        var user = await _userManager.FindByIdAsync(userGuid.ToString());
        if (user == null)
        {
            return new ConfirmEmailResponse(false, "Usuario no encontrado");
        }

        if (user.EmailConfirmed)
        {
            return new ConfirmEmailResponse(true, "El email ya ha sido confirmado");
        }

        // Decodificar el código (viene URI-encoded desde el email)
        var decodedCode = Uri.UnescapeDataString(code);
        
        var result = await _userManager.ConfirmEmailAsync(user, decodedCode);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return new ConfirmEmailResponse(false, $"Error al confirmar email: {errors}");
        }

        return new ConfirmEmailResponse(true, "Email confirmado exitosamente");
    }

    /// <summary>
    /// Obtiene el perfil del usuario actual basado en el userId de los claims del token.
    /// </summary>
    public async Task<UserProfileDto?> GetUserProfileAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null || !user.IsActive)
        {
            return null;
        }

        return new UserProfileDto(
            user.Id,
            user.Email ?? "",
            user.FirstName,
            user.LastName,
            user.FullName,
            user.PhoneNumber
        );
    }

    /// <summary>
    /// Actualiza el perfil del usuario (actualización parcial). Solo los campos no nulos se actualizan.
    /// </summary>
    public async Task<UpdateProfileResponse> UpdateUserProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null || !user.IsActive)
        {
            return new UpdateProfileResponse(false, "Usuario no encontrado", null);
        }

        var hasChanges = false;

        // Actualizar FirstName si viene en el request
        if (!string.IsNullOrWhiteSpace(request.FirstName) && user.FirstName != request.FirstName)
        {
            user.FirstName = request.FirstName;
            hasChanges = true;
        }

        // Actualizar LastName si viene en el request
        if (!string.IsNullOrWhiteSpace(request.LastName) && user.LastName != request.LastName)
        {
            user.LastName = request.LastName;
            hasChanges = true;
        }

        // Actualizar Phone si viene en el request
        if (request.Phone != null && user.PhoneNumber != request.Phone)
        {
            user.PhoneNumber = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone;
            hasChanges = true;
        }

        // Cambio de contraseña (requiere contraseña actual)
        if (!string.IsNullOrWhiteSpace(request.NewPassword))
        {
            if (string.IsNullOrWhiteSpace(request.CurrentPassword))
            {
                return new UpdateProfileResponse(false, "Se requiere la contraseña actual para cambiar la contraseña", null);
            }

            var passwordCheckResult = await _signInManager.CheckPasswordSignInAsync(user, request.CurrentPassword, lockoutOnFailure: false);
            if (!passwordCheckResult.Succeeded)
            {
                return new UpdateProfileResponse(false, "La contraseña actual es incorrecta", null);
            }

            var passwordChangeResult = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!passwordChangeResult.Succeeded)
            {
                var errors = string.Join(", ", passwordChangeResult.Errors.Select(e => e.Description));
                return new UpdateProfileResponse(false, $"Error al cambiar contraseña: {errors}", null);
            }

            hasChanges = true;
        }

        // Guardar cambios si hubo modificaciones
        if (hasChanges)
        {
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
                return new UpdateProfileResponse(false, $"Error al actualizar perfil: {errors}", null);
            }
        }

        // Retornar perfil actualizado
        var profile = new UserProfileDto(
            user.Id,
            user.Email ?? "",
            user.FirstName,
            user.LastName,
            user.FullName,
            user.PhoneNumber
        );

        return new UpdateProfileResponse(true, hasChanges ? "Perfil actualizado correctamente" : "No hubo cambios que guardar", profile);
    }

    /// <summary>
    /// Obtiene el contexto completo del usuario (organizaciones + instancias basado en permisos).
    /// </summary>
    public async Task<UserContextResponse> GetUserContextAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null || !user.IsActive)
        {
            return new UserContextResponse(userId, "", "", []);
        }

        // Obtener membresías activas del usuario
        var memberships = await _authRepository.GetUserMembershipsAsync(userId);
        var organizations = new List<OrganizationContextDto>();

        foreach (var membership in memberships.Where(m => m.IsActive))
        {
            var customer = await _authRepository.GetCustomerByIdAsync(membership.CustomerId);
            if (customer == null || !customer.IsActive)
            {
                continue;
            }

            var isOwner = membership.Role == FarutechRole.Owner;

            // Obtener todas las instancias de la organización
            // TODO: Implementar filtrado por asignación específica cuando se cree la tabla UserInstanceAssignment
            var instances = (await _authRepository.GetTenantInstancesAsync(customer.Id)).ToList();

            var instanceDtos = instances.Select(i => new InstanceContextDto(
                i.Id,
                !string.IsNullOrEmpty(i.TenantCode) ? i.TenantCode : i.Id.ToString().Substring(0, 8),
                !string.IsNullOrEmpty(i.Name) ? i.Name : i.TenantCode,
                !string.IsNullOrEmpty(i.ApplicationType) ? i.ApplicationType : "Generic",
                i.Status,
                i.ApiBaseUrl ?? "",
                false // Por ahora todas las instancias son accesibles por membresía a nivel Customer
            )).ToList();

            organizations.Add(new OrganizationContextDto(
                customer.Id,
                customer.CompanyName,
                customer.Code ?? "",
                customer.TaxId ?? "",
                isOwner,
                customer.IsActive,
                membership.Role.ToString(),
                instanceDtos
            ));
        }

        return new UserContextResponse(
            user.Id,
            user.Email ?? "",
            user.FullName,
            organizations
        );
    }

    /// <summary>
    /// Obtiene los tenants disponibles para un usuario específico.
    /// </summary>
    public async Task<List<TenantOptionDto>?> GetAvailableTenantsAsync(Guid userId)
        => await GetAvailableTenantsForUserAsync(userId);

    /// <summary>
    /// Método privado para obtener tenants disponibles para un usuario.
    /// </summary>
    private async Task<List<TenantOptionDto>> GetAvailableTenantsForUserAsync(Guid userId)
    {
        var memberships = await _authRepository.GetUserMembershipsAsync(userId);
        var activeMemberships = new List<TenantOptionDto>();

        foreach (var membership in memberships.Where(m => m.IsActive))
        {
            var customer = await _authRepository.GetCustomerByIdAsync(membership.CustomerId);
            if (customer != null && customer.IsActive)
            {
                // Obtener instancias de la empresa
                var instances = await _authRepository.GetTenantInstancesAsync(customer.Id);
                var instanceDtos = instances.Select(i => new InstanceDto(
                    i.Id,
                    !string.IsNullOrEmpty(i.Name) ? i.Name : i.TenantCode, // Fallback
                    !string.IsNullOrEmpty(i.ApplicationType) ? i.ApplicationType : "Generic",
                    !string.IsNullOrEmpty(i.TenantCode) ? i.TenantCode : i.Id.ToString().Substring(0,8),
                    i.Status,
                    i.ApiBaseUrl ?? ""
                )).ToList();

                activeMemberships.Add(new TenantOptionDto(
                    customer.Id,
                    customer.CompanyName,
                    customer.Code,
                    customer.TaxId ?? "",
                    membership.Role.ToString(),
                    membership.Role == FarutechRole.Owner,
                    customer.IsActive,
                    instanceDtos
                ));
            }
        }

        return activeMemberships;
    }
}