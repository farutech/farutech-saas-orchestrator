# 📋 Plan de Implementación IAM Service - MVP (6 Semanas)

**Fecha Inicio:** 8 de Febrero, 2026  
**Responsable:** Equipo Farutech  
**Referencia:** [IAM_ARCHITECTURE_ANALYSIS_AND_PROPOSAL_V2.md](../docs/IAM_ARCHITECTURE_ANALYSIS_AND_PROPOSAL_V2.md)

---

## 🎯 Objetivo del MVP

Crear un IAM Service desacoplado con:
- ✅ Autenticación con refresh tokens
- ✅ RBAC + ABAC foundation
- ✅ Caching con Redis
- ✅ Event bus con NATS
- ✅ SDK para apps

---

## 📅 FASE 1: SEMANA 1-2 - Setup IAM Service

### ✅ Tareas Completadas
- [x] **1.1** Crear estructura de proyecto IAM ✅ **COMPLETADO**
- [x] **1.2** Implementar Domain Entities ✅ **COMPLETADO**
- [x] **1.3** Implementar DbContext y Migrations ✅ **COMPLETADO**
- [x] **1.4** Migrar datos de identity.* a iam.* ✅ **COMPLETADO**
- [x] **1.5** Implementar AuthenticationService básico ✅ **COMPLETADO**
- [x] **1.6** Implementar TokenManagementService ✅ **COMPLETADO**
- [x] **1.7** Implementar AuthController ✅ **COMPLETADO**
- [x] **1.8** Implementar TokenController ✅ **COMPLETADO**
- [ ] **1.9** Configurar Redis
- [ ] **1.10** Configurar NATS
- [ ] **1.11** Testing unitario
- [ ] **1.12** Testing de integración

### 📝 Detalle de Tareas

#### 1.1 Crear estructura de proyecto IAM ⏳ EN PROGRESO

**Ubicación:** `C:\Users\farid\farutech-saas-orchestrator\src\01.Core\Farutech\IAM\`

**Estructura a crear:**
```
IAM\
├── Farutech.IAM.sln
├── Domain\
│   ├── Farutech.IAM.Domain.csproj
│   ├── Entities\
│   │   ├── User.cs
│   │   ├── Tenant.cs
│   │   ├── TenantMembership.cs
│   │   ├── Role.cs
│   │   ├── Permission.cs
│   │   ├── RolePermission.cs
│   │   ├── PolicyRule.cs
│   │   ├── UserClaim.cs
│   │   ├── RefreshToken.cs
│   │   ├── Session.cs
│   │   └── AuditLog.cs
│   ├── Events\
│   │   ├── UserLoggedInEvent.cs
│   │   ├── PermissionChangedEvent.cs
│   │   └── TokenRefreshedEvent.cs
│   └── ValueObjects\
│       └── PasswordHash.cs
│
├── Application\
│   ├── Farutech.IAM.Application.csproj
│   ├── Services\
│   │   ├── AuthenticationService.cs
│   │   ├── TokenManagementService.cs
│   │   ├── AuthorizationEngine.cs
│   │   ├── DynamicClaimsGenerator.cs
│   │   └── SessionManager.cs
│   ├── DTOs\
│   │   ├── LoginRequest.cs
│   │   ├── LoginResponse.cs
│   │   ├── RefreshTokenRequest.cs
│   │   ├── SelectContextRequest.cs
│   │   └── TokenIntrospectionResponse.cs
│   └── Interfaces\
│       ├── IAuthenticationService.cs
│       ├── ITokenService.cs
│       └── IAuthorizationEngine.cs
│
├── Infrastructure\
│   ├── Farutech.IAM.Infrastructure.csproj
│   ├── Persistence\
│   │   ├── IamDbContext.cs
│   │   ├── Configurations\
│   │   │   ├── UserConfiguration.cs
│   │   │   ├── TenantConfiguration.cs
│   │   │   └── ...
│   │   └── Migrations\
│   ├── Caching\
│   │   ├── RedisCacheService.cs
│   │   └── PermissionsCacheManager.cs
│   ├── Events\
│   │   ├── NatsEventPublisher.cs
│   │   └── EventSubscriber.cs
│   ├── Security\
│   │   ├── JwtTokenGenerator.cs
│   │   ├── RS256KeyManager.cs
│   │   └── RefreshTokenGenerator.cs
│   └── Repositories\
│       ├── UserRepository.cs
│       ├── TenantRepository.cs
│       ├── PermissionRepository.cs
│       └── SessionRepository.cs
│
└── API\
    ├── Farutech.IAM.API.csproj
    ├── Controllers\
    │   ├── AuthController.cs
    │   ├── TokenController.cs
    │   ├── AuthorizationController.cs
    │   └── SessionController.cs
    ├── Middleware\
    │   ├── RateLimitingMiddleware.cs
    │   └── SecurityHeadersMiddleware.cs
    ├── Program.cs
    └── appsettings.json
