using System.Collections.Generic;

namespace Ordeon.Application.Common.Interfaces;

public record PermissionDefinition(string Code, string Name, string Description, string Module);

public interface IPermissionProvider
{
    IEnumerable<PermissionDefinition> GetAllPermissions();
}
