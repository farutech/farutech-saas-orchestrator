using System;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.Logistics;

/// <summary>
/// Representa una bodega o almacén físico.
/// </summary>
public sealed class Warehouse : Entity, IAggregateRoot
{
    public string Code { get; private set; }
    public string Name { get; private set; }
    public string Location { get; private set; }
    public Guid TenantId { get; private set; }

    private Warehouse(string code, string name, string location, Guid tenantId)
    {
        Code = code;
        Name = name;
        Location = location;
        TenantId = tenantId;
    }

    public static Warehouse Create(string code, string name, string location, Guid tenantId)
    {
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");

        return new Warehouse(code.ToLowerInvariant(), name, location, tenantId);
    }
}
