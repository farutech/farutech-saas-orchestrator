using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Farutech.Orchestrator.Application.Interfaces;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Farutech.Orchestrator.Infrastructure.Auth;

/// <summary>
/// Implementación del servicio de generación y validación de tokens JWT.
/// Soporta el flujo de autenticación multi-tenant con tokens intermedios.
/// </summary>
public class TokenService(IConfiguration configuration) : ITokenService
{
    private readonly IConfiguration _configuration = configuration;

    public string GenerateIntermediateToken(ApplicationUser user, List<Guid> allowedTenantIds)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"] 
                ?? throw new InvalidOperationException("JWT SecretKey not configured"))
        );

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Token intermedio con claims mínimos para selección de contexto
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("purpose", "context_selection") // Claim que identifica el propósito del token
        };

        // SEGURIDAD: Incluir los tenantIds permitidos en el token para validación posterior
        // Esto previene que el cliente manipule los tenantIds en la petición
        foreach (var tenantId in allowedTenantIds)
        {
            claims.Add(new Claim("allowed_tenant", tenantId.ToString()));
        }

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(60), // 60 minutos de validez
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateAccessToken(ApplicationUser user, Guid? tenantId, string? companyName, string? role, bool rememberMe = false)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"] 
                ?? throw new InvalidOperationException("JWT SecretKey not configured"))
        );

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Determinar la expiración basada en rememberMe
        var longExpirationHours = 48;
        var shortExpirationMinutes = 30;
        
        if (int.TryParse(_configuration["Jwt:LongExpirationHours"], out var configLongHours))
            longExpirationHours = configLongHours;
        
        if (int.TryParse(_configuration["Jwt:ShortExpirationMinutes"], out var configShortMinutes))
            shortExpirationMinutes = configShortMinutes;

        var expiration = rememberMe
            ? DateTime.UtcNow.AddHours(longExpirationHours)
            : DateTime.UtcNow.AddMinutes(shortExpirationMinutes);

        // Token de acceso con claims completos para autorización
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName),
            new Claim(JwtRegisteredClaimNames.FamilyName, user.LastName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("purpose", "access") // Indica que este token es para acceso completo
        };

        // Claims opcionales de multitenencia (solo si el usuario tiene tenant asignado)
        if (tenantId.HasValue)
        {
            claims.Add(new Claim("tenant_id", tenantId.Value.ToString()));
        }

        if (!string.IsNullOrEmpty(companyName))
        {
            claims.Add(new Claim("company_name", companyName));
        }

        if (!string.IsNullOrEmpty(role))
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expiration,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public (Guid userId, List<Guid> allowedTenantIds)? ValidateIntermediateToken(string intermediateToken)
    {
        try
        {
            Console.WriteLine("[TokenService] Starting intermediate token validation");
            
            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"] 
                    ?? throw new InvalidOperationException("JWT SecretKey not configured"))
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = securityKey,
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            Console.WriteLine($"[TokenService] Validation parameters - Issuer: {_configuration["Jwt:Issuer"]}, Audience: {_configuration["Jwt:Audience"]}");

            var principal = tokenHandler.ValidateToken(intermediateToken, validationParameters, out _);

            Console.WriteLine("[TokenService] Token validated successfully");

            // Verificar que sea un token intermedio (con purpose:context_selection)
            var purposeClaim = principal.FindFirst("purpose")?.Value;
            Console.WriteLine($"[TokenService] Purpose claim: {purposeClaim}");
            
            if (purposeClaim != "context_selection")
            {
                Console.WriteLine("[TokenService] Invalid purpose claim");
                return null;
            }

            // Extraer el UserId del claim 'sub' o 'nameid'
            var userIdClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value 
                              ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Console.WriteLine($"[TokenService] UserId claim: {userIdClaim}");
            
            if (string.IsNullOrEmpty(userIdClaim))
            {
                 Console.WriteLine($"[TokenService] Invalid userId claim - Claims found: {string.Join(", ", principal.Claims.Select(c => c.Type))}");
                 return null;
            }

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                Console.WriteLine("[TokenService] Invalid userId claim format");
                return null;
            }

            // SEGURIDAD: Extraer los tenantIds permitidos del token
            var allowedTenantIds = principal.FindAll("allowed_tenant")
                .Select(c => c.Value)
                .Where(v => Guid.TryParse(v, out _))
                .Select(v => Guid.Parse(v))
                .ToList();

            Console.WriteLine($"[TokenService] Token validation successful - UserId: {userId}, Allowed Tenants: {allowedTenantIds.Count}");
            return (userId, allowedTenantIds);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[TokenService] Token validation failed: {ex.Message}");
            Console.WriteLine($"[TokenService] Stack: {ex.StackTrace}");
            // Token inválido, expirado o malformado
            return null;
        }
    }
}
