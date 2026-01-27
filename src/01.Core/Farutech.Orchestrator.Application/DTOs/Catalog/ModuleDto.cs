using System.ComponentModel.DataAnnotations;

namespace Farutech.Orchestrator.Application.DTOs.Catalog;

/// <summary>
/// DTO para mostrar información de un módulo del catálogo.
/// </summary>
public class ModuleDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Features asociadas a este módulo.
    /// </summary>
    public List<FeatureDto> Features { get; set; } = new();
}

/// <summary>
/// DTO para crear un nuevo módulo.
/// </summary>
public class CreateModuleDto
{
    [Required(ErrorMessage = "El ID del producto es obligatorio")]
    public Guid ProductId { get; set; }

    [Required(ErrorMessage = "El código del módulo es obligatorio")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El código debe tener entre 2 y 50 caracteres")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre del módulo es obligatorio")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 200 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción del módulo es obligatoria")]
    [StringLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "El estado del módulo es obligatorio")]
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// DTO para actualizar un módulo existente.
/// </summary>
public class UpdateModuleDto
{
    [Required(ErrorMessage = "El nombre del módulo es obligatorio")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 200 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción del módulo es obligatoria")]
    [StringLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "El estado del módulo es obligatorio")]
    public bool IsActive { get; set; }
}
