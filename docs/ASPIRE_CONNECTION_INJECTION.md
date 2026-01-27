# ASPIRE CONNECTION STRING INJECTION - GUÍA TÉCNICA

## PROBLEMA RESUELTO

Anteriormente, la aplicación intentaba conectarse a `localhost:5432` (puerto hardcoded), pero Aspire asigna puertos **dinámicos** en cada ejecución:

```
❌ ANTES: Host=localhost;Port=5432;Database=farutec_db
✅ AHORA: Host=localhost;Port=38173;Database=farutec_db  (puerto dinámico)
```

---

## CÓMO FUNCIONA LA INYECCIÓN DE ASPIRE

### 1. AppHost.cs - Configuración Orquestador

```csharp
// src/03.Platform/Farutech.AppHost/AppHost.cs

// Definir el recurso de base de datos
var postgres = builder.AddPostgres("postgres", password: postgresPassword)
    .WithDataVolume();

// Crear la base de datos (el nombre debe coincidir con GetConnectionString en la API)
var farutecDb = postgres.AddDatabase("DefaultConnection", "farutec_db");

// Referenciar la base de datos en la API
var orchestratorApi = builder.AddProject<Projects.Farutech_Orchestrator_API>("orchestrator-api")
    .WithReference(farutecDb) // ← ¡Inyección automática!
    .WithReference(nats);
```

### 2. Aspire DCP - Inyección de Variables de Entorno

Cuando ejecutas `dotnet run` en AppHost, Aspire DCP:

1. Inicia Postgres en un puerto dinámico (ejemplo: `38173`)
2. Espera a que Postgres esté "Healthy"
3. Inyecta la variable de entorno **antes** de iniciar la API:

```bash
# Variable inyectada por Aspire:
ConnectionStrings__DefaultConnection=Host=localhost;Port=38173;Database=farutec_db;Username=postgres;Password=***
```

4. Inicia la API con las variables ya configuradas

### 3. Program.cs - Lectura de la Connection String

```csharp
// src/01.Core/Farutech.Orchestrator.API/Program.cs

// Lee la variable inyectada por Aspire
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
    // SI ESTO FALLA: Aspire no inyectó correctamente
    // Verifica que AppHost.cs tiene .WithReference(farutecDb)
    throw new InvalidOperationException("Connection string no configurada por Aspire");
}

Console.WriteLine($"✅ Connection string recibida: {connectionString}");
```

---

## FLUJO COMPLETO DE INICIO

```
┌────────────────────────────────────────────────────────────────┐
│ 1. Ejecutas: dotnet run (en AppHost)                          │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│ 2. Aspire DCP inicia Postgres                                 │
│    - Puerto: 38173 (dinámico)                                 │
│    - Health Check: Espera pg_isready                          │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│ 3. Postgres → "Healthy"                                       │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│ 4. Aspire inyecta variables de entorno para la API:          │
│    ConnectionStrings__DefaultConnection=Host=localhost;Port... │
│    Nats__Url=nats://localhost:44147                           │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│ 5. Aspire inicia Orchestrator API                            │
│    - API lee ConnectionStrings__DefaultConnection             │
│    - Valida que existe (throw si es null)                    │
│    - Conecta a postgres:38173                                │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│ 6. API aplica migraciones automáticamente                    │
│    - context.Database.MigrateAsync()                          │
│    - Crea tablas si no existen                               │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│ 7. API lista para recibir requests                           │
│    - HTTPS: https://localhost:7225                           │
└────────────────────────────────────────────────────────────────┘
```

---

## VALIDACIÓN DE CONEXIÓN

### Verificar en Logs de la API

Busca estas líneas en la consola de `orchestrator-api`:

```bash
✅ Connection string recibida de Aspire: Host=localhost;Port=38173;Database=farutec_db;Username=postgres;Password=***
🔄 Aplicando migraciones de base de datos...
   📋 Migraciones pendientes: 3
   ⚙️  Aplicando: 20241201000000_InitialCreate
   ⚙️  Aplicando: 20241215000000_AddTenancy
   ⚙️  Aplicando: 20250101000000_AddIdentity
✅ Migraciones aplicadas exitosamente
```

