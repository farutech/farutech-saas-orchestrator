namespace Farutech.IAM.Domain.Events;

/// <summary>
/// Evento publicado cuando se crea un nuevo tenant
/// </summary>
public record TenantCreatedEvent
{
    public Guid TenantId { get; init; }
    public string TenantCode { get; init; } = string.Empty;
    public string TenantName { get; init; } = string.Empty;
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}
