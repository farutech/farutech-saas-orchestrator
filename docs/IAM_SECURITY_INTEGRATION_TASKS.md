# IAM Security Enhancement - Tareas Pendientes de Integración

## 🔴 CRÍTICO: Implementación del Repositorio

### Archivo: `Infrastructure/Persistence/IamRepository.cs`

Implementar los siguientes métodos en `IamRepository`:

```csharp
// ============================================
// Security Events
// ============================================
public async Task AddSecurityEventAsync(SecurityEvent securityEvent)
{
    await _context.SecurityEvents.AddAsync(securityEvent);
    await _context.SaveChangesAsync();
}

public async Task<List<SecurityEvent>> GetSecurityEventsByUserIdAsync(Guid userId, int pageSize, int pageNumber)
{
    return await _context.SecurityEvents
        .Where(e => e.UserId == userId)
        .OrderByDescending(e => e.OccurredAt)
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .Include(e => e.User)
        .Include(e => e.Device)
        .ToListAsync();
}

public async Task<List<SecurityEvent>> GetSecurityEventsByTenantIdAsync(Guid tenantId, int pageSize, int pageNumber)
{
    return await _context.SecurityEvents
        .Where(e => e.TenantId == tenantId)
        .OrderByDescending(e => e.OccurredAt)
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .Include(e => e.User)
        .Include(e => e.Device)
        .ToListAsync();
}

public async Task<int> GetRecentFailedLoginAttemptsAsync(string email, string ipAddress, TimeSpan timeWindow)
{
    var cutoffTime = DateTime.UtcNow.Subtract(timeWindow);
    
    return await _context.SecurityEvents
        .Where(e => e.EventType == "LoginFailure" 
            && e.IpAddress == ipAddress
            && e.OccurredAt >= cutoffTime
            && e.Details != null && e.Details.Contains(email))
        .CountAsync();
}

// ============================================
// User Devices
// ============================================
public async Task<UserDevice?> GetUserDeviceByHashAsync(Guid userId, string deviceHash)
{
    return await _context.UserDevices
        .FirstOrDefaultAsync(d => d.UserId == userId && d.DeviceHash == deviceHash);
}

public async Task AddUserDeviceAsync(UserDevice device)
{
    await _context.UserDevices.AddAsync(device);
    await _context.SaveChangesAsync();
}

public async Task UpdateUserDeviceAsync(UserDevice device)
{
    _context.UserDevices.Update(device);
    await _context.SaveChangesAsync();
}

public async Task<List<UserDevice>> GetUserDevicesAsync(Guid userId)
{
    return await _context.UserDevices
        .Where(d => d.UserId == userId)
        .OrderByDescending(d => d.LastSeen)
        .ToListAsync();
}

// ============================================
// Tenant Security Policies
// ============================================
public async Task<TenantSecurityPolicy?> GetTenantSecurityPolicyAsync(Guid tenantId)
{
    return await _context.TenantSecurityPolicies
        .FirstOrDefaultAsync(p => p.TenantId == tenantId);
}

public async Task AddTenantSecurityPolicyAsync(TenantSecurityPolicy policy)
{
    await _context.TenantSecurityPolicies.AddAsync(policy);
    await _context.SaveChangesAsync();
}

public async Task UpdateTenantSecurityPolicyAsync(TenantSecurityPolicy policy)
{
    _context.TenantSecurityPolicies.Update(policy);
    await _context.SaveChangesAsync();
}
```

---

## 🟡 IMPORTANTE: Actualización del DbContext

### Archivo: `Infrastructure/Persistence/IamDbContext.cs`

Agregar DbSets para las nuevas entidades:

