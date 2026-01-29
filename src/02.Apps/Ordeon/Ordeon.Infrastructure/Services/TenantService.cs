using System;
using Ordeon.Application.Common.Interfaces;

namespace Ordeon.Infrastructure.Services;

public sealed class TenantService : ITenantService
{
    public Guid? TenantId { get; private set; }

    public void SetTenant(Guid tenantId)
    {
        if (TenantId.HasValue && TenantId != tenantId)
        {
            throw new InvalidOperationException("Tenant has already been set for this scope.");
        }
        TenantId = tenantId;
    }
}
