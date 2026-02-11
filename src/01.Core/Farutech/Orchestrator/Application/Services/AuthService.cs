using Farutech.Orchestrator.Application.DTOs.Auth;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Json;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Implementación SEGURA del servicio de autenticación con soporte multi-empresa.
/// Implementa el patrón "Intermediate Token" para flujo de autenticación robusto.
/// </summary>
public class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ITokenService tokenService,
    IAuthRepository authRepository,
    IConfiguration configuration) : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
    private readonly ITokenService _tokenService = tokenService;
    private readonly IAuthRepository _authRepository = authRepository;
    private readonly IConfiguration _configuration = configuration;

    /// <summary>
    /// Obtiene un HttpClient configurado para el IAM API
    /// </summary>
    private HttpClient GetIamHttpClient()
    {
        var iamUrl = _configuration["Services:IAM:Url"] ?? "http://iam-api:8080";
        return new HttpClient { BaseAddress = new Uri(iamUrl) };
    }

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
        try
        {
            // Hacer proxy al IAM API
            using var client = GetIamHttpClient();
            var response = await client.PostAsJsonAsync("/api/Auth/register", request);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<RegisterResponse>();
                return result;
            }
            else
            {
                // Log error for debugging
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[AuthService.RegisterAsync] IAM API error: {response.StatusCode} - {errorContent}");
                return null;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AuthService.RegisterAsync] Exception: {ex.Message}");
            return null;
        }
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
        try
        {
            // Hacer proxy al IAM API
            using var client = GetIamHttpClient();
            var response = await client.PostAsJsonAsync("/api/Auth/forgot-password", new { email });
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<ForgotPasswordResponse>();
                return result ?? new ForgotPasswordResponse("Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.");
            }
            else
            {
                // Log error for debugging
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[AuthService.ForgotPasswordAsync] IAM API error: {response.StatusCode} - {errorContent}");
                return new ForgotPasswordResponse("Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AuthService.ForgotPasswordAsync] Exception: {ex.Message}");
            return new ForgotPasswordResponse("Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.");
        }
    }

    /// <summary>
    /// Resetea la contraseña del usuario usando el token de recuperación.
    /// Valida que el token sea válido, no haya expirado y coincida con el email.
    /// </summary>
    public async Task<ResetPasswordResponse> ResetPasswordAsync(string email, string token, string newPassword)
    {
        try
        {
            // Hacer proxy al IAM API
            using var client = GetIamHttpClient();
            var request = new
            {
                email,
                token,
                newPassword,
                confirmPassword = newPassword // IAM API probablemente espera confirmPassword
            };
            
            var response = await client.PostAsJsonAsync("/api/Auth/reset-password", request);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<ResetPasswordResponse>();
                return result ?? new ResetPasswordResponse("Contraseña actualizada exitosamente.");
            }
            else
            {
                // Log error for debugging
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[AuthService.ResetPasswordAsync] IAM API error: {response.StatusCode} - {errorContent}");
                throw new InvalidOperationException("El token de recuperación es inválido o ha expirado.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AuthService.ResetPasswordAsync] Exception: {ex.Message}");
            throw new InvalidOperationException("El token de recuperación es inválido o ha expirado.");
        }
    }

    /// <summary>
    /// Valida si un token de reset de contraseña es válido y no ha expirado.
    /// </summary>
    public async Task<bool> ValidatePasswordResetTokenAsync(string email, string token)
    {
        try
        {
            // Hacer proxy al IAM API
            using var client = GetIamHttpClient();
            var response = await client.GetAsync($"/api/Auth/validate-reset-token?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}");
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<Dictionary<string, bool>>();
                return result?.GetValueOrDefault("isValid", false) ?? false;
            }
            else
            {
                Console.WriteLine($"[AuthService.ValidatePasswordResetTokenAsync] IAM API error: {response.StatusCode}");
                return false;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AuthService.ValidatePasswordResetTokenAsync] Exception: {ex.Message}");
            return false;
        }
    }

    /// <summary>
    /// Confirma el email del usuario usando el token de confirmación.
    /// </summary>
    public async Task<ConfirmEmailResponse> ConfirmEmailAsync(string userId, string code)
    {
        try
        {
            // Hacer proxy al IAM API
            using var client = GetIamHttpClient();
            var response = await client.GetAsync($"/api/Auth/confirm-email?userId={Uri.EscapeDataString(userId)}&code={Uri.EscapeDataString(code)}");
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<ConfirmEmailResponse>();
                return result ?? new ConfirmEmailResponse(false, "Error al procesar la respuesta del servidor");
            }
            else
            {
                // Log error for debugging
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[AuthService.ConfirmEmailAsync] IAM API error: {response.StatusCode} - {errorContent}");
                return new ConfirmEmailResponse(false, "Error al confirmar el email");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AuthService.ConfirmEmailAsync] Exception: {ex.Message}");
            return new ConfirmEmailResponse(false, "Error interno del servidor");
        }
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

    /// <summary>
    /// Obtiene información del usuario actual para el frontend.
    /// </summary>
    public async Task<CurrentUserInfoDto?> GetCurrentUserInfoAsync(Guid userId)
    {
        try
        {
            // Obtener información básica del usuario desde IAM
            var userResponse = await GetIamHttpClient()
                .GetAsync($"api/auth/user/{userId}");

            if (!userResponse.IsSuccessStatusCode)
            {
                Console.WriteLine($"[GetCurrentUserInfoAsync] IAM API error: {userResponse.StatusCode}");
                return null;
            }

            var userData = await userResponse.Content.ReadFromJsonAsync<dynamic>();
            if (userData == null)
            {
                return null;
            }

            // Obtener membresías activas del usuario
            var memberships = await _authRepository.GetUserMembershipsAsync(userId);
            var activeMembership = memberships.FirstOrDefault(m => m.IsActive);

            // Generar lista de permisos basada en el rol
            var permissions = new List<string>();
            if (activeMembership != null)
            {
                permissions.Add($"role:{activeMembership.Role.ToString().ToLower()}");
                permissions.Add($"tenant:{activeMembership.CustomerId}");

                // Agregar permisos específicos según el rol
                switch (activeMembership.Role)
                {
                    case FarutechRole.Owner:
                        permissions.AddRange(new[] {
                            "manage:users", "manage:company", "manage:instances",
                            "create:instances", "delete:instances", "manage:billing"
                        });
                        break;
                    case FarutechRole.InstanceAdmin:
                        permissions.AddRange(new[] {
                            "manage:users", "manage:instances", "create:instances"
                        });
                        break;
                    case FarutechRole.User:
                        permissions.AddRange(new[] {
                            "read:instances", "use:instances"
                        });
                        break;
                    case FarutechRole.Guest:
                        permissions.AddRange(new[] {
                            "read:instances"
                        });
                        break;
                }
            }

            return new CurrentUserInfoDto(
                Email: (string)userData.email,
                Name: $"{(string)userData.firstName} {(string)userData.lastName}",
                CompanyName: activeMembership?.Customer?.CompanyName,
                Permissions: permissions
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[GetCurrentUserInfoAsync] Exception: {ex.Message}");
            return null;
        }
    }
}