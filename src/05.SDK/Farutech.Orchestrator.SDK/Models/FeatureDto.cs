using System.Collections.Generic;

namespace Farutech.Orchestrator.SDK.Models;

/// <summary>
/// Feature habilitada para un tenant
/// </summary>
public class FeatureDto
{
    /// <summary>
    /// Código de la feature
    /// </summary>
    public string Code { get; set; } = null!;

    /// <summary>
    /// Nombre de la feature
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// Descripción
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Indica si la feature está habilitada
    /// </summary>
    public bool IsEnabled { get; set; }

    /// <summary>
    /// Configuración específica de la feature (overrides)
    /// </summary>
    public Dictionary<string, object>? Config { get; set; }
}
