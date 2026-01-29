using System;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.Inventory;

public sealed class Category : Entity
{
    public string Code { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public Guid? ParentCategoryId { get; private set; }

    private Category(string code, string name, string description, Guid? parentId)
    {
        Code = code.ToUpperInvariant();
        Name = name;
        Description = description;
        ParentCategoryId = parentId;
    }

    public static Category Create(string code, string name, string description, Guid? parentId = null)
    {
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");
        if (code.Length > 10) throw new ArgumentException("Code cannot exceed 10 characters");
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");

        return new Category(code, name, description, parentId);
    }
}
