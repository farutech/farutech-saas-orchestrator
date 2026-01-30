using System;
using Farutech.Apps.Ordeon.Domain.Common;

namespace Farutech.Apps.Ordeon.Domain.Aggregates.Inventory;

public sealed class UnitOfMeasure : Entity
{
    public string Name { get; private set; }
    public string Symbol { get; private set; } // e.g. "kg", "unit", "box"

    private UnitOfMeasure(string name, string symbol)
    {
        Name = name;
        Symbol = symbol;
    }

    public static UnitOfMeasure Create(string name, string symbol)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(symbol)) throw new ArgumentException("Symbol is required");
        if (symbol.Length > 10) throw new ArgumentException("Symbol cannot exceed 10 characters");
        
        return new UnitOfMeasure(name, symbol.ToUpperInvariant());
    }
}

