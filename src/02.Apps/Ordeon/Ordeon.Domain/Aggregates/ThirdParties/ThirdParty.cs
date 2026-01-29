using System;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.ThirdParties;

public enum ThirdPartyType
{
    Client,
    Provider,
    Both
}

/// <summary>
/// Representa a un tercero (Cliente o Proveedor) en el sistema.
/// </summary>
public sealed class ThirdParty : Entity, IAggregateRoot
{
    public string Identification { get; private set; } // NIT/CC
    public string Name { get; private set; }
    public string Email { get; private set; }
    public string Phone { get; private set; }
    public string Address { get; private set; }
    public ThirdPartyType Type { get; private set; }
    public Guid TenantId { get; private set; }
    public bool IsActive { get; private set; }

    private ThirdParty(string identification, string name, string email, ThirdPartyType type, Guid tenantId)
    {
        Identification = identification;
        Name = name;
        Email = email?.ToLowerInvariant();
        Type = type;
        TenantId = tenantId;
        IsActive = true;
    }

    public static ThirdParty Create(string identification, string name, string email, ThirdPartyType type, Guid tenantId)
    {
        if (string.IsNullOrWhiteSpace(identification)) throw new ArgumentException("Identification is required");
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");

        return new ThirdParty(identification, name, email, type, tenantId);
    }

    public void UpdateContactInfo(string email, string phone, string address)
    {
        Email = email?.ToLowerInvariant();
        Phone = phone;
        Address = address;
        MarkAsUpdated();
    }
}
