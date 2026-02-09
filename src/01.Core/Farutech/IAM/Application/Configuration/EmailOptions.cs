namespace Farutech.IAM.Application.Configuration;

/// <summary>
/// Email service configuration options
/// </summary>
public class EmailOptions
{
    public const string SectionName = "EmailOptions";

    /// <summary>
    /// Email transport: "Smtp" or "Api"
    /// </summary>
    public string Transport { get; set; } = "Smtp";

    /// <summary>
    /// Email provider: "Mailtrap", "SendGrid", "Mailgun", "Postmark"
    /// </summary>
    public string Provider { get; set; } = "Mailtrap";

    /// <summary>
    /// Enable email sending (false for testing)
    /// </summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// From email address
    /// </summary>
    public string FromEmail { get; set; } = "noreply@farutech.com";

    /// <summary>
    /// From display name
    /// </summary>
    public string FromName { get; set; } = "Farutech IAM";

    /// <summary>
    /// SMTP configuration
    /// </summary>
    public SmtpSettings Smtp { get; set; } = new();

    /// <summary>
    /// API configuration (for Mailtrap, SendGrid, etc.)
    /// </summary>
    public ApiSettings Api { get; set; } = new();
}

public class SmtpSettings
{
    public string Host { get; set; } = "sandbox.smtp.mailtrap.io";
    public int Port { get; set; } = 2525;
    public string? Username { get; set; }
    public string? Password { get; set; }
    public bool EnableSsl { get; set; } = true;
    public int TimeoutSeconds { get; set; } = 30;
}

public class ApiSettings
{
    /// <summary>
    /// API endpoint URL
    /// </summary>
    public string Url { get; set; } = "https://send.api.mailtrap.io/api/send";

    /// <summary>
    /// API token/key for authentication
    /// </summary>
    public string? ApiToken { get; set; }

    /// <summary>
    /// Request timeout in seconds
    /// </summary>
    public int TimeoutSeconds { get; set; } = 30;
}