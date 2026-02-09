using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NATS.Client.Core;
using System.Text.Json;

namespace Farutech.IAM.Infrastructure.Messaging;

/// <summary>
/// NATS implementation of event publisher
/// </summary>
public class NatsEventPublisher : IEventPublisher, IAsyncDisposable
{
    private readonly NatsOptions _options;
    private readonly ILogger<NatsEventPublisher> _logger;
    private NatsConnection? _connection;
    private bool _isConnected;

    public NatsEventPublisher(
        IOptions<NatsOptions> options,
        ILogger<NatsEventPublisher> logger)
    {
        _options = options.Value;
        _logger = logger;

        // Initialize connection if enabled
        if (_options.Enabled)
        {
            InitializeConnectionAsync().GetAwaiter().GetResult();
        }
        else
        {
            _logger.LogInformation("NATS event publishing is disabled");
        }
    }

    /// <summary>
    /// Initializes NATS connection
    /// </summary>
    private async Task InitializeConnectionAsync()
    {
        try
        {
            var opts = new NatsOpts
            {
                Url = _options.Url,
                Name = _options.ConnectionName,
                ConnectTimeout = TimeSpan.FromMilliseconds(_options.ConnectionTimeoutMs)
            };

            _connection = new NatsConnection(opts);
            await _connection.ConnectAsync();
            _isConnected = true;

            _logger.LogInformation(
                "Successfully connected to NATS server at {Url}",
                _options.Url);
        }
        catch (Exception ex)
        {
            _isConnected = false;
            _logger.LogError(ex,
                "Failed to connect to NATS server at {Url}. Event publishing will be disabled.",
                _options.Url);
        }
    }

    /// <inheritdoc/>
    public async Task PublishAsync<TEvent>(string subject, TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : class
    {
        if (!_options.Enabled)
        {
            _logger.LogDebug("NATS publishing disabled, skipping event {EventType}", typeof(TEvent).Name);
            return;
        }

        if (_connection == null || !_isConnected)
        {
            _logger.LogWarning(
                "NATS connection not available. Cannot publish event {EventType} to subject {Subject}",
                typeof(TEvent).Name,
                subject);
            return;
        }

        try
        {
            var json = JsonSerializer.Serialize(@event, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            });

            await _connection.PublishAsync(subject, json, cancellationToken: cancellationToken);

            _logger.LogDebug(
                "Published event {EventType} to subject {Subject}",
                typeof(TEvent).Name,
                subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to publish event {EventType} to subject {Subject}",
                typeof(TEvent).Name,
                subject);
        }
    }

    /// <inheritdoc/>
    public Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : class
    {
        // Generate subject from event type: iam.events.user_logged_in
        var eventType = typeof(TEvent).Name
            .Replace("Event", "")
            .ToLowerInvariant();

        // Convert PascalCase to snake_case
        eventType = string.Concat(
            eventType.Select((x, i) => i > 0 && char.IsUpper(x)
                ? "_" + char.ToLower(x)
                : char.ToLower(x).ToString()));

        var subject = $"{_options.SubjectPrefix}.{eventType}";

        return PublishAsync(subject, @event, cancellationToken);
    }

    public async ValueTask DisposeAsync()
    {
        if (_connection != null)
        {
            try
            {
                await _connection.DisposeAsync();
                _logger.LogInformation("NATS connection disposed");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disposing NATS connection");
            }
        }

        GC.SuppressFinalize(this);
    }
}
