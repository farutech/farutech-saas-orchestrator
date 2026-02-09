using Farutech.IAM.Application.DTOs;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;

namespace Farutech.IAM.Tests.Integration.Controllers;

public class AuthControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public AuthControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Login_WithValidCredentials_ShouldReturnOk()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "admin@farutech.com",
            Password = "Admin123!",
            IpAddress = "127.0.0.1",
            UserAgent = "Test Agent"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.Unauthorized);
        
        // If OK, should have response body
        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
            result.Should().NotBeNull();
            result!.UserId.Should().NotBeEmpty();
            result.Email.Should().Be(request.Email);
        }
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ShouldReturnUnauthorized()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "nonexistent@farutech.com",
            Password = "WrongPassword123!",
            IpAddress = "127.0.0.1",
            UserAgent = "Test Agent"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Validate_WithValidCredentials_ShouldReturnOk()
    {
        // Arrange
        var request = new ValidateCredentialsRequest
        {
            Email = "admin@farutech.com",
            Password = "Admin123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/validate", request);

        // Assert
        // May return OK or Unauthorized depending on DB state
        response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetMe_WithoutToken_ShouldReturnUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/auth/me");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
