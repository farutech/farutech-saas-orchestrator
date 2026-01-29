using System;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.Documents;

/// <summary>
/// Cuerpo (línea) de un documento transaccional.
/// </summary>
public sealed class DocumentLine : Entity
{
    public Guid DocumentHeaderId { get; private set; }
    public Guid ItemId { get; private set; }
    public string ItemName { get; private set; }
    public decimal Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public decimal TaxRate { get; private set; } // Porcentaje ej: 19
    public decimal DiscountAmount { get; private set; }
    
    public decimal Subtotal => Quantity * UnitPrice;
    public decimal TaxAmount => Subtotal * (TaxRate / 100);
    public decimal Total => Subtotal + TaxAmount - DiscountAmount;

    private DocumentLine(Guid headerId, Guid itemId, string itemName, decimal quantity, decimal unitPrice, decimal taxRate, decimal discountAmount)
    {
        DocumentHeaderId = headerId;
        ItemId = itemId;
        ItemName = itemName;
        Quantity = quantity;
        UnitPrice = unitPrice;
        TaxRate = taxRate;
        DiscountAmount = discountAmount;
    }

    public static DocumentLine Create(Guid headerId, Guid itemId, string itemName, decimal quantity, decimal unitPrice, decimal taxRate, decimal discountAmount)
    {
        return new DocumentLine(headerId, itemId, itemName, quantity, unitPrice, taxRate, discountAmount);
    }
}
