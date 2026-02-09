namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Response after context selection with full authentication tokens
/// </summary>
public class SelectContextResponse
{
    public Guid UserId { get; set; }
    public Guid TenantId { get; set; }
    public string TenantCode { get; set; } = string.Empty;
    public string TenantName { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public Guid SessionId { get; set; }
}
