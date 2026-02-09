using Farutech.IAM.Infrastructure.Security;
using FluentAssertions;

namespace Farutech.IAM.Tests.Unit.Security;

public class PasswordHasherTests
{
    private readonly PasswordHasher _passwordHasher;

    public PasswordHasherTests()
    {
        _passwordHasher = new PasswordHasher();
    }

    [Fact]
    public void HashPassword_ShouldReturnHashedPassword()
    {
        // Arrange
        var password = "MySecurePassword123!";

        // Act
        var hashedPassword = _passwordHasher.HashPassword(password);

        // Assert
        hashedPassword.Should().NotBeNullOrEmpty();
        hashedPassword.Should().NotBe(password);
        hashedPassword.Length.Should().BeGreaterThan(40); // Base64 encoded hash is longer
    }

    [Fact]
    public void HashPassword_SamePlaintext_ShouldProduceDifferentHashes()
    {
        // Arrange
        var password = "MySecurePassword123!";

        // Act
        var hash1 = _passwordHasher.HashPassword(password);
        var hash2 = _passwordHasher.HashPassword(password);

        // Assert
        hash1.Should().NotBe(hash2, "each hash should use a unique salt");
    }

    [Fact]
    public void VerifyPassword_WithCorrectPassword_ShouldReturnTrue()
    {
        // Arrange
        var password = "MySecurePassword123!";
        var hashedPassword = _passwordHasher.HashPassword(password);

        // Act
        var result = _passwordHasher.VerifyPassword(password, hashedPassword);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void VerifyPassword_WithIncorrectPassword_ShouldReturnFalse()
    {
        // Arrange
        var password = "MySecurePassword123!";
        var wrongPassword = "WrongPassword456!";
        var hashedPassword = _passwordHasher.HashPassword(password);

        // Act
        var result = _passwordHasher.VerifyPassword(wrongPassword, hashedPassword);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void VerifyPassword_WithInvalidHashFormat_ShouldReturnFalse()
    {
        // Arrange
        var invalidHash = "invalid_hash_format";
        var password = "MySecurePassword123!";

        // Act
        var result = _passwordHasher.VerifyPassword(password, invalidHash);

        // Assert
        result.Should().BeFalse();
    }

    [Theory]
    [InlineData("")]
    public void HashPassword_WithEmptyPassword_ShouldThrow(string password)
    {
        // Act & Assert
        var action = () => _passwordHasher.HashPassword(password);
        action.Should().Throw<ArgumentNullException>();
    }

    [Fact]
    public void HashPassword_WithWhitespacePassword_ShouldSucceed()
    {
        // Arrange
        var password = " ";

        // Act
        var action = () => _passwordHasher.HashPassword(password);

        // Assert
        action.Should().NotThrow();
    }
}
