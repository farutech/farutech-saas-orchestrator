using Farutech.IAM.Domain.Enums;

namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Request to create a new session
/// </summary>
public class CreateSessionRequest
{
    public Guid UserId { get; set; }
    public Guid TenantId { get; set; }
    public string? DeviceId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public SessionType SessionType { get; set; } = SessionType.Normal;
    public Guid? RefreshTokenId { get; set; }
}

