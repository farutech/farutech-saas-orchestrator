using Farutech.Orchestrator.Application.DTOs.Billing;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Application.Services;
using Farutech.Orchestrator.Domain.Entities.Billing;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Microsoft.Extensions.Logging;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Servicio de facturación que maneja la lógica de negocio para facturas y pagos
/// </summary>
public class BillingService : IBillingService
{
    private readonly IRepository<Invoice> _invoiceRepository;
    private readonly IRepository<InvoiceItem> _invoiceItemRepository;
    private readonly IRepository<Payment> _paymentRepository;
    private readonly IRepository<InvoicePayment> _invoicePaymentRepository;
    private readonly IRepository<Customer> _customerRepository;
    private readonly ILogger<BillingService> _logger;

    public BillingService(
        IRepository<Invoice> invoiceRepository,
        IRepository<InvoiceItem> invoiceItemRepository,
        IRepository<Payment> paymentRepository,
        IRepository<InvoicePayment> invoicePaymentRepository,
        IRepository<Customer> customerRepository,
        ILogger<BillingService> logger)
    {
        _invoiceRepository = invoiceRepository;
        _invoiceItemRepository = invoiceItemRepository;
        _paymentRepository = paymentRepository;
        _invoicePaymentRepository = invoicePaymentRepository;
        _customerRepository = customerRepository;
        _logger = logger;
    }

    /// <inheritdoc/>
    public async Task<CreateInvoiceResponse> CreateInvoiceAsync(CreateInvoiceRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating invoice for customer {CustomerId}", request.CustomerId);

        // Validar que el cliente existe
        var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (customer == null)
        {
            throw new ArgumentException($"Customer with ID {request.CustomerId} not found");
        }

        // Generar número de factura
        var invoiceNumber = await GenerateInvoiceNumberAsync(cancellationToken);

        // Crear la factura
        var invoice = new Invoice
        {
            InvoiceNumber = invoiceNumber,
            CustomerId = request.CustomerId,
            IssueDate = DateTime.UtcNow,
            DueDate = request.DueDate,
            Status = InvoiceStatus.Draft,
            Currency = request.Currency,
            Notes = request.Notes,
            Terms = request.Terms
        };

        // Agregar items a la factura
        foreach (var itemRequest in request.Items)
        {
            var item = new InvoiceItem
            {
                Description = itemRequest.Description,
                ItemType = Enum.Parse<InvoiceItemType>(itemRequest.ItemType),
                ReferenceId = itemRequest.ReferenceId,
                Quantity = itemRequest.Quantity,
                UnitPrice = itemRequest.UnitPrice,
                Discount = itemRequest.Discount,
                BillingPeriod = itemRequest.BillingPeriod
            };

            invoice.Items.Add(item);
        }

        // Calcular totales
        invoice.CalculateTotals();

        // Guardar la factura
        await _invoiceRepository.AddAsync(invoice, cancellationToken);

        _logger.LogInformation("Invoice {InvoiceNumber} created successfully for customer {CustomerId}", invoiceNumber, request.CustomerId);

        return new CreateInvoiceResponse(
            InvoiceId: invoice.Id,
            InvoiceNumber: invoiceNumber,
            TotalAmount: invoice.TotalAmount
        );
    }

    /// <inheritdoc/>
    public async Task<InvoiceDetailsDto?> GetInvoiceByIdAsync(Guid invoiceId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting invoice details for ID {InvoiceId}", invoiceId);

        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId, cancellationToken);
        if (invoice == null)
        {
            return null;
        }

        // Obtener items de la factura
        var items = await _invoiceItemRepository.FindAsync(i => i.InvoiceId == invoiceId, cancellationToken);

        // Obtener pagos aplicados a la factura
        var invoicePayments = await _invoicePaymentRepository.FindAsync(ip => ip.InvoiceId == invoiceId, cancellationToken);
        var paymentIds = invoicePayments.Select(ip => ip.PaymentId).ToList();
        var payments = await _paymentRepository.FindAsync(p => paymentIds.Contains(p.Id), cancellationToken);

