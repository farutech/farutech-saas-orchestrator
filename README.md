# 🚀 FARUTECH SAAS ORCHESTRATOR

Sistema de orquestación multi-tenant para provisionamiento automatizado de aplicaciones SaaS.

## 📊 Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     FARUTECH ORCHESTRATOR                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   API REST  │────────▶│ NATS Stream  │────────▶│   Worker   │
│   (.NET 9)  │         │  (JetStream) │         │   (Go 1.22)│
└─────────────┘         └──────────────┘         └────────────┘
      │                                                  │
      │                                                  │
      ▼                                                  ▼
┌─────────────┐                               ┌────────────────┐
│  PostgreSQL │                               │   External API │
│   (Catalog  │                               │  (Provisioning)│
│   + Tenants)│                               └────────────────┘
└─────────────┘
```

## ✅ Estado del Proyecto

**TODAS LAS FASES COMPLETADAS + LIMPIEZA DE CÓDIGO** 🎉

- ✅ **FASE 1:** Scaffolding & Setup (.NET 9 + Go 1.22 + Docker)
- ✅ **FASE 2:** Dominio (Entidades Catalog + Tenants con JSONB)
- ✅ **FASE 3:** Infraestructura (EF Core 9.0 + PostgreSQL + Migraciones)
- ✅ **FASE 4:** Workers & Resiliencia (NATS JetStream + Retry + DLQ)
- ✅ **FASE 5:** API & Orquestación (REST API + Message Bus)
- ✅ **FASE 6:** .NET Aspire Orchestration (Migraciones automáticas + Connection Injection)
- ✅ **LIMPIEZA:** Eliminación `init-db.sql` redundante + Conversión a Enums + 0 Warnings

## 📚 Documentación Clave

- [**ASPIRE_CONNECTION_INJECTION.md**](docs/ASPIRE_CONNECTION_INJECTION.md) - Cómo Aspire inyecta connection strings dinámicamente
- [**DEPLOYMENT_ANALYSIS.md**](DEPLOYMENT_ANALYSIS.md) - Dokploy vs Coolify para producción
- [**INFRASTRUCTURE.md**](INFRASTRUCTURE.md) - Infraestructura completa
- [**TEST_PLAN.md**](TEST_PLAN.md) - Plan de pruebas

## 🏗️ Estructura del Proyecto

```
D:\farutech_2025\
├── src/
│   ├── backend-core/                    # .NET 9 Solution
│   │   ├── Farutech.Orchestrator.Domain/
│   │   ├── Farutech.Orchestrator.Application/
│   │   ├── Farutech.Orchestrator.Infrastructure/
│   │   └── Farutech.Orchestrator.API/
│   ├── workers-go/                      # Go 1.22 Workers
│   │   ├── cmd/worker/                  # Worker principal
│   │   ├── cmd/publisher/               # Tool de testing
│   │   └── internal/
│   └── sdk-client/                      # SDK futuro
├── scripts/
│   ├── start-infra.ps1                  # Levantar Docker
│   ├── test-*.ps1                       # Testing automation
│   └── ...
├── docker-compose.yml
├── PROGRESS.md
└── README.md
```

## 🚀 Inicio Rápido

### 1. Levantar Infraestructura

```powershell
cd D:\farutech_2025
.\scripts\start-infra.ps1
```

Esto inicia:
- PostgreSQL 16 en `localhost:5432`
- NATS JetStream en `nats://localhost:4222`
- pgAdmin en `http://localhost:5050`

### 2. Aplicar Migraciones

```powershell
cd D:\farutech_2025\src\backend-core
dotnet ef database update --project Farutech.Orchestrator.Infrastructure
```

### 3. Ejecutar API REST

```powershell
cd D:\farutech_2025\src\backend-core\Farutech.Orchestrator.API
dotnet run
```

La API estará disponible en:
- **Swagger UI:** `https://localhost:5001/swagger`
- **API Base:** `https://localhost:5001/api`

### 4. Ejecutar Worker Go

```powershell
cd D:\farutech_2025\src\workers-go
.\run.ps1
```

O compilar primero:
```powershell
.\build.ps1
.\bin\worker.exe
```

## � Mejoras de Código Recientes

### Eliminación de Warnings de Compilación
- ✅ **0 warnings** en compilación Release
- ✅ Métodos async sin `await` corregidos con `await Task.CompletedTask`
- ✅ API obsoleta de EF Core actualizada (`HasCheckConstraint` → `ToTable().HasCheckConstraint()`)

### Conversión de Campos a Enums
Los campos de texto con valores limitados ahora usan enums tipados:

