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
    public Guid TenantId { get; private set; }
    public bool IsActive { get; private set; }

    private CashRegister(string name, string code, Guid warehouseId, Guid tenantId)
    {
        Name = name;
        Code = code.ToUpperInvariant();
        WarehouseId = warehouseId;
        TenantId = tenantId;
        IsActive = true;
    }

    public static CashRegister Create(string name, string code, Guid warehouseId, Guid tenantId)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");

        return new CashRegister(name, code, warehouseId, tenantId);
    }
}