```

**Comandos a ejecutar:**
```powershell
# Navegar a la ubicación
cd C:\Users\farid\farutech-saas-orchestrator\src\01.Core\Farutech

# Crear directorio IAM
mkdir IAM
cd IAM

# Crear solución
dotnet new sln -n Farutech.IAM

# Crear proyectos
dotnet new classlib -n Farutech.IAM.Domain -o Domain
dotnet new classlib -n Farutech.IAM.Application -o Application
dotnet new classlib -n Farutech.IAM.Infrastructure -o Infrastructure
dotnet new webapi -n Farutech.IAM.API -o API

# Agregar proyectos a la solución
dotnet sln add Domain/Farutech.IAM.Domain.csproj
dotnet sln add Application/Farutech.IAM.Application.csproj
dotnet sln add Infrastructure/Farutech.IAM.Infrastructure.csproj
dotnet sln add API/Farutech.IAM.API.csproj

# Referencias entre proyectos
dotnet add Application/Farutech.IAM.Application.csproj reference Domain/Farutech.IAM.Domain.csproj
dotnet add Infrastructure/Farutech.IAM.Infrastructure.csproj reference Domain/Farutech.IAM.Domain.csproj
dotnet add Infrastructure/Farutech.IAM.Infrastructure.csproj reference Application/Farutech.IAM.Application.csproj
dotnet add API/Farutech.IAM.API.csproj reference Application/Farutech.IAM.Application.csproj
dotnet add API/Farutech.IAM.API.csproj reference Infrastructure/Farutech.IAM.Infrastructure.csproj
```

**Status:** ✅ COMPLETADO

**Resultado:**
- Solución `Farutech.IAM.sln` creada
- 4 proyectos creados: Domain, Applic✅ COMPLETADO

**Archivos creados:**
- ✅ User.cs (fuente única de identidad)
- ✅ Tenant.cs (organizaciones multi-tenant)
- ✅ TenantMembership.cs (many-to-many Users ↔ Tenants)
- ✅ Role.cs (RBAC - roles globales y tenant-specific)
- ✅ Permission.cs (permisos atómicos)
- ✅ RolePermission.cs (many-to-many Roles ↔ Permissions)
- ✅ PolicyRule.cs (ABAC - políticas con condiciones JSON)
- ✅ UserClaim.cs (claims dinámicos por tenant)
- ✅ RefreshToken.cs (tokens opacos revocables)
- ✅ Session.cs (gestión de sesiones activas)
- ✅ AuditLog.cs (auditoría de eventos de seguridad)

**Domain Events creados:**
- ✅ UserLoggedInEvent.cs
- ✅ PermissionChangedEvent.cs
- ✅ TokenRefreshedEvent.cs
- ✅ SessionExpiredEvent.cs
- ✅ TenantCreatedEvent.cs

**Compilación:** ✅ Exitosa (7.4s)
**Archivos a crear:**
- User.cs
- Tenant.cs
- TenantMembership.cs
- Role.cs
- Permission.cs
- RolePermission.cs
- PolicyRule.cs
- UserClaim.cs
- RefreshToken.cs
- Session.cs

---

#### 1.3 Implementar DbContext y Migrations ✅ COMPLETADO

**Completado el:** 8 de Febrero, 2026 - 23:46 UTC

**Tareas realizadas:**
- [x] Agregar paquetes NuGet a Infrastructure:
  - Npgsql.EntityFrameworkCore.PostgreSQL 9.0.0
  - Microsoft.EntityFrameworkCore.Design 9.0.0
- [x] Crear IamDbContext con 11 DbSets
- [x] Crear 11 Entity Configurations (FluentAPI)
- [x] Generar migración inicial (20260209044630_InitialCreate)
- [x] Aplicar migración a BD farutec_db

**Archivos creados:**
- IamDbContext.cs (35 líneas)
- 11 Entity Configurations en Persistence/Configurations/
- 3 archivos de migración en Persistence/Migrations/

**Resultado:**
- ✅ Schema "iam" creado
- ✅ 11 tablas creadas
- ✅ 31 índices creados
- ✅ Compilación exitosa (1.9s)

---

#### 1.4 Migrar datos de identity.* a iam.* ✅ **COMPLETADO**

**Completado el:** 9 de Febrero, 2026 - 00:53 UTC

**Scripts creados:**
- 01-analyze-identity-schema.sql - Análisis del esquema identity
- 02-migrate-identity-to-iam.sql - Migración completa con manejo de casos
- 03-seed-data-simple.sql - Seed data simplificado
- Run-DataMigration.ps1 - Script PowerShell para automatización

**Datos Seed creados:**
- ✅ 4 Roles del sistema (Owner, Admin, User, Guest)
- ✅ 20 Permisos base (Catálogo, Ventas, Inventario, Reportes, Administración)
- ✅ 50 Role-Permission mappings
- ✅ 1 Tenant de ejemplo (Farutech Corporation)
- ✅ 1 Usuario admin (admin@farutech.com)
- ✅ 1 Tenant Membership (Admin → Farutech con rol Owner)

**Permisos creados por categoría:**
- **Catálogo:** 5 permisos (view, create, edit, delete, categories.manage)
- **Ventas:** 5 permisos (orders.view/create/edit/cancel, invoices.generate)
- **Inventario:** 3 permisos (view, adjust, transfer)
- **Reportes:** 3 permisos (sales, inventory, financial)
- **Administración:** 4 permisos (users, roles, settings, audit)

**Asignación de permisos por rol:**
- **Owner:** 20/20 permisos (todos)
- **Admin:** 19/20 permisos (todos excepto admin.settings.manage)
- **User:** 8/20 permisos (operativos)
- **Guest:** 3/20 permisos (solo lectura)

**Nota:** El script maneja tanto migración desde tablas identity existentes como creación de datos de ejemplo si no existen.

---

#### 1.5 Implementar AuthenticationService básico ⏸️ PENDIENTE

**Script SQL a ejecutar:**
```sql
-- Ver sección 11.2 del documento principal
-- Copiar AspNetUsers → iam.users
-- Copiar UserCompanyMemberships → iam.tenant_memberships
```

**Prerequisito:** Completar 1.3

---

#### 1.5 Implementar AuthenticationService básico ⏸️ PENDIENTE

**Métodos:**
- LoginAsync()
- SelectContextAsync()
- LogoutAsync()
- ValidateCredentialsAsync()

**Prerequisito:** Completar 1.4

---

#### 1.6 Implementar TokenManagementService ⏸️ PENDIENTE

**Métodos:**
- GenerateAccessTokenAsync()
- GenerateRefreshTokenAsync()
- RefreshAccessTokenAsync()
- RevokeTokenAsync()
- ValidateTokenAsync()

**Prerequisito:** Completar 1.5

---

#### 1.7 Implementar AuthController ⏸️ PENDIENTE

**Endpoints:**
- POST /iam/v1/auth/login
- POST /iam/v1/auth/select-context
- POST /iam/v1/auth/logout

**Prerequisito:** Completar 1.6

---

#### 1.8 Implementar TokenController ⏸️ PENDIENTE

**Endpoints:**
- POST /iam/v1/tokens/refresh
- POST /iam/v1/tokens/revoke
- POST /iam/v1/tokens/introspect

**Prerequisito:** Completar 1.6

---

#### 1.9 Configurar Redis ⏸️ PENDIENTE

**Tareas:**
- Agregar configuración Redis en docker-compose.yml
- Configurar StackExchange.Redis
- Implementar RedisCacheService

**Prerequisito:** Completar 1.8

---

#### 1.10 Configurar NATS ⏸️ PENDIENTE

**Tareas:**
- Verificar NATS en docker-compose.yml
- Implementar NatsEventPublisher
- Publicar UserLoggedInEvent

**Prerequisito:** Completar 1.9

---

#### 1.11 Testing unitario ⏸️ PENDIENTE

**Tests a crear:**
- AuthenticationService tests
- TokenManagementService tests
- AuthorizationEngine tests

**Prerequisito:** Completar 1.10

---

#### 1.12 Testing de integración ⏸️ PENDIENTE

**Tests E2E:**
- Login flow completo
- Refresh token flow
- Logout flow

**Prerequisito:** Completar 1.11

---

## 📅 FASE 2: SEMANA 3 - SDK y Caching

### Tareas
- [ ] **2.1** Crear proyecto Farutech.IAM.Client
- [ ] **2.2** Implementar IamAuthenticationHandler
- [ ] **2.3** Implementar IamClient
- [ ] **2.4** Implementar PermissionsCacheManager
- [ ] **2.5** Implementar DynamicClaimsGenerator con caching
- [ ] **2.6** Testing de performance

---

## 📅 FASE 3: SEMANA 4 - Migración Orchestrator

### Tareas
- [ ] **3.1** Refactorizar AuthService en Orchestrator
- [ ] **3.2** Eliminar TokenService de Orchestrator
- [ ] **3.3** Actualizar Frontend (URLs + auto-refresh)
- [ ] **3.4** Actualizar AppHost.cs
- [ ] **3.5** Testing E2E

---

## 📅 FASE 4: SEMANA 5 - Migración PoC Ordeon

### Tareas
- [ ] **4.1** Instalar Farutech.IAM.Client en Ordeon
- [ ] **4.2** Reemplazar AddJwtBearer con AddFarutechIAM
- [ ] **4.3** Testing de validación
- [ ] **4.4** Benchmarking
- [ ] **4.5** Monitoreo

---

## 📅 FASE 5: SEMANA 6 - RBAC + ABAC Foundation

### Tareas
- [ ] **5.1** Implementar AuthorizationEngine
- [ ] **5.2** Implementar AbacPolicyEngine
- [ ] **5.3** Crear endpoints de autorización
- [ ] **5.4** Seed de permisos
- [ ] **5.5** Testing de autorización

---

## 🎯 KPIs de Validación MVP

### Funcionales
- [ ] Login con email/password funciona
- [ ] Selección de contexto multi-tenant funciona
- [ ] Access token expira en 15 min
- [ ] Refresh token funciona (30 días)
- [ ] Auto-refresh en frontend funciona
- [ ] Logout revoca tokens correctamente
- [ ] Apps validan tokens correctamente

### Performance
- [ ] Latencia P95 /auth/login < 300ms
- [ ] Latencia P95 /tokens/refresh < 100ms
- [ ] Validación JWT local < 5ms
- [ ] Cache hit rate > 90%

### Seguridad
- [ ] Passwords con BCrypt
- [ ] Tokens firmados con RS256
- [ ] Refresh tokens revocables
- [ ] Rate limiting activo

---

## 📊 Estado Actual3 - Implementar DbContext y Migrations  
**Progreso General:** 16.7% (2/12 tareas completadas)  
**Fecha Actualización:** 8 de Febrero, 2026 - 23:40 UTC
**Tarea Actual:** 1.1 - Crear estructura de proyecto IAM  
**Progreso General:** 0% (0/12 tareas completadas)  
**Fecha Actualización:** 8 de Febrero, 2026

---

## 🚨 Bloqueadores

Ninguno actualmente.

---

## 📝 Notas de Implementación

### Decisiones Técnicas
- **JWT Signing:** RS256 con claves RSA (más seguro que HS256)
- **Refresh Token Storage:** Redis (opaque tokens)
- **Event Bus:** NATS (ya existente en infraestructura)
- **Caching Strategy:** Multi-layer (In-Memory en apps + Redis en IAM)

### Cambios vs Plan Original
Ninguno hasta el momento.

---

## 📞 Contactos

- **Arquitecto:** Responsable de revisiones técnicas
- **Backend Lead:** Coordinación de implementación
- **DevOps:** Setup de Redis y configuración Aspire

---

**Última Actualización:** 8 de Febrero, 2026 - 00:00 UTC  
**Próxima Revisión:** Diaria (al final de cada día de trabajo)
