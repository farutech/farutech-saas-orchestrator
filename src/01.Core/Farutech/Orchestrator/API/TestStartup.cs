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
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NATS.Client.Core;

namespace Farutech.Orchestrator.API;

/// <summary>
/// Clase Startup simplificada para pruebas de integración
/// </summary>
public class TestStartup
{
    public IConfiguration Configuration { get; }

    public TestStartup()
    {
        // Create configuration for tests
        var configurationBuilder = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:SecretKey"] = "TestSuperSecretKeyForIntegrationTests12345678901234567890",
                ["Jwt:Issuer"] = "TestIssuer",
                ["Jwt:Audience"] = "TestAudience",
                ["Jwt:ExpiryMinutes"] = "60"
            });
        Configuration = configurationBuilder.Build();
    }

    // Alternative constructor for WebApplicationFactory compatibility
    public TestStartup(IConfiguration configuration)
    {
        // Use provided configuration but override JWT settings for tests
        var configurationBuilder = new ConfigurationBuilder()
            .AddConfiguration(configuration)
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:SecretKey"] = "TestSuperSecretKeyForIntegrationTests12345678901234567890",
                ["Jwt:Issuer"] = "TestIssuer",
                ["Jwt:Audience"] = "TestAudience",
                ["Jwt:ExpiryMinutes"] = "60"
            });
        Configuration = configurationBuilder.Build();
    }

    public void ConfigureServices(IServiceCollection services)
    {
        // Controllers
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                // Handle circular references in JSON serialization
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
            });
        services.AddEndpointsApiExplorer();

        // Database (SQLite for tests)
        services.AddDbContext<OrchestratorDbContext>(options =>
            options.UseSqlite("DataSource=:memory:"));

        // Identity
        services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
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

        // JWT Authentication (simplified for tests)
        var jwtSecretKey = Configuration["Jwt:SecretKey"] ?? "test-secret-key-for-integration-tests";
        var jwtIssuer = Configuration["Jwt:Issuer"] ?? "test-issuer";
        var jwtAudience = Configuration["Jwt:Audience"] ?? "test-audience";

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.RequireHttpsMetadata = false;
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    if (string.IsNullOrEmpty(context.Request.Headers.Authorization))
                    {
                        context.NoResult();
                    }
                    return Task.CompletedTask;
                },
                OnAuthenticationFailed = context =>
                {
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

        services.AddAuthorization();

        // NATS (disabled for tests)
        services.AddSingleton<INatsConnection>(sp => null!);

        // Application Services
        services.AddScoped<IRepository, EfRepository>();
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<IInstanceRepository, InstanceRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<ITenantRepository, TenantRepository>();
        services.AddScoped<IInvitationRepository, InvitationRepository>();
        services.AddScoped<IMessageBus, NatsMessageBus>();
        services.AddScoped<IProvisioningService, ProvisioningService>();
        services.AddScoped<ITaskTrackerService, TaskTrackerService>();
        services.AddScoped<IAsyncOrchestrator, AsyncOrchestratorService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IInstanceService, InstanceService>();
        services.AddScoped<IInvitationService, InvitationService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<ITenantService, TenantService>();
        services.AddScoped<ICatalogService, Farutech.Orchestrator.Infrastructure.Services.CatalogService>();
        services.AddScoped<ICatalogRepository, CatalogRepository>();
        services.AddScoped<IBillingService, BillingService>();
        services.AddScoped<IWorkerMonitoringService, WorkerMonitoringService>();
        services.AddScoped<IResolveService, ResolveService>();
        services.AddSingleton<IUsageTrackingService, InMemoryUsageTrackingService>();
        services.AddScoped<IDatabaseProvisioner, DatabaseProvisioner>();
        services.AddSingleton<IDatabaseConnectionFactory, DatabaseConnectionFactory>();
        services.AddMemoryCache();
        services.AddScoped<IPermissionService, PermissionService>();
        services.AddScoped<DatabasePostMigrationService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        // CORS
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.SetIsOriginAllowed(origin =>
                {
                    if (string.IsNullOrWhiteSpace(origin)) return false;
                    var uri = new Uri(origin);
                    return uri.Host == "localhost" || uri.Host == "127.0.0.1";
                })
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
            });
        });

        // Swagger
        services.AddSwaggerGen(options =>
        {
            options.CustomSchemaIds(type =>
            {
                var id = type.FullName ?? type.Name;
                return id.Replace('+', '.');
            });

            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Farutech SaaS Orchestrator API",
                Version = "v1",
                Description = "API híbrida (REST + GraphQL) para orquestación multi-tenant SaaS con autenticación JWT. Gestiona organizaciones, aplicaciones y facturación."
            });

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

        // GraphQL
        services
            .AddGraphQLServer()
            .AddAuthorization()
            .AddQueryType(d => d.Name("Query"))
                .AddTypeExtension<InstanceQueries>()
            .AddMutationType(d => d.Name("Mutation"))
                .AddTypeExtension<AuthMutations>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
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
                c.DefaultModelsExpandDepth(-1);
            });
        }

        app.UseHttpsRedirection();
        app.UseCors("AllowFrontend");

        // Middleware
        app.UseMiddleware<SubdomainMiddleware>();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<ActiveOrganizationMiddleware>();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapGraphQL();
        });
    }
}
