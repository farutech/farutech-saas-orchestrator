using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Farutech.IAM.Application.DTOs;
using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Farutech.IAM.Application.Services;

/// <summary>
/// Service for security event auditing and logging
/// </summary>
public class SecurityAuditService : ISecurityAuditService
{
    private readonly IIamRepository _repository;
    private readonly IPublicIdService _publicIdService;
    private readonly ILogger<SecurityAuditService> _logger;

    public SecurityAuditService(
        IIamRepository repository,
        IPublicIdService publicIdService,
        ILogger<SecurityAuditService> logger)
    {
        _repository = repository;
        _publicIdService = publicIdService;
        _logger = logger;
    }

    public async Task LogEventAsync(SecurityEventDto eventDto)
    {
        try
        {
            Guid? userId = null;
            if (!string.IsNullOrEmpty(eventDto.PublicUserId))
            {
                userId = _publicIdService.FromPublicId(eventDto.PublicUserId);
            }

            var securityEvent = new SecurityEvent
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                AnonymizedUserId = userId.HasValue ? AnonymizeUserId(userId.Value) : null,
                EventType = eventDto.EventType,
                IpAddress = eventDto.IpAddress,
                UserAgent = eventDto.UserAgent,
                OccurredAt = DateTime.UtcNow,
                Success = eventDto.Success,
                Details = eventDto.Details,
                GeoLocation = BuildGeoLocationJson(eventDto.Country, eventDto.City, eventDto.GeoLocation),
                RiskScore = CalculateRiskScore(eventDto)
            };

            await _repository.AddSecurityEventAsync(securityEvent);
            
            _logger.LogInformation(
                "Security event logged: {EventType} for user {AnonymizedUserId} from {IpAddress}",
                securityEvent.EventType,
                securityEvent.AnonymizedUserId ?? "Anonymous",
                securityEvent.IpAddress);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging security event: {EventType}", eventDto.EventType);
        }
    }

    public async Task LogAuthenticationSuccessAsync(Guid userId, string ipAddress, string userAgent, string deviceId)
    {
        var eventDto = new SecurityEventDto
        {
            PublicUserId = _publicIdService.ToPublicId(userId, "User"),
            EventType = SecurityEventTypes.LoginSuccess,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            DeviceId = deviceId,
            Success = true,
            OccurredAt = DateTime.UtcNow
        };

        await LogEventAsync(eventDto);
    }

    public async Task LogAuthenticationFailureAsync(string email, string ipAddress, string userAgent, string reason)
    {
        var eventDto = new SecurityEventDto
        {
            EventType = SecurityEventTypes.LoginFailure,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            Success = false,
            Details = JsonSerializer.Serialize(new { email, reason }),
            OccurredAt = DateTime.UtcNow
        };

        await LogEventAsync(eventDto);

        // Log suspicious activity if multiple failures
        await CheckForSuspiciousLoginPattern(email, ipAddress);
    }

    public async Task LogPasswordChangeAsync(Guid userId, string ipAddress, string userAgent)
    {
        var eventDto = new SecurityEventDto
        {
            PublicUserId = _publicIdService.ToPublicId(userId, "User"),
            EventType = SecurityEventTypes.PasswordChange,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            Success = true,
            OccurredAt = DateTime.UtcNow
        };

        await LogEventAsync(eventDto);
    }

    public async Task LogNewDeviceAsync(Guid userId, string deviceId, string ipAddress, string userAgent)
    {
        var eventDto = new SecurityEventDto
        {
            PublicUserId = _publicIdService.ToPublicId(userId, "User"),
            EventType = SecurityEventTypes.NewDeviceDetected,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            DeviceId = deviceId,
            Success = true,
            OccurredAt = DateTime.UtcNow
        };

        await LogEventAsync(eventDto);
    }

    public async Task LogSessionCreatedAsync(Guid sessionId, Guid userId, string ipAddress, string sessionType)
    {
        var eventDto = new SecurityEventDto
        {
            PublicUserId = _publicIdService.ToPublicId(userId, "User"),
            EventType = SecurityEventTypes.SessionCreated,
            IpAddress = ipAddress,
            Success = true,
            Details = JsonSerializer.Serialize(new { sessionId, sessionType }),
            OccurredAt = DateTime.UtcNow
        };

        await LogEventAsync(eventDto);
    }

    public async Task LogSessionTerminatedAsync(Guid sessionId, Guid userId, string reason)
    {
        var eventDto = new SecurityEventDto
        {
            PublicUserId = _publicIdService.ToPublicId(userId, "User"),
            EventType = SecurityEventTypes.SessionRevoked,
            IpAddress = "System",
            Success = true,
            Details = JsonSerializer.Serialize(new { sessionId, reason }),
            OccurredAt = DateTime.UtcNow
        };

        await LogEventAsync(eventDto);
    }

    public async Task LogPermissionGrantedAsync(Guid userId, Guid tenantId, string permission, Guid grantedBy)
    {
        var eventDto = new SecurityEventDto
        {
            PublicUserId = _publicIdService.ToPublicId(userId, "User"),
            EventType = SecurityEventTypes.PermissionGranted,
            IpAddress = "System",
            Success = true,
            Details = JsonSerializer.Serialize(new { tenantId, permission, grantedBy }),
            OccurredAt = DateTime.UtcNow
        };

        await LogEventAsync(eventDto);
    }

    public async Task LogSuspiciousActivityAsync(Guid? userId, string activityType, string ipAddress, string details)
    {
        var eventDto = new SecurityEventDto
        {
            PublicUserId = userId.HasValue ? _publicIdService.ToPublicId(userId.Value, "User") : null,
            EventType = SecurityEventTypes.SuspiciousActivity,
            IpAddress = ipAddress,
            Success = false,
            Details = JsonSerializer.Serialize(new { activityType, details }),
            OccurredAt = DateTime.UtcNow
        };

        await LogEventAsync(eventDto);

        _logger.LogWarning(
            "Suspicious activity detected: {ActivityType} from {IpAddress}. Details: {Details}",
            activityType,
            ipAddress,
            details);
    }

    public async Task<List<SecurityEventDto>> GetUserSecurityEventsAsync(Guid userId, int pageSize = 50, int pageNumber = 1)
    {
        var events = await _repository.GetSecurityEventsByUserIdAsync(userId, pageSize, pageNumber);
        return MapToSecurityEventDtos(events);
    }
    
    public async Task<List<SecurityEventDto>> GetUserEventsAsync(string publicUserId, int page, int pageSize)
    {
        var userId = _publicIdService.FromPublicId(publicUserId);
        if (!userId.HasValue)
            return new List<SecurityEventDto>();
            
        return await GetUserSecurityEventsAsync(userId.Value, pageSize, page);
    }

    public async Task<List<SecurityEventDto>> GetTenantSecurityEventsAsync(Guid tenantId, int pageSize = 50, int pageNumber = 1)
    {
        var events = await _repository.GetSecurityEventsByTenantIdAsync(tenantId, pageSize, pageNumber);
        return MapToSecurityEventDtos(events);
    }

    #region Private Helper Methods

    private string AnonymizeUserId(Guid userId)
    {
        using var sha256 = SHA256.Create();
        var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(userId.ToString()));
        return Convert.ToBase64String(hash)[..16]; // First 16 characters
    }

    private string BuildGeoLocationJson(string? country, string? city, string? geoLocation)
    {
        if (!string.IsNullOrEmpty(geoLocation))
            return geoLocation;

        if (string.IsNullOrEmpty(country) && string.IsNullOrEmpty(city))
            return "{}";

        return JsonSerializer.Serialize(new { country, city });
    }

    private int CalculateRiskScore(SecurityEventDto eventDto)
    {
        int riskScore = 0;

        // Failed events increase risk
        if (!eventDto.Success)
            riskScore += 30;

        // Certain event types are higher risk
        if (eventDto.EventType == SecurityEventTypes.LoginFailure)
            riskScore += 20;
        else if (eventDto.EventType == SecurityEventTypes.SuspiciousActivity)
            riskScore += 50;
        else if (eventDto.EventType == SecurityEventTypes.NewDeviceDetected)
            riskScore += 15;

        // Unknown location adds risk (simplified - in production use geolocation service)
        if (string.IsNullOrEmpty(eventDto.Country))
            riskScore += 10;

        return Math.Min(riskScore, 100);
    }

    private async Task CheckForSuspiciousLoginPattern(string email, string ipAddress)
    {
        // Get recent failed login attempts for this email/IP
        var recentFailures = await _repository.GetRecentFailedLoginAttemptsAsync(email, ipAddress, TimeSpan.FromMinutes(15));

        if (recentFailures >= 5)
        {
            await LogSuspiciousActivityAsync(
                null,
                "BruteForceAttempt",
                ipAddress,
                $"Multiple failed login attempts for {email}");
        }
    }

    private List<SecurityEventDto> MapToSecurityEventDtos(List<SecurityEvent> events)
    {
        return events.Select(e => new SecurityEventDto
        {
            PublicEventId = _publicIdService.ToPublicId(e.Id, "SecurityEvent"),
            PublicUserId = e.UserId.HasValue ? _publicIdService.ToPublicId(e.UserId.Value, "User") : null,
            EventType = e.EventType,
            IpAddress = e.IpAddress,
            UserAgent = e.UserAgent,
            DeviceId = e.DeviceId?.ToString(),
            OccurredAt = e.OccurredAt,
            Success = e.Success,
            Details = e.Details,
            GeoLocation = e.GeoLocation
        }).ToList();
    }

    #endregion
}
