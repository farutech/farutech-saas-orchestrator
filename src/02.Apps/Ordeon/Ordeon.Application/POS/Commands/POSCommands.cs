using System;

namespace Ordeon.Application.POS.Commands;

public record OpenSessionCommand(
    Guid CashRegisterId,
    decimal OpeningBalance);

public record RegisterCashMovementCommand(
    Guid CashSessionId,
    decimal Amount,
    string Concept,
    bool IsIncome);

public record CloseSessionRequest(
    Guid CashSessionId,
    decimal DeclaredBalance);
