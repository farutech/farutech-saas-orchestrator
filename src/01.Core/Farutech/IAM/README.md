# Farutech IAM Service

Servicio de Identity & Access Management (IAM) para Farutech SaaS Orchestrator.

## 🏗️ Arquitectura

- **Clean Architecture**: Domain → Application → Infrastructure → API
- **Framework**: .NET 10 Preview
- **Base de datos**: PostgreSQL 16 con Entity Framework Core 10.0
- **Autenticación**: JWT RS256 (2048-bit keys, 8 horas de expiración)
- **Multi-tenancy**: Context selection con TenantMemberships
- **Caching**: Redis (30 minutos para permisos)
- **Eventos**: NATS (UserLoggedInEvent, TenantContextSelectedEvent)
- **Documentación**: OpenAPI 3.0 + Scalar UI
- **Tests**: xUnit + Moq + FluentAssertions

## 📦 Estructura del Proyecto

```
IAM/
├── Domain/               # Entidades y contratos del dominio
│   └── Entities/         # User, Tenant, Role, Permission, etc.
├── Application/          # Lógica de negocio y servicios
│   ├── DTOs/
│   ├── Interfaces/
│   └── Services/
├── Infrastructure/       # Implementación de persistencia, cache, eventos
│   ├── Persistence/
│   │   ├── Configurations/
│   │   ├── Migrations/
│   │   ├── IamDbContext.cs
│   │   └── IamDbContextSeed.cs  ⭐ Seed data en C#
│   ├── Caching/          # Redis caching
│   ├── Messaging/        # NATS event publishing
│   └── Security/         # BCrypt password hashing
├── API/                  # Controllers y endpoints
│   └── Controllers/
└── Tests/                # Tests unitarios
    └── Farutech.IAM.UnitTests/
        ├── Services/
        └── Security/
```

## 🚀 Inicio Rápido

### 1. Prerrequisitos

- .NET 10 SDK (Preview)
- PostgreSQL 16 (via Podman/Docker)
- Redis (para caching - opcional)
- NATS (para eventos - opcional)

### 2. Ejecutar Infraestructura (PostgreSQL + Redis + NATS)

```bash
# Desde la raíz del proyecto
podman compose up -d

# Verificar servicios
podman ps
```

### 3. Iniciar el Servicio IAM

**IMPORTANTE**: Este proyecto usa **EF Core Migrations + C# Seed Data**. No hay scripts SQL manuales.

```bash
# Desde la raíz del proyecto IAM
cd src/01.Core/Farutech/IAM/API

# Ejecutar con HTTP (puerto 5152)
dotnet run --launch-profile http

# Ejecutar con HTTPS (puerto 7001)
dotnet run --launch-profile https
```

Al iniciar, el servicio automáticamente:
1. ✅ Aplica migrations de EF Core
2. ✅ Ejecuta seed data (roles, permisos, tenant, usuario admin)
3. ✅ Inicia el servidor en HTTP/HTTPS

### 4. Acceder a la Documentación

**Scalar UI (Recomendado)**:
- HTTP: http://localhost:5152/scalar/v1
- HTTPS: https://localhost:7001/scalar/v1

**OpenAPI JSON**:
- HTTP: http://localhost:5152/openapi/v1.json
- HTTPS: https://localhost:7001/openapi/v1.json

### 5. Seed Data Incluido

Al ejecutar las migrations, se crean automáticamente:

#### Roles (4)
- **Owner**: Acceso completo al sistema
- **Admin**: Permisos de gestión (excepto settings críticos)
- **User**: Permisos operativos (view, create, edit)
- **Guest**: Solo lectura (view)

#### Permisos (25)
Categorizados en: Catálogo, Ventas, Inventario, Finanzas, Reportes, Administración

Ejemplos:
- `catalog.products.view`, `catalog.products.create`
- `sales.orders.view`, `sales.orders.create`
- `admin.users.manage`, `admin.roles.manage`

#### Tenant Inicial
- **Code**: `farutech`
- **Name**: Farutech Corporation
- **TaxId**: 20123456789

#### Usuario Administrador
- **Email**: `admin@farutech.com`
- **Password**: `Admin123!`
- **Role**: Owner (acceso completo)

⚠️ **IMPORTANTE**: Cambiar la contraseña del admin en producción.

## 🔧 Configuración

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=farutec_db;Username=farutec_admin;Password=SuperSecurePassword123"
  },
  "TokenOptions": {
    "Issuer": "Farutech.IAM",
    "Audience": "Farutech.Services",
    "ExpirationMinutes": 480,
    "RsaKeySize": 2048
  },
  "RedisOptions": {
    "ConnectionString": "localhost:6379",
    "InstanceName": "Farutech.IAM:",
    "PermissionsCacheDurationMinutes": 30
  },
  "NatsOptions": {
    "Url": "nats://localhost:4222"
  }
}
```

## 🧪 Testing

```bash
# Tests unitarios
dotnet test Tests/Farutech.IAM.UnitTests

