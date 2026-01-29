using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Repository interface for UserInvitation entity operations
/// </summary>
public interface IInvitationRepository
{
    /// <summary>
    /// Adds a new invitation
    /// </summary>
    Task AddAsync(UserInvitation invitation, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets an invitation by ID
    /// </summary>
    Task<UserInvitation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets an invitation by token
    /// </summary>
    Task<UserInvitation?> GetByTokenAsync(Guid token, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing invitation
    /// </summary>
    Task UpdateAsync(UserInvitation invitation, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes an invitation
    /// </summary>
    Task DeleteAsync(UserInvitation invitation, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets invitations by email
    /// </summary>
    Task<IEnumerable<UserInvitation>> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets pending invitations for a tenant
    /// </summary>
    Task<IEnumerable<UserInvitation>> GetPendingByTenantIdAsync(Guid tenantId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if an email already has a pending invitation for a tenant
    /// </summary>
    Task<bool> HasPendingInvitationAsync(string email, Guid tenantId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Expires old invitations
    /// </summary>
    Task<int> ExpireOldInvitationsAsync(DateTime expirationDate, CancellationToken cancellationToken = default);
}