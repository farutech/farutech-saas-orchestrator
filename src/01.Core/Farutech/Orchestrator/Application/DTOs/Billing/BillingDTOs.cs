namespace Farutech.Orchestrator.Application.DTOs.Billing;

/// <summary>
/// Estado completo de facturación de una organización incluyendo suscripciones activas
/// </summary>
public record BillingStatusDto(
    /// <summary>ID único de la organización</summary>
    Guid OrganizationId,
    /// <summary>Nombre comercial de la organización</summary>
    string OrganizationName,
    /// <summary>Lista de suscripciones activas de la organización</summary>
    IEnumerable<SubscriptionDto> ActiveSubscriptions,
    /// <summary>Costo total mensual de todas las suscripciones activas</summary>
    decimal TotalMonthlyCost,
    /// <summary>Próxima fecha de facturación programada</summary>
    DateTime? NextBillingDate
);

/// <summary>
/// Información detallada de una suscripción activa
/// </summary>
public record SubscriptionDto(
    /// <summary>ID único de la suscripción</summary>
    Guid Id,
    /// <summary>Nombre del producto suscrito</summary>
    string ProductName,
    /// <summary>Nombre del plan de suscripción contratado</summary>
    string PlanName,
    /// <summary>Precio mensual de la suscripción</summary>
    decimal Price,
    /// <summary>Estado actual de la suscripción (active, suspended, cancelled)</summary>
    string Status,
    /// <summary>Fecha de inicio de la suscripción</summary>
    DateTime StartDate,
    /// <summary>Fecha de finalización de la suscripción (null para suscripciones indefinidas)</summary>
    DateTime? EndDate,
    /// <summary>Próxima fecha de facturación programada</summary>
    DateTime? NextBillingDate
);

/// <summary>
/// Información de una factura emitida
/// </summary>
public record InvoiceDto(
    /// <summary>ID único de la factura</summary>
    Guid Id,
    /// <summary>Fecha de emisión de la factura</summary>
    DateTime IssueDate,
    /// <summary>Monto total de la factura</summary>
    decimal Amount,
    /// <summary>Estado de la factura (pending, paid, overdue, cancelled)</summary>
    string Status,
    /// <summary>URL para descargar el PDF de la factura</summary>
    string DownloadUrl
);

/// <summary>
/// Solicitud para crear una nueva factura
/// </summary>
public record CreateInvoiceRequest(
    /// <summary>ID del cliente</summary>
    Guid CustomerId,
    /// <summary>Fecha de vencimiento</summary>
    DateTime DueDate,
    /// <summary>Moneda de la factura</summary>
    string Currency,
    /// <summary>Items de la factura</summary>
    IEnumerable<CreateInvoiceItemRequest> Items,
    /// <summary>Notas adicionales</summary>
    string? Notes,
    /// <summary>Términos y condiciones</summary>
    string? Terms
);

/// <summary>
/// Item para crear en una factura
/// </summary>
public record CreateInvoiceItemRequest(
    /// <summary>Descripción del item</summary>
    string Description,
    /// <summary>Tipo de item</summary>
    string ItemType,
    /// <summary>ID de referencia (opcional)</summary>
    Guid? ReferenceId,
    /// <summary>Cantidad</summary>
    decimal Quantity,
    /// <summary>Precio unitario</summary>
    decimal UnitPrice,
    /// <summary>Descuento aplicado</summary>
    decimal Discount,
    /// <summary>Período de facturación</summary>
    string? BillingPeriod
);

/// <summary>
/// Respuesta al crear una factura
/// </summary>
public record CreateInvoiceResponse(
    /// <summary>ID de la factura creada</summary>
    Guid InvoiceId,
    /// <summary>Número de factura generado</summary>
    string InvoiceNumber,
    /// <summary>Total de la factura</summary>
    decimal TotalAmount
);

/// <summary>
/// Detalles completos de una factura
/// </summary>
public record InvoiceDetailsDto(
    /// <summary>ID único de la factura</summary>
    Guid Id,
    /// <summary>Número de factura</summary>
    string InvoiceNumber,
    /// <summary>ID del cliente</summary>
    Guid CustomerId,
    /// <summary>Nombre del cliente</summary>
    string CustomerName,
    /// <summary>Fecha de emisión</summary>
    DateTime IssueDate,
    /// <summary>Fecha de vencimiento</summary>
    DateTime DueDate,
    /// <summary>Estado de la factura</summary>
    string Status,
    /// <summary>Moneda</summary>
    string Currency,
    /// <summary>Subtotal</summary>
    decimal Subtotal,
    /// <summary>Descuento</summary>
    decimal Discount,
    /// <summary>Impuestos</summary>
    decimal TaxAmount,
    /// <summary>Total</summary>
    decimal TotalAmount,
    /// <summary>Notas</summary>
    string? Notes,
    /// <summary>Términos</summary>
    string? Terms,
    /// <summary>Items de la factura</summary>
    IEnumerable<InvoiceItemDto> Items,
    /// <summary>Pagos aplicados</summary>
    IEnumerable<PaymentDto> Payments
);

