using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Servicio para gestionar invitaciones de usuarios a empresas.
/// </summary>
public interface IInvitationService
{
    /// <summary>
    /// Invita un usuario a una empresa (tenant).
    /// Si el usuario YA existe: Crea directamente la relación UserCompanyMembership.
    /// Si el usuario NO existe: Crea un registro UserInvitation.
    /// </summary>
    /// <param name="email">Email del usuario a invitar</param>
    /// <param name="tenantId">ID de la empresa (tenant)</param>
    /// <param name="role">Rol que tendrá el usuario (Owner, CompanyAdmin, User)</param>
    /// <param name="invitedBy">ID del usuario que envía la invitación</param>
    /// <param name="expirationDays">Días de validez de la invitación (por defecto 7)</param>
    /// <returns>UserInvitation si se creó invitación, null si se asignó directamente</returns>
    Task<UserInvitation?> InviteUserAsync(
        string email, 
        Guid tenantId, 
        string role, 
        Guid invitedBy, 
        int expirationDays = 7);

    /// <summary>
    /// Acepta una invitación usando el token único.
    /// </summary>
    /// <param name="invitationToken">Token de la invitación</param>
    /// <param name="userId">ID del usuario que acepta (debe coincidir con el email de la invitación)</param>
    /// <returns>True si se aceptó exitosamente, false en caso contrario</returns>
    Task<bool> AcceptInvitationAsync(Guid invitationToken, Guid userId);

    /// <summary>
    /// Obtiene las invitaciones pendientes para un email.
    /// </summary>
    /// <param name="email">Email del usuario</param>
    /// <returns>Lista de invitaciones pendientes</returns>
    Task<List<UserInvitation>> GetPendingInvitationsAsync(string email);

    /// <summary>
    /// Cancela una invitación (solo si está pendiente).
    /// </summary>
    /// <param name="invitationId">ID de la invitación</param>
    /// <param name="cancelledBy">ID del usuario que cancela</param>
    /// <returns>True si se canceló exitosamente</returns>
    Task<bool> CancelInvitationAsync(Guid invitationId, Guid cancelledBy);

    /// <summary>
    /// Marca las invitaciones expiradas automáticamente.
    /// </summary>
    /// <returns>Cantidad de invitaciones expiradas</returns>
    Task<int> ExpireOldInvitationsAsync();
}
