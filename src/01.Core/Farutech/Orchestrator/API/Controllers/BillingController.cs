using Farutech.Orchestrator.Application.DTOs.Billing;
using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Billing API - Gestión de facturación y pagos
/// </summary>
[ApiController]
[Route("api/billing")]
[Authorize]
[ApiExplorerSettings(GroupName = "billing")]
public class BillingController(IBillingService billingService) : ControllerBase
{
    private readonly IBillingService _billingService = billingService;

    /// <summary>
    /// Crea una nueva factura para un cliente
    /// </summary>
    /// <param name="request">Datos de la factura a crear</param>
    /// <returns>Información de la factura creada</returns>
    /// <response code="201">Factura creada exitosamente</response>
    /// <response code="400">Datos inválidos</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpPost("invoices")]
    [ProducesResponseType(typeof(CreateInvoiceResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CreateInvoiceResponse>> CreateInvoice([FromBody] CreateInvoiceRequest request)
    {
        try
        {
            var result = await _billingService.CreateInvoiceAsync(request);
            return CreatedAtAction(nameof(GetInvoice), new { invoiceId = result.InvoiceId }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Obtiene los detalles de una factura específica
    /// </summary>
    /// <param name="invoiceId">ID de la factura</param>
    /// <returns>Detalles completos de la factura</returns>
    /// <response code="200">Factura obtenida exitosamente</response>
    /// <response code="404">Factura no encontrada</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpGet("invoices/{invoiceId:guid}")]
    [ProducesResponseType(typeof(InvoiceDetailsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<InvoiceDetailsDto>> GetInvoice(Guid invoiceId)
    {
        var invoice = await _billingService.GetInvoiceByIdAsync(invoiceId);
        if (invoice == null)
        {
            return NotFound(new { message = "Factura no encontrada" });
        }
        return Ok(invoice);
    }

    /// <summary>
    /// Obtiene todas las facturas de un cliente
    /// </summary>
    /// <param name="customerId">ID del cliente</param>
    /// <returns>Lista de facturas del cliente</returns>
    /// <response code="200">Facturas obtenidas exitosamente</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpGet("customers/{customerId:guid}/invoices")]
    [ProducesResponseType(typeof(IEnumerable<InvoiceSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<InvoiceSummaryDto>>> GetCustomerInvoices(Guid customerId)
    {
        var invoices = await _billingService.GetInvoicesByCustomerAsync(customerId);
        return Ok(invoices);
    }

    /// <summary>
    /// Actualiza el estado de una factura
    /// </summary>
    /// <param name="invoiceId">ID de la factura</param>
    /// <param name="status">Nuevo estado de la factura</param>
    /// <returns>Confirmación de actualización</returns>
    /// <response code="200">Estado actualizado exitosamente</response>
    /// <response code="400">Estado inválido</response>
    /// <response code="404">Factura no encontrada</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpPatch("invoices/{invoiceId:guid}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateInvoiceStatus(Guid invoiceId, [FromBody] UpdateInvoiceStatusRequest request)
    {
        try
        {
            var success = await _billingService.UpdateInvoiceStatusAsync(invoiceId, request.Status);
            if (!success)
            {
                return NotFound(new { message = "Factura no encontrada" });
            }
            return Ok(new { message = "Estado de factura actualizado exitosamente" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Registra un nuevo pago
    /// </summary>
    /// <param name="request">Datos del pago a registrar</param>
    /// <returns>Información del pago creado</returns>
    /// <response code="201">Pago registrado exitosamente</response>
    /// <response code="400">Datos inválidos</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpPost("payments")]
    [ProducesResponseType(typeof(CreatePaymentResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CreatePaymentResponse>> CreatePayment([FromBody] CreatePaymentRequest request)
    {
        try
        {
            var result = await _billingService.CreatePaymentAsync(request);
            return CreatedAtAction(nameof(GetCustomerPayments), new { customerId = request.CustomerId }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Obtiene los pagos de un cliente
    /// </summary>
    /// <param name="customerId">ID del cliente</param>
    /// <returns>Lista de pagos del cliente</returns>
    /// <response code="200">Pagos obtenidos exitosamente</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpGet("customers/{customerId:guid}/payments")]
    [ProducesResponseType(typeof(IEnumerable<PaymentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetCustomerPayments(Guid customerId)
    {
        var payments = await _billingService.GetPaymentsByCustomerAsync(customerId);
        return Ok(payments);
    }

    /// <summary>
    /// Obtiene el saldo pendiente de un cliente
    /// </summary>
    /// <param name="customerId">ID del cliente</param>
    /// <returns>Saldo pendiente del cliente</returns>
    /// <response code="200">Saldo obtenido exitosamente</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpGet("customers/{customerId:guid}/balance")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<decimal>> GetCustomerBalance(Guid customerId)
    {
        var balance = await _billingService.GetCustomerBalanceAsync(customerId);
        return Ok(balance);
    }

    /// <summary>
    /// Obtiene métricas de facturación para un período
    /// </summary>
    /// <param name="startDate">Fecha de inicio del período</param>
    /// <param name="endDate">Fecha de fin del período</param>
    /// <returns>Métricas de facturación</returns>
    /// <response code="200">Métricas obtenidas exitosamente</response>
    /// <response code="401">Usuario no autenticado</response>
    [HttpGet("metrics")]
    [ProducesResponseType(typeof(BillingMetricsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<BillingMetricsDto>> GetBillingMetrics([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var metrics = await _billingService.GetBillingMetricsAsync(startDate, endDate);
        return Ok(metrics);
    }
}

/// <summary>
/// Solicitud para actualizar el estado de una factura
/// </summary>
public record UpdateInvoiceStatusRequest(
    /// <summary>Nuevo estado de la factura</summary>
    string Status
);