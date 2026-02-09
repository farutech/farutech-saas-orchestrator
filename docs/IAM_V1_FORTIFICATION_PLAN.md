# 🏗️ Plan de Fortalecimiento IAM v1 - Enterprise Architecture

## 📊 Estado Actual del Sistema

### ✅ Lo que YA TIENES (Bien Implementado)

#### 1. **Endpoints Core**
- ✅ `POST /api/auth/register` - Registro de usuarios
- ✅ `POST /api/auth/login` - Autenticación
- ✅ `POST /api/auth/select-context` - Context switching (CORREGIDO: userId desde JWT)
- ✅ `POST /api/auth/logout` - Cierre de sesión
- ✅ `GET /api/auth/me` - Claims actuales del token
- ✅ `GET /api/auth/profile` - Perfil detallado
- ✅ `POST /api/token/refresh` - Renovación de tokens
- ✅ `POST /api/token/revoke` - Revocación de tokens
- ✅ `POST /api/token/introspect` - Introspección de tokens

#### 2. **Token JWT RS256**
Claims actuales:
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "jti": "unique_token_id",
  "iat": 1234567890,
  "user_id": "uuid",
  "full_name": "John Doe",
  "first_name": "John",
  "last_name": "Doe",
  "tenant_id": "tenant_uuid",
  "tenant_code": "ACME",
  "tenant_name": "Acme Corp",
  "membership_id": "membership_uuid",
  "role_id": "role_uuid",
  "role_name": "Admin",
  "permission": ["users.read", "users.write", ...],
  "iss": "https://localhost:7001",
  "aud": "farutech-api",
  "exp": 1234567890
}
```

#### 3. **Infraestructura**
- ✅ Entity Framework Core con PostgreSQL
- ✅ Redis caching (opcional)
- ✅ NATS event publishing
- ✅ Auditoría básica (AuditLog)
- ✅ Lockout after 5 failed attempts
- ✅ Session management
- ✅ Refresh tokens con revocación

#### 4. **Seguridad Actual**
- ✅ RS256 signing (2048-bit keys)
- ✅ Password hashing con BCrypt (work factor 12)
- ✅ Token-based authentication
- ✅ Claims-based authorization
- ✅ HTTPS redirection
- ✅ CORS configurado

---

## ❌ Lo que FALTA (Critical Gaps)

### 🚨 **CRÍTICO - Seguridad**

1. **Email Confirmation**
   - ❌ `POST /api/v1/auth/email/send-confirmation`
   - ❌ `POST /api/v1/auth/email/confirm`
   - ⚠️ Usuarios pueden registrarse sin confirmar email

2. **Password Reset**
   - ❌ `POST /api/v1/auth/password/forgot`
   - ❌ `POST /api/v1/auth/password/reset`
   - ⚠️ No hay forma de recuperar contraseña olvidada

3. **Two-Factor Authentication (2FA)**
   - ❌ `POST /api/v1/auth/2fa/setup`
   - ❌ `POST /api/v1/auth/2fa/verify`
   - ❌ `POST /api/v1/auth/2fa/disable`
   - ⚠️ Las columnas existen en DB pero no hay flujo

4. **Rate Limiting**
   - ❌ No hay protección contra brute force
   - ❌ No hay throttling en login/password reset
   - ❌ No hay IP blocking

### ⚠️ **IMPORTANTE - Operacional**

5. **Token Claims Incompletos**
   - ❌ Falta claim `ver` (versión del token)
   - ❌ Falta claim `session_id`
   - ❌ Falta claim `email_verified`
   - ❌ Falta claim `phone_verified`
   - ❌ Falta claim `mfa_verified`

6. **Parametrización por Tenant**
   - ❌ No hay tabla `TenantSettings`
   - ❌ No se pueden configurar:
     - Políticas de contraseña
     - Requerimiento de 2FA
     - TTL de tokens
     - Métodos de autenticación

7. **Auditoría Avanzada**
   - ⚠️ Logs básicos existen pero:
     - No hay eventos específicos para 2FA
     - No hay tracking de IP changes
     - No hay alertas de seguridad

8. **Email Service**
   - ❌ No hay servicio de email implementado
   - ❌ No hay templates
   - ❌ No hay queue para envíos

### 📋 **NICE TO HAVE - Mejoras**

9. **Versionamiento**
   - ⚠️ Endpoints en `/api/auth` sin versión explícita
   - ❌ No hay infraestructura para `/api/v2`

10. **Change Password (Authenticated)**
    - ❌ `POST /api/v1/auth/password/change`
    - Diferente de reset (requiere contraseña actual)

11. **Session Management Avanzado**
    - ❌ `GET /api/v1/auth/sessions` - Listar sesiones activas
    - ❌ `DELETE /api/v1/auth/sessions/{id}` - Cerrar sesión específica
    - ❌ `DELETE /api/v1/auth/sessions/all` - Cerrar todas

---

## 🎯 Plan de Implementación (10 Fases)

### **FASE 1: Fortalecer Token JWT** 🔐
**Prioridad**: CRÍTICA
**Esfuerzo**: 2 horas

**Objetivos:**
- Agregar claims faltantes sin romper compatibilidad
- Preparar para versionamiento

**Claims a agregar:**
```json
{
  "ver": "1",                    // ✅ Versión del token
  "session_id": "uuid",          // ✅ ID de sesión actual
  "email_verified": true,        // ✅ Email confirmado
  "phone_verified": false,       // ✅ Teléfono confirmado
  "mfa_enabled": false,          // ✅ 2FA habilitado
  "mfa_verified": false,         // ✅ 2FA verificado en esta sesión
  "device_id": "device_uuid"     // ✅ Device fingerprint
}
```

**Archivos:**
- `TokenManagementService.cs` - Agregar nuevos claims
- No rompe compatibilidad (apps ignoran claims desconocidos)

---

### **FASE 2: Email Service** 📧
**Prioridad**: CRÍTICA
**Esfuerzo**: 4 horas

**Objetivos:**
- Implementar servicio de email con MailKit
- Configuración para Mailtrap (dev) y SendGrid (prod)
- Templates HTML básicos

**Componentes:**
```
Infrastructure/
  Email/
    IEmailService.cs
    EmailService.cs
    EmailSettings.cs
    Templates/
      EmailConfirmation.html
      PasswordReset.html
      WelcomeEmail.html
