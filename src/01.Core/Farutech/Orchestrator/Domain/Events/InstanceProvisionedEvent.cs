namespace Farutech.Orchestrator.Domain.Events;

/// <summary>
/// Evento publicado cuando una nueva instancia de tenant es provisionada
/// </summary>
public class InstanceProvisionedEvent
{
    /// <summary>
    /// ID del cliente
    /// </summary>
    public Guid CustomerId { get; set; }

    /// <summary>
    /// ID del tenant
    /// </summary>
    public Guid TenantId { get; set; }

    /// <summary>
    /// ID del usuario Owner que debe ser replicado
    /// </summary>
    public Guid OwnerId { get; set; }

    /// <summary>
    /// Email del Owner
    /// </summary>
    public string OwnerEmail { get; set; } = string.Empty;

    /// <summary>
    /// Nombre completo del Owner
    /// </summary>
    public string OwnerFullName { get; set; } = string.Empty;

    /// <summary>
    /// Indica si esta instancia usa DB dedicada
    /// </summary>
    public bool IsDedicated { get; set; }

    /// <summary>
    /// Identificador de la organización (solo para instancias dedicadas)
    /// </summary>
    public string? OrgIdentifier { get; set; }

    /// <summary>
    /// Nombre de la instancia
    /// </summary>
    public string InstanceName { get; set; } = string.Empty;

    /// <summary>
    /// IDs de las features activas para esta instancia
    /// </summary>
    public List<Guid> ActiveFeatureIds { get; set; } = [];

    /// <summary>
    /// Timestamp del evento
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
