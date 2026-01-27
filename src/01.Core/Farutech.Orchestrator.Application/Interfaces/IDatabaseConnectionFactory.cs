namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Factory para construir connection strings dinámicos basados en el tipo de despliegue (Shared vs Dedicated)
/// </summary>
public interface IDatabaseConnectionFactory
{
    /// <summary>
    /// Construye un connection string para un tenant específico
    /// </summary>
    /// <param name="customerId">ID del cliente/organización</param>
    /// <param name="tenantId">ID del tenant (usado para el esquema)</param>
    /// <param name="isDedicated">True si el tenant usa base de datos dedicada</param>
    /// <param name="orgIdentifier">Identificador de la organización (solo para instancias dedicadas)</param>
    /// <returns>Connection string configurado con el esquema correcto</returns>
    string BuildConnectionString(
        Guid customerId,
        Guid tenantId,
        bool isDedicated,
        string? orgIdentifier = null);

    /// <summary>
    /// Obtiene el nombre del esquema para una instancia tenant
    /// </summary>
    /// <param name="tenantId">ID del tenant</param>
    /// <returns>Nombre del esquema con formato tenant_{guid}</returns>
    string GetSchemaName(Guid tenantId);

    /// <summary>
    /// Valida si un nombre de esquema cumple con el patrón estándar
    /// </summary>
    /// <param name="schemaName">Nombre del esquema a validar</param>
    /// <returns>True si el esquema es válido</returns>
    bool IsValidSchemaName(string schemaName);
}
