using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Ordeon.Domain.Aggregates.Audit;
using Ordeon.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace Ordeon.Infrastructure.Persistence.Interceptors;

public sealed class AuditInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        var context = eventData.Context;
        if (context == null) return new ValueTask<InterceptionResult<int>>(result);

        var entries = context.ChangeTracker.Entries<Entity>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted)
            .ToList();

        if (!entries.Any()) return new ValueTask<InterceptionResult<int>>(result);

        // Nota: En un entorno real, obtendríamos el UserId del IHttpContextAccessor
        // Aquí simplificamos o usamos un Guid.Empty si no está disponible en este scope directo
        
        foreach (var entry in entries)
        {
            var auditLog = AuditLog.Create(
                entry.Entity.GetType().Name,
                entry.Property("Id").CurrentValue?.ToString() ?? "unknown",
                entry.State.ToString(),
                JsonSerializer.Serialize(new { 
                    Original = entry.State == EntityState.Modified ? entry.OriginalValues.ToObject() : null,
                    Current = entry.State != EntityState.Deleted ? entry.CurrentValues.ToObject() : null
                }),
                Guid.Empty // Placeholder for actual UserID resolver
            );

            // No podemos añadir al mismo contexto mientras guardamos sin cuidado con recursión
            // Lo ideal es enviarlo a una cola o usar un segundo DbContext/DbSet específico
        }

        return new ValueTask<InterceptionResult<int>>(result);
    }
}
