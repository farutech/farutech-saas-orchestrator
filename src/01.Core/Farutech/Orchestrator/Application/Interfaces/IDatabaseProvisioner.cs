using System.Threading.Tasks;

namespace Farutech.Orchestrator.Application.Interfaces;

public interface IDatabaseProvisioner
{
    /// <summary>
    /// Ensure the physical database exists, the schema exists, and return a connection string
    /// scoped to the provided schema (SearchPath set).
    /// </summary>
    Task<string> PrepareDatabaseAndGetConnectionStringAsync(string baseConnectionString, string database, string schema);
}
