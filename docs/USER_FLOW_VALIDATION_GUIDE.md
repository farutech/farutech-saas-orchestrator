# Guía de Validación Completa del Flujo de Usuario
## Arquitectura Multi-Tenant con Sincronización IAM

### 📋 **Resumen Ejecutivo**
Esta guía valida el flujo completo de usuario desde el registro hasta la gestión de organizaciones y aplicaciones, incluyendo la sincronización automática entre Orchestrator e IAM.

### 🏗️ **Arquitectura Validada**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │────│  Orchestrator    │────│      IAM        │
│   (React)       │    │  (ASP.NET Core)  │    │ (ASP.NET Core)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   (Multi-DB)    │
                       └─────────────────┘
```

### 🔗 **Endpoints Configurados**

#### **IAM API (Puerto 5001)**
```bash
# Autenticación
POST /api/auth/register          # Registro de usuario
POST /api/auth/login             # Login con device info automática
GET  /api/auth/me               # Información del usuario actual

# Administración (requiere permisos)
GET  /api/admin/tenants         # Listar tenants
GET  /api/admin/tenants/{id}    # Obtener tenant específico
POST /api/admin/tenants         # Crear tenant (admin)
PUT  /api/admin/tenants/{id}    # Actualizar tenant
PATCH /api/admin/tenants/{id}/deactivate  # Desactivar tenant
```

#### **Orchestrator API (Puerto 8080)**
```bash
# Organizaciones
GET  /api/customers              # Listar organizaciones del usuario
POST /api/customers              # Crear organización (sincroniza con IAM)
GET  /api/customers/{id}         # Detalles de organización
PUT  /api/customers/{id}         # Actualizar organización
DELETE /api/customers/{id}       # Eliminar organización

# Aplicaciones
GET  /api/organizations/{orgId}/applications     # Listar aplicaciones
POST /api/provisioning/provision                  # Crear aplicación
GET  /api/provisioning/tasks/{taskId}/status      # Estado de provisioning
```

### 📊 **Flujo de Usuario Completo**

#### **Paso 1: Registro de Usuario Nuevo**
```bash
# Request
POST http://localhost:5001/api/auth/register
{
  "email": "usuario@test.com",
  "password": "SecurePass123!",
  "firstName": "Usuario",
  "lastName": "Test"
}

# Response
{
  "publicUserId": "usr_abc123...",
  "email": "usuario@test.com",
  "fullName": "Usuario Test",
  "emailConfirmationRequired": true,
  "message": "Usuario registrado exitosamente con espacio de trabajo personal"
}
```

**Datos Creados:**
- ✅ Usuario en `iam.users`
- ✅ Personal Tenant en `iam.tenants` (código: `personal-{guid}`)
- ✅ Membership Owner en `iam.tenant_memberships`

#### **Paso 2: Login Automático**
```bash
# Request (device info obtenida automáticamente)
POST http://localhost:5001/api/auth/login
{
  "email": "usuario@test.com",
  "password": "SecurePass123!"
}

# Response
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "refresh_token_here",
  "expiresAt": "2026-02-10T06:00:00Z",
  "availableContexts": [
    {
      "tenantCode": "personal-a1b2c3d4",
      "tenantName": "Usuario Test",
      "roleName": "Owner"
    }
  ]
}
```

**Características de Seguridad:**
- 🔒 IP Address capturada automáticamente desde `HttpContext.Connection.RemoteIpAddress`
- 📱 User-Agent capturado desde `Request.Headers["User-Agent"]`
- 🆔 Device ID generado automáticamente si no proporcionado
- 📊 Evento de auditoría registrado

#### **Paso 3: Creación de Organización**
```bash
# Request (con token de autenticación)
POST http://localhost:8080/api/customers
Authorization: Bearer {access_token}
{
  "companyName": "Mi Empresa S.A.",
  "email": "empresa@test.com",
  "phone": "+57 300 123 4567",
  "address": "Calle 123 #45-67",
  "taxId": "901234567-8"
}

# Response
{
  "customerId": "guid-org-123",
  "companyName": "Mi Empresa S.A.",
  "code": "mi-empresa-sa",
  "iamTenantId": "guid-iam-456",
  "iamTenantCode": "mi-empresa-sa",
  "message": "Empresa creada exitosamente"
}
```

**Sincronización Automática:**
- ✅ Customer creado en `orchestrator.customers`
- ✅ Tenant creado en `iam.tenants` vía TenantSyncService
- ✅ Membership Owner creado en `iam.tenant_memberships`

#### **Paso 4: Verificación de Múltiples Contexts**
```bash
# Re-login para obtener contexts actualizados
POST http://localhost:5001/api/auth/login
{
  "email": "usuario@test.com",
  "password": "SecurePass123!"
}

