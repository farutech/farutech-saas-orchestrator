using Farutech.IAM.Domain.Entities;
using Farutech.IAM.Application.DTOs;

namespace Farutech.IAM.Application.Interfaces;

/// <summary>
/// Service for managing user devices
/// </summary>
public interface IDeviceManagementService
{
    /// <summary>
    /// Register or update a device for a user
    /// </summary>
    Task<UserDevice> RegisterOrUpdateDeviceAsync(Guid userId, string deviceHash, string userAgent, string ipAddress);

    /// <summary>
    /// Get all devices for a user
    /// </summary>
    Task<List<UserDeviceDto>> GetUserDevicesAsync(Guid userId);

    /// <summary>
    /// Mark a device as trusted
    /// </summary>
    Task TrustDeviceAsync(Guid userId, Guid deviceId);

    /// <summary>
    /// Block a device
    /// </summary>
    Task BlockDeviceAsync(Guid userId, Guid deviceId);

    /// <summary>
    /// Remove a device
    /// </summary>
    Task RemoveDeviceAsync(Guid userId, Guid deviceId);

    /// <summary>
    /// Check if device is recognized
    /// </summary>
    Task<bool> IsDeviceRecognizedAsync(Guid userId, string ipAddress, string userAgent);

    /// <summary>
    /// Generate a unique device hash from device information
    /// </summary>
    string GenerateDeviceHash(string? deviceId, string? userAgent, string? ipAddress);

    /// <summary>
    /// Generate device hash
    /// </summary>
    string GenerateDeviceHash(string ipAddress, string userAgent);

    /// <summary>
    /// Verify device count limit
    /// </summary>
    Task<bool> CanAddDeviceAsync(Guid userId, int maxDevices);
}
