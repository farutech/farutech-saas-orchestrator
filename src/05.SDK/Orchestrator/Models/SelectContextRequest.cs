using System;

namespace Farutech.Orchestrator.SDK.Models;

/// <summary>
/// Request para seleccionar contexto de tenant
/// </summary>
public class SelectContextRequest
{
    /// <summary>
    /// ID del tenant a seleccionar
    /// </summary>
    public Guid TenantId { get; set; }
}
