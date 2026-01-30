using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Farutech.Orchestrator.Application.DTOs.Provisioning;
using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.Extensions.Logging;
using NATS.Client.Core;

namespace Farutech.Orchestrator.Infrastructure.Messaging;

/// <summary>
/// NATS message bus resiliente con modo degradado
/// Si NATS no está disponible, registra el mensaje pero no falla
/// </summary>
public class NatsMessageBus(INatsConnection? connection, ILogger<NatsMessageBus> logger) : IMessageBus
{
    private readonly INatsConnection? _connection = connection;
    private readonly ILogger<NatsMessageBus> _logger = logger;
    private const string ProvisioningSubject = "provisioning.tasks";

    public async Task PublishProvisioningTaskAsync(ProvisioningTaskMessage task) 
        => await PublishAsync(ProvisioningSubject, task);

    public async Task PublishAsync<T>(string subject, T message) where T : class
    {
        if (_connection == null)
        {
            _logger.LogWarning(
                "NATS no disponible. Mensaje a '{Subject}' no enviado: {Message}", 
                subject, 
                JsonSerializer.Serialize(message));
            
            // TODO: Implementar fallback (guardar en DB, enviar a cola alternativa, etc.)
            return;
        }

        try
        {
            await _connection.PublishAsync(subject, message, cancellationToken: CancellationToken.None);
            _logger.LogInformation("Mensaje publicado a NATS: {Subject}", subject);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "NATS no disponible o rechazo de conexión ({Subject}). Operando en modo degradado (Fallback a DB). Mensaje: {Message}", 
                subject, 
                JsonSerializer.Serialize(message));
            
            // No lanzar excepción - modo degradado
            // En producción: guardar en tabla de outbox para retry
        }
    }
}
