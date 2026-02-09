using Aspire.Hosting;
using Aspire.Hosting.ApplicationModel;

var builder = DistributedApplication.CreateBuilder(args);

// ===================== ENTORNO =====================
var environment = builder.Configuration["ASPNETCORE_ENVIRONMENT"] ?? "Production";
var isDev = environment == "Development";
var isProd = environment == "Production";

// ===================== PARÁMETROS =====================
var jwtSecret = builder.AddParameter("jwt-secret", secret: true);
var commonDatabaseName = builder.AddParameter("database-common-name");
var dedicatedDatabasePrefix = builder.AddParameter("database-dedicated-prefix");

// Defaults SOLO en Development
if (isDev)
{
    builder.Configuration["Parameters:jwt-secret"] ??= "DevOnly_JWT_Secret_Min32Chars_Long";
    builder.Configuration["Parameters:database-common-name"] ??= "farutech_db_custs";
    builder.Configuration["Parameters:database-dedicated-prefix"] ??= "farutech_db_cust_";
}

// ====================================================
// INFRAESTRUCTURA (usando docker-compose.yml)
// ====================================================
// PostgreSQL, NATS y pgAdmin se despliegan con docker-compose
// Aspire solo configura las cadenas de conexión a estos servicios

// Cadena de conexión a PostgreSQL (docker-compose)
var postgresConnectionString = "Host=localhost;Port=5432;Username=farutec_admin;Password=SuperSecurePassword123;Database=farutec_db";

// URL de NATS (docker-compose)  
var natsHostUrl = "localhost";
var natsPort = "4222";

// ====================================================
// API (NÚCLEO DEL SISTEMA)
// ====================================================
var api = builder
    .AddProject<Projects.Farutech_Orchestrator_API>(
        "orchestrator-api",
        launchProfileName: "https")
    .WithEnvironment("ConnectionStrings__DefaultConnection", postgresConnectionString)
    .WithEnvironment("Jwt__SecretKey", jwtSecret)
    .WithEnvironment("Database__CommonName", commonDatabaseName)
    .WithEnvironment("Database__DedicatedPrefix", dedicatedDatabasePrefix)
    .WithEnvironment("Nats__Enabled", "true")
    .WithEnvironment("Nats__Host", natsHostUrl)
    .WithEnvironment("Nats__Port", natsPort)
    .WithEnvironment("Nats__User", "")
    .WithEnvironment("Nats__Password", "")
    .WithHttpHealthCheck("/health/live");

// ====================================================
// ORDEON (APLICACIÓN DE NEGOCIO)
// ====================================================
var ordeonApi = builder
    .AddProject<Projects.Farutech_Apps_Ordeon_API>("ordeon-api", launchProfileName: "http")
    .WithReference(api) // Dependencia de Orchestrator para registro de capacidades
    .WithEnvironment("ConnectionStrings__CustomerDatabase", postgresConnectionString)
    .WithEnvironment("Orchestrator__BaseUrl", api.GetEndpoint("https"))
    .WithEnvironment("ASPNETCORE_ENVIRONMENT", "Development")
    .WithEnvironment("Ordeon__RunMigrationsOnStartup", "true");

// ====================================================
// FRONTEND ORCHESTRATOR (Dashboard principal)
// ====================================================
var orchestratorFrontend = builder
    .AddNpmApp(
        "orchestrator-frontend",
        "../../01.Core/Farutech/Frontend/Dashboard",
        "dev")
    .WithReference(api)
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("http"))
    .WithEnvironment("VITE_APP_DOMAIN", isDev ? "farutech.local" : "farutech.com")
    .WithEnvironment("HOST", "0.0.0.0")
    .WithHttpEndpoint(port: 5173, env: "PORT")
    .WithExternalHttpEndpoints();

// ====================================================
// FRONTEND APPS (Dashboard para aplicaciones tenant)
// ====================================================
var appFrontend = builder
    .AddNpmApp(
        "app-frontend",
        "../../02.Apps/Frontend/Dashboard",
        "dev")
    .WithReference(api)
    .WithEnvironment("VITE_API_BASE_URL", api.GetEndpoint("http"))
    .WithEnvironment("VITE_ORCHESTRATOR_URL", orchestratorFrontend.GetEndpoint("http"))
    .WithEnvironment("HOST", "0.0.0.0")
    .WithHttpEndpoint(port: 5174, env: "PORT")
    .WithExternalHttpEndpoints();

// ====================================================
builder.Build().Run();
