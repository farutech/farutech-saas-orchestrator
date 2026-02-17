using System.Text;
using Farutech.Orchestrator.API.GraphQL;
using Farutech.Orchestrator.API.Middleware;
using Farutech.Orchestrator.API.Services;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Application.Services;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Infrastructure;
using Farutech.Orchestrator.Infrastructure.Auth;
using Farutech.Orchestrator.Infrastructure.Extensions;
using Farutech.Orchestrator.Infrastructure.Messaging;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Farutech.Orchestrator.Infrastructure.Repositories;
using Farutech.Orchestrator.Infrastructure.Services;
using Farutech.Orchestrator.Infrastructure.Seeding;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using NATS.Client.Core;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

// ========== .NET ASPIRE SERVICE DEFAULTS ==========
builder.AddServiceDefaults();

// ========== DATABASE ==========
// IMPORTANTE: Aspire inyecta ConnectionStrings__DefaultConnection con puerto dinámico
// NO usar fallback hardcoded, debe fallar si Aspire no configuró correctamente
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
    // Fallback para desarrollo local cuando no hay Aspire
    if (builder.Environment.IsDevelopment())
    {
        connectionString = "Host=localhost;Port=5432;Database=farutec_db;Username=farutec_admin;Password=SuperSecurePassword123";
        Console.WriteLine("⚠️  Usando cadena de conexión de desarrollo local");
        Console.WriteLine($"   Connection: {connectionString.Replace("SuperSecurePassword123", "***")}");
    }
    else
    {
        Console.WriteLine("❌ ERROR CRÍTICO: ConnectionString 'DefaultConnection' no encontrada");
        Console.WriteLine("   Aspire debe inyectar esta variable antes de iniciar la aplicación");
        Console.WriteLine("   Verifica que AppHost.cs tiene: .WithReference(farutecDb)");
        throw new InvalidOperationException("Connection string 'DefaultConnection' no configurada por Aspire");
    }
}

var postgresPassword = builder.Configuration["postgres-password"] ?? string.Empty;
// ========== HEALTH CHECKS ==========
if (connectionString.Contains("Data Source=") || connectionString.Contains(".db"))
{
    // SQLite - no specific health check available, using generic
    builder.Services.AddHealthChecks();
}
else
{
    // PostgreSQL health check
    builder.Services.AddHealthChecks()
        .AddNpgSql(connectionString, name: "postgresql");
}
var safeConnectionString = postgresPassword.Length > 0
    ? connectionString.Replace(postgresPassword, "***")
    : connectionString;
Console.WriteLine($"✅ Connection string recibida de Aspire: {safeConnectionString}");

builder.Services.AddDbContext<OrchestratorDbContext>(options =>
{
    if (connectionString.Contains("Data Source=") || connectionString.Contains(".db"))
    {
        // SQLite connection
        options.UseSqlite(connectionString);
        Console.WriteLine("🔄 Usando SQLite como base de datos");
    }
    else
    {
        // PostgreSQL connection
        options.UseNpgsql(connectionString);
        Console.WriteLine("🔄 Usando PostgreSQL como base de datos");
    }
});

// ========== SEEDING ==========
// using (var scope = builder.Services.BuildServiceProvider().CreateScope())
// {
//     var context = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
//     await Farutech.Orchestrator.Infrastructure.Seeding.DbSeeder.SeedAsync(context);
//     Console.WriteLine("Database seeded successfully");
// }

// ========== IDENTITY ==========
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<OrchestratorDbContext>()
.AddDefaultTokenProviders();

// ========== JWT AUTHENTICATION ==========
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"] 
    ?? throw new InvalidOperationException("JWT SecretKey not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "FarutechOrchestrator";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "FarutechAPI";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    // Permitir requests sin Authorization header (para endpoints [AllowAnonymous])
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Si no hay Authorization header, no intentar validar
            if (string.IsNullOrEmpty(context.Request.Headers.Authorization))
            {
                context.NoResult();
            }
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            // Si falla la autenticación en endpoint [AllowAnonymous], permitir continuar
            if (context.Request.Path.StartsWithSegments("/api/Auth/select-context"))
            {
                context.NoResult();
            }
            return Task.CompletedTask;
        }
    };
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ServiceToken", policy =>
        policy.Requirements.Add(new ServiceTokenRequirement()));
});

// ========== NATS ==========
var natsEnabled = builder.Configuration.GetValue<bool>("Nats:Enabled", true);
var natsUrl = builder.Configuration.GetValue<string>("Nats:Url") ?? "nats://localhost:4222";
var logger = LoggerFactory.Create(b => b.AddConsole()).CreateLogger("Startup");

