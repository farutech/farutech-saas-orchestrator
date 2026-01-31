using System;
using System.Collections.Generic;
using Farutech.Orchestrator.Domain.Common;

namespace Farutech.Orchestrator.Domain.Entities.Catalog;

/// <summary>
/// Representa un plan de suscripción (paquete) para un producto específico.
/// Una aplicación puede tener múltiples suscripciones, pero cada suscripción pertenece a una sola aplicación.
/// </summary>
public class Subscription : BaseEntity
{
    public Guid ProductId { get; set; }
    public string Code { get; set; } = string.Empty; // e.g., "FARUPOS-FULL", "FARUPOS-BASIC"
    public string Name { get; set; } = string.Empty; // e.g., "Plan Full", "Plan Básico"
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Indica si incluye todas las funcionalidades disponibles de la aplicación
    /// </summary>
    public bool IsFullAccess { get; set; } = false;
    
    /// <summary>
    /// Precio mensual de la suscripción (en la moneda configurada)
    /// </summary>
    public decimal MonthlyPrice { get; set; }
    
    /// <summary>
    /// Precio anual de la suscripción (generalmente con descuento)
    /// </summary>
    public decimal? AnnualPrice { get; set; }
    
    /// <summary>
    /// Indica si la suscripción está activa y disponible para contratación
    /// </summary>
    public bool IsActive { get; set; } = true;
    
    /// <summary>
    /// Indica si es la suscripción recomendada (destacada) para este producto
    /// </summary>
    public bool IsRecommended { get; set; } = false;
    
    /// <summary>
    /// Orden de visualización (para ordenar en la UI)
    /// </summary>
    public int DisplayOrder { get; set; }
    
    /// <summary>
    /// Límites y configuraciones específicas de la suscripción (JSON)
    /// Ejemplo: { "maxUsers": 10, "maxTransactions": 1000, "storageGB": 50 }
    /// </summary>
    public string? LimitsConfig { get; set; }
    
    // Navigation
    public Product Product { get; set; } = null!;
    
    /// <summary>
    /// Features incluidas en esta suscripción
    /// Si IsFullAccess=true, se incluyen todas las features del producto
    /// </summary>
    public ICollection<SubscriptionFeature> SubscriptionFeatures { get; set; } = new List<SubscriptionFeature>();
}

/// <summary>
/// Relación muchos a muchos entre Subscription y Feature
/// Define qué funcionalidades están incluidas en cada plan de suscripción
/// </summary>
public class SubscriptionFeature : BaseEntity
{
    public Guid SubscriptionId { get; set; }
    public Guid FeatureId { get; set; }
    
    /// <summary>
    /// Indica si la feature está habilitada en este plan (permite deshabilitarla temporalmente)
    /// </summary>
    public bool IsEnabled { get; set; } = true;
    
    // Navigation
    public Subscription Subscription { get; set; } = null!;
    public Feature Feature { get; set; } = null!;
}
