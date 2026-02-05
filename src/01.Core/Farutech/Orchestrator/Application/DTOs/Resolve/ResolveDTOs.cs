namespace Farutech.Orchestrator.Application.DTOs.Resolve;

/// <summary>
/// Respuesta completa de resolución de instancia para configuración del cliente
/// </summary>
public record ResolveResponseDto(
    /// <summary>ID único de la instancia de aplicación resuelta</summary>
    Guid InstanceId,
    /// <summary>Nombre descriptivo de la instancia</summary>
    string InstanceName,
    /// <summary>ID único de la organización propietaria</summary>
    Guid OrganizationId,
    /// <summary>Nombre comercial de la organización</summary>
    string OrganizationName,
    /// <summary>URL base de la aplicación para redireccionamiento</summary>
    string ApplicationUrl,
    /// <summary>Estado operativo actual de la instancia (Active, Suspended, etc.)</summary>
    string Status,
    /// <summary>Indica si la aplicación requiere autenticación para acceso</summary>
    bool RequiresAuthentication
);