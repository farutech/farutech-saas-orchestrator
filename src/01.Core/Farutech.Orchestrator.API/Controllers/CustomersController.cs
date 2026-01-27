using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Farutech.Orchestrator.API.Controllers;

/// <summary>
/// Controlador para gestión de empresas (Customers/Tenants).
/// Incluye lógica de "Primer Onboarding" para usuarios nuevos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController(
    OrchestratorDbContext context,
    IAuthService authService,
    ILogger<CustomersController> logger) : ControllerBase
{
    private readonly OrchestratorDbContext _context = context;
    private readonly IAuthService _authService = authService;
    private readonly ILogger<CustomersController> _logger = logger;

    /// <summary>
    /// Obtiene las empresas donde el usuario actual es Owner con soporte de paginación y filtrado.
    /// </summary>
    /// <param name="pageNumber">Número de página (default: 1)</param>
    /// <param name="pageSize">Tamaño de página (default: 10, max: 100)</param>
    /// <param name="filter">Filtro opcional para buscar por nombre, email o Tax ID</param>
    [HttpGet]
    [ProducesResponseType(typeof(PagedOrganizationsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyOrganizations(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? filter = null)
    {
        // Obtener UserId del token JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token JWT inválido" });
        }

        // Validar parámetros
        pageSize = Math.Min(pageSize, 100); // Max 100 items per page
        pageNumber = Math.Max(pageNumber, 1);

        // Obtener solo las organizaciones donde el usuario es Owner
        var query = from customer in _context.Customers
                    join membership in _context.UserCompanyMemberships
                        on customer.Id equals membership.CustomerId
                    where membership.UserId == userId
                        && membership.Role == Domain.Enums.FarutechRole.Owner
                        && membership.IsActive
                        && !customer.IsDeleted
                    select customer;

        // Aplicar filtro si existe
        if (!string.IsNullOrWhiteSpace(filter))
        {
            var normalizedFilter = filter.Trim().ToLower();
            query = query.Where(c =>
                c.CompanyName.ToLower().Contains(normalizedFilter) ||
                (c.Email != null && c.Email.ToLower().Contains(normalizedFilter)) ||
                (c.TaxId != null && c.TaxId.ToLower().Contains(normalizedFilter)));
        }

        // Contar total
        var totalCount = await query.CountAsync();

        // Aplicar paginación
        var organizations = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new OrganizationDto
            {
                Id = c.Id,
                CompanyName = c.CompanyName,
                Email = c.Email,
                TaxId = c.TaxId,
                Code = c.Code,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt,
                InstanceCount = _context.TenantInstances.Count(t => t.CustomerId == c.Id && !t.IsDeleted)
            })
            .ToListAsync();

        return Ok(new PagedOrganizationsResponse
        {
            Organizations = organizations,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        });
    }

    /// <summary>
    /// Obtiene una empresa por ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(Customer), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound(new { message = "Empresa no encontrada" });
        }
        return Ok(customer);
    }

    /// <summary>
    /// Crea una nueva empresa (Customer).
    /// LÓGICA DE PRIMER ONBOARDING:
    /// - Permite acceso a usuarios autenticados SIN tenant_id (Token Limpio).
    /// - Asigna automáticamente al usuario actual como Owner de la nueva empresa.
    /// - El usuario debe hacer logout/login para que aparezca su nueva empresa en el token.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CreateCustomerResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] CreateCustomerRequest request)
    {
        // Obtener UserId del token JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token JWT inválido o sin claim 'sub'" });
        }

        _logger.LogInformation(
            "Usuario {UserId} creando nueva empresa: {CompanyName}",
            userId, request.CompanyName);

        // Verificar que el email no esté ya registrado
        var existingCustomer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Email == request.Email);

        if (existingCustomer != null)
        {
            return BadRequest(new { message = "Ya existe una empresa con ese email" });
        }

        // Crear la empresa
        var customer = new Customer
        {
            CompanyName = request.CompanyName,
            Email = request.Email,
            Phone = request.Phone ?? string.Empty,
            Address = request.Address ?? string.Empty,
            TaxId = request.TaxId ?? string.Empty,
            Code = GenerateCustomerCode(request.CompanyName),
            IsActive = true,
            CreatedBy = userId.ToString()
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Empresa {CustomerId} creada exitosamente: {CompanyName}",
            customer.Id, customer.CompanyName);

        // ONBOARDING: La lógica de roles depende de si se especificó un AdminUserId
        
        // 1. Asignar al creador como OWNER (Siempre)
        var ownerAssigned = await _authService.AssignUserToCompanyAsync(
            userId,
            customer.Id,
            "Owner",
            userId
        );

        if (!ownerAssigned)
        {
             // Rollback
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
             return BadRequest(new { message = "Error critical al asignar Owner." });
        }

        // 2. Si se especificó un AdminUserId, asignarlo como ADMIN
        if (request.AdminUserId.HasValue && request.AdminUserId.Value != userId)
        {
            var adminAssigned = await _authService.AssignUserToCompanyAsync(
                request.AdminUserId.Value,
                customer.Id,
                "Admin",
                userId // Grantor es el Owner
            );

            if (!adminAssigned)
            {
                 _logger.LogWarning("No se pudo asignar el AdminUserId {AdminId} a la empresa {CustomerId}", request.AdminUserId, customer.Id);
                 // No hacemos rollback de la empresa, es un error no crítico
            }
        }

        _logger.LogInformation(
            "Usuario {UserId} asignado como Owner de empresa {CustomerId}",
            userId, customer.Id);

        return CreatedAtAction(
            nameof(GetById),
            new { id = customer.Id },
            new CreateCustomerResponse
            {
                CustomerId = customer.Id,
                CompanyName = customer.CompanyName,
                Code = customer.Code,
                Message = "Empresa creada exitosamente. Haz logout/login para actualizar tu token con la nueva empresa."
            });
    }

    /// <summary>
    /// Actualiza una empresa existente (requiere ser Owner).
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCustomerRequest request)
    {
        // Obtener UserId del token JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            _logger.LogWarning("Update failed: Invalid user ID claim for user {UserIdClaim}", userIdClaim);
            return Unauthorized(new { message = "Token JWT inválido" });
        }

        _logger.LogInformation("Update request for customer {CustomerId} by user {UserId}", id, userId);

        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            _logger.LogWarning("Update failed: Customer {CustomerId} not found", id);
            return NotFound(new { message = "Empresa no encontrada" });
        }

        // Verificar que el usuario es Owner de esta organización
        var isOwner = await _context.UserCompanyMemberships
            .AnyAsync(m => m.UserId == userId
                && m.CustomerId == id
                && m.Role == Domain.Enums.FarutechRole.Owner
                && m.IsActive);

        _logger.LogInformation("User {UserId} ownership check for customer {CustomerId}: {IsOwner}", userId, id, isOwner);

        if (!isOwner)
        {
            _logger.LogWarning("Update denied: User {UserId} is not owner of customer {CustomerId}", userId, id);
            return Forbid();
        }

        // Actualizar campos
        customer.CompanyName = request.CompanyName.Trim();
        customer.Email = request.Email.Trim();
        customer.Phone = request.Phone?.Trim() ?? string.Empty;
        customer.Address = request.Address?.Trim() ?? string.Empty;
        customer.TaxId = request.TaxId?.Trim() ?? string.Empty;
        customer.UpdatedAt = DateTime.UtcNow;
        customer.UpdatedBy = userIdClaim;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Customer {CustomerId} updated successfully by user {UserId}", id, userId);

        return Ok(new { message = "Empresa actualizada exitosamente", customer });
    }

    /// <summary>
    /// Cambia el estado activo/inactivo de una organización (requiere ser Owner).
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ToggleStatus(Guid id, [FromBody] ToggleStatusRequest request)
    {
        // Obtener UserId del token JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token JWT inválido" });
        }

        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound(new { message = "Empresa no encontrada" });
        }

        // Verificar que el usuario es Owner de esta organización
        var isOwner = await _context.UserCompanyMemberships
            .AnyAsync(m => m.UserId == userId
                && m.CustomerId == id
                && m.Role == Domain.Enums.FarutechRole.Owner
                && m.IsActive);

        if (!isOwner)
        {
            return Forbid();
        }

        customer.IsActive = request.IsActive;
        customer.UpdatedAt = DateTime.UtcNow;
        customer.UpdatedBy = userIdClaim;

        await _context.SaveChangesAsync();

        return Ok(new { 
            message = $"Empresa {(request.IsActive ? "activada" : "inactivada")} exitosamente",
            isActive = customer.IsActive
        });
    }

    /// <summary>
    /// Elimina físicamente una empresa solo si NO tiene instancias asociadas (requiere ser Owner).
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(Guid id)
    {
        // Obtener UserId del token JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token JWT inválido" });
        }

        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound(new { message = "Empresa no encontrada" });
        }

        // Verificar que el usuario es Owner de esta organización
        var isOwner = await _context.UserCompanyMemberships
            .AnyAsync(m => m.UserId == userId
                && m.CustomerId == id
                && m.Role == Domain.Enums.FarutechRole.Owner
                && m.IsActive);

        if (!isOwner)
        {
            return Forbid();
        }

        // VALIDACIÓN: No permitir eliminar si tiene instancias
        var hasInstances = await _context.TenantInstances
            .AnyAsync(t => t.CustomerId == id && !t.IsDeleted);

        if (hasInstances)
        {
            var instanceCount = await _context.TenantInstances
                .CountAsync(t => t.CustomerId == id && !t.IsDeleted);
                
            return Conflict(new
            {
                message = "No se puede eliminar la organización porque tiene instancias activas",
                instanceCount,
                suggestion = "Elimina primero todas las instancias o inactiva la organización"
            });
        }

        // Eliminación física (hard delete)
        _context.Customers.Remove(customer);
        
        // También eliminar las membresías asociadas
        var memberships = await _context.UserCompanyMemberships
            .Where(m => m.CustomerId == id)
            .ToListAsync();
        _context.UserCompanyMemberships.RemoveRange(memberships);

        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Organización {CustomerId} eliminada físicamente por usuario {UserId}",
            id, userId);

        return Ok(new { message = "Empresa eliminada exitosamente" });
    }

    /// <summary>
    /// Genera un código único para el Customer basado en el nombre de la empresa.
    /// </summary>
    private static string GenerateCustomerCode(string companyName)
    {
        var prefix = new string(companyName
            .ToUpperInvariant()
            .Where(char.IsLetterOrDigit)
            .Take(4)
            .ToArray());

        var uniqueSuffix = Guid.NewGuid().ToString("N")[..4].ToUpperInvariant();
        
        return $"{prefix}{uniqueSuffix}";
    }
}

