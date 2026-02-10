using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Application.Services;
using Farutech.IAM.Infrastructure.Caching;
using Farutech.IAM.Infrastructure.Email;
using Farutech.IAM.Infrastructure.Messaging;
using Farutech.IAM.Infrastructure.Persistence;
using Farutech.IAM.Infrastructure.Security;
using Farutech.IAM.API.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);

// Add configuration
builder.Services.Configure<TokenOptions>(
    builder.Configuration.GetSection(TokenOptions.SectionName));
builder.Services.Configure<RedisOptions>(
    builder.Configuration.GetSection(RedisOptions.SectionName));
builder.Services.Configure<NatsOptions>(
    builder.Configuration.GetSection(NatsOptions.SectionName));
builder.Services.Configure<EmailOptions>(
    builder.Configuration.GetSection(EmailOptions.SectionName));
builder.Services.Configure<TokenExpirationOptions>(
    builder.Configuration.GetSection(TokenExpirationOptions.SectionName));
builder.Services.Configure<PublicIdOptions>(
    builder.Configuration.GetSection("Security:PublicId"));
builder.Services.Configure<Farutech.IAM.Application.Configuration.SessionOptions>(
    builder.Configuration.GetSection("Security:Session"));
builder.Services.Configure<RateLimitingOptions>(
    builder.Configuration.GetSection("Security:RateLimiting"));

// Add DbContext
var connectionString = builder.Configuration.GetConnectionString("PostgreSQL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=farutech_iam;Username=farutech;Password=FarutechSecure2024!";

builder.Services.AddDbContext<IamDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add Distributed Cache (Redis)
var redisConnection = builder.Configuration.GetConnectionString("Redis")
    ?? "localhost:6379,password=FarutechRedis2024!,defaultDatabase=0";
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnection;
    options.InstanceName = "iam:";
});

// Add Redis caching
builder.Services.AddSingleton<IRedisCacheService, RedisCacheService>();

// Add NATS event publishing
builder.Services.AddSingleton<IEventPublisher, NatsEventPublisher>();

// Add HttpClient for Email API transport
builder.Services.AddHttpClient();

// Add HttpContext accessor for device info
builder.Services.AddHttpContextAccessor();

// Add repositories
builder.Services.AddScoped<IIamRepository, IamRepository>();

// Add security services
builder.Services.AddSingleton<IPublicIdService, PublicIdService>();
builder.Services.AddScoped<ISecurityAuditService, SecurityAuditService>();
builder.Services.AddScoped<IDeviceManagementService, DeviceManagementService>();
builder.Services.AddScoped<ISessionManagementService, SessionManagementService>();

// Add core services
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ITokenManagementService, TokenManagementService>();
builder.Services.AddScoped<IPermissionsCacheManager, PermissionsCacheManager>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

// Add Rate Limiting
builder.Services.AddIamRateLimiting();

// Add JWT Authentication
var tokenOptions = builder.Configuration.GetSection(TokenOptions.SectionName).Get<TokenOptions>()
    ?? new TokenOptions();

// Generate or load RSA key for JWT validation
var rsa = RSA.Create(tokenOptions.RsaKeySize);
var rsaKey = new RsaSecurityKey(rsa);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = rsaKey,
            ValidateIssuer = tokenOptions.ValidateIssuer,
            ValidIssuer = tokenOptions.Issuer,
            ValidateAudience = tokenOptions.ValidateAudience,
            ValidAudience = tokenOptions.Audience,
            ValidateLifetime = tokenOptions.ValidateLifetime,
            ClockSkew = TimeSpan.FromMinutes(tokenOptions.ClockSkewMinutes)
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                {
                    context.Response.Headers.Append("Token-Expired", "true");
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Add controllers
builder.Services.AddControllers();

// Add Swagger/OpenAPI with detailed configuration
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Info = new()
        {
            Title = "Farutech IAM API",
            Version = "v1",
            Description = "Identity and Access Management API for Farutech SaaS Platform. Provides authentication, authorization, user management, and tenant context management.",
            Contact = new()
            {
                Name = "Farutech Support",
                Email = "support@farutech.com"
            }
        };
        return Task.CompletedTask;
    });
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:8081", "https://localhost:7001")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Apply database migrations and seed data
using (var scope = app.Services.CreateScope())
{
    try
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Starting database initialization...");

        var dbContext = scope.ServiceProvider.GetRequiredService<IamDbContext>();
        
        // Only run migrations if database doesn't exist or is out of date
        var pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync();
        if (pendingMigrations.Any())
        {
            logger.LogInformation("Applying {Count} pending database migrations...", pendingMigrations.Count());
            await dbContext.Database.MigrateAsync();
            logger.LogInformation("Database migrations applied successfully");
        }
        else
        {
            logger.LogInformation("Database is up to date, no migrations needed");
        }

        // Only seed if tables are empty
        if (!await dbContext.Roles.AnyAsync())
        {
            logger.LogInformation("Seeding database...");
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
            await IamDbContextSeed.SeedAsync(dbContext, passwordHasher);
            logger.LogInformation("Database seeding completed successfully");
        }
        else
        {
            logger.LogInformation("Database already contains data, skipping seed");
        }
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error during database initialization: {Message}", ex.Message);
        // Continue anyway - don't block startup
        logger.LogWarning("Continuing despite database initialization error...");
    }
}

// Configure the HTTP request pipeline.
app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options
        .WithTitle("Farutech IAM API")
        .WithTheme(ScalarTheme.BluePlanet)
        .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient)
        .WithSidebar(true)
        .WithModels(true)
        .WithSearchHotKey("k")
        .WithDarkMode(true);
});

// Only redirect to HTTPS in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors();

// Add Rate Limiting middleware
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
