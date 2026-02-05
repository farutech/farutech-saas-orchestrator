using Farutech.Orchestrator.Application.DTOs.Billing;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Interfaz para el servicio de facturación
/// </summary>
public interface IBillingService
{
    /// <summary>
    /// Crea una nueva factura para un cliente
    /// </summary>
    Task<CreateInvoiceResponse> CreateInvoiceAsync(CreateInvoiceRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene los detalles de una factura por ID
    /// </summary>
    Task<InvoiceDetailsDto?> GetInvoiceByIdAsync(Guid invoiceId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene todas las facturas de un cliente
    /// </summary>
    Task<IEnumerable<InvoiceSummaryDto>> GetInvoicesByCustomerAsync(Guid customerId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Actualiza el estado de una factura
    /// </summary>
    Task<bool> UpdateInvoiceStatusAsync(Guid invoiceId, string status, CancellationToken cancellationToken = default);

    /// <summary>
    /// Registra un nuevo pago
    /// </summary>
    Task<CreatePaymentResponse> CreatePaymentAsync(CreatePaymentRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene los pagos de un cliente
    /// </summary>
    Task<IEnumerable<PaymentDto>> GetPaymentsByCustomerAsync(Guid customerId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Calcula el total adeudado por un cliente
    /// </summary>
    Task<decimal> GetCustomerBalanceAsync(Guid customerId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Genera facturas automáticamente para suscripciones activas
    /// </summary>
    Task<int> GenerateSubscriptionInvoicesAsync(DateTime billingDate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene métricas de facturación para un período
    /// </summary>
    Task<BillingMetricsDto> GetBillingMetricsAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
}