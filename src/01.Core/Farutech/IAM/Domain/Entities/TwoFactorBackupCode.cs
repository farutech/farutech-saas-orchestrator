namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Two-factor authentication backup codes
/// </summary>
public class TwoFactorBackupCode
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string CodeHash { get; set; } = string.Empty;
    public DateTime? UsedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }

    // Computed
    public bool IsUsed => UsedAt.HasValue;
}