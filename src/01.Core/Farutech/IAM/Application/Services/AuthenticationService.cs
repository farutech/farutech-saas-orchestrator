using Farutech.IAM.Application.DTOs;
using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Utilities;
using Farutech.IAM.Domain.Entities;
using Farutech.IAM.Domain.Events;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

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
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthenticationService> _logger;
    private readonly TokenExpirationOptions _tokenExpirationOptions;

    public AuthenticationService(
        IIamRepository repository,
        IPasswordHasher passwordHasher,
        ITokenManagementService tokenManagement,
        IEventPublisher eventPublisher,
        IEmailService emailService,
        ILogger<AuthenticationService> logger,
        IOptions<TokenExpirationOptions> tokenExpirationOptions)
    {
        _repository = repository;
        _passwordHasher = passwordHasher;
        _tokenManagement = tokenManagement;
        _eventPublisher = eventPublisher;
        _emailService = emailService;
        _logger = logger;
        _tokenExpirationOptions = tokenExpirationOptions.Value;
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
    {
        try
        {
            // 1. Check if user already exists
            var existingUser = await _repository.GetUserByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException("USER_EXISTS");
            }

            // 2. Hash password
            var passwordHash = _passwordHasher.HashPassword(request.Password);

            // 3. Create user
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email.ToLowerInvariant(),
                PasswordHash = passwordHash,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                IsActive = true,
                EmailConfirmed = false, // Require email confirmation
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // 4. Find tenant if provided
            Tenant? tenant = null;
            if (!string.IsNullOrEmpty(request.TenantCode))
            {
                tenant = await _repository.GetTenantByCodeAsync(request.TenantCode);
            }

            // 5. Save user
            await _repository.AddUserAsync(user);

            // 6. Create tenant membership if tenant provided
            if (tenant != null)
            {
                // Get default "User" role
                var userRole = await _repository.GetRoleByNameAsync("User");
                
                if (userRole != null)
                {
                    var membership = new TenantMembership
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        TenantId = tenant.Id,
                        RoleId = userRole.Id,
                        CustomAttributes = "{}",
                        IsActive = true,
                        GrantedAt = DateTime.UtcNow,
                        GrantedBy = user.Id // Self-granted
                    };

                    await _repository.AddMembershipAsync(membership);
                }
            }

            await _repository.SaveChangesAsync();

            _logger.LogInformation("User registered successfully - Email: {Email}, UserId: {UserId}", request.Email, user.Id);

            // 7. Send email confirmation
            try
            {
                // Generate email verification token
                var token = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N"); // 64 chars
                var expirationSeconds = _tokenExpirationOptions.EmailVerificationSeconds;
                var expiresAt = DateTime.UtcNow.AddSeconds(expirationSeconds);

                var verificationToken = new EmailVerificationToken
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    Token = token,
                    ExpiresAt = expiresAt,
                    IpAddress = request.IpAddress ?? "unknown",
                    UserAgent = request.UserAgent ?? "unknown",
                    CreatedAt = DateTime.UtcNow
                };

                await _repository.AddEmailVerificationTokenAsync(verificationToken);
                await _repository.SaveChangesAsync();

                var confirmationUrl = $"https://localhost:7001/api/auth/confirm-email?token={token}";
                var expirationText = TimeFormatHelper.FormatSecondsToReadable(expirationSeconds);
                
                await _emailService.SendEmailConfirmationAsync(user.Email, confirmationUrl, user.FirstName);
                _logger.LogInformation("Email confirmation sent to {Email} with token valid for {Expiration}", 
                    user.Email, expirationText);
            }
            catch (Exception emailEx)
            {
                _logger.LogError(emailEx, "Failed to send confirmation email to {Email}", user.Email);
                // No lanzamos la excepción para que el registro se complete
            }

            return new RegisterResponse
            {
                UserId = user.Id,
                Email = user.Email,
                FullName = $"{user.FirstName} {user.LastName}",
                EmailConfirmationRequired = true,
                Message = "Usuario registrado exitosamente. Por favor, confirme su email."
            };
        }
        catch (InvalidOperationException ex) when (ex.Message == "USER_EXISTS")
        {
            _logger.LogWarning("Registration attempt with existing email: {Email}", request.Email);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user - Email: {Email}", request.Email);
            throw;
        }
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
                var contextResponse = await SelectContextAsync(
                    user.Id,
                    availableContexts[0].TenantId,
                    request.DeviceId,
                    request.IpAddress,
                    request.UserAgent
                );
                
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

    public async Task<SelectContextResponse> SelectContextAsync(Guid userId, Guid tenantId, string? deviceId, string? ipAddress, string? userAgent)
    {
        // Get membership with related data
        var membership = await _repository.GetMembershipAsync(userId, tenantId);

        if (membership == null || membership.Tenant == null || membership.Role == null || !membership.IsActive)
        {
            throw new InvalidOperationException("Invalid tenant context selection");
        }

        var user = await _repository.GetUserByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        // Create refresh token first
        var refreshTokenValue = _tokenManagement.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TenantId = tenantId,
            Token = refreshTokenValue,
            DeviceId = deviceId,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };
        await _repository.AddRefreshTokenAsync(refreshToken);

        // Create session
        var session = new Session
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TenantId = tenantId,
            SessionToken = Guid.NewGuid().ToString("N"),
            RefreshTokenId = refreshToken.Id,
            DeviceId = deviceId,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            CreatedAt = DateTime.UtcNow,
            LastActivityAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(8) // 8 hours session
        };
        await _repository.AddSessionAsync(session);

        // Generate JWT access token with claims including session_id
        var accessToken = await _tokenManagement.GenerateAccessTokenAsync(user, membership.Tenant, membership, session, deviceId);
        
        await _repository.SaveChangesAsync();

        _logger.LogInformation("Context selected - UserId: {UserId}, TenantId: {TenantId}", userId, tenantId);
        await LogAuditEventAsync(userId, tenantId, "context_selected", "success", 
            $"Selected tenant: {membership.Tenant.Name}", ipAddress, userAgent);

        // Publish context selection event
        await _eventPublisher.PublishAsync(new TenantContextSelectedEvent
        {
            UserId = userId,
            TenantId = tenantId,
            RoleId = membership.RoleId ?? Guid.Empty,
            SessionId = session.Id,
            OccurredAt = DateTime.UtcNow
        });

        return new SelectContextResponse
        {
            UserId = userId,
            TenantId = tenantId,
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

    public async Task<UserInfoResponse?> GetUserInfoAsync(Guid userId)
    {
        var user = await _repository.GetUserByIdAsync(userId);

        if (user == null)
            return null;

        return new UserInfoResponse
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            FullName = $"{user.FirstName} {user.LastName}",
            PhoneNumber = user.PhoneNumber,
            EmailConfirmed = user.EmailConfirmed,
            PhoneConfirmed = user.PhoneNumberConfirmed,
            TwoFactorEnabled = user.TwoFactorEnabled,
            CreatedAt = user.CreatedAt
        };
    }

    // 🔐 PHASE 3: Email Confirmation Implementation
    public async Task<SendEmailConfirmationResponse> SendEmailConfirmationAsync(Guid userId, string? ipAddress, string? userAgent)
    {
        var user = await _repository.GetUserByIdAsync(userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        if (user.EmailConfirmed)
        {
            return new SendEmailConfirmationResponse
            {
                Success = false,
                Message = "Email already confirmed",
                ExpiresAt = DateTime.UtcNow
            };
        }

        // Generate token
        var token = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N"); // 64 chars
        var expiresAt = DateTime.UtcNow.AddHours(24);

        var verificationToken = new EmailVerificationToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = token,
            ExpiresAt = expiresAt,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddEmailVerificationTokenAsync(verificationToken);
        await _repository.SaveChangesAsync();

        // Send confirmation email
        var confirmationUrl = $"https://app.farutech.com/auth/confirm-email?token={token}";
        await _emailService.SendEmailConfirmationAsync(user.Email, confirmationUrl, user.FullName);

        _logger.LogInformation("Email confirmation sent to user {UserId}", userId);

        return new SendEmailConfirmationResponse
        {
            Success = true,
            Message = "Confirmation email sent successfully",
            ExpiresAt = expiresAt
        };
    }

    public async Task<ConfirmEmailResponse> ConfirmEmailAsync(string token)
    {
        var verificationToken = await _repository.GetEmailVerificationTokenByTokenAsync(token);
        
        if (verificationToken == null || !verificationToken.IsValid)
        {
            return new ConfirmEmailResponse
            {
                Success = false,
                Message = "Invalid or expired token",
                EmailConfirmed = false
            };
        }

        var user = await _repository.GetUserByIdAsync(verificationToken.UserId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        // Mark email as confirmed
        user.EmailConfirmed = true;
        user.UpdatedAt = DateTime.UtcNow;
        verificationToken.UsedAt = DateTime.UtcNow;

        await _repository.UpdateUserAsync(user);
        await _repository.UpdateEmailVerificationTokenAsync(verificationToken);
        await _repository.SaveChangesAsync();

        // Send welcome email
        await _emailService.SendWelcomeEmailAsync(user.Email, user.FullName);

        _logger.LogInformation("Email confirmed for user {UserId}", user.Id);

        return new ConfirmEmailResponse
        {
            Success = true,
            Message = "Email confirmed successfully",
            EmailConfirmed = true
        };
    }

    public async Task<CancelEmailTokenResponse> CancelEmailVerificationTokenAsync(string token, string? email = null)
    {
        try
        {
            var verificationToken = await _repository.GetEmailVerificationTokenByTokenAsync(token);
            
            if (verificationToken == null)
            {
                return new CancelEmailTokenResponse
                {
                    Success = false,
                    Message = "Token not found"
                };
            }

            // Optional: Verify email matches if provided
            if (!string.IsNullOrEmpty(email))
            {
                var user = await _repository.GetUserByIdAsync(verificationToken.UserId);
                if (user == null || !user.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
                {
                    return new CancelEmailTokenResponse
                    {
                        Success = false,
                        Message = "Token does not match the provided email"
                    };
                }
            }

            // Check if already used or expired
            if (verificationToken.UsedAt.HasValue)
            {
                return new CancelEmailTokenResponse
                {
                    Success = false,
                    Message = "Token has already been used"
                };
            }

            if (verificationToken.ExpiresAt < DateTime.UtcNow)
            {
                return new CancelEmailTokenResponse
                {
                    Success = false,
                    Message = "Token has already expired"
                };
            }

            // Mark as cancelled by setting expiration to now (makes IsValid return false)
            verificationToken.ExpiresAt = DateTime.UtcNow.AddSeconds(-1); // Just expired
            
            await _repository.UpdateEmailVerificationTokenAsync(verificationToken);
            await _repository.SaveChangesAsync();

            _logger.LogInformation("Email verification token cancelled: {Token}", token);

            return new CancelEmailTokenResponse
            {
                Success = true,
                Message = "Token cancelled successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling email verification token");
            return new CancelEmailTokenResponse
            {
                Success = false,
                Message = "An error occurred while cancelling the token"
            };
        }
    }

    // 🔐 PHASE 4: Password Reset Implementation
    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request, string? ipAddress, string? userAgent)
    {
        // Always return success to prevent user enumeration
        var response = new ForgotPasswordResponse
        {
            Success = true,
            Message = "If your email is registered, you will receive a password reset link."
        };

        var user = await _repository.GetUserByEmailAsync(request.Email);
        if (user == null)
        {
            _logger.LogWarning("Password reset requested for non-existent email: {Email}", request.Email);
            return response;
        }

        // Generate token
        var token = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
        var expirationSeconds = _tokenExpirationOptions.PasswordResetSeconds;
        var expiresAt = DateTime.UtcNow.AddSeconds(expirationSeconds);

        var resetToken = new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = token,
            ExpiresAt = expiresAt,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddPasswordResetTokenAsync(resetToken);
        await _repository.SaveChangesAsync();

        // Send reset email
        var resetUrl = $"https://app.farutech.com/auth/reset-password?token={token}";
        var expirationText = TimeFormatHelper.FormatSecondsToReadable(expirationSeconds);
        
        await _emailService.SendPasswordResetAsync(user.Email, resetUrl, user.FullName);

        _logger.LogInformation("Password reset email sent to user {UserId}, valid for {Expiration}", 
            user.Id, expirationText);

        return response;
    }

    public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var resetToken = await _repository.GetPasswordResetTokenByTokenAsync(request.Token);
        
        if (resetToken == null || !resetToken.IsValid)
        {
            return new ResetPasswordResponse
            {
                Success = false,
                Message = "Invalid or expired token"
            };
        }

        var user = await _repository.GetUserByIdAsync(resetToken.UserId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        // Update password
        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        user.AccessFailedCount = 0;
        user.LockoutEnd = null;
        resetToken.UsedAt = DateTime.UtcNow;

        await _repository.UpdateUserAsync(user);
        await _repository.UpdatePasswordResetTokenAsync(resetToken);

        // Revoke all sessions and refresh tokens
        await _repository.RevokeAllUserSessionsAsync(user.Id);
        await _repository.RevokeAllUserRefreshTokensAsync(user.Id);
        
        await _repository.SaveChangesAsync();

        // Send notification
        await _emailService.SendPasswordChangedNotificationAsync(user.Email, user.FullName);

        _logger.LogInformation("Password reset for user {UserId}", user.Id);

        return new ResetPasswordResponse
        {
            Success = true,
            Message = "Password reset successfully. Please log in with your new password."
        };
    }

    public async Task<ChangePasswordResponse> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _repository.GetUserByIdAsync(userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        // Verify current password
        if (string.IsNullOrEmpty(user.PasswordHash) || !_passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            return new ChangePasswordResponse
            {
                Success = false,
                Message = "Current password is incorrect"
            };
        }

        // Update password
        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateUserAsync(user);
        await _repository.SaveChangesAsync();

        // Send notification
        await _emailService.SendPasswordChangedNotificationAsync(user.Email, user.FullName);

        _logger.LogInformation("Password changed for user {UserId}", userId);

        return new ChangePasswordResponse
        {
            Success = true,
            Message = "Password changed successfully"
        };
    }

    // 🔐 PHASE 5: Two-Factor Authentication (Stub implementations)
    public Task<Setup2faResponse> Setup2faAsync(Guid userId)
    {
        throw new NotImplementedException("2FA setup will be implemented in next iteration with TotpService");
    }

    public Task<Verify2faSetupResponse> Verify2faSetupAsync(Guid userId, Verify2faSetupRequest request)
    {
        throw new NotImplementedException("2FA verification will be implemented in next iteration with TotpService");
    }

    public Task<Verify2faResponse> Verify2faAsync(Guid userId, Guid sessionId, Verify2faRequest request, string? deviceId, string? ipAddress, string? userAgent)
    {
        throw new NotImplementedException("2FA login verification will be implemented in next iteration");
    }

    public Task<Disable2faResponse> Disable2faAsync(Guid userId, Disable2faRequest request)
    {
        throw new NotImplementedException("2FA disable will be implemented in next iteration");
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
