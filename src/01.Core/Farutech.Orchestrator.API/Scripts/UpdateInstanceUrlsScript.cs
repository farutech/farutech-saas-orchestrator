using Microsoft.EntityFrameworkCore;
using Farutech.Orchestrator.Infrastructure.Persistence;

namespace Farutech.Orchestrator.API.Scripts;

/// <summary>
/// Script temporal para actualizar URLs de instancias existentes a localhost en desarrollo
/// </summary>
public static class UpdateInstanceUrlsScript
{
    public static async Task ExecuteAsync(OrchestratorDbContext context)
    {
        Console.WriteLine("=== Actualizando URLs de instancias a localhost ===");
        
        // Ver estado actual
        var instances = await context.TenantInstances
            .Where(i => i.ApiBaseUrl != null && i.ApiBaseUrl.Contains("farutech.app"))
            .ToListAsync();
        
        Console.WriteLine($"Encontradas {instances.Count} instancias con URLs de producción");
        
        foreach (var instance in instances)
        {
            var oldUrl = instance.ApiBaseUrl;
            
            // Asignar puerto según tipo de aplicación
            var newUrl = instance.ApplicationType switch
            {
                "FARUPOS" => "http://localhost:5101",
                "FARUINV" => "http://localhost:5102",
                "FARUSEG" => "http://localhost:5103",
                _ => "http://localhost:5100"
            };
            
            instance.ApiBaseUrl = newUrl;
            instance.UpdatedAt = DateTime.UtcNow;
            instance.UpdatedBy = "dev-script";
            
            Console.WriteLine($"  {instance.TenantCode}: {oldUrl} → {newUrl}");
        }
        
        await context.SaveChangesAsync();
        Console.WriteLine($"✅ Actualizadas {instances.Count} instancias exitosamente");
    }
}
