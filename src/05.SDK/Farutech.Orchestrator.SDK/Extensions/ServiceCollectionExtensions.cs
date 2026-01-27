using System;
using System.Net.Http;
using Farutech.Orchestrator.SDK.Http;
using Farutech.Orchestrator.SDK.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Extensions.Http;
using Refit;

namespace Farutech.Orchestrator.SDK.Extensions;

/// <summary>
/// Extensiones para registrar el SDK de Farutech Orchestrator en el contenedor DI
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registra el cliente de Farutech Orchestrator con configuración completa
    /// </summary>
    /// <param name="services">Colección de servicios</param>
    /// <param name="configure">Acción para configurar opciones</param>
    /// <returns>Colección de servicios para chaining</returns>
    public static IServiceCollection AddFarutechOrchestrator(
        this IServiceCollection services,
        Action<FarutechClientOptions> configure)
    {
        if (services == null)
            throw new ArgumentNullException(nameof(services));

        if (configure == null)
            throw new ArgumentNullException(nameof(configure));

        // Configurar opciones
        services.Configure(configure);

        // Obtener la URL base para configurar Refit
        var options = new FarutechClientOptions { BaseUrl = string.Empty };
        configure(options);

        if (string.IsNullOrWhiteSpace(options.BaseUrl))
            throw new ArgumentException("BaseUrl es requerido en FarutechClientOptions");

        // Registrar MemoryCache si no está registrado
        services.AddMemoryCache();

        // Configurar políticas de resiliencia con Polly
        var retryPolicy = HttpPolicyExtensions
            .HandleTransientHttpError()
            .WaitAndRetryAsync(
                options.RetryCount,
                retryAttempt => TimeSpan.FromMilliseconds(
                    options.RetryDelayMilliseconds * Math.Pow(2, retryAttempt - 1)));

        var timeoutPolicy = Policy.TimeoutAsync<HttpResponseMessage>(
            TimeSpan.FromSeconds(options.TimeoutSeconds));

        // Registrar Refit con políticas de resiliencia
        services.AddRefitClient<IFarutechApi>()
            .ConfigureHttpClient(c =>
            {
                c.BaseAddress = new Uri(options.BaseUrl);
                c.Timeout = TimeSpan.FromSeconds(options.TimeoutSeconds);
            })
            .AddPolicyHandler(retryPolicy)
            .AddPolicyHandler(timeoutPolicy);

        // Registrar el cliente público
        services.AddScoped<IFarutechClient, FarutechClient>();

        return services;
    }

    /// <summary>
    /// Registra el cliente de Farutech Orchestrator con URL base simple
    /// </summary>
    /// <param name="services">Colección de servicios</param>
    /// <param name="baseUrl">URL base de la API</param>
    /// <returns>Colección de servicios para chaining</returns>
    public static IServiceCollection AddFarutechOrchestrator(
        this IServiceCollection services,
        string baseUrl)
    {
        return services.AddFarutechOrchestrator(options =>
        {
            options.BaseUrl = baseUrl;
        });
    }
}
