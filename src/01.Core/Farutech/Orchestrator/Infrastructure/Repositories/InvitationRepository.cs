using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Domain.Enums;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Farutech.Orchestrator.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserInvitation entity
/// </summary>
public class InvitationRepository(OrchestratorDbContext dbContext) : IInvitationRepository
{
    private readonly OrchestratorDbContext _dbContext = dbContext;

    /// <inheritdoc />
    public async Task AddAsync(UserInvitation invitation, CancellationToken cancellationToken = default)
    {
        await _dbContext.UserInvitations.AddAsync(invitation, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<UserInvitation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserInvitations
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<UserInvitation?> GetByTokenAsync(Guid token, CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserInvitations
            .FirstOrDefaultAsync(i => i.Token == token, cancellationToken);
    }

    /// <inheritdoc />
    public async Task UpdateAsync(UserInvitation invitation, CancellationToken cancellationToken = default)
    {
        _dbContext.UserInvitations.Update(invitation);
        await Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task DeleteAsync(UserInvitation invitation, CancellationToken cancellationToken = default)
    {
        _dbContext.UserInvitations.Remove(invitation);
        await Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task<IEnumerable<UserInvitation>> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserInvitations
            .Where(i => i.Email == email)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IEnumerable<UserInvitation>> GetPendingByTenantIdAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserInvitations
            .Where(i => i.TargetTenantId == tenantId && i.Status == InvitationStatus.Pending)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<bool> HasPendingInvitationAsync(string email, Guid tenantId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserInvitations
            .AnyAsync(i => i.Email == email && i.TargetTenantId == tenantId && i.Status == InvitationStatus.Pending, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<int> ExpireOldInvitationsAsync(DateTime expirationDate, CancellationToken cancellationToken = default)
    {
        var expiredInvitations = await _dbContext.UserInvitations
            .Where(i => i.Status == InvitationStatus.Pending && i.CreatedAt < expirationDate)
            .ToListAsync(cancellationToken);

        foreach (var invitation in expiredInvitations)
        {
            invitation.Status = InvitationStatus.Expired;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return expiredInvitations.Count;
    }
}