```csharp
public class IamDbContext : DbContext
{
    // ... existing DbSets ...

    // NEW: Security Enhancement entities
    public DbSet<UserDevice> UserDevices { get; set; } = null!;
    public DbSet<SecurityEvent> SecurityEvents { get; set; } = null!;
    public DbSet<TenantSecurityPolicy> TenantSecurityPolicies { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ... existing configurations ...

        // NEW: Configure UserDevices
        modelBuilder.Entity<UserDevice>(entity =>
        {
            entity.ToTable("UserDevices");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.DeviceHash).HasMaxLength(128).IsRequired();
            entity.Property(e => e.DeviceName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.DeviceType).HasMaxLength(20).IsRequired();
            entity.Property(e => e.LastIpAddress).HasMaxLength(45).IsRequired();
            
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.DeviceHash);
            entity.HasIndex(e => e.LastSeen);
            entity.HasIndex(e => new { e.UserId, e.DeviceHash }).IsUnique();

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // NEW: Configure SecurityEvents
        modelBuilder.Entity<SecurityEvent>(entity =>
        {
            entity.ToTable("SecurityEvents");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EventType).HasMaxLength(50).IsRequired();
            entity.Property(e => e.IpAddress).HasMaxLength(45).IsRequired();
            
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.OccurredAt);
            entity.HasIndex(e => e.EventType);
            entity.HasIndex(e => e.IpAddress);
            entity.HasIndex(e => e.Success);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Device)
                .WithMany()
                .HasForeignKey(e => e.DeviceId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Tenant)
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // NEW: Configure TenantSecurityPolicies
        modelBuilder.Entity<TenantSecurityPolicy>(entity =>
        {
            entity.ToTable("TenantSecurityPolicies");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TenantId).IsUnique();
            
            entity.Property(e => e.AllowedCountries).HasDefaultValue("[]");
            entity.Property(e => e.BlockedIpRanges).HasDefaultValue("[]");

            entity.HasOne(e => e.Tenant)
                .WithOne()
                .HasForeignKey<TenantSecurityPolicy>(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // NEW: Update Sessions table
        modelBuilder.Entity<Session>(entity =>
        {
            // ... existing configuration ...
            
            entity.Property(e => e.SessionType).HasMaxLength(20).HasDefaultValue("Normal");
            entity.Property(e => e.LastActivityAt).IsRequired(false);
            
            entity.HasOne<UserDevice>()
                .WithMany()
                .HasForeignKey(e => e.DeviceId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
```

---

## 🟢 RECOMENDADO: Actualización del AuthenticationService

### Archivo: `Application/Services/AuthenticationService.cs`

Integrar auditoría y device tracking en el flujo de autenticación:

```csharp
public async Task<LoginResponse> LoginAsync(LoginRequest request)
{
    try
    {
        // ... existing validation ...

        var user = await _repository.GetUserByEmailAsync(request.Email);
        if (user == null)
        {
            // Log failed login attempt
            await _securityAuditService.LogAuthenticationFailureAsync(
                request.Email, 
                request.IpAddress ?? "unknown", 
                request.UserAgent ?? "unknown",
                "USER_NOT_FOUND");
            throw new InvalidOperationException("INVALID_CREDENTIALS");
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            // Log failed login attempt
            await _securityAuditService.LogAuthenticationFailureAsync(
                request.Email, 
                request.IpAddress ?? "unknown", 
                request.UserAgent ?? "unknown",
                "INVALID_PASSWORD");
            throw new InvalidOperationException("INVALID_CREDENTIALS");
        }

        // Register or update device
        var device = await _deviceManagementService.RegisterOrUpdateDeviceAsync(
            user.Id,
            request.IpAddress ?? "unknown",
            request.UserAgent ?? "unknown");

        // ... existing membership logic ...

        // Log successful login
        await _securityAuditService.LogAuthenticationSuccessAsync(
            user.Id,
            request.IpAddress ?? "unknown",
            request.UserAgent ?? "unknown",
            device.DeviceHash);

        // Convert to PublicUserId
        var response = new LoginResponse
        {
            PublicUserId = _publicIdService.ToPublicId(user.Id, "User"),
            Email = user.Email,
            FullName = user.FullName,
            // ... rest of properties ...
        };

        return response;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Login failed for email: {Email}", request.Email);
        throw;
    }
}

public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
{
    try
    {
        // ... existing user creation ...

        var user = new User { /* ... */ };
        await _repository.AddUserAsync(user);

        // Log registration event
        await _securityAuditService.LogEventAsync(new SecurityEventDto
        {
            PublicUserId = _publicIdService.ToPublicId(user.Id, "User"),
            EventType = "UserRegistered",
            IpAddress = request.IpAddress ?? "unknown",
            UserAgent = request.UserAgent ?? "unknown",
            Success = true,
            OccurredAt = DateTime.UtcNow
        });

        return new RegisterResponse
        {
            PublicUserId = _publicIdService.ToPublicId(user.Id, "User"),
            Email = user.Email,
            FullName = user.FullName,
            // ... rest of properties ...
        };
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Registration failed for email: {Email}", request.Email);
        throw;
    }
}
```

