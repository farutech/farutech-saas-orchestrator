using System;
using Farutech.Apps.Ordeon.Domain.Common;

namespace Farutech.Apps.Ordeon.Domain.Aggregates.Financial;

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

    private PaymentMethod(string name, string code, PaymentCategory category)
    {
        Name = name;
        Code = code.ToUpperInvariant();
        Category = category;
        IsActive = true;
    }

    public static PaymentMethod Create(string name, string code, PaymentCategory category)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");
        if (code.Length > 10) throw new ArgumentException("Code cannot exceed 10 characters");

        return new PaymentMethod(name, code, category);
    }
}

