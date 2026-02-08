using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Microsoft.Extensions.Configuration;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Factory que construye connection strings dinámicamente basándose en el modelo Shared vs Dedicated.
/// Implementa la estrategia definida en ESTRATEGIA_DESPLIEGUE_DB.md
/// </summary>
public class DatabaseConnectionFactory : IDatabaseConnectionFactory
{
    private readonly IConfiguration _configuration;
    private readonly string _baseHost;
    private readonly string _basePort;
    private readonly string _baseUser;
    private readonly string _basePassword;

    public DatabaseConnectionFactory(IConfiguration configuration)
    {
        _configuration = configuration;
        
        // Lee configuración base desde appsettings.json
        var baseConnection = _configuration.GetConnectionString("DefaultConnection") 
            ?? "Host=localhost;Port=5432;Username=postgres;Password=SuperSecurePassword123";
        
        // Parsea los componentes
        var parts = ParseConnectionString(baseConnection);
        _baseHost = parts.GetValueOrDefault("Host", "localhost");
        _basePort = parts.GetValueOrDefault("Port", "5432");
        _baseUser = parts.GetValueOrDefault("Username", "postgres");
        _basePassword = parts.GetValueOrDefault("Password", "SuperSecurePassword123");
    }

    /// <summary>
    /// Construye la connection string apropiada según el tipo de deployment.
    /// </summary>
    /// <param name="customerId">ID del cliente/organización</param>
    /// <param name="tenantId">ID de la instancia tenant</param>
    /// <param name="isDedicated">Si es infraestructura dedicada o compartida</param>
    /// <param name="orgIdentifier">Identificador único del cliente (para DB dedicada)</param>
    /// <returns>Connection string con el esquema configurado</returns>
    public string BuildConnectionString(
        Guid customerId, 
        Guid tenantId, 
        bool isDedicated, 
        string? orgIdentifier = null)
    {
        string databaseName;
        
        if (isDedicated)
        {
            // CASO B: CLIENTE ENTERPRISE (Dedicated Infrastructure)
            // DB física independiente: farutech_db_customer_{OrgIdentifier}
            if (string.IsNullOrWhiteSpace(orgIdentifier))
            {
                throw new ArgumentException(
                    "OrgIdentifier es requerido para clientes con infraestructura dedicada", 
                    nameof(orgIdentifier));
            }
            
            databaseName = $"farutech_db_customer_{orgIdentifier.ToLowerInvariant()}";
        }
        else
        {
            // CASO A: CLIENTE ESTÁNDAR (Shared Infrastructure)
            // DB compartida central
            databaseName = "farutech_db_customers";
        }
        
        // El esquema SIEMPRE sigue el patrón tenant_{TenantId}
        var schemaName = $"tenant_{tenantId:N}"; // N = sin guiones
        
        // Construye la connection string con SearchPath configurado
        var connectionString = $"Host={_baseHost};" +
                              $"Port={_basePort};" +
                              $"Database={databaseName};" +
                              $"Username={_baseUser};" +
                              $"Password={_basePassword};" +
                              $"SearchPath={schemaName};" +
                              $"Include Error Detail=true";
        
        return connectionString;
    }

    /// <summary>
    /// Obtiene el nombre del esquema para una instancia tenant.
    /// </summary>
    public string GetSchemaName(Guid tenantId)
        => $"tenant_{tenantId:N}";

    /// <summary>
    /// Valida si un nombre de esquema cumple con el patrón estándar.
    /// </summary>
    public bool IsValidSchemaName(string schemaName)
    {
        if (string.IsNullOrWhiteSpace(schemaName))
            return false;
            
        // Debe empezar con tenant_ seguido de un GUID sin guiones (32 caracteres hex)
        if (!schemaName.StartsWith("tenant_"))
            return false;
            
        var guidPart = schemaName.Substring(7);
        return guidPart.Length == 32 && Guid.TryParseExact(guidPart, "N", out _);
    }

    private Dictionary<string, string> ParseConnectionString(string connectionString)
    {
        var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        
        foreach (var part in connectionString.Split(';', StringSplitOptions.RemoveEmptyEntries))
        {
            var keyValue = part.Split('=', 2);
            if (keyValue.Length == 2)
            {
                result[keyValue[0].Trim()] = keyValue[1].Trim();
            }
        }
        
        return result;
    }
}
