# 🏗️ Consolidación Post-IAM - Plan Maestro

**Fecha Inicio**: 2026-02-09  
**Arquitecto Lead**: Sistema  
**Objetivo**: Consolidar IAM como única fuente de verdad de identidad

---

## 📋 Estado Actual (Pre-Consolidación)

### ✅ Componentes Operativos
- **IAM Service**: Completamente funcional (12/12 tasks)
  - Autenticación JWT con RS256
  - Multi-tenancy con context selection
  - Redis caching (permisos 30 min)
  - NATS event publishing
  - Testing completo

### ⚠️ Deuda Técnica Identificada

#### 1. **Orchestrator - Autenticación Duplicada**
**Ubicación**: `src/01.Core/Farutech/Orchestrator/`

**Componentes a refactorizar**:
```
Application/Interfaces/
  ├── IAuthService.cs                    ❌ Eliminar lógica de auth
  └── IAuthRepository.cs                 ❌ Eliminar PasswordResetToken, credenciales

Application/Services/
  └── AuthService.cs                     ⚠️ Refactor total

Infrastructure/Persistence/
  └── AuthRepository.cs                  ❌ Eliminar lógica de credenciales

API/Controllers/
  └── AuthController.cs (si existe)      ❌ Eliminar o redirigir a IAM

API/GraphQL/
  └── AuthMutations.cs                   ⚠️ Refactor para usar IAM client
```

**Problemas específicos**:
- Login/password handling en Orchestrator
- Generación de tokens propia
- Tabla `UserLogins` en schema `identity`
- PasswordResetToken gestionado localmente

#### 2. **Scripts SQL Manuales**
**Ubicación**: `src/01.Core/Farutech/IAM/Infrastructure/Persistence/`

**Archivos cuestionables**:
```
Run-DataMigration.ps1                    ⚠️ Evaluar necesidad
Migrations/
  ├── 01-analyze-identity-schema.sql    ❌ Legacy (pre-EF migrations)
  ├── 02-migrate-identity-to-iam.sql    ❌ Legacy (debe estar en EF)
  └── 03-seed-data-simple.sql           ⚠️ Evaluar vs EF seed
```

**Decisión pendiente**:
- Si EF Migrations ya cubre todo → Eliminar scripts
- Si hay lógica única → Migrar a EF Seed Data

#### 3. **Modelo de Usuario Dual**
**Problema**: Dos fuentes de verdad

```
IAM User                         Orchestrator User
├── Id (UUID v7)                ├── Id (UUID)
├── Email (unique)              ├── Email
├── PasswordHash                ├── [No debe existir]
├── FirstName                   ├── FirstName
├── LastName                    ├── LastName
└── TenantMemberships           └── CompanyMemberships ❓
```

**Decisión arquitectónica requerida**:
- ¿Orchestrator debe tener su propia tabla Users?
- Si sí: ¿Solo como referencia con `IamUserId` FK?
- Si no: ¿Cómo vincular datos de negocio?

#### 4. **Roles - Definición Pendiente**
**Estado actual**: IAM tiene RolePermissions pero sin roles base

**Roles requeridos**:
```
super-admin    → Full access, multi-tenant
admin          → Tenant admin
user           → Standard user
guest          → Read-only (opcional)
```

**Ubicación**: Seed data en IAM o migración específica

---

## 🎯 FASE 1 - Análisis y Decisiones (Sin Código)

### PASO 1.1: Validación de Scripts IAM
**Objetivo**: Determinar si los scripts SQL manuales son necesarios

**Actividades**:
1. Revisar `20260209044630_InitialCreate.cs` (EF Migration)
2. Comparar con `02-migrate-identity-to-iam.sql`
3. Verificar si seed data está en EF o solo en SQL

**Criterios de decisión**:
| Condición | Acción |
|-----------|--------|
| Todo está en EF Migration | ❌ Eliminar scripts SQL |
| Hay lógica de negocio única | ⚠️ Migrar a C# seed |
| Scripts solo para dev/debug | ⚠️ Mover a `/scripts/dev/` |

