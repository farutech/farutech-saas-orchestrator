using System;
using System.Collections.Generic;

namespace Farutech.Orchestrator.SDK.Models;

/// <summary>
/// Configuración de un Tenant desde la API
/// </summary>
public class TenantConfigurationDto
{
    /// <summary>
    /// ID del tenant
    /// </summary>
    public Guid TenantId { get; set; }

    /// <summary>
    /// Nombre de la empresa
    /// </summary>
    public string CompanyName { get; set; } = null!;

    /// <summary>
    /// Código de la empresa
    /// </summary>
    public string Code { get; set; } = null!;

    /// <summary>
    /// Producto suscrito
    /// </summary>
    public string ProductName { get; set; } = null!;

    /// <summary>
    /// Módulo activo
    /// </summary>
    public string ModuleName { get; set; } = null!;

    /// <summary>
    /// Features habilitadas
    /// </summary>
    public List<FeatureDto> Features { get; set; } = new();

    /// <summary>
    /// Configuración específica del tenant (overrides)
    /// </summary>
    public Dictionary<string, object>? TenantConfig { get; set; }
}
