using System.ComponentModel.DataAnnotations;

namespace Farutech.Orchestrator.Application.DTOs.Catalog;

/// <summary>
/// DTO para mostrar información de un producto del catálogo.
/// </summary>
public class ProductDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Módulos asociados a este producto.
    /// </summary>
    public List<ModuleDto> Modules { get; set; } = [];
}

/// <summary>
/// DTO para crear un nuevo producto.
/// </summary>
public class CreateProductDto
{
    [Required(ErrorMessage = "El código del producto es obligatorio")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El código debe tener entre 2 y 50 caracteres")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre del producto es obligatorio")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 200 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción del producto es obligatoria")]
    [StringLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "El estado del producto es obligatorio")]
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// DTO para actualizar un producto existente.
/// </summary>
public class UpdateProductDto
{
    [Required(ErrorMessage = "El nombre del producto es obligatorio")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 200 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción del producto es obligatoria")]
    [StringLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "El estado del producto es obligatorio")]
    public bool IsActive { get; set; }
}
