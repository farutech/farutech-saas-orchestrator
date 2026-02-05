using System;
using System.Linq;
using System.Threading.Tasks;
using Farutech.Orchestrator.Application.DTOs.Provisioning;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Farutech.Orchestrator.Application.Extensions;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Service for managing tenant provisioning lifecycle
/// </summary>
public partial class ProvisioningService(IRepository repository, IMessageBus messageBus, IConfiguration configuration, IDatabaseProvisioner databaseProvisioner, IAsyncOrchestrator asyncOrchestrator, ITaskTrackerService taskTracker, IMetricsService metricsService) : IProvisioningService
{
    private readonly IRepository _repository = repository;
    private readonly IMessageBus _messageBus = messageBus;
    private readonly IConfiguration _configuration = configuration;
    private readonly IDatabaseProvisioner _databaseProvisioner = databaseProvisioner;
    private readonly IAsyncOrchestrator _asyncOrchestrator = asyncOrchestrator;
    private readonly ITaskTrackerService _taskTracker = taskTracker;
    private readonly IMetricsService _metricsService = metricsService;

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

        // Create tenant instance with PENDING status
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
            Status = "PENDING_PROVISION", // Changed from "provisioning"
            ConnectionString = $"Host=localhost;Database=tenant_{tenantCode};",
            ApiBaseUrl = apiBaseUrl,
            ThemeColor = request.ThemeColor,
            ActiveFeaturesJson = "{}",
            CreatedBy = "system",
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddTenantInstanceAsync(tenantInstance);
        await _repository.SaveChangesAsync();

        // Queue async provisioning task
        var asyncResponse = await _asyncOrchestrator.QueueTenantProvisionAsync(tenantInstance.Id, request, "system"); // TODO: Get actual user ID

        // Record metrics
        _metricsService.RecordTaskCreated(ProvisionTaskType.TenantProvision, "pending");

