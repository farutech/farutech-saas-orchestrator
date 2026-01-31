using System;
using Farutech.Apps.Ordeon.Domain.Common;

namespace Farutech.Apps.Ordeon.Domain.Aggregates.Documents;

public enum TransactionType
{
    StockIn,
    StockOut,
    CashIn,
    CashOut,
    Accounting
}

/// <summary>
/// Registro de transacciones denormalizadas para gestión y reportes rápidos.
/// Se puede reconstruir a partir de los documentos originales.
/// </summary>
public sealed class TransactionRegistry : Entity
{
    public Guid DocumentHeaderId { get; private set; }
    public Guid? ItemId { get; private set; }
    public decimal Quantity { get; private set; }
    public decimal Value { get; private set; }
    public TransactionType Type { get; private set; }
    public DateTime TransactionDate { get; private set; }
    public Guid? WarehouseId { get; private set; }

    private TransactionRegistry(Guid documentId, Guid? itemId, decimal quantity, decimal value, TransactionType type, DateTime date, Guid? warehouseId)
    {
        DocumentHeaderId = documentId;
        ItemId = itemId;
        Quantity = quantity;
        Value = value;
        Type = type;
        TransactionDate = date;
        WarehouseId = warehouseId;
    }

    public static TransactionRegistry Create(Guid documentId, Guid? itemId, decimal quantity, decimal value, TransactionType type, DateTime date, Guid? warehouseId)
        => new(documentId, itemId, quantity, value, type, date, warehouseId);
}

