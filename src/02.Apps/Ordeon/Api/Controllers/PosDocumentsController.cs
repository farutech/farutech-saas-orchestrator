using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Farutech.Apps.Ordeon.API.Authorization;
using Farutech.Apps.Ordeon.Application.Common.Interfaces;
using Farutech.Apps.Ordeon.Domain.Aggregates.Documents;
using Farutech.Apps.Ordeon.Domain.Aggregates.Identity;
using Farutech.Apps.Ordeon.Domain.Aggregates.POS;
using Farutech.Apps.Ordeon.Infrastructure.Persistence;

namespace Farutech.Apps.Ordeon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PosDocumentsController : ControllerBase
{
    private readonly OrdeonDbContext _context;
    private readonly IDocumentService _documentService;
    private readonly ITenantService _tenantService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PosDocumentsController(
        OrdeonDbContext context, 
        IDocumentService documentService,
        ITenantService tenantService,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _documentService = documentService;
        _tenantService = tenantService;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost("withdrawal")]
    [RequireFeature("POS_BASIC")]
    [RequirePermission(Permissions.POS.WithdrawCash)]
    public async Task<IActionResult> CreateWithdrawal([FromBody] WithdrawalRequest request)
    {
        // 1. Obtener definición de documento para Sangría
        var definition = await _context.DocumentDefinitions
            .FirstOrDefaultAsync(d => d.Code == "WDR");

        if (definition == null) return BadRequest("Withdrawal document definition not found.");

        // 2. Crear cabecera de documento
        var userIdStr = _httpContextAccessor.HttpContext?.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var userId = Guid.TryParse(userIdStr, out var uid) ? uid : Guid.Empty;

        var number = definition.GenerateNextNumber();
        var header = DocumentHeader.Create(definition.Id, number, request.WarehouseId, null, userId); 
        
        // 3. Agregar cuerpo (sangría es un "item" genérico de efectivo)
        // Usamos un Guid específico de sistema para 'Efectivo' o el ItemId enviado
        header.AddLine(request.ItemId, "Retiro de Efectivo (Sangría)", 1, request.Amount);
        
        _context.DocumentHeaders.Add(header);
        
        // 4. Registrar en la sesión de caja si se provee
        if (request.CashSessionId.HasValue)
        {
            var session = await _context.CashSessions.FindAsync(request.CashSessionId.Value);
            if (session != null)
            {
                session.AddMovement(request.Amount, $"Sangría {number}: {request.Concept}", false);
            }
        }

        await _context.SaveChangesAsync();
        
        // 5. Activar documento (genera transacciones automáticamente)
        await _documentService.ActivateDocumentAsync(header.Id);

        return Ok(new { DocumentNumber = number, header.Id });
    }
}

public record WithdrawalRequest(
    Guid WarehouseId,
    Guid ItemId, // Item representativo de 'Caja'
    decimal Amount,
    string Concept,
    Guid? CashSessionId);

