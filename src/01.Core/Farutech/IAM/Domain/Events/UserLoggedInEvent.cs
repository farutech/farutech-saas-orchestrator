namespace Farutech.IAM.Domain.Events;

/// <summary>
/// Evento publicado cuando un usuario inicia sesión exitosamente
/// </summary>
public record UserLoggedInEvent
{
    public Guid UserId { get; init; }
    public Guid TenantId { get; init; }
    public string Email { get; init; } = string.Empty;
    public string IpAddress { get; init; } = string.Empty;
    public string UserAgent { get; init; } = string.Empty;
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}
