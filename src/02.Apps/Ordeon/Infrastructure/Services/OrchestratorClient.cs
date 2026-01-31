using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Farutech.Apps.Ordeon.Application.Common.Interfaces;

namespace Farutech.Apps.Ordeon.Infrastructure.Services;

public sealed class OrchestratorClient(HttpClient httpClient, IPermissionProvider permissionProvider) : IOrchestratorClient
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly IPermissionProvider _permissionProvider = permissionProvider;

    public async Task RegisterCapabilitiesAsync()
    {
        var capabilities = new
        {
            AppName = "Ordeon",
            Permissions = _permissionProvider.GetAllPermissions()
        };

        try
        {
            // La URL vendría de configuración
            var response = await _httpClient.PostAsJsonAsync("api/v1/apps/register-capabilities", capabilities);
            response.EnsureSuccessStatusCode();
        }
        catch (Exception)
        {
            // Log warning but don't crash app start
        }
    }
}

public interface IOrchestratorClient
{
    Task RegisterCapabilitiesAsync();
}

