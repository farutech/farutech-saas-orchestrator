using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Catalog;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Farutech.Orchestrator.Infrastructure.Repositories;

/// <summary>
/// Repositorio para acceso a datos de catálogos.
/// </summary>
public class CatalogRepository(OrchestratorDbContext context) : ICatalogRepository
{
    private readonly OrchestratorDbContext _context = context;

    #region Products

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _context.Products
            .Where(p => !p.IsDeleted)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(Guid id)
    {
        return await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product?> UpdateProductAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteProductAsync(Guid id)
    {
        var product = await GetProductByIdAsync(id);
        if (product == null)
            return false;

        product.IsDeleted = true;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    #endregion

    #region Modules

    public async Task<IEnumerable<Module>> GetModulesByProductIdAsync(Guid productId)
    {
        return await _context.Modules
            .Where(m => m.ProductId == productId && !m.IsDeleted)
            .OrderBy(m => m.Name)
            .ToListAsync();
    }

    public async Task<Module?> GetModuleByIdAsync(Guid id)
    {
        return await _context.Modules
            .Include(m => m.Product)
            .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);
    }

    public async Task<Module> CreateModuleAsync(Module module)
    {
        _context.Modules.Add(module);
        await _context.SaveChangesAsync();
        return module;
    }

    public async Task<Module?> UpdateModuleAsync(Module module)
    {
        _context.Modules.Update(module);
        await _context.SaveChangesAsync();
        return module;
    }

    public async Task<bool> DeleteModuleAsync(Guid id)
    {
        var module = await GetModuleByIdAsync(id);
        if (module == null)
            return false;

        module.IsDeleted = true;
        module.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    #endregion

    #region Features

    public async Task<IEnumerable<Feature>> GetFeaturesByModuleIdAsync(Guid moduleId)
    {
        return await _context.Features
            .Where(f => f.ModuleId == moduleId && !f.IsDeleted)
            .OrderBy(f => f.Name)
            .ToListAsync();
    }

    public async Task<Feature?> GetFeatureByIdAsync(Guid id)
    {
        return await _context.Features
            .Include(f => f.Module)
            .FirstOrDefaultAsync(f => f.Id == id && !f.IsDeleted);
    }

    public async Task<Feature> CreateFeatureAsync(Feature feature)
    {
        _context.Features.Add(feature);
        await _context.SaveChangesAsync();
        return feature;
    }

    public async Task<Feature?> UpdateFeatureAsync(Feature feature)
    {
        _context.Features.Update(feature);
        await _context.SaveChangesAsync();
        return feature;
    }

    public async Task<bool> DeleteFeatureAsync(Guid id)
    {
        var feature = await GetFeatureByIdAsync(id);
        if (feature == null)
            return false;

        feature.IsDeleted = true;
        feature.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    #endregion

    #region Permissions

    public async Task<IEnumerable<Permission>> GetAllPermissionsAsync()
    {
        return await _context.Permissions
            .Where(p => p.IsActive)
            .OrderBy(p => p.Module)
            .ThenBy(p => p.Name)
            .ToListAsync();
    }

    #endregion
}