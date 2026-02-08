using System;

namespace Farutech.Orchestrator.SDK.Models;

/// <summary>
/// Respuesta de selección de contexto
/// </summary>
public class SelectContextResponse
{
    /// <summary>
    /// Token de acceso JWT con tenant seleccionado
    /// </summary>
    public string AccessToken { get; set; } = null!;

    /// <summary>
    /// Tipo de token (Bearer)
    /// </summary>
    public string TokenType { get; set; } = null!;

    /// <summary>
    /// Tiempo de expiración en segundos
    /// </summary>
    public int ExpiresIn { get; set; }

    /// <summary>
    /// ID del tenant seleccionado
    /// </summary>
    public Guid SelectedTenantId { get; set; }

    /// <summary>
    /// Nombre de la empresa
    /// </summary>
    public string CompanyName { get; set; } = null!;

    /// <summary>
    /// Rol del usuario
    /// </summary>
    public string Role { get; set; } = null!;
}
