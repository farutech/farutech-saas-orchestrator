using System.ComponentModel.DataAnnotations;

namespace Farutech.Orchestrator.Application.DTOs.Catalog;

/// <summary>
/// DTO para mostrar información de una feature del catálogo.
/// </summary>
public class FeatureDto
{
    public Guid Id { get; set; }
    public Guid ModuleId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string ModuleName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool RequiresLicense { get; set; }
    public decimal AdditionalCost { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// DTO para crear una nueva feature.
/// </summary>
public class CreateFeatureDto
{
    [Required(ErrorMessage = "El ID del módulo es obligatorio")]
    public Guid ModuleId { get; set; }

    [Required(ErrorMessage = "El código de la feature es obligatorio")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El código debe tener entre 2 y 50 caracteres")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre de la feature es obligatorio")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 200 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción de la feature es obligatoria")]
    [StringLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "La información de licencia es obligatoria")]
    public bool RequiresLicense { get; set; }

    [Required(ErrorMessage = "El costo adicional es obligatorio")]
    [Range(0, 999999.99, ErrorMessage = "El costo adicional debe estar entre 0 y 999999.99")]
    public decimal AdditionalCost { get; set; }

    [Required(ErrorMessage = "El estado de la feature es obligatorio")]
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// DTO para actualizar una feature existente.
/// </summary>
public class UpdateFeatureDto
{
    [Required(ErrorMessage = "El nombre de la feature es obligatorio")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 200 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción de la feature es obligatoria")]
    [StringLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "La información de licencia es obligatoria")]
    public bool RequiresLicense { get; set; }

    [Required(ErrorMessage = "El costo adicional es obligatorio")]
    [Range(0, 999999.99, ErrorMessage = "El costo adicional debe estar entre 0 y 999999.99")]
    public decimal AdditionalCost { get; set; }

    [Required(ErrorMessage = "El estado de la feature es obligatorio")]
    public bool IsActive { get; set; }
}
