using System;
using Farutech.Apps.Ordeon.Domain.Common;

namespace Farutech.Apps.Ordeon.Domain.Aggregates.Documents;

public enum DocumentModule
{
    Sales,
    Purchases,
    Inventory,
    Treasury
}

/// <summary>
/// Configuración para tipos de documentos parametrizables.
/// Permite definir prefijos, numeración y comportamiento.
/// </summary>
public sealed class DocumentDefinition : Entity, IAggregateRoot
{
    public string Name { get; private set; } = string.Empty;
    public string Code { get; private set; } = string.Empty; // Ej: "FACT", "COT", "BOD"
    public string Prefix { get; private set; } = string.Empty;
    public int NextNumber { get; private set; }
    public DocumentModule Module { get; private set; }
    public bool IsActive { get; private set; }
    
    // Configuración adicional (ej: resolución DIAN, formato de impresión)
    public string ConfigurationJson { get; private set; } = "{}";

    private DocumentDefinition(string name, string code, string prefix, DocumentModule module)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");
        if (code.Length > 10) throw new ArgumentException("Code cannot exceed 10 characters");
        if (prefix?.Length > 10) throw new ArgumentException("Prefix cannot exceed 10 characters");
        Name = name;
        Code = code.ToUpperInvariant();
        Prefix = (prefix ?? string.Empty).ToUpperInvariant();
        NextNumber = 1;
        Module = module;
        IsActive = true;
    }

    public static DocumentDefinition Create(string name, string code, string prefix, DocumentModule module)
    {
        return new DocumentDefinition(name, code, prefix, module);
    }

    public string GenerateNextNumber()
    {
        var number = $"{Prefix}{NextNumber.ToString().PadLeft(6, '0')}";
        NextNumber++;
        MarkAsUpdated(); 
        return number;
    }

    public void UpdateConfiguration(string json)
    {
        ConfigurationJson = json ?? "{}";
        MarkAsUpdated();
    }
}

