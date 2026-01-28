using System.Net;
using System.Net.Http.Json;
using Farutech.Orchestrator.Application.DTOs.Auth;
using Farutech.Orchestrator.Application.DTOs.Provisioning;
using Farutech.Orchestrator.Domain.Entities.Tenants;
using FluentAssertions;
using Xunit;

namespace Farutech.Orchestrator.IntegrationTests;

/// <summary>
/// Integration tests for authentication flows
/// </summary>
public class AuthIntegrationTests : IntegrationTestBase
{
    [Fact]
    public async Task Login_WithValidCredentials_ReturnsIntermediateToken()
    {
        // Arrange
        var loginRequest = new LoginRequest(_testUserEmail, _testUserPassword, false);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<SecureLoginResponse>();
        result.Should().NotBeNull();
        result!.IntermediateToken.Should().NotBeNullOrEmpty();
        result.AccessToken.Should().BeNull();
        result.TenantOptions.Should().NotBeNull();
    }

    [Fact]
    public async Task SelectContext_WithValidIntermediateToken_ReturnsAccessToken()
    {
        // Arrange - Get intermediate token first
        var loginRequest = new LoginRequest(_testUserEmail, _testUserPassword, false);

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        loginResponse.EnsureSuccessStatusCode();

        var loginResult = await loginResponse.Content.ReadFromJsonAsync<SecureLoginResponse>();
        loginResult.Should().NotBeNull();

        var contextRequest = new SelectContextRequest(loginResult!.IntermediateToken!, _testCustomerId);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/select-context", contextRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<SelectContextResponse>();
        result.Should().NotBeNull();
        result!.AccessToken.Should().NotBeNullOrEmpty();
        result.Customer.Should().NotBeNull();
        result.Customer.Id.Should().Be(_testCustomerId);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var loginRequest = new LoginRequest("invalid@example.com", "WrongPassword123!", false);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}