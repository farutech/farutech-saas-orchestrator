using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Servicio para sincronizar tenants entre Orchestrator e IAM
/// </summary>
public class TenantSyncService : ITenantSyncService
{
    private readonly HttpClient _iamHttpClient;
    private readonly ILogger<TenantSyncService> _logger;

    public TenantSyncService(HttpClient iamHttpClient, ILogger<TenantSyncService> logger)
    {
        _iamHttpClient = iamHttpClient;
        _logger = logger;

        // Configurar base address para IAM API
        _iamHttpClient.BaseAddress = new Uri("http://iam-api:8080"); // Ajustar según configuración
    }

    /// <summary>
    /// Crea tenant correspondiente en IAM cuando se crea customer en Orchestrator
    /// </summary>
    public async Task<bool> CreateTenantInIamAsync(Customer customer, Guid ownerUserId)
    {
        try
        {
            var iamTenantRequest = new
            {
                code = customer.Code,
                name = customer.CompanyName,
                taxId = customer.TaxId,
                requireMfa = false,
                sessionTimeoutMinutes = 480,
                passwordPolicy = @"{""minLength"":8,""requireUppercase"":true,""requireLowercase"":true,""requireDigit"":true,""requireSpecialChar"":true}",
                featureFlags = @"{""allowMultipleSessions"":true,""maxConcurrentSessions"":3}",
                isActive = customer.IsActive,
                createdByUserId = ownerUserId
            };

            var response = await _iamHttpClient.PostAsJsonAsync("/api/admin/tenants", iamTenantRequest);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<IamTenantResponse>();
                _logger.LogInformation("Tenant {TenantCode} created in IAM for customer {CustomerId}",
                    customer.Code, customer.Id);

                // Actualizar customer con tenantId de IAM
                customer.IamTenantId = result!.TenantId;
                customer.IamTenantCode = result.TenantCode;

                return true;
            }
            else
            {
                _logger.LogError("Failed to create tenant in IAM: {StatusCode} - {Reason}",
                    response.StatusCode, response.ReasonPhrase);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating tenant in IAM for customer {CustomerId}", customer.Id);
            return false;
        }
    }

    /// <summary>
    /// Actualiza tenant en IAM cuando se modifica customer
    /// </summary>
    public async Task<bool> UpdateTenantInIamAsync(Customer customer)
    {
        try
        {
            var iamUpdateRequest = new
            {
                name = customer.CompanyName,
                taxId = customer.TaxId,
                isActive = customer.IsActive
            };

            var response = await _iamHttpClient.PutAsJsonAsync($"/api/admin/tenants/{customer.IamTenantId}", iamUpdateRequest);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Tenant {IamTenantId} updated in IAM for customer {CustomerId}",
                    customer.IamTenantId, customer.Id);
                return true;
            }
            else
            {
                _logger.LogError("Failed to update tenant in IAM: {StatusCode}", response.StatusCode);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating tenant in IAM for customer {CustomerId}", customer.Id);
            return false;
        }
    }

    /// <summary>
    /// Desactiva tenant en IAM cuando se desactiva customer
    /// </summary>
    public async Task<bool> DeactivateTenantInIamAsync(Customer customer)
    {
        try
        {
            var response = await _iamHttpClient.PatchAsync($"/api/admin/tenants/{customer.IamTenantId}/deactivate", null);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Tenant {IamTenantId} deactivated in IAM for customer {CustomerId}",
                    customer.IamTenantId, customer.Id);
                return true;
            }
            else
            {
                _logger.LogError("Failed to deactivate tenant in IAM: {StatusCode}", response.StatusCode);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deactivating tenant in IAM for customer {CustomerId}", customer.Id);
            return false;
        }
    }
}

public class IamTenantResponse
{
    public Guid TenantId { get; set; }
    public string TenantCode { get; set; } = string.Empty;
}