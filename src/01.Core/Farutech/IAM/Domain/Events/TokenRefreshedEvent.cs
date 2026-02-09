namespace Farutech.IAM.Domain.Events;

/// <summary>
/// Evento publicado cuando un token se renueva
/// </summary>
public record TokenRefreshedEvent
{
    public Guid UserId { get; init; }
    public Guid SessionId { get; init; }
    public string IpAddress { get; init; } = string.Empty;
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}
