using System;
using System.Collections.Generic;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.Inventory;

public enum ItemType
{
    Product,
    Service
}

/// <summary>
/// Representa un artículo (Bien o Servicio) en el catálogo maestro.
/// </summary>
public sealed class Item : Entity, IAggregateRoot
{
    public string Code { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public ItemType Type { get; private set; }
    public Guid CategoryId { get; private set; }
    public Guid BaseUnitOfMeasureId { get; private set; }
    
    // Metadata flexible usando JSONB en la base de datos
    public string MetadataJson { get; private set; } = "{}";

    private Item(string code, string name, string description, ItemType type, Guid categoryId, Guid uomId)
    {
        Code = code;
        Name = name;
        Description = description;
        Type = type;
        CategoryId = categoryId;
        BaseUnitOfMeasureId = uomId;
    }

    public static Item Create(string code, string name, string description, ItemType type, Guid categoryId, Guid uomId)
    {
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");
        if (code.Length > 10) throw new ArgumentException("Code cannot exceed 10 characters");
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");

        return new Item(code.ToUpperInvariant(), name, description, type, categoryId, uomId);
    }

    public void UpdateBasicInfo(string name, string description)
    {
        Name = name;
        Description = description;
        MarkAsUpdated();
    }

    public void UpdateMetadata(string json)
    {
        MetadataJson = json;
        MarkAsUpdated();
    }
}
