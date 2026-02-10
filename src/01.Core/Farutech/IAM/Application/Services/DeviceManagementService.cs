using System.Security.Cryptography;
using System.Text;
using Farutech.IAM.Application.Configuration;
using Farutech.IAM.Application.Interfaces;
using Farutech.IAM.Application.DTOs;
using Farutech.IAM.Domain.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using UAParser;

namespace Farutech.IAM.Application.Services;

public class DeviceManagementService : IDeviceManagementService
{
    private readonly IIamRepository _repository;
    private readonly ISecurityAuditService _auditService;
    private readonly IEmailService _emailService;
    private readonly IPublicIdService _publicIdService;
    private readonly SessionOptions _sessionOptions;
    private readonly ILogger<DeviceManagementService> _logger;

    public DeviceManagementService(
        IIamRepository repository,
        ISecurityAuditService auditService,
        IEmailService emailService,
        IPublicIdService publicIdService,
        IOptions<SessionOptions> sessionOptions,
        ILogger<DeviceManagementService> logger)
    {
        _repository = repository;
        _auditService = auditService;
        _emailService = emailService;
        _publicIdService = publicIdService;
        _sessionOptions = sessionOptions.Value;
        _logger = logger;
    }

    public string GenerateDeviceHash(string? deviceId, string? userAgent, string? ipAddress)
    {
        var combined = $"{deviceId ?? ""}|{userAgent ?? ""}|{ipAddress ?? ""}";
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(combined));
        return Convert.ToBase64String(bytes);
    }

    public async Task<UserDevice> RegisterOrUpdateDeviceAsync(Guid userId, string deviceHash, string userAgent, string ipAddress)
    {
        var existingDevice = await _repository.GetUserDeviceByHashAsync(userId, deviceHash);

        if (existingDevice != null)
        {
            // Update existing device
            existingDevice.LastSeen = DateTime.UtcNow;
            existingDevice.LastIpAddress = ipAddress;
            existingDevice.TrustScore = Math.Min(existingDevice.TrustScore + 5, 100); // Increase trust over time
            
            await _repository.UpdateUserDeviceAsync(existingDevice);
            return existingDevice;
        }

        // Parse user agent
        var parser = Parser.GetDefault();
        var clientInfo = parser.Parse(userAgent);

        // Create new device
        var device = new UserDevice
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            DeviceHash = deviceHash,
            DeviceName = GenerateDeviceName(clientInfo),
            DeviceType = DetermineDeviceTypeFromClient(clientInfo),
            OperatingSystem = $"{clientInfo.OS.Family} {clientInfo.OS.Major}",
            Browser = $"{clientInfo.UA.Family} {clientInfo.UA.Major}",
            LastIpAddress = ipAddress,
            FirstSeen = DateTime.UtcNow,
            LastSeen = DateTime.UtcNow,
            IsTrusted = false,
            IsBlocked = false,
            TrustScore = 20 // Initial trust score
        };

        // Check device limit
        if (!await CanAddDeviceAsync(userId, _sessionOptions.MaxDevicesPerUser))
        {
            _logger.LogWarning("User {UserId} exceeded maximum device limit", userId);
            throw new InvalidOperationException("DEVICE_LIMIT_EXCEEDED");
        }

        await _repository.AddUserDeviceAsync(device);

        // Log new device and send alert
        await _auditService.LogNewDeviceAsync(userId, deviceHash, ipAddress, userAgent);

        if (_sessionOptions.AlertOnNewDevice)
        {
            await SendNewDeviceAlertAsync(userId, device);
        }

        _logger.LogInformation("New device registered for user {UserId}: {DeviceName}", userId, device.DeviceName);

        return device;
    }

    public async Task<List<UserDeviceDto>> GetUserDevicesAsync(Guid userId)
    {
        var devices = await _repository.GetUserDevicesAsync(userId);
        
        return devices.Select(d => new UserDeviceDto
        {
            PublicDeviceId = _publicIdService.ToPublicId(d.Id, "UserDevice"),
            DeviceName = d.DeviceName,
            DeviceType = DetermineDeviceType(d),
            OperatingSystem = d.OperatingSystem,
            Browser = d.Browser,
            LastIpAddress = d.LastIpAddress,
            GeoLocation = d.GeoLocation,
            FirstSeen = d.FirstSeen,
            LastSeen = d.LastSeen,
            IsTrusted = d.IsTrusted,
            IsBlocked = d.IsBlocked,
            BlockReason = d.BlockReason,
            TrustScore = d.TrustScore,
            IsCurrentDevice = false // Would need current device context to determine
        }).ToList();
    }
    
    private string DetermineDeviceType(UserDevice device)
    {
        var deviceFamily = device.DeviceName?.ToLower() ?? "";
        
        if (deviceFamily.Contains("mobile") || deviceFamily.Contains("phone"))
            return "Mobile";
        if (deviceFamily.Contains("tablet") || deviceFamily.Contains("ipad"))
            return "Tablet";
        if (deviceFamily.Contains("tv"))
            return "TV";
        
        return "Desktop";
    }

    public async Task TrustDeviceAsync(Guid userId, Guid deviceId)
    {
        var devices = await _repository.GetUserDevicesAsync(userId);
        var device = devices.FirstOrDefault(d => d.Id == deviceId);

        if (device == null)
            throw new InvalidOperationException("DEVICE_NOT_FOUND");

        device.IsTrusted = true;
        device.TrustScore = 100;
        await _repository.UpdateUserDeviceAsync(device);

        _logger.LogInformation("Device {DeviceId} marked as trusted for user {UserId}", deviceId, userId);
    }

    public async Task BlockDeviceAsync(Guid userId, Guid deviceId)
    {
        var devices = await _repository.GetUserDevicesAsync(userId);
        var device = devices.FirstOrDefault(d => d.Id == deviceId);

        if (device == null)
            throw new InvalidOperationException("DEVICE_NOT_FOUND");

        device.IsBlocked = true;
        device.BlockReason = "Manually blocked by user";
        device.TrustScore = 0;
        await _repository.UpdateUserDeviceAsync(device);

        _logger.LogWarning("Device {DeviceId} blocked for user {UserId}", deviceId, userId);
    }

    public async Task RemoveDeviceAsync(Guid userId, Guid deviceId)
    {
        var devices = await _repository.GetUserDevicesAsync(userId);
        var device = devices.FirstOrDefault(d => d.Id == deviceId);

        if (device == null)
            throw new InvalidOperationException("DEVICE_NOT_FOUND");

        // Mark as blocked instead of deleting (for audit trail)
        device.IsBlocked = true;
        device.BlockReason = "User removed device";
        await _repository.UpdateUserDeviceAsync(device);

        _logger.LogInformation("Device {DeviceId} removed for user {UserId}", deviceId, userId);
    }

    public async Task<bool> IsDeviceRecognizedAsync(Guid userId, string ipAddress, string userAgent)
    {
        var deviceHash = GenerateDeviceHash(null, userAgent, ipAddress);
        var device = await _repository.GetUserDeviceByHashAsync(userId, deviceHash);
        return device != null && !device.IsBlocked;
    }

    public async Task<bool> CanAddDeviceAsync(Guid userId, int maxDevices)
    {
        var devices = await _repository.GetUserDevicesAsync(userId);
        var activeDevices = devices.Count(d => !d.IsBlocked);
        return activeDevices < maxDevices;
    }
    
    public string GenerateDeviceHash(string ipAddress, string userAgent)
    {
        return GenerateDeviceHash(null, userAgent, ipAddress);
    }

    #region Private Helper Methods

    private string GenerateDeviceName(ClientInfo clientInfo)
    {
        var os = clientInfo.OS.Family;
        var browser = clientInfo.UA.Family;
        var deviceTypeInfo = DetermineDeviceTypeFromClient(clientInfo);

        return $"{browser} on {os} ({deviceTypeInfo})";
    }

    private string DetermineDeviceTypeFromClient(ClientInfo clientInfo)
    {
        var device = clientInfo.Device.Family.ToLower();
        
        if (device.Contains("mobile") || device.Contains("phone"))
            return "Mobile";
        if (device.Contains("tablet") || device.Contains("ipad"))
            return "Tablet";
        if (device.Contains("tv"))
            return "TV";
        
        return "Desktop";
    }

    private async Task SendNewDeviceAlertAsync(Guid userId, UserDevice device)
    {
        try
        {
            var user = await _repository.GetUserByIdAsync(userId);
            if (user == null || !user.EmailConfirmed)
                return;

            var emailData = new Dictionary<string, string>
            {
                { "deviceName", device.DeviceName },
                { "ipAddress", device.LastIpAddress },
                { "location", device.GeoLocation ?? "Unknown" },
                { "dateTime", device.FirstSeen.ToString("yyyy-MM-dd HH:mm:ss UTC") }
            };

            await _emailService.SendTemplateEmailAsync(
                user.Email,
                "New Device Login Detected",
                "new-device-alert",
                emailData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send new device alert email for user {UserId}", userId);
        }
    }

    #endregion
}
