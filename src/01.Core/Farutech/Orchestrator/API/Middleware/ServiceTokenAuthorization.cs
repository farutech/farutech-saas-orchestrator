using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Farutech.Orchestrator.Application.Interfaces;

namespace Farutech.Orchestrator.API.Middleware;

/// <summary>
/// Authorization requirement for service tokens
/// </summary>
public class ServiceTokenRequirement : IAuthorizationRequirement
{
}

/// <summary>
/// Authorization handler for service token validation
/// </summary>
public class ServiceTokenAuthorizationHandler : AuthorizationHandler<ServiceTokenRequirement>
{
    private readonly IServiceTokenGenerator _serviceTokenGenerator;
    private readonly ILogger<ServiceTokenAuthorizationHandler> _logger;

    public ServiceTokenAuthorizationHandler(
        IServiceTokenGenerator serviceTokenGenerator,
        ILogger<ServiceTokenAuthorizationHandler> logger)
    {
        _serviceTokenGenerator = serviceTokenGenerator;
        _logger = logger;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ServiceTokenRequirement requirement)
    {
        var httpContext = context.Resource as HttpContext;
        if (httpContext == null)
        {
            _logger.LogWarning("Authorization context does not contain HttpContext");
            return;
        }

        // Extract token from Authorization header
        var authorizationHeader = httpContext.Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
        {
            _logger.LogWarning("Missing or invalid Authorization header");
            return;
        }

        var token = authorizationHeader.Substring("Bearer ".Length);

        try
        {
            // Validate the token
            var isValid = await _serviceTokenGenerator.ValidateServiceTokenAsync(token);
            if (!isValid)
            {
                _logger.LogWarning("Invalid service token");
                return;
            }

            // Extract service ID from token
            var serviceId = await _serviceTokenGenerator.GetServiceIdFromTokenAsync(token);
            if (string.IsNullOrEmpty(serviceId))
            {
                _logger.LogWarning("Could not extract service ID from token");
                return;
            }

            // Add service claims to the context
            var claims = new[]
            {
                new Claim("service_id", serviceId),
                new Claim("token_type", "service"),
                new Claim(ClaimTypes.Name, serviceId)
            };

            var identity = new ClaimsIdentity(claims, "ServiceToken");
            context.User.AddIdentity(identity);

            _logger.LogInformation("Service token validated for service {ServiceId}", serviceId);
            context.Succeed(requirement);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating service token");
        }
    }
}