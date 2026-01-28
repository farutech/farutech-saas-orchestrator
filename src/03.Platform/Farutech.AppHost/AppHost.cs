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
        .WithPgAdmin()
        .AddDatabase("DefaultConnection", "farutec_db");
}

// ----------------------- NATS ------------------------
IResourceBuilder<IResourceWithConnectionString>? nats = null;

if (isDev)
{
    nats = builder
        .AddNats("nats")
        .WithDataVolume()
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
// FRONTEND (CONSUMIDOR FINAL)
// ====================================================
builder
    .AddNpmApp(
        "frontend",
        "../../01.Core/Farutech/Frontend/Dashboard",
        "dev")
    .WithReference(api)
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("https"))
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

// ====================================================
builder.Build().Run();
