using Farutech.IAM.Application.DTOs;
using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Domain.Entities;
using Farutech.IAM.Domain.Events;
using Microsoft.Extensions.Logging;

namespace Farutech.IAM.Application.Services;

/// <summary>
/// Service for user authentication operations
/// </summary>
public class AuthenticationService : IAuthenticationService
{
    private readonly IIamRepository _repository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenManagementService _tokenManagement;
    private readonly IEventPublisher _eventPublisher;
    private readonly ILogger<AuthenticationService> _logger;

    public AuthenticationService(
        IIamRepository repository,
        IPasswordHasher passwordHasher,
        ITokenManagementService tokenManagement,
        IEventPublisher eventPublisher,
        ILogger<AuthenticationService> logger)
    {
        _repository = repository;
        _passwordHasher = passwordHasher;
        _tokenManagement = tokenManagement;
        _eventPublisher = eventPublisher;
        _logger = logger;
    }

    public async Task<AuthenticationResult> LoginAsync(LoginRequest request)
    {
        try
        {
            // 1. Find user by email with memberships
            var user = await _repository.GetUserByEmailAsync(request.Email);

            if (user == null)
            {
                _logger.LogWarning("Login attempt failed: User not found - {Email}", request.Email);
                await LogAuditEventAsync(null, null, "login", "failed", "User not found", request.IpAddress, request.UserAgent);
                return AuthenticationResult.Failed("INVALID_CREDENTIALS", "Email o contraseña incorrectos");
            }

            // 2. Check if user is active
            if (!user.IsActive)
            {
                _logger.LogWarning("Login attempt failed: User inactive - {UserId}", user.Id);
                await LogAuditEventAsync(user.Id, null, "login", "failed", "User inactive", request.IpAddress, request.UserAgent);
                return AuthenticationResult.Failed("USER_INACTIVE", "Usuario inactivo. Contacte al administrador.");
            }

            // 3. Check if user is locked out
            if (user.IsLocked)
            {
                _logger.LogWarning("Login attempt failed: User locked - {UserId}", user.Id);
                await LogAuditEventAsync(user.Id, null, "login", "failed", "User locked", request.IpAddress, request.UserAgent);
                return AuthenticationResult.Failed("USER_LOCKED", $"Usuario bloqueado hasta {user.LockoutEnd:yyyy-MM-dd HH:mm:ss} UTC");
            }

            // 4. Verify password
            if (string.IsNullOrEmpty(user.PasswordHash) || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                // Increment access failed count
                user.AccessFailedCount++;
                
                // Lock account if too many failed attempts (5 attempts)
                if (user.AccessFailedCount >= 5)
                {
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
                    _logger.LogWarning("User locked due to too many failed attempts - {UserId}", user.Id);
                }
                
                await _repository.UpdateUserAsync(user);
                await _repository.SaveChangesAsync();
                await LogAuditEventAsync(user.Id, null, "login", "failed", "Invalid password", request.IpAddress, request.UserAgent);
                
                return AuthenticationResult.Failed("INVALID_CREDENTIALS", "Email o contraseña incorrectos");
            }

            // 5. Reset access failed count on successful password verification
            user.AccessFailedCount = 0;
            user.LastLoginAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateUserAsync(user);
            await _repository.SaveChangesAsync();

            // 6. Get available tenant contexts
            var memberships = await _repository.GetUserMembershipsAsync(user.Id);
            var availableContexts = memberships
                .Where(tm => tm.IsActive && tm.Tenant != null && tm.Tenant.IsActive)
                .Select(tm => new TenantContextDto
                {
                    TenantId = tm.TenantId,
                    TenantCode = tm.Tenant!.Code,
                    TenantName = tm.Tenant.Name,
                    MembershipId = tm.Id,
                    RoleName = tm.Role?.Name ?? "No Role",
                    IsActive = tm.IsActive
                })
                .ToList();

            // 7. Build response
            var response = new LoginResponse
            {
                UserId = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                RequiresContextSelection = availableContexts.Count > 0,
                AvailableContexts = availableContexts
            };

            // If user has only one tenant, auto-select it and generate tokens
            if (availableContexts.Count == 1)
            {
                var contextRequest = new SelectContextRequest
                {
                    UserId = user.Id,
                    TenantId = availableContexts[0].TenantId,
                    DeviceId = request.DeviceId,
                    IpAddress = request.IpAddress,
                    UserAgent = request.UserAgent
                };

                var contextResponse = await SelectContextAsync(contextRequest);
                response.AccessToken = contextResponse.AccessToken;
                response.RefreshToken = contextResponse.RefreshToken;
                response.ExpiresAt = contextResponse.ExpiresAt;
            }

            _logger.LogInformation("User logged in successfully - {UserId}", user.Id);
            await LogAuditEventAsync(user.Id, null, "login", "success", "User authenticated", request.IpAddress, request.UserAgent);

            // Publish login event
            await _eventPublisher.PublishAsync(new UserLoggedInEvent
            {
                UserId = user.Id,
                Email = user.Email,
                IpAddress = request.IpAddress ?? string.Empty,
                UserAgent = request.UserAgent ?? string.Empty,
                Timestamp = DateTime.UtcNow
            });

            return AuthenticationResult.Successful(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for {Email}", request.Email);
            return AuthenticationResult.Failed("INTERNAL_ERROR", "Error interno del servidor");
        }
    }

    public async Task<SelectContextResponse> SelectContextAsync(SelectContextRequest request)
    {
        // Get membership with related data
        var membership = await _repository.GetMembershipAsync(request.UserId, request.TenantId);

        if (membership == null || membership.Tenant == null || membership.Role == null || !membership.IsActive)
        {
            throw new InvalidOperationException("Invalid tenant context selection");
        }

        var user = await _repository.GetUserByIdAsync(request.UserId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        // Generate JWT access token with claims
        var accessToken = await _tokenManagement.GenerateAccessTokenAsync(user, membership.Tenant, membership);
        
        // Generate refresh token
        var refreshTokenValue = _tokenManagement.GenerateRefreshToken();

        // Create refresh token entity
        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            TenantId = request.TenantId,
            Token = refreshTokenValue,
            DeviceId = request.DeviceId,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };
        await _repository.AddRefreshTokenAsync(refreshToken);

        // Create session
        var session = new Session
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            TenantId = request.TenantId,
            SessionToken = Guid.NewGuid().ToString("N"),
            RefreshTokenId = refreshToken.Id,
            DeviceId = request.DeviceId,
            IpAddress = request.IpAddress,
            UserAgent = request.UserAgent,
            CreatedAt = DateTime.UtcNow,
            LastActivityAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(8) // 8 hours session
        };
        await _repository.AddSessionAsync(session);

        await _repository.SaveChangesAsync();

        _logger.LogInformation("Context selected - UserId: {UserId}, TenantId: {TenantId}", request.UserId, request.TenantId);
        await LogAuditEventAsync(request.UserId, request.TenantId, "context_selected", "success", 
            $"Selected tenant: {membership.Tenant.Name}", request.IpAddress, request.UserAgent);

        // Publish context selection event
        await _eventPublisher.PublishAsync(new TenantContextSelectedEvent
        {
            UserId = request.UserId,
            TenantId = request.TenantId,
            RoleId = membership.RoleId ?? Guid.Empty,
            SessionId = session.Id,
            OccurredAt = DateTime.UtcNow
        });

        return new SelectContextResponse
        {
            UserId = request.UserId,
            TenantId = request.TenantId,
            TenantCode = membership.Tenant.Code,
            TenantName = membership.Tenant.Name,
            RoleName = membership.Role.Name,
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddHours(8),
            SessionId = session.Id
        };
    }

