using Aspire.Hosting;
using Aspire.Hosting.ApplicationModel;

var builder = DistributedApplication.CreateBuilder(args);

// ===================== ENTORNO =====================
var environment = builder.Configuration["ASPNETCORE_ENVIRONMENT"] ?? "Production";
var isDev = environment == "Development";
var isProd = environment == "Production";

// ===================== PARÁMETROS =====================
var postgresPassword = builder.AddParameter("postgres-password", secret: true);
var jwtSecret = builder.AddParameter("jwt-secret", secret: true);

var postgresConnString = isProd
    ? builder.AddParameter("postgres-conn-string", secret: true)
    : null;

var natsUrl = isProd
    ? builder.AddParameter("nats-url", secret: true)
    : null;

// Defaults SOLO en Development
if (isDev)
{
    builder.Configuration["Parameters:postgres-password"] ??= "DevOnly_StrongPassword_123";
    builder.Configuration["Parameters:jwt-secret"] ??= "DevOnly_JWT_Secret_Min32Chars_Long";
}

// ====================================================
// INFRAESTRUCTURA
// ====================================================

// --------------------- POSTGRES ----------------------
IResourceBuilder<IResourceWithConnectionString>? postgres = null;

if (isDev)
{
    postgres = builder
        .AddPostgres("postgres", password: postgresPassword)
        .WithDataVolume("farutech-postgres-data")
        .WithEnvironment("POSTGRES_DB", "farutec_db")
        .WithPgAdmin(c => c.WithImage("dpage/pgadmin4:latest"))
        // Default connection for core orchestrator
        .AddDatabase("DefaultConnection", "farutec_db");
}

// ----------------------- NATS ------------------------
IResourceBuilder<IResourceWithConnectionString>? nats = null;

if (isDev)
{
    nats = builder
        .AddNats("nats")
        .WithDataVolume("farutech-nats-data")
        .WithEnvironment("NATS_JETSTREAM", "enabled");
}

// ====================================================
// API (NÚCLEO DEL SISTEMA)
// ====================================================
var api = builder
    .AddProject<Projects.Farutech_Orchestrator_API>(
        "orchestrator-api",
        launchProfileName: "https")
    .WithEnvironment("Jwt__SecretKey", jwtSecret)
    .WithHttpHealthCheck("/health");

// ---- Database dependency
if (postgres is not null)
{
    api = api.WithReference(postgres);
}
else if (isProd)
{
    api = api.WithEnvironment(
        "ConnectionStrings__DefaultConnection",
        builder.Configuration["Parameters:postgres-conn-string"]);
}

// ---- NATS dependency
if (nats is not null)
{
    api = api
        .WithReference(nats)
        .WithEnvironment("Nats__Enabled", "true");
}
else if (isProd)
{
    api = api
        .WithEnvironment("Nats__Enabled", "true")
        .WithEnvironment("Nats__Url", builder.Configuration["Parameters:nats-url"]);
}

// ====================================================
// ORDEON (APLICACIÓN DE NEGOCIO)
// ====================================================
var ordeonApi = builder
    .AddProject<Projects.Farutech_Apps_Ordeon_API>("ordeon-api", launchProfileName: "http")
    .WithReference(api) // Dependencia de Orchestrator para registro de capacidades
    .WithEnvironment("Orchestrator__BaseUrl", api.GetEndpoint("https"));

if (postgres is not null)
{
    // Map Ordeon to use the same Postgres resource but expose it as "CustomerDatabase"
    // so Ordeon can read `ConnectionStrings:CustomerDatabase` as expected.
    ordeonApi = ordeonApi.WithReference(postgres, "CustomerDatabase");
}

// If AppHost is running in development, ensure Ordeon runs in Development so it applies migrations/seeds
if (isDev)
{
    ordeonApi = ordeonApi.WithEnvironment("ASPNETCORE_ENVIRONMENT", "Development");
}
// Ensure Aspire requests Ordeon to run migrations/seeds on startup so catalogs are created
ordeonApi = ordeonApi.WithEnvironment("Ordeon__RunMigrationsOnStartup", "true");

// ====================================================
// FRONTEND (CONSUMIDOR FINAL)
// ====================================================
builder
    .AddNpmApp(
        "frontend",
        "../../01.Core/Farutech/Frontend/Dashboard",
        "dev")
    .WithReference(api)
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("https"))
    .WithEnvironment("HOST", "0.0.0.0") // Forzar Vite a escuchar en todas las interfaces
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

// ====================================================
builder.Build().Run();
