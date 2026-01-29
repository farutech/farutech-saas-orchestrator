using System;

namespace Ordeon.Application.MasterData.Commands;

public record CreateThirdPartyRequest(
    string Identification,
    string Name,
    string Email,
    Ordeon.Domain.Aggregates.ThirdParties.ThirdPartyType Type,
    string Phone,
    string Address);

public record CreatePaymentMethodRequest(
    string Name,
    string Code,
    Ordeon.Domain.Aggregates.Financial.PaymentCategory Category);
