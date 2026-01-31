using System;
using Farutech.Apps.Ordeon.Domain.Common;

namespace Farutech.Apps.Ordeon.Domain.Aggregates.ThirdParties;

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
    public string Email { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public string Address { get; private set; } = string.Empty;
    public Guid? WarehouseId { get; private set; }
    public ThirdPartyType Type { get; private set; }
    public bool IsActive { get; private set; }

    private ThirdParty(string identification, string name, string email, ThirdPartyType type)
    {
        if (string.IsNullOrWhiteSpace(identification)) throw new ArgumentException("Identification is required");
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        Identification = identification;
        Name = name;
        Email = (email ?? string.Empty).ToLowerInvariant();
        Type = type;
        IsActive = true;
    }

    public static ThirdParty Create(string identification, string name, string email, ThirdPartyType type)
    {
        return new ThirdParty(identification, name, email, type);
    }

    public void UpdateContactInfo(string email, string phone, string address)
    {
        Email = (email ?? string.Empty).ToLowerInvariant();
        Phone = phone ?? string.Empty;
        Address = address ?? string.Empty;
        MarkAsUpdated();
    }
}

