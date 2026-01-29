using System;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.Inventory;

public sealed class Category : Entity
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public Guid? ParentCategoryId { get; private set; }

    private Category(string name, string description, Guid? parentId)
    {
        Name = name;
        Description = description;
        ParentCategoryId = parentId;
    }

    public static Category Create(string name, string description, Guid? parentId = null)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        return new Category(name, description, parentId);
    }
}
