using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Billing API - Gestión de facturación y suscripciones
/// </summary>
[ApiController]
[Route("api/billing")]
[Authorize]
[ApiExplorerSettings(GroupName = "billing")]
public class BillingController(IBillingService billingService) : ControllerBase
{
    private readonly IBillingService _billingService = billingService;

    /// <summary>
    /// Obtiene el estado de facturación de una organización
    /// </summary>
    /// <param name="organizationId">ID de la organización</param>
    /// <returns>Estado de facturación incluyendo suscripciones activas</returns>
    [HttpGet("organizations/{organizationId:guid}")]
    [ProducesResponseType(typeof(BillingStatusDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BillingStatusDto>> GetOrganizationBilling(Guid organizationId)
    {
        var billingStatus = await _billingService.GetBillingStatusAsync(organizationId);
        if (billingStatus == null)
        {
            return NotFound(new { message = "Organización no encontrada" });
        }
        return Ok(billingStatus);
    }

    /// <summary>
    /// Actualiza el plan de una suscripción
    /// </summary>
    /// <param name="subscriptionId">ID de la suscripción</param>
    /// <param name="request">Datos del upgrade</param>
    /// <returns>Resultado de la operación</returns>
    [HttpPost("subscriptions/{subscriptionId:guid}/upgrade")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpgradeSubscription(Guid subscriptionId, [FromBody] UpgradePlanRequest request)
    {
        var result = await _billingService.UpgradeSubscriptionAsync(subscriptionId, request.NewPlanId, request.UserId);
        if (!result.Success)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = "Plan actualizado exitosamente" });
    }

    /// <summary>
    /// Obtiene el historial de facturas de una organización
    /// </summary>
    /// <param name="organizationId">ID de la organización</param>
    /// <returns>Lista de facturas</returns>
    [HttpGet("organizations/{organizationId:guid}/invoices")]
    [ProducesResponseType(typeof(IEnumerable<InvoiceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetInvoices(Guid organizationId)
    {
        var invoices = await _billingService.GetInvoicesAsync(organizationId);
        return Ok(invoices);
    }
}

/// <summary>
/// DTO para solicitud de upgrade de plan
/// </summary>
public record UpgradePlanRequest(Guid NewPlanId, Guid UserId);

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
    DateTime? EndDate
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