using Farutech.IAM.Infrastructure.Security;
using FluentAssertions;
using Xunit;

namespace Farutech.IAM.UnitTests.Security;

public class PasswordHasherTests
{
    private readonly PasswordHasher _passwordHasher;

    public PasswordHasherTests()
    {
        _passwordHasher = new PasswordHasher();
    }

    [Fact]
    public void HashPassword_WithValidPassword_ReturnsNonEmptyHash()
    {
        // Arrange
        var password = "TestPass123!";

        // Act
        var hash = _passwordHasher.HashPassword(password);

        // Assert
        hash.Should().NotBeNullOrEmpty();
        hash.Should().NotBe(password);
    }

    [Fact]
    public void HashPassword_SamePasswordTwice_ReturnsDifferentHashes()
    {
        // Arrange
        var password = "TestPass123!";

        // Act
        var hash1 = _passwordHasher.HashPassword(password);
        var hash2 = _passwordHasher.HashPassword(password);

        // Assert
        hash1.Should().NotBe(hash2);
    }

    [Fact]
    public void VerifyPassword_WithCorrectPassword_ReturnsTrue()
    {
        // Arrange
        var password = "TestPass123!";
        var hash = _passwordHasher.HashPassword(password);

        // Act
        var result = _passwordHasher.VerifyPassword(password, hash);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void VerifyPassword_WithIncorrectPassword_ReturnsFalse()
    {
        // Arrange
        var password = "TestPass123!";
        var wrongPassword = "WrongPassword";
        var hash = _passwordHasher.HashPassword(password);

        // Act
        var result = _passwordHasher.VerifyPassword(wrongPassword, hash);

        // Assert
        result.Should().BeFalse();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void VerifyPassword_WithEmptyPassword_ReturnsFalse(string password)
    {
        // Arrange
        var validHash = _passwordHasher.HashPassword("ValidPass123!");

        // Act
        var result = _passwordHasher.VerifyPassword(password, validHash);

        // Assert
        result.Should().BeFalse();
    }
}
