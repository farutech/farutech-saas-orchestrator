var builder = DistributedApplication.CreateBuilder(args);

// ========== POSTGRES DATABASE ==========
// Password fijo para desarrollo (en producción usar Azure KeyVault o user-secrets)
var postgresPassword = builder.AddParameter("postgres-password", secret: false);
builder.Configuration["Parameters:postgres-password"] = "SuperSecurePassword123";

var postgres = builder.AddPostgres("postgres", password: postgresPassword)
    .WithPgAdmin()
    .WithDataVolume() // Persistencia de datos
    .WithEnvironment("POSTGRES_DB", "farutec_db");

// IMPORTANTE: El nombre aquí debe coincidir con GetConnectionString("DefaultConnection") en Program.cs
var farutecDb = postgres.AddDatabase("DefaultConnection", "farutec_db");

// ========== NATS MESSAGING ==========
var nats = builder.AddNats("nats")
    .WithDataVolume() // Persistencia de streams JetStream
    .WithEnvironment("NATS_JETSTREAM", "enabled");

// ========== ORCHESTRATOR API ==========
// API usa HTTPS por seguridad (usa perfil 'https' de launchSettings.json)
var orchestratorApi = builder.AddProject<Projects.Farutech_Orchestrator_API>("orchestrator-api", launchProfileName: "https")
    .WithReference(farutecDb)
    .WithReference(nats)
    .WithEnvironment("Nats__Enabled", "true")
    .WithEnvironment("Nats__Url", nats.GetEndpoint("tcp"));
    // Aspire inyecta ConnectionStrings__DefaultConnection automáticamente

// ========== FRONTEND REACT (VITE) ==========
// El frontend recibe la URL de la API como variable de entorno
// Usa HTTPS para seguridad en el endpoint primario
// Ruta relativa desde src/03.Platform/Farutech.AppHost
var frontend = builder.AddNpmApp("frontend", "../../02.Apps/Farutech.Frontend", "dev")
    .WithReference(orchestratorApi)
    .WithEnvironment("VITE_API_URL", orchestratorApi.GetEndpoint("https")) // Usar HTTPS
    .WithHttpEndpoint(env: "PORT") // Dejar que Aspire asigne puerto dinámico
    .WithExternalHttpEndpoints() // Permitir acceso externo
    .PublishAsDockerFile(); // Genera Dockerfile para producción

// ========== GO WORKER (Opcional - Solo si está compilado) ==========
// Para integrar el Worker Go:
// 1. Compilar el worker: cd src/04.Workers/workers-go && go build -o bin/worker.exe cmd/worker/main.go
// 2. Descomentar las siguientes líneas:
//
// var goWorker = builder.AddExecutable("go-worker", "../04.Workers/workers-go/bin/worker", "../04.Workers/workers-go")
//     .WithEnvironment("NATS_URL", nats.GetEndpoint("tcp"))
//     .WithEnvironment("DB_CONNECTION_STRING", $"Host={postgres.GetEndpoint("tcp").Host};Port={postgres.GetEndpoint("tcp").Port};Database=farutec_db;Username=farutec_admin;Password=SuperSecurePassword123");

builder.Build().Run();