# Tests de integración
dotnet test Tests/Farutech.IAM.IntegrationTests
```

## 📚 Endpoints Principales

### Authentication
- `POST /api/auth/login` - Login con email/password
- `POST /api/auth/select-tenant-context` - Seleccionar contexto de tenant
- `POST /api/auth/refresh` - Renovar token con refresh token

### Users
- `GET /api/users` - Listar usuarios
- `GET /api/users/{id}` - Obtener usuario por ID
- `POST /api/users` - Crear usuario
- `PUT /api/users/{id}` - Actualizar usuario

### Tenants
- `GET /api/tenants` - Listar tenants
- `GET /api/tenants/{id}` - Obtener tenant por ID
- `POST /api/tenants` - Crear tenant

### Roles & Permissions
- `GET /api/roles` - Listar roles
- `GET /api/permissions` - Listar permisos
- `GET /api/users/{userId}/permissions` - Obtener permisos de usuario

## 🧪 Tests

### Ejecutar Tests Unitarios

```bash
cd Tests/Farutech.IAM.UnitTests
dotnet test
```

**Tests Implementados**:
- ✅ Domain Entities (User, Tenant, Role, Permission)
- ✅ PasswordHasher (hash, verify, salt)

**Cobertura Actual**: 10 tests pasando

### Ejecutar Tests con Reporte

```bash
dotnet test --logger "console;verbosity=detailed"
```

## 🔐 Seguridad

- **Password Hashing**: BCrypt con work factor 12
- **JWT**: RS256 (asymmetric keys)
- **Token Expiration**: 8 horas (configurable)
- **Refresh Tokens**: 30 días de validez
- **2FA**: Soporte para TOTP (opcional por tenant)
- **Lockout**: Después de 5 intentos fallidos (30 minutos)

## 📖 Documentación Adicional

- [Decisión: Eliminación de Scripts SQL](../../../docs/DECISION_SCRIPTS_IAM.md)
- [Plan de Consolidación Post-IAM](../../../docs/CONSOLIDACION_POST_IAM.md)
- [Arquitectura de Seguridad](../../../requerimientos/SaaS/FARUPOS_SECURITY_ARCHITECTURE.md)

## 🔄 Migraciones

### Crear nueva migración

```bash
dotnet ef migrations add <NombreMigration> --project Infrastructure --startup-project API
```

### Actualizar base de datos

```bash
dotnet ef database update --project Infrastructure --startup-project API
```

### Rollback a migración anterior

```bash
dotnet ef database update <NombreMigrationAnterior> --project Infrastructure --startup-project API
```

### Eliminar base de datos (⚠️ CUIDADO)

```bash
dotnet ef database drop --force --project Infrastructure --startup-project API
```

## 📝 Notas Importantes

1. **Seed Data**: Implementado en `Infrastructure/Persistence/IamDbContextSeed.cs` (C#), NO en scripts SQL
2. **Migrations**: Usar SIEMPRE `dotnet ef` para cambios en la estructura de BD
3. **Scripts SQL**: NO crear scripts SQL manuales para estructura o datos iniciales
4. **Producción**: Cambiar credenciales por defecto antes de desplegar
5. **Testing**: Ejecutar tests antes de hacer merge a main
6. **OpenAPI**: Documentación disponible en `/scalar/v1` (desarrollo)
7. **HTTPS**: Certificado dev auto-firmado (aceptar en navegador)

## 🐛 Troubleshooting

### Error: "relation already exists"
```bash
# Limpiar completamente el schema
podman exec farutech_postgres psql -U farutec_admin -d farutec_db -c "DROP SCHEMA IF EXISTS iam CASCADE;"

# Re-aplicar migrations
dotnet ef database update --project Infrastructure --startup-project API
```

### Error: "A network-related or instance-specific error"
Verificar que PostgreSQL esté corriendo:
```bash
podman ps | grep postgres
```

### Seed data no se ejecuta
El seed data se ejecuta en `Program.cs` al iniciar la aplicación. Verificar logs de startup.

## 👥 Contribución

1. Crear feature branch desde `development`
2. Implementar cambios con tests
3. Actualizar documentación si es necesario
4. Crear PR hacia `development`

---

**Versión**: 1.0.0  
**Última actualización**: 2026-02-09  
**Autor**: Farutech Development Team
