using Farutech.IAM.Domain.Entities;
using FluentAssertions;
using Xunit;

namespace Farutech.IAM.UnitTests.Services;

public class DomainEntityTests
{
    [Fact]
    public void User_Creation_ShouldSetDefaultValues()
    {
        // Arrange & Act
        var user = new User
        {
            Email = "test@farutech.com",
            FirstName = "Test",
            LastName = "User"
        };

        // Assert
        user.Id.Should().NotBeEmpty();
        user.Email.Should().Be("test@farutech.com");
        user.IsActive.Should().BeTrue();
        user.EmailConfirmed.Should().BeFalse();
        user.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void Tenant_Creation_ShouldSetDefaultValues()
    {
        // Arrange & Act
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = "Test Tenant",
            Code = "TEST001"
        };

        // Assert
        tenant.Id.Should().NotBeEmpty();
        tenant.Name.Should().Be("Test Tenant");
        tenant.Code.Should().Be("TEST001");
        tenant.IsActive.Should().BeTrue();
        tenant.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void Role_Creation_ShouldSetDefaultValues()
    {
        // Arrange & Act
        var role = new Role
        {
            Name = "Admin",
            NormalizedName = "ADMIN",
            Description = "Administrator role"
        };

        // Assert
        role.Id.Should().NotBeEmpty();
        role.Name.Should().Be("Admin");
        role.NormalizedName.Should().Be("ADMIN");
        role.Description.Should().Be("Administrator role");
        role.IsSystemRole.Should().BeFalse();
        role.IsActive.Should().BeTrue();
        role.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void Permission_Creation_ShouldSetDefaultValues()
    {
        // Arrange & Act
        var permission = new Permission
        {
            Code = "user.create",
            Name = "Create User",
            Category = "Users"
        };

        // Assert
        permission.Id.Should().NotBeEmpty();
        permission.Code.Should().Be("user.create");
        permission.Name.Should().Be("Create User");
        permission.Category.Should().Be("Users");
    }
}
