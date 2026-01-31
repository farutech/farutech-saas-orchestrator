using System.ComponentModel.DataAnnotations;

namespace Farutech.Orchestrator.Application.DTOs.Catalog;

/// <summary>
/// DTO para mostrar un plan de suscripción disponible
/// </summary>
public class SubscriptionPlanDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsFullAccess { get; set; }
    public decimal MonthlyPrice { get; set; }
    public decimal? AnnualPrice { get; set; }
    public bool IsActive { get; set; }
    public bool IsRecommended { get; set; }
    public int DisplayOrder { get; set; }
    
    /// <summary>
    /// Configuración de límites del plan
    /// </summary>
    public SubscriptionLimitsDto? Limits { get; set; }
    
    /// <summary>
    /// Features incluidas en este plan
    /// </summary>
    public List<FeatureDto> Features { get; set; } = [];
}

/// <summary>
/// Límites configurados para un plan de suscripción
/// </summary>
public class SubscriptionLimitsDto
{
    public int MaxUsers { get; set; } // -1 = ilimitado
    public int MaxTransactionsPerMonth { get; set; } // -1 = ilimitado
    public int StorageGB { get; set; } // -1 = ilimitado
    public int MaxWarehouses { get; set; } // -1 = ilimitado
    public string SupportLevel { get; set; } = "standard"; // standard, priority, premium
    public bool HasAdvancedReports { get; set; }
}

/// <summary>
/// DTO para crear un nuevo plan de suscripción
/// </summary>
public class CreateSubscriptionPlanDto
{
    [Required(ErrorMessage = "El ID del producto es obligatorio")]
    public Guid ProductId { get; set; }

    [Required(ErrorMessage = "El código del plan es obligatorio")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El código debe tener entre 2 y 50 caracteres")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre del plan es obligatorio")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 200 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción del plan es obligatoria")]
    [StringLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;

    public bool IsFullAccess { get; set; } = false;

    [Required(ErrorMessage = "El precio mensual es obligatorio")]
    [Range(0, double.MaxValue, ErrorMessage = "El precio debe ser mayor o igual a 0")]
    public decimal MonthlyPrice { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "El precio anual debe ser mayor o igual a 0")]
    public decimal? AnnualPrice { get; set; }

    public bool IsRecommended { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;

    /// <summary>
    /// IDs de las features incluidas en este plan
    /// </summary>
    public List<Guid> FeatureIds { get; set; } = [];
}

/// <summary>
/// DTO para actualizar un plan de suscripción
/// </summary>
public class UpdateSubscriptionPlanDto
{
    [StringLength(200, MinimumLength = 3)]
    public string? Name { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    public bool? IsFullAccess { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? MonthlyPrice { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? AnnualPrice { get; set; }

    public bool? IsActive { get; set; }
    public bool? IsRecommended { get; set; }
    public int? DisplayOrder { get; set; }

    public List<Guid>? FeatureIds { get; set; }
}