```

**Features:**
- SMTP configurado por ambiente
- Queue opcional (Redis/NATS)
- Retry logic
- Logging detallado

---

### **FASE 3: Email Confirmation** ✉️
**Prioridad**: CRÍTICA
**Esfuerzo**: 6 horas

**Endpoints:**
```csharp
POST /api/v1/auth/email/send-confirmation
{
  // No body - usa userId del token
}

Response 200:
{
  "success": true,
  "message": "Confirmation email sent",
  "expiresIn": 3600 // segundos
}

POST /api/v1/auth/email/confirm
{
  "token": "signed_token_from_email"
}

Response 200:
{
  "success": true,
  "message": "Email confirmed successfully"
}
```

**Tabla nueva:**
```sql
CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Lógica:**
1. Usuario se registra → `EmailConfirmed = false`
2. Auto-enviar email de confirmación
3. Token JWT con claim `email_verified: false`
4. Endpoint `/confirm` marca `EmailConfirmed = true`
5. Próximo login → token con `email_verified: true`

**Validaciones:**
- Token válido por 24 horas
- Token de un solo uso
- Reenvío limitado (rate limit: 3 por hora)

---

### **FASE 4: Password Reset** 🔑
**Prioridad**: CRÍTICA
**Esfuerzo**: 6 horas

**Endpoints:**
```csharp
POST /api/v1/auth/password/forgot
{
  "email": "user@example.com"
}

Response 200: // SIEMPRE 200 (no revelar si existe)
{
  "success": true,
  "message": "If the email exists, you will receive a password reset link"
}

POST /api/v1/auth/password/reset
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}

Response 200:
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Tabla nueva:**
```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Flujo de seguridad:**
1. Recibir email → buscar usuario
2. Si existe:
   - Generar token firmado (válido 1 hora)
   - Guardar en DB
   - Enviar email
3. Respuesta genérica (no revelar existencia)
4. En reset:
   - Validar token
   - Cambiar contraseña
   - Revocar TODAS las sesiones activas
   - Revocar TODOS los refresh tokens
   - Enviar email de notificación

**Rate limiting:**
- Forgot: 3 intentos por hora por email
- Reset: 5 intentos por hora por token

---

### **FASE 5: Two-Factor Authentication (2FA)** 🔐
**Prioridad**: ALTA
**Esfuerzo**: 10 horas

