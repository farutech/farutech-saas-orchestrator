namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Request to select a tenant context after login
/// </summary>
public class SelectContextRequest
{
    public Guid UserId { get; set; }
    public Guid TenantId { get; set; }
    public string? DeviceId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}
