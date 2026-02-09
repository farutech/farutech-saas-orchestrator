namespace Farutech.IAM.Domain.Events;

/// <summary>
/// Evento publicado cuando un usuario selecciona un contexto de tenant
/// </summary>
public record TenantContextSelectedEvent
{
    public Guid UserId { get; init; }
    public Guid TenantId { get; init; }
    public Guid RoleId { get; init; }
    public Guid SessionId { get; init; }
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
}