**Resultado esperado**: Documento con decisión justificada

---

### PASO 1.2: Definición de Identidad de Usuario
**Objetivo**: Establecer modelo canónico de identidad

**Opciones evaluadas**:

#### **Opción A: IAM como única fuente** ⭐ Recomendada
```csharp
// Orchestrator NO tiene tabla Users
// Solo referencias por IamUserId

public class Company {
    public Guid Id { get; set; }
    public Guid OwnerIamUserId { get; set; }  // FK a IAM (lógico)
    // ...
}

public class Instance {
    public Guid Id { get; set; }
    public Guid CreatedByIamUserId { get; set; }  // FK a IAM (lógico)
    // ...
}
```

**Ventajas**:
- ✅ Single source of truth
- ✅ Menos complejidad
- ✅ No hay sincronización

**Desventajas**:
- ⚠️ Orchestrator debe consultar IAM para datos de usuario
- ⚠️ Performance: Llamadas adicionales a IAM API

---

#### **Opción B: Tabla de referencia en Orchestrator**
```csharp
// Orchestrator tiene tabla Users minimal
public class User {
    public Guid Id { get; set; }              // PK local
    public Guid IamUserId { get; set; }       // FK a IAM (ÚNICO)
    public string Email { get; set; }         // Cache (no unique)
    public DateTime SyncedAt { get; set; }    // Última sync con IAM
}

public class Company {
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }         // FK local
    public User Owner { get; set; }           // Navigation
}
```

**Ventajas**:
- ✅ Performance mejorado (menos calls a IAM)
- ✅ Relaciones FK tradicionales

**Desventajas**:
- ⚠️ Requiere sincronización IAM → Orchestrator
- ⚠️ Eventual consistency
- ⚠️ Más complejidad

---

#### **Decisión Requerida** 🔴

**Input necesario del equipo**:
- ¿Cuántas veces se consulta usuario en flujos críticos?
- ¿Es aceptable latencia de 50-100ms por llamada a IAM?
- ¿Hay capacidad para implementar sync events?

**Recomendación Enterprise**:
> **Opción A** para MVP/Phase 1 (menos complejidad)  
> **Opción B** solo si performance es crítico y hay recursos para eventos

---

### PASO 1.3: Modelo de Roles Base
**Objetivo**: Definir roles iniciales en IAM

**Propuesta de roles**:

```csharp
// Seed data para IAM
var roles = new[] {
    new Role {
        Id = Guid.NewGuid(),
        Name = "super-admin",
        Description = "Full system access across all tenants",
        IsSystemRole = true,
        TenantId = null  // Global
    },
    new Role {
        Id = Guid.NewGuid(),
        Name = "admin",
        Description = "Tenant administrator",
        IsSystemRole = true,
        TenantId = null  // Can be assigned per tenant
    },
    new Role {
        Id = Guid.NewGuid(),
        Name = "user",
        Description = "Standard user",
        IsSystemRole = true,
        TenantId = null
    }
};
```

**Permisos por rol**:

| Rol | Permisos |
|-----|----------|
| super-admin | ALL (wildcard `*:*`) |
| admin | `users:*`, `tenants:read`, `companies:*`, `instances:*` |
| user | `users:read`, `companies:read`, `instances:read` |

**Implementación**: EF Migration o Data Seeder

---

## 🎯 FASE 2 - Limpieza del Orchestrator

### PASO 2.1: Análisis de Dependencias
**Objetivo**: Mapear qué usa IAuthService/IAuthRepository

**Comando de análisis**:
```powershell
# Buscar usages en toda la solución
grep -r "IAuthService" src/01.Core/Farutech/Orchestrator/
grep -r "IAuthRepository" src/01.Core/Farutech/Orchestrator/
```

**Output esperado**: Lista de archivos que dependen de auth

---

### PASO 2.2: Crear IAM Client Service
**Objetivo**: Wrapper para comunicarse con IAM desde Orchestrator