#region DTOs

/// <summary>
/// Request para crear una nueva empresa.
/// </summary>
public record CreateCustomerRequest
{
    public required string CompanyName { get; init; }
    public required string Email { get; init; }
    public string? Phone { get; init; }
    public string? Address { get; init; }
    public string? TaxId { get; init; }
    /// <summary>
    /// ID opcional de un usuario Admin a invitar.
    /// Si se especifica: Creador = Owner, AdminUserId = Admin.
    /// Si NO se especifica: Creador = Owner (implícitamente Admin).
    /// </summary>
    public Guid? AdminUserId { get; init; }
}

/// <summary>
/// Response de creación de empresa.
/// </summary>
public record CreateCustomerResponse
{
    public required Guid CustomerId { get; init; }
    public required string CompanyName { get; init; }
    public required string Code { get; init; }
    public required string Message { get; init; }
}

/// <summary>
/// Request para actualizar una empresa.
/// </summary>
public record UpdateCustomerRequest
{
    public required string CompanyName { get; init; }
    public required string Email { get; init; }
    public string? Phone { get; init; }
    public string? Address { get; init; }
    public string? TaxId { get; init; }
}

/// <summary>
/// Request para cambiar el estado activo/inactivo.
/// </summary>
public record ToggleStatusRequest
{
    public required bool IsActive { get; init; }
}

/// <summary>
/// DTO de organización para listado.
/// </summary>
public record OrganizationDto
{
    public required Guid Id { get; init; }
    public required string CompanyName { get; init; }
    public required string Email { get; init; }
    public string? TaxId { get; init; }
    public string? Code { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required int InstanceCount { get; init; }
}

/// <summary>
/// Response paginado de organizaciones.
/// </summary>
public record PagedOrganizationsResponse
{
    public required List<OrganizationDto> Organizations { get; init; }
    public required int TotalCount { get; init; }
    public required int PageNumber { get; init; }
    public required int PageSize { get; init; }
    public required int TotalPages { get; init; }
}

#endregion
