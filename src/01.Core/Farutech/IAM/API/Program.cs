using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Application.Services;
using Farutech.IAM.Infrastructure.Caching;
using Farutech.IAM.Infrastructure.Messaging;
using Farutech.IAM.Infrastructure.Persistence;
using Farutech.IAM.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);

// Add configuration
builder.Services.Configure<TokenOptions>(
    builder.Configuration.GetSection(TokenOptions.SectionName));
builder.Services.Configure<RedisOptions>(
    builder.Configuration.GetSection(RedisOptions.SectionName));
builder.Services.Configure<NatsOptions>(
    builder.Configuration.GetSection(NatsOptions.SectionName));

// Add DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=farutec_db;Username=farutec_admin;Password=SuperSecurePassword123";

builder.Services.AddDbContext<IamDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add Redis caching
builder.Services.AddSingleton<IRedisCacheService, RedisCacheService>();

// Add NATS event publishing
builder.Services.AddSingleton<IEventPublisher, NatsEventPublisher>();

// Add repositories
builder.Services.AddScoped<IIamRepository, IamRepository>();

// Add services
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ITokenManagementService, TokenManagementService>();
builder.Services.AddScoped<IPermissionsCacheManager, PermissionsCacheManager>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

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
    var dbContext = scope.ServiceProvider.GetRequiredService<IamDbContext>();
    await dbContext.Database.MigrateAsync();
    await IamDbContextSeed.SeedAsync(dbContext);
}

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
