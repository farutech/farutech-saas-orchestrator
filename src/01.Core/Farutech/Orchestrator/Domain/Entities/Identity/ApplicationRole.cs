using Microsoft.AspNetCore.Identity;

namespace Farutech.Orchestrator.Domain.Entities.Identity;

/// <summary>
/// Rol global del sistema. Utiliza RoleClaims para permisos.
/// </summary>
public class ApplicationRole : IdentityRole<Guid>
{
    // Puedes agregar propiedades adicionales si lo requieres
}