/// <summary>
/// Detalles de un item de factura
/// </summary>
public record InvoiceItemDto(
    /// <summary>ID del item</summary>
    Guid Id,
    /// <summary>Descripción</summary>
    string Description,
    /// <summary>Tipo de item</summary>
    string ItemType,
    /// <summary>Cantidad</summary>
    decimal Quantity,
    /// <summary>Precio unitario</summary>
    decimal UnitPrice,
    /// <summary>Descuento</summary>
    decimal Discount,
    /// <summary>Total</summary>
    decimal TotalPrice,
    /// <summary>Período de facturación</summary>
    string? BillingPeriod
);

/// <summary>
/// Información de un pago
/// </summary>
public record PaymentDto(
    /// <summary>ID del pago</summary>
    Guid Id,
    /// <summary>Monto del pago</summary>
    decimal Amount,
    /// <summary>Método de pago</summary>
    string Method,
    /// <summary>Estado del pago</summary>
    string Status,
    /// <summary>Fecha de procesamiento</summary>
    DateTime? ProcessedAt,
    /// <summary>Referencia externa</summary>
    string? ExternalReference
);

/// <summary>
/// Solicitud para registrar un pago
/// </summary>
public record CreatePaymentRequest(
    /// <summary>ID del cliente</summary>
    Guid CustomerId,
    /// <summary>Monto del pago</summary>
    decimal Amount,
    /// <summary>Método de pago</summary>
    string PaymentMethod,
    /// <summary>Referencia externa</summary>
    string? ExternalReference,
    /// <summary>Notas</summary>
    string? Notes,
    /// <summary>Aplicaciones del pago a facturas</summary>
    IEnumerable<PaymentApplicationRequest> Applications
);

/// <summary>
/// Aplicación de un pago a una factura específica
/// </summary>
public record PaymentApplicationRequest(
    /// <summary>ID de la factura</summary>
    Guid InvoiceId,
    /// <summary>Monto aplicado a esta factura</summary>
    decimal Amount
);

/// <summary>
/// Respuesta al crear un pago
/// </summary>
public record CreatePaymentResponse(
    /// <summary>ID del pago creado</summary>
    Guid PaymentId,
    /// <summary>Referencia del pago</summary>
    string PaymentReference,
    /// <summary>Monto procesado</summary>
    decimal Amount
);

/// <summary>
/// Resumen de una factura para listados
/// </summary>
public record InvoiceSummaryDto(
    /// <summary>ID único de la factura</summary>
    Guid Id,
    /// <summary>Número de factura</summary>
    string InvoiceNumber,
    /// <summary>Fecha de emisión</summary>
    DateTime IssueDate,
    /// <summary>Fecha de vencimiento</summary>
    DateTime DueDate,
    /// <summary>Estado de la factura</summary>
    string Status,
    /// <summary>Total de la factura</summary>
    decimal TotalAmount,
    /// <summary>Monto pagado</summary>
    decimal PaidAmount,
    /// <summary>Saldo pendiente</summary>
    decimal Balance,
    /// <summary>URL para descargar el PDF de la factura</summary>
    string DownloadUrl
);

/// <summary>
/// Métricas de facturación para un período
/// </summary>
public record BillingMetricsDto(
    /// <summary>Total de facturas emitidas</summary>
    int TotalInvoices,
    /// <summary>Total de facturas pagadas</summary>
    int PaidInvoices,
    /// <summary>Total de facturas pendientes</summary>
    int PendingInvoices,
    /// <summary>Total de facturas vencidas</summary>
    int OverdueInvoices,
    /// <summary>Ingresos totales</summary>
    decimal TotalRevenue,
    /// <summary>Ingresos pendientes</summary>
    decimal PendingRevenue,
    /// <summary>Ingresos vencidos</summary>
    decimal OverdueRevenue,
    /// <summary>Total de pagos procesados</summary>
    decimal TotalPayments,
    /// <summary>Promedio de tiempo de pago (días)</summary>
    double AveragePaymentTime
);