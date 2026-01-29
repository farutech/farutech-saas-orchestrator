using System;
using System.Collections.Generic;
using System.Linq;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.Identity;

/// <summary>
/// Representa un usuario dentro de la aplicación Ordeon.
/// </summary>
public sealed class User : Entity, IAggregateRoot
{
    private readonly List<Role> _roles = new();

    public string Email { get; private set; }
    public string FullName { get; private set; }
    public Guid TenantId { get; private set; }
    public bool IsActive { get; private set; }

    public IReadOnlyCollection<Role> Roles => _roles.AsReadOnly();

    private User(string email, string fullName, Guid tenantId)
    {
        Email = email.ToLowerInvariant();
        FullName = fullName;
        TenantId = tenantId;
        IsActive = true;
    }

    public static User Create(string email, string fullName, Guid tenantId)
    {
        if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email is required");
        return new User(email, fullName, tenantId);
    }

    public void AssignRole(Role role)
    {
        if (!_roles.Contains(role))
        {
            _roles.Add(role);
            MarkAsUpdated();
        }
    }

    public void RemoveRole(Role role)
    {
        if (_roles.Remove(role))
        {
            MarkAsUpdated();
        }
    }

    public IEnumerable<string> GetEffectivePermissions()
    {
        return _roles
            .SelectMany(r => r.Permissions)
            .Select(p => p.Code)
            .Distinct();
    }

    public void Deactivate()
    {
        IsActive = false;
        MarkAsUpdated();
    }

    public void Activate()
    {
        IsActive = true;
        MarkAsUpdated();
    }
}
