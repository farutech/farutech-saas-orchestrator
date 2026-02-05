using System;
using Farutech.Orchestrator.Domain.Common;
using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Domain.Entities.Billing;

/// <summary>
/// Relaciona pagos con facturas, permitiendo que un pago cubra múltiples facturas
/// y que una factura sea pagada con múltiples pagos.
/// </summary>
public class InvoicePayment : BaseEntity
{
    /// <summary>
    /// ID de la factura
    /// </summary>
    public Guid InvoiceId { get; set; }

    /// <summary>
    /// ID del pago
    /// </summary>
    public Guid PaymentId { get; set; }

    /// <summary>
    /// Monto aplicado de este pago a esta factura
    /// </summary>
    public decimal Amount { get; set; }

    /// <summary>
    /// Fecha en que se aplicó este pago a la factura
    /// </summary>
    public DateTime AppliedAt { get; set; }

    /// <summary>
    /// Notas específicas para esta aplicación de pago
    /// </summary>
    public string? Notes { get; set; }

    // Navigation properties
    public Invoice Invoice { get; set; } = null!;
    public Payment Payment { get; set; } = null!;
}