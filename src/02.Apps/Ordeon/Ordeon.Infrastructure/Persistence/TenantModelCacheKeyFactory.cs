using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Ordeon.Application.Common.Interfaces;
using System;

namespace Ordeon.Infrastructure.Persistence;

public class TenantModelCacheKeyFactory : IModelCacheKeyFactory
{
    public object Create(DbContext context, bool designTime)
    {
        if (context is OrdeonDbContext ordeonContext)
        {
            // El cache key incluye el TenantId para que EF genere un modelo separado por cada schema
            return (context.GetType(), ordeonContext.Schema, designTime);
        }

        return context.GetType();
    }
}