        return new InvoiceDetailsDto(
            Id: invoice.Id,
            InvoiceNumber: invoice.InvoiceNumber,
            CustomerId: invoice.CustomerId,
            CustomerName: invoice.Customer?.CompanyName ?? "Unknown",
            IssueDate: invoice.IssueDate,
            DueDate: invoice.DueDate,
            Status: invoice.Status.ToString(),
            Currency: invoice.Currency,
            Subtotal: invoice.Subtotal,
            Discount: invoice.Discount,
            TaxAmount: invoice.TaxAmount,
            TotalAmount: invoice.TotalAmount,
            Notes: invoice.Notes,
            Terms: invoice.Terms,
            Items: items.Select(i => new InvoiceItemDto(
                Id: i.Id,
                Description: i.Description,
                ItemType: i.ItemType.ToString(),
                Quantity: i.Quantity,
                UnitPrice: i.UnitPrice,
                Discount: i.Discount,
                TotalPrice: i.TotalPrice,
                BillingPeriod: i.BillingPeriod
            )),
            Payments: payments.Select(p => new PaymentDto(
                Id: p.Id,
                Amount: p.Amount,
                Method: p.Method.ToString(),
                Status: p.Status.ToString(),
                ProcessedAt: p.ProcessedAt,
                ExternalReference: p.ExternalReference
            ))
        );
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<InvoiceSummaryDto>> GetInvoicesByCustomerAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting invoices for customer {CustomerId}", customerId);

        var invoices = await _invoiceRepository.FindAsync(i => i.CustomerId == customerId, cancellationToken);

