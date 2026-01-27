using System.Threading.Tasks;
using Farutech.Orchestrator.Application.DTOs.Provisioning;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Service for provisioning tenant instances
/// </summary>
public interface IProvisioningService
{
    Task<ProvisionTenantResponse> ProvisionTenantAsync(ProvisionTenantRequest request);
    Task<bool> DeprovisionTenantAsync(Guid tenantInstanceId);
    Task<bool> UpdateTenantFeaturesAsync(Guid tenantInstanceId, Dictionary<string, object> features);
}
