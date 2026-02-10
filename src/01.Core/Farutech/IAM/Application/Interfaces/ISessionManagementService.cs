namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Service for managing user sessions
/// </summary>
public interface ISessionManagementService
{
    /// <summary>
    /// Create a new session for a user
    /// </summary>
    Task<Guid> CreateSessionAsync(Guid userId, Guid tenantId, string sessionType, string ipAddress, string userAgent, Guid? deviceId = null);

    /// <summary>
    /// Get all active sessions for a user
    /// </summary>
    Task<List<Domain.Entities.Session>> GetActiveSessionsAsync(Guid userId);
    
    /// <summary>
    /// Get all active sessions for a user (alias)
    /// </summary>
    Task<List<Domain.Entities.Session>> GetUserActiveSessionsAsync(Guid userId);

    /// <summary>
    /// Get session by ID
    /// </summary>
    Task<Domain.Entities.Session?> GetSessionAsync(Guid sessionId);

    /// <summary>
    /// Revoke a specific session
    /// </summary>
    Task RevokeSessionAsync(Guid sessionId, string reason);

    /// <summary>
    /// Revoke all sessions except current
    /// </summary>
    Task RevokeOtherSessionsAsync(Guid userId, Guid currentSessionId);

    /// <summary>
    /// Revoke all sessions for a user
    /// </summary>
    Task RevokeAllUserSessionsAsync(Guid userId, string reason);

    /// <summary>
    /// Update session activity timestamp
    /// </summary>
    Task UpdateSessionActivityAsync(Guid sessionId);

    /// <summary>
    /// Check if session should be expired due to inactivity
    /// </summary>
    Task<bool> IsSessionInactiveAsync(Guid sessionId, int inactivityTimeoutSeconds);

    /// <summary>
    /// Clean up expired sessions
    /// </summary>
    Task CleanupExpiredSessionsAsync();

    /// <summary>
    /// Enforce session limits (max concurrent sessions)
    /// </summary>
    Task EnforceSessionLimitsAsync(Guid userId, int maxSessions);
}
