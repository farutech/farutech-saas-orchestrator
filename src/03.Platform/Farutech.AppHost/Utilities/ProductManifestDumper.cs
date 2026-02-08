using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Net;

namespace Farutech.AppHost.Utilities;

public class ProductManifestDumper(IServiceProvider provider, ILogger<ProductManifestDumper> logger) 
    : IHostedService
{
    private readonly IServiceProvider _provider = provider;
    private readonly ILogger<ProductManifestDumper> _logger = logger;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            // Try to GET the manifest from the local API endpoint over HTTPS and ignore dev certs
            var productId = "10000000-0000-0000-0001-000000000001";
            var baseUrl = "https://localhost:17096";

            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            };

            using var client = new HttpClient(handler) { BaseAddress = new Uri(baseUrl) };
            try
            {
                var resp = await client.GetAsync($"/api/Catalog/products/{productId}/manifest", cancellationToken);
                if (!resp.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Manifest request returned {Status}", resp.StatusCode);
                    return;
                }

                var json = await resp.Content.ReadAsStringAsync(cancellationToken);
                var outPath = Path.Combine(AppContext.BaseDirectory, "manifest_dump.json");
                await File.WriteAllTextAsync(outPath, json, cancellationToken);
                _logger.LogInformation("Wrote product manifest to {Path}", outPath);
            }
            finally
            {
                handler.Dispose();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error dumping product manifest");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
        => Task.CompletedTask;
}