**Actualizar constructor**:
```csharp
private readonly IPublicIdService _publicIdService;
private readonly ISecurityAuditService _securityAuditService;
private readonly IDeviceManagementService _deviceManagementService;

public AuthenticationService(
    IIamRepository repository,
    IPasswordHasher passwordHasher,
    ITokenManagementService tokenManagement,
    IEventPublisher eventPublisher,
    IEmailService emailService,
    IPublicIdService publicIdService,
    ISecurityAuditService securityAuditService,
    IDeviceManagementService deviceManagementService,
    ILogger<AuthenticationService> logger,
    IOptions<TokenExpirationOptions> tokenExpirationOptions)
{
    _repository = repository;
    _passwordHasher = passwordHasher;
    _tokenManagement = tokenManagement;
    _eventPublisher = eventPublisher;
    _emailService = emailService;
    _publicIdService = publicIdService;
    _securityAuditService = securityAuditService;
    _deviceManagementService = deviceManagementService;
    _logger = logger;
    _tokenExpirationOptions = tokenExpirationOptions.Value;
}
```

---

## 🟢 RECOMENDADO: Aplicar Rate Limiting en Controllers

### Archivo: `API/Controllers/AuthController.cs`

Agregar atributos de Rate Limiting:

```csharp
using Microsoft.AspNetCore.RateLimiting;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("register")]
    [EnableRateLimiting("Register")]
    [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // ... existing implementation ...
    }

    [HttpPost("login")]
    [EnableRateLimiting("Login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Capture IP and UserAgent
        request.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        request.UserAgent = HttpContext.Request.Headers["User-Agent"].ToString();
        
        var response = await _authenticationService.LoginAsync(request);
        return Ok(response);
    }

    [HttpPost("forgot-password")]
    [EnableRateLimiting("ForgotPassword")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        // ... existing implementation ...
    }

    [HttpPost("verify-email")]
    [EnableRateLimiting("EmailVerification")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> VerifyEmail([FromBody] ConfirmEmailRequest request)
    {
        // ... existing implementation ...
    }

    [HttpPost("2fa/verify")]
    [EnableRateLimiting("TwoFactor")]
    [ProducesResponseType(typeof(Verify2faResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Verify2fa([FromBody] Verify2faRequest request)
    {
        // ... existing implementation ...
    }
}
```

---

## 🔵 OPCIONAL: Nuevos Endpoints de Seguridad

### Archivo: `API/Controllers/SecurityController.cs` (NUEVO)

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Farutech.IAM.Application.DTOs;
using Farutech.IAM.Application.Interfaces;

namespace Farutech.IAM.API.Controllers;

[Authorize]
[ApiController]
[Route("api/security")]
public class SecurityController : ControllerBase
{
    private readonly IDeviceManagementService _deviceService;
    private readonly ISecurityAuditService _auditService;
    private readonly IPublicIdService _publicIdService;

    public SecurityController(
        IDeviceManagementService deviceService,
        ISecurityAuditService auditService,
        IPublicIdService publicIdService)
    {
        _deviceService = deviceService;
        _auditService = auditService;
        _publicIdService = publicIdService;
    }

