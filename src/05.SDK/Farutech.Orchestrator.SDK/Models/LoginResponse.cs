using System;
using System.Collections.Generic;

namespace Farutech.Orchestrator.SDK.Models;

/// <summary>
/// Respuesta del login
/// </summary>
public class LoginResponse
{
    /// <summary>
    /// Indica si se requiere seleccionar contexto (multi-tenant)
    /// </summary>
    public bool RequiresContextSelection { get; set; }

    /// <summary>
    /// Token intermedio (solo si RequiresContextSelection = true)
    /// </summary>
    public string? IntermediateToken { get; set; }

    /// <summary>
    /// Token de acceso JWT (si RequiresContextSelection = false)
    /// </summary>
    public string? AccessToken { get; set; }

    /// <summary>
    /// Tipo de token (Bearer)
    /// </summary>
    public string? TokenType { get; set; }

    /// <summary>
    /// Tiempo de expiración en segundos
    /// </summary>
    public int ExpiresIn { get; set; }

    /// <summary>
    /// Lista de tenants disponibles (si RequiresContextSelection = true)
    /// </summary>
    public List<TenantOptionDto>? AvailableTenants { get; set; }

    /// <summary>
    /// ID del tenant seleccionado
    /// </summary>
    public Guid? SelectedTenantId { get; set; }

    /// <summary>
    /// Nombre de la empresa
    /// </summary>
    public string? CompanyName { get; set; }

    /// <summary>
    /// Rol del usuario
    /// </summary>
    public string? Role { get; set; }
}
