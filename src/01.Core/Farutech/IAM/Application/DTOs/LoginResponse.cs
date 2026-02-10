namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Response after successful login
/// </summary>
public class LoginResponse
{
    /// <summary>
    /// Public user identifier (encrypted, not the internal GUID)
    /// </summary>
    public string PublicUserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public bool RequiresContextSelection { get; set; }
    public List<TenantContextDto> AvailableContexts { get; set; } = new();
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? ExpiresAt { get; set; }
}
