namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Servicio para sincronizar tenants entre Orchestrator e IAM
/// </summary>
public interface ITenantSyncService
{
    /// <summary>
    /// Crea tenant correspondiente en IAM cuando se crea customer en Orchestrator
    /// </summary>
    Task<bool> CreateTenantInIamAsync(Domain.Entities.Tenants.Customer customer, Guid ownerUserId);

    /// <summary>
    /// Actualiza tenant en IAM cuando se modifica customer
    /// </summary>
    Task<bool> UpdateTenantInIamAsync(Domain.Entities.Tenants.Customer customer);

    /// <summary>
    /// Desactiva tenant en IAM cuando se desactiva customer
    /// </summary>
    Task<bool> DeactivateTenantInIamAsync(Domain.Entities.Tenants.Customer customer);
}