        return invoices.Select(i => new InvoiceSummaryDto(
            Id: i.Id,
            InvoiceNumber: i.InvoiceNumber,
            IssueDate: i.IssueDate,
            DueDate: i.DueDate,
            Status: i.Status.ToString(),
            TotalAmount: i.TotalAmount,
            PaidAmount: i.PaidAmount,
            Balance: i.Balance,
            DownloadUrl: $"/api/billing/invoices/{i.Id}/download"
        ));
    }

    /// <inheritdoc/>
    public async Task<bool> UpdateInvoiceStatusAsync(Guid invoiceId, string status, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating invoice {InvoiceId} status to {Status}", invoiceId, status);

        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId, cancellationToken);
        if (invoice == null)
        {
            return false;
        }

        if (!Enum.TryParse<InvoiceStatus>(status, out var invoiceStatus))
        {
            throw new ArgumentException($"Invalid invoice status: {status}");
        }

        invoice.Status = invoiceStatus;
        invoice.UpdatedAt = DateTime.UtcNow;

        await _invoiceRepository.UpdateAsync(invoice, cancellationToken);

        _logger.LogInformation("Invoice {InvoiceId} status updated to {Status}", invoiceId, status);
        return true;
    }

    /// <inheritdoc/>
    public async Task<CreatePaymentResponse> CreatePaymentAsync(CreatePaymentRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating payment for customer {CustomerId} with amount {Amount}", request.CustomerId, request.Amount);

        // Validar que el cliente existe
        var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (customer == null)
        {
            throw new ArgumentException($"Customer with ID {request.CustomerId} not found");
        }

        // Generar referencia de pago
        var paymentReference = await GeneratePaymentReferenceAsync(cancellationToken);

        // Crear el pago
        var payment = new Payment
        {
            CustomerId = request.CustomerId,
            PaymentReference = paymentReference,
            Amount = request.Amount,
            Method = Enum.Parse<PaymentMethod>(request.PaymentMethod),
            Status = PaymentStatus.Pending,
            ExternalReference = request.ExternalReference,
            Notes = request.Notes,
            ProcessedAt = null
        };

        await _paymentRepository.AddAsync(payment, cancellationToken);

        // Aplicar el pago a las facturas especificadas
        foreach (var application in request.Applications)
        {
            var invoicePayment = new InvoicePayment
            {
                InvoiceId = application.InvoiceId,
                PaymentId = payment.Id,
                Amount = application.Amount
            };

            await _invoicePaymentRepository.AddAsync(invoicePayment, cancellationToken);

            // Actualizar el estado de la factura si es necesario
            await UpdateInvoicePaidAmountAsync(application.InvoiceId, cancellationToken);
        }

        _logger.LogInformation("Payment {PaymentReference} created successfully for customer {CustomerId}", paymentReference, request.CustomerId);

        return new CreatePaymentResponse(
            PaymentId: payment.Id,
            PaymentReference: paymentReference,
            Amount: request.Amount
        );
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<PaymentDto>> GetPaymentsByCustomerAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting payments for customer {CustomerId}", customerId);

        var payments = await _paymentRepository.FindAsync(p => p.CustomerId == customerId, cancellationToken);

        return payments.Select(p => new PaymentDto(
            Id: p.Id,
            Amount: p.Amount,
            Method: p.Method.ToString(),
            Status: p.Status.ToString(),
            ProcessedAt: p.ProcessedAt,
            ExternalReference: p.ExternalReference
        ));
    }

    /// <inheritdoc/>
    public async Task<decimal> GetCustomerBalanceAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Calculating balance for customer {CustomerId}", customerId);

        var invoices = await _invoiceRepository.FindAsync(i => i.CustomerId == customerId, cancellationToken);
        var totalInvoiced = invoices.Sum(i => i.TotalAmount);
        var totalPaid = invoices.Sum(i => i.PaidAmount);

        return totalInvoiced - totalPaid;
    }

    /// <inheritdoc/>
    public async Task<int> GenerateSubscriptionInvoicesAsync(DateTime billingDate, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Generating subscription invoices for billing date {BillingDate}", billingDate);

        // TODO: Implementar lógica para generar facturas de suscripción
        // Esto requeriría acceso a información de suscripciones activas

        _logger.LogWarning("GenerateSubscriptionInvoicesAsync not implemented yet");
        return 0;
    }

    /// <inheritdoc/>
    public async Task<BillingMetricsDto> GetBillingMetricsAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting billing metrics for period {StartDate} to {EndDate}", startDate, endDate);

        var invoices = await _invoiceRepository.FindAsync(
            i => i.IssueDate >= startDate && i.IssueDate <= endDate,
            cancellationToken
        );

        var payments = await _paymentRepository.FindAsync(
            p => p.ProcessedAt >= startDate && p.ProcessedAt <= endDate,
            cancellationToken
        );

        var totalInvoices = invoices.Count();
        var paidInvoices = invoices.Count(i => i.Status == InvoiceStatus.Paid);
        var pendingInvoices = invoices.Count(i => i.Status == InvoiceStatus.Sent || i.Status == InvoiceStatus.PartiallyPaid);
        var overdueInvoices = invoices.Count(i => i.Status == InvoiceStatus.Overdue);

        var totalRevenue = invoices.Sum(i => i.TotalAmount);
        var pendingRevenue = invoices.Where(i => i.Status != InvoiceStatus.Paid).Sum(i => i.Balance);
        var overdueRevenue = invoices.Where(i => i.Status == InvoiceStatus.Overdue).Sum(i => i.Balance);

        var totalPayments = payments.Sum(p => p.Amount);
        var averagePaymentTime = CalculateAveragePaymentTime(invoices);

        return new BillingMetricsDto(
            TotalInvoices: totalInvoices,
            PaidInvoices: paidInvoices,
            PendingInvoices: pendingInvoices,
            OverdueInvoices: overdueInvoices,
            TotalRevenue: totalRevenue,
            PendingRevenue: pendingRevenue,
            OverdueRevenue: overdueRevenue,
            TotalPayments: totalPayments,
            AveragePaymentTime: averagePaymentTime
        );
    }

    #region Métodos auxiliares

    private async Task<string> GenerateInvoiceNumberAsync(CancellationToken cancellationToken = default)
    {
        // Generar número de factura único basado en fecha y contador
        var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
        var count = await _invoiceRepository.CountAsync(i => i.InvoiceNumber.StartsWith($"INV-{datePart}"), cancellationToken);
        return $"INV-{datePart}-{(count + 1).ToString("D4")}";
    }

    private async Task<string> GeneratePaymentReferenceAsync(CancellationToken cancellationToken = default)
    {
        // Generar referencia de pago única
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var random = new Random().Next(1000, 9999);
        return $"PAY-{timestamp}-{random}";
    }

    private async Task UpdateInvoicePaidAmountAsync(Guid invoiceId, CancellationToken cancellationToken = default)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId, cancellationToken);
        if (invoice == null)
        {
            return;
        }

        // Calcular el monto total pagado para esta factura
        var invoicePayments = await _invoicePaymentRepository.FindAsync(ip => ip.InvoiceId == invoiceId, cancellationToken);
        var totalPaid = invoicePayments.Sum(ip => ip.Amount);

        invoice.PaidAmount = totalPaid;

        // Actualizar estado basado en el monto pagado
        if (totalPaid >= invoice.TotalAmount)
        {
            invoice.Status = InvoiceStatus.Paid;
        }
        else if (totalPaid > 0)
        {
            invoice.Status = InvoiceStatus.PartiallyPaid;
        }

        await _invoiceRepository.UpdateAsync(invoice, cancellationToken);
    }

    private static double CalculateAveragePaymentTime(IEnumerable<Invoice> invoices)
    {
        var paidInvoices = invoices.Where(i => i.Status == InvoiceStatus.Paid && i.Payments.Any());
        if (!paidInvoices.Any())
        {
            return 0;
        }

        var paymentTimes = paidInvoices.Select(i =>
        {
            var firstPayment = i.Payments.Min(p => p.CreatedAt);
            return (firstPayment - i.IssueDate).TotalDays;
        });

        return paymentTimes.Average();
    }

    #endregion
}