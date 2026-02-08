using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Farutech.Orchestrator.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Implementación del servicio de invitaciones de usuarios a empresas.
/// </summary>
public class InvitationService(OrchestratorDbContext context, UserManager<ApplicationUser> userManager,
                               IAuthRepository authRepository, ILogger<InvitationService> logger) : IInvitationService
{
    private readonly OrchestratorDbContext _context = context;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IAuthRepository _authRepository = authRepository;
    private readonly ILogger<InvitationService> _logger = logger;

    public async Task<UserInvitation?> InviteUserAsync(
        string email, 
        Guid tenantId, 
        string role, 
        Guid invitedBy, 
        int expirationDays = 7)
    {
        if (!Enum.TryParse<FarutechRole>(role, true, out var roleEnum))
        {
            throw new ArgumentException($"Rol inválido: {role}");
        }

        // Validar que la empresa existe
        var tenant = await _authRepository.GetCustomerByIdAsync(tenantId);
        if (tenant == null)
        {
            _logger.LogWarning("Intento de invitar a tenant inexistente: {TenantId}", tenantId);
            throw new InvalidOperationException($"El tenant {tenantId} no existe");
        }

        // CASO 1: Usuario YA existe en el sistema
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            _logger.LogInformation(
                "Usuario {Email} ya existe. Asignando directamente a tenant {TenantId} con rol {Role}",
                email, tenantId, role);

            // Verificar que no esté ya asignado
            var existingMembership = await _authRepository.GetUserMembershipAsync(existingUser.Id, tenantId);
            if (existingMembership != null)
            {
                _logger.LogWarning(
                    "Usuario {Email} ya tiene membresía en tenant {TenantId}",
                    email, tenantId);
                throw new InvalidOperationException("El usuario ya es miembro de esta empresa");
            }

            // Crear relación directa
            var membership = new UserCompanyMembership
            {
                UserId = existingUser.Id,
                CustomerId = tenantId,
                Role = roleEnum,
                IsActive = true,
                GrantedAt = DateTime.UtcNow,
                GrantedBy = invitedBy
            };

            await _authRepository.AddMembershipAsync(membership);
            
            _logger.LogInformation(
                "Usuario {Email} asignado exitosamente a tenant {TenantId}",
                email, tenantId);

            // No retorna UserInvitation porque se asignó directamente
            return null;
        }

        // CASO 2: Usuario NO existe → Crear invitación
        _logger.LogInformation(
            "Usuario {Email} no existe. Creando invitación para tenant {TenantId}",
            email, tenantId);

        // Verificar que no exista una invitación pendiente
        var pendingInvitation = await _context.UserInvitations
            .FirstOrDefaultAsync(i => 
                i.Email == email && 
                i.TargetTenantId == tenantId && 
                i.Status == InvitationStatus.Pending);

        if (pendingInvitation != null)
        {
            _logger.LogWarning(
                "Ya existe una invitación pendiente para {Email} en tenant {TenantId}",
                email, tenantId);
            throw new InvalidOperationException("Ya existe una invitación pendiente para este usuario");
        }

        var invitation = new UserInvitation
        {
            Email = email,
            TargetTenantId = tenantId,
            TargetRole = roleEnum,
            Token = Guid.NewGuid(),
            ExpirationDate = DateTime.UtcNow.AddDays(expirationDays),
            Status = InvitationStatus.Pending,
            InvitedBy = invitedBy
        };

        _context.UserInvitations.Add(invitation);
        await _context.SaveChangesAsync();

        // Simular envío de correo (en producción, usar un servicio de email real)
        var invitationLink = $"https://app.farutech.com/accept-invitation?token={invitation.Token}";
        _logger.LogInformation(
            "📧 [SIMULATED EMAIL] Invitación enviada a {Email}\n" +
            "   Link: {InvitationLink}\n" +
            "   Empresa: {CompanyName}\n" +
            "   Rol: {Role}\n" +
            "   Expira: {ExpirationDate}",
            email, invitationLink, tenant.CompanyName, role, invitation.ExpirationDate);

        return invitation;
    }

    public async Task<bool> AcceptInvitationAsync(Guid invitationToken, Guid userId)
    {
        var invitation = await _context.UserInvitations
            .FirstOrDefaultAsync(i => i.Token == invitationToken);

        if (invitation == null)
        {
            _logger.LogWarning("Token de invitación inválido: {Token}", invitationToken);
            return false;
        }

        // Validar estado
        if (invitation.Status != InvitationStatus.Pending)
        {
            _logger.LogWarning(
                "Intento de aceptar invitación con estado {Status}: {InvitationId}",
                invitation.Status, invitation.Id);
            return false;
        }

        // Validar expiración
        if (invitation.ExpirationDate < DateTime.UtcNow)
        {
            _logger.LogWarning("Invitación expirada: {InvitationId}", invitation.Id);
            invitation.Status = InvitationStatus.Expired;
            await _context.SaveChangesAsync();
            return false;
        }

        // Validar que el usuario que acepta tiene el mismo email
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null || user.Email?.ToLower() != invitation.Email.ToLower())
        {
            _logger.LogWarning(
                "Usuario {UserId} intentó aceptar invitación para email diferente: {Email}",
                userId, invitation.Email);
            return false;
        }

        // Crear la membresía
        var membership = new UserCompanyMembership
        {
            UserId = userId,
            CustomerId = invitation.TargetTenantId,
            Role = invitation.TargetRole,
            IsActive = true,
            GrantedAt = DateTime.UtcNow,
            GrantedBy = invitation.InvitedBy
        };

        await _authRepository.AddMembershipAsync(membership);

        // Actualizar invitación
        invitation.Status = InvitationStatus.Accepted;
        invitation.AcceptedAt = DateTime.UtcNow;
        invitation.AcceptedByUserId = userId;
        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Invitación {InvitationId} aceptada por usuario {UserId}",
            invitation.Id, userId);

        return true;
    }

    public async Task<List<UserInvitation>> GetPendingInvitationsAsync(string email)
        => await _context.UserInvitations
            .Where(i =>
                i.Email == email &&
                i.Status == InvitationStatus.Pending &&
                i.ExpirationDate > DateTime.UtcNow)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

    public async Task<bool> CancelInvitationAsync(Guid invitationId, Guid cancelledBy)
    {
        var invitation = await _context.UserInvitations.FindAsync(invitationId);
        
        if (invitation == null || invitation.Status != InvitationStatus.Pending)
        {
            return false;
        }

        invitation.Status = InvitationStatus.Cancelled;
        invitation.UpdatedAt = DateTime.UtcNow;
        invitation.UpdatedBy = cancelledBy.ToString();
        
        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Invitación {InvitationId} cancelada por usuario {CancelledBy}",
            invitationId, cancelledBy);

        return true;
    }

    public async Task<int> ExpireOldInvitationsAsync()
    {
        var expiredInvitations = await _context.UserInvitations
            .Where(i => 
                i.Status == InvitationStatus.Pending && 
                i.ExpirationDate < DateTime.UtcNow)
            .ToListAsync();

        foreach (var invitation in expiredInvitations)
        {
            invitation.Status = InvitationStatus.Expired;
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Marcadas como expiradas {Count} invitaciones",
            expiredInvitations.Count);

        return expiredInvitations.Count;
    }
}
