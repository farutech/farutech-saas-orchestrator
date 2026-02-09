namespace Farutech.IAM.Domain.Entities;

/// <summary>
/// Registro de auditoría de eventos de seguridad
/// </summary>
public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public Guid? TenantId { get; set; }
    
    public string Event { get; set; } = string.Empty; // 'login', 'logout', 'token_refresh'
    public string Result { get; set; } = string.Empty; // 'success', 'failure', 'denied'
    public string? Details { get; set; } // JSON object con detalles adicionales
    
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public User? User { get; set; }
    public Tenant? Tenant { get; set; }
}
