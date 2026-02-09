using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

// ===================== ENTORNO =====================
var environment = builder.Configuration["ASPNETCORE_ENVIRONMENT"] ?? "Production";
var isDev = environment == "Development";

// ===================== PARÁMETROS =====================
var jwtSecret = builder.AddParameter("jwt-secret", secret: true);

// Defaults SOLO en Development
if (isDev)
{
    builder.Configuration["Parameters:jwt-secret"] ??= "DevOnly_JWT_Secret_Min32Chars_Long_ForDevelopment";
}

// ====================================================
// INFRAESTRUCTURA (usando docker-compose.yml)
// ====================================================
// PostgreSQL, NATS y pgAdmin se despliegan con docker-compose
// Aspire solo configura las cadenas de conexión a estos servicios

// Cadena de conexión a PostgreSQL (docker-compose)
var postgresConnectionString = "Host=localhost;Port=5432;Username=farutec_admin;Password=SuperSecurePassword123;Database=farutec_db";

// URL de NATS (docker-compose)  
var natsUrl = "nats://localhost:4222";

// ====================================================
// IAM API (Gestión de Identidad y Acceso)
// ====================================================
var iamApi = builder
    .AddProject<Projects.Farutech_IAM_API>("iam-api", launchProfileName: isDev ? "Development" : "Production")
    .WithEnvironment("ConnectionStrings__DefaultConnection", postgresConnectionString)
    .WithEnvironment("TokenOptions__Issuer", "https://localhost:7001")
    .WithEnvironment("TokenOptions__Audience", "farutech-api")
    .WithEnvironment("TokenOptions__AccessTokenExpirationMinutes", "60")
    .WithEnvironment("TokenOptions__RefreshTokenExpirationDays", "30")
    .WithEnvironment("RedisOptions__ConnectionString", "localhost:6379")
    .WithEnvironment("RedisOptions__Enabled", "true")
    .WithEnvironment("NatsOptions__Url", natsUrl)
    .WithEnvironment("NatsOptions__Enabled", "true")
    .WithEnvironment("EmailOptions__Enabled", "true")
    .WithEnvironment("EmailOptions__Transport", "Api")
    .WithEnvironment("EmailOptions__Provider", "Mailtrap")
    .WithEnvironment("EmailOptions__FromEmail", "noreply@farutech.com")
    .WithEnvironment("EmailOptions__FromName", "Farutech IAM")
    .WithEnvironment("TokenExpirationOptions__EmailVerificationSeconds", "86400") // 24 horas
    .WithEnvironment("TokenExpirationOptions__PasswordResetSeconds", "3600") // 1 hora
    .WithEnvironment("TokenExpirationOptions__RefreshTokenSeconds", "2592000") // 30 días
    .WithHttpEndpoint(port: 5152, name: "iam-http")
    .WithHttpsEndpoint(port: 7001, name: "iam-https");

// ====================================================
// ORCHESTRATOR API (API Principal)
// ====================================================
var orchestratorApi = builder
    .AddProject<Projects.Farutech_Orchestrator_API>("orchestrator-api", launchProfileName: isDev ? "https" : "Production")
    .WithReference(iamApi)
    .WithEnvironment("ConnectionStrings__DefaultConnection", postgresConnectionString)
    .WithEnvironment("Jwt__SecretKey", jwtSecret)
    .WithEnvironment("Nats__Enabled", "true")
    .WithEnvironment("Nats__Url", natsUrl)
    .WithEnvironment("IAM__BaseUrl", iamApi.GetEndpoint("iam-https"))
    .WithHttpEndpoint(port: 5000, name: "http")
    .WithHttpsEndpoint(port: 7000, name: "https");

// ====================================================
// ORDEON API (Aplicación de Negocio)
// ====================================================
var ordeonApi = builder
    .AddProject<Projects.Farutech_Apps_Ordeon_API>("ordeon-api", launchProfileName: isDev ? "http" : "Production")
    .WithReference(orchestratorApi)
    .WithReference(iamApi)
    .WithEnvironment("ConnectionStrings__CustomerDatabase", postgresConnectionString)
    .WithEnvironment("Orchestrator__BaseUrl", orchestratorApi.GetEndpoint("https"))
    .WithEnvironment("IAM__BaseUrl", iamApi.GetEndpoint("iam-https"))
    .WithEnvironment("Ordeon__RunMigrationsOnStartup", "true")
    .WithHttpEndpoint(port: 5200, name: "ordeon-http");

// ====================================================
// FRONTEND ORCHESTRATOR (Dashboard principal)
// ====================================================
if (isDev)
{
    var orchestratorFrontend = builder
        .AddNpmApp("orchestrator-frontend", "../../02.Apps/Frontend/Dashboard", "dev")
        .WithReference(orchestratorApi)
        .WithReference(iamApi)
        .WithEnvironment("VITE_API_URL", orchestratorApi.GetEndpoint("http"))
        .WithEnvironment("VITE_IAM_URL", iamApi.GetEndpoint("iam-http"))
        .WithEnvironment("VITE_APP_DOMAIN", "farutech.local")
        .WithEnvironment("HOST", "0.0.0.0")
        .WithHttpEndpoint(port: 8081, env: "PORT")
        .WithExternalHttpEndpoints();
}

builder.Build().Run();
