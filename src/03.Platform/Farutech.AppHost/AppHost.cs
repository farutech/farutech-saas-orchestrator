var builder = DistributedApplication.CreateBuilder(args);

var isDev = builder.Environment.IsDevelopment();
var isProd = builder.Environment.IsProduction();

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

// ===================== POSTGRES =====================
IResourceBuilder<IResourceWithConnectionString>? postgres = null;

if (isDev)
{
    postgres = builder
        .AddPostgres("postgres", password: postgresPassword)
        .WithPgAdmin()
        .WithDataVolume("farutech-postgres-data")
        .WithEnvironment("POSTGRES_DB", "farutec_db")
        .AddDatabase("DefaultConnection", "farutec_db");
}

// ===================== NATS =====================
IResourceBuilder<IResourceWithConnectionString>? nats = null;

if (isDev)
{
    nats = builder
        .AddNats("nats")
        .WithDataVolume()
        .WithEnvironment("NATS_JETSTREAM", "enabled");
}

// ===================== ORCHESTRATOR API =====================
var api = builder
    .AddProject<Projects.Farutech_Orchestrator_API>(
        "orchestrator-api",
        launchProfileName: "https")
    .WithEnvironment("Jwt__SecretKey", jwtSecret);

// ---- Database
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

// ---- NATS
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

// ===================== FRONTEND =====================
builder
    .AddNpmApp("frontend", "../../01.Core/Farutech/Frontend", "dev")
    .WithReference(api)
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("https"))
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
