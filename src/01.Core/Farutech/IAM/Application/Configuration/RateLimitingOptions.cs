namespace Farutech.IAM.Application.Configuration;

/// <summary>
/// Rate limiting configuration for API endpoints
/// </summary>
public class RateLimitingOptions
{
    /// <summary>
    /// Global requests per minute limit
    /// </summary>
    public int GlobalRequestsPerMinute { get; set; } = 100;

    /// <summary>
    /// Login requests per 15 minutes
    /// </summary>
    public int LoginRequestsPer15Minutes { get; set; } = 5;

    /// <summary>
    /// Register requests per hour
    /// </summary>
    public int RegisterRequestsPerHour { get; set; } = 10;

    /// <summary>
    /// Forgot password requests per hour
    /// </summary>
    public int ForgotPasswordRequestsPerHour { get; set; } = 5;

    /// <summary>
    /// Email verification requests per hour
    /// </summary>
    public int EmailVerificationRequestsPerHour { get; set; } = 5;

    /// <summary>
    /// 2FA verification attempts per 5 minutes
    /// </summary>
    public int TwoFactorRequestsPer5Minutes { get; set; } = 5;
}