if (natsEnabled)
{
    try
    {
        logger.LogInformation($"Configurando NATS en {natsUrl}");
        builder.Services.AddSingleton<INatsConnection>(sp =>
        {
            var opts = NatsOpts.Default with 
            { 
                Url = natsUrl,
                ConnectTimeout = TimeSpan.FromSeconds(builder.Configuration.GetValue<int>("Nats:ConnectionTimeout", 5000) / 1000.0)
            };
            return new NatsConnection(opts);
        });
    }
    catch (Exception ex)
    {
        logger.LogWarning($"NATS no disponible: {ex.Message}. Modo degradado: sin mensajería asíncrona.");
        builder.Services.AddSingleton<INatsConnection>(sp => null!);
    }
}
else
{
    logger.LogInformation("NATS deshabilitado por configuración. Modo síncrono.");
    builder.Services.AddSingleton<INatsConnection>(sp => null!);
}

// ========== APPLICATION SERVICES ==========
builder.Services.AddScoped<IRepository, EfRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IInstanceRepository, InstanceRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ITenantRepository, TenantRepository>();
builder.Services.AddScoped<IInvitationRepository, InvitationRepository>();
builder.Services.AddScoped<IMessageBus, NatsMessageBus>();
builder.Services.AddScoped<IProvisioningService, ProvisioningService>();
builder.Services.AddScoped<ITaskTrackerService, TaskTrackerService>();
builder.Services.AddScoped<IAsyncOrchestrator, AsyncOrchestratorService>();
builder.Services.AddScoped<IServiceTokenGenerator, ServiceTokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IInstanceService, InstanceService>();
builder.Services.AddScoped<IInvitationService, InvitationService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ITenantService, TenantService>();
builder.Services.AddScoped<ICatalogService, Farutech.Orchestrator.Infrastructure.Services.CatalogService>();
builder.Services.AddScoped<ICatalogRepository, CatalogRepository>();
builder.Services.AddScoped<IBillingService, BillingService>();
builder.Services.AddScoped<IWorkerMonitoringService, WorkerMonitoringService>();
builder.Services.AddScoped<IResolveService, ResolveService>();
builder.Services.AddSingleton<IUsageTrackingService, MongoUsageTrackingService>();
builder.Services.AddHostedService<UsageIndexInitializerHostedService>();

var mongoUri = builder.Configuration["MONGO_URI"]
    ?? builder.Configuration["Mongo:Uri"]
    ?? "mongodb://localhost:27017";
var mongoDatabaseName = builder.Configuration["MONGO_DB_NAME"]
    ?? builder.Configuration["Mongo:DatabaseName"]
    ?? "farutech_orchestrator";

builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoUri));
builder.Services.AddSingleton(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoDatabaseName);
});
Console.WriteLine($"✅ MongoDB usage tracking configurado. DB: {mongoDatabaseName}");

// IAM Integration
builder.Services.AddHttpClient<ITenantSyncService, TenantSyncService>(client => {
    // Configurar base URL de IAM API
    var iamUrl = builder.Configuration["Services:IAM:Url"] ?? "http://iam-api:8080";
    client.BaseAddress = new Uri(iamUrl);
});
builder.Services.AddScoped<ITenantSyncService, TenantSyncService>();

// Metrics service
builder.Services.AddSingleton<IMetricsService, MetricsService>();

// Authorization handlers
builder.Services.AddScoped<IAuthorizationHandler, ServiceTokenAuthorizationHandler>();

// Generic repositories for billing entities
builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));

// Database provisioner: creates DB/schema and returns tenant-scoped connection string
builder.Services.AddScoped<IDatabaseProvisioner, DatabaseProvisioner>();

// ========== DATABASE CONNECTION FACTORY (Hybrid Tenancy) ==========
builder.Services.AddSingleton<IDatabaseConnectionFactory, DatabaseConnectionFactory>();

// ========== BACKGROUND WORKERS ==========
// TODO: Habilitar cuando NATS esté configurado
// builder.Services.AddHostedService<Farutech.Orchestrator.Infrastructure.Workers.UserSyncWorker>();

// ========== RBAC SERVICES ==========
builder.Services.AddMemoryCache(); // Required for PermissionService caching
builder.Services.AddScoped<IPermissionService, PermissionService>();

// ========== DATABASE SERVICES ==========
builder.Services.AddScoped<DatabaseBootstrapService>();
builder.Services.AddScoped<DatabasePostMigrationService>();

// ========== SECURITY SERVICES (Intermediate Token Pattern) ==========
builder.Services.AddScoped<ITokenService, TokenService>();
// Legacy support (mantenido por compatibilidad)
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

