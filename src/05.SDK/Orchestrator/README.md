# Farutech.Orchestrator.SDK

Cliente oficial .NET para interactuar con el Farutech SaaS Orchestrator.

## 🚀 Características

- ✅ **Compatible con .NET Standard 2.1** (funciona con .NET Core 3.1+, .NET 5+, .NET Framework 4.6.1+)
- ✅ **Autenticación JWT** con soporte multi-tenant
- ✅ **Caché Inteligente** de configuraciones (10 minutos por defecto)
- ✅ **Resiliencia HTTP** con Polly (reintentos automáticos, circuit breaker)
- ✅ **Inyección de Dependencias** con extensiones de configuración
- ✅ **Logging** integrado con Microsoft.Extensions.Logging

## 📦 Instalación

```bash
dotnet add package Farutech.Orchestrator.SDK
```

## 🔧 Configuración

### Opción 1: Configuración Básica

```csharp
using Farutech.Orchestrator.SDK.Extensions;

// En Startup.cs o Program.cs
services.AddFarutechOrchestrator("https://api.farutech.com");
```

### Opción 2: Configuración Avanzada

```csharp
services.AddFarutechOrchestrator(options =>
{
    options.BaseUrl = "https://api.farutech.com";
    options.CacheExpirationMinutes = 15;  // Default: 10
    options.TimeoutSeconds = 60;          // Default: 30
    options.RetryCount = 5;               // Default: 3
    options.RetryDelayMilliseconds = 2000; // Default: 1000
});
```

## 📖 Uso

### 1. Login Simple (Usuario con un solo Tenant)

```csharp
public class AuthService
{
    private readonly IFarutechClient _client;

    public AuthService(IFarutechClient client)
    {
        _client = client;
    }

    public async Task<string> LoginAsync(string email, string password)
    {
        var response = await _client.LoginAsync(email, password);
        
        if (!response.RequiresContextSelection)
        {
            // Usuario tiene un solo tenant, token listo
            return response.AccessToken!;
        }
        
        // Usuario multi-tenant, se requiere seleccionar contexto
        throw new Exception("Usuario requiere selección de contexto");
    }
}
```

### 2. Login Multi-Tenant (Seleccionar Empresa)

```csharp
public async Task<string> LoginWithTenantSelectionAsync(string email, string password)
{
    // Paso 1: Login inicial
    var loginResponse = await _client.LoginAsync(email, password);
    
    if (!loginResponse.RequiresContextSelection)
    {
        return loginResponse.AccessToken!;
    }
    
    // Paso 2: Mostrar opciones al usuario
    foreach (var tenant in loginResponse.AvailableTenants!)
    {
        Console.WriteLine($"{tenant.TenantId}: {tenant.CompanyName} - {tenant.Role}");
    }
    
    // Paso 3: Usuario selecciona un tenant
    var selectedTenantId = loginResponse.AvailableTenants!.First().TenantId;
    
    // Paso 4: Obtener token final
    var contextResponse = await _client.SelectContextAsync(
        selectedTenantId,
        loginResponse.IntermediateToken!);
    
    return contextResponse.AccessToken;
}
```

### 3. Obtener Configuración del Tenant (con Caché)

```csharp
public async Task<TenantConfigurationDto> GetTenantConfigAsync(string accessToken)
{
    // Primera llamada: va a la API y cachea por 10 minutos
    var config = await _client.GetMyConfigurationAsync(accessToken);
    
    Console.WriteLine($"Empresa: {config.CompanyName}");
    Console.WriteLine($"Producto: {config.ProductName}");
    Console.WriteLine($"Features habilitadas: {config.Features.Count}");
    
    return config;
}

public async Task<TenantConfigurationDto> RefreshConfigAsync(string accessToken)
{
    // Forzar actualización (ignora caché)
    var config = await _client.GetMyConfigurationAsync(accessToken, forceRefresh: true);
    return config;
}
```

### 4. Validar Feature Flags

```csharp
public async Task<bool> CanUseAdvancedReportsAsync(string accessToken)
{
    // Método simplificado: retorna true/false
    bool isEnabled = await _client.IsFeatureEnabledAsync("ADVANCED_REPORTS", accessToken);
    
    if (isEnabled)
    {
        Console.WriteLine("Usuario puede acceder a reportes avanzados");
    }
    
    return isEnabled;
}

public async Task<FeatureDto> GetFeatureDetailsAsync(string accessToken)
{
    // Método detallado: retorna información completa de la feature
    var feature = await _client.GetFeatureAsync("ADVANCED_REPORTS", accessToken);
    
    Console.WriteLine($"Feature: {feature.Name}");
    Console.WriteLine($"Habilitada: {feature.IsEnabled}");
    Console.WriteLine($"Configuración: {feature.Config?.Count ?? 0} parámetros");
    
    return feature;
}
```

### 5. Limpiar Caché

