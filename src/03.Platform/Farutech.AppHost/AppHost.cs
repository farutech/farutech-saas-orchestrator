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
var commonDatabaseName = builder.AddParameter("database-common-name");
var dedicatedDatabasePrefix = builder.AddParameter("database-dedicated-prefix");

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
    builder.Configuration["Parameters:database-common-name"] ??= "farutech_db_custs";
    builder.Configuration["Parameters:database-dedicated-prefix"] ??= "farutech_db_cust_";
}

// ====================================================
// INFRAESTRUCTURA
// ====================================================

// --------------------- POSTGRES ----------------------
IResourceBuilder<IResourceWithConnectionString>? postgres = null;

if (isDev)
{
    try
    {
        postgres = builder
            .AddPostgres("postgres", password: postgresPassword)
            .WithDataVolume("farutech-postgres-data")
            .WithEnvironment("POSTGRES_DB", "farutec_db")
            .WithEnvironment("POSTGRES_USER", "postgres")
            .WithEnvironment("POSTGRES_PASSWORD", postgresPassword)
            .WithPgAdmin(c => c.WithImage("dpage/pgadmin4:latest"))
            // Default connection for core orchestrator
            .AddDatabase("DefaultConnection", "farutec_db");
    }
    catch
    {
        // Fallback to SQLite when Docker is not available
        builder.Configuration["ConnectionStrings:DefaultConnection"] = "Data Source=farutech_dev.db";
    }
}

// ----------------------- NATS ------------------------
IResourceBuilder<IResourceWithConnectionString>? nats = null;

if (isDev)
{
    nats = builder
        .AddNats("nats")
        .WithDataVolume("farutech-nats-data")
        .WithEnvironment("NATS_JETSTREAM", "enabled")
        .WithEnvironment("NATS_HOST", builder.Configuration["Parameters:nats-host"] ?? "nats")
        .WithEnvironment("NATS_PORT", builder.Configuration["Parameters:nats-port"] ?? "4222")
        .WithEnvironment("NATS_USER", builder.Configuration["Parameters:nats-user"] ?? "")
        .WithEnvironment("NATS_PASSWORD", builder.Configuration["Parameters:nats-password"] ?? "");
}

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
    .WithEnvironment("Nats__Host", builder.Configuration["Parameters:nats-host"] ?? "nats")
    .WithEnvironment("Nats__Port", builder.Configuration["Parameters:nats-port"] ?? "4222")
    .WithEnvironment("Nats__User", builder.Configuration["Parameters:nats-user"] ?? "")
    .WithEnvironment("Nats__Password", builder.Configuration["Parameters:nats-password"] ?? "")
    .WithHttpHealthCheck("/health/live");

// ---- Database dependency
if (postgres is not null)
{
    api = api.WithReference(postgres);
}
else if (!isDev)
{
    // En ambientes QA, Staging, Prod: usar cadena de conexión inyectada por variable/secreto
    api = api.WithEnvironment(
        "ConnectionStrings__DefaultConnection",
        builder.Configuration["Parameters:postgres-conn-string"] ??
        "Host=postgres;Port=5432;Database=farutec_db;Username=postgres;Password=REEMPLAZAR_PASSWORD");
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
