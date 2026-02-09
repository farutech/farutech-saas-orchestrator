namespace Farutech.IAM.Domain.Events;

/// <summary>
/// Evento publicado cuando los permisos de un usuario cambian
/// </summary>
public record PermissionChangedEvent
{
    public Guid UserId { get; init; }
    public Guid TenantId { get; init; }
    public string[] AddedPermissions { get; init; } = Array.Empty<string>();
    public string[] RemovedPermissions { get; init; } = Array.Empty<string>();
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}
