using Microsoft.AspNetCore.Identity;

namespace Farutech.Orchestrator.Domain.Entities.Identity;

/// <summary>
/// Usuario global del sistema. Puede pertenecer a múltiples empresas (Customers).
/// </summary>
public class ApplicationUser : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Membresías del usuario en diferentes empresas (multi-tenancy).
    /// </summary>
    public ICollection<UserCompanyMembership> CompanyMemberships { get; set; } = new List<UserCompanyMembership>();

    public string FullName => $"{FirstName} {LastName}".Trim();
}
