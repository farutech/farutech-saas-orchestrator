namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Response after context selection with full authentication tokens
/// </summary>
public class SelectContextResponse
{
    /// <summary>
    /// Public user identifier (encrypted, not the internal GUID)
    /// </summary>
    public string PublicUserId { get; set; } = string.Empty;
    /// <summary>
    /// Public tenant identifier (encrypted, not the internal GUID)
    /// </summary>
    public string PublicTenantId { get; set; } = string.Empty;
    public string TenantCode { get; set; } = string.Empty;
    public string TenantName { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    /// <summary>
    /// Public session identifier (encrypted, not the internal GUID)
    /// </summary>
    public string PublicSessionId { get; set; } = string.Empty;
}
