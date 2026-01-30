using System;
using System.Collections.Generic;
using Farutech.Apps.Ordeon.Domain.Common;

namespace Farutech.Apps.Ordeon.Domain.Aggregates.POS;

public enum SessionStatus
{
    Open,
    Closing, // Pendiente de cuadre
    Closed
}

/// <summary>
/// Representa el turno o sesión de un cajero.
/// Maneja la apertura, el arqueo ciego y el cuadre.
/// </summary>
public sealed class CashSession : Entity, IAggregateRoot
{
    private readonly List<CashMovement> _movements = new();

    public Guid CashRegisterId { get; private set; }
    public Guid CashierId { get; private set; }
    public DateTime OpenDate { get; private set; }
    public DateTime? CloseDate { get; private set; }
    public decimal OpeningBalance { get; private set; }
    public decimal? DeclaredBalance { get; private set; } // Arqueo ciego
    public decimal CalculatedBalance { get; private set; } // Balance según sistema
    public SessionStatus Status { get; private set; }

    public IReadOnlyCollection<CashMovement> Movements => _movements.AsReadOnly();

    private CashSession(Guid registerId, Guid cashierId, decimal openingBalance)
    {
        CashRegisterId = registerId;
        CashierId = cashierId;
        OpeningBalance = openingBalance;
        CalculatedBalance = openingBalance;
        OpenDate = DateTime.UtcNow;
        Status = SessionStatus.Open;
    }

    public static CashSession Open(Guid registerId, Guid cashierId, decimal openingBalance)
    {
        return new CashSession(registerId, cashierId, openingBalance);
    }

    public void AddMovement(decimal amount, string concept, bool isIncome)
    {
        if (Status != SessionStatus.Open) throw new InvalidOperationException("Session is not open");
        
        var movement = CashMovement.Create(Id, amount, concept, isIncome);
        _movements.Add(movement);
        
        if (isIncome) CalculatedBalance += amount;
        else CalculatedBalance -= amount;
        
        MarkAsUpdated();
    }

    public void RequestClose(decimal declaredBalance)
    {
        if (Status != SessionStatus.Open) throw new InvalidOperationException("Session is not open");
        
        DeclaredBalance = declaredBalance;
        Status = SessionStatus.Closing;
        MarkAsUpdated();
    }

    public void ConfirmClose()
    {
        if (Status != SessionStatus.Closing) throw new InvalidOperationException("Session is not in closing state");
        
        CloseDate = DateTime.UtcNow;
        Status = SessionStatus.Closed;
        MarkAsUpdated();
    }
}

