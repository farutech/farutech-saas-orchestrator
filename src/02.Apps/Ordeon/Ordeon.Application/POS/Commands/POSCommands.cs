using System;

namespace Ordeon.Application.POS.Commands;

public record OpenSessionCommand(
    Guid CashRegisterId,
    decimal OpeningBalance,
    Guid TenantId);

public record RegisterCashMovementCommand(
    Guid CashSessionId,
    decimal Amount,
    string Concept,
    bool IsIncome,
    Guid TenantId);

public record CloseSessionRequest(
    Guid CashSessionId,
    decimal DeclaredBalance);
