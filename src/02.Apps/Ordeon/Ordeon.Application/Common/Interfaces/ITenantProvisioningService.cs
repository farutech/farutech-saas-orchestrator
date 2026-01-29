using System;
using System.Threading.Tasks;

namespace Ordeon.Application.Common.Interfaces;

public interface ITenantProvisioningService
{
    /// <summary>
    /// Crea el schema para un nuevo tenant y aplica todas las migraciones pendientes.
    /// </summary>
    Task ProvisionTenantAsync(Guid tenantId);
}