        return new ProvisionTenantResponse
        {
            TenantInstanceId = tenantInstance.Id,
            TenantCode = tenantCode,
            Status = "QUEUED",
            TaskId = asyncResponse.TaskId,
            CreatedAt = tenantInstance.CreatedAt,
            Tracking = new TaskTrackingInfo
            {
                StatusUrl = $"/api/provisioning/tasks/{asyncResponse.TaskId}/status", // Relative URL, will be made absolute in controller
                WebSocketUrl = $"/ws/tasks/{asyncResponse.TaskId}", // Relative URL, will be made absolute in controller
                EstimatedCompletion = tenantInstance.CreatedAt.AddMinutes(5), // Estimated 5 minutes for provisioning
                ProgressUpdateFrequency = 5
            }
        };
    }

    public async Task<DeprovisionTenantResponse> DeprovisionTenantAsync(Guid tenantInstanceId)
    {
        var tenant = await _repository.GetTenantInstanceByIdAsync(tenantInstanceId);
        if (tenant == null)
            throw new InvalidOperationException($"Tenant instance {tenantInstanceId} not found");

        tenant.Status = "PENDING_DEPROVISION";
        tenant.UpdatedAt = DateTime.UtcNow;
        tenant.UpdatedBy = "system";

        await _repository.UpdateTenantInstanceAsync(tenant);
        await _repository.SaveChangesAsync();

        // Queue async deprovision task
        var asyncResponse = await _asyncOrchestrator.QueueTenantDeprovisionAsync(tenantInstanceId);

        // Record metrics
        _metricsService.RecordTaskCreated(ProvisionTaskType.TenantDeprovision, "pending");

        return new DeprovisionTenantResponse
        {
            TenantInstanceId = tenantInstanceId,
            TaskId = asyncResponse.TaskId,
            InitiatedAt = DateTime.UtcNow,
            Tracking = new TaskTrackingInfo
            {
                StatusUrl = $"/api/provisioning/tasks/{asyncResponse.TaskId}/status",
                WebSocketUrl = $"/ws/tasks/{asyncResponse.TaskId}",
                EstimatedCompletion = DateTime.UtcNow.AddMinutes(3), // Estimated 3 minutes for deprovisioning
                ProgressUpdateFrequency = 5
            }
        };
    }

    public async Task<UpdateFeaturesResponse> UpdateTenantFeaturesAsync(Guid tenantInstanceId, Dictionary<string, object> features)
    {
        var tenant = await _repository.GetTenantInstanceByIdAsync(tenantInstanceId);
        if (tenant == null)
            throw new InvalidOperationException($"Tenant instance {tenantInstanceId} not found");

        // Mark as pending update - actual update will be done by worker
        tenant.Status = "PENDING_FEATURE_UPDATE";
        tenant.UpdatedAt = DateTime.UtcNow;
        tenant.UpdatedBy = "system";

        await _repository.UpdateTenantInstanceAsync(tenant);
        await _repository.SaveChangesAsync();

        // Queue async feature update task
        var asyncResponse = await _asyncOrchestrator.QueueFeatureUpdateAsync(tenantInstanceId, features);

        // Record metrics
        _metricsService.RecordTaskCreated(ProvisionTaskType.FeatureUpdate, "pending");

        return new UpdateFeaturesResponse
        {
            TenantInstanceId = tenantInstanceId,
            TaskId = asyncResponse.TaskId,
            InitiatedAt = DateTime.UtcNow,
            Tracking = new TaskTrackingInfo
            {
                StatusUrl = $"/api/provisioning/tasks/{asyncResponse.TaskId}/status",
                WebSocketUrl = $"/ws/tasks/{asyncResponse.TaskId}",
                EstimatedCompletion = DateTime.UtcNow.AddMinutes(2), // Estimated 2 minutes for feature updates
                ProgressUpdateFrequency = 5
            }
        };
    }

    public async Task<TaskStatusResponse> GetTaskStatusAsync(string taskId)
    {
        var task = await _taskTracker.GetTaskAsync(taskId);
        if (task == null)
            throw new InvalidOperationException($"Task {taskId} not found");

        // Parse steps completed from JSON
        var stepsCompleted = new List<string>();
        if (!string.IsNullOrEmpty(task.StepsCompletedJson))
        {
            try
            {
                stepsCompleted = System.Text.Json.JsonSerializer.Deserialize<List<string>>(task.StepsCompletedJson) ?? new List<string>();
            }
            catch
            {
                // If JSON parsing fails, leave stepsCompleted empty
            }
        }

        return new TaskStatusResponse
        {
            TaskId = task.TaskId,
            TaskType = task.TaskType,
            Status = task.Status,
            Progress = task.Progress,
            CurrentStep = task.CurrentStep,
            StepsCompleted = stepsCompleted,
            ErrorMessage = task.ErrorMessage,
            RetryCount = task.RetryCount,
            MaxRetries = task.MaxRetries,
            CreatedAt = task.CreatedAt,
            StartedAt = task.StartedAt,
            CompletedAt = task.CompletedAt,
            EstimatedCompletion = task.EstimatedCompletion,
            InitiatedBy = task.InitiatedBy,
            WorkerId = task.WorkerId,
            TenantInstanceId = task.TenantInstanceId,
            Tracking = new TaskTrackingInfo
            {
                StatusUrl = $"/api/provisioning/tasks/{taskId}/status",
                WebSocketUrl = $"/ws/tasks/{taskId}",
                EstimatedCompletion = task.EstimatedCompletion,
                ProgressUpdateFrequency = 5
            }
        };
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

    // Worker callback methods
    public async Task UpdateTaskStatusAsync(string taskId, ProvisionTaskStatus status, int progress, string? currentStep = null, string? errorMessage = null)
    {
        var task = await _taskTracker.GetTaskAsync(taskId);
        if (task == null)
            throw new InvalidOperationException($"Task {taskId} not found");

        await _taskTracker.UpdateTaskStatusAsync(taskId, status, progress, currentStep, errorMessage);
    }

    public async Task AddCompletedStepAsync(string taskId, string step)
    {
        await _taskTracker.AddCompletedStepAsync(taskId, step);
    }

    public async Task MarkTaskCompletedAsync(string taskId)
    {
        var task = await _taskTracker.GetTaskAsync(taskId);
        if (task == null)
            throw new InvalidOperationException($"Task {taskId} not found");

        var duration = DateTime.UtcNow - task.CreatedAt;
        await _taskTracker.MarkTaskCompletedAsync(taskId);

        // Record completion metrics
        _metricsService.RecordTaskCompleted(task.TaskType, "completed", duration.TotalSeconds);
    }

    public async Task MarkTaskFailedAsync(string taskId, string errorMessage)
    {
        var task = await _taskTracker.GetTaskAsync(taskId);
        if (task == null)
            throw new InvalidOperationException($"Task {taskId} not found");

        var duration = DateTime.UtcNow - task.CreatedAt;
        await _taskTracker.MarkTaskFailedAsync(taskId, errorMessage);

        // Record failure metrics
        _metricsService.RecordTaskCompleted(task.TaskType, "failed", duration.TotalSeconds);
    }

    // Database lifecycle operations are delegated to IDatabaseProvisioner implemented in Infrastructure

    [System.Text.RegularExpressions.GeneratedRegex(@"^[A-Za-z0-9\-_]+$")]
    private static partial System.Text.RegularExpressions.Regex MyRegex();
}
