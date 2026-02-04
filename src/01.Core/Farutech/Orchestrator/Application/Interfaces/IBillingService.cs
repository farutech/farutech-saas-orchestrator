using Farutech.Orchestrator.Application.DTOs.Billing;

using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Servicio para gestión de facturación y suscripciones
/// </summary>
public interface IBillingService
{
    /// <summary>
    /// Obtiene el estado de facturación de una organización
    /// </summary>
    Task<BillingStatusDto?> GetBillingStatusAsync(Guid organizationId);

    /// <summary>
    /// Actualiza el plan de una suscripción
    /// </summary>
    Task<ServiceResult> UpgradeSubscriptionAsync(Guid subscriptionId, Guid newPlanId, Guid userId);

    /// <summary>
    /// Obtiene el historial de facturas de una organización
    /// </summary>
    Task<IEnumerable<InvoiceDto>> GetInvoicesAsync(Guid organizationId);
}