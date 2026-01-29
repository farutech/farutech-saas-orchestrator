using System;
using System.Collections.Generic;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.Identity;

/// <summary>
/// Representa un rol que agrupa múltiples permisos.
/// </summary>
public sealed class Role : Entity, IAggregateRoot
{
    private readonly List<Permission> _permissions = new();

    public string Name { get; private set; }
    public string Description { get; private set; }
    public IReadOnlyCollection<Permission> Permissions => _permissions.AsReadOnly();

    private Role(string name, string description)
    {
        Name = name;
        Description = description;
    }

    public static Role Create(string name, string description)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        return new Role(name, description);
    }

    public void AddPermission(Permission permission)
    {
        if (!_permissions.Contains(permission))
        {
            _permissions.Add(permission);
            MarkAsUpdated();
        }
    }

    public void RemovePermission(Permission permission)
    {
        if (_permissions.Remove(permission))
        {
            MarkAsUpdated();
        }
    }
}
