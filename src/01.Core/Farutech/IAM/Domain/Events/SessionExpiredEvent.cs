namespace Farutech.IAM.Domain.Events;

/// <summary>
/// Evento publicado cuando una sesión expira o es revocada
/// </summary>
public record SessionExpiredEvent
{
    public Guid UserId { get; init; }
    public Guid SessionId { get; init; }
    public string Reason { get; init; } = string.Empty; // 'timeout', 'logout', 'forced'
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}
