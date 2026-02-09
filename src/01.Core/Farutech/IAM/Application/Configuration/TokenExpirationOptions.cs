namespace Farutech.IAM.Application.Configuration;

/// <summary>
/// Configuración de tiempos de expiración de tokens en segundos
/// </summary>
public class TokenExpirationOptions
{
    public const string SectionName = "TokenExpirationOptions";

    /// <summary>
    /// Tiempo de expiración para tokens de verificación de email (en segundos)
    /// Por defecto: 86400 segundos (24 horas)
    /// </summary>
    public int EmailVerificationSeconds { get; set; } = 86400;

    /// <summary>
    /// Tiempo de expiración para tokens de recuperación de contraseña (en segundos)
    /// Por defecto: 3600 segundos (1 hora)
    /// </summary>
    public int PasswordResetSeconds { get; set; } = 3600;

    /// <summary>
    /// Tiempo de expiración para refresh tokens (en segundos)
    /// Por defecto: 2592000 segundos (30 días)
    /// </summary>
    public int RefreshTokenSeconds { get; set; } = 2592000;

    /// <summary>
    /// Tiempo de expiración para sesiones (en segundos)
    /// Por defecto: 86400 segundos (24 horas)
    /// </summary>
    public int SessionSeconds { get; set; } = 86400;
}
