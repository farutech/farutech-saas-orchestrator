namespace Farutech.IAM.Application.DTOs;

/// <summary>
/// Result of authentication operation with status and error details
/// </summary>
public class AuthenticationResult
{
    public bool Success { get; set; }
    public string? ErrorCode { get; set; }
    public string? ErrorMessage { get; set; }
    public LoginResponse? Data { get; set; }
    
    public static AuthenticationResult Successful(LoginResponse data) => new()
    {
        Success = true,
        Data = data
    };
    
    public static AuthenticationResult Failed(string errorCode, string errorMessage) => new()
    {
        Success = false,
        ErrorCode = errorCode,
        ErrorMessage = errorMessage
    };
}
