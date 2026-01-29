using Farutech.Orchestrator.Application.DTOs.Catalog;
using Farutech.Orchestrator.Domain.Entities.Catalog;
using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Servicio para gestión de catálogos maestros (Products, Modules, Features).
/// Estas entidades son globales y no están asociadas a tenants específicos.
/// </summary>
public interface ICatalogService
{
    #region Products

    /// <summary>
    /// Obtiene todos los productos del catálogo.
    /// </summary>
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();

    /// <summary>
    /// Obtiene un producto específico por su ID.
    /// </summary>
    Task<ProductDto?> GetProductByIdAsync(Guid id);

    /// <summary>
    /// Crea un nuevo producto en el catálogo.
    /// </summary>
    Task<ProductDto> CreateProductAsync(CreateProductDto request);

    /// <summary>
    /// Actualiza un producto existente.
    /// </summary>
    Task<ProductDto?> UpdateProductAsync(Guid id, UpdateProductDto request);

    /// <summary>
    /// Elimina un producto (soft delete).
    /// </summary>
    Task<bool> DeleteProductAsync(Guid id);

    /// <summary>
    /// Obtiene el manifiesto completo de un producto incluyendo módulos, features y permisos.
    /// </summary>
    Task<ProductManifestDto?> GetProductManifestAsync(Guid productId);

    #endregion

    #region Modules

    /// <summary>
    /// Obtiene todos los módulos de un producto específico.
    /// </summary>
    Task<IEnumerable<ModuleDto>> GetModulesByProductIdAsync(Guid productId);

    /// <summary>
    /// Obtiene un módulo específico por su ID.
    /// </summary>
    Task<ModuleDto?> GetModuleByIdAsync(Guid id);

    /// <summary>
    /// Crea un nuevo módulo en el catálogo.
    /// </summary>
    Task<ModuleDto> CreateModuleAsync(CreateModuleDto request);

    /// <summary>
    /// Actualiza un módulo existente.
    /// </summary>
    Task<ModuleDto?> UpdateModuleAsync(Guid id, UpdateModuleDto request);

    /// <summary>
    /// Elimina un módulo (soft delete).
    /// </summary>
    Task<bool> DeleteModuleAsync(Guid id);

    #endregion

    #region Features

    /// <summary>
    /// Obtiene todas las features de un módulo específico.
    /// </summary>
    Task<IEnumerable<FeatureDto>> GetFeaturesByModuleIdAsync(Guid moduleId);

    /// <summary>
    /// Obtiene una feature específica por su ID.
    /// </summary>
    Task<FeatureDto?> GetFeatureByIdAsync(Guid id);

    /// <summary>
    /// Crea una nueva feature en el catálogo.
    /// </summary>
    Task<FeatureDto> CreateFeatureAsync(CreateFeatureDto request);

    /// <summary>
    /// Actualiza una feature existente.
    /// </summary>
    Task<FeatureDto?> UpdateFeatureAsync(Guid id, UpdateFeatureDto request);

    /// <summary>
    /// Elimina una feature (soft delete).
    /// </summary>
    Task<bool> DeleteFeatureAsync(Guid id);

    #endregion
}

/// <summary>
/// Repositorio para acceso a datos de catálogos.
/// </summary>
public interface ICatalogRepository
{
    #region Products
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task<Product?> GetProductByIdAsync(Guid id);
    Task<Product> CreateProductAsync(Product product);
    Task<Product?> UpdateProductAsync(Product product);
    Task<bool> DeleteProductAsync(Guid id);
    #endregion

    #region Modules
    Task<IEnumerable<Module>> GetModulesByProductIdAsync(Guid productId);
    Task<Module?> GetModuleByIdAsync(Guid id);
    Task<Module> CreateModuleAsync(Module module);
    Task<Module?> UpdateModuleAsync(Module module);
    Task<bool> DeleteModuleAsync(Guid id);
    #endregion

    #region Features
    Task<IEnumerable<Feature>> GetFeaturesByModuleIdAsync(Guid moduleId);
    Task<Feature?> GetFeatureByIdAsync(Guid id);
    Task<Feature> CreateFeatureAsync(Feature feature);
    Task<Feature?> UpdateFeatureAsync(Feature feature);
    Task<bool> DeleteFeatureAsync(Guid id);
    #endregion

    #region Permissions
    Task<IEnumerable<Permission>> GetAllPermissionsAsync();
    #endregion
}
