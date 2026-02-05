namespace Farutech.Orchestrator.SDK.Models;

/// <summary>
/// Request para autenticación de usuario
/// </summary>
public class LoginRequest
{
    /// <summary>
    /// Email del usuario
    /// </summary>
    public string Email { get; set; } = null!;

    /// <summary>
    /// Contraseña del usuario
    /// </summary>
    public string Password { get; set; } = null!;

    /// <summary>
    /// Si true, genera token de larga duración (48h). Si false, token estándar (30min)
    /// </summary>
    public bool RememberMe { get; set; }
}
