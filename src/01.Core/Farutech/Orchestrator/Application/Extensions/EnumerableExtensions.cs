using System;
using System.Collections.Generic;
using System.Linq;

namespace Farutech.Orchestrator.Application.Extensions;

public static class EnumerableExtensions
{
    /// <summary>
    /// Throws <see cref="InvalidOperationException"/> with the provided message when the sequence is empty.
    /// </summary>
    public static void ThrowIfEmpty<T>(this IEnumerable<T> source, string message)
    {
        if (source is null)
            throw new ArgumentNullException(nameof(source));

        if (!source.Any())
            throw new InvalidOperationException(message);
    }
}
