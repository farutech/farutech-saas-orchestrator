namespace Farutech.Orchestrator.Application.DTOs.Billing;

/// <summary>
/// DTO para estado de facturación
/// </summary>
public record BillingStatusDto(
    Guid OrganizationId,
    string OrganizationName,
    IEnumerable<SubscriptionDto> ActiveSubscriptions,
    decimal TotalMonthlyCost,
    DateTime? NextBillingDate
);

/// <summary>
/// DTO para suscripción
/// </summary>
public record SubscriptionDto(
    Guid Id,
    string ProductName,
    string PlanName,
    decimal Price,
    string Status,
    DateTime StartDate,
    DateTime? EndDate,
    DateTime? NextBillingDate
);

/// <summary>
/// DTO para factura
/// </summary>
public record InvoiceDto(
    Guid Id,
    DateTime IssueDate,
    decimal Amount,
    string Status,
    string DownloadUrl
);