namespace Farutech.Orchestrator.Application.DTOs.Resolve;

/// <summary>
/// DTO para respuesta de resolución
/// </summary>
public record ResolveResponseDto(
    Guid InstanceId,
    string InstanceName,
    Guid OrganizationId,
    string OrganizationName,
    string ApplicationUrl,
    string Status,
    bool RequiresAuthentication
);