namespace Farutech.Orchestrator.Domain.Common;

/// <summary>
/// Resultado de operaciones de servicio
/// </summary>
public record ServiceResult(bool Success, string Message, int StatusCode = 200)
{
    public static ServiceResult Ok(string message = "Operación exitosa") 
        => new ServiceResult(true, message);

    public static ServiceResult Error(string message, int statusCode = 400) 
        => new ServiceResult(false, message, statusCode);
}