```csharp
// Antes: string TaskType/Status con valores hardcoded
public string TaskType { get; set; } = "TENANT_PROVISION";
public string Status { get; set; } = "QUEUED";

// Después: Enums tipados con type safety
public ProvisionTaskType TaskType { get; set; } = ProvisionTaskType.TenantProvision;
public ProvisionTaskStatus Status { get; set; } = ProvisionTaskStatus.Queued;
```

**Beneficios:**
- ✅ Type safety en tiempo de compilación
- ✅ IntelliSense y autocompletado
- ✅ Constraints de BD actualizadas automáticamente
- ✅ Migraciones EF Core generadas correctamente

### Eliminación de `init-db.sql` Redundante
- ✅ Base de datos inicializada 100% por código .NET
- ✅ `DatabaseBootstrapService` crea schemas y extensiones
- ✅ EF Core migrations manejan todas las tablas
- ✅ Compatible con .NET Aspire y entornos múltiples

Después de remover el archivo `init-db.sql` redundante, las migraciones de EF Core manejan toda la inicialización de base de datos. Para validar que todo funciona correctamente:

### Validar Migraciones de Base de Datos

```powershell
# Test básico de migraciones
.\scripts\test-database-migration.ps1

# Reset completo de base de datos y test
.\scripts\test-database-migration.ps1 -ResetDatabase

# Test completo con .NET Aspire
.\scripts\test-integration.ps1
```

### Scripts de Testing Disponibles

| Script | Descripción |
|--------|-------------|
| `test-database-migration.ps1` | Valida schemas, extensiones, tablas y constraints |
| `test-integration.ps1` | Test completo de startup con .NET Aspire |
| `reset-database.ps1` | Reset completo de base de datos para testing |
| `test-all.ps1` | Suite completa de testing |

### Verificación Manual

Si prefieres verificar manualmente:

```sql
-- Verificar schemas
SELECT schema_name FROM information_schema.schemata
WHERE schema_name IN ('identity', 'tenants', 'catalog', 'tasks', 'core');

-- Verificar extensiones
SELECT extname FROM pg_extension
WHERE extname IN ('uuid-ossp', 'btree_gin');

-- Verificar tablas clave
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname IN ('identity', 'tenants', 'catalog', 'tasks', 'core');
```

## 📡 Endpoints API

### Provisionar Tenant

```http
POST /api/provisioning/provision
Content-Type: application/json

{
  "customerId": "guid",
  "productId": "guid",
  "environment": "production",
  "moduleIds": ["guid1", "guid2"],
  "customFeatures": {
    "max_users": 100,
    "storage_gb": 50
  }
}
```

**Respuesta:**
```json
{
  "tenantInstanceId": "guid",
  "tenantCode": "acme-production-a1b2c3d4",
  "status": "provisioning",
  "taskId": "guid",
  "createdAt": "2026-01-24T13:20:00Z"
}
```

### Desprovisonar Tenant

```http
DELETE /api/provisioning/{tenantInstanceId}
```

### Actualizar Features

```http
PUT /api/provisioning/{tenantInstanceId}/features
Content-Type: application/json

{
  "max_users": 200,
  "advanced_reports": true
}
```

## 🔧 Stack Tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| **API Backend** | .NET | 9.0 |
| **Workers** | Go | 1.22 |
| **Base de Datos** | PostgreSQL | 16 |
| **Message Queue** | NATS JetStream | 2.10 |
| **ORM** | Entity Framework Core | 9.0 |
| **API Docs** | Swagger/OpenAPI | 3.0 |

## 📦 Dependencias Principales

### .NET
- `Microsoft.EntityFrameworkCore` 9.0.0
- `Npgsql.EntityFrameworkCore.PostgreSQL` 9.0.2
- `NATS.Client.Core` 2.0.0
- `Swashbuckle.AspNetCore` 10.1.0

### Go
- `github.com/nats-io/nats.go` v1.31.0
- `github.com/google/uuid` v1.6.0

## 🎯 Características Clave

### 1. Multi-Tenancy
- Instancias aisladas por tenant
- Features dinámicas con JSONB
- Overrides personalizables por cliente

### 2. Resiliencia
- ✅ Retry exponencial (5 intentos)
- ✅ Dead Letter Queue (DLQ)
- ✅ NATS JetStream persistence
- ✅ Graceful shutdown

### 3. Escalabilidad
- Workers horizontalmente escalables
- Message-driven architecture
- Pull-based consumption (no push overwhelming)

### 4. Observabilidad & Monitoring
- ✅ **Prometheus Metrics** - Métricas detalladas de HTTP, tareas, autenticación y DB
- ✅ **Health Checks** - Endpoints `/health`, `/health/detailed`, `/health/ready`, `/health/live`
- ✅ **Grafana Dashboards** - Visualización completa del sistema
- ✅ **Structured Logging** - Logs estructurados con contexto
- ✅ **NATS Monitoring** - Dashboard en `:8222`

