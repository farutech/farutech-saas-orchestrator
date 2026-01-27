using Farutech.Orchestrator.Domain.Common;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Domain.Enums;

namespace Farutech.Orchestrator.Domain.Entities.Identity;

/// <summary>
/// Relación many-to-many entre Usuario y Empresa (Customer).
/// Permite que un usuario (ej. Contador) tenga acceso a múltiples empresas con roles específicos.
/// </summary>
public class UserCompanyMembership : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    /// <summary>
    /// Rol del usuario en esta empresa específica.
    /// Definido por el Enum FarutechRole (Owner, InstanceAdmin, User, Guest).
    /// </summary>
    public FarutechRole Role { get; set; } = FarutechRole.User;

    public bool IsActive { get; set; } = true;

    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
    public Guid? GrantedBy { get; set; }
}
