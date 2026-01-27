using System.Text;
using Farutech.Orchestrator.API.GraphQL;
using Farutech.Orchestrator.API.Middleware;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Application.Services;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Infrastructure.Auth;
using Farutech.Orchestrator.Infrastructure.Extensions;
using Farutech.Orchestrator.Infrastructure.Messaging;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Farutech.Orchestrator.Infrastructure.Repositories;
using Farutech.Orchestrator.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NATS.Client.Core;

var builder = WebApplication.CreateBuilder(args);

// ========== .NET ASPIRE SERVICE DEFAULTS ==========
builder.AddServiceDefaults();

// ========== DATABASE ==========
// IMPORTANTE: Aspire inyecta ConnectionStrings__DefaultConnection con puerto dinámico
// NO usar fallback hardcoded, debe fallar si Aspire no configuró correctamente
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
    Console.WriteLine("❌ ERROR CRÍTICO: ConnectionString 'DefaultConnection' no encontrada");
    Console.WriteLine("   Aspire debe inyectar esta variable antes de iniciar la aplicación");
    Console.WriteLine("   Verifica que AppHost.cs tiene: .WithReference(farutecDb)");
    throw new InvalidOperationException("Connection string 'DefaultConnection' no configurada por Aspire");
}

var postgresPassword = builder.Configuration["postgres-password"] ?? string.Empty;
var safeConnectionString = postgresPassword.Length > 0
    ? connectionString.Replace(postgresPassword, "***")
    : connectionString;
Console.WriteLine($"✅ Connection string recibida de Aspire: {safeConnectionString}");

builder.Services.AddDbContext<OrchestratorDbContext>(options =>
    options.UseNpgsql(connectionString));

// ========== SEEDING ==========
// using (var scope = builder.Services.BuildServiceProvider().CreateScope())
// {
//     var context = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
//     await Farutech.Orchestrator.Infrastructure.Seeding.DbSeeder.SeedAsync(context);
//     Console.WriteLine("Database seeded successfully");
// }

// ========== IDENTITY ==========
builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
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

builder.Services.AddAuthorization();

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
builder.Services.AddScoped<IMessageBus, NatsMessageBus>();
builder.Services.AddScoped<IProvisioningService, ProvisioningService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IInstanceService, InstanceService>();
builder.Services.AddScoped<IInvitationService, InvitationService>();
builder.Services.AddScoped<ICatalogService, Farutech.Orchestrator.Infrastructure.Services.CatalogService>();
builder.Services.AddScoped<ICatalogRepository, CatalogRepository>();

// ========== DATABASE CONNECTION FACTORY (Hybrid Tenancy) ==========
builder.Services.AddSingleton<IDatabaseConnectionFactory, DatabaseConnectionFactory>();

// ========== BACKGROUND WORKERS ==========
// TODO: Habilitar cuando NATS esté configurado
// builder.Services.AddHostedService<Farutech.Orchestrator.Infrastructure.Workers.UserSyncWorker>();

// ========== RBAC SERVICES ==========
builder.Services.AddMemoryCache(); // Required for PermissionService caching
builder.Services.AddScoped<IPermissionService, PermissionService>();

// ========== SECURITY SERVICES (Intermediate Token Pattern) ==========
builder.Services.AddScoped<ITokenService, TokenService>();
// Legacy support (mantenido por compatibilidad)
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

// ========== REST API (Swagger) ==========
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // En desarrollo, permitir cualquier puerto de localhost (HTTP y HTTPS)
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrWhiteSpace(origin)) return false;
            var uri = new Uri(origin);
            // Permitir localhost en cualquier protocolo (http o https)
            return uri.Host == "localhost" || uri.Host == "127.0.0.1";
        })
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Farutech SaaS Orchestrator API",
        Version = "v1",
        Description = "Hybrid API (REST + GraphQL) for multi-tenant SaaS orchestration with JWT authentication"
    });

    // Configurar autenticación JWT en Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header. Ejemplo: \"Bearer {token}\""
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

// ========== APLICAR MIGRACIONES AUTOMÁTICAMENTE (PRIMERO) ==========
try
{
    Console.WriteLine("🔄 Aplicando migraciones de base de datos...");
    await app.ApplyMigrationsAsync(allowResetOnFailure: app.Environment.IsDevelopment());
    Console.WriteLine("✅ Migraciones aplicadas exitosamente");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Error crítico aplicando migraciones: {ex.Message}");
    Console.WriteLine("La aplicación no puede iniciar sin una base de datos funcional.");
    throw; // Detener si las migraciones fallan
}

// ========== AUTO-SEED DATA ON STARTUP (DESPUÉS DE MIGRACIONES) ==========
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var seederLogger = scope.ServiceProvider.GetRequiredService<ILogger<Farutech.Orchestrator.Infrastructure.Seeding.FarutechDataSeeder>>();

        var seeder = new Farutech.Orchestrator.Infrastructure.Seeding.FarutechDataSeeder(context, userManager, seederLogger);
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️  Error durante auto-seeding: {ex.Message}");
        // No detenemos la aplicación si falla el seeding (datos ya pueden existir)
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
        c.RoutePrefix = "swagger";
    });
}

Console.WriteLine("Setting up middleware...");
app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

Console.WriteLine("Setting up authentication and authorization...");
try
{
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

// Check for migration or seed command
if (args.Length > 0 && (args[0] == "--migrate" || args[0] == "--seed"))
{
    Console.WriteLine($"Running database {args[0].Replace("--", "")} operation...");
    try
    {
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
            
            // Always run migrations first
            await Farutech.Orchestrator.Infrastructure.Seeding.DbSeeder.ApplySchemaMigrationsAsync(context);
            Console.WriteLine("✅ Schema migrations applied successfully");
            
            // Seed data is now handled by migrations (AddCatalogSeedData)
            // Comment out DbSeeder to avoid duplicates
            // await Farutech.Orchestrator.Infrastructure.Seeding.DbSeeder.SeedAsync(context);
            Console.WriteLine("✅ Database seeded successfully via migrations");
        }
        Console.WriteLine($"Database {args[0].Replace("--", "")} completed successfully!");
        return;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Operation failed: {ex.Message}");
        Console.WriteLine(ex.StackTrace);
        throw;
    }
}

// ========== INICIO DE LA APLICACIÓN ==========
// Las migraciones ya se ejecutaron arriba (después de app.Build(), antes del seeder)

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
