using OtpNet;
using QRCoder;

namespace Farutech.IAM.Infrastructure.Security;

/// <summary>
/// Service for generating and validating Time-based One-Time Passwords (TOTP)
/// </summary>
public class TotpService
{
    private const string Issuer = "Farutech";
    private const int SecretKeyLength = 20; // 160 bits
    private const int CodeLength = 6;
    private const int TimeStep = 30; // seconds
    private const int Window = 1; // Allow 1 step before/after current time

    /// <summary>
    /// Generates a new secret key for 2FA
    /// </summary>
    public string GenerateSecret()
    {
        var key = KeyGeneration.GenerateRandomKey(SecretKeyLength);
        return Base32Encoding.ToString(key);
    }

    /// <summary>
    /// Generates authenticator app URI for QR code
    /// </summary>
    public string GenerateAuthenticatorUri(string secret, string userEmail)
    {
        return $"otpauth://totp/{Issuer}:{userEmail}?secret={secret}&issuer={Issuer}&digits={CodeLength}&period={TimeStep}";
    }

    /// <summary>
    /// Generates QR code as Base64 PNG image
    /// </summary>
    public string GenerateQrCodeBase64(string authenticatorUri)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(authenticatorUri, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        
        var qrCodeBytes = qrCode.GetGraphic(20);
        return Convert.ToBase64String(qrCodeBytes);
    }

    /// <summary>
    /// Validates a TOTP code against a secret
    /// </summary>
    public bool ValidateCode(string secret, string code)
    {
        try
        {
            var secretBytes = Base32Encoding.ToBytes(secret);
            var totp = new Totp(secretBytes, step: TimeStep, totpSize: CodeLength);
            
            // Verify with time window to account for clock drift
            return totp.VerifyTotp(code, out _, new VerificationWindow(Window, Window));
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Generates current TOTP code (for testing purposes)
    /// </summary>
    public string GetCurrentCode(string secret)
    {
        var secretBytes = Base32Encoding.ToBytes(secret);
        var totp = new Totp(secretBytes, step: TimeStep, totpSize: CodeLength);
        return totp.ComputeTotp();
    }

    /// <summary>
    /// Generates backup codes (8 codes, 8 characters each)
    /// </summary>
    public List<string> GenerateBackupCodes(int count = 8)
    {
        var codes = new List<string>();
        var random = new Random();
        
        for (int i = 0; i < count; i++)
        {
            // Generate 8-character alphanumeric code
            var code = GenerateRandomCode(8);
            codes.Add(code);
        }
        
        return codes;
    }

    /// <summary>
    /// Hashes a backup code for storage
    /// </summary>
    public string HashBackupCode(string code)
    {
        return BCrypt.Net.BCrypt.HashPassword(code, 12);
    }

    /// <summary>
    /// Verifies a backup code against its hash
    /// </summary>
    public bool VerifyBackupCode(string code, string hash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(code, hash);
        }
        catch
        {
            return false;
        }
    }

    private string GenerateRandomCode(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        var code = new char[length];
        
        for (int i = 0; i < length; i++)
        {
            code[i] = chars[random.Next(chars.Length)];
        }
        
        return new string(code);
    }
}