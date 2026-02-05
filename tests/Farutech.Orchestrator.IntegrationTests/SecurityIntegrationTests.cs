using System.Net;
using System.Net.Http.Json;
using Farutech.Orchestrator.Application.DTOs.Auth;
using Farutech.Orchestrator.Application.DTOs.Provisioning;
using Farutech.Orchestrator.Domain.Entities.Identity;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using Farutech.Orchestrator.Domain.Enums;
using Farutech.Orchestrator.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using FluentAssertions;
using Xunit;

namespace Farutech.Orchestrator.IntegrationTests;

/// <summary>
/// Integration tests for security features
/// </summary>
public class SecurityIntegrationTests : IntegrationTestBase
{
    [Fact]
    public async Task AccessOtherCustomerTenant_ReturnsForbidden()
    {
        // Arrange - Create another customer and tenant
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        // Create another customer
        var otherCustomer = new Customer
        {
            Code = "OTHER001",
            CompanyName = "Other Company",
            TaxId = "9876543210",
            Email = "other@company.com",
            IsActive = true
        };

        context.Customers.Add(otherCustomer);
        await context.SaveChangesAsync();

        // Create tenant for other customer
        var otherTenant = new TenantInstance
        {
            CustomerId = otherCustomer.Id,
            TenantCode = "other-test-001",
            Name = "Other Tenant",
            DeploymentType = "Shared",
            Status = "active",
            ConnectionString = "Host=localhost;Database=other_tenant;",
            ApiBaseUrl = "https://other.api.com",
            CreatedBy = "system"
        };

        context.TenantInstances.Add(otherTenant);
        await context.SaveChangesAsync();

        // Get access token for our test user (belongs to different customer)
        var accessToken = await GetAccessTokenAsync();
        SetAuthorizationHeader(accessToken);

        // Act - Try to access other customer's tenant
        var response = await _client.GetAsync($"/api/Instances/{otherTenant.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task AccessWithExpiredToken_ReturnsUnauthorized()
    {
        // Arrange - Use an obviously expired token
        var expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", expiredToken);

        // Act
        var response = await _client.GetAsync("/api/Instances");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task AccessWithoutAuthorizationHeader_ReturnsUnauthorized()
    {
        // Arrange - Remove authorization header
        _client.DefaultRequestHeaders.Authorization = null;

        // Act
        var response = await _client.GetAsync("/api/Instances");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task UpdateTenantStatus_WithInsufficientPermissions_ReturnsForbidden()
    {
        // Arrange - Create a user with limited permissions
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        // Create limited user
        var limitedUser = new ApplicationUser
        {
            UserName = "limited@example.com",
            Email = "limited@example.com",
            FirstName = "Limited",
            LastName = "User",
            IsActive = true
        };

        await userManager.CreateAsync(limitedUser, "LimitedPass123!");

        // Add as User (limited permissions)
        var limitedMembership = new UserCompanyMembership
        {
            UserId = limitedUser.Id,
            CustomerId = _testCustomerId,
            Role = FarutechRole.User,
            IsActive = true
        };

        context.UserCompanyMemberships.Add(limitedMembership);
        await context.SaveChangesAsync();

        // Provision a tenant first
        var ownerToken = await GetAccessTokenAsync();
        SetAuthorizationHeader(ownerToken);

        var provisionRequest = new ProvisionTenantRequest
        {
            CustomerId = _testCustomerId,
            ProductId = _testProductId,
            SubscriptionPlanId = _testSubscriptionId,
            DeploymentType = "Shared",
            Name = "Test Tenant for Permissions"
        };

        var provisionResponse = await _client.PostAsJsonAsync("/api/Provisioning/provision", provisionRequest);
        var provisionResult = await provisionResponse.Content.ReadFromJsonAsync<ProvisionTenantResponse>();

        // Now try to update with limited user
        var limitedLoginRequest = new LoginRequest("limited@example.com", "LimitedPass123!", false);

        var limitedLoginResponse = await _client.PostAsJsonAsync("/api/Auth/login", limitedLoginRequest);
        var limitedLoginResult = await limitedLoginResponse.Content.ReadFromJsonAsync<SecureLoginResponse>();

        var limitedContextRequest = new SelectContextRequest(limitedLoginResult!.IntermediateToken!, _testCustomerId);

        var limitedContextResponse = await _client.PostAsJsonAsync("/api/Auth/select-context", limitedContextRequest);
        var limitedContextResult = await limitedContextResponse.Content.ReadFromJsonAsync<SelectContextResponse>();

        SetAuthorizationHeader(limitedContextResult!.AccessToken!);

        // Act - Try to update tenant status with limited permissions
        var updateRequest = new { Status = "suspended" };
        var updateResponse = await _client.PutAsJsonAsync($"/api/Instances/{provisionResult!.TenantInstanceId}/status", updateRequest);

        // Assert
        updateResponse.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