    [HttpGet("devices")]
    [ProducesResponseType(typeof(List<UserDeviceDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserDevices()
    {
        var userIdClaim = User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var devices = await _deviceService.GetUserDevicesAsync(userId);
        
        var deviceDtos = devices.Select(d => new UserDeviceDto
        {
            PublicDeviceId = _publicIdService.ToPublicId(d.Id, "Device"),
            DeviceName = d.DeviceName,
            DeviceType = d.DeviceType,
            OperatingSystem = d.OperatingSystem,
            Browser = d.Browser,
            LastIpAddress = d.LastIpAddress,
            GeoLocation = d.GeoLocation,
            FirstSeen = d.FirstSeen,
            LastSeen = d.LastSeen,
            IsTrusted = d.IsTrusted,
            IsBlocked = d.IsBlocked,
            BlockReason = d.BlockReason,
            TrustScore = d.TrustScore
        }).ToList();

        return Ok(deviceDtos);
    }

    [HttpPost("devices/{publicDeviceId}/trust")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> TrustDevice(string publicDeviceId)
    {
        var userIdClaim = User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var deviceId = _publicIdService.FromPublicId(publicDeviceId);
        if (!deviceId.HasValue)
            return BadRequest("Invalid device ID");

        await _deviceService.TrustDeviceAsync(deviceId.Value, userId);
        return Ok();
    }

    [HttpDelete("devices/{publicDeviceId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveDevice(string publicDeviceId)
    {
        var userIdClaim = User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var deviceId = _publicIdService.FromPublicId(publicDeviceId);
        if (!deviceId.HasValue)
            return BadRequest("Invalid device ID");

        await _deviceService.RemoveDeviceAsync(deviceId.Value, userId);
        return Ok();
    }

    [HttpGet("events")]
    [ProducesResponseType(typeof(List<SecurityEventDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSecurityEvents([FromQuery] int pageSize = 50, [FromQuery] int pageNumber = 1)
    {
        var userIdClaim = User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var events = await _auditService.GetUserSecurityEventsAsync(userId, pageSize, pageNumber);
        return Ok(events);
    }
}
```

---

## 📋 Checklist de Integración

### Paso 1: Actualización de Base de Datos
- [ ] Ejecutar script de migración: `scripts/iam-security-enhancement-migration.sql`
- [ ] Verificar tablas creadas correctamente
- [ ] Confirmar datos de seed en `TenantSecurityPolicies`

### Paso 2: Actualización de Código
- [ ] Agregar DbSets en `IamDbContext.cs`
- [ ] Configurar entidades en `OnModelCreating`
- [ ] Implementar métodos en `IamRepository.cs`
- [ ] Crear migración de EF Core (opcional): `dotnet ef migrations add SecurityEnhancements`

### Paso 3: Integración en Servicios
- [ ] Actualizar `AuthenticationService` con auditoría y device tracking
- [ ] Agregar Rate Limiting attributes en `AuthController`
- [ ] Capturar IP y UserAgent en LoginRequest

### Paso 4: Testing
- [ ] Probar login con auditoría de eventos
- [ ] Verificar creación automática de devices
- [ ] Validar rate limiting funcionando
- [ ] Confirmar PublicIds en todas las respuestas

### Paso 5: Endpoints Opcionales
- [ ] Crear `SecurityController` (opcional)
- [ ] Implementar endpoints de gestión de devices
- [ ] Implementar endpoints de consulta de eventos

### Paso 6: Configuración
- [ ] Actualizar `appsettings.json` en Production
- [ ] Cambiar `PublicId.SecretKey` por valor seguro
- [ ] Ajustar límites de Rate Limiting según tráfico
- [ ] Configurar alertas de monitoreo

---

## 🚀 Comando de Compilación

```powershell
# Restaurar paquetes (incluye UAParser)
dotnet restore

# Compilar solución
dotnet build

# Ejecutar tests
dotnet test

# Ejecutar API
dotnet run --project src/01.Core/Farutech/IAM/API
```

---

## 📞 Soporte

Para dudas o problemas durante la integración:
- Revisar logs de aplicación
- Consultar `IAM_SECURITY_MIGRATION_GUIDE.md`
- Validar queries de verificación en el script SQL

**Última Actualización**: 2026-02-09