// ========== REST API (Swagger) ==========
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // En desarrollo, permitir localhost y dominios .farutech.local con cualquier puerto
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrWhiteSpace(origin)) return false;
            
            try
            {
                var uri = new Uri(origin);
                
                // Permitir localhost en cualquier puerto (http o https)
                if (uri.Host == "localhost" || uri.Host == "127.0.0.1")
                    return true;
                
                // Permitir dominios .farutech.local (desarrollo)
                // Ejemplos: farutech.local, app.farutech.local, 8b571b69.faru6128.app.farutech.local
                if (uri.Host.EndsWith(".farutech.local", StringComparison.OrdinalIgnoreCase) ||
                    uri.Host.Equals("farutech.local", StringComparison.OrdinalIgnoreCase))
                    return true;
                
                // Permitir dominios .farutech.com (producción)
                if (uri.Host.EndsWith(".farutech.com", StringComparison.OrdinalIgnoreCase) ||
                    uri.Host.Equals("farutech.com", StringComparison.OrdinalIgnoreCase))
                    return true;
                
                return false;
            }
            catch
            {
                return false;
            }
        })
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Handle circular references in JSON serialization
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Use fully-qualified type names for schema IDs to avoid collisions
    options.CustomSchemaIds(type =>
    {
        // Use FullName when available, fallback to Name. Replace '+' for nested types.
        var id = type.FullName ?? type.Name;
        return id.Replace('+', '.');
    });

    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Farutech SaaS Orchestrator API",
        Version = "v1",
        Description = "API híbrida (REST + GraphQL) para orquestación multi-tenant SaaS con autenticación JWT. Gestiona organizaciones, aplicaciones y facturación."
    });

    // Documentos separados por dominio
    options.SwaggerDoc("auth", new OpenApiInfo
    {
        Title = "Autenticación",
        Version = "v1",
        Description = "Endpoints para login, registro y gestión de sesiones multi-tenant"
    });

    options.SwaggerDoc("organizations", new OpenApiInfo
    {
        Title = "Organizaciones",
        Version = "v1",
        Description = "Gestión de organizaciones (customers) y membresías de usuarios"
    });

    options.SwaggerDoc("applications", new OpenApiInfo
    {
        Title = "Aplicaciones",
        Version = "v1",
        Description = "Gestión de instancias de aplicaciones por organización"
    });

    options.SwaggerDoc("marketplace", new OpenApiInfo
    {
        Title = "Marketplace",
        Version = "v1",
        Description = "Catálogo de aplicaciones disponibles y planes de suscripción"
    });

    options.SwaggerDoc("billing", new OpenApiInfo
    {
        Title = "Facturación",
        Version = "v1",
        Description = "Gestión de suscripciones, facturas y pagos"
    });

    options.SwaggerDoc("workers", new OpenApiInfo
    {
        Title = "Workers",
        Version = "v1",
        Description = "Monitoreo de colas de procesamiento y workers asíncronos"
    });

    // Configurar autenticación JWT en Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Token JWT de autorización. Ejemplo: \"Bearer {token}\""
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Asignar controladores a documentos
    options.DocInclusionPredicate((docName, apiDesc) =>
    {
        var groupName = apiDesc.GroupName ?? apiDesc.ActionDescriptor.RouteValues["controller"];
        return docName switch
        {
            "auth" => groupName == "Auth",
            "organizations" => groupName == "Customers" || groupName == "Applications",
            "applications" => groupName == "Instances" || groupName == "Applications",
            "marketplace" => groupName == "Marketplace" || groupName == "Catalog",
            "billing" => groupName == "Billing",
            "workers" => groupName == "Workers",
            _ => docName == "v1"
        };
    });
});

// ========== GRAPHQL (HotChocolate) ==========
builder.Services
    .AddGraphQLServer()
    .AddAuthorization()
    .AddQueryType(d => d.Name("Query"))
        .AddTypeExtension<InstanceQueries>()
    .AddMutationType(d => d.Name("Mutation"))
        .AddTypeExtension<AuthMutations>();

var app = builder.Build();

Console.WriteLine("Starting application build...");

// ========== DATABASE BOOTSTRAP (PRE-MIGRATION) ==========
if (app.Environment.IsDevelopment())
{
    try
    {
        Console.WriteLine("🏗️ Ejecutando bootstrap de base de datos (pre-migración)...");

        using var scope = app.Services.CreateScope();
        var bootstrapService = scope.ServiceProvider.GetRequiredService<DatabaseBootstrapService>();
        await bootstrapService.BootstrapDatabaseAsync();

        Console.WriteLine("✅ Bootstrap de base de datos completado");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Advertencia: Falló el bootstrap de base de datos: {ex.Message}");
        Console.WriteLine("Continuando con las migraciones...");
    }
}

