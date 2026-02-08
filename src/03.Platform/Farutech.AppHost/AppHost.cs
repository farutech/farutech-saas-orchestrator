using Aspire.Hosting;
using Aspire.Hosting.ApplicationModel;
using DotNetEnv;

Env.Load("../../../.env");

var builder = DistributedApplication.CreateBuilder(args);

// ===================== ENTORNO =====================
var environment = builder.Configuration["ASPNETCORE_ENVIRONMENT"] ?? "Production";
var isDev = environment == "Development";
var isProd = environment == "Production";

// ===================== PARÁMETROS DESDE .ENV =====================
var postgresPassword = builder.Configuration["POSTGRES_PASSWORD"];
var jwtSecret = builder.Configuration["JWT_SECRET"];
var commonDatabaseName = builder.Configuration["DATABASE_COMMON_NAME"];
var dedicatedDatabasePrefix = builder.Configuration["DATABASE_DEDICATED_PREFIX"];
var postgresConnString = builder.Configuration["POSTGRES_CONN_STRING"];
var natsUrl = builder.Configuration["NATS_URL"];
var natsHost = builder.Configuration["NATS_HOST"];
var natsPort = builder.Configuration["NATS_PORT"];
var natsUser = builder.Configuration["NATS_USER"];
var natsPassword = builder.Configuration["NATS_PASSWORD"];

// ====================================================
// API (NÚCLEO DEL SISTEMA)
// ====================================================
var api = builder
    .AddProject<Projects.Farutech_Orchestrator_API>(
        "orchestrator-api",
        launchProfileName: "https")
    .WithEnvironment("Jwt__SecretKey", jwtSecret)
    .WithEnvironment("Database__CommonName", commonDatabaseName)
    .WithEnvironment("Database__DedicatedPrefix", dedicatedDatabasePrefix)
    .WithEnvironment("Nats__Host", natsHost)
    .WithEnvironment("Nats__Port", natsPort)
    .WithEnvironment("Nats__User", natsUser)
    .WithEnvironment("Nats__Password", natsPassword)
    .WithEnvironment("ConnectionStrings__DefaultConnection", postgresConnString)
    .WithEnvironment("Nats__Enabled", "true")
    .WithEnvironment("Nats__Url", natsUrl)
    .WithHttpHealthCheck("/health/live");

// ====================================================
// ORDEON (APLICACIÓN DE NEGOCIO)
// ====================================================
var ordeonApi = builder
    .AddProject<Projects.Farutech_Apps_Ordeon_API>("ordeon-api", launchProfileName: "http")
    .WithReference(api) // Dependencia de Orchestrator para registro de capacidades
    .WithEnvironment("Orchestrator__BaseUrl", api.GetEndpoint("https"))
    .WithEnvironment("ConnectionStrings__CustomerDatabase", postgresConnString);

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
