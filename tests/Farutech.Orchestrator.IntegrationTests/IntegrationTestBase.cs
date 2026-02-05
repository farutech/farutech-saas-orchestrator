using System.Net.Http.Headers;
using System.Net.Http.Json;
using Farutech.Orchestrator.API;
using Farutech.Orchestrator.Application.DTOs.Auth;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Domain.Enums;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Farutech.Orchestrator.IntegrationTests;

/// <summary>
/// Base class for integration tests with SQLite in-memory database
/// </summary>
public class IntegrationTestBase : IAsyncLifetime
{
    protected HttpClient _client = null!;
    protected WebApplicationFactory<Farutech.Orchestrator.API.TestStartup> _factory = null!;

    // Test data IDs
    protected Guid _testCustomerId;
    protected Guid _testProductId;
    protected Guid _testSubscriptionId;
    protected string _testUserEmail = "test@example.com";
    protected string _testUserPassword = "TestPassword123!";

    public async Task InitializeAsync()
    {
        // Configure test web application with SQLite in-memory database
        _factory = new WebApplicationFactory<Farutech.Orchestrator.API.TestStartup>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureAppConfiguration((context, config) =>
                {
                    // Override configuration for tests
                    config.AddInMemoryCollection(new Dictionary<string, string?>
                    {
                        ["Jwt:SecretKey"] = "TestSuperSecretKeyForIntegrationTests12345678901234567890",
                        ["Jwt:Issuer"] = "TestIssuer",
                        ["Jwt:Audience"] = "TestAudience",
                        ["Jwt:ExpiryMinutes"] = "60",
                        ["ConnectionStrings:DefaultConnection"] = $"DataSource={Path.GetTempFileName()}.db"
                    });
                });

                builder.ConfigureServices(services =>
                {
                    // The TestStartup already configures SQLite, no need to override
                });
            });

        _client = _factory.CreateClient();

        // Setup test data
        await SetupTestDataAsync();
    }

    public async Task DisposeAsync()
    {
        _client?.Dispose();
        _factory?.Dispose();
        await Task.CompletedTask; // Avoid async warning
    }

    /// <summary>
    /// Setup initial test data in the database
    /// </summary>
    private async Task SetupTestDataAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        // Ensure database is created and migrated
        await context.Database.MigrateAsync();

        // Create test customer
        var customer = new Customer
        {
            Code = "TEST001",
            CompanyName = "Test Company Inc",
            TaxId = "1234567890",
            Email = "test@company.com",
            IsActive = true
        };

        context.Customers.Add(customer);
        await context.SaveChangesAsync();
        _testCustomerId = customer.Id;

        // Get test product (created by migration)
        var product = await context.Products.FirstOrDefaultAsync(p => p.Code == "FARUPOS");
        if (product == null)
        {
            // Fallback: create test product if migration didn't create it
            product = new Domain.Entities.Catalog.Product
            {
                Code = "FARUPOS",
                Name = "Farutech POS",
                Description = "Point of Sale System",
                IsActive = true
            };
            context.Products.Add(product);
            await context.SaveChangesAsync();
        }
        _testProductId = product.Id;

        // Create test subscription plan
        var subscription = new Domain.Entities.Catalog.Subscription
        {
            ProductId = product.Id,
            Code = "FULL",
            Name = "Full Plan",
            Description = "Complete feature set",
            IsActive = true,
            MonthlyPrice = 99.99m
        };

        context.SubscriptionPlans.Add(subscription);
        await context.SaveChangesAsync();
        _testSubscriptionId = subscription.Id;

        // Create test user
        var user = new ApplicationUser
        {
            UserName = _testUserEmail,
            Email = _testUserEmail,
            FirstName = "Test",
            LastName = "User",
            IsActive = true
        };

        var result = await userManager.CreateAsync(user, _testUserPassword);
        if (!result.Succeeded)
        {
            throw new Exception($"Failed to create test user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        // Create user membership
        var membership = new UserCompanyMembership
        {
            UserId = user.Id,
            CustomerId = _testCustomerId,
            Role = FarutechRole.Owner,
            IsActive = true
        };

        context.UserCompanyMemberships.Add(membership);
        await context.SaveChangesAsync();

        // Create test tenant instance
        var tenantInstance = new TenantInstance
        {
            CustomerId = _testCustomerId,
            TenantCode = "TEST001-001",
            Code = "TEST001",
            Name = "Test Tenant Instance",
            DeploymentType = "Shared",
            Status = "active",
            ConnectionString = "Host=localhost;Database=test_db;Username=test;Password=test",
            ProvisionedAt = DateTime.UtcNow
        };

        context.TenantInstances.Add(tenantInstance);
        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Get access token for test user
    /// </summary>
    protected async Task<string> GetAccessTokenAsync()
    {
        var loginRequest = new LoginRequest(_testUserEmail, _testUserPassword, false);

        var loginResponse = await _client.PostAsJsonAsync("/api/Auth/login", loginRequest);
        loginResponse.EnsureSuccessStatusCode();

        var loginResult = await loginResponse.Content.ReadFromJsonAsync<SecureLoginResponse>() ?? throw new Exception("Login failed");

        // If user has multiple tenants, select context
        if (loginResult.IntermediateToken != null)
        {
            var contextRequest = new SelectContextRequest(loginResult.IntermediateToken, _testCustomerId);

            var contextResponse = await _client.PostAsJsonAsync("/api/Auth/select-context", contextRequest);
            contextResponse.EnsureSuccessStatusCode();

            var contextResult = await contextResponse.Content.ReadFromJsonAsync<SelectContextResponse>();
            return contextResult?.AccessToken ?? throw new Exception("Context selection failed");
        }

        // Single tenant - return direct access token
        return loginResult.AccessToken ?? throw new Exception("No access token received");
    }

    /// <summary>
    /// Set authorization header with access token
    /// </summary>
    protected void SetAuthorizationHeader(string token)
        => _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
}