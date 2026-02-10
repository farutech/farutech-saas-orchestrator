using Farutech.IAM.Application.DTOs;

namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Service for logging security events and auditing
/// </summary>
public interface ISecurityAuditService
{
    /// <summary>
    /// Log a security event
    /// </summary>
    Task LogEventAsync(SecurityEventDto eventDto);

    /// <summary>
    /// Log successful authentication
    /// </summary>
    Task LogAuthenticationSuccessAsync(Guid userId, string ipAddress, string userAgent, string deviceId);

    /// <summary>
    /// Log failed authentication attempt
    /// </summary>
    Task LogAuthenticationFailureAsync(string email, string ipAddress, string userAgent, string reason);

    /// <summary>
    /// Log password change
    /// </summary>
    Task LogPasswordChangeAsync(Guid userId, string ipAddress, string userAgent);

    /// <summary>
    /// Log new device detection
    /// </summary>
    Task LogNewDeviceAsync(Guid userId, string deviceId, string ipAddress, string userAgent);

    /// <summary>
    /// Log session creation
    /// </summary>
    Task LogSessionCreatedAsync(Guid sessionId, Guid userId, string ipAddress, string sessionType);

    /// <summary>
    /// Log session termination
    /// </summary>
    Task LogSessionTerminatedAsync(Guid sessionId, Guid userId, string reason);

    /// <summary>
    /// Log permission granted
    /// </summary>
    Task LogPermissionGrantedAsync(Guid userId, Guid tenantId, string permission, Guid grantedBy);

    /// <summary>
    /// Log suspicious activity
    /// </summary>
    Task LogSuspiciousActivityAsync(Guid? userId, string activityType, string ipAddress, string details);

    /// <summary>
    /// Get security events for a user
    /// </summary>
    Task<List<SecurityEventDto>> GetUserSecurityEventsAsync(Guid userId, int pageSize = 50, int pageNumber = 1);
    
    /// <summary>
    /// Get security events for a user by public ID (with pagination)
    /// </summary>
    Task<List<SecurityEventDto>> GetUserEventsAsync(string publicUserId, int page, int pageSize);

    /// <summary>
    /// Get security events for a tenant
    /// </summary>
    Task<List<SecurityEventDto>> GetTenantSecurityEventsAsync(Guid tenantId, int pageSize = 50, int pageNumber = 1);
}