**Endpoints:**
```csharp
// 1. Setup TOTP
POST /api/v1/auth/2fa/setup
Authorization: Bearer <token>

Response 200:
{
  "secret": "BASE32_SECRET",
  "qrCodeUrl": "data:image/png;base64,...",
  "backupCodes": ["12345678", "87654321", ...]
}

// 2. Verify setup
POST /api/v1/auth/2fa/verify-setup
{
  "code": "123456"
}

Response 200:
{
  "success": true,
  "message": "2FA enabled successfully"
}

// 3. Verify during login
POST /api/v1/auth/2fa/verify
{
  "sessionToken": "temp_session_token",
  "code": "123456"
}

Response 200:
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresAt": "..."
}

// 4. Disable 2FA
POST /api/v1/auth/2fa/disable
{
  "password": "current_password",
  "code": "123456" // opcional si tiene backup code
}

Response 200:
{
  "success": true,
  "message": "2FA disabled successfully"
}
```

**Tablas nuevas:**
```sql
CREATE TABLE two_factor_backup_codes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  code_hash VARCHAR(255) NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE two_factor_recovery_codes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  code_hash VARCHAR(255) NOT NULL,
  used_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Flujo completo:**

**Setup:**
1. Usuario va a settings → "Enable 2FA"
2. Backend genera secret TOTP
3. Devuelve QR code + backup codes
4. Usuario escanea QR en Google Authenticator
5. Usuario ingresa código de verificación
6. Backend valida y marca `TwoFactorEnabled = true`

**Login con 2FA:**
1. Usuario ingresa email + password
2. Backend valida credenciales
3. Si `TwoFactorEnabled = true`:
   - NO devolver access token
   - Generar `sessionToken` temporal (5 min)
   - Devolver `{ requiresMfa: true, sessionToken: "..." }`
4. Usuario ingresa código 2FA
5. Backend valida código
6. Si correcto → devolver access/refresh tokens normales
7. Token incluye claim `mfa_verified: true`

**Disable:**
1. Requiere password actual
2. Requiere código 2FA válido O backup code
3. Elimina secret, backup codes, recovery codes
4. Envía email de notificación

**Libraries:**
```bash
dotnet add package OtpNet
dotnet add package QRCoder
```

---

### **FASE 6: Parametrización por Tenant** ⚙️
**Prioridad**: ALTA
**Esfuerzo**: 8 horas

**Tabla nueva:**
```sql
CREATE TABLE tenant_settings (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id),
  
  -- Password policies
  password_min_length INT DEFAULT 8,
  password_require_uppercase BOOLEAN DEFAULT true,
  password_require_lowercase BOOLEAN DEFAULT true,
  password_require_digit BOOLEAN DEFAULT true,
  password_require_special BOOLEAN DEFAULT false,
  password_expiration_days INT, -- NULL = never
  
  -- MFA policies
  mfa_required BOOLEAN DEFAULT false,
  mfa_grace_period_days INT DEFAULT 7,
  
  -- Session policies
  access_token_lifetime_minutes INT DEFAULT 480,
  refresh_token_lifetime_days INT DEFAULT 30,
  session_idle_timeout_minutes INT,
  max_concurrent_sessions INT,
  
  -- Auth methods
  allow_password_auth BOOLEAN DEFAULT true,
  allow_social_auth BOOLEAN DEFAULT false,
  allow_saml_auth BOOLEAN DEFAULT false,
  
  -- Lockout policies
  lockout_enabled BOOLEAN DEFAULT true,
  lockout_max_attempts INT DEFAULT 5,
  lockout_duration_minutes INT DEFAULT 30,
  
  -- Email settings
  require_email_verification BOOLEAN DEFAULT true,
  email_verification_token_lifetime_hours INT DEFAULT 24,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Service:**
```csharp
public interface ITenantSettingsService
{
    Task<TenantSettings> GetSettingsAsync(Guid tenantId);
    Task<bool> ValidatePasswordAsync(string password, Guid tenantId);
    Task<bool> IsMfaRequiredAsync(Guid userId, Guid tenantId);
    Task<int> GetAccessTokenLifetimeAsync(Guid tenantId);
}
```

**Integración:**
- `RegisterAsync` → validar password según tenant settings
- `LoginAsync` → validar si MFA requerido
- `GenerateAccessTokenAsync` → usar TTL del tenant
- `AuthenticationService` → consultar settings en cada operación

