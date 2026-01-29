using Farutech.Orchestrator.Application.DTOs.Catalog;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Catalog;
using Farutech.Orchestrator.Domain.Entities.Identity;

namespace Farutech.Orchestrator.Application.Services;

/// <summary>
/// Servicio para gestión de catálogos maestros (Products, Modules, Features).
/// Estas entidades son globales y no están asociadas a tenants específicos.
/// </summary>
public class CatalogService(ICatalogRepository catalogRepository) : ICatalogService
{
    private readonly ICatalogRepository _catalogRepository = catalogRepository;

    #region Products

    /// <summary>
    /// Obtiene todos los productos del catálogo.
    /// </summary>
    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _catalogRepository.GetAllProductsAsync();
        return products.Select(MapToProductDto);
    }

    /// <summary>
    /// Obtiene un producto específico por su ID.
    /// </summary>
    public async Task<ProductDto?> GetProductByIdAsync(Guid id)
    {
        var product = await _catalogRepository.GetProductByIdAsync(id);
        return product == null ? null : MapToProductDto(product);
    }

    /// <summary>
    /// Crea un nuevo producto en el catálogo.
    /// </summary>
    public async Task<ProductDto> CreateProductAsync(CreateProductDto request)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            IsActive = request.IsActive,
            IsDeleted = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdProduct = await _catalogRepository.CreateProductAsync(product);
        return MapToProductDto(createdProduct);
    }

    /// <summary>
    /// Actualiza un producto existente.
    /// </summary>
    public async Task<ProductDto?> UpdateProductAsync(Guid id, UpdateProductDto request)
    {
        var existingProduct = await _catalogRepository.GetProductByIdAsync(id);
        if (existingProduct == null)
            return null;

        existingProduct.Name = request.Name;
        existingProduct.Description = request.Description;
        existingProduct.IsActive = request.IsActive;
        existingProduct.UpdatedAt = DateTime.UtcNow;

        var updatedProduct = await _catalogRepository.UpdateProductAsync(existingProduct);
        return updatedProduct == null ? null : MapToProductDto(updatedProduct);
    }

    /// <summary>
    /// Elimina un producto (soft delete).
    /// </summary>
    public async Task<bool> DeleteProductAsync(Guid id)
    {
        return await _catalogRepository.DeleteProductAsync(id);
    }

    /// <summary>
    /// Obtiene el manifiesto completo de un producto incluyendo módulos, features y permisos.
    /// </summary>
    public async Task<ProductManifestDto?> GetProductManifestAsync(Guid productId)
    {
        var product = await _catalogRepository.GetProductByIdAsync(productId);
        if (product == null)
            return null;

        // Get modules with features
        var modules = await _catalogRepository.GetModulesByProductIdAsync(productId);

        // Get all permissions (they're global)
        var permissions = await _catalogRepository.GetAllPermissionsAsync();

        // For each module, get its features
        var moduleManifests = new List<ModuleManifestDto>();
        foreach (var module in modules)
        {
            var features = await _catalogRepository.GetFeaturesByModuleIdAsync(module.Id);
            var moduleManifest = new ModuleManifestDto
            {
                Id = module.Id,
                Code = module.Code,
                Name = module.Name,
                Description = module.Description,
                Features = features.Select(feature => new FeatureManifestDto
                {
                    Id = feature.Id,
                    Code = feature.Code,
                    Name = feature.Name,
                    Description = feature.Description,
                    RequiresLicense = feature.RequiresLicense,
                    AdditionalCost = feature.AdditionalCost
                }).ToList()
            };
            moduleManifests.Add(moduleManifest);
        }

        return new ProductManifestDto
        {
            Id = product.Id,
            Code = product.Code,
            Name = product.Name,
            Description = product.Description,
            Modules = moduleManifests,
            Permissions = permissions.Select(p => new PermissionDto
            {
                Id = p.Id,
                Code = p.Code,
                Name = p.Name,
                Description = p.Description,
                Module = p.Module,
                Category = p.Category,
                IsCritical = p.IsCritical,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            }).ToList()
        };
    }

    #endregion

    #region Modules

    /// <summary>
    /// Obtiene todos los módulos de un producto específico.
    /// </summary>
    public async Task<IEnumerable<ModuleDto>> GetModulesByProductIdAsync(Guid productId)
    {
        var modules = await _catalogRepository.GetModulesByProductIdAsync(productId);
        return modules.Select(MapToModuleDto);
    }

    /// <summary>
    /// Obtiene un módulo específico por su ID.
    /// </summary>
    public async Task<ModuleDto?> GetModuleByIdAsync(Guid id)
    {
        var module = await _catalogRepository.GetModuleByIdAsync(id);
        return module == null ? null : MapToModuleDto(module);
    }

    /// <summary>
    /// Crea un nuevo módulo para un producto.
    /// </summary>
    public async Task<ModuleDto> CreateModuleAsync(CreateModuleDto request)
    {
        var module = new Module
        {
            Id = Guid.NewGuid(),
            ProductId = request.ProductId,
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            IsActive = request.IsActive,
            IsDeleted = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdModule = await _catalogRepository.CreateModuleAsync(module);
        return MapToModuleDto(createdModule);
    }

    /// <summary>
    /// Actualiza un módulo existente.
    /// </summary>
    public async Task<ModuleDto?> UpdateModuleAsync(Guid id, UpdateModuleDto request)
    {
        var existingModule = await _catalogRepository.GetModuleByIdAsync(id);
        if (existingModule == null)
            return null;

        existingModule.Name = request.Name;
        existingModule.Description = request.Description;
        existingModule.IsActive = request.IsActive;
        existingModule.UpdatedAt = DateTime.UtcNow;

        var updatedModule = await _catalogRepository.UpdateModuleAsync(existingModule);
        return updatedModule == null ? null : MapToModuleDto(updatedModule);
    }

    /// <summary>
    /// Elimina un módulo (soft delete).
    /// </summary>
    public async Task<bool> DeleteModuleAsync(Guid id)
    {
        return await _catalogRepository.DeleteModuleAsync(id);
    }

    #endregion

    #region Features

    /// <summary>
    /// Obtiene todas las features de un módulo específico.
    /// </summary>
    public async Task<IEnumerable<FeatureDto>> GetFeaturesByModuleIdAsync(Guid moduleId)
    {
        var features = await _catalogRepository.GetFeaturesByModuleIdAsync(moduleId);
        return features.Select(MapToFeatureDto);
    }

    /// <summary>
    /// Obtiene una feature específica por su ID.
    /// </summary>
    public async Task<FeatureDto?> GetFeatureByIdAsync(Guid id)
    {
        var feature = await _catalogRepository.GetFeatureByIdAsync(id);
        return feature == null ? null : MapToFeatureDto(feature);
    }

    /// <summary>
    /// Crea una nueva feature para un módulo.
    /// </summary>
    public async Task<FeatureDto> CreateFeatureAsync(CreateFeatureDto request)
    {
        var feature = new Feature
        {
            Id = Guid.NewGuid(),
            ModuleId = request.ModuleId,
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            RequiresLicense = request.RequiresLicense,
            AdditionalCost = request.AdditionalCost,
            IsActive = request.IsActive,
            IsDeleted = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdFeature = await _catalogRepository.CreateFeatureAsync(feature);
        return MapToFeatureDto(createdFeature);
    }

    /// <summary>
    /// Actualiza una feature existente.
    /// </summary>
    public async Task<FeatureDto?> UpdateFeatureAsync(Guid id, UpdateFeatureDto request)
    {
        var existingFeature = await _catalogRepository.GetFeatureByIdAsync(id);
        if (existingFeature == null)
            return null;

        existingFeature.Name = request.Name;
        existingFeature.Description = request.Description;
        existingFeature.RequiresLicense = request.RequiresLicense;
        existingFeature.AdditionalCost = request.AdditionalCost;
        existingFeature.IsActive = request.IsActive;
        existingFeature.UpdatedAt = DateTime.UtcNow;

        var updatedFeature = await _catalogRepository.UpdateFeatureAsync(existingFeature);
        return updatedFeature == null ? null : MapToFeatureDto(updatedFeature);
    }

    /// <summary>
    /// Elimina una feature (soft delete).
    /// </summary>
    public async Task<bool> DeleteFeatureAsync(Guid id)
    {
        return await _catalogRepository.DeleteFeatureAsync(id);
    }

    #endregion

    #region Private Methods

    private static ProductDto MapToProductDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Code = product.Code,
            Name = product.Name,
            Description = product.Description,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }

    private static ModuleDto MapToModuleDto(Module module)
    {
        return new ModuleDto
        {
            Id = module.Id,
            ProductId = module.ProductId,
            Code = module.Code,
            Name = module.Name,
            Description = module.Description,
            IsActive = module.IsActive,
            CreatedAt = module.CreatedAt,
            UpdatedAt = module.UpdatedAt
        };
    }

    private static FeatureDto MapToFeatureDto(Feature feature)
    {
        return new FeatureDto
        {
            Id = feature.Id,
            ModuleId = feature.ModuleId,
            Code = feature.Code,
            Name = feature.Name,
            Description = feature.Description,
            RequiresLicense = feature.RequiresLicense,
            AdditionalCost = feature.AdditionalCost ?? 0,
            IsActive = feature.IsActive,
            CreatedAt = feature.CreatedAt,
            UpdatedAt = feature.UpdatedAt
        };
    }

    #endregion
}