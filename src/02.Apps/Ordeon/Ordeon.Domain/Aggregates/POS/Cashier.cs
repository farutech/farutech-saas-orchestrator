using System;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.POS;

/// <summary>
/// Representa a un cajero vinculado a un usuario de sistema.
/// Permite la resolución automática de contexto por UserId.
/// </summary>
public sealed class Cashier : Entity, IAggregateRoot
{
    public Guid UserId { get; private set; }
    public string Name { get; private set; }
    public Guid? DefaultCashRegisterId { get; private set; }
    public bool IsActive { get; private set; }

    private Cashier(Guid userId, string name)
    {
        UserId = userId;
        Name = name;
        IsActive = true;
    }

    public static Cashier Create(Guid userId, string name)
    {
        return new Cashier(userId, name);
    }

    public void AssignDefaultRegister(Guid registerId)
    {
        DefaultCashRegisterId = registerId;
        MarkAsUpdated();
    }

    public void Deactivate()
    {
        IsActive = false;
        MarkAsUpdated();
    }
}
