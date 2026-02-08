using System;
using System.Collections.Generic;
using Farutech.Apps.Ordeon.Domain.Common;

namespace Farutech.Apps.Ordeon.Domain.Aggregates.Documents;

public enum DocumentStatus
{
    Draft,
    Active,
    Cancelled,
    Refunded
}

/// <summary>
/// Cabecera genérica para cualquier documento transaccional (Venta, Compra, Mov. Inventario).
/// </summary>
public sealed class DocumentHeader : Entity, IAggregateRoot
{
    private readonly List<DocumentLine> _lines = [];

    public Guid DocumentDefinitionId { get; private set; }
    public string DocumentNumber { get; private set; }
    public DateTime Date { get; private set; }
    public DocumentStatus Status { get; private set; }
    public Guid? WarehouseId { get; private set; }
    public Guid? ThirdPartyId { get; private set; } // Cliente o Proveedor
    public Guid CreatedBy { get; private set; }
    
    public decimal TotalAmount { get; private set; }
    public decimal TotalTax { get; private set; }
    public decimal TotalDiscount { get; private set; }

    public IReadOnlyCollection<DocumentLine> Lines => _lines.AsReadOnly();

    private DocumentHeader(Guid definitionId, string number, Guid? warehouseId, Guid? thirdPartyId, Guid createdBy)
    {
        DocumentDefinitionId = definitionId;
        DocumentNumber = number.ToUpperInvariant();
        Date = DateTime.UtcNow;
        Status = DocumentStatus.Draft;
        WarehouseId = warehouseId;
        ThirdPartyId = thirdPartyId;
        CreatedBy = createdBy;
    }

    public static DocumentHeader Create(Guid definitionId, string number, Guid? warehouseId, Guid? thirdPartyId, Guid createdBy)
    {
        if (string.IsNullOrWhiteSpace(number)) throw new ArgumentException("Number is required");
        return new DocumentHeader(definitionId, number, warehouseId, thirdPartyId, createdBy);
    }

    public void AddLine(Guid itemId, string itemName, decimal quantity, decimal unitPrice, decimal taxRate = 0, decimal discountAmount = 0)
    {
        if (Status != DocumentStatus.Draft)
            throw new InvalidOperationException("Cannot add lines to a non-draft document");

        var line = DocumentLine.Create(Id, itemId, itemName, quantity, unitPrice, taxRate, discountAmount);
        _lines.Add(line);
        RecalculateTotals();
    }

    private void RecalculateTotals()
    {
        TotalAmount = 0;
        TotalTax = 0;
        TotalDiscount = 0;

        foreach (var line in _lines)
        {
            TotalAmount += line.Total;
            TotalTax += line.TaxAmount;
            TotalDiscount += line.DiscountAmount;
        }
    }

    public void Activate()
    {
        if (_lines.Count == 0) throw new InvalidOperationException("Document must have at least one line");
        Status = DocumentStatus.Active;
        MarkAsUpdated();
    }

    public void Cancel()
    {
        Status = DocumentStatus.Cancelled;
        MarkAsUpdated();
    }
}

