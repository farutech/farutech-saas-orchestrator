using Farutech.Orchestrator.Application.DTOs.Billing;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Farutech.Orchestrator.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Implementación del servicio de facturación
/// </summary>
public class BillingService(OrchestratorDbContext context) : IBillingService
{
    private readonly OrchestratorDbContext _context = context;

    public async Task<BillingStatusDto?> GetBillingStatusAsync(Guid organizationId)
    {
        var customer = await _context.Customers.FindAsync(organizationId);
        if (customer == null) return null;

        var subscriptions = await _context.TenantSubscriptions
            .Where(s => s.CustomerId == organizationId && s.Status == "active")
            .Join(_context.SubscriptionPlans,
                ts => ts.ProductId,
                sp => sp.ProductId,
                (ts, sp) => new { TenantSubscription = ts, Plan = sp })
            .Join(_context.Products,
                combined => combined.TenantSubscription.ProductId,
                p => p.Id,
                (combined, p) => new SubscriptionDto(
                    combined.TenantSubscription.Id,
                    p.Name,
                    combined.Plan.Name,
                    combined.TenantSubscription.Price,
                    combined.TenantSubscription.Status,
                    combined.TenantSubscription.StartDate,
                    combined.TenantSubscription.EndDate,
                    combined.TenantSubscription.NextBillingDate
                ))
            .ToListAsync();

        var totalCost = subscriptions.Sum(s => s.Price);
        var nextBilling = subscriptions.Min(s => s.NextBillingDate);

        return new BillingStatusDto(
            organizationId,
            customer.CompanyName,
            subscriptions,
            totalCost,
            nextBilling
        );
    }

    public async Task<ServiceResult> UpgradeSubscriptionAsync(Guid subscriptionId, Guid newPlanId, Guid userId)
    {
        var subscription = await _context.TenantSubscriptions.FindAsync(subscriptionId);
        if (subscription == null)
        {
            return ServiceResult.Error("Suscripción no encontrada");
        }

        var newPlan = await _context.SubscriptionPlans.FindAsync(newPlanId);
        if (newPlan == null)
        {
            return ServiceResult.Error("Plan de suscripción no encontrado");
        }

        // Validar que el plan pertenece al mismo producto
        if (newPlan.ProductId != subscription.ProductId)
        {
            return ServiceResult.Error("El nuevo plan debe pertenecer al mismo producto");
        }

        // Validar que el plan esté activo
        if (!newPlan.IsActive)
        {
            return ServiceResult.Error("El plan seleccionado no está disponible");
        }

        // TODO: Validar permisos del usuario para hacer upgrades
        // TODO: Calcular prorrateo si es necesario
        // TODO: Crear registro de cambio de plan

        // Actualizar la suscripción
        var oldPrice = subscription.Price;
        subscription.ProductId = newPlan.ProductId; // Mantener consistencia
        subscription.Price = newPlan.MonthlyPrice; // Usar precio mensual por defecto
        subscription.UpdatedAt = DateTime.UtcNow;
        subscription.UpdatedBy = userId.ToString();

        await _context.SaveChangesAsync();

        return ServiceResult.Ok($"Suscripción actualizada exitosamente. Precio cambiado de {oldPrice:C} a {newPlan.MonthlyPrice:C}");
    }

    public async Task<IEnumerable<InvoiceDto>> GetInvoicesAsync(Guid organizationId)
    {
        // TODO: Implementar entidad Invoice y lógica
        return new List<InvoiceDto>();
    }
}