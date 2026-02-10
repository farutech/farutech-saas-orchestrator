using System.ComponentModel.DataAnnotations;

namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Request to register a new user
/// </summary>
public class RegisterRequest
{
    [Required(ErrorMessage = "El email es requerido")]
    [EmailAddress(ErrorMessage = "El formato del email es inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es requerida")]
    [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre es requerido")]
    [MinLength(2, ErrorMessage = "El nombre debe tener al menos 2 caracteres")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es requerido")]
    [MinLength(2, ErrorMessage = "El apellido debe tener al menos 2 caracteres")]
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Phone number for optional 2FA
    /// </summary>
    [Phone(ErrorMessage = "El formato del teléfono es inválido")]
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// Optional tenant code for registration
    /// </summary>
    public string? TenantCode { get; set; }

    /// <summary>
    /// IP address of the client making the request
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent string from the client
    /// </summary>
    public string? UserAgent { get; set; }
}

/// <summary>
/// Response after successful registration
/// </summary>
public class RegisterResponse
{
    /// <summary>
    /// Public user identifier (encrypted, not the internal GUID)
    /// </summary>
    public string PublicUserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public bool EmailConfirmationRequired { get; set; }
    public string? Message { get; set; }
}
