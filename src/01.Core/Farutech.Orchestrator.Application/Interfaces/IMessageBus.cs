using System.Threading.Tasks;
using Farutech.Orchestrator.Application.DTOs.Provisioning;

namespace Farutech.Orchestrator.Application.Interfaces;

/// <summary>
/// Message bus interface for publishing provisioning tasks to NATS
/// </summary>
public interface IMessageBus
{
    Task PublishProvisioningTaskAsync(ProvisioningTaskMessage task);
    Task PublishAsync<T>(string subject, T message) where T : class;
}
