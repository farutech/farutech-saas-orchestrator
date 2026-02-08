using Prometheus;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Enums;

namespace Farutech.Orchestrator.API.Services;

/// <summary>
/// Service for collecting and exposing Prometheus metrics for the orchestrator
/// </summary>
public class MetricsService : IMetricsService
{
    // HTTP Request Metrics
    private readonly Counter _httpRequestsTotal = Metrics.CreateCounter(
        "farutech_http_requests_total",
        "Total number of HTTP requests",
        new CounterConfiguration
        {
            LabelNames = new[] { "method", "endpoint", "status_code" }
        });

    private readonly Histogram _httpRequestDuration = Metrics.CreateHistogram(
        "farutech_http_request_duration_seconds",
        "Duration of HTTP requests in seconds",
        new HistogramConfiguration
        {
            LabelNames = new[] { "method", "endpoint" },
            Buckets = Histogram.ExponentialBuckets(0.1, 2, 10)
        });

    // Task Processing Metrics
    private readonly Counter _tasksCreatedTotal = Metrics.CreateCounter(
        "farutech_tasks_created_total",
        "Total number of async tasks created",
        new CounterConfiguration
        {
            LabelNames = new[] { "task_type", "status" }
        });

    private readonly Counter _tasksCompletedTotal = Metrics.CreateCounter(
        "farutech_tasks_completed_total",
        "Total number of async tasks completed",
        new CounterConfiguration
        {
            LabelNames = new[] { "task_type", "status", "duration_seconds" }
        });

    private readonly Gauge _activeTasks = Metrics.CreateGauge(
        "farutech_active_tasks",
        "Number of currently active tasks",
        new GaugeConfiguration
        {
            LabelNames = new[] { "task_type" }
        });

    private readonly Counter _taskRetriesTotal = Metrics.CreateCounter(
        "farutech_task_retries_total",
        "Total number of task retries",
        new CounterConfiguration
        {
            LabelNames = new[] { "task_type", "retry_reason" }
        });

    // Service Authentication Metrics
    private readonly Counter _serviceAuthTokensGenerated = Metrics.CreateCounter(
        "farutech_service_auth_tokens_generated_total",
        "Total number of service authentication tokens generated",
        new CounterConfiguration
        {
            LabelNames = new[] { "service_type" }
        });

    private readonly Counter _serviceAuthTokensValidated = Metrics.CreateCounter(
        "farutech_service_auth_tokens_validated_total",
        "Total number of service authentication tokens validated",
        new CounterConfiguration
        {
            LabelNames = new[] { "service_type", "result" }
        });

    // Database Metrics
    private readonly Counter _databaseQueriesTotal = Metrics.CreateCounter(
        "farutech_database_queries_total",
        "Total number of database queries executed",
        new CounterConfiguration
        {
            LabelNames = new[] { "operation", "table", "result" }
        });

    private readonly Histogram _databaseQueryDuration = Metrics.CreateHistogram(
        "farutech_database_query_duration_seconds",
        "Duration of database queries in seconds",
        new HistogramConfiguration
        {
            LabelNames = new[] { "operation", "table" },
            Buckets = Histogram.ExponentialBuckets(0.01, 2, 10)
        });

    // NATS Messaging Metrics
    private readonly Counter _natsMessagesPublished = Metrics.CreateCounter(
        "farutech_nats_messages_published_total",
        "Total number of NATS messages published",
        new CounterConfiguration
        {
            LabelNames = new[] { "subject", "result" }
        });

    private readonly Counter _natsMessagesConsumed = Metrics.CreateCounter(
        "farutech_nats_messages_consumed_total",
        "Total number of NATS messages consumed",
        new CounterConfiguration
        {
            LabelNames = new[] { "subject", "consumer", "result" }
        });

    // HTTP Request Metrics
    public void RecordHttpRequest(string method, string endpoint, string statusCode, double durationSeconds)
    {
        _httpRequestsTotal.WithLabels(method, endpoint, statusCode).Inc();
        _httpRequestDuration.WithLabels(method, endpoint).Observe(durationSeconds);
    }

    // Task Metrics
    public void RecordTaskCreated(ProvisionTaskType taskType, string initialStatus = "pending")
    {
        _tasksCreatedTotal.WithLabels(taskType.ToString(), initialStatus).Inc();
        _activeTasks.WithLabels(taskType.ToString()).Inc();
    }

    public void RecordTaskCompleted(ProvisionTaskType taskType, string finalStatus, double durationSeconds)
    {
        _tasksCompletedTotal.WithLabels(taskType.ToString(), finalStatus, durationSeconds.ToString("F0")).Inc();
        _activeTasks.WithLabels(taskType.ToString()).Dec();
    }

    public void RecordTaskRetry(ProvisionTaskType taskType, string retryReason)
    {
        _taskRetriesTotal.WithLabels(taskType.ToString(), retryReason).Inc();
    }

    // Service Authentication Metrics
    public void RecordServiceTokenGenerated(string serviceType)
    {
        _serviceAuthTokensGenerated.WithLabels(serviceType).Inc();
    }

    public void RecordServiceTokenValidated(string serviceType, bool isValid)
    {
        var result = isValid ? "valid" : "invalid";
        _serviceAuthTokensValidated.WithLabels(serviceType, result).Inc();
    }

    // Database Metrics
    public void RecordDatabaseQuery(string operation, string table, bool success, double durationSeconds)
    {
        var result = success ? "success" : "failure";
        _databaseQueriesTotal.WithLabels(operation, table, result).Inc();
        _databaseQueryDuration.WithLabels(operation, table).Observe(durationSeconds);
    }

    // NATS Metrics
    public void RecordNatsMessagePublished(string subject, bool success)
    {
        var result = success ? "success" : "failure";
        _natsMessagesPublished.WithLabels(subject, result).Inc();
    }

    public void RecordNatsMessageConsumed(string subject, string consumer, bool success)
    {
        var result = success ? "success" : "failure";
        _natsMessagesConsumed.WithLabels(subject, consumer, result).Inc();
    }
}