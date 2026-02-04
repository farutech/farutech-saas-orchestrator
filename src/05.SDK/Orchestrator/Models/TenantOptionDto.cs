using System;
using System.Collections.Generic;

namespace Farutech.Orchestrator.SDK.Models;

/// <summary>
/// Información de un tenant disponible
/// </summary>
public class TenantOptionDto
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
    public string CompanyCode { get; set; } = string.Empty;

    /// <summary>
    /// Identificación fiscal (NIT, RFC, RUC, EIN)
    /// </summary>
    public string TaxId { get; set; } = string.Empty;

    /// <summary>
    /// Rol del usuario en este tenant
    /// </summary>
    public string Role { get; set; } = null!;

    /// <summary>
    /// Indica si el usuario es propietario (Owner) de la organización
    /// </summary>
    public bool IsOwner { get; set; }

    /// <summary>
    /// Indica si la organización está activa
    /// </summary>
    public bool IsActive { get; set; }
}
