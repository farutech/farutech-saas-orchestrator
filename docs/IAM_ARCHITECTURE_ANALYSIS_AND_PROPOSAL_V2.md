# 🏗️ Arquitectura IAM Enterprise para Farutech SaaS Multi-Tenant
## Análisis, Propuesta y Plan de Implementación (v2.0)

**Fecha:** 8 de Febrero, 2026  
**Autor:** Arquitecto de Software Senior - IAM & SaaS Specialist  
**Versión:** 2.0 (Incorpora feedback técnico y plan de refactorización)

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Diagnóstico del Sistema Actual](#2-diagnóstico-del-sistema-actual)
3. [Hallazgos Críticos y Limitaciones](#3-hallazgos-críticos-y-limitaciones)
4. [Arquitectura IAM Propuesta (Mejorada)](#4-arquitectura-iam-propuesta-mejorada)
5. [Modelo de Datos IAM con ABAC](#5-modelo-de-datos-iam-con-abac)
6. [Diseño de Tokens y Claims Dinámicos](#6-diseño-de-tokens-y-claims-dinámicos)
7. [Flujos de Autenticación y Autorización](#7-flujos-de-autenticación-y-autorización)
8. [Performance: Caching y Optimización](#8-performance-caching-y-optimización)
9. [Event-Driven Architecture](#9-event-driven-architecture)
10. [Estructura del Proyecto IAM](#10-estructura-del-proyecto-iam)
11. [Plan de Refactorización del Código Actual](#11-plan-de-refactorización-del-código-actual)
12. [Estrategia de Migración MVP (6 semanas)](#12-estrategia-de-migración-mvp-6-semanas)
13. [Seguridad Adicional](#13-seguridad-adicional)
14. [Monitoreo y Observabilidad](#14-monitoreo-y-observabilidad)
15. [Roadmap de Implementación](#15-roadmap-de-implementación)

---

## 1. Resumen Ejecutivo

### 🎯 Situación Actual

El sistema Farutech SaaS Orchestrator cuenta con una **implementación funcional de autenticación** basada en ASP.NET Core Identity, integrada dentro del Core. Si bien cumple con los requisitos básicos de un sistema multi-tenant, presenta **acoplamientos arquitectónicos** que limitan:

- ✅ Escalabilidad horizontal
- ✅ Reutilización en otros sistemas
- ✅ Autorización granular por tenant/aplicación
- ✅ Integración con IdPs externos

### 💡 Propuesta de Valor (Actualizada v2.0)

Crear un **IAM Service desacoplado** que incorpore las mejores prácticas de:

1. **AWS Cognito / Auth0** - Arquitectura de tokens y APIs
2. **ABAC (Attribute-Based Access Control)** - Políticas dinámicas
3. **Event-Driven Architecture** - Desacople total
4. **Performance-First** - Caching estratégico con Redis
5. **Feature Flags** - Rollout gradual por tenant

### 📊 Estrategia Aprobada: **MVP Iterativo (6 semanas)**

```
Fase 1 MVP (6 semanas) → Core (8 semanas) → Enterprise (según demanda)
   ↓
- IAM Service básico
- Refresh tokens
- RBAC + ABAC foundation
- Redis caching
- Event bus básico
- Migración PoC (Ordeon)
```

---

## 2. Diagnóstico del Sistema Actual

### 2.1 Arquitectura Actual

```
┌─────────────────────────────────────────────────────────────┐
│                    FARUTECH CORE                            │
│          (src/01.Core/Farutech/Orchestrator/)               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ASP.NET Core Identity                               │  │
│  │  - UserManager<ApplicationUser>                      │  │
│  │  - SignInManager                                     │  │
│  │  - RoleManager                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌──────────────────────▼──────────────────────────────┐  │
│  │  Application/Services/AuthService.cs (811 líneas)   │  │
│  │  - LoginAsync()                                      │  │
│  │  - SelectContextAsync()                              │  │
│  │  - GetAvailableTenantsForUserAsync()                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌──────────────────────▼──────────────────────────────┐  │
│  │  Infrastructure/Auth/TokenService.cs (192 líneas)   │  │
│  │  - GenerateIntermediateToken()                       │  │
│  │  - GenerateAccessToken()                             │  │
│  │  - ValidateIntermediateToken()                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Database: PostgreSQL                                       │
│  ├─ identity.AspNetUsers                                    │
│  ├─ identity.AspNetRoles                                    │
│  ├─ identity.AspNetUserRoles                                │
│  ├─ identity.UserCompanyMemberships                         │
│  ├─ tenants.Customers                                       │
│  └─ tenants.TenantInstances                                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ JWT Bearer Token
                          ▼
┌─────────────────────────────────────────────────────────────┐
│          APLICACIONES (Ordeon, FaruPOS, etc.)               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  JwtBearer Authentication Middleware                 │  │
│  │  - Valida firma del token                            │  │
│  │  - Lee claims (sub, email, tenant_id, role)          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Componentes Clave Actuales

#### ApplicationUser (Domain/Entities/Identity/)
```csharp
public class ApplicationUser : IdentityUser<Guid>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    
    // Multi-tenancy
    public ICollection<UserCompanyMembership> CompanyMemberships { get; set; }
}
```

#### UserCompanyMembership (Many-to-Many)
```csharp
public class UserCompanyMembership
{
    public Guid UserId { get; set; }
    public Guid CustomerId { get; set; }
    public FarutechRole Role { get; set; } // Owner, InstanceAdmin, User, Guest
    public bool IsActive { get; set; }
}
```

#### FarutechRole (Simple Enum)
```csharp
public enum FarutechRole
{
    Owner,         // Full access
    InstanceAdmin, // Admin de instancia
    User,          // Usuario operativo
    Guest          // Solo lectura
}
```

#### Token Actual (Access Token)
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "given_name": "John",
  "family_name": "Doe",
  "tenant_id": "tenant-uuid",
  "company_name": "Acme Corp",
  "role": "Owner",
  "exp": 1738800000
}
```

### 2.3 Flujo de Autenticación Actual

**Caso Multi-Tenant con Selección:**
```
1. POST /api/auth/login { email, password }
   └─> AuthService.LoginAsync()
       └─> UserManager.CheckPasswordAsync()
       └─> GetAvailableTenantsForUserAsync()
       └─> Si tiene > 1 tenant:
           └─> TokenService.GenerateIntermediateToken()
           └─> Return { requiresContextSelection: true, intermediateToken, tenants }

2. Usuario selecciona tenant en UI

3. POST /api/auth/select-context { intermediateToken, tenantId }
   └─> AuthService.SelectContextAsync()
       └─> TokenService.ValidateIntermediateToken()
       └─> Verifica tenantId en allowed_tenant claims
       └─> TokenService.GenerateAccessToken()
       └─> Return { accessToken, tenantInfo }
```

---

## 3. Hallazgos Críticos y Limitaciones

### 3.1 Problemas Arquitectónicos (Priorizados)

| # | Problema | Impacto | Severidad | ROI Fix |
|---|----------|---------|-----------|---------|
| **1** | **No hay refresh tokens** | Usuarios deben re-login cada 30 min (mala UX) | 🔴 Alta | **Alto** |
| **2** | **Autenticación acoplada al Core** | Imposible reutilizar en otros sistemas | 🔴 Alta | **Alto** |
| **3** | **Claims estáticos** | No se pueden agregar permisos dinámicos sin redeploy | 🟡 Media | **Medio** |
| **4** | **Roles simples (Enum)** | No soporta permisos granulares por tenant/app | 🟡 Media | **Medio** |
| **5** | **No hay caching de permisos** | JOINs pesados en cada request | 🟠 Media-Alta | **Alto** |
| **6** | **No hay auditoría centralizada** | No se registran eventos de seguridad | 🟡 Media | **Bajo** |
| **7** | **No hay gestión de sesiones** | No se pueden invalidar tokens (logout forzado) | 🟠 Media-Alta | **Medio** |
| **8** | **No hay federación de identidad** | No integra con OAuth2/SAML | 🟠 Media-Alta | **Bajo** |
| **9** | **No hay MFA** | No cumple compliance enterprise | 🟡 Media | **Bajo** |

**Prioridad de Solución (por ROI):**
1. ✅ Refresh tokens (Fase 1 MVP)
2. ✅ IAM desacoplado (Fase 1 MVP)
3. ✅ Caching de permisos (Fase 1 MVP)
4. ✅ RBAC + ABAC básico (Fase 1 MVP)
5. ⏳ Claims dinámicos (Fase 2)
6. ⏳ Gestión de sesiones (Fase 2)
7. ⏳ Auditoría completa (Fase 2)
8. 🔜 OAuth2/SAML (Fase 3 - bajo demanda)
9. 🔜 MFA (Fase 3 - bajo demanda)

---

## 4. Arquitectura IAM Propuesta (Mejorada)

### 4.1 Visión General

```
┌─────────────────────────────────────────────────────────────────────┐
│              FARUTECH IAM SERVICE (Desacoplado)                     │
│          Ubicación: src/01.Core/Farutech/IAM/                       │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Authentication Module                                      │  │
│  │  ├─ Native Login (email/password)                           │  │
│  │  ├─ OAuth2/OpenID Connect (futuro)                          │  │
│  │  ├─ SAML 2.0 (futuro)                                       │  │
│  │  └─ MFA (futuro)                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│  ┌──────────────────────────▼──────────────────────────────────┐  │
│  │  Token Management                                            │  │
│  │  ├─ Access Token (JWT, 15 min, RS256)                       │  │
│  │  ├─ Refresh Token (Opaque, 30 days, Redis)                  │  │
│  │  ├─ Token Revocation (Blacklist)                            │  │
│  │  ├─ Token Introspection API                                 │  │
│  │  └─ Token Rotation (auto-renewal)                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│  ┌──────────────────────────▼──────────────────────────────────┐  │
│  │  Authorization Engine (RBAC + ABAC)                          │  │
│  │  ├─ Role-Based Access Control                               │  │
│  │  ├─ Attribute-Based Policies                                │  │
│  │  ├─ Permission Evaluation                                   │  │
│  │  ├─ Dynamic Claims Generation                               │  │
│  │  └─ Redis Caching (15 min TTL)                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│  ┌──────────────────────────▼──────────────────────────────────┐  │
│  │  Event Bus (NATS)                                            │  │
│  │  ├─ UserLoggedIn                                             │  │
│  │  ├─ PermissionChanged                                        │  │
│  │  ├─ TenantCreated                                            │  │
│  │  └─ SessionExpired                                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Database: iam.* schema                                            │
│  Cache: Redis (permissions, tokens, sessions)                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API + gRPC
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ ORCHESTRATOR    │  │  ORDEON API     │  │  FARUPOS API    │
│                 │  │                 │  │                 │
│  ┌───────────┐  │  │  ┌───────────┐  │  │  ┌───────────┐  │
│  │ IAM SDK   │  │  │  │ IAM SDK   │  │  │  │ IAM SDK   │  │
│  │ - Validate│  │  │  │ - Validate│  │  │  │ - Validate│  │
│  │ - Cache   │  │  │  │ - Cache   │  │  │  │ - Cache   │  │
│  │ - Extract │  │  │  │ - Extract │  │  │  │ - Extract │  │
│  └───────────┘  │  │  └───────────┘  │  │  └───────────┘  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 4.2 Componentes del IAM Service

#### 4.2.1 Authentication Module

**Responsabilidades:**
- ✅ Validar credenciales de usuarios
- ✅ Gestionar sesiones
- ✅ Emitir tokens

**APIs (Fase 1 MVP):**
```http
POST   /iam/v1/auth/login           # Login nativo
POST   /iam/v1/auth/select-context  # Seleccionar tenant
POST   /iam/v1/auth/logout          # Logout (revoke tokens)
POST   /iam/v1/auth/refresh         # Refresh access token
```

#### 4.2.2 Token Management

**Tipos de Tokens:**

1. **Access Token** (JWT, 15 min, RS256)
   - Verificable localmente por las apps
   - Contiene claims completos

2. **Refresh Token** (Opaque, 30 días, Redis)
   - Token opaco almacenado en Redis
   - Revocable en tiempo real

**APIs (Fase 1 MVP):**
```http
POST   /iam/v1/tokens/refresh       # Refresh access token
POST   /iam/v1/tokens/revoke        # Revoke token
POST   /iam/v1/tokens/introspect    # Validate token (para apps sin JWT)
```

#### 4.2.3 Authorization Engine (RBAC + ABAC)

**Responsabilidades:**
- ✅ Evaluar permisos en tiempo real
- ✅ Generar claims dinámicos
- ✅ Cachear permisos (Redis, 15 min)

**APIs (Fase 1 MVP):**
```http
GET    /iam/v1/authorize/permissions/{userId}/{tenantId}  # Get cached permissions
POST   /iam/v1/authorize/check                            # Check permission
POST   /iam/v1/authorize/evaluate                         # Evaluate ABAC policy
```

#### 4.2.4 Event Bus

**Eventos Publicados (Fase 1 MVP):**
```csharp
public interface IIamEventPublisher
{
    Task PublishUserLoggedInAsync(UserLoggedInEvent @event);
    Task PublishPermissionChangedAsync(PermissionChangedEvent @event);
    Task PublishTokenRefreshedAsync(TokenRefreshedEvent @event);
}
```

**Suscriptores:**
- Analytics Service: Registra eventos de login
- Orchestrator: Actualiza last_login_at
- Apps: Invalidan caché local de permisos

---

## 5. Modelo de Datos IAM con ABAC

### 5.1 Esquema Completo (PostgreSQL)

```sql
-- ============================================================================
-- IAM SCHEMA - Identity & Access Management
-- ============================================================================

-- Users: Fuente única de identidad
CREATE TABLE iam.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(256) NOT NULL UNIQUE,
    email_confirmed BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(512),
    phone_number VARCHAR(20),
    phone_number_confirmed BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(256),
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_picture_url VARCHAR(512),
    locale VARCHAR(10) DEFAULT 'es-PE',
    timezone VARCHAR(50) DEFAULT 'America/Lima',
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    
    -- External IdP (futuro)
    external_provider VARCHAR(50),
    external_user_id VARCHAR(256),
    
    CONSTRAINT unique_external_identity UNIQUE (external_provider, external_user_id)
);

CREATE INDEX idx_users_email ON iam.users(email);
CREATE INDEX idx_users_is_active ON iam.users(is_active) WHERE is_active = true;

-- Tenants: Organizaciones/Empresas
CREATE TABLE iam.tenants (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(50),
    
    -- Security Settings
    require_mfa BOOLEAN DEFAULT FALSE,
    allowed_ip_ranges JSONB,
    session_timeout_minutes INT DEFAULT 30,
    password_policy JSONB,
    
    -- Feature Flags
    feature_flags JSONB DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tenants_code ON iam.tenants(code);

-- TenantMemberships: Users <-> Tenants con roles
CREATE TABLE iam.tenant_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES iam.tenants(id) ON DELETE CASCADE,
    
    role_id UUID REFERENCES iam.roles(id),
    custom_attributes JSONB DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMP DEFAULT NOW(),
    granted_by UUID REFERENCES iam.users(id),
    expires_at TIMESTAMP,
    
    CONSTRAINT unique_user_tenant UNIQUE (user_id, tenant_id)
);

CREATE INDEX idx_memberships_user ON iam.tenant_memberships(user_id);
CREATE INDEX idx_memberships_tenant ON iam.tenant_memberships(tenant_id);
CREATE INDEX idx_memberships_active ON iam.tenant_memberships(is_active) WHERE is_active = true;

-- Roles: RBAC (globales + tenant-specific)
CREATE TABLE iam.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    normalized_name VARCHAR(100) NOT NULL,
    description TEXT,
    
    tenant_id UUID REFERENCES iam.tenants(id), -- NULL = rol global
    application_id UUID, -- NULL = todas las apps
    
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_role_name_tenant UNIQUE (normalized_name, tenant_id, application_id)
);

CREATE INDEX idx_roles_tenant ON iam.roles(tenant_id);
CREATE INDEX idx_roles_system ON iam.roles(is_system_role) WHERE is_system_role = true;

-- Permissions: Permisos atómicos
CREATE TABLE iam.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    application_id UUID,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_permissions_code ON iam.permissions(code);
CREATE INDEX idx_permissions_category ON iam.permissions(category);

-- RolePermissions: RBAC mapping
CREATE TABLE iam.role_permissions (
    role_id UUID NOT NULL REFERENCES iam.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES iam.permissions(id) ON DELETE CASCADE,
    
    PRIMARY KEY (role_id, permission_id)
);

-- PolicyRules: ABAC (Attribute-Based Access Control)
CREATE TABLE iam.policy_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES iam.tenants(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Condición JSON (ej: {"resource.type": "invoice", "resource.amount": {"$lt": 10000}})
    condition JSONB NOT NULL,
    
    -- Permisos otorgados si se cumple la condición
    permissions TEXT[] NOT NULL,
    
    -- Prioridad (mayor = evaluar primero)
    priority INT DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_policy_rules_tenant ON iam.policy_rules(tenant_id);
CREATE INDEX idx_policy_rules_active ON iam.policy_rules(is_active) WHERE is_active = true;

-- UserClaims: Claims dinámicos por usuario y tenant
CREATE TABLE iam.user_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES iam.tenants(id) ON DELETE CASCADE,
    
    claim_type VARCHAR(100) NOT NULL,
    claim_value TEXT NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_user_claim UNIQUE (user_id, tenant_id, claim_type)
);

CREATE INDEX idx_user_claims_user_tenant ON iam.user_claims(user_id, tenant_id);

-- RefreshTokens: Opaque tokens (Redis-backed)
CREATE TABLE iam.refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(512) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES iam.tenants(id),
    
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    replaced_by_token VARCHAR(512),
    
    -- Device tracking
    device_id VARCHAR(256),
    user_agent TEXT,
    ip_address VARCHAR(45),
    
    CONSTRAINT check_not_expired CHECK (expires_at > created_at)
);

CREATE INDEX idx_refresh_tokens_token ON iam.refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user ON iam.refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON iam.refresh_tokens(expires_at);

-- AuditLogs: Registro de eventos de seguridad
CREATE TABLE iam.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES iam.users(id),
    tenant_id UUID REFERENCES iam.tenants(id),
    
    event VARCHAR(50) NOT NULL,
    result VARCHAR(20) NOT NULL,
    details JSONB,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user_time ON iam.audit_logs(user_id, timestamp DESC);
CREATE INDEX idx_audit_tenant_time ON iam.audit_logs(tenant_id, timestamp DESC);
CREATE INDEX idx_audit_event ON iam.audit_logs(event);

-- Sessions: Gestión de sesiones activas
CREATE TABLE iam.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES iam.tenants(id),
    
    session_token VARCHAR(512) NOT NULL UNIQUE,
    refresh_token_id UUID REFERENCES iam.refresh_tokens(id),
    
    device_id VARCHAR(256),
    device_name VARCHAR(200),
    user_agent TEXT,
    ip_address VARCHAR(45),
    
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    
    CONSTRAINT check_session_not_expired CHECK (expires_at > created_at)
);

CREATE INDEX idx_sessions_user ON iam.sessions(user_id);
CREATE INDEX idx_sessions_token ON iam.sessions(session_token);
CREATE INDEX idx_sessions_expires ON iam.sessions(expires_at);
```

### 5.2 Seeding de Datos Iniciales

```sql
-- Roles Globales del Sistema (compatibles con FarutechRole actual)
INSERT INTO iam.roles (id, name, normalized_name, is_system_role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'System Admin', 'SYSTEM_ADMIN', true),
    ('22222222-2222-2222-2222-222222222222', 'Tenant Owner', 'TENANT_OWNER', true),
    ('33333333-3333-3333-3333-333333333333', 'Tenant Admin', 'TENANT_ADMIN', true),
    ('44444444-4444-4444-4444-444444444444', 'User', 'USER', true),
    ('55555555-5555-5555-5555-555555555555', 'Guest', 'GUEST', true);

-- Permisos Básicos (Catalog, Sales, Tenant Management)
INSERT INTO iam.permissions (code, name, category) VALUES
    -- Catalog
    ('catalog.products.read', 'Read Products', 'catalog'),
    ('catalog.products.create', 'Create Products', 'catalog'),
    ('catalog.products.update', 'Update Products', 'catalog'),
    ('catalog.products.delete', 'Delete Products', 'catalog'),
    
    -- Sales
    ('sales.orders.read', 'Read Orders', 'sales'),
    ('sales.orders.create', 'Create Orders', 'sales'),
    ('sales.orders.cancel', 'Cancel Orders', 'sales'),
    ('sales.invoices.approve', 'Approve Invoices', 'sales'),
    
    -- Tenant Management
    ('tenant.members.read', 'Read Members', 'tenant'),
    ('tenant.members.invite', 'Invite Members', 'tenant'),
    ('tenant.members.remove', 'Remove Members', 'tenant'),
    ('tenant.settings.update', 'Update Tenant Settings', 'tenant');

-- Asignación de permisos a roles (RBAC)
-- Owner: Full access
INSERT INTO iam.role_permissions (role_id, permission_id)
SELECT '22222222-2222-2222-2222-222222222222', id FROM iam.permissions;

-- Admin: Todo excepto gestión de miembros
INSERT INTO iam.role_permissions (role_id, permission_id)
SELECT '33333333-3333-3333-3333-333333333333', id 
FROM iam.permissions 
WHERE category IN ('catalog', 'sales');

-- User: Solo lectura y creación básica
INSERT INTO iam.role_permissions (role_id, permission_id)
SELECT '44444444-4444-4444-4444-444444444444', id 
FROM iam.permissions 
WHERE code IN ('catalog.products.read', 'sales.orders.read', 'sales.orders.create');

-- Ejemplo de Política ABAC: "Aprobar facturas < $10,000 si eres supervisor"
INSERT INTO iam.policy_rules (name, description, condition, permissions, priority) VALUES
(
    'Approve Low Value Invoices',
    'Supervisors can approve invoices below $10,000',
    '{
        "user.department": "sales",
        "user.position": "supervisor",
        "resource.type": "invoice",
        "resource.amount": {"$lt": 10000}
    }',
    ARRAY['sales.invoices.approve'],
    10
);
```

### 5.3 Ejemplo de Evaluación ABAC

```csharp
public class AbacPolicyEngine
{
    public async Task<bool> EvaluatePolicyAsync(
        Guid userId, 
        Guid tenantId, 
        string permission,
        Dictionary<string, object> context)
    {
        // 1. Obtener claims del usuario
        var userClaims = await GetUserClaimsAsync(userId, tenantId);
        
        // 2. Obtener políticas activas del tenant
        var policies = await GetActivePoliciesAsync(tenantId);
        
        // 3. Evaluar cada política
        foreach (var policy in policies.OrderByDescending(p => p.Priority))
        {
            if (policy.Permissions.Contains(permission))
            {
                var conditionMet = EvaluateCondition(
                    policy.Condition, 
                    userClaims, 
                    context);
                
                if (conditionMet)
                {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    private bool EvaluateCondition(
        JObject condition, 
        Dictionary<string, string> userClaims, 
        Dictionary<string, object> context)
    {
        // Evaluar condiciones JSON
        // Ejemplo: {"resource.amount": {"$lt": 10000}}
        foreach (var prop in condition.Properties())
        {
            var key = prop.Name;
            var value = prop.Value;
            
            if (key.StartsWith("user."))
            {
                var claimName = key.Substring(5);
                if (!userClaims.TryGetValue(claimName, out var claimValue))
                    return false;
                    
                if (!CompareValues(claimValue, value))
                    return false;
            }
            else if (key.StartsWith("resource."))
            {
                var resourceKey = key.Substring(9);
                if (!context.TryGetValue(resourceKey, out var resourceValue))
                    return false;
                    
                if (!CompareValues(resourceValue, value))
                    return false;
            }
        }
        
        return true;
    }
}
```

---

## 6. Diseño de Tokens y Claims Dinámicos

### 6.1 Access Token Mejorado (JWT con RS256)

```json
{
  "header": {
    "alg": "RS256",  // ← RSA en lugar de HS256
    "typ": "JWT",
    "kid": "iam-key-20260208"
  },
  "payload": {
    // Standard JWT Claims (RFC 7519)
    "iss": "https://iam.farutech.com",
    "sub": "user-uuid",
    "aud": ["orchestrator-api", "ordeon-api", "farupos-api"],
    "exp": 1738800900,  // 15 minutos
    "iat": 1738800000,
    "jti": "token-unique-id",
    "nbf": 1738800000,
    
    // User Claims
    "email": "user@example.com",
    "email_verified": true,
    "given_name": "John",
    "family_name": "Doe",
    "locale": "es-PE",
    
    // Tenant Context
    "tenant_id": "tenant-uuid",
    "tenant_code": "FARU6128",
    "tenant_name": "Acme Corp",
    
    // Instance Context (para URL-based tenancy)
    "instance_id": "instance-uuid",
    "instance_code": "8b571b69",
    "instance_type": "FARUPOS",
    
    // Authorization (RBAC + permisos efectivos)
    "role": "Tenant Admin",  // ← Compatibilidad con sistema actual
    "permissions": [
      "catalog.products.read",
      "catalog.products.create",
      "sales.orders.read",
      "sales.orders.create"
    ],
    
    // Dynamic Claims (tenant-specific, de iam.user_claims)
    "claims": {
      "department": "Sales",
      "cost_center": "CC-001",
      "region": "Lima",
      "store_id": "store-123",
      "supervisor_id": "user-uuid-supervisor"
    },
    
    // Session
    "session_id": "session-uuid",
    "device_id": "device-fingerprint",
    
    // Security
    "token_type": "access",
    "scope": "read write"
  }
}
```

**Cambios vs Token Actual:**
- ✅ RS256 en lugar de HS256 (más seguro)
- ✅ `permissions` array (RBAC efectivo)
- ✅ `claims` dinámicos por tenant
- ✅ `session_id` para gestión de sesiones
- ✅ TTL reducido a 15 min (era 30-48h)

### 6.2 Refresh Token (Opaque)

**No es JWT, es un token opaco en Redis:**

```
Token: "RT_8f7e6d5c4b3a2918f7e6d5c4b3a29187f7e6d5c4b3a2918"
```

**Metadata en Redis (TTL 30 días):**
```json
{
  "user_id": "user-uuid",
  "tenant_id": "tenant-uuid",
  "session_id": "session-uuid",
  "device_id": "device-fingerprint",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "issued_at": 1738800000,
  "expires_at": 1741392000,
  "last_used_at": 1738800000,
  "revoked": false,
  "rotation_count": 0
}
```

**Ventajas:**
- ✅ Revocable en tiempo real (DELETE key de Redis)
- ✅ No expone información en el token
- ✅ Rotación automática en cada uso

### 6.3 Generación de Claims Dinámicos

```csharp
public class DynamicClaimsGenerator
{
    private readonly IUserClaimsRepository _claimsRepo;
    private readonly IAuthorizationEngine _authzEngine;
    private readonly IDistributedCache _cache;
    
    public async Task<Dictionary<string, object>> GenerateClaimsAsync(
        Guid userId, 
        Guid tenantId, 
        Guid? instanceId = null)
    {
        var cacheKey = $"claims:{userId}:{tenantId}";
        
        // 1. Intentar obtener del caché (15 min TTL)
        var cachedClaims = await _cache.GetStringAsync(cacheKey);
        if (cachedClaims != null)
        {
            return JsonSerializer.Deserialize<Dictionary<string, object>>(cachedClaims);
        }
        
        var claims = new Dictionary<string, object>();
        
        // 2. Claims del usuario (iam.user_claims)
        var userClaims = await _claimsRepo.GetUserClaimsAsync(userId, tenantId);
        foreach (var claim in userClaims)
        {
            claims[claim.ClaimType] = claim.ClaimValue;
        }
        
        // 3. Permisos efectivos (RBAC + ABAC)
        var permissions = await _authzEngine.GetEffectivePermissionsAsync(
            userId, tenantId, instanceId);
        claims["permissions"] = permissions.Select(p => p.Code).ToArray();
        
        // 4. Instance metadata (si aplica)
        if (instanceId.HasValue)
        {
            var instance = await _instanceRepo.GetByIdAsync(instanceId.Value);
            claims["instance_code"] = instance.Code;
            claims["instance_type"] = instance.ApplicationType.ToString();
        }
        
        // 5. Feature flags del tenant
        var tenant = await _tenantRepo.GetByIdAsync(tenantId);
        if (tenant.FeatureFlags != null)
        {
            claims["features"] = tenant.FeatureFlags;
        }
        
        // 6. Cachear resultado (15 min)
        await _cache.SetStringAsync(
            cacheKey, 
            JsonSerializer.Serialize(claims),
            new DistributedCacheEntryOptions 
            { 
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15) 
            });
        
        return claims;
    }
}
```

### 6.4 Token Introspection API

**Para apps que no pueden procesar JWT:**

```http
POST /iam/v1/tokens/introspect
Content-Type: application/json

{
  "token": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response:**
```json
{
  "active": true,
  "sub": "user-uuid",
  "email": "user@example.com",
  "tenant_id": "tenant-uuid",
  "tenant_code": "FARU6128",
  "role": "Tenant Admin",
  "permissions": ["catalog.products.read", "sales.orders.create"],
  "exp": 1738800900,
  "iat": 1738800000
}
```

---

## 7. Flujos de Autenticación y Autorización

### 7.1 Flujo 1: Login con Refresh Token

```
┌─────────┐         ┌─────────┐         ┌──────────┐         ┌───────┐
│ Frontend│         │ IAM API │         │ IAM DB   │         │ Redis │
└────┬────┘         └────┬────┘         └────┬─────┘         └───┬───┘
     │                   │                   │                   │
     │ POST /auth/login  │                   │                   │
     ├──────────────────>│                   │                   │
     │                   │ Validate creds    │                   │
     │                   ├──────────────────>│                   │
     │                   │                   │                   │
     │                   │ User + Memberships│                   │
     │                   │<──────────────────┤                   │
     │                   │                   │                   │
     │                   │ Get permissions   │                   │
     │                   ├──────────────────>│                   │
     │                   │                   │                   │
     │                   │ Generate Claims   │                   │
     │                   │<──────────────────┤                   │
     │                   │                   │                   │
     │                   │ Generate Access Token (JWT, 15 min)   │
     │                   │                   │                   │
     │                   │ Generate Refresh Token (opaque)       │
     │                   │                   │                   │
     │                   │ Store refresh token                   │
     │                   ├──────────────────────────────────────>│
     │                   │                   │                   │
     │                   │ Cache claims      │                   │
     │                   ├──────────────────────────────────────>│
     │                   │                   │                   │
     │                   │ Publish UserLoggedInEvent (NATS)      │
     │                   │                   │                   │
     │ Response          │                   │                   │
     │ { accessToken,    │                   │                   │
     │   refreshToken,   │                   │                   │
     │   expiresIn: 900 }│                   │                   │
     │<──────────────────┤                   │                   │
```

### 7.2 Flujo 2: Refresh Token (Auto-Rotation)

```
┌─────────┐         ┌─────────┐         ┌───────┐
│ Frontend│         │ IAM API │         │ Redis │
└────┬────┘         └────┬────┘         └───┬───┘
     │                   │                   │
     │ Access Token      │                   │
     │ Expired           │                   │
     │                   │                   │
     │ POST /tokens/     │                   │
     │ refresh           │                   │
     │ { refreshToken }  │                   │
     ├──────────────────>│                   │
     │                   │ Lookup token      │
     │                   ├──────────────────>│
     │                   │                   │
     │                   │ Token metadata    │
     │                   │<──────────────────┤
     │                   │                   │
     │                   │ Validate:         │
     │                   │ - Not expired     │
     │                   │ - Not revoked     │
     │                   │ - User active     │
     │                   │                   │
     │                   │ Generate new      │
     │                   │ Access Token      │
     │                   │                   │
     │                   │ Rotate Refresh    │
     │                   │ Token (new token) │
     │                   ├──────────────────>│
     │                   │                   │
     │                   │ Revoke old token  │
     │                   ├──────────────────>│
     │                   │                   │
     │                   │ Publish Event     │
     │                   │                   │
     │ Response          │                   │
     │ { accessToken,    │                   │
     │   refreshToken }  │                   │
     │<──────────────────┤                   │
```

### 7.3 Flujo 3: Permission Check con ABAC

```csharp
// En Ordeon API
[HttpPost("invoices")]
public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceRequest request)
{
    var userId = User.FindFirst("sub")?.Value;
    var tenantId = User.FindFirst("tenant_id")?.Value;
    
    // Opción 1: Verificar permiso en token (local, rápido)
    var permissions = User.FindFirst("permissions")?.Value;
    if (!permissions.Contains("sales.invoices.create"))
    {
        return Forbid();
    }
    
    // Opción 2: Verificar con ABAC (llamada al IAM si se necesita contexto)
    if (request.TotalAmount > 10000)
    {
        var hasPermission = await _iamClient.CheckPermissionAsync(
            userId: userId,
            tenantId: tenantId,
            permission: "sales.invoices.approve",
            context: new { amount = request.TotalAmount, currency = "PEN" }
        );
        
        if (!hasPermission)
        {
            return Forbid("Requires approval for invoices > $10,000");
        }
    }
    
    // Lógica de negocio...
    return Ok(invoice);
}
```

---

## 8. Performance: Caching y Optimización

### 8.1 Estrategia de Caching Multi-Layer

```
┌────────────────────────────────────────────────────────┐
│                   CACHING LAYERS                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Layer 1: In-Memory Cache (apps)                      │
│  ├─ Public Key Cache (JWT validation)                 │
│  │  TTL: 1 hour                                       │
│  │  Invalida: Key rotation event                      │
│  └─ User permissions (extracted from JWT)             │
│     TTL: JWT expiration (15 min)                      │
│                                                        │
│  Layer 2: Redis Distributed Cache (IAM Service)       │
│  ├─ User Permissions Cache                            │
│  │  Key: permissions:{userId}:{tenantId}              │
│  │  TTL: 15 minutes                                   │
│  │  Invalida: PermissionChangedEvent                  │
│  │                                                     │
│  ├─ User Claims Cache                                 │
│  │  Key: claims:{userId}:{tenantId}                   │
│  │  TTL: 15 minutes                                   │
│  │  Invalida: ClaimChangedEvent                       │
│  │                                                     │
│  ├─ Tenant Config Cache                               │
│  │  Key: tenant:{tenantId}                            │
│  │  TTL: 1 hour                                       │
│  │  Invalida: TenantUpdatedEvent                      │
│  │                                                     │
│  └─ Refresh Tokens                                    │
│     Key: rt:{tokenHash}                               │
│     TTL: 30 days                                      │
│                                                        │
│  Layer 3: PostgreSQL (source of truth)                │
│  ├─ Users, Tenants, Roles, Permissions                │
│  └─ Audit Logs                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 8.2 Implementación de Caching

```csharp
public class CachedAuthorizationEngine : IAuthorizationEngine
{
    private readonly IDistributedCache _cache;
    private readonly IAuthorizationRepository _repository;
    private readonly IEventPublisher _eventPublisher;
    
    public async Task<IEnumerable<Permission>> GetEffectivePermissionsAsync(
        Guid userId, 
        Guid tenantId, 
        Guid? instanceId = null)
    {
        var cacheKey = $"permissions:{userId}:{tenantId}:{instanceId}";
        
        // 1. Intentar obtener del caché
        var cachedPermissions = await _cache.GetStringAsync(cacheKey);
        if (cachedPermissions != null)
        {
            return JsonSerializer.Deserialize<IEnumerable<Permission>>(cachedPermissions);
        }
        
        // 2. Obtener de la base de datos
        var permissions = await _repository.GetEffectivePermissionsAsync(
            userId, tenantId, instanceId);
        
        // 3. Cachear resultado (15 min)
        await _cache.SetStringAsync(
            cacheKey,
            JsonSerializer.Serialize(permissions),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
            });
        
        return permissions;
    }
    
    // Invalidar caché cuando cambian los permisos
    public async Task InvalidatePermissionsCacheAsync(Guid userId, Guid tenantId)
    {
        var cacheKey = $"permissions:{userId}:{tenantId}:*";
        await _cache.RemoveAsync(cacheKey);
        
        // Publicar evento para que otras instancias invaliden su caché
        await _eventPublisher.PublishAsync(new PermissionChangedEvent
        {
            UserId = userId,
            TenantId = tenantId,
            Timestamp = DateTime.UtcNow
        });
    }
}
```

### 8.3 Optimización de Queries

**Problema:** JOINs complejos para obtener permisos efectivos

```sql
-- ❌ Lento: JOIN múltiples tablas en cada request
SELECT DISTINCT p.code
FROM iam.users u
JOIN iam.tenant_memberships tm ON u.id = tm.user_id
JOIN iam.roles r ON tm.role_id = r.id
JOIN iam.role_permissions rp ON r.id = rp.role_id
JOIN iam.permissions p ON rp.permission_id = p.id
WHERE u.id = ? AND tm.tenant_id = ? AND tm.is_active = true;
```

**Solución:** Materialized View + Cache

```sql
-- ✅ Rápido: Materialized view pre-calculada
CREATE MATERIALIZED VIEW iam.user_permissions_materialized AS
SELECT 
    tm.user_id,
    tm.tenant_id,
    p.code AS permission_code,
    p.name AS permission_name
FROM iam.tenant_memberships tm
JOIN iam.roles r ON tm.role_id = r.id
JOIN iam.role_permissions rp ON r.id = rp.role_id
JOIN iam.permissions p ON rp.permission_id = p.id
WHERE tm.is_active = true;

CREATE UNIQUE INDEX idx_user_perm_mat ON iam.user_permissions_materialized(user_id, tenant_id, permission_code);

-- Refresh cada 5 minutos (en background)
REFRESH MATERIALIZED VIEW CONCURRENTLY iam.user_permissions_materialized;
```

```csharp
// Query simple y rápida
public async Task<IEnumerable<Permission>> GetEffectivePermissionsAsync(
    Guid userId, Guid tenantId)
{
    return await _dbContext.UserPermissionsMaterialized
        .Where(up => up.UserId == userId && up.TenantId == tenantId)
        .ToListAsync();
}
```

---

## 9. Event-Driven Architecture

### 9.1 Eventos del IAM

```csharp
// Domain Events
public record UserLoggedInEvent
{
    public Guid UserId { get; init; }
    public Guid TenantId { get; init; }
    public string IpAddress { get; init; }
    public string UserAgent { get; init; }
    public DateTime Timestamp { get; init; }
}

public record PermissionChangedEvent
{
    public Guid UserId { get; init; }
    public Guid TenantId { get; init; }
    public string[] AddedPermissions { get; init; }
    public string[] RemovedPermissions { get; init; }
    public DateTime Timestamp { get; init; }
}

public record TokenRefreshedEvent
{
    public Guid UserId { get; init; }
    public Guid SessionId { get; init; }
    public DateTime Timestamp { get; init; }
}

public record SessionExpiredEvent
{
    public Guid UserId { get; init; }
    public Guid SessionId { get; init; }
    public string Reason { get; init; }
    public DateTime Timestamp { get; init; }
}

public record TenantCreatedEvent
{
    public Guid TenantId { get; init; }
    public string TenantCode { get; init; }
    public string TenantName { get; init; }
    public DateTime Timestamp { get; init; }
}
```

### 9.2 Event Publisher (NATS)

```csharp
public interface IIamEventPublisher
{
    Task PublishAsync<TEvent>(TEvent @event, CancellationToken ct = default) 
        where TEvent : class;
}

public class NatsEventPublisher : IIamEventPublisher
{
    private readonly IConnection _natsConnection;
    private readonly ILogger<NatsEventPublisher> _logger;
    
    public async Task PublishAsync<TEvent>(TEvent @event, CancellationToken ct = default) 
        where TEvent : class
    {
        var subject = $"iam.{typeof(TEvent).Name.ToLower()}";
        var payload = JsonSerializer.SerializeToUtf8Bytes(@event);
        
        await _natsConnection.PublishAsync(subject, payload, cancellationToken: ct);
        
        _logger.LogInformation(
            "Published event {EventType} to subject {Subject}", 
            typeof(TEvent).Name, 
            subject);
    }
}
```

### 9.3 Event Subscribers

**Orchestrator Service:**
```csharp
public class UserLoggedInEventHandler : IConsumer<UserLoggedInEvent>
{
    private readonly IUserRepository _userRepository;
    
    public async Task ConsumeAsync(UserLoggedInEvent @event)
    {
        // Actualizar last_login_at
        await _userRepository.UpdateLastLoginAsync(@event.UserId, @event.Timestamp);
    }
}
```

**Analytics Service:**
```csharp
public class UserLoggedInEventHandler : IConsumer<UserLoggedInEvent>
{
    private readonly IAnalyticsRepository _analyticsRepo;
    
    public async Task ConsumeAsync(UserLoggedInEvent @event)
    {
        // Registrar evento en analytics
        await _analyticsRepo.RecordLoginEventAsync(
            userId: @event.UserId,
            tenantId: @event.TenantId,
            ipAddress: @event.IpAddress,
            timestamp: @event.Timestamp);
    }
}
```

**Apps (Ordeon, FaruPOS):**
```csharp
public class PermissionChangedEventHandler : IConsumer<PermissionChangedEvent>
{
    private readonly IMemoryCache _cache;
    
    public async Task ConsumeAsync(PermissionChangedEvent @event)
    {
        // Invalidar caché local de permisos
        var cacheKey = $"permissions:{@event.UserId}:{@event.TenantId}";
        _cache.Remove(cacheKey);
    }
}
```

---

## 10. Estructura del Proyecto IAM

### 10.1 Ubicación en el Repositorio

```
C:\Users\farid\farutech-saas-orchestrator\
└── src\
    └── 01.Core\
        └── Farutech\
            ├── IAM\                                    ← NUEVO PROYECTO
            │   ├── Farutech.IAM.sln
            │   ├── Domain\
            │   │   ├── Entities\
            │   │   │   ├── User.cs
            │   │   │   ├── Tenant.cs
            │   │   │   ├── TenantMembership.cs
            │   │   │   ├── Role.cs
            │   │   │   ├── Permission.cs
            │   │   │   ├── PolicyRule.cs
            │   │   │   ├── UserClaim.cs
            │   │   │   ├── RefreshToken.cs
            │   │   │   ├── Session.cs
            │   │   │   └── AuditLog.cs
            │   │   ├── Events\
            │   │   │   ├── UserLoggedInEvent.cs
            │   │   │   ├── PermissionChangedEvent.cs
            │   │   │   └── TokenRefreshedEvent.cs
            │   │   └── ValueObjects\
            │   │       ├── PasswordHash.cs
            │   │       └── RefreshTokenValue.cs
            │   │
            │   ├── Application\
            │   │   ├── Services\
            │   │   │   ├── AuthenticationService.cs
            │   │   │   ├── TokenManagementService.cs
            │   │   │   ├── AuthorizationEngine.cs
            │   │   │   ├── DynamicClaimsGenerator.cs
            │   │   │   └── SessionManager.cs
            │   │   ├── DTOs\
            │   │   │   ├── LoginRequest.cs
            │   │   │   ├── LoginResponse.cs
            │   │   │   ├── RefreshTokenRequest.cs
            │   │   │   ├── SelectContextRequest.cs
            │   │   │   └── TokenIntrospectionResponse.cs
            │   │   └── Interfaces\
            │   │       ├── IAuthenticationService.cs
            │   │       ├── ITokenService.cs
            │   │       └── IAuthorizationEngine.cs
            │   │
            │   ├── Infrastructure\
            │   │   ├── Persistence\
            │   │   │   ├── IamDbContext.cs
            │   │   │   ├── Configurations\
            │   │   │   │   ├── UserConfiguration.cs
            │   │   │   │   ├── TenantConfiguration.cs
            │   │   │   │   └── ...
            │   │   │   └── Migrations\
            │   │   ├── Caching\
            │   │   │   ├── RedisCacheService.cs
            │   │   │   └── PermissionsCacheManager.cs
            │   │   ├── Events\
            │   │   │   ├── NatsEventPublisher.cs
            │   │   │   └── EventSubscriber.cs
            │   │   ├── Security\
            │   │   │   ├── JwtTokenGenerator.cs
            │   │   │   ├── RS256KeyManager.cs
            │   │   │   └── RefreshTokenGenerator.cs
            │   │   └── Repositories\
            │   │       ├── UserRepository.cs
            │   │       ├── TenantRepository.cs
            │   │       ├── PermissionRepository.cs
            │   │       └── SessionRepository.cs
            │   │
            │   └── API\
            │       ├── Controllers\
            │       │   ├── AuthController.cs
            │       │   ├── TokenController.cs
            │       │   ├── AuthorizationController.cs
            │       │   └── SessionController.cs
            │       ├── Middleware\
            │       │   ├── RateLimitingMiddleware.cs
            │       │   └── SecurityHeadersMiddleware.cs
            │       ├── Program.cs
            │       └── appsettings.json
            │
            ├── Orchestrator\                           ← EXISTENTE (refactorizar)
            │   ├── Application\
            │   │   └── Services\
            │   │       └── AuthService.cs              ← ELIMINAR (migrar a IAM)
            │   ├── Infrastructure\
            │   │   └── Auth\
            │   │       └── TokenService.cs             ← ELIMINAR (migrar a IAM)
            │   └── ...
            │
            └── SDK\                                     ← NUEVO (para apps)
                └── IAM.Client\
                    ├── Farutech.IAM.Client.csproj
                    ├── IamClient.cs
                    ├── IamAuthenticationHandler.cs     ← Middleware JWT
                    ├── IamServiceCollectionExtensions.cs
                    └── Models\
                        ├── TokenValidationResult.cs
                        └── PermissionCheckRequest.cs
```

### 10.2 Dependencias del Proyecto IAM

**Farutech.IAM.API.csproj:**
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <!-- Entity Framework Core + PostgreSQL -->
    <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.0" />
    
    <!-- JWT -->
    <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="8.2.1" />
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.0" />
    
    <!-- Redis -->
    <PackageReference Include="StackExchange.Redis" Version="2.8.16" />
    <PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" Version="9.0.0" />
    
    <!-- NATS -->
    <PackageReference Include="NATS.Net" Version="2.5.1" />
    
    <!-- Password Hashing -->
    <PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
    
    <!-- Aspire -->
    <PackageReference Include="Aspire.StackExchange.Redis" Version="9.0.0" />
    <PackageReference Include="Aspire.Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.0" />
  </ItemGroup>
</Project>
```

### 10.3 Configuración Inicial

**appsettings.json:**
```json
{
  "ConnectionStrings": {
    "IamDatabase": "Host=localhost;Port=5432;Database=farutec_db;Username=farutec_admin;Password=SuperSecurePassword123;Schema=iam"
  },
  "Redis": {
    "Configuration": "localhost:6379"
  },
  "NATS": {
    "Url": "nats://localhost:4222"
  },
  "Jwt": {
    "Issuer": "https://iam.farutech.com",
    "Audience": ["orchestrator-api", "ordeon-api", "farupos-api"],
    "AccessTokenExpirationMinutes": 15,
    "RefreshTokenExpirationDays": 30,
    "PrivateKeyPath": "/etc/farutech/iam/private-key.pem",
    "PublicKeyPath": "/etc/farutech/iam/public-key.pem"
  },
  "Caching": {
    "PermissionsCacheTTLMinutes": 15,
    "ClaimsCacheTTLMinutes": 15,
    "TenantConfigCacheTTLMinutes": 60
  },
  "RateLimiting": {
    "LoginAttemptsPerMinute": 5,
    "RefreshTokenAttemptsPerMinute": 10
  }
}
```

---

## 11. Plan de Refactorización del Código Actual

### 11.1 Cambios en Orchestrator

#### **ANTES (Orchestrator/Application/Services/AuthService.cs):**
```csharp
// 811 líneas - AuthService gestiona todo
public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    
    public async Task<SecureLoginResponse> LoginAsync(LoginRequest request)
    {
        // Validar credenciales
        var user = await _userManager.FindByEmailAsync(request.Email);
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        
        // Obtener tenants
        var memberships = await GetAvailableTenantsForUserAsync(user.Id);
        
        // Generar tokens...
    }
}
```

#### **DESPUÉS (AuthService se convierte en proxy al IAM):**
```csharp
// Orchestrator/Application/Services/AuthService.cs (simplificado)
public class AuthService : IAuthService
{
    private readonly IIamClient _iamClient;
    
    public async Task<SecureLoginResponse> LoginAsync(LoginRequest request)
    {
        // Delegar al IAM Service
        return await _iamClient.LoginAsync(request);
    }
    
    // Métodos específicos de Orchestrator (no relacionados con auth)
    public async Task<TenantProvisioningStatus> GetProvisioningStatusAsync(Guid tenantId)
    {
        // Lógica específica de Orchestrator
    }
}
```

### 11.2 Migración de Entities

#### **MOVER:** `identity.AspNetUsers` → `iam.users`

**Script de Migración:**
```sql
-- 1. Crear nuevo esquema IAM
CREATE SCHEMA IF NOT EXISTS iam;

-- 2. Copiar datos de AspNetUsers a iam.users
INSERT INTO iam.users (
    id, email, email_confirmed, password_hash,
    phone_number, phone_number_confirmed,
    first_name, last_name,
    is_active, created_at, last_login_at
)
SELECT 
    "Id", "Email", "EmailConfirmed", "PasswordHash",
    "PhoneNumber", "PhoneNumberConfirmed",
    COALESCE("FirstName", ''), COALESCE("LastName", ''),
    true, NOW(), NULL
FROM identity."AspNetUsers";

-- 3. Copiar UserCompanyMemberships a iam.tenant_memberships
INSERT INTO iam.tenant_memberships (
    user_id, tenant_id, role_id, is_active, granted_at
)
SELECT 
    "UserId", "CustomerId", 
    CASE "Role"
        WHEN 0 THEN '22222222-2222-2222-2222-222222222222' -- Owner
        WHEN 1 THEN '33333333-3333-3333-3333-333333333333' -- InstanceAdmin
        WHEN 2 THEN '44444444-4444-4444-4444-444444444444' -- User
        WHEN 3 THEN '55555555-5555-5555-5555-555555555555' -- Guest
    END,
    "IsActive", "GrantedAt"
FROM identity."UserCompanyMemberships";

-- 4. Verificar integridad
SELECT COUNT(*) FROM iam.users;
SELECT COUNT(*) FROM iam.tenant_memberships;
```

### 11.3 Cambios en Frontend (Dashboard)

#### **ANTES (.env.development):**
```env
VITE_API_BASE_URL=http://localhost:5098
```

#### **DESPUÉS:**
```env
VITE_API_BASE_URL=http://localhost:5098
VITE_IAM_API_BASE_URL=http://localhost:5099  ← Nuevo IAM API
```

#### **ANTES (src/services/authService.ts):**
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  return response.json();
}
```

#### **DESPUÉS:**
```typescript
const IAM_API_BASE = import.meta.env.VITE_IAM_API_BASE_URL;

export async function login(email: string, password: string) {
  const response = await fetch(`${IAM_API_BASE}/iam/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Guardar tokens en localStorage
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  
  return data;
}

// Nuevo: Auto-refresh de tokens
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch(`${IAM_API_BASE}/iam/v1/tokens/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  
  return data.accessToken;
}

// Interceptor para Axios
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshAccessToken();
        error.config.headers['Authorization'] = `Bearer ${newToken}`;
        return axios.request(error.config);
      } catch (refreshError) {
        // Redirect a login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### 11.4 Cambios en Apps (Ordeon, FaruPOS)

#### **ANTES (Ordeon/Program.cs):**
```csharp
// Validación JWT directa
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "FarutechOrchestrator",
            ValidAudience = "FarutechAPI",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
        };
    });
```

#### **DESPUÉS (usando IAM SDK):**
```csharp
// Instalar NuGet: Farutech.IAM.Client
builder.Services.AddFarutechIAM(options =>
{
    options.Authority = "https://iam.farutech.com";
    options.Audience = "ordeon-api";
    options.PublicKeyUrl = "https://iam.farutech.com/iam/v1/.well-known/jwks.json";
    
    // Cache local de public key
    options.CachePublicKey = true;
    options.CacheExpirationMinutes = 60;
});

// Controllers siguen igual
[Authorize]
public class ProductsController : ControllerBase
{
    public async Task<IActionResult> GetProducts()
    {
        var userId = User.FindFirst("sub")?.Value;
        var tenantId = User.FindFirst("tenant_id")?.Value;
        
        // Lógica de negocio...
    }
}
```

---

## 12. Estrategia de Migración MVP (6 semanas)

### 12.1 Fase 1: Setup IAM Service (Semana 1-2)

**Objetivos:**
- ✅ Crear proyecto Farutech.IAM
- ✅ Implementar esquema de base de datos
- ✅ Migrar datos de `identity.*` a `iam.*`
- ✅ Implementar APIs básicas de autenticación

**Tareas Detalladas:**

**Semana 1:**
- [ ] Crear estructura de proyecto IAM (según sección 10.1)
- [ ] Implementar entities y DbContext
- [ ] Crear migraciones EF Core
- [ ] Ejecutar migración de datos (script SQL 11.2)
- [ ] Implementar AuthenticationService básico
- [ ] Implementar TokenManagementService (JWT + Refresh)

**Semana 2:**
- [ ] Implementar AuthController (`/iam/v1/auth/*`)
- [ ] Implementar TokenController (`/iam/v1/tokens/*`)
- [ ] Configurar Redis para refresh tokens
- [ ] Configurar NATS para event publishing
- [ ] Testing unitario de servicios
- [ ] Testing de integración de APIs

**Entregables:**
- ✅ IAM Service corriendo en puerto 5099
- ✅ Endpoints funcionando:
  - `POST /iam/v1/auth/login`
  - `POST /iam/v1/auth/select-context`
  - `POST /iam/v1/auth/logout`
  - `POST /iam/v1/tokens/refresh`
  - `POST /iam/v1/tokens/revoke`

### 12.2 Fase 2: SDK y Caching (Semana 3)

**Objetivos:**
- ✅ Crear SDK `Farutech.IAM.Client` para apps
- ✅ Implementar caching de permisos (Redis)
- ✅ Implementar event bus básico

**Tareas:**
- [ ] Crear proyecto `Farutech.IAM.Client`
- [ ] Implementar `IamAuthenticationHandler` (middleware JWT)
- [ ] Implementar `IamClient` (cliente HTTP para introspection)
- [ ] Implementar `RedisCacheService` para permisos
- [ ] Implementar `DynamicClaimsGenerator` con caching
- [ ] Implementar `NatsEventPublisher`
- [ ] Testing de performance (latencia de validación JWT)

**Entregables:**
- ✅ NuGet package `Farutech.IAM.Client` v1.0.0
- ✅ Redis cacheando permisos (TTL 15 min)
- ✅ Eventos publicados en NATS

### 12.3 Fase 3: Migración Orchestrator (Semana 4)

**Objetivos:**
- ✅ Refactorizar Orchestrator para usar IAM
- ✅ Actualizar Frontend para apuntar a IAM
- ✅ Testing E2E del flujo completo

**Tareas:**
- [ ] Refactorizar `AuthService` en Orchestrator (proxy a IAM)
- [ ] Eliminar `TokenService` de Orchestrator
- [ ] Actualizar Frontend:
  - [ ] Cambiar URLs de auth a IAM API
  - [ ] Implementar auto-refresh de tokens
  - [ ] Guardar refresh token en localStorage
- [ ] Actualizar `AppHost.cs` (agregar IAM Service)
- [ ] Testing E2E:
  - [ ] Login con selección de contexto
  - [ ] Refresh automático de tokens
  - [ ] Logout

**Entregables:**
- ✅ Orchestrator usa IAM Service
- ✅ Frontend funciona con refresh tokens
- ✅ E2E tests pasan

### 12.4 Fase 4: Migración PoC Ordeon (Semana 5)

**Objetivos:**
- ✅ Migrar Ordeon API a usar IAM SDK
- ✅ Validar performance en producción

**Tareas:**
- [ ] Instalar `Farutech.IAM.Client` en Ordeon
- [ ] Reemplazar `AddJwtBearer()` con `AddFarutechIAM()`
- [ ] Testing de validación de tokens
- [ ] Benchmarking de latencia (P95 < 5ms)
- [ ] Monitoreo con Prometheus

**Entregables:**
- ✅ Ordeon API validando tokens contra IAM
- ✅ Latencia P95 de validación < 5ms
- ✅ Métricas en Grafana

### 12.5 Fase 5: RBAC + ABAC Foundation (Semana 6)

**Objetivos:**
- ✅ Implementar RBAC granular
- ✅ Implementar ABAC básico (foundation)

**Tareas:**
- [ ] Implementar `AuthorizationEngine`
- [ ] Implementar `AbacPolicyEngine` (evaluación básica)
- [ ] Crear tabla `iam.policy_rules`
- [ ] Implementar endpoint `/iam/v1/authorize/check`
- [ ] Implementar endpoint `/iam/v1/authorize/evaluate`
- [ ] Seed de permisos y políticas de ejemplo
- [ ] Testing de evaluación de permisos

**Entregables:**
- ✅ RBAC funcionando (roles + permisos)
- ✅ ABAC básico (políticas simples)
- ✅ API de autorización disponible

### 12.6 Checklist de Validación MVP

**Funcionalidad:**
- [ ] Login con email/password ✅
- [ ] Selección de contexto multi-tenant ✅
- [ ] Access token (JWT, 15 min) ✅
- [ ] Refresh token (opaque, 30 días) ✅
- [ ] Auto-refresh en frontend ✅
- [ ] Logout (revoke tokens) ✅
- [ ] Validación JWT en apps ✅
- [ ] Caching de permisos (Redis) ✅
- [ ] RBAC básico ✅
- [ ] Event publishing (NATS) ✅

**Performance:**
- [ ] Latencia P95 `/auth/login` < 300ms ✅
- [ ] Latencia P95 `/tokens/refresh` < 100ms ✅
- [ ] Latencia validación JWT (local) < 5ms ✅

**Seguridad:**
- [ ] Passwords hasheados con BCrypt ✅
- [ ] Tokens firmados con RS256 ✅
- [ ] Refresh tokens revocables ✅
- [ ] Rate limiting en endpoints de auth ✅

---

## 13. Seguridad Adicional

### 13.1 Rate Limiting

```csharp
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IDistributedCache _cache;
    
    public async Task InvokeAsync(HttpContext context)
    {
        var endpoint = context.GetEndpoint();
        var rateLimitAttribute = endpoint?.Metadata
            .GetMetadata<RateLimitAttribute>();
        
        if (rateLimitAttribute != null)
        {
            var key = $"ratelimit:{context.Connection.RemoteIpAddress}:{endpoint.DisplayName}";
            var count = await _cache.GetStringAsync(key);
            
            if (count != null && int.Parse(count) >= rateLimitAttribute.MaxRequests)
            {
                context.Response.StatusCode = 429; // Too Many Requests
                await context.Response.WriteAsync("Rate limit exceeded");
                return;
            }
            
            var newCount = count == null ? 1 : int.Parse(count) + 1;
            await _cache.SetStringAsync(
                key, 
                newCount.ToString(),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1)
                });
        }
        
        await _next(context);
    }
}

// Uso
[RateLimit(MaxRequests = 5, WindowMinutes = 1)]
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    // ...
}
```

### 13.2 Security Headers

```csharp
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;
    
    public async Task InvokeAsync(HttpContext context)
    {
        context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
        context.Response.Headers.Append("X-Frame-Options", "DENY");
        context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
        context.Response.Headers.Append("Referrer-Policy", "no-referrer");
        context.Response.Headers.Append("Content-Security-Policy", 
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
        
        // HSTS (solo en producción)
        if (!context.Request.Host.Host.Contains("localhost"))
        {
            context.Response.Headers.Append(
                "Strict-Transport-Security", 
                "max-age=31536000; includeSubDomains");
        }
        
        await _next(context);
    }
}
```

### 13.3 Detección de Ataques de Fuerza Bruta

```csharp
public class LoginAttemptTracker
{
    private readonly IDistributedCache _cache;
    
    public async Task<bool> IsBlockedAsync(string email, string ipAddress)
    {
        var emailKey = $"login_attempts:email:{email}";
        var ipKey = $"login_attempts:ip:{ipAddress}";
        
        var emailAttempts = await GetAttemptsAsync(emailKey);
        var ipAttempts = await GetAttemptsAsync(ipKey);
        
        return emailAttempts >= 5 || ipAttempts >= 10;
    }
    
    public async Task RecordFailedAttemptAsync(string email, string ipAddress)
    {
        await IncrementAttemptsAsync($"login_attempts:email:{email}");
        await IncrementAttemptsAsync($"login_attempts:ip:{ipAddress}");
    }
    
    public async Task ResetAttemptsAsync(string email, string ipAddress)
    {
        await _cache.RemoveAsync($"login_attempts:email:{email}");
        await _cache.RemoveAsync($"login_attempts:ip:{ipAddress}");
    }
    
    private async Task<int> GetAttemptsAsync(string key)
    {
        var value = await _cache.GetStringAsync(key);
        return value == null ? 0 : int.Parse(value);
    }
    
    private async Task IncrementAttemptsAsync(string key)
    {
        var attempts = await GetAttemptsAsync(key) + 1;
        await _cache.SetStringAsync(
            key, 
            attempts.ToString(),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
            });
    }
}
```

### 13.4 Secrets Management

```csharp
// NO hacer esto:
// var jwtSecret = "SuperSecretKey123";

// ✅ Usar Azure Key Vault / AWS Secrets Manager / Environment Variables
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{keyVaultName}.vault.azure.net/"),
    new DefaultAzureCredential());

// O con Aspire:
builder.AddAzureKeyVault("secrets");

// O variables de entorno:
var privateKeyPath = Environment.GetEnvironmentVariable("JWT_PRIVATE_KEY_PATH");
```

---

## 14. Monitoreo y Observabilidad

### 14.1 Métricas (Prometheus)

```csharp
public class IamMetrics
{
    private static readonly Counter LoginAttempts = Metrics
        .CreateCounter("iam_login_attempts_total", 
            "Total login attempts", 
            new CounterConfiguration { LabelNames = new[] { "result" } });
    
    private static readonly Histogram LoginDuration = Metrics
        .CreateHistogram("iam_login_duration_seconds", 
            "Login duration in seconds");
    
    private static readonly Counter TokenRefreshes = Metrics
        .CreateCounter("iam_token_refreshes_total", 
            "Total token refreshes");
    
    private static readonly Gauge ActiveSessions = Metrics
        .CreateGauge("iam_active_sessions", 
            "Number of active sessions");
    
    public static void RecordLoginAttempt(bool success)
    {
        LoginAttempts.WithLabels(success ? "success" : "failure").Inc();
    }
    
    public static void RecordLoginDuration(double seconds)
    {
        LoginDuration.Observe(seconds);
    }
    
    public static void RecordTokenRefresh()
    {
        TokenRefreshes.Inc();
    }
    
    public static void UpdateActiveSessions(int count)
    {
        ActiveSessions.Set(count);
    }
}

// Uso en AuthenticationService
public async Task<LoginResponse> LoginAsync(LoginRequest request)
{
    var sw = Stopwatch.StartNew();
    
    try
    {
        // Lógica de login...
        
        IamMetrics.RecordLoginAttempt(success: true);
        return response;
    }
    catch
    {
        IamMetrics.RecordLoginAttempt(success: false);
        throw;
    }
    finally
    {
        sw.Stop();
        IamMetrics.RecordLoginDuration(sw.Elapsed.TotalSeconds);
    }
}
```

### 14.2 Logging Estructurado (Serilog)

```csharp
builder.Host.UseSerilog((context, config) =>
{
    config
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "Farutech.IAM")
        .WriteTo.Console(new JsonFormatter())
        .WriteTo.File(
            new JsonFormatter(), 
            "logs/iam-.log", 
            rollingInterval: RollingInterval.Day);
});

// Logs con contexto
_logger.LogInformation(
    "User {UserId} logged in from {IpAddress} to tenant {TenantId}",
    userId, ipAddress, tenantId);

_logger.LogWarning(
    "Failed login attempt for {Email} from {IpAddress}",
    email, ipAddress);
```

### 14.3 Tracing (OpenTelemetry)

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddEntityFrameworkCoreInstrumentation()
            .AddRedisInstrumentation()
            .AddSource("Farutech.IAM")
            .AddOtlpExporter(options =>
            {
                options.Endpoint = new Uri("http://localhost:4317");
            });
    });

// Crear spans custom
var activitySource = new ActivitySource("Farutech.IAM");

using var activity = activitySource.StartActivity("GenerateDynamicClaims");
activity?.SetTag("user.id", userId);
activity?.SetTag("tenant.id", tenantId);

// ...lógica...
```

---

## 15. Roadmap de Implementación

### 15.1 Timeline Completo

```
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1: MVP (6 semanas)                      [PRIORIDAD ALTA]   │
├─────────────────────────────────────────────────────────────────┤
│ Semana 1-2: Setup IAM Service + APIs básicas                    │
│ Semana 3:   SDK + Caching + Event Bus                           │
│ Semana 4:   Migración Orchestrator + Frontend                   │
│ Semana 5:   Migración PoC Ordeon                                │
│ Semana 6:   RBAC + ABAC Foundation                              │
│                                                                  │
│ Entregables:                                                     │
│ ✅ IAM Service funcional                                        │
│ ✅ Refresh tokens                                               │
│ ✅ RBAC básico                                                  │
│ ✅ Caching Redis                                                │
│ ✅ Event bus NATS                                               │
│ ✅ SDK para apps                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FASE 2: Core Features (8 semanas)           [PRIORIDAD MEDIA]   │
├─────────────────────────────────────────────────────────────────┤
│ Semana 7-8:   Claims dinámicos por tenant                       │
│ Semana 9-10:  ABAC completo (políticas avanzadas)               │
│ Semana 11-12: Gestión de sesiones (logout forzado)              │
│ Semana 13-14: Auditoría completa + Admin UI                     │
│                                                                  │
│ Entregables:                                                     │
│ ✅ Claims dinámicos                                             │
│ ✅ Políticas ABAC complejas                                     │
│ ✅ Session management                                           │
│ ✅ Audit logs completos                                         │
│ ✅ Admin UI para gestión de roles/permisos                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FASE 3: Enterprise (según demanda)          [PRIORIDAD BAJA]    │
├─────────────────────────────────────────────────────────────────┤
│ Cuando haya demanda de clientes:                                │
│ - OAuth2/OpenID Connect (Google, Microsoft)                     │
│ - SAML 2.0 para SSO enterprise                                  │
│ - MFA (TOTP, SMS)                                                │
│ - Passwordless (Magic Links, WebAuthn)                          │
│ - IP Whitelisting                                                │
│                                                                  │
│ Entregables bajo demanda                                         │
└─────────────────────────────────────────────────────────────────┘
```

### 15.2 Recursos Necesarios

**Equipo (Fase 1 MVP):**
- 1 x Arquitecto Senior (20h/semana) - Diseño y revisiones
- 2 x Backend Engineers (.NET) - Implementación IAM Service
- 1 x Frontend Engineer (React) - Migración Frontend
- 1 x DevOps Engineer - Setup Redis, NATS, Aspire
- 1 x QA Engineer - Testing E2E

**Infraestructura:**
- PostgreSQL (ya existe)
- Redis cluster (nuevo)
- NATS (ya existe)
- Aspire Dashboard (ya existe)

**Costo Estimado Fase 1:**
- Personal: 6 semanas x 5 personas = 30 person-weeks
- Infraestructura: Redis cloud (estimado $100/mes)

### 15.3 KPIs de Éxito

| Métrica | Objetivo MVP | Medición |
|---------|--------------|----------|
| **Uptime IAM Service** | ≥ 99.5% | Prometheus |
| **Latencia P95 /auth/login** | < 300ms | Prometheus |
| **Latencia P95 /tokens/refresh** | < 100ms | Prometheus |
| **Validación JWT (local)** | < 5ms | Benchmark |
| **Zero Downtime Migration** | ✅ | Manual |
| **Cache Hit Rate (permisos)** | > 90% | Redis stats |
| **Failed Login Rate** | < 2% | Audit logs |
| **Token Revocation Time** | < 1s | Manual |

### 15.4 Criterios de Aprobación MVP

**Funcionales:**
- [ ] Usuario puede hacer login y seleccionar tenant
- [ ] Token se renueva automáticamente antes de expirar
- [ ] Usuario puede hacer logout (token revocado)
- [ ] Apps validan tokens correctamente
- [ ] Permisos se cachean en Redis
- [ ] Eventos se publican en NATS

**No Funcionales:**
- [ ] Latencia P95 < 300ms en login
- [ ] Latencia P95 < 100ms en refresh
- [ ] Validación JWT < 5ms
- [ ] Cache hit rate > 90%
- [ ] Zero downtime en migración

**Técnicos:**
- [ ] Código con > 80% de cobertura de tests
- [ ] Documentación de APIs completa (OpenAPI)
- [ ] Monitoreo con Prometheus + Grafana
- [ ] Logs estructurados con Serilog

---

## 16. Conclusiones y Siguientes Pasos

### 16.1 Resumen de Mejoras vs Propuesta Original

| Aspecto | Propuesta v1.0 | Propuesta v2.0 (Mejorada) |
|---------|----------------|---------------------------|
| **Arquitectura** | IAM Service desacoplado | ✅ + Event-Driven + Caching |
| **Autorización** | RBAC básico | ✅ RBAC + ABAC desde MVP |
| **Performance** | No especificado | ✅ Redis caching + Materialized Views |
| **Tokens** | JWT básico | ✅ RS256 + Refresh rotation + Introspection |
| **Claims** | Estáticos | ✅ Dinámicos + Tenant-specific |
| **Seguridad** | MFA futuro | ✅ Rate limiting + Brute force detection |
| **Observabilidad** | Audit logs | ✅ Prometheus + Tracing + Structured logs |
| **Migración** | 4 fases (8 meses) | ✅ MVP iterativo (6 semanas) |

### 16.2 Decisiones Clave Tomadas

1. ✅ **MVP primero** (6 semanas) en lugar de waterfall (8 meses)
2. ✅ **ABAC desde el inicio** (foundation en MVP, completo en Fase 2)
3. ✅ **Caching estratégico** con Redis (15 min TTL)
4. ✅ **Event-Driven** con NATS desde MVP
5. ✅ **RS256** en lugar de HS256 (más seguro)
6. ✅ **Refresh token rotation** automática
7. ✅ **Feature flags** por tenant desde el diseño
8. ✅ **Token introspection API** para apps legacy

### 16.3 Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Latencia en validación JWT** | Media | Alto | Caching de public keys en apps (1h TTL) |
| **Redis downtime** | Baja | Alto | Fallback a DB si Redis falla |
| **Migración con downtime** | Media | Alto | Blue-green deployment + rollback plan |
| **Performance de ABAC** | Media | Medio | Pre-evaluar políticas + cache resultados |
| **Complejidad operacional** | Alta | Medio | Monitoreo desde día 1 + runbooks |

### 16.4 Aprobación para Continuar

**Esta propuesta v2.0 está lista para aprobación y ejecución.**

**Próximos pasos inmediatos:**

1. ✅ **Aprobar roadmap y presupuesto** (stakeholders)
2. ✅ **Asignar equipo** (2 backend, 1 frontend, 1 DevOps, 1 QA)
3. ✅ **Setup ambiente de desarrollo**:
   - Crear proyecto `Farutech.IAM` en repositorio
   - Configurar Redis y NATS en docker-compose
   - Crear branch `feature/iam-service`
4. ✅ **Semana 1: Inicio de implementación**
   - Crear estructura de proyecto (sección 10.1)
   - Implementar entities y DbContext
   - Crear migraciones

**¿Procedemos con la implementación?**

---

## 📚 Referencias y Recursos

- [RFC 7519 - JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [RFC 6749 - OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [NIST SP 800-63B - Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [NIST Guide to ABAC](https://csrc.nist.gov/publications/detail/sp/800-162/final)
- [AWS Cognito Architecture](https://docs.aws.amazon.com/cognito/)
- [Auth0 Architecture Best Practices](https://auth0.com/docs/architecture-scenarios)
- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)

---

**Documento preparado por:** Arquitecto de Software Senior  
**Fecha:** 8 de Febrero, 2026  
**Versión:** 2.0 (Mejorada con feedback técnico)  
**Status:** ✅ Listo para aprobación e implementación  
**Ubicación del Proyecto:** `C:\Users\farid\farutech-saas-orchestrator\src\01.Core\Farutech\IAM\`
