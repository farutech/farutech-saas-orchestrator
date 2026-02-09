using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Net.Http.Json;
using System.Text.RegularExpressions;

namespace Farutech.IAM.Infrastructure.Email;

/// <summary>
/// Email service implementation with support for SMTP and API providers
/// </summary>
public class EmailService : IEmailService
{
    private readonly EmailOptions _options;
    private readonly ILogger<EmailService> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public EmailService(
        IOptions<EmailOptions> options, 
        ILogger<EmailService> logger,
        IHttpClientFactory httpClientFactory)
    {
        _options = options.Value;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        await SendEmailAsync(to, subject, body, body);
    }

    public async Task SendHtmlEmailAsync(string to, string subject, string htmlBody)
    {
        await SendEmailAsync(to, subject, htmlBody, htmlBody);
    }

    public async Task SendEmailAsync(string to, string subject, string textBody, string htmlBody)
    {
        if (!_options.Enabled)
        {
            _logger.LogWarning("Email sending is disabled. Would send to: {To}, Subject: {Subject}", to, subject);
            return;
        }

        try
        {
            if (_options.Transport.Equals("Api", StringComparison.OrdinalIgnoreCase))
            {
                await SendViaApiAsync(to, subject, textBody, htmlBody);
            }
            else if (_options.Transport.Equals("Smtp", StringComparison.OrdinalIgnoreCase))
            {
                await SendViaSmtpAsync(to, subject, textBody, htmlBody);
            }
            else
            {
                throw new InvalidOperationException($"Unknown transport: {_options.Transport}. Use 'Smtp' or 'Api'");
            }

            _logger.LogInformation("Email sent successfully to {To} via {Transport}/{Provider}", to, _options.Transport, _options.Provider);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To} via {Transport}/{Provider}", to, _options.Transport, _options.Provider);
            throw;
        }
    }

    public async Task SendTemplateEmailAsync(string to, string subject, string templateName, Dictionary<string, string> templateData)
    {
        var htmlBody = await LoadTemplateAsync(templateName, templateData);
        var textBody = StripHtml(htmlBody);
        await SendEmailAsync(to, subject, textBody, htmlBody);
    }

    public async Task SendEmailConfirmationAsync(string to, string confirmationUrl, string userName)
    {
        var subject = "Confirm Your Email - Farutech";
        var variables = new Dictionary<string, string>
        {
            { "userName", userName },
            { "confirmationUrl", confirmationUrl },
            { "currentYear", DateTime.UtcNow.Year.ToString() }
        };

        var htmlBody = ReplaceTemplateVariables(EmailTemplates.EmailConfirmation, variables);
        await SendHtmlEmailAsync(to, subject, htmlBody);
    }

    public async Task SendPasswordResetAsync(string to, string resetUrl, string userName)
    {
        var subject = "Reset Your Password - Farutech";
        var variables = new Dictionary<string, string>
        {
            { "userName", userName },
            { "resetUrl", resetUrl },
            { "currentYear", DateTime.UtcNow.Year.ToString() }
        };

        var htmlBody = ReplaceTemplateVariables(EmailTemplates.PasswordReset, variables);
        await SendHtmlEmailAsync(to, subject, htmlBody);
    }

    public async Task SendPasswordChangedNotificationAsync(string to, string userName)
    {
        var subject = "Password Changed - Farutech";
        var variables = new Dictionary<string, string>
        {
            { "userName", userName },
            { "currentYear", DateTime.UtcNow.Year.ToString() }
        };

        var htmlBody = ReplaceTemplateVariables(EmailTemplates.PasswordChanged, variables);
        await SendHtmlEmailAsync(to, subject, htmlBody);
    }

    public async Task SendTwoFactorSetupNotificationAsync(string to, string userName)
    {
        var subject = "Two-Factor Authentication Enabled - Farutech";
        var variables = new Dictionary<string, string>
        {
            { "userName", userName },
            { "currentYear", DateTime.UtcNow.Year.ToString() }
        };

        var htmlBody = ReplaceTemplateVariables(EmailTemplates.TwoFactorEnabled, variables);
        await SendHtmlEmailAsync(to, subject, htmlBody);
    }

    public async Task SendTwoFactorDisabledNotificationAsync(string to, string userName)
    {
        var subject = "Two-Factor Authentication Disabled - Farutech";
        var variables = new Dictionary<string, string>
        {
            { "userName", userName },
            { "currentYear", DateTime.UtcNow.Year.ToString() }
        };

        var htmlBody = ReplaceTemplateVariables(EmailTemplates.TwoFactorDisabled, variables);
        await SendHtmlEmailAsync(to, subject, htmlBody);
    }

    public async Task SendWelcomeEmailAsync(string to, string userName)
    {
        var subject = "Welcome to Farutech";
        var variables = new Dictionary<string, string>
        {
            { "userName", userName },
            { "currentYear", DateTime.UtcNow.Year.ToString() }
        };

        var htmlBody = ReplaceTemplateVariables(EmailTemplates.WelcomeEmail, variables);
        await SendHtmlEmailAsync(to, subject, htmlBody);
    }

    public async Task SendSecurityAlertAsync(string to, string userName, string alertMessage, string ipAddress)
    {
        var subject = "Security Alert - Farutech";
        var variables = new Dictionary<string, string>
        {
            { "userName", userName },
            { "alertMessage", alertMessage },
            { "ipAddress", ipAddress },
            { "timestamp", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss") },
            { "currentYear", DateTime.UtcNow.Year.ToString() }
        };

        var htmlBody = ReplaceTemplateVariables(EmailTemplates.SecurityAlert, variables);
        await SendHtmlEmailAsync(to, subject, htmlBody);
    }

    // Private helper methods

    private async Task SendViaApiAsync(string to, string subject, string textBody, string htmlBody)
    {
        if (string.IsNullOrEmpty(_options.Api.ApiToken))
        {
            throw new InvalidOperationException("API token is required for API transport. Configure EmailOptions:Api:ApiToken");
        }

        var httpClient = _httpClientFactory.CreateClient();
        httpClient.Timeout = TimeSpan.FromSeconds(_options.Api.TimeoutSeconds);
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_options.Api.ApiToken}");

        var payload = new
        {
            from = new
            {
                email = _options.FromEmail,
                name = _options.FromName
            },
            to = new[]
            {
                new { email = to }
            },
            subject,
            text = textBody,
            html = htmlBody,
            category = "Farutech IAM"
        };

        var response = await httpClient.PostAsJsonAsync(_options.Api.Url, payload);
        
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException(
                $"Email API request failed with status {response.StatusCode}: {errorContent}");
        }

        _logger.LogDebug("Email sent via API to {To}, Response: {StatusCode}", to, response.StatusCode);
    }

    private async Task SendViaSmtpAsync(string to, string subject, string textBody, string htmlBody)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_options.FromName, _options.FromEmail));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;

        var builder = new BodyBuilder
        {
            TextBody = textBody,
            HtmlBody = htmlBody
        };
        message.Body = builder.ToMessageBody();

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(
                _options.Smtp.Host,
                _options.Smtp.Port,
                _options.Smtp.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);

            if (!string.IsNullOrEmpty(_options.Smtp.Username) && !string.IsNullOrEmpty(_options.Smtp.Password))
            {
                await client.AuthenticateAsync(_options.Smtp.Username, _options.Smtp.Password);
            }

            await client.SendAsync(message);
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }

    private async Task<string> LoadTemplateAsync(string templateName, Dictionary<string, string> templateData)
    {
        // TODO: Load template from file system or embedded resources
        // For now, use embedded templates
        var template = templateName switch
        {
            "EmailConfirmation" => EmailTemplates.EmailConfirmation,
            "PasswordReset" => EmailTemplates.PasswordReset,
            "PasswordChanged" => EmailTemplates.PasswordChanged,
            "WelcomeEmail" => EmailTemplates.WelcomeEmail,
            "TwoFactorEnabled" => EmailTemplates.TwoFactorEnabled,
            "TwoFactorDisabled" => EmailTemplates.TwoFactorDisabled,
            "SecurityAlert" => EmailTemplates.SecurityAlert,
            _ => "<html><body><h1>${title}</h1><p>${message}</p></body></html>"
        };

        return await Task.FromResult(ReplaceTemplateVariables(template, templateData));
    }

    private string ReplaceTemplateVariables(string template, Dictionary<string, string> variables)
    {
        var result = template;
        foreach (var kvp in variables)
        {
            result = result.Replace($"${{{kvp.Key}}}", kvp.Value);
        }
        return result;
    }

    private string StripHtml(string html)
    {
        return Regex.Replace(html, "<.*?>", string.Empty);
    }
}

