using System;
using Farutech.Apps.Ordeon.Domain.Common;

namespace Farutech.Apps.Ordeon.Domain.Aggregates.Logistics;

/// <summary>
/// Representa una bodega o almacén físico.
/// </summary>
public sealed class Warehouse : Entity, IAggregateRoot
{
    public string Code { get; private set; }
    public string Name { get; private set; }
    public string Location { get; private set; }

    private Warehouse(string code, string name, string location)
    {
        Code = code.ToUpperInvariant();
        Name = name;
        Location = location;
    }

    public static Warehouse Create(string code, string name, string location)
    {
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");
        if (code.Length > 10) throw new ArgumentException("Code cannot exceed 10 characters");
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");

        return new Warehouse(code, name, location);
    }
}

