using Microsoft.EntityFrameworkCore;
using Farutech.Apps.Ordeon.Application.Common.Interfaces;
using Farutech.Apps.Ordeon.Domain.Aggregates.Documents;
using Farutech.Apps.Ordeon.Infrastructure.Persistence;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Farutech.Apps.Ordeon.Infrastructure.Services;

public sealed class DocumentService(OrdeonDbContext context) : IDocumentService
{
    private readonly OrdeonDbContext _context = context;

    public async Task ActivateDocumentAsync(Guid documentHeaderId)
    {
        var header = await _context.DocumentHeaders
            .Include(h => h.Lines)
            .FirstOrDefaultAsync(h => h.Id == documentHeaderId) ?? throw new Exception("Document not found");
        if (header.Status != DocumentStatus.Draft) throw new Exception("Only draft documents can be activated");

        // 1. Activar el documento
        header.Activate();

        // 2. Generar transacciones segun el tipo de documento (Simplificado)
        var definition = await _context.DocumentDefinitions.FindAsync(header.DocumentDefinitionId) ?? throw new Exception("Document definition not found");
        var lines = header.Lines ?? Enumerable.Empty<DocumentLine>();

        foreach (var line in lines)
        {
            var txType = definition.Module switch
            {
                DocumentModule.Sales => TransactionType.StockOut,
                DocumentModule.Purchases => TransactionType.StockIn,
                _ => TransactionType.Accounting
            };

            var transaction = TransactionRegistry.Create(
                header.Id,
                line.ItemId,
                line.Quantity,
                line.Total,
                txType,
                header.Date,
                header.WarehouseId
            );

            _context.TransactionRegistries.Add(transaction);
        }

        await _context.SaveChangesAsync();
    }
}

