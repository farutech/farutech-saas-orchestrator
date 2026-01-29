using System;
using Ordeon.Domain.Common;

namespace Ordeon.Domain.Aggregates.Documents;

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
    public string Name { get; private set; }
    public string Code { get; private set; } // Ej: "FACT", "COT", "BOD"
    public string Prefix { get; private set; }
    public int NextNumber { get; private set; }
    public DocumentModule Module { get; private set; }
    public bool IsActive { get; private set; }
    public Guid TenantId { get; private set; }
    
    // Configuración adicional (ej: resolución DIAN, formato de impresión)
    public string ConfigurationJson { get; private set; } = "{}";

    private DocumentDefinition(string name, string code, string prefix, DocumentModule module, Guid tenantId)
    {
        Name = name;
        Code = code.ToUpperInvariant();
        Prefix = prefix?.ToUpperInvariant() ?? "";
        NextNumber = 1;
        Module = module;
        TenantId = tenantId;
        IsActive = true;
    }

    public static DocumentDefinition Create(string name, string code, string prefix, DocumentModule module, Guid tenantId)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Code is required");
        
        return new DocumentDefinition(name, code, prefix, module, tenantId);
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
        ConfigurationJson = json;
        MarkAsUpdated();
    }
}
