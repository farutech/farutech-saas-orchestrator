using System;
using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Domain.Entities.Billing;

/// <summary>
/// Representa una línea individual en una factura.
/// Cada item describe un servicio o producto facturado.
/// </summary>
public class InvoiceItem : BaseEntity
{
    /// <summary>
    /// ID de la factura a la que pertenece este item
    /// </summary>
    public Guid InvoiceId { get; set; }

    /// <summary>
    /// Descripción del servicio/producto facturado
    /// </summary>
    public required string Description { get; set; }

    /// <summary>
    /// Tipo de item (para categorización)
    /// </summary>
    public InvoiceItemType ItemType { get; set; }

    /// <summary>
    /// ID de referencia del objeto relacionado (ej: SubscriptionId, TenantInstanceId)
    /// </summary>
    public Guid? ReferenceId { get; set; }

    /// <summary>
    /// Código del producto/servicio (para referencia)
    /// </summary>
    public string? ProductCode { get; set; }

    /// <summary>
    /// Cantidad del item
    /// </summary>
    public decimal Quantity { get; set; }

    /// <summary>
    /// Precio unitario
    /// </summary>
    public decimal UnitPrice { get; set; }

    /// <summary>
    /// Descuento aplicado a este item específico
    /// </summary>
    public decimal Discount { get; set; }

    /// <summary>
    /// Precio total del item (Quantity * UnitPrice - Discount)
    /// </summary>
    public decimal TotalPrice { get; set; }

    /// <summary>
    /// Período de facturación (ej: "2024-01", "2024-01-01 to 2024-01-31")
    /// </summary>
    public string? BillingPeriod { get; set; }

    /// <summary>
    /// Notas adicionales específicas para este item
    /// </summary>
    public string? Notes { get; set; }

    // Navigation properties
    // Invoice navigation removed to avoid EF Core shadow property conflict

    // Helper methods
    /// <summary>
    /// Calcula el precio total del item
    /// </summary>
    public void CalculateTotal()
    {
        TotalPrice = (Quantity * UnitPrice) - Discount;
    }
}

/// <summary>
/// Tipos de items que pueden aparecer en una factura
/// </summary>
public enum InvoiceItemType
{
    /// <summary>
    /// Suscripción mensual/anual
    /// </summary>
    Subscription = 0,

    /// <summary>
    /// Cargo único por setup o configuración
    /// </summary>
    SetupFee = 1,

    /// <summary>
    /// Cargo por uso adicional (ej: usuarios extra, almacenamiento)
    /// </summary>
    Usage = 2,

    /// <summary>
    /// Cargo por soporte técnico
    /// </summary>
    Support = 3,

    /// <summary>
    /// Descuento aplicado
    /// </summary>
    Discount = 4,

    /// <summary>
    /// Ajuste o corrección
    /// </summary>
    Adjustment = 5,

    /// <summary>
    /// Otro tipo de cargo
    /// </summary>
    Other = 6
}