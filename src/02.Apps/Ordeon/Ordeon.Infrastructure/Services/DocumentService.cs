using Microsoft.EntityFrameworkCore;
using Ordeon.Application.Common.Interfaces;
using Ordeon.Domain.Aggregates.Documents;
using Ordeon.Infrastructure.Persistence;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Ordeon.Infrastructure.Services;

public sealed class DocumentService : IDocumentService
{
    private readonly OrdeonDbContext _context;

    public DocumentService(OrdeonDbContext context)
    {
        _context = context;
    }

    public async Task ActivateDocumentAsync(Guid documentHeaderId)
    {
        var header = await _context.DocumentHeaders
            .Include(h => h.Lines)
            .FirstOrDefaultAsync(h => h.Id == documentHeaderId);

        if (header == null) throw new Exception("Document not found");
        if (header.Status != DocumentStatus.Draft) throw new Exception("Only draft documents can be activated");

        // 1. Activar el documento
        header.Activate();

        // 2. Generar transacciones segun el tipo de documento (Simplificado)
        var definition = await _context.DocumentDefinitions.FindAsync(header.DocumentDefinitionId);
        
        foreach (var line in header.Lines)
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
