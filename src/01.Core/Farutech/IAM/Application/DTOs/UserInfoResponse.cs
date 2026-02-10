namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Secure user information response (without sensitive data)
/// </summary>
public class UserInfoResponse
{
    /// <summary>
    /// Public user identifier (encrypted, not the internal GUID)
    /// </summary>
    public string PublicId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool EmailConfirmed { get; set; }
    public bool PhoneConfirmed { get; set; }
    public bool TwoFactorEnabled { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Current context information from token
/// </summary>
public class CurrentContextResponse
{
    /// <summary>
    /// Public user identifier (encrypted, not the internal GUID)
    /// </summary>
    public string PublicUserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    /// <summary>
    /// Public tenant identifier (encrypted, not the internal GUID)
    /// </summary>
    public string PublicTenantId { get; set; } = string.Empty;
    public string TenantCode { get; set; } = string.Empty;
    public string TenantName { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    /// <summary>
    /// Permission names only (no IDs exposed)
    /// </summary>
    public List<string> Permissions { get; set; } = new();
}
