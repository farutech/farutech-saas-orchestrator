using Farutech.Orchestrator.Domain.Common;
using Farutech.Orchestrator.Domain.Enums;

namespace Farutech.Orchestrator.Domain.Entities.Identity;

/// <summary>
/// Representa una invitación de usuario a una empresa (tenant).
/// Permite invitar usuarios que aún no existen en el sistema.
/// </summary>
public class UserInvitation : BaseEntity
{
    /// <summary>
    /// Email del usuario invitado (indexado para búsquedas rápidas).
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// ID de la empresa (tenant) a la que se invita al usuario.
    /// </summary>
    public required Guid TargetTenantId { get; set; }

    /// <summary>
    /// Rol que tendrá el usuario en la empresa (Owner, CompanyAdmin, User).
    /// </summary>
    public required FarutechRole TargetRole { get; set; }

    /// <summary>
    /// Token único de invitación (usado en el link de aceptación).
    /// </summary>
    public required Guid Token { get; set; }

    /// <summary>
    /// Fecha de expiración de la invitación (típicamente 7 días).
    /// </summary>
    public required DateTime ExpirationDate { get; set; }

    /// <summary>
    /// Estado de la invitación.
    /// </summary>
    public required InvitationStatus Status { get; set; }

    /// <summary>
    /// Usuario que envió la invitación.
    /// </summary>
    public required Guid InvitedBy { get; set; }

    /// <summary>
    /// Fecha en la que se aceptó la invitación (null si aún no se aceptó).
    /// </summary>
    public DateTime? AcceptedAt { get; set; }

    /// <summary>
    /// ID del usuario que aceptó la invitación (null si aún no se aceptó).
    /// </summary>
    public Guid? AcceptedByUserId { get; set; }
}

/// <summary>
/// Estados posibles de una invitación.
/// </summary>
public enum InvitationStatus
{
    /// <summary>
    /// Invitación pendiente de aceptación.
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Invitación aceptada por el usuario.
    /// </summary>
    Accepted = 1,

    /// <summary>
    /// Invitación expirada (superó la fecha de expiración).
    /// </summary>
    Expired = 2,

    /// <summary>
    /// Invitación cancelada por el administrador.
    /// </summary>
    Cancelled = 3
}
