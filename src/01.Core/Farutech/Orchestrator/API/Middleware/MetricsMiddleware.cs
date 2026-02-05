using System.Diagnostics;
using Farutech.Orchestrator.Application.Interfaces;

namespace Farutech.Orchestrator.API.Middleware;

/// <summary>
/// Middleware for collecting custom HTTP metrics
/// </summary>
public class MetricsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMetricsService _metricsService;

    public MetricsMiddleware(RequestDelegate next, IMetricsService metricsService)
    {
        _next = next;
        _metricsService = metricsService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();

            // Record HTTP request metrics
            var method = context.Request.Method;
            var endpoint = GetEndpoint(context.Request.Path);
            var statusCode = context.Response.StatusCode.ToString();
            var durationSeconds = stopwatch.Elapsed.TotalSeconds;

            _metricsService.RecordHttpRequest(method, endpoint, statusCode, durationSeconds);
        }
    }

    private static string GetEndpoint(PathString path)
    {
        // Normalize endpoint paths for metrics
        var pathString = path.Value ?? "/";

        // Remove query parameters
        var queryIndex = pathString.IndexOf('?');
        if (queryIndex > 0)
        {
            pathString = pathString.Substring(0, queryIndex);
        }

        // Group similar endpoints
        if (pathString.StartsWith("/api/provisioning/tasks/"))
        {
            // Extract task ID pattern
            var parts = pathString.Split('/');
            if (parts.Length >= 5 && Guid.TryParse(parts[4], out _))
            {
                return "/api/provisioning/tasks/{taskId}";
            }
        }

        if (pathString.StartsWith("/api/tenants/"))
        {
            var parts = pathString.Split('/');
            if (parts.Length >= 4 && Guid.TryParse(parts[3], out _))
            {
                return "/api/tenants/{tenantId}";
            }
        }

        // Return path as-is for other endpoints
        return pathString;
    }
}