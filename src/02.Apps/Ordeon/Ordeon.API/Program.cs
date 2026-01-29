using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Ordeon.Application.Common.Interfaces;
using Ordeon.Infrastructure.Persistence;
using Ordeon.Infrastructure.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddHttpContextAccessor();

// Core Services
builder.Services.AddScoped<ITenantService, TenantService>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IPermissionProvider, PermissionProvider>();
builder.Services.AddScoped<ICashierContext, CashierContext>();
builder.Services.AddScoped<ITenantProvisioningService, TenantProvisioningService>();
builder.Services.AddHttpClient<IOrchestratorClient, OrchestratorClient>(client => 
{
    client.BaseAddress = new Uri(builder.Configuration["Orchestrator:BaseUrl"] ?? "https://orchestrator.farutech.com");
});

// Hardening & Auditing
builder.Services.AddExceptionHandler<Ordeon.API.Middleware.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddScoped<Ordeon.Infrastructure.Persistence.Interceptors.AuditInterceptor>();

// Database
builder.Services.AddDbContext<OrdeonDbContext>((sp, options) =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var auditInterceptor = sp.GetRequiredService<Ordeon.Infrastructure.Persistence.Interceptors.AuditInterceptor>();
    
    options.UseNpgsql(configuration.GetConnectionString("CustomerDatabase"))
           .ReplaceService<Microsoft.EntityFrameworkCore.Infrastructure.IModelCacheKeyFactory, TenantModelCacheKeyFactory>()
           .AddInterceptors(auditInterceptor);
});

// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "default_very_long_secret_key_for_development"))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();

// Middleware de Tenant - Debe ir DESPUÉS de Authentication para tener acceso a User.Claims
app.Use(async (context, next) =>
{
    var tenantService = context.RequestServices.GetRequiredService<ITenantService>();
    
    // El tenant_id viene en el claim del token de aplicación
    var tenantClaim = context.User.FindFirst("tenant_id");
    if (tenantClaim != null && Guid.TryParse(tenantClaim.Value, out var tenantId))
    {
        tenantService.SetTenant(tenantId);
    }
    
    await next();
});

app.UseAuthorization();
app.MapDefaultEndpoints();
app.MapControllers();

app.Run();
