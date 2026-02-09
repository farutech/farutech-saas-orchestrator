namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Service for publishing domain events to NATS
/// </summary>
public interface IEventPublisher
{
    /// <summary>
    /// Publishes a domain event to NATS
    /// </summary>
    /// <typeparam name="TEvent">Type of event to publish</typeparam>
    /// <param name="subject">NATS subject to publish to</param>
    /// <param name="event">Event data to publish</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task PublishAsync<TEvent>(string subject, TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : class;

    /// <summary>
    /// Publishes a domain event with default subject pattern (prefix + event type)
    /// </summary>
    /// <typeparam name="TEvent">Type of event to publish</typeparam>
    /// <param name="event">Event data to publish</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : class;
}
