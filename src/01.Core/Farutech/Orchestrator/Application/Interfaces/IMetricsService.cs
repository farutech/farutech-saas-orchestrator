using Farutech.Orchestrator.Domain.Enums;

/// <summary>
/// Interface for collecting and exposing application metrics
/// </summary>
public interface IMetricsService
{
    // HTTP Request Metrics
    void RecordHttpRequest(string method, string endpoint, string statusCode, double durationSeconds);

    // Task Processing Metrics
    void RecordTaskCreated(ProvisionTaskType taskType, string initialStatus = "pending");
    void RecordTaskCompleted(ProvisionTaskType taskType, string finalStatus, double durationSeconds);
    void RecordTaskRetry(ProvisionTaskType taskType, string retryReason);

    // Service Authentication Metrics
    void RecordServiceTokenGenerated(string serviceType);
    void RecordServiceTokenValidated(string serviceType, bool isValid);

    // Database Metrics
    void RecordDatabaseQuery(string operation, string table, bool success, double durationSeconds);

    // NATS Messaging Metrics
    void RecordNatsMessagePublished(string subject, bool success);
    void RecordNatsMessageConsumed(string subject, string consumer, bool success);
}