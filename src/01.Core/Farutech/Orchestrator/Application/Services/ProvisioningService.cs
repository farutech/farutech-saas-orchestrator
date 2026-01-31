using System;
using System.Linq;
using System.Threading.Tasks;
using Farutech.Orchestrator.Application.DTOs.Provisioning;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Microsoft.Extensions.Configuration;
using Farutech.Orchestrator.Application.Extensions;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Service for managing tenant provisioning lifecycle
/// </summary>
public partial class ProvisioningService(IRepository repository, IMessageBus messageBus, IConfiguration configuration, IDatabaseProvisioner databaseProvisioner) : IProvisioningService
{
    private readonly IRepository _repository = repository;
    private readonly IMessageBus _messageBus = messageBus;
    private readonly IConfiguration _configuration = configuration;
    private readonly IDatabaseProvisioner _databaseProvisioner = databaseProvisioner;

    public async Task<ProvisionTenantResponse> ProvisionTenantAsync(ProvisionTenantRequest request)
    {
        // ===== VALIDATION PHASE =====

        // Validate customer exists and is active
        var customer = await _repository.GetCustomerByIdAsync(request.CustomerId) ?? throw new InvalidOperationException($"❌ Customer con ID {request.CustomerId} no existe en la base de datos. Asegúrese de crear primero la organización.");
        if (!customer.IsActive)
            throw new InvalidOperationException($"❌ Customer '{customer.CompanyName}' (ID: {customer.Id}) está inactivo. No se pueden crear instancias para organizaciones inactivas.");

        // Validate product exists and is active
        var product = await _repository.GetProductByIdAsync(request.ProductId) ?? throw new InvalidOperationException($"❌ Product con ID {request.ProductId} no existe en el catálogo. Verifique que el producto esté correctamente cargado en la base de datos.");
        if (!product.IsActive)
            throw new InvalidOperationException($"❌ Product '{product.Name}' (ID: {product.Id}) está inactivo y no puede ser aprovisionado.");

        // Validate subscription plan exists and is active
        var subscriptionPlan = await _repository.GetSubscriptionPlanByIdAsync(request.SubscriptionPlanId) ?? throw new InvalidOperationException($"❌ SubscriptionPlan con ID {request.SubscriptionPlanId} no existe. Verifique que los planes de suscripción estén correctamente cargados.");
        if (!subscriptionPlan.IsActive)
            throw new InvalidOperationException($"❌ Plan de suscripción '{subscriptionPlan.Name}' (ID: {subscriptionPlan.Id}) está inactivo.");

        // Validate that subscription plan belongs to the product
        if (subscriptionPlan.ProductId != product.Id)
            throw new InvalidOperationException($"❌ El plan de suscripción '{subscriptionPlan.Name}' no pertenece al producto '{product.Name}'. Verifique la configuración.");

        // Validate and sanitize code if provided
        if (!string.IsNullOrWhiteSpace(request.Code))
        {
            // Remove whitespace and validate format
            var code = request.Code.Trim();
            
            // Check format: only alphanumeric, dash, and underscore
            if (!MyRegex().IsMatch(code))
            {
                throw new InvalidOperationException("❌ El código solo puede contener letras, números, guiones y guión bajo (sin espacios ni caracteres especiales)");
            }
            
            // Check uniqueness per customer
            var existingInstance = await _repository.GetTenantInstanceByCustomerAndCodeAsync(request.CustomerId, code);
            if (existingInstance != null)
            {
                throw new InvalidOperationException($"❌ Ya existe una instancia con el código '{code}' para esta organización. Elija un código diferente.");
            }
        }

        // Validate name
        _ = request.Name?.Trim() 
            ?? throw new InvalidOperationException("❌ El nombre de la instancia es requerido.");

        // ===== PROVISIONING PHASE =====
        
        // Generate tenant code
        var tenantCode = $"{customer.Code}-{request.DeploymentType}-{Guid.NewGuid().ToString("N")[..8]}";

        // Generate ApiBaseUrl based on environment configuration
        var apiBaseUrl = GenerateApiBaseUrl(tenantCode, product.Code);

        // Create tenant instance
        var tenantInstance = new TenantInstance
        {
            Id = Guid.NewGuid(),
            CustomerId = request.CustomerId,
            TenantCode = tenantCode,
            Code = request.Code?.Trim().ToUpperInvariant(), // User-defined code
            Name = request.Name?.Trim() ?? product.Name ?? "Instance",
            Environment = "production", // production, staging, development
            ApplicationType = product.Code ?? "Generic",
            DeploymentType = request.DeploymentType, // Shared or Dedicated
            Status = "provisioning",
            ConnectionString = $"Host=localhost;Database=tenant_{tenantCode};",
            ApiBaseUrl = apiBaseUrl,
            ActiveFeaturesJson = "{}",
            CreatedBy = "system",
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddTenantInstanceAsync(tenantInstance);
        await _repository.SaveChangesAsync();

        // === DATABASE LIFECYCLE: Ensure DB exists and create schema for tenant ===
        // Decide target database name depending on deployment type
        var isDedicated = string.Equals(request.DeploymentType, "Dedicated", StringComparison.OrdinalIgnoreCase);

        var commonDbName = _configuration["Database:CommonName"] ?? "farutech_db_customers";
        var dedicatedPrefix = _configuration["Database:DedicatedPrefix"] ?? "farutech_db_customer_";

        var targetDatabase = isDedicated
            ? ($"{dedicatedPrefix}{customer.Code?.ToLowerInvariant()}")
            : commonDbName;

        // Schema name requested by product owner: use TenantCode from TenantInstances
        var schemaName = tenantInstance.TenantCode;

        try
        {
            var baseConn = _configuration.GetConnectionString("DefaultConnection")
                           ?? throw new InvalidOperationException("DefaultConnection is not configured");

            // Use infrastructure implementation to prepare DB/schema and obtain tenant-scoped connection string
            var tenantConn = await _databaseProvisioner.PrepareDatabaseAndGetConnectionStringAsync(baseConn, targetDatabase, schemaName);

            tenantInstance.ConnectionString = tenantConn;
            tenantInstance.Status = "provisioning"; // reaffirm status
            tenantInstance.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateTenantInstanceAsync(tenantInstance);
            await _repository.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // If DB lifecycle fails, mark tenant as failed and rethrow
            tenantInstance.Status = "provisioning_failed";
            tenantInstance.UpdatedAt = DateTime.UtcNow;
            tenantInstance.UpdatedBy = "system";
            await _repository.UpdateTenantInstanceAsync(tenantInstance);
            await _repository.SaveChangesAsync();

            throw new InvalidOperationException($"Error provisioning database/schema: {ex.Message}", ex);
        }

        // Get modules included in the subscription plan (through features)
        var moduleIds = subscriptionPlan.SubscriptionFeatures
            .Where(sf => sf.IsEnabled && !sf.Feature.IsDeleted)
            .Select(sf => sf.Feature.ModuleId)
            .Distinct()
            .ToList();

        moduleIds.ThrowIfEmpty($"⚠️  El plan de suscripción '{subscriptionPlan.Name}' no tiene módulos/features habilitados. Verifique la configuración del plan.");

        // Publish provisioning tasks to NATS for each module
        foreach (var moduleId in moduleIds)
        {
            var taskId = Guid.NewGuid().ToString();
                var task = new ProvisioningTaskMessage
            {
                TaskId = taskId,
                TenantId = tenantInstance.Id.ToString(),
                TaskType = "provision",
                ModuleId = moduleId.ToString(),
                Payload = new Dictionary<string, object>
                {
                    ["tenant_code"] = tenantCode,
                    ["customer_id"] = customer.Id.ToString(),
                    ["deployment_type"] = request.DeploymentType, // Shared or Dedicated
                    ["subscription_plan_id"] = request.SubscriptionPlanId.ToString(),
                    ["subscription_plan_name"] = subscriptionPlan.Name,
                        ["custom_features"] = request.CustomFeatures ?? [],
                        // Inform the worker which physical DB and schema were prepared (no credentials)
                        ["database"] = targetDatabase,
                        ["schema"] = schemaName
                },
                Attempt = 1,
                MaxRetries = 5,
                CreatedAt = DateTime.UtcNow
            };

            await _messageBus.PublishProvisioningTaskAsync(task);
        }

        return new ProvisionTenantResponse
        {
            TenantInstanceId = tenantInstance.Id,
            TenantCode = tenantCode,
            Status = "provisioning",
            TaskId = Guid.NewGuid().ToString(),
            CreatedAt = tenantInstance.CreatedAt
        };
    }

    public async Task<bool> DeprovisionTenantAsync(Guid tenantInstanceId)
    {
        var tenant = await _repository.GetTenantInstanceByIdAsync(tenantInstanceId);
        if (tenant == null)
            return false;

        tenant.Status = "deprovisioning";
        tenant.UpdatedAt = DateTime.UtcNow;
        tenant.UpdatedBy = "system";

        await _repository.UpdateTenantInstanceAsync(tenant);
        await _repository.SaveChangesAsync();

        // Publish deprovision task
        var task = new ProvisioningTaskMessage
        {
            TaskId = Guid.NewGuid().ToString(),
            TenantId = tenantInstanceId.ToString(),
            TaskType = "deprovision",
            ModuleId = "all",
            Payload = new Dictionary<string, object>
            {
                ["tenant_code"] = tenant.TenantCode,
                ["reason"] = "manual_deprovision"
            },
            Attempt = 1,
            MaxRetries = 5,
            CreatedAt = DateTime.UtcNow
        };

        await _messageBus.PublishProvisioningTaskAsync(task);

        return true;
    }

    public async Task<bool> UpdateTenantFeaturesAsync(Guid tenantInstanceId, Dictionary<string, object> features)
    {
        var tenant = await _repository.GetTenantInstanceByIdAsync(tenantInstanceId);
        if (tenant == null)
            return false;

        tenant.SetActiveFeatures(features);
        tenant.UpdatedAt = DateTime.UtcNow;
        tenant.UpdatedBy = "system";

        await _repository.UpdateTenantInstanceAsync(tenant);
        await _repository.SaveChangesAsync();

        // Publish update task
        var task = new ProvisioningTaskMessage
        {
            TaskId = Guid.NewGuid().ToString(),
            TenantId = tenantInstanceId.ToString(),
            TaskType = "update",
            ModuleId = "all",
            Payload = new Dictionary<string, object>
            {
                ["tenant_code"] = tenant.TenantCode,
                ["features"] = features
            },
            Attempt = 1,
            MaxRetries = 5,
            CreatedAt = DateTime.UtcNow
        };

        await _messageBus.PublishProvisioningTaskAsync(task);

        return true;
    }

    /// <summary>
    /// Generates the API Base URL for a tenant instance based on environment configuration
    /// </summary>
    /// <param name="tenantCode">Unique tenant code</param>
    /// <param name="productCode">Product code (e.g., FARUPOS, FARUINV)</param>
    /// <returns>Complete API base URL for the instance</returns>
    private string GenerateApiBaseUrl(string tenantCode, string? productCode)
    {
        // Read configuration using indexer syntax
        var useLocalUrls = bool.TryParse(_configuration["Provisioning:UseLocalUrls"], out var localUrls) && localUrls;
        var productionDomain = _configuration["Provisioning:ProductionDomain"] ?? "farutech.app";
        var basePort = int.TryParse(_configuration["Provisioning:LocalhostBasePort"], out var port) ? port : 5100;

        if (useLocalUrls)
        {
            // Development mode: Use localhost with specific port per application
            var targetPort = basePort;
            
            // Try to get application-specific port from configuration
            if (!string.IsNullOrEmpty(productCode))
            {
                var appPortKey = $"Provisioning:ApplicationPorts:{productCode}";
                targetPort = int.TryParse(_configuration[appPortKey], out var appPort) ? appPort : basePort;
            }

            return $"http://localhost:{targetPort}";
        }
        else
        {
            // Production mode: Use subdomain pattern
            return $"https://{tenantCode}.{productionDomain}";
        }
    }

    // Database lifecycle operations are delegated to IDatabaseProvisioner implemented in Infrastructure

    [System.Text.RegularExpressions.GeneratedRegex(@"^[A-Za-z0-9\-_]+$")]
    private static partial System.Text.RegularExpressions.Regex MyRegex();
}
