namespace Farutech.Orchestrator.Application.DTOs.Applications;

/// <summary>
/// Información detallada de una aplicación/instancia
/// </summary>
public record ApplicationInfoDto(
    /// <summary>ID único de la aplicación</summary>
    Guid Id,
    /// <summary>ID de la organización propietaria</summary>
    Guid CustomerId,
    /// <summary>Código único de la instancia (generado automáticamente)</summary>
    string TenantCode,
    /// <summary>Código personalizado definido por el usuario</summary>
    string? Code,
    /// <summary>Nombre descriptivo de la aplicación</summary>
    string Name,
    /// <summary>Entorno de despliegue (production, staging, development)</summary>
    string Environment,
    /// <summary>Tipo de aplicación (Veterinaria, ERP, POS, etc.)</summary>
    string ApplicationType,
    /// <summary>Tipo de despliegue (Shared, Dedicated)</summary>
    string DeploymentType,
    /// <summary>Estado actual de la aplicación</summary>
    string Status,
    /// <summary>URL base de la API (si aplica)</summary>
    string? ApiBaseUrl,
    /// <summary>Fecha de aprovisionamiento</summary>
    DateTime? ProvisionedAt,
    /// <summary>Último acceso registrado</summary>
    DateTime? LastAccessAt,
    /// <summary>Color del tema personalizado</summary>
    string? ThemeColor,
    /// <summary>Características activas en formato JSON</summary>
    string ActiveFeaturesJson
);

/// <summary>
/// Información resumida de una aplicación para listados
/// </summary>
public record ApplicationSummaryDto(
    /// <summary>ID único de la aplicación</summary>
    Guid Id,
    /// <summary>Código personalizado o generado</summary>
    string Code,
    /// <summary>Nombre descriptivo</summary>
    string Name,
    /// <summary>Tipo de aplicación</summary>
    string ApplicationType,
    /// <summary>Entorno</summary>
    string Environment,
    /// <summary>Estado actual</summary>
    string Status,
    /// <summary>Fecha de último acceso</summary>
    DateTime? LastAccessAt
);