**Seeding:**
```csharp
// Tenant por defecto con políticas estándar
await dbContext.TenantSettings.AddAsync(new TenantSettings
{
    TenantId = defaultTenant.Id,
    PasswordMinLength = 8,
    MfaRequired = false,
    AccessTokenLifetimeMinutes = 480
});
```

---

### **FASE 7: Rate Limiting** 🚦
**Prioridad**: CRÍTICA
**Esfuerzo**: 6 horas

**Library:**
```bash
dotnet add package AspNetCoreRateLimit
```

**Configuración:**
```json
{
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "StackBlockedRequests": false,
    "RealIpHeader": "X-Real-IP",
    "ClientIdHeader": "X-ClientId",
    "HttpStatusCode": 429,
    "GeneralRules": [
      {
        "Endpoint": "POST:/api/v1/auth/login",
        "Period": "1m",
        "Limit": 5
      },
      {
        "Endpoint": "POST:/api/v1/auth/password/forgot",
        "Period": "1h",
        "Limit": 3
      },
      {
        "Endpoint": "POST:/api/v1/auth/email/send-confirmation",
        "Period": "1h",
        "Limit": 3
      },
      {
        "Endpoint": "*",
        "Period": "1s",
        "Limit": 10
      }
    ]
  }
}
```

**Middleware personalizado para lockout:**
```csharp
public class LoginThrottlingMiddleware
{
    // Track failed attempts per IP + Email
    // After 5 fails in 15 min → block IP for 30 min
    // After 10 fails in 1 hour → notify security team
}
```

---

### **FASE 8: Change Password (Authenticated)** 🔒
**Prioridad**: MEDIA
**Esfuerzo**: 3 horas

**Endpoint:**
```csharp
POST /api/v1/auth/password/change
Authorization: Bearer <token>

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}

Response 200:
{
  "success": true,
  "message": "Password changed successfully",
  "tokensRevoked": true
}
```

**Flujo:**
1. Usuario autenticado quiere cambiar contraseña
2. Validar contraseña actual
3. Validar nueva contraseña según tenant policies
4. Cambiar password hash
5. Revocar TODOS los refresh tokens excepto el actual
6. Mantener sesión actual activa
7. Enviar email de notificación
8. Auditar evento

**Diferencias con reset:**
- Requiere contraseña actual (no token)
- No revoca sesión actual
- Solo revoca otros refresh tokens

---

### **FASE 9: Session Management Avanzado** 🖥️
**Prioridad**: MEDIA
**Esfuerzo**: 4 horas

**Endpoints:**
```csharp
// Listar sesiones activas
GET /api/v1/auth/sessions
Authorization: Bearer <token>

Response 200:
{
  "sessions": [
    {
      "id": "uuid",
      "deviceId": "device_uuid",
      "ipAddress": "192.168.1.1",
      "userAgent": "Chrome 120 / Windows 10",
      "location": "Lima, Peru",
      "createdAt": "2026-02-09T10:00:00Z",
      "lastActivityAt": "2026-02-09T15:30:00Z",
      "expiresAt": "2026-02-09T18:00:00Z",
      "isCurrent": true
    }
  ]
}

// Cerrar sesión específica
DELETE /api/v1/auth/sessions/{sessionId}
Authorization: Bearer <token>

Response 204

// Cerrar todas las sesiones excepto la actual
DELETE /api/v1/auth/sessions/all
Authorization: Bearer <token>

Response 200:
{
  "sessionsRevoked": 3
}
```

**Features:**
- Geolocalización por IP (opcional)
- Device fingerprinting
- Alertas de login desde nueva ubicación

---

### **FASE 10: Versionamiento y Preparación v2** 🚀
**Prioridad**: BAJA
**Esfuerzo**: 6 horas

**Objetivos:**
- Agregar versioning explícito a URLs
- Preparar infraestructura para v2
- NO exponer v2 aún

**Estructura:**
```
Controllers/
  v1/
    AuthController.cs
    TokenController.cs
  v2/  (preparado pero no activado)
    AuthController.cs
```

**Routing:**
```csharp
[ApiController]
[Route("api/v{version:apiVersion}/auth")]
[ApiVersion("1.0")]
public class AuthControllerV1 : ControllerBase
{
    // Endpoints actuales
}

[ApiController]
[Route("api/v{version:apiVersion}/auth")]
[ApiVersion("2.0", Deprecated = false)]
public class AuthControllerV2 : ControllerBase
{
    // Futuros endpoints v2
}
```

