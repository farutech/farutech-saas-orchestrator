using System;
using Farutech.Apps.Ordeon.Application.Common.Interfaces;

namespace Farutech.Apps.Ordeon.Infrastructure.Services;

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

