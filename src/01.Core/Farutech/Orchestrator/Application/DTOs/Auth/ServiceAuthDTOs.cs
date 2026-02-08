namespace Farutech.Orchestrator.Application.DTOs.Auth;

/// <summary>
/// Request to generate a service token
/// </summary>
public class ServiceTokenRequest
{
    /// <summary>
    /// Unique identifier for the service
    /// </summary>
    public required string ServiceId { get; set; }

    /// <summary>
    /// Type of service (e.g., "provisioning-worker", "monitoring-worker")
    /// </summary>
    public required string ServiceType { get; set; }

    /// <summary>
    /// Optional permissions for the service
    /// </summary>
    public string[]? Permissions { get; set; }
}

/// <summary>
/// Response containing the generated service token
/// </summary>
public class ServiceTokenResponse
{
    /// <summary>
    /// The JWT token
    /// </summary>
    public required string Token { get; set; }

    /// <summary>
    /// Service identifier
    /// </summary>
    public required string ServiceId { get; set; }

    /// <summary>
    /// Service type
    /// </summary>
    public required string ServiceType { get; set; }

    /// <summary>
    /// Granted permissions
    /// </summary>
    public required string[] Permissions { get; set; }

    /// <summary>
    /// Token expiration time
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Token issuance time
    /// </summary>
    public DateTime IssuedAt { get; set; }
}

/// <summary>
/// Request to validate a service token
/// </summary>
public class ValidateTokenRequest
{
    /// <summary>
    /// The JWT token to validate
    /// </summary>
    public required string Token { get; set; }
}

/// <summary>
/// Response for token validation
/// </summary>
public class ServiceTokenValidationResponse
{
    /// <summary>
    /// Whether the token is valid
    /// </summary>
    public bool IsValid { get; set; }

    /// <summary>
    /// Service ID extracted from the token
    /// </summary>
    public string? ServiceId { get; set; }

    /// <summary>
    /// Validation timestamp
    /// </summary>
    public DateTime ValidatedAt { get; set; }
}