/// <summary>
/// Email templates with ${variable} placeholders
/// </summary>
internal static class EmailTemplates
{
    public const string EmailConfirmation = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Welcome, ${userName}!</h2>
        <p>Thank you for registering with Farutech. Please confirm your email address to activate your account.</p>
        <p>
            <a href='${confirmationUrl}' class='button'>Confirm Email</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${confirmationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <div class='footer'>
            <p>If you didn't create an account, please ignore this email.</p>
            <p>&copy; ${currentYear} Farutech. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

    public const string PasswordReset = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Password Reset Request</h2>
        <p>Hello ${userName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <p>
            <a href='${resetUrl}' class='button'>Reset Password</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p><strong>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</strong></p>
        <div class='footer'>
            <p>&copy; ${currentYear} Farutech. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

    public const string PasswordChanged = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Password Changed Successfully</h2>
        <p>Hello ${userName},</p>
        <p>This is a confirmation that your password was changed successfully.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <div class='footer'>
            <p>&copy; ${currentYear} Farutech. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

    public const string WelcomeEmail = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Welcome to Farutech!</h2>
        <p>Hello ${userName},</p>
        <p>Your email has been confirmed and your account is now active.</p>
        <p>You can now access all features of our platform.</p>
        <div class='footer'>
            <p>&copy; ${currentYear} Farutech. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

    public const string TwoFactorEnabled = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Two-Factor Authentication Enabled</h2>
        <p>Hello ${userName},</p>
        <p>Two-factor authentication has been successfully enabled on your account.</p>
        <p>You will now need to provide a verification code from your authenticator app when logging in.</p>
        <p>If you didn't enable this feature, please contact our support team immediately.</p>
        <div class='footer'>
            <p>&copy; ${currentYear} Farutech. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

    public const string TwoFactorDisabled = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Two-Factor Authentication Disabled</h2>
        <p>Hello ${userName},</p>
        <p>Two-factor authentication has been disabled on your account.</p>
        <p>If you didn't make this change, please contact our support team immediately and secure your account.</p>
        <div class='footer'>
            <p>&copy; ${currentYear} Farutech. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

    public const string SecurityAlert = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .alert { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Security Alert</h2>
        <p>Hello ${userName},</p>
        <div class='alert'>
            <p><strong>${alertMessage}</strong></p>
            <p>IP Address: ${ipAddress}</p>
            <p>Time: ${timestamp} UTC</p>
        </div>
        <p>If this wasn't you, please secure your account immediately by changing your password.</p>
        <div class='footer'>
            <p>&copy; ${currentYear} Farutech. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
}
