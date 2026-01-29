using System;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.Financial;

public enum PaymentCategory
{
    Cash,
    Card,
    Transfer,
    Credit
}

/// <summary>
/// Define los métodos de pago permitidos (Efectivo, Tarjeta, QR, etc.)
/// </summary>
public sealed class PaymentMethod : Entity, IAggregateRoot
{
    public string Name { get; private set; }
    public string Code { get; private set; } // Ej: "CASH", "CARD_VISA"
    public PaymentCategory Category { get; private set; }
    public bool IsActive { get; private set; }
    public Guid TenantId { get; private set; }

    private PaymentMethod(string name, string code, PaymentCategory category, Guid tenantId)
    {
        Name = name;
        Code = code.ToUpperInvariant();
        Category = category;
        TenantId = tenantId;
        IsActive = true;
    }

    public static PaymentMethod Create(string name, string code, PaymentCategory category, Guid tenantId)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");

        return new PaymentMethod(name, code, category, tenantId);
    }
}
