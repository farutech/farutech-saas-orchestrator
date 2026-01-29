using System;

namespace Ordeon.Application.Common.Interfaces;

public interface ITenantService
{
    Guid? TenantId { get; }
    void SetTenant(Guid tenantId);
}
