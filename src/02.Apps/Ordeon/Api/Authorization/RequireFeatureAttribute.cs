using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;

namespace Farutech.Apps.Ordeon.API.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public sealed class RequireFeatureAttribute : TypeFilterAttribute
{
    public RequireFeatureAttribute(string feature) : base(typeof(FeatureFilter))
    {
        Arguments = new object[] { feature };
    }
}

public sealed class FeatureFilter : IAuthorizationFilter
{
    private readonly string _feature;

    public FeatureFilter(string feature)
    {
        _feature = feature;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        if (!user.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        // Buscamos el claim de features.
        var featuresClaim = user.Claims
            .Where(c => c.Type == "features")
            .SelectMany(c => c.Value.Split(',', StringSplitOptions.RemoveEmptyEntries))
            .ToList();

        if (!featuresClaim.Contains(_feature))
        {
            // Si no tiene la feature, respondemos con 403 Forbidden como solicitó el usuario
            context.Result = new ForbidResult();
        }
    }
}

