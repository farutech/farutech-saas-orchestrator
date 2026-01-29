using System;
using System.Threading.Tasks;

namespace Ordeon.Application.Common.Interfaces;

public interface ICashierContext
{
    Guid? CashierId { get; }
    Task<Guid> GetRequiredCashierIdAsync();
}