## 🧪 Testing & Validación

### Testing Pipeline Completo

Ejecuta todas las pruebas automatizadas:

```powershell
cd D:\farutech_2025
.\scripts\test-all.ps1
```

Esto ejecuta:
1. **Validación de Infraestructura** - Verifica que todos los servicios estén corriendo
2. **Testing End-to-End** - Prueba el flujo completo de provisionamiento asíncrono
3. **Testing de Carga** - Valida escalabilidad con múltiples requests concurrentes

### Testing Individual

#### Validación de Infraestructura
```powershell
.\scripts\validate-infrastructure.ps1
```
Verifica que API, NATS, PostgreSQL, Prometheus y Grafana estén funcionando.

#### Testing End-to-End
```powershell
.\scripts\test-e2e-async.ps1 -ApiUrl "http://localhost:5000"
```
Prueba el flujo completo: autenticación → provisionamiento → worker callbacks → completion.

#### Testing de Carga
```powershell
.\scripts\test-load-async.ps1 -ConcurrentRequests 5 -TotalRequests 20
```
Simula carga real con requests concurrentes para validar performance.

### Modos de Testing

```powershell
# Modo rápido (omite load testing)
.\scripts\test-all.ps1 -QuickMode

# Solo validación de infraestructura
.\scripts\test-all.ps1 -SkipE2ETesting -SkipLoadTesting

# Testing personalizado
.\scripts\test-all.ps1 -ApiUrl "https://api.farutech.com" -SkipLoadTesting
```

### Métricas de Testing

Los scripts generan reportes detallados incluyendo:
- ✅ Tasa de éxito de requests
- ⏱️  Latencia promedio/máxima
- 📊 Throughput (requests/segundo)
- 🔍 Estado de health checks
- 📈 Cobertura de métricas Prometheus

### Testing Manual

#### Publicar Tareas de Prueba

```powershell
cd D:\farutech_2025\src\workers-go
.\bin\publisher.exe -count 5 -type provision
```

#### Ver Stream NATS

```bash
# Requiere NATS CLI
nats stream info PROVISIONING
nats stream view PROVISIONING --subject provisioning.tasks
```

#### Ver DLQ

```bash
nats stream view PROVISIONING --subject provisioning.dlq
```

#### Monitoring en Producción

- **API Health:** `https://api.farutech.com/api/health`
- **Metrics:** `https://api.farutech.com/metrics`
- **Grafana:** `https://monitoring.farutech.com` (admin/admin)
- **Prometheus:** `https://prometheus.farutech.com`

## 📈 Próximos Pasos (Roadmap)

- [x] Implementar SDK Client
- [x] Agregar autenticación/autorización (JWT Service Tokens)
- [x] Métricas con Prometheus ✅ **COMPLETADO**
- [x] Tracing distribuido (OpenTelemetry)
- [x] Health checks endpoints ✅ **COMPLETADO**
- [x] Unit & Integration tests ✅ **FRAMEWORK CREADO**
- [x] CI/CD pipeline
- [x] Kubernetes deployment manifests
- [x] Replay tool para DLQ
- [ ] Multi-region deployment
- [ ] Auto-scaling basado en métricas
- [ ] Advanced analytics dashboard
- [ ] API rate limiting
- [ ] Backup & disaster recovery automation

## 📝 Documentación Adicional

- [PROGRESS.md](PROGRESS.md) - Control detallado de tareas
- [INFRASTRUCTURE.md](INFRASTRUCTURE.md) - Guía de infraestructura Docker
- [src/workers-go/README.md](src/workers-go/README.md) - Documentación del worker Go
- [Swagger UI](https://localhost:5001/swagger) - API documentation (cuando API esté corriendo)

## 👨‍💻 Desarrollo

### Compilar Todo

```powershell
# Backend .NET
cd D:\farutech_2025\src\backend-core
dotnet build

# Workers Go
cd D:\farutech_2025\src\workers-go
.\build.ps1
```

### Limpiar

```powershell
# .NET
dotnet clean

# Go
cd D:\farutech_2025\src\workers-go
Remove-Item -Recurse -Force bin/
```

## 🔒 Credenciales (Desarrollo)

**PostgreSQL:**
- Host: `localhost:5432`
- Database: `farutech_orchestrator`
- User: `farutech_admin`
- Password: `Dev@2026!Secure`

**pgAdmin:**
- URL: `http://localhost:5050`
- Email: `admin@farutech.local`
- Password: `Admin@2026`

**NATS:**
- Client: `nats://localhost:4222`
- Monitoring: `http://localhost:8222`

---

**Estado:** ✅ **TODAS LAS FASES COMPLETADAS**  
**Última Actualización:** 2026-01-24  
**Build:** ✅ Exitoso (0 errores, 1 warning menor)
