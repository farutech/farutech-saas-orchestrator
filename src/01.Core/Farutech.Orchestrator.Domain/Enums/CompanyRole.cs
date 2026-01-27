namespace Farutech.Orchestrator.Domain.Enums;

/// <summary>
/// Roles disponibles para usuarios dentro de una empresa (Customer).
/// </summary>
public enum CompanyRole
{
    /// <summary>
    /// Administrador de la empresa. Puede gestionar usuarios, instancias y suscripciones.
    /// </summary>
    CompanyAdmin,

    /// <summary>
    /// Operador de instancias. Puede iniciar/detener instancias y ver configuraciones.
    /// </summary>
    InstanceOperator,

    /// <summary>
    /// Contador o consultor externo. Solo lectura de datos financieros y reportes.
    /// </summary>
    ExternalAccountant,

    /// <summary>
    /// Visualizador. Solo lectura de información básica.
    /// </summary>
    Viewer
}
