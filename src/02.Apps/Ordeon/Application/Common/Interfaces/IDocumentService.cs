using System;
using System.Threading.Tasks;

namespace Farutech.Apps.Ordeon.Application.Common.Interfaces;

public interface IDocumentService
{
    /// <summary>
    /// Activa un documento y genera los registros en la tabla de transacciones.
    /// </summary>
    Task ActivateDocumentAsync(Guid documentHeaderId);
}

