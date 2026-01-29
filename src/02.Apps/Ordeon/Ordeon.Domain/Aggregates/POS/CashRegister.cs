using System;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.POS;

/// <summary>
/// Representa una caja física en un punto de venta.
/// </summary>
public sealed class CashRegister : Entity, IAggregateRoot
{
    public string Name { get; private set; }
    public string Code { get; private set; }
    public Guid WarehouseId { get; private set; } // Ubicación física
    public bool IsActive { get; private set; }

    private CashRegister(string name, string code, Guid warehouseId)
    {
        Name = name;
        Code = code.ToUpperInvariant();
        WarehouseId = warehouseId;
        IsActive = true;
    }

    public static CashRegister Create(string name, string code, Guid warehouseId)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");
        if (code.Length > 10) throw new ArgumentException("Code cannot exceed 10 characters");

        return new CashRegister(name, code, warehouseId);
    }
}