### Si Falla la Conexión

**Error:** `❌ ERROR CRÍTICO: ConnectionString 'DefaultConnection' no encontrada`

**Causa:** Aspire no inyectó la variable antes de iniciar la API

**Soluciones:**
1. Verificar que AppHost.cs tiene:
   ```csharp
   .WithReference(farutecDb)
   ```
2. Verificar que Postgres está "Healthy" en Dashboard
3. Reiniciar completamente Aspire:
   ```powershell
   .\scripts\start-aspire-clean.ps1
   ```

---

## COMPARACIÓN: ANTES VS DESPUÉS

### ❌ ANTES (Hardcoded - NO FUNCIONA)

```json
// appsettings.Development.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=farutec_db..."
  }
}
```

```csharp
// Program.cs
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432..."; // ← Puerto fijo, falla con Aspire
```

**Problema:** Puerto 5432 no coincide con puerto dinámico de Aspire (38173).

### ✅ DESPUÉS (Aspire Injection - FUNCIONA)

```json
// appsettings.Development.json
{
  "ConnectionStrings": {
    "DefaultConnection": ""
    // ⚠️ NO configurar aquí - Aspire inyecta dinámicamente
  }
}
```

```csharp
// Program.cs
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string no configurada por Aspire");
}
// ← Falla temprano si Aspire no configuró correctamente
```

**Ventaja:** La app SOLO inicia si Aspire configuró todo correctamente.

---

## VARIABLES DE ENTORNO INYECTADAS

Aspire inyecta estas variables automáticamente:

| Variable | Origen | Ejemplo |
|----------|--------|---------|
| `ConnectionStrings__DefaultConnection` | `.WithReference(farutecDb)` | `Host=localhost;Port=38173;Database=farutec_db;Username=postgres;Password=***` |
| `Nats__Url` | `.WithEnvironment("Nats__Url", nats.GetEndpoint("tcp"))` | `nats://localhost:44147` |
| `ASPNETCORE_URLS` | `.WithHttpsEndpoint()` | `https://localhost:7225;http://localhost:5098` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Service Defaults | `http://localhost:18889` (telemetría) |

---

## DEBUGGING

### Ver Variables de Entorno Inyectadas

Agrega esto temporalmente en Program.cs:

```csharp
// DEBUGGING: Ver todas las variables de entorno
Console.WriteLine("🔍 Variables de entorno relevantes:");
Console.WriteLine($"   ConnectionStrings__DefaultConnection: {builder.Configuration.GetConnectionString("DefaultConnection")}");
Console.WriteLine($"   Nats__Url: {builder.Configuration["Nats:Url"]}");
Console.WriteLine($"   ASPNETCORE_URLS: {Environment.GetEnvironmentVariable("ASPNETCORE_URLS")}");
```

### Ver Connection String en Dashboard

1. Abre Dashboard: https://localhost:17096
2. Clic en "orchestrator-api"
3. Pestaña "Environment"
4. Busca `ConnectionStrings__DefaultConnection`

---

## PRODUCCIÓN: USAR SECRETOS

En producción, NO uses passwords en código:

```csharp
// AppHost.cs - PRODUCCIÓN
var postgresPassword = builder.AddParameter("postgres-password", secret: true);
// ← Aspire pedirá la password interactivamente o desde Azure Key Vault
```

```bash
# Despliegue con Aspirate
aspirate generate --output-format compose
# Genera docker-compose.yml con ${POSTGRES_PASSWORD}

# En servidor, configurar secret
export POSTGRES_PASSWORD="SecureProductionPassword"
docker compose up -d
```

---

## REFERENCIAS

- [Aspire Service References](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/service-references)
- [Aspire Connection String Injection](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/external-parameters)
- [Service Discovery in Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/service-discovery/overview)
