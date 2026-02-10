namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Represents a tenant context available to the user
/// </summary>
public class TenantContextDto
{
    /// <summary>
    /// Public tenant identifier (encrypted, not the internal GUID)
    /// </summary>
    public string PublicTenantId { get; set; } = string.Empty;
    public string TenantCode { get; set; } = string.Empty;
    public string TenantName { get; set; } = string.Empty;
    /// <summary>
    /// Public membership identifier (encrypted, not the internal GUID)
    /// </summary>
    public string PublicMembershipId { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