**Library:**
```bash
dotnet add package Microsoft.AspNetCore.Mvc.Versioning
dotnet add package Microsoft.AspNetCore.Mvc.Versioning.ApiExplorer
```

**Configuración:**
```csharp
services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});
```

**Claim `ver` en token:**
- v1 tokens: `"ver": "1"`
- v2 tokens: `"ver": "2"`
- Permite migración gradual

---

## 📋 Checklist de No-Regresión

### ✅ Endpoints Existentes NO Cambian
- [ ] `/api/auth/register` - Mismo contrato
- [ ] `/api/auth/login` - Mismo contrato
- [ ] `/api/auth/select-context` - Mismo contrato (solo fix interno)
- [ ] `/api/auth/logout` - Mismo contrato
- [ ] `/api/auth/me` - Mismo contrato
- [ ] `/api/auth/profile` - Mismo contrato
- [ ] `/api/token/refresh` - Mismo contrato
- [ ] `/api/token/revoke` - Mismo contrato
- [ ] `/api/token/introspect` - Mismo contrato

### ✅ Token JWT Backward Compatible
- [ ] Claims existentes NO se eliminan
- [ ] Nuevos claims se AGREGAN
- [ ] Apps antiguas ignoran claims desconocidos
- [ ] Validación de firma sigue igual (RS256)

### ✅ Base de Datos Compatible
- [ ] Migraciones solo AGREGAN tablas/columnas
- [ ] NO se eliminan tablas
- [ ] NO se cambian tipos de datos
- [ ] Valores por defecto para nuevas columnas

---

## 🎯 Resultado Final Esperado

Al terminar las 10 fases, tendrás:

### ✅ **IAM v1 Enterprise-Ready**
1. ✅ Email confirmation completo
2. ✅ Password reset seguro
3. ✅ 2FA con TOTP + backup codes
4. ✅ Rate limiting en todos los endpoints críticos
5. ✅ Parametrización por tenant
6. ✅ Session management avanzado
7. ✅ Token JWT fortalecido con claims completos
8. ✅ Auditoría completa de eventos de seguridad
9. ✅ Email service con templates
10. ✅ Infraestructura lista para v2

### 🔒 **Nivel de Seguridad**
- ✅ Comparable a **Auth0 / Cognito / Okta**
- ✅ Protección contra brute force
- ✅ Zero-trust architecture
- ✅ Token-centric security
- ✅ Multi-factor authentication
- ✅ Comprehensive auditing

### 📊 **Sin Romper Nada**
- ✅ Frontends existentes siguen funcionando
- ✅ Apps consumidoras NO necesitan cambios
- ✅ Tokens antiguos siguen válidos hasta expiration
- ✅ Base de datos solo crece (no destructiva)

---

## 📅 Cronograma Estimado

| Fase | Esfuerzo | Días (1 dev) | Prioridad |
|------|----------|--------------|-----------|
| 1. Token JWT | 2h | 0.25 | CRÍTICA |
| 2. Email Service | 4h | 0.5 | CRÍTICA |
| 3. Email Confirmation | 6h | 0.75 | CRÍTICA |
| 4. Password Reset | 6h | 0.75 | CRÍTICA |
| 5. 2FA | 10h | 1.25 | ALTA |
| 6. Tenant Settings | 8h | 1 | ALTA |
| 7. Rate Limiting | 6h | 0.75 | CRÍTICA |
| 8. Change Password | 3h | 0.375 | MEDIA |
| 9. Session Mgmt | 4h | 0.5 | MEDIA |
| 10. Versioning | 6h | 0.75 | BAJA |
| **TOTAL** | **55h** | **~7 días** | |

**Recomendación**: Implementar fases 1-7 primero (críticas), luego 8-10 según prioridad de negocio.

---

## 🚀 Próximo Paso

**¿Quieres que empiece a implementar?**

Puedo comenzar con:
1. **Fase 1**: Fortalecer token JWT (30 min)
2. **Fase 2**: Email service (2 horas)
3. **Fase 3**: Email confirmation (3 horas)

O prefieres:
- Ver código de ejemplo de alguna fase específica
- Ajustar prioridades
- Discutir algún aspecto de seguridad

**¿Por dónde empezamos? 🎯**