```csharp
public void ClearAllCache()
{
    _client.ClearCache();
    Console.WriteLine("Caché limpiado");
}
```

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────┐
│        Aplicación Cliente (.NET)            │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   IFarutechClient (Interfaz Pública)│   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────▼──────────────────────┐   │
│  │    FarutechClient (Implementación)  │   │
│  │  - Caché Inteligente (MemoryCache)  │   │
│  │  - Logging (ILogger)                │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────▼──────────────────────┐   │
│  │    IFarutechApi (Refit - Interna)   │   │
│  │  - HttpClient con Polly             │   │
│  │  - Reintentos Automáticos           │   │
│  │  - Circuit Breaker                  │   │
│  └──────────────┬──────────────────────┘   │
└─────────────────┼───────────────────────────┘
                  │
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────┐
│   Farutech Orchestrator API (Backend Core) │
│         https://api.farutech.com            │
└─────────────────────────────────────────────┘
```

## 📊 Flujo de Autenticación

```
┌────────────┐         ┌────────────┐         ┌─────────────┐
│   Cliente  │         │    SDK     │         │  API Core   │
└─────┬──────┘         └─────┬──────┘         └──────┬──────┘
      │                      │                       │
      │ LoginAsync()         │                       │
      ├─────────────────────►│                       │
      │                      │ POST /api/auth/login  │
      │                      ├──────────────────────►│
      │                      │                       │
      │                      │ LoginResponse         │
      │                      │◄──────────────────────┤
      │ LoginResponse        │                       │
      │◄─────────────────────┤                       │
      │                      │                       │
      │ (Si multi-tenant)    │                       │
      │ SelectContextAsync() │                       │
      ├─────────────────────►│                       │
      │                      │POST /api/auth/select  │
      │                      ├──────────────────────►│
      │                      │                       │
      │                      │ SelectContextResponse │
      │                      │◄──────────────────────┤
      │ AccessToken (JWT)    │                       │
      │◄─────────────────────┤                       │
      │                      │                       │
```

## 🔒 Seguridad

- **JWT Bearer Tokens**: Autenticación segura con tokens firmados
- **Intermediate Token Pattern**: Tokens de corta duración (5 min) para selección de contexto
- **HTTPS Only**: Todas las comunicaciones deben ser sobre HTTPS
- **Token Refresh**: Los access tokens expiran en 1 hora (configurable)

## 🧪 Testing

```csharp
// Usar IFarutechClient en tus servicios para facilitar unit testing
public class MyService
{
    private readonly IFarutechClient _client;
    
    public MyService(IFarutechClient client)
    {
        _client = client;
    }
    
    // Tu lógica de negocio aquí
}

// En tus tests, puedes mockear IFarutechClient
[Fact]
public async Task Test_MyService_WithMockedClient()
{
    // Arrange
    var mockClient = new Mock<IFarutechClient>();
    mockClient.Setup(x => x.IsFeatureEnabledAsync(It.IsAny<string>(), It.IsAny<string>(), default))
              .ReturnsAsync(true);
    
    var service = new MyService(mockClient.Object);
    
    // Act & Assert
    // ...
}
```

## 📝 Modelos (DTOs)

### LoginRequest
- `Email` (string): Email del usuario
- `Password` (string): Contraseña

### LoginResponse
- `RequiresContextSelection` (bool): Si se necesita seleccionar tenant
- `IntermediateToken` (string?): Token temporal para selección
- `AccessToken` (string?): Token de acceso JWT
- `AvailableTenants` (List<TenantOptionDto>?): Tenants disponibles

### TenantConfigurationDto
- `TenantId` (Guid): ID del tenant
- `CompanyName` (string): Nombre de la empresa
- `ProductName` (string): Producto suscrito
- `Features` (List<FeatureDto>): Features habilitadas
- `TenantConfig` (Dictionary?): Configuración específica

### FeatureDto
- `Code` (string): Código de la feature
- `Name` (string): Nombre
- `IsEnabled` (bool): Si está habilitada
- `Config` (Dictionary?): Configuración de la feature

## 🛠️ Opciones de Configuración

| Opción | Default | Descripción |
|--------|---------|-------------|
| `BaseUrl` | (requerido) | URL base de la API |
| `CacheExpirationMinutes` | 10 | Tiempo de caché para configuraciones |
| `TimeoutSeconds` | 30 | Timeout de peticiones HTTP |
| `RetryCount` | 3 | Número de reintentos |
| `RetryDelayMilliseconds` | 1000 | Delay entre reintentos (exponencial) |

## 🔄 Versionado

Este SDK sigue [Semantic Versioning](https://semver.org/):
- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Nueva funcionalidad compatible hacia atrás
- **PATCH**: Bug fixes

## 📄 Licencia

Propiedad de Farutech. Todos los derechos reservados.

## 🤝 Soporte

- 📧 Email: support@farutech.com
- 📚 Documentación: https://docs.farutech.com
- 🐛 Issues: https://github.com/farutech/orchestrator-sdk/issues
