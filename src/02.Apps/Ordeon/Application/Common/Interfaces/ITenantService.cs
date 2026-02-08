using System;

namespace Farutech.Apps.Ordeon.Application.Common.Interfaces;

public interface ITenantService
{
    Guid? TenantId { get; }
    void SetTenant(Guid tenantId);
}