# Response actualizado
{
  "requiresContextSelection": true,
  "availableContexts": [
    {
      "tenantCode": "personal-a1b2c3d4",
      "tenantName": "Usuario Test",
      "roleName": "Owner"
    },
    {
      "tenantCode": "mi-empresa-sa",
      "tenantName": "Mi Empresa S.A.",
      "roleName": "Owner"
    }
  ]
}
```

#### **Paso 5: Creación de Aplicación**
```bash
# Request
POST http://localhost:8080/api/provisioning/provision
Authorization: Bearer {access_token}
{
  "customerId": "guid-org-123",
  "applicationType": "Ordeon",
  "environment": "Development",
  "version": "1.0.0"
}

# Response
{
  "instanceId": "guid-app-789",
  "status": "Provisioning",
  "message": "Aplicación en proceso de creación"
}
```

#### **Paso 6: Listado de Aplicaciones**
```bash
# Request
GET http://localhost:8080/api/organizations/guid-org-123/applications
Authorization: Bearer {access_token}

# Response
[
  {
    "id": "guid-app-789",
    "code": "ord-dev-001",
    "name": "Ordeon Development",
    "applicationType": "Ordeon",
    "environment": "Development",
    "status": "Active"
  }
]
```

### 🔐 **Matriz de Permisos por Rol**

| Permiso | Owner | Admin | User | Guest |
|---------|-------|-------|------|-------|
| `iam.*` | ✅ | ❌ | ❌ | ❌ |
| `iam.admin.*` | ✅ | ❌ | ❌ | ❌ |
| `iam.catalog.*` | ✅ | ✅ | ✅ | ✅ |
| `iam.sales.*` | ✅ | ✅ | ✅ | ❌ |
| `iam.inventory.*` | ✅ | ✅ | ✅ | ✅ |
| `iam.reports.*` | ✅ | ✅ | ✅ | ❌ |
| `iam.finance.*` | ✅ | ✅ | ❌ | ❌ |

### 🧪 **Ejecución de Validación**

#### **Prerrequisitos**
```bash
# Servicios ejecutándose
✅ IAM API: http://localhost:5001
✅ Orchestrator API: http://localhost:8080
✅ PostgreSQL: localhost:5432
✅ Redis: localhost:6379
```

#### **Ejecutar Validación Completa**
```powershell
# Ejecutar script de validación
.\scripts\Validate-User-Flow.ps1
```

#### **Validación Manual Paso a Paso**
```bash
# 1. Registrar usuario
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# 2. Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# 3. Crear organización (usar token del login)
curl -X POST http://localhost:8080/api/customers \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Corp",
    "email": "corp@test.com",
    "taxId": "123456789"
  }'

# 4. Verificar sincronización
curl http://localhost:5001/api/admin/tenants \
  -H "Authorization: Bearer {token}"
```

### 📈 **Métricas de Validación**

#### **Tiempos Esperados**
- Registro: < 500ms
- Login: < 300ms
- Creación de Org: < 2s (incluye sincronización IAM)
- Provisioning App: < 30s (depende del tipo)

#### **Códigos de Estado HTTP**
- ✅ 201: Creación exitosa
- ✅ 200: Consulta exitosa
- ❌ 400: Datos inválidos
- ❌ 401: No autenticado
- ❌ 403: No autorizado
- ❌ 409: Conflicto (usuario existe)

### 🚨 **Troubleshooting**

#### **Error: Tenant no sincronizado**
```bash
# Verificar logs de Orchestrator
docker logs farutech-orchestrator-api

# Verificar conectividad con IAM
curl http://iam-api:8080/health
```

#### **Error: Login falla**
```bash
# Verificar device info en logs
# IP y User-Agent deben capturarse automáticamente
```

#### **Error: Permisos insuficientes**
```bash
# Verificar rol del usuario en memberships
# Owner: acceso completo
# Admin: gestión limitada
# User: operaciones básicas
```

### 🎯 **Casos de Uso Validados**

1. **Usuario Individual**: Registra → Personal tenant → Funciona solo
2. **Usuario Empresarial**: Registra → Crea org → Invita usuarios → Gestiona apps
3. **Usuario Multi-tenant**: Múltiples organizaciones con diferentes roles
4. **Administrador**: Gestiona usuarios pero no elimina organización
5. **Usuario Invitado**: Acceso limitado a aplicaciones específicas

### 🔒 **Consideraciones de Seguridad**

- ✅ Device fingerprinting automático
- ✅ Auditoría completa de eventos
- ✅ Rate limiting en endpoints críticos
- ✅ Validación de permisos por tenant
- ✅ Tokens JWT con expiración
- ✅ Refresh tokens seguros
- ✅ Encriptación de contraseñas PBKDF2

Esta validación confirma que la arquitectura multi-tenant funciona correctamente con sincronización automática entre sistemas, permisos granulares y captura segura de información de dispositivos.