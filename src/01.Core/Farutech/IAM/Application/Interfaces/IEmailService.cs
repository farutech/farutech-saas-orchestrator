namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Email service interface for sending emails via SMTP or API providers
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Send email with plain text body
    /// </summary>
    Task SendEmailAsync(string to, string subject, string body);

    /// <summary>
    /// Send email with HTML body
    /// </summary>
    Task SendHtmlEmailAsync(string to, string subject, string htmlBody);

    /// <summary>
    /// Send email with both plain text and HTML body
    /// </summary>
    Task SendEmailAsync(string to, string subject, string textBody, string htmlBody);

    /// <summary>
    /// Send email using a template
    /// </summary>
    Task SendTemplateEmailAsync(string to, string subject, string templateName, Dictionary<string, string> templateData);

    /// <summary>
    /// Send email confirmation
    /// </summary>
    Task SendEmailConfirmationAsync(string to, string confirmationUrl, string userName);

    /// <summary>
    /// Send password reset email
    /// </summary>
    Task SendPasswordResetAsync(string to, string resetUrl, string userName);

    /// <summary>
    /// Send password changed notification
    /// </summary>
    Task SendPasswordChangedNotificationAsync(string to, string userName);

    /// <summary>
    /// Send 2FA setup notification
    /// </summary>
    Task SendTwoFactorSetupNotificationAsync(string to, string userName);

    /// <summary>
    /// Send 2FA disabled notification
    /// </summary>
    Task SendTwoFactorDisabledNotificationAsync(string to, string userName);

    /// <summary>
    /// Send welcome email
    /// </summary>
    Task SendWelcomeEmailAsync(string to, string userName);

    /// <summary>
    /// Send security alert email
    /// </summary>
    Task SendSecurityAlertAsync(string to, string userName, string alertMessage, string ipAddress);
}