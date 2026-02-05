using System;
using System.Collections.Generic;
using Farutech.Orchestrator.Domain.Common;
using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Domain.Entities.Billing;

/// <summary>
/// Representa un pago realizado contra una o más facturas.
/// Un pago puede cubrir múltiples facturas (pago parcial de varias).
/// </summary>
public class Payment : BaseEntity
{
    /// <summary>
    /// ID del cliente que realizó el pago
    /// </summary>
    public Guid? CustomerId { get; set; }

    /// <summary>
    /// Número único de referencia del pago
    /// </summary>
    public required string PaymentReference { get; set; }

    /// <summary>
    /// Monto total del pago
    /// </summary>
    public decimal Amount { get; set; }

    /// <summary>
    /// Moneda del pago
    /// </summary>
    public string Currency { get; set; } = "USD";

    /// <summary>
    /// Método de pago utilizado
    /// </summary>
    public PaymentMethod Method { get; set; }

    /// <summary>
    /// Estado del pago
    /// </summary>
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    /// <summary>
    /// Fecha en que se procesó el pago
    /// </summary>
    public DateTime? ProcessedAt { get; set; }

    /// <summary>
    /// ID de transacción de la pasarela de pago
    /// </summary>
    public string? GatewayTransactionId { get; set; }

    /// <summary>
    /// Referencia externa adicional (opcional)
    /// </summary>
    public string? ExternalReference { get; set; }

    /// <summary>
    /// Notas adicionales sobre el pago
    /// </summary>
    public string? Notes { get; set; }

    /// <summary>
    /// Información adicional en formato JSON (detalles de la pasarela, etc.)
    /// </summary>
    public string? Metadata { get; set; }

    // Navigation properties
    public Customer? Customer { get; set; }
    public ICollection<InvoicePayment> InvoicePayments { get; set; } = [];

    // Helper methods
    /// <summary>
    /// Marca el pago como completado
    /// </summary>
    public void MarkAsCompleted()
    {
        Status = PaymentStatus.Completed;
        ProcessedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Marca el pago como fallido
    /// </summary>
    public void MarkAsFailed(string? reason = null)
    {
        Status = PaymentStatus.Failed;
        Notes = reason ?? "Payment failed";
    }

    /// <summary>
    /// Obtiene el monto total aplicado a facturas
    /// </summary>
    public decimal GetAppliedAmount() => InvoicePayments.Sum(ip => ip.Amount);
}

/// <summary>
/// Métodos de pago disponibles
/// </summary>
public enum PaymentMethod
{
    /// <summary>
    /// Tarjeta de crédito
    /// </summary>
    CreditCard = 0,

    /// <summary>
    /// Tarjeta de débito
    /// </summary>
    DebitCard = 1,

    /// <summary>
    /// Transferencia bancaria
    /// </summary>
    BankTransfer = 2,

    /// <summary>
    /// PayPal
    /// </summary>
    PayPal = 3,

    /// <summary>
    /// Stripe
    /// </summary>
    Stripe = 4,

    /// <summary>
    /// MercadoPago
    /// </summary>
    MercadoPago = 5,

    /// <summary>
    /// Efectivo
    /// </summary>
    Cash = 6,

    /// <summary>
    /// Cheque
    /// </summary>
    Check = 7,

    /// <summary>
    /// Otro método
    /// </summary>
    Other = 8
}

/// <summary>
/// Estados posibles de un pago
/// </summary>
public enum PaymentStatus
{
    /// <summary>
    /// Pendiente de procesamiento
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Procesando
    /// </summary>
    Processing = 1,

    /// <summary>
    /// Completado exitosamente
    /// </summary>
    Completed = 2,

    /// <summary>
    /// Fallido
    /// </summary>
    Failed = 3,

    /// <summary>
    /// Reembolsado
    /// </summary>
    Refunded = 4,

    /// <summary>
    /// Cancelado
    /// </summary>
    Cancelled = 5
}