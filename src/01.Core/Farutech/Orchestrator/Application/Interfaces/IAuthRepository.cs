using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Domain.Entities.Tenants;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Repositorio para operaciones de autenticación y membresías.
/// </summary>
public interface IAuthRepository
{
    Task<IEnumerable<UserCompanyMembership>> GetUserMembershipsAsync(Guid userId);
    Task<UserCompanyMembership?> GetUserMembershipAsync(Guid userId, Guid customerId);
    Task<Customer?> GetCustomerByIdAsync(Guid customerId);
    Task<IEnumerable<TenantInstance>> GetTenantInstancesAsync(Guid customerId);
    Task<bool> AddMembershipAsync(UserCompanyMembership membership);
    
    // Password Reset operations
    Task<PasswordResetToken> CreatePasswordResetTokenAsync(PasswordResetToken token);
    Task<PasswordResetToken?> GetPasswordResetTokenAsync(string token);
    Task<bool> UpdatePasswordResetTokenAsync(PasswordResetToken token);
}
