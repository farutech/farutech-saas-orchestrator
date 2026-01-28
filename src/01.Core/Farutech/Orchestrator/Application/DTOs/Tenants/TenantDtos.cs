namespace Farutech.Orchestrator.Application.DTOs.Tenants;

/// <summary>
/// Request DTO for creating a new customer
/// </summary>
public class CreateCustomerRequest
{
    public required string Code { get; set; }
    public required string CompanyName { get; set; }
    public required string TaxId { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
}

/// <summary>
/// Request DTO for updating a customer
/// </summary>
public class UpdateCustomerRequest
{
    public string? CompanyName { get; set; }
    public string? TaxId { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
}

/// <summary>
/// Request DTO for creating a new tenant
/// </summary>
public class CreateTenantRequest
{
    public required Guid CustomerId { get; set; }
    public required string TenantCode { get; set; }
    public string? Code { get; set; }
    public required string Name { get; set; }
    public string? Environment { get; set; }
    public string? ApplicationType { get; set; }
    public string? DeploymentType { get; set; }
    public required string ConnectionString { get; set; }
    public string? ApiBaseUrl { get; set; }
}

/// <summary>
/// Request DTO for updating a tenant
/// </summary>
public class UpdateTenantRequest
{
    public string? Name { get; set; }
    public string? Code { get; set; }
    public string? Environment { get; set; }
    public string? ApplicationType { get; set; }
    public string? DeploymentType { get; set; }
    public string? ConnectionString { get; set; }
    public string? ApiBaseUrl { get; set; }
}