**Nueva interface**:
```csharp
// src/01.Core/Farutech/Orchestrator/Application/Interfaces/IIamClientService.cs

public interface IIamClientService
{
    // Delegar login a IAM
    Task<IamLoginResponse> LoginAsync(string email, string password);
    
    // Validar token de IAM
    Task<IamTokenValidationResult> ValidateTokenAsync(string token);
    
    // Obtener info de usuario desde IAM
    Task<IamUserInfo> GetUserInfoAsync(Guid iamUserId);
    
    // Verificar permiso
    Task<bool> HasPermissionAsync(Guid iamUserId, string permission);
}
```

**Implementación**:
- HttpClient a IAM API
- Cache de tokens (Redis)
- Retry policies (Polly)

---

### PASO 2.3: Refactor de AuthService
**Estrategia**: Convertir en proxy a IAM

**Antes** (❌ Código actual):
```csharp
public async Task<LoginResponse> LoginAsync(string email, string password) {
    var user = await _userRepository.GetByEmailAsync(email);
    if (!_passwordHasher.Verify(password, user.PasswordHash)) {
        throw new UnauthorizedException();
    }
    var token = _tokenGenerator.Generate(user);
    return new LoginResponse { Token = token };
}
```

**Después** (✅ Delegando a IAM):
```csharp
public async Task<LoginResponse> LoginAsync(string email, string password) {
    // Delegar a IAM
    var iamResponse = await _iamClient.LoginAsync(email, password);
    
    // Registrar evento local si es necesario
    await _auditService.LogLoginAsync(iamResponse.UserId);
    
    // Retornar token de IAM
    return new LoginResponse { 
        Token = iamResponse.AccessToken,
        IamUserId = iamResponse.UserId
    };
}
```

---

### PASO 2.4: Eliminar Lógica de Credenciales
**Archivos a modificar/eliminar**:

```
❌ Application/Services/PasswordHasher.cs
❌ Infrastructure/Security/TokenGenerator.cs
⚠️ Domain/Entities/User.cs
   ├── Eliminar: PasswordHash, PasswordSalt
   └── Agregar: IamUserId (Guid)
❌ Infrastructure/Persistence/Migrations/UserLogins table
```

**Migración requerida**:
- Agregar columna `IamUserId` a tabla Users
- Migrar datos: Email → IamUserId (lookup desde IAM)
- Eliminar columnas: PasswordHash, PasswordSalt

---

## 🎯 FASE 3 - Ajustes del Frontend

### PASO 3.1: Actualizar SDK de Orchestrator
**Archivo**: `src/05.SDK/Orchestrator/`

**Cambios requeridos**:
```csharp
// Antes
public interface IFarutechClient {
    Task<LoginResponse> LoginAsync(string email, string password);
}

// Después
public interface IFarutechClient {
    // Login ahora delega a IAM (internamente)
    Task<LoginResponse> LoginAsync(string email, string password);
    
    // Nuevo: Validar si token sigue válido
    Task<bool> IsTokenValidAsync(string token);
}
```

**Nota**: El SDK NO debe cambiar su API pública, solo su implementación interna

---

### PASO 3.2: Frontend Dashboard
**Archivo**: `src/01.Core/Farutech/Frontend/Dashboard/`

**Validaciones necesarias**:
1. Login sigue funcionando con nuevo flow
2. Token storage (localStorage/sessionStorage)
3. Refresh token si aplica
4. Logout correcto

**Testing checklist**:
- [ ] Login con credenciales válidas
- [ ] Login con credenciales inválidas (debe fallar)
- [ ] Navegación con token válido
- [ ] Navegación con token expirado (debe redirigir a login)
- [ ] Logout limpia token

---

## 🎯 FASE 4 - Validación Técnica

### Checklist de Builds

#### Backend
```powershell
cd src/01.Core/Farutech/IAM
dotnet build --no-incremental          # ✅ Debe ser exitoso

cd ../Orchestrator
dotnet build --no-incremental          # ✅ Debe ser exitoso

cd ../../..
dotnet build                           # ✅ Build completo
```

#### Frontend
```powershell
cd src/01.Core/Farutech/Frontend/Dashboard
npm run build                          # ✅ Debe ser exitoso
```

---

### Checklist de Tests

#### Unit Tests
```powershell
cd src/01.Core/Farutech/IAM/Tests/Unit
dotnet test                            # ✅ 7/7 passed

cd ../../Orchestrator/Tests/Unit      # Si existen
dotnet test                            # ✅ Todos passed
```

#### Integration Tests
```powershell
cd tests/Farutech.Orchestrator.IntegrationTests
dotnet test                            # ✅ Auth tests passed
```

---

### Checklist Funcional

#### Login Flow End-to-End
1. [ ] Usuario ingresa credenciales en Dashboard
2. [ ] Dashboard llama a Orchestrator SDK
3. [ ] SDK llama a Orchestrator API
4. [ ] Orchestrator delega a IAM API
5. [ ] IAM valida credenciales
6. [ ] IAM retorna token JWT
7. [ ] Token llega hasta Dashboard
8. [ ] Dashboard guarda token
9. [ ] Dashboard redirige a home

#### Autorización
1. [ ] Usuario con rol `admin` puede crear organizaciones
2. [ ] Usuario con rol `user` NO puede crear organizaciones
3. [ ] Token expirado retorna 401

---

## 📊 Métricas de Éxito

### Código Eliminado
- [ ] -500 líneas en Orchestrator (auth duplicada)
- [ ] -3 archivos SQL manuales
- [ ] -2 tablas legacy (UserLogins, PasswordResetTokens)

### Código Agregado
- [ ] +200 líneas IIamClientService
- [ ] +1 migración (IamUserId en Users)
- [ ] +3 roles base en IAM seed

### Performance
- [ ] Login time < 1 segundo (p95)
- [ ] Token validation < 100ms (p95)

### Seguridad
- [ ] Zero passwords en Orchestrator DB
- [ ] Tokens JWT firmados por IAM solamente
- [ ] Audit log completo en IAM

---

## 🚨 Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Breaking changes en SDK | Media | Alto | Mantener compatibilidad de API pública |
| Performance degradation | Baja | Medio | Cache agresivo de tokens |
| Data loss en migración | Baja | Crítico | Backup antes de migrar IamUserId |
| Frontend no funciona | Media | Alto | Testing exhaustivo antes de merge |

---

## 📅 Timeline Estimado

| Fase | Duración | Complejidad |
|------|----------|-------------|
| 1. Análisis y decisiones | 2 horas | Baja |
| 2. Limpieza Orchestrator | 4 horas | Alta |
| 3. Ajustes Frontend | 2 horas | Media |
| 4. Validación y testing | 2 horas | Media |
| **TOTAL** | **10 horas** | **Media-Alta** |

---

## ✅ Checklist Final Pre-Merge

### Código
- [ ] Orchestrator NO tiene lógica de auth
- [ ] IAM es única fuente de tokens
- [ ] IamUserId presente en entidades relevantes
- [ ] Scripts SQL evaluados/eliminados
- [ ] Roles base creados

### Builds
- [ ] IAM build: ✅
- [ ] Orchestrator build: ✅
- [ ] Frontend build: ✅
- [ ] Tests unitarios: ✅
- [ ] Tests integración: ✅

### Funcional
- [ ] Login funciona end-to-end
- [ ] Autorización por roles funciona
- [ ] Token expiration manejado correctamente
- [ ] Logout limpia sesión

### Documentación
- [ ] README actualizado
- [ ] Diagramas de arquitectura actualizados
- [ ] API docs actualizados

---

## 📞 Contactos y Escalamiento

**Decisiones arquitectónicas**: Arquitecto Lead  
**Issues de build**: DevOps Team  
**Issues de negocio**: Product Owner

---

**Status**: 🟡 EN PROGRESO - PASO 1.1  
**Última actualización**: 2026-02-09
