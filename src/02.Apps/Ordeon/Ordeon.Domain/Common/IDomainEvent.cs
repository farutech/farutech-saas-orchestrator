using System;

namespace Ordeon.Domain.Common;

/// <summary>
/// Interfaz que marca un evento de dominio.
/// </summary>
public interface IDomainEvent
{
    DateTime OccurredAtUtc { get; }
}
