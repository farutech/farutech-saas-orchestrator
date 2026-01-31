using System;
using Farutech.Apps.Ordeon.Domain.Common;

namespace Farutech.Apps.Ordeon.Domain.Aggregates.POS;

/// <summary>
/// Movimientos de efectivo dentro de una sesión (Sangrías, Retiros, Vales).
/// </summary>
public sealed class CashMovement : Entity
{
    public Guid CashSessionId { get; private set; }
    public decimal Amount { get; private set; }
    public string Concept { get; private set; }
    public bool IsIncome { get; private set; }
    public DateTime Date { get; private set; }

    private CashMovement(Guid sessionId, decimal amount, string concept, bool isIncome)
    {
        CashSessionId = sessionId;
        Amount = amount;
        Concept = concept;
        IsIncome = isIncome;
        Date = DateTime.UtcNow;
    }

    public static CashMovement Create(Guid sessionId, decimal amount, string concept, bool isIncome)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive");
        if (string.IsNullOrWhiteSpace(concept)) throw new ArgumentException("Concept is required");

        return new CashMovement(sessionId, amount, concept, isIncome);
    }
}

