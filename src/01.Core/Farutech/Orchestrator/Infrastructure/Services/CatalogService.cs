using Farutech.Orchestrator.Application.DTOs.Catalog;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Catalog;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Servicio para gestión de catálogos maestros (Products, Modules, Features).
/// </summary>
public class CatalogService(OrchestratorDbContext context,
                            ILogger<CatalogService> logger) : ICatalogService
{
    private readonly OrchestratorDbContext _context = context;
    private readonly ILogger<CatalogService> _logger = logger;

    #region Products

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        return await _context.Products
            .Include(p => p.Modules)
                .ThenInclude(m => m.Features)
            .Where(p => !p.IsDeleted)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                Modules = p.Modules
                    .Where(m => !m.IsDeleted)
                    .Select(m => new ModuleDto
                    {
                        Id = m.Id,
                        ProductId = m.ProductId,
                        ProductName = p.Name,
                        Name = m.Name,
                        Description = m.Description,
                        IsActive = m.IsActive,
                        CreatedAt = m.CreatedAt,
                        UpdatedAt = m.UpdatedAt,
                        Features = m.Features
                            .Where(f => !f.IsDeleted)
                            .Select(f => new FeatureDto
                            {
                                Id = f.Id,
                                ModuleId = f.ModuleId,
                                ModuleName = m.Name,
                                Name = f.Name,
                                Description = f.Description,
                                IsActive = f.IsActive,
                                CreatedAt = f.CreatedAt,
                                UpdatedAt = f.UpdatedAt
                            }).ToList()
                    }).ToList()
            })
            .ToListAsync();
    }

    public async Task<ProductDto?> GetProductByIdAsync(Guid id)
    {
        return await _context.Products
            .Include(p => p.Modules)
                .ThenInclude(m => m.Features)
            .Where(p => p.Id == id && !p.IsDeleted)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                Modules = p.Modules
                    .Where(m => !m.IsDeleted)
                    .Select(m => new ModuleDto
                    {
                        Id = m.Id,
                        ProductId = m.ProductId,
                        ProductName = p.Name,
                        Name = m.Name,
                        Description = m.Description,
                        IsActive = m.IsActive,
                        CreatedAt = m.CreatedAt,
                        UpdatedAt = m.UpdatedAt,
                        Features = m.Features
                            .Where(f => !f.IsDeleted)
                            .Select(f => new FeatureDto
                            {
                                Id = f.Id,
                                ModuleId = f.ModuleId,
                                ModuleName = m.Name,
                                Name = f.Name,
                                Description = f.Description,
                                IsActive = f.IsActive,
                                CreatedAt = f.CreatedAt,
                                UpdatedAt = f.UpdatedAt
                            }).ToList()
                    }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto request)
    {
        // Validar que no exista otro producto con el mismo nombre
        var existingProduct = await _context.Products
            .FirstOrDefaultAsync(p => p.Name == request.Name && !p.IsDeleted);

        if (existingProduct != null)
        {
            throw new InvalidOperationException($"Ya existe un producto con el nombre '{request.Name}'");
        }

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Code = request.Name.ToLowerInvariant().Replace(" ", "_"), // Generate code from name
            Name = request.Name,
            Description = request.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Producto creado: {ProductId} - {ProductName}", product.Id, product.Name);

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            Modules = new List<ModuleDto>()
        };
    }

    public async Task<ProductDto?> UpdateProductAsync(Guid id, UpdateProductDto request)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (product == null)
            return null;

        // Validar que no exista otro producto con el mismo nombre
        var existingProduct = await _context.Products
            .FirstOrDefaultAsync(p => p.Name == request.Name && p.Id != id && !p.IsDeleted);

        if (existingProduct != null)
        {
            throw new InvalidOperationException($"Ya existe otro producto con el nombre '{request.Name}'");
        }

        product.Name = request.Name;
        product.Description = request.Description;
        product.IsActive = request.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Producto actualizado: {ProductId} - {ProductName}", product.Id, product.Name);

        return await GetProductByIdAsync(id);
    }

    public async Task<bool> DeleteProductAsync(Guid id)
    {
        var product = await _context.Products
            .Include(p => p.Modules)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (product == null)
            return false;

        // Verificar que no tenga módulos activos
        if (product.Modules.Any(m => !m.IsDeleted))
        {
            throw new InvalidOperationException(
                "No se puede eliminar el producto porque tiene módulos asociados. " +
                "Elimine primero todos los módulos.");
        }

        product.IsDeleted = true;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Producto eliminado (soft delete): {ProductId} - {ProductName}", 
            product.Id, product.Name);

        return true;
    }

    public async Task<ProductManifestDto?> GetProductManifestAsync(Guid productId)
    {
        var product = await _context.Products
            .Include(p => p.Modules)
                .ThenInclude(m => m.Features)
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);

        if (product == null)
            return null;

        // Permisos eliminados, solo devolver manifest sin permisos
        var manifest = new ProductManifestDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            Modules = product.Modules
                .Where(m => !m.IsDeleted)
                .Select(m => new ModuleManifestDto
                {
                    Id = m.Id,
                    Code = m.Code,
                    Name = m.Name,
                    Description = m.Description,
                    IsActive = m.IsActive,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt,
                    Features = m.Features
                        .Where(f => !f.IsDeleted)
                        .Select(f => new FeatureManifestDto
                        {
                            Id = f.Id,
                            Code = f.Code,
                            Name = f.Name,
                            Description = f.Description,
                            IsActive = f.IsActive,
                            RequiresLicense = f.RequiresLicense,
                            AdditionalCost = f.AdditionalCost,
                            CreatedAt = f.CreatedAt,
                            UpdatedAt = f.UpdatedAt,
                            Permissions = new List<PermissionDto>()
                        }).ToList()
                }).ToList()
        };

        return manifest;
    }

    #endregion

    #region Modules

    public async Task<IEnumerable<ModuleDto>> GetModulesByProductIdAsync(Guid productId)
    {
        return await _context.Modules
            .Include(m => m.Product)
            .Include(m => m.Features)
            .Where(m => m.ProductId == productId && !m.IsDeleted)
            .Select(m => new ModuleDto
            {
                Id = m.Id,
                ProductId = m.ProductId,
                ProductName = m.Product.Name,
                Name = m.Name,
                Description = m.Description,
                IsActive = m.IsActive,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt,
                Features = m.Features
                    .Where(f => !f.IsDeleted)
                    .Select(f => new FeatureDto
                    {
                        Id = f.Id,
                        ModuleId = f.ModuleId,
                        ModuleName = m.Name,
                        Name = f.Name,
                        Description = f.Description,
                        IsActive = f.IsActive,
                        CreatedAt = f.CreatedAt,
                        UpdatedAt = f.UpdatedAt
                    }).ToList()
            })
            .ToListAsync();
    }

    public async Task<ModuleDto?> GetModuleByIdAsync(Guid id)
    {
        return await _context.Modules
            .Include(m => m.Product)
            .Include(m => m.Features)
            .Where(m => m.Id == id && !m.IsDeleted)
            .Select(m => new ModuleDto
            {
                Id = m.Id,
                ProductId = m.ProductId,
                ProductName = m.Product.Name,
                Name = m.Name,
                Description = m.Description,
                IsActive = m.IsActive,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt,
                Features = m.Features
                    .Where(f => !f.IsDeleted)
                    .Select(f => new FeatureDto
                    {
                        Id = f.Id,
                        ModuleId = f.ModuleId,
                        ModuleName = m.Name,
                        Name = f.Name,
                        Description = f.Description,
                        IsActive = f.IsActive,
                        CreatedAt = f.CreatedAt,
                        UpdatedAt = f.UpdatedAt
                    }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ModuleDto> CreateModuleAsync(CreateModuleDto request)
    {
        // Verificar que el producto exista
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == request.ProductId && !p.IsDeleted);

        if (product == null)
        {
            throw new InvalidOperationException($"El producto con ID {request.ProductId} no existe");
        }

        // Validar que no exista otro módulo con el mismo nombre en el mismo producto
        var existingModule = await _context.Modules
            .FirstOrDefaultAsync(m => m.ProductId == request.ProductId && 
                                     m.Name == request.Name && 
                                     !m.IsDeleted);

        if (existingModule != null)
        {
            throw new InvalidOperationException(
                $"Ya existe un módulo con el nombre '{request.Name}' en este producto");
        }

        var module = new Module
        {
            Id = Guid.NewGuid(),
            ProductId = request.ProductId,
            Name = request.Name,
            Description = request.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Modules.Add(module);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Módulo creado: {ModuleId} - {ModuleName} (Producto: {ProductId})", 
            module.Id, module.Name, module.ProductId);

        return new ModuleDto
        {
            Id = module.Id,
            ProductId = module.ProductId,
            ProductName = product.Name,
            Name = module.Name,
            Description = module.Description,
            IsActive = module.IsActive,
            CreatedAt = module.CreatedAt,
            Features = new List<FeatureDto>()
        };
    }

    public async Task<ModuleDto?> UpdateModuleAsync(Guid id, UpdateModuleDto request)
    {
        var module = await _context.Modules
            .Include(m => m.Product)
            .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

        if (module == null)
            return null;

        // Validar que no exista otro módulo con el mismo nombre en el mismo producto
        var existingModule = await _context.Modules
            .FirstOrDefaultAsync(m => m.ProductId == module.ProductId && 
                                     m.Name == request.Name && 
                                     m.Id != id && 
                                     !m.IsDeleted);

        if (existingModule != null)
        {
            throw new InvalidOperationException(
                $"Ya existe otro módulo con el nombre '{request.Name}' en este producto");
        }

        module.Name = request.Name;
        module.Description = request.Description;
        module.IsActive = request.IsActive;
        module.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Módulo actualizado: {ModuleId} - {ModuleName}", module.Id, module.Name);

        return await GetModuleByIdAsync(id);
    }

    public async Task<bool> DeleteModuleAsync(Guid id)
    {
        var module = await _context.Modules
            .Include(m => m.Features)
            .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

        if (module == null)
            return false;

        // Verificar que no tenga features activas
        if (module.Features.Any(f => !f.IsDeleted))
        {
            throw new InvalidOperationException(
                "No se puede eliminar el módulo porque tiene features asociadas. " +
                "Elimine primero todas las features.");
        }

        module.IsDeleted = true;
        module.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Módulo eliminado (soft delete): {ModuleId} - {ModuleName}", 
            module.Id, module.Name);

        return true;
    }

    #endregion

    #region Features

    public async Task<IEnumerable<FeatureDto>> GetFeaturesByModuleIdAsync(Guid moduleId)
    {
        return await _context.Features
            .Include(f => f.Module)
            .Where(f => f.ModuleId == moduleId && !f.IsDeleted)
            .Select(f => new FeatureDto
            {
                Id = f.Id,
                ModuleId = f.ModuleId,
                ModuleName = f.Module.Name,
                Name = f.Name,
                Description = f.Description,
                IsActive = f.IsActive,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<FeatureDto?> GetFeatureByIdAsync(Guid id)
    {
        return await _context.Features
            .Include(f => f.Module)
            .Where(f => f.Id == id && !f.IsDeleted)
            .Select(f => new FeatureDto
            {
                Id = f.Id,
                ModuleId = f.ModuleId,
                ModuleName = f.Module.Name,
                Name = f.Name,
                Description = f.Description,
                IsActive = f.IsActive,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<FeatureDto> CreateFeatureAsync(CreateFeatureDto request)
    {
        // Verificar que el módulo exista
        var module = await _context.Modules
            .FirstOrDefaultAsync(m => m.Id == request.ModuleId && !m.IsDeleted);

        if (module == null)
        {
            throw new InvalidOperationException($"El módulo con ID {request.ModuleId} no existe");
        }

        // Validar que no exista otra feature con el mismo nombre en el mismo módulo
        var existingFeature = await _context.Features
            .FirstOrDefaultAsync(f => f.ModuleId == request.ModuleId && 
                                     f.Name == request.Name && 
                                     !f.IsDeleted);

        if (existingFeature != null)
        {
            throw new InvalidOperationException(
                $"Ya existe una feature con el nombre '{request.Name}' en este módulo");
        }

        var feature = new Feature
        {
            Id = Guid.NewGuid(),
            ModuleId = request.ModuleId,
            Name = request.Name,
            Description = request.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Features.Add(feature);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Feature creada: {FeatureId} - {FeatureName} (Módulo: {ModuleId})", 
            feature.Id, feature.Name, feature.ModuleId);

        return new FeatureDto
        {
            Id = feature.Id,
            ModuleId = feature.ModuleId,
            ModuleName = module.Name,
            Name = feature.Name,
            Description = feature.Description,
            IsActive = feature.IsActive,
            CreatedAt = feature.CreatedAt
        };
    }

    public async Task<FeatureDto?> UpdateFeatureAsync(Guid id, UpdateFeatureDto request)
    {
        var feature = await _context.Features
            .Include(f => f.Module)
            .FirstOrDefaultAsync(f => f.Id == id && !f.IsDeleted);

        if (feature == null)
            return null;

        // Validar que no exista otra feature con el mismo nombre en el mismo módulo
        var existingFeature = await _context.Features
            .FirstOrDefaultAsync(f => f.ModuleId == feature.ModuleId && 
                                     f.Name == request.Name && 
                                     f.Id != id && 
                                     !f.IsDeleted);

        if (existingFeature != null)
        {
            throw new InvalidOperationException(
                $"Ya existe otra feature con el nombre '{request.Name}' en este módulo");
        }

        feature.Name = request.Name;
        feature.Description = request.Description;
        feature.IsActive = request.IsActive;
        feature.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Feature actualizada: {FeatureId} - {FeatureName}", feature.Id, feature.Name);

        return await GetFeatureByIdAsync(id);
    }

    public async Task<bool> DeleteFeatureAsync(Guid id)
    {
        var feature = await _context.Features
            .FirstOrDefaultAsync(f => f.Id == id && !f.IsDeleted);

        if (feature == null)
            return false;

        feature.IsDeleted = true;
        feature.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Feature eliminada (soft delete): {FeatureId} - {FeatureName}", 
            feature.Id, feature.Name);

        return true;
    }

    #endregion
}
