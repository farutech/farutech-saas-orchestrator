using System;
using System.Collections.Generic;
using Farutech.Orchestrator.Domain.Common;
using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Domain.Entities.Billing;

/// <summary>
/// Representa una factura emitida a un cliente por servicios prestados.
/// Las facturas pueden ser generadas automáticamente por suscripciones o manualmente.
/// </summary>
public class Invoice : BaseEntity
{
    /// <summary>
    /// ID del cliente al que se emite la factura
    /// </summary>
    public Guid CustomerId { get; set; }

    /// <summary>
    /// Número único de factura (generado automáticamente)
    /// Formato: INV-{YYYY}-{NNNNN} ej: INV-2024-00001
    /// </summary>
    public required string InvoiceNumber { get; set; }

    /// <summary>
    /// Fecha de emisión de la factura
    /// </summary>
    public DateTime IssueDate { get; set; }

    /// <summary>
    /// Fecha de vencimiento de la factura
    /// </summary>
    public DateTime DueDate { get; set; }

    /// <summary>
    /// Estado actual de la factura
    /// </summary>
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;

    /// <summary>
    /// Moneda de la factura (ej: "USD", "EUR", "COP")
    /// </summary>
    public string Currency { get; set; } = "USD";

    /// <summary>
    /// Subtotal antes de impuestos y descuentos
    /// </summary>
    public decimal Subtotal { get; set; }

    /// <summary>
    /// Descuento aplicado a la factura
    /// </summary>
    public decimal Discount { get; set; }

    /// <summary>
    /// Impuestos aplicados (IVA, etc.)
    /// </summary>
    public decimal TaxAmount { get; set; }

    /// <summary>
    /// Total final de la factura (Subtotal - Discount + TaxAmount)
    /// </summary>
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Monto total pagado hasta la fecha
    /// </summary>
    public decimal PaidAmount { get; set; }

    /// <summary>
    /// Saldo pendiente de pago (TotalAmount - PaidAmount)
    /// </summary>
    public decimal Balance => TotalAmount - PaidAmount;

    /// <summary>
    /// Notas adicionales para el cliente
    /// </summary>
    public string? Notes { get; set; }

    /// <summary>
    /// Términos y condiciones de pago
    /// </summary>
    public string? Terms { get; set; }

    /// <summary>
    /// Fecha en que se marcó como pagada (si aplica)
    /// </summary>
    public DateTime? PaidAt { get; set; }

    /// <summary>
    /// Método de pago utilizado (si se registró)
    /// </summary>
    public string? PaymentMethod { get; set; }

    /// <summary>
    /// Referencia externa (ID de transacción de pasarela de pago)
    /// </summary>
    public string? ExternalReference { get; set; }

    // Navigation properties
    public Customer Customer { get; set; } = null!;
    public ICollection<InvoiceItem> Items { get; set; } = [];
    public ICollection<Payment> Payments { get; set; } = [];

    // Helper methods
    /// <summary>
    /// Calcula el total de la factura basado en los items
    /// </summary>
    public void CalculateTotals()
    {
        Subtotal = Items.Sum(item => item.TotalPrice);
        TotalAmount = Subtotal - Discount + TaxAmount;
    }

    /// <summary>
    /// Verifica si la factura está vencida
    /// </summary>
    public bool IsOverdue() => Status != InvoiceStatus.Paid && DueDate < DateTime.UtcNow;

    /// <summary>
    /// Obtiene el saldo pendiente de pago
    /// </summary>
    public decimal GetPendingAmount() => TotalAmount - Payments.Sum(p => p.Amount);
}

/// <summary>
/// Estados posibles de una factura
/// </summary>
public enum InvoiceStatus
{
    /// <summary>
    /// Borrador - aún no emitida
    /// </summary>
    Draft = 0,

    /// <summary>
    /// Emitida y enviada al cliente
    /// </summary>
    Sent = 1,

    /// <summary>
    /// Parcialmente pagada
    /// </summary>
    PartiallyPaid = 2,

    /// <summary>
    /// Completamente pagada
    /// </summary>
    Paid = 3,

    /// <summary>
    /// Vencida (no pagada en fecha límite)
    /// </summary>
    Overdue = 4,

    /// <summary>
    /// Cancelada
    /// </summary>
    Cancelled = 5,

    /// <summary>
    /// Reembolsada
    /// </summary>
    Refunded = 6
}