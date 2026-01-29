using System;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.Identity;

/// <summary>
/// Representa un permiso granular en el sistema.
/// Convención: modulo.funcion.accion (ej: sales.ord.crt)
/// </summary>
public sealed class Permission : Entity
{
    public string Code { get; private set; } // max 15 chars (5.5.5)
    public string Name { get; private set; }
    public string Description { get; private set; }

    private Permission(string code, string name, string description)
    {
        Code = code.ToLowerInvariant();
        Name = name;
        Description = description;
    }

    public static Permission Create(string code, string name, string description)
    {
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");
        // Validation for 5.5.5 can be added here
        
        return new Permission(code, name, description);
    }
}
