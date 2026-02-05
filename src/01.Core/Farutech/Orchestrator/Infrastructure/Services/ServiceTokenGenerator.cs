using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Farutech.Orchestrator.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Farutech.Orchestrator.Infrastructure.Services;

/// <summary>
/// Generador de tokens JWT para comunicación service-to-service.
/// </summary>
public class ServiceTokenGenerator(IConfiguration configuration, IMetricsService metricsService) : IServiceTokenGenerator
{
    private readonly IConfiguration _configuration = configuration;
    private readonly IMetricsService _metricsService = metricsService;
    
    private const string ServiceIssuer = "farutech-orchestrator";
    private const string ServiceAudience = "farutech-services";
    private const int TokenExpirationHours = 24; // 24 horas para servicios

    public async Task<string> GenerateServiceTokenAsync(string serviceId, string serviceType, string[] permissions)
    {
        var secretKey = _configuration["Jwt:ServiceSecretKey"] ?? 
                       _configuration["Jwt:SecretKey"] ?? 
                       throw new InvalidOperationException("JWT service secret key not configured");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Iss, ServiceIssuer),
            new Claim(JwtRegisteredClaimNames.Aud, ServiceAudience),
            new Claim(JwtRegisteredClaimNames.Sub, serviceId),
            new Claim("service_type", serviceType),
            new Claim("permissions", string.Join(",", permissions)),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
            new Claim(JwtRegisteredClaimNames.Exp, DateTimeOffset.UtcNow.AddHours(TokenExpirationHours).ToUnixTimeSeconds().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: ServiceIssuer,
            audience: ServiceAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(TokenExpirationHours),
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        // Record metrics
        _metricsService.RecordServiceTokenGenerated(serviceType);

        await Task.CompletedTask; // Make method truly async
        return tokenString;
    }

    public async Task<bool> ValidateServiceTokenAsync(string token)
    {
        if (string.IsNullOrEmpty(token))
            return false;

        try
        {
            var secretKey = _configuration["Jwt:ServiceSecretKey"] ?? 
                           _configuration["Jwt:SecretKey"] ?? 
                           throw new InvalidOperationException("JWT service secret key not configured");

            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = ServiceIssuer,
                ValidAudience = ServiceAudience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ClockSkew = TimeSpan.Zero // No tolerance for expired tokens
            };

            tokenHandler.ValidateToken(token, validationParameters, out _);

            // Extract service type for metrics
            var jwtToken = tokenHandler.ReadJwtToken(token);
            var serviceTypeClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "service_type");
            var serviceType = serviceTypeClaim?.Value ?? "unknown";

            // Record metrics
            _metricsService.RecordServiceTokenValidated(serviceType, true);

            await Task.CompletedTask; // Make method truly async
            return true;
        }
        catch
        {
            // Record failed validation metrics
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                var serviceTypeClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "service_type");
                var serviceType = serviceTypeClaim?.Value ?? "unknown";
                _metricsService.RecordServiceTokenValidated(serviceType, false);
            }
            catch
            {
                _metricsService.RecordServiceTokenValidated("unknown", false);
            }

            return false;
        }
    }

    public async Task<string?> GetServiceIdFromTokenAsync(string token)
    {
        if (string.IsNullOrEmpty(token))
            return null;

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);
            
            var serviceIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub);
            await Task.CompletedTask; // Make method truly async
            return serviceIdClaim?.Value;
        }
        catch
        {
            return null;
        }
    }
}