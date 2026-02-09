namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Represents a tenant context available to the user
/// </summary>
public class TenantContextDto
{
    public Guid TenantId { get; set; }
    public string TenantCode { get; set; } = string.Empty;
    public string TenantName { get; set; } = string.Empty;
    public Guid MembershipId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
