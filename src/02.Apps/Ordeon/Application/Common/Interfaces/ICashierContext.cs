using System;
using System.Threading.Tasks;

namespace Farutech.Apps.Ordeon.Application.Common.Interfaces;

public interface ICashierContext
{
    Guid? CashierId { get; }
    Task<Guid> GetRequiredCashierIdAsync();
}