    public async Task<bool> ValidateCredentialsAsync(string email, string password)
    {
        var user = await _repository.GetUserByEmailAsync(email);

        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            return false;

        return _passwordHasher.VerifyPassword(password, user.PasswordHash);
    }

    public async Task LogoutAsync(Guid userId, Guid? sessionId = null)
    {
        if (sessionId.HasValue)
        {
            // Revoke specific session
            var session = await _repository.GetSessionByIdAsync(sessionId.Value);

            if (session != null && session.UserId == userId)
            {
                session.RevokedAt = DateTime.UtcNow;
                await _repository.UpdateSessionAsync(session);
                _logger.LogInformation("Session revoked - SessionId: {SessionId}", sessionId.Value);
            }
        }
        else
        {
            // Revoke all active sessions for user
            var sessions = await _repository.GetUserSessionsAsync(userId);

            foreach (var session in sessions.Where(s => s.RevokedAt == null))
            {
                session.RevokedAt = DateTime.UtcNow;
                await _repository.UpdateSessionAsync(session);
            }

            _logger.LogInformation("All sessions revoked for user - UserId: {UserId}", userId);
        }

        await _repository.SaveChangesAsync();
        await LogAuditEventAsync(userId, null, "logout", "success", "User logged out", null, null);
    }

    private async Task LogAuditEventAsync(
        Guid? userId, 
        Guid? tenantId, 
        string eventName, 
        string result, 
        string details,
        string? ipAddress,
        string? userAgent)
    {
        var auditLog = new AuditLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TenantId = tenantId,
            Event = eventName,
            Result = result,
            Details = $"{{\"message\": \"{details}\"}}",
            IpAddress = ipAddress,
            UserAgent = userAgent,
            Timestamp = DateTime.UtcNow
        };

        await _repository.AddAuditLogAsync(auditLog);
        await _repository.SaveChangesAsync();
    }
}
