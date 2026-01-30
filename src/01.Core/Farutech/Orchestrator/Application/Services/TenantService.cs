using Farutech.Orchestrator.Application.DTOs.Tenants;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Service implementation for Tenant business operations
/// </summary>
public class TenantService(ITenantRepository tenantRepository, ICustomerRepository customerRepository) : ITenantService
{
    private readonly ITenantRepository _tenantRepository = tenantRepository;
    private readonly ICustomerRepository _customerRepository = customerRepository;

    /// <inheritdoc />
    public async Task<TenantInstance> CreateTenantAsync(CreateTenantRequest request, CancellationToken cancellationToken = default)
    {
        // Validate customer exists
        var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (customer == null)
        {
            throw new KeyNotFoundException($"Customer with ID {request.CustomerId} not found.");
        }

        // Validate code uniqueness (only if code is provided)
        if (request.Code != null && !await IsCodeAvailableAsync(request.Code, cancellationToken: cancellationToken))
        {
            throw new InvalidOperationException($"Tenant code '{request.Code}' is already in use.");
        }

        var tenant = new TenantInstance
        {
            CustomerId = request.CustomerId,
            TenantCode = request.TenantCode,
            Code = request.Code,
            Name = request.Name,
            Environment = request.Environment ?? "production",
            ApplicationType = request.ApplicationType ?? "Generic",
            DeploymentType = request.DeploymentType ?? "Shared",
            ConnectionString = request.ConnectionString,
            Status = "provisioning"
        };

        await _tenantRepository.AddAsync(tenant, cancellationToken);
        return tenant;
    }

    /// <inheritdoc />
    public async Task<TenantInstance?> GetTenantByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _tenantRepository.GetByIdAsync(id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<TenantInstance?> GetTenantByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        return await _tenantRepository.GetByCodeAsync(code, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IEnumerable<TenantInstance>> GetTenantsByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        return await _tenantRepository.GetByCustomerIdAsync(customerId, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<TenantInstance> UpdateTenantAsync(Guid id, UpdateTenantRequest request, CancellationToken cancellationToken = default)
    {
        var tenant = await _tenantRepository.GetByIdAsync(id, cancellationToken);
        if (tenant == null)
        {
            throw new KeyNotFoundException($"Tenant with ID {id} not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            tenant.Name = request.Name;
        }

        if (!string.IsNullOrWhiteSpace(request.Code))
        {
            tenant.Code = request.Code;
        }

        if (!string.IsNullOrWhiteSpace(request.Environment))
        {
            tenant.Environment = request.Environment;
        }

        if (!string.IsNullOrWhiteSpace(request.ApplicationType))
        {
            tenant.ApplicationType = request.ApplicationType;
        }

        if (!string.IsNullOrWhiteSpace(request.DeploymentType))
        {
            tenant.DeploymentType = request.DeploymentType;
        }

        if (!string.IsNullOrWhiteSpace(request.ConnectionString))
        {
            tenant.ConnectionString = request.ConnectionString;
        }

        if (!string.IsNullOrWhiteSpace(request.ApiBaseUrl))
        {
            tenant.ApiBaseUrl = request.ApiBaseUrl;
        }

        tenant.UpdatedAt = DateTime.UtcNow;

        await _tenantRepository.UpdateAsync(tenant, cancellationToken);
        return tenant;
    }

    /// <inheritdoc />
    public async Task DeleteTenantAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var tenant = await _tenantRepository.GetByIdAsync(id, cancellationToken);
        if (tenant == null)
        {
            throw new KeyNotFoundException($"Tenant with ID {id} not found.");
        }

        await _tenantRepository.DeleteAsync(tenant, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<TenantInstance> ChangeTenantStatusAsync(Guid id, string status, CancellationToken cancellationToken = default)
    {
        var tenant = await _tenantRepository.GetByIdAsync(id, cancellationToken);
        if (tenant == null)
        {
            throw new KeyNotFoundException($"Tenant with ID {id} not found.");
        }

        tenant.Status = status;
        tenant.UpdatedAt = DateTime.UtcNow;

        await _tenantRepository.UpdateAsync(tenant, cancellationToken);
        return tenant;
    }

    /// <inheritdoc />
    public async Task<bool> IsCodeAvailableAsync(string code, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        var existingTenant = await _tenantRepository.GetByCodeAsync(code, cancellationToken);
        return existingTenant == null || existingTenant.Id == excludeId;
    }
}