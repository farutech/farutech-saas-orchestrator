using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Domain.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Farutech.IAM.Application.Services;

/// <summary>
/// Service for advanced session management
/// </summary>
public class SessionManagementService : ISessionManagementService
{
    private readonly IIamRepository _repository;
    private readonly ISecurityAuditService _auditService;
    private readonly SessionOptions _sessionOptions;
    private readonly ILogger<SessionManagementService> _logger;

    public SessionManagementService(
        IIamRepository repository,
        ISecurityAuditService auditService,
        IOptions<SessionOptions> sessionOptions,
        ILogger<SessionManagementService> logger)
    {
        _repository = repository;
        _auditService = auditService;
        _sessionOptions = sessionOptions.Value;
        _logger = logger;
    }

    public async Task<Guid> CreateSessionAsync(Guid userId, Guid tenantId, string sessionType, string ipAddress, string userAgent, Guid? deviceId = null)
    {
        // Enforce session limits before creating new session
        await EnforceSessionLimitsAsync(userId, _sessionOptions.MaxConcurrentSessions);

        var expiresAt = CalculateExpiration(sessionType);
        
        var session = new Session
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TenantId = tenantId,
            SessionToken = Guid.NewGuid().ToString("N"),
            IpAddress = ipAddress,
            UserAgent = userAgent,
            DeviceId = deviceId?.ToString() ?? string.Empty,
            SessionType = sessionType.ToString(),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt,
            LastActivityAt = DateTime.UtcNow,
            RevokedAt = null
        };

        await _repository.AddSessionAsync(session);
        await _repository.SaveChangesAsync();

        await _auditService.LogSessionCreatedAsync(session.Id, userId, ipAddress, sessionType);

        _logger.LogInformation("Session created for user {UserId}: Type={SessionType}, Expires={ExpiresAt}", 
            userId, sessionType, expiresAt);

        return session.Id;
    }

    public async Task<List<Session>> GetActiveSessionsAsync(Guid userId)
    {
        var sessions = await _repository.GetUserSessionsAsync(userId);
        return sessions.Where(s => !s.IsExpired && !s.IsRevoked).ToList();
    }    
    public async Task<List<Session>> GetUserActiveSessionsAsync(Guid userId)
    {
        return await GetActiveSessionsAsync(userId);
    }
    public async Task<Session?> GetSessionAsync(Guid sessionId)
    {
        return await _repository.GetSessionByIdAsync(sessionId);
    }

    public async Task RevokeSessionAsync(Guid sessionId, string reason)
    {
        var session = await _repository.GetSessionByIdAsync(sessionId);
        if (session == null || session.IsRevoked)
            return;

        session.RevokedAt = DateTime.UtcNow;
        await _repository.UpdateSessionAsync(session);
        await _repository.SaveChangesAsync();

        await _auditService.LogSessionTerminatedAsync(sessionId, session.UserId, reason);

        _logger.LogInformation("Session {SessionId} revoked. Reason: {Reason}", sessionId, reason);
    }

    public async Task RevokeOtherSessionsAsync(Guid userId, Guid currentSessionId)
    {
        var sessions = await _repository.GetUserSessionsAsync(userId);
        var otherSessions = sessions.Where(s => s.Id != currentSessionId && !s.IsRevoked).ToList();

        foreach (var session in otherSessions)
        {
            session.RevokedAt = DateTime.UtcNow;
            await _repository.UpdateSessionAsync(session);
        }

        await _repository.SaveChangesAsync();

        _logger.LogInformation("Revoked {Count} other sessions for user {UserId}", otherSessions.Count, userId);
    }

    public async Task RevokeAllUserSessionsAsync(Guid userId, string reason)
    {
        await _repository.RevokeAllUserSessionsAsync(userId);
        await _repository.SaveChangesAsync();

        _logger.LogInformation("All sessions revoked for user {UserId}. Reason: {Reason}", userId, reason);
    }

    public async Task UpdateSessionActivityAsync(Guid sessionId)
    {
        var session = await _repository.GetSessionByIdAsync(sessionId);
        if (session == null || session.IsRevoked)
            return;

        session.LastActivityAt = DateTime.UtcNow;
        await _repository.UpdateSessionAsync(session);
        await _repository.SaveChangesAsync();
    }

    public async Task<bool> IsSessionInactiveAsync(Guid sessionId, int inactivityTimeoutSeconds)
    {
        if (inactivityTimeoutSeconds <= 0)
            return false;

        var session = await _repository.GetSessionByIdAsync(sessionId);
        if (session == null)
            return false;

        var inactivityThreshold = DateTime.UtcNow.AddSeconds(-inactivityTimeoutSeconds);
        return session.LastActivityAt < inactivityThreshold;
    }

    public async Task CleanupExpiredSessionsAsync()
    {
        var sessions = await _repository.GetUserSessionsAsync(Guid.Empty); // Get all sessions
        var expiredSessions = sessions.Where(s => s.IsExpired && !s.IsRevoked).ToList();

        foreach (var session in expiredSessions)
        {
            session.RevokedAt = DateTime.UtcNow;
            await _repository.UpdateSessionAsync(session);
        }

        await _repository.SaveChangesAsync();

        _logger.LogInformation("Cleaned up {Count} expired sessions", expiredSessions.Count);
    }

    public async Task EnforceSessionLimitsAsync(Guid userId, int maxSessions)
    {
        var activeSessions = await GetActiveSessionsAsync(userId);
        
        if (activeSessions.Count >= maxSessions)
        {
            // Revoke oldest sessions first
            var sessionsToRevoke = activeSessions
                .OrderBy(s => s.LastActivityAt)
                .Take(activeSessions.Count - maxSessions + 1)
                .ToList();

            foreach (var session in sessionsToRevoke)
            {
                session.RevokedAt = DateTime.UtcNow;
                await _repository.UpdateSessionAsync(session);
            }

            await _repository.SaveChangesAsync();

            _logger.LogInformation("Enforced session limit for user {UserId}: Revoked {Count} old sessions", 
                userId, sessionsToRevoke.Count);
        }
    }

    private DateTime CalculateExpiration(string sessionType)
    {
        return sessionType.ToLower() switch
        {
            "normal" => DateTime.UtcNow.AddSeconds(_sessionOptions.NormalSessionSeconds),
            "extended" => DateTime.UtcNow.AddSeconds(_sessionOptions.ExtendedSessionSeconds),
            "admin" => DateTime.UtcNow.AddSeconds(_sessionOptions.AdminSessionSeconds),
            _ => DateTime.UtcNow.AddSeconds(_sessionOptions.NormalSessionSeconds)
        };
    }
}
