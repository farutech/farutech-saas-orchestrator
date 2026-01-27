using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Domain.Entities.Identity;

/// <summary>
/// Representa un token de recuperación de contraseña.
/// </summary>
public class PasswordResetToken : BaseEntity
{
    /// <summary>
    /// Email del usuario que solicita la recuperación.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Token único de recuperación (string GUID).
    /// </summary>
    public required string Token { get; set; }

    /// <summary>
    /// Fecha de expiración (2 horas desde creación).
    /// </summary>
    public required DateTime ExpirationDate { get; set; }

    /// <summary>
    /// Indica si el token ya fue utilizado.
    /// </summary>
    public bool IsUsed { get; set; } = false;

    /// <summary>
    /// Usuario asociado (opcional, para FK).
    /// </summary>
    public Guid? UserId { get; set; }
}
