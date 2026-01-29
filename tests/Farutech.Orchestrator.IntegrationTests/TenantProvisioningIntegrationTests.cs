using System.Net;
using System.Net.Http.Json;
using Farutech.Orchestrator.Application.DTOs.Provisioning;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using FluentAssertions;
using Xunit;

namespace Farutech.Orchestrator.IntegrationTests;

/// <summary>
/// Integration tests for tenant provisioning flows
/// </summary>
public class TenantProvisioningIntegrationTests : IntegrationTestBase
{
    [Fact]
    public async Task ProvisionTenant_WithValidData_CreatesTenantInstance()
    {
        // Arrange
        var accessToken = await _fixture.GetAccessTokenAsync();
        _fixture.SetAuthorizationHeader(accessToken);

        var request = new ProvisionTenantRequest
        {
            CustomerId = _testCustomerId,
            ProductId = _testProductId,
            SubscriptionPlanId = _testSubscriptionId,
            DeploymentType = "Shared",
            Name = "Test Tenant Instance"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/Provisioning/provision", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Accepted);

        var result = await response.Content.ReadFromJsonAsync<ProvisionTenantResponse>();
        result.Should().NotBeNull();
        result.TenantCode.Should().NotBeNullOrEmpty();
        result.TenantInstanceId.Should().NotBe(Guid.Empty);
        result.ApiBaseUrl.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task ProvisionTenant_WithInvalidCustomerId_ReturnsBadRequest()
    {
        // Arrange
        var accessToken = await _fixture.GetAccessTokenAsync();
        _fixture.SetAuthorizationHeader(accessToken);

        var request = new ProvisionTenantRequest
        {
            CustomerId = Guid.NewGuid(), // Invalid customer ID
            ProductId = _testProductId,
            SubscriptionPlanId = _testSubscriptionId,
            DeploymentType = "Shared",
            Name = "Test Tenant Instance"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/Provisioning/provision", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetTenantInstances_WithValidToken_ReturnsCustomerTenants()
    {
        // Arrange - First provision a tenant
        var accessToken = await _fixture.GetAccessTokenAsync();
        _fixture.SetAuthorizationHeader(accessToken);

        var provisionRequest = new ProvisionTenantRequest
        {
            CustomerId = _testCustomerId,
            ProductId = _testProductId,
            SubscriptionPlanId = _testSubscriptionId,
            DeploymentType = "Shared",
            Name = "Test Tenant for List"
        };

        await _client.PostAsJsonAsync("/api/Provisioning/provision", provisionRequest);

        // Act - Get instances
        var response = await _client.GetAsync("/api/Instances");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var instances = await response.Content.ReadFromJsonAsync<IEnumerable<TenantInstance>>();
        instances.Should().NotBeNull();
        instances.Should().NotBeEmpty();
        instances.All(i => i.CustomerId == _testCustomerId).Should().BeTrue();
    }

    [Fact]
    public async Task UpdateTenantInstance_WithValidData_Succeeds()
    {
        // Arrange - Provision tenant first
        var accessToken = await _fixture.GetAccessTokenAsync();
        _fixture.SetAuthorizationHeader(accessToken);

        var provisionRequest = new ProvisionTenantRequest
        {
            CustomerId = _testCustomerId,
            ProductId = _testProductId,
            SubscriptionPlanId = _testSubscriptionId,
            DeploymentType = "Shared",
            Name = "Original Name"
        };

        var provisionResponse = await _client.PostAsJsonAsync("/api/Provisioning/provision", provisionRequest);
        var provisionResult = await provisionResponse.Content.ReadFromJsonAsync<ProvisionTenantResponse>();

        // Act - Update instance
        var updateRequest = new { Name = "Updated Name" };
        var updateResponse = await _client.PutAsJsonAsync($"/api/Instances/{provisionResult!.TenantInstanceId}", updateRequest);

        // Assert
        updateResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var updateResult = await updateResponse.Content.ReadFromJsonAsync<dynamic>();
        ((string)updateResult!.name).Should().Be("Updated Name");
    }
}