// ========== EF CORE MIGRATIONS (CON RETRY PARA RESILIENCIA) ==========
if (app.Environment.IsDevelopment())
{
    try
    {
        Console.WriteLine("🔄 Aplicando migraciones EF Core con retry...");

        await DatabaseMigrator.MigrateAsync(
            app.Services,
            app.Logger
        );

        Console.WriteLine("✅ Migraciones EF Core aplicadas exitosamente");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Advertencia: Fallaron las migraciones EF Core en Development: {ex.Message}");
        Console.WriteLine("Continuando sin aplicar migraciones (parche temporal de desarrollo).");
        // En Development no hacemos FAIL-FAST para facilitar depuración local (temporal)
    }
}
else
{
    Console.WriteLine("ℹ️  Ambiente de producción: migraciones deben ejecutarse externamente");
}

// ========== DATABASE POST-MIGRATION BOOTSTRAP ==========
try
{
    Console.WriteLine("🚀 Ejecutando bootstrap post-migración...");

    using (var scope = app.Services.CreateScope())
    {
        var bootstrapService = scope.ServiceProvider.GetRequiredService<DatabasePostMigrationService>();
        await bootstrapService.ExecutePostMigrationSetupAsync();
    }

    Console.WriteLine("✅ Bootstrap post-migración completado exitosamente");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Error crítico durante el bootstrap post-migración: {ex.Message}");
    if (app.Environment.IsDevelopment())
    {
        Console.WriteLine("Continuando sin bootstrap post-migración en Development (parche temporal).");
        // No re-lanzamos la excepción en Development para permitir arranque y diagnóstico
    }
    else
    {
        Console.WriteLine("La aplicación no puede iniciar sin bootstrap funcional.");
        throw; // FAIL-FAST en entornos no-development
    }
}

// ========== IDEMPOTENT DATA SEEDING ==========
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
        var seederLogger = scope.ServiceProvider.GetRequiredService<ILogger<FarutechDataSeeder>>();

        var seeder = new FarutechDataSeeder(context, userManager, roleManager, seederLogger);
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️  Error durante seeding (no crítico): {ex.Message}");
        // NO detener aplicación - seeding debe ser tolerante a fallos
    }
}

// ========== MIDDLEWARE PIPELINE ==========
if (app.Environment.IsDevelopment())
{
    Console.WriteLine("Setting up Swagger...");
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Farutech Orchestrator API v1");
        c.SwaggerEndpoint("/swagger/auth/swagger.json", "Autenticación");
        c.SwaggerEndpoint("/swagger/organizations/swagger.json", "Organizaciones");
        c.SwaggerEndpoint("/swagger/applications/swagger.json", "Aplicaciones");
        c.SwaggerEndpoint("/swagger/marketplace/swagger.json", "Marketplace");
        c.SwaggerEndpoint("/swagger/billing/swagger.json", "Facturación");
        c.SwaggerEndpoint("/swagger/workers/swagger.json", "Workers");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "Farutech SaaS Orchestrator API";
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
        c.DefaultModelsExpandDepth(-1); // Ocultar modelos por defecto
    });
}

Console.WriteLine("Setting up middleware...");
app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

Console.WriteLine("Setting up authentication and authorization...");
try
{
    // Middleware de subdominios (debe ir antes de autenticación)
    app.UseMiddleware<SubdomainMiddleware>();
    
    // IMPORTANTE: El orden es crítico - CORS debe estar antes de Authentication
    app.UseAuthentication();
    app.UseAuthorization();
    
    // Middleware personalizado para validar organizaciones activas
    app.UseMiddleware<ActiveOrganizationMiddleware>();
    
    Console.WriteLine("Authentication and authorization configured successfully");
}
catch (Exception ex)
{
    Console.WriteLine($"Error configuring authentication: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
}

// Configure Prometheus metrics
Console.WriteLine("Setting up Prometheus metrics...");
app.UseMetricServer();
app.UseHttpMetrics();

// Custom metrics middleware
app.UseMiddleware<MetricsMiddleware>();

// ========== ENDPOINTS ==========
Console.WriteLine("Mapping endpoints...");
app.MapControllers(); // REST API
app.MapGraphQL(); // GraphQL API (ruta: /graphql con Banana Cake Pop)

// DEV ONLY: Endpoint temporal para actualizar URLs de instancias
if (app.Environment.IsDevelopment())
{
    app.MapPost("/api/dev/update-instance-urls", async (OrchestratorDbContext context) =>
    {
        await Farutech.Orchestrator.API.Scripts.UpdateInstanceUrlsScript.ExecuteAsync(context);
        return Results.Ok(new { message = "URLs actualizadas exitosamente" });
    }).AllowAnonymous();
}

Console.WriteLine("Application configured successfully, starting...");

// ========== HEALTH CHECK ENDPOINT ==========
app.MapHealthChecks("/health/live");

// ========== INICIO DE LA APLICACIÓN ==========
try
{
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"Application failed to start: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
    throw;
}

// ========== .NET ASPIRE ENDPOINT MAPPINGS ==========
// app.MapDefaultEndpoints(); // Exposes health checks, metrics for Aspire Dashboard (comentado para ejecución standalone)
