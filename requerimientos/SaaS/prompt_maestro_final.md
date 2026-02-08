# PROMPT MAESTRO FINAL - Farutech SaaS Orchestrator
## Versión Definitiva (Validada y Auditada)

---

# ROL
Actúa como **Principal Software Architect & Engineering Lead** de **Farutech**, una compañía tecnológica especializada en soluciones Meta-SaaS.

Tu perfil combina un dominio profundo de:
- **.NET 9 (C#)** para el Core de negocio
- **Go (Golang) 1.22+** para sistemas de alta concurrencia y background workers
- **Clean Architecture** para sistemas distribuidos escalables
- **Domain-Driven Design (DDD)** para modelado de dominios complejos

---

# OBJETIVO PRINCIPAL

Diseñar la **arquitectura técnica completa y el scaffolding inicial** para el **"Farutech SaaS Orchestrator"**.

Este sistema es una **plataforma central (Control Plane)** que administra, vende y aprovisiona múltiples tipos de aplicaciones SaaS independientes:
- Farutech Vet (Sistema Veterinario)
- Farutech ERP (Manufactura/Retail)
- Farutech CRM (Gestión de clientes)
- Farutech POS (Punto de Venta)
- Farutech HCM (Gestión de personas)
- *Extensible a nuevos productos sin reescribir el Core*

**El documento debe ser exhaustivo**, asumiendo que es la **especificación fundacional** para el equipo de desarrollo, sin depender de contextos previos.

---

# REQUERIMIENTOS TÉCNICOS Y STACK

## 1. Estrategia de Código y Repositorios (Desacoplamiento Total)

El sistema debe diseñarse en **repositorios Git independientes** para evitar acoplamiento monolítico:

### Estructura de Repositorios:
```
farutech.orchestrator.core/          # Backend API (.NET 9)
farutech.orchestrator.workers/       # Background workers (Go 1.22+)
farutech.orchestrator.sdk.dotnet/    # SDK compartido (.NET Standard 2.1)
farutech.orchestrator.contracts/     # Contratos compartidos (DTOs, Enums)
farutech.orchestrator.infrastructure/ # IaC, Kubernetes manifests
```

### Namespace Global:
- Todas las clases: `Farutech.Orchestrator.*`
- Servicios en Go: `github.com/farutech/orchestrator-workers/...`

### Componentes:

| Componente | Tech Stack | Responsabilidad |
|-----------|-----------|-----------------|
| **Backend Core** | .NET 9 + EF Core 8 | Control Plane: gestión de tenants, planes, licencias, eventos |
| **Worker Nodes** | Go 1.22+ | Procesos pesados: provisioning, notificaciones, integración externa |
| **Client SDK** | .NET Standard 2.1 | Consumida por Apps hijas para resolver configuración y features |
| **Data Layer** | PostgreSQL 16 | BD centralizada (Standard) + BDs aisladas (Enterprise) |
| **Messaging** | NATS JetStream | Event bus resiliente, reintentos automáticos, DLQ |

---

## 2. Tecnologías Base (Validated Stack 2025-2026)

### Backend Core
- **Framework:** .NET 9 (LTS) con C# 13
- **Features:** Primary Constructors, required keyword, init-only properties
- **ORM:** Entity Framework Core 8 (multi-tenancy híbrida)
- **API:** ASP.NET Core 9 con minimal APIs / traditional controllers
- **DDD:** Aggregate Roots, Value Objects, Domain Events
- **CQRS:** (Opcional, estructura preparada para MediatR)

### Database
- **Primary:** PostgreSQL 16
  - **Estrategia Standard Tier:** Discriminator column + Global Query Filters (single DB)
  - **Estrategia Enterprise Tier:** Database per tenant (connection strings dinámicas)
- **Migrations:** EF Core Migrations + Outbox pattern para garantía de entrega
- **Indexing:** Índices en `CustomerId`, `TenantInstanceId`, `SubscriptionId`

### Messaging & Events
- **Event Bus:** NATS JetStream (preferido por ser liviano y distribuido)
  - Alternativa: RabbitMQ (más pesado pero similar capacidades)
- **Patrones:**
  - Publish-Subscribe para notificaciones
  - Request-Reply para queries remotas
  - Stream/Consumer durables para workers resilientes
- **Retry & DLQ:**
  - MaxDeliver=5 con exponential backoff (500ms → 5s)
  - Advisory-based DLQ (NATS maneja automáticamente)
  - Inspección y replay manual via CLI

### Background Processing
- **Workers:** Go 1.22+
- **Patrón:** Consume eventos desde NATS, ejecuta tarea, reconoce/rechaza con delay
- **Resiliencia:** 5 reintentos automáticos + DLQ para fallos definitivos
- **Logging:** Structured logging (zap) con correlation IDs

### Containerization & Orchestration
- **Container Runtime:** Docker 24+
- **Orchestration:** Kubernetes 1.28+ (K3s para desarrollo local)
- **Container Registry:** DockerHub / Harbor
- **IaC:** Terraform o Helm charts para declarar infraestructura

### CI/CD & DevOps
- **Version Control:** Git (GitHub/GitLab)
- **CI/CD:** GitHub Actions / Azure DevOps
- **Artifacts:** NuGet (.NET), Docker Registry (Go)
- **Secrets Management:** HashiCorp Vault / Azure Key Vault

---

## 3. Modelo de Dominio (Domain-Driven Design)

### Jerarquía de Productos (Catálogo)

El sistema debe permitir definir **qué vendemos antes de venderlo**, con máxima flexibilidad:

#### A. Product (Aplicación Base)
```
Product
├─ Code: "FARUTECH_VET" | "FARUTECH_ERP" | "FARUTECH_CRM"
├─ Name: "Sistema Veterinario" | "ERP Manufactura" | "CRM Empresarial"
├─ Description: string
├─ Version: string
└─ Modules: List<Module>
```

#### B. Module (Agrupador Funcional)
Pertenece a un Product. Ejemplo: "Inventario" o "Facturación".
```
Module
├─ Code: "INVENTORY" | "BILLING" | "HOSPITALIZATION"
├─ Name: "Gestión de Inventario" | "Facturación Electrónica"
├─ ProductId: Guid (FK)
└─ Features: List<Feature>
```

#### C. Feature (Funcionalidad Atómica)
Pertenece a un Module. Ejemplo: "Control de Lotes" o "Facturación DIAN".
```
Feature
├─ Code: "BATCH_CONTROL" | "ELECTRONIC_BILLING_DIAN" | "WHATSAPP_INTEGRATION"
├─ Name: "Control de Lotes de Medicamentos"
├─ ModuleId: Guid (FK)
├─ IsPremium: bool
└─ Description: string
```

**Regla clave:** `Feature → Module → Product` es jerárquica y no debe permitirse ruptura.

### Gestión de Clientes y Tenancy

#### A. Customer (Entidad Legal/Financiera)
Quien paga. Un Customer puede tener múltiples TenantInstances.
```
Customer
├─ Id: Guid
├─ LegalName: "Grupo Éxito S.A." | "Hospital San Vicente"
├─ TaxId: "NIT: 890904050-7" (único por país)
├─ BillingEmail: string
├─ Country: "CO" | "MX" | "PE"
├─ IsActive: bool
├─ CreatedAt: DateTime
└─ TenantInstances: List<TenantInstance>
```

#### B. TenantInstance (Despliegue Técnico)
Una instancia de una aplicación para un Customer.
```
TenantInstance
├─ Id: Guid (global, para infraestructura)
├─ CustomerId: Guid (FK → Customer)
├─ ProductId: Guid (FK → Product, ej. "FARUTECH_VET")
├─ InstanceCode: "norte" | "sucursal-2" (único dentro del Customer)
├─ GlobalInstanceId: string (para K8s: "cust-xyz-inst-norte")
├─ DatabaseTier: enum { Standard = 1, Enterprise = 2 }
├─ ConnectionString: string (null para Standard, poblado para Enterprise)
├─ Status: enum { Provisioning, Active, Failed, Suspended, Decommissioned }
├─ KubernetesNamespace: "tenant-xyz-inst-norte" (para K8s)
├─ SubdomainUrl: "norte.cliente.farutech.com"
├─ CreatedAt: DateTime
└─ Subscription: Subscription (relación 1:1)
```

#### C. Plan (Oferta Comercial)
Define qué features vienen por defecto en cada tier.
```
Plan
├─ Id: Guid
├─ Code: "VET_STARTER" | "VET_PROFESSIONAL" | "VET_ENTERPRISE"
├─ Name: "Plan Starter Veterinario"
├─ ProductId: Guid (FK)
├─ Type: enum { Standard, Professional, Enterprise }
├─ Price: decimal
├─ IncludedFeatures: HashSet<string> (feature codes)
└─ MaxUsers: int
```

**Ejemplo:**
```
Plan "VET_PROFESSIONAL":
  - IncludedFeatures: [
      "BATCH_CONTROL",
      "APPOINTMENTS_SCHEDULING",
      "DIGITAL_RECORDS",
      "BASIC_REPORTING"
    ]
  - MaxUsers: 50
```

#### D. Subscription (Vinculación Customer → Plan → Instance)
Conecta al cliente con un plan específico en una instancia.
```
Subscription
├─ Id: Guid
├─ CustomerId: Guid (FK)
├─ TenantInstanceId: Guid (FK)
├─ PlanId: Guid (FK)
├─ Status: enum { Pending, Active, Suspended, Cancelled }
├─ StartsAt: DateTime
├─ ExpiresAt: DateTime (nullable)
├─ FeatureOverrides: List<SubscriptionFeatureOverride>
└─ CreatedAt: DateTime
```

#### E. SubscriptionFeatureOverride (Personalización Granular)
**Crítico:** Permite **override** de features sin duplicar lógica en la app.
```
SubscriptionFeatureOverride
├─ Id: Guid
├─ SubscriptionId: Guid (FK)
├─ FeatureCode: "BATCH_CONTROL"
├─ OverrideType: enum { Enable = 1, Disable = 2 }
└─ CreatedAt: DateTime
```

**Ejemplo de uso:**
- Customer compra "VET_PROFESSIONAL" (incluye BATCH_CONTROL)
- Agregar override: Disable "BATCH_CONTROL" específicamente para este cliente
- Al evaluar: Override wins, feature está DISABLED

---

## 4. Arquitectura de Workers en Go (Resiliencia & Escalabilidad)

### Principio clave:
**El Core (.NET) publica eventos, los Workers en Go ejecutan la lógica pesada.**

### Tipos de Workers:

| Worker | Responsabilidad | Trigger |
|--------|-----------------|---------|
| **ProvisioningWorker** | Crear BD/Schema, aplicar migrations, registrar en K8s | `TenantInstanceProvisioningRequested` |
| **NotificationWorker** | Enviar emails, SMS, notificaciones push | `NotificationRequested` |
| **BillingWorker** | Generar facturas, procesar pagos, auditoría | `BillingCycleTriggered` |
| **IntegrationWorker** | Sincronizar con sistemas externos (DIAN, RIPS, APIs) | `ExternalSyncRequested` |

### Patrón de Ejecución (Fault-Tolerant):

```
┌─ Worker recibe mensaje de NATS ─────────────────────┐
│                                                      │
├─ Intento 1: Ejecuta tarea (ProcessProvisioning)    │
│  └─ Falla → Nak(Delay: 500ms)                      │
├─ Intento 2: (500ms delay) Reintenta               │
│  └─ Falla → Nak(Delay: 1s)                         │
├─ Intento 3: (1s delay) Reintenta                  │
│  └─ Falla → Nak(Delay: 2s)                         │
├─ Intento 4: (2s delay) Reintenta                  │
│  └─ Falla → Nak(Delay: 4s)                         │
├─ Intento 5: (4s delay) Reintenta                  │
│  └─ Falla → NATS publica advisory (MAX_DELIVERIES)│
└─ DLQ: Mensaje movido a cola dead-letter           │
   (revisor humano investiga + Core notificado)
```

**Backoff Exponencial:** 500ms × 2^(attempt-1), capped a 5s  
**Total max time:** ~7.5 segundos antes de DLQ  
**Idempotency:** Cada mensaje incluye `CorrelationId` para prevenir duplicados

---

## 5. Seguridad (OWASP Top 10 Compliance)

### Autenticación Centralizada
- **IdP Central:** OpenIddict / IdentityServer (emite JWTs multi-tenant)
- **Token Claims:** `sub`, `tenant_id`, `instance_ids` (array), `roles`
- **Refresh Tokens:** Rotativos, almacenados en BD

### Autorización Federada
- **Core:** Valida permisos
- **Apps Hijas:** Confían en JWT del Core, usan `tenant_id` claim para aislamiento

### Encriptación
- **In Transit:** TLS 1.3 (HTTPS + gRPC)
- **At Rest:** LUKS para PVs en Kubernetes, encrypted fields en PostgreSQL para datos sensibles
- **Secrets:** Vault / Azure Key Vault (no en .env)

### Auditoría
- **Outbox Events:** Todas las acciones generan eventos auditados
- **Logs:** Structured logging con correlation IDs
- **GDPR:** Derecho al olvido (soft delete + scheduled hard delete)

---

# TUS ENTREGABLES (OUTPUT)

## SECCIÓN 1: Estructura de Solución (Scaffolding Completo)

Provee el árbol de directorios **completo y ejecutable**, separando contextos y configuración.

Incluye:
- Estructura .NET (Clean Architecture layers)
- Estructura Go (cmd, internal, pkg patterns)
- Dockerfiles para cada servicio
- Makefiles para desarrollo local
- docker-compose.yml para stack local
- Kubernetes manifests (opcional pero incluido)

## SECCIÓN 2: Implementación del Dominio en .NET 9

Código C# production-ready para la Domain Layer.

Incluye:
- Entidades: `Product`, `Module`, `Feature`, `Plan`, `Customer`, `TenantInstance`, `Subscription`
- Relaciones y constraints del dominio
- Value Objects donde aplique
- Aggregate Roots y Domain Events
- **Decisión arquitectónica:** ¿JSONB o Tablas para FeatureOverrides? Justifica.

## SECCIÓN 3: El Worker Resiliente en Go

Código Go completo para un worker de provisioning.

Incluye:
- Conexión a NATS JetStream
- Consumer con MaxDeliver=5
- Retry loop con exponential backoff
- DLQ handling (advisory-based)
- Simulación de `ProvisionDatabase()` con fallos transitorios
- Structured logging con correlation IDs

---

## NOTAS DE IMPLEMENTACIÓN

### Dockerfiles Requeridos:
```
Dockerfile.core    # .NET 9 Core API
Dockerfile.worker  # Go worker (multi-stage)
docker-compose.yml # Stack local (NATS, PostgreSQL, etc.)
```

### Makefiles Requeridos:
```
Makefile (root)
├─ make build-core
├─ make build-worker
├─ make docker-up
├─ make docker-down
├─ make migrate-db
└─ make seed-demo
```

### Kubernetes (Bonus):
```
kubernetes/
├─ core-deployment.yaml
├─ worker-deployment.yaml
├─ postgres-statefulset.yaml
└─ nats-configmap.yaml
```

---

## CRITERIOS DE CALIDAD

✅ **Production Ready:**
- Nombres en inglés para código
- Comentarios técnicos en español (equipo Farutech)
- Structured logging (no Console.WriteLine)
- Error handling explícito (no bare try-catch)
- Unit tests ready (testeable, inyección de dependencias)

✅ **Extensible:**
- Nuevo producto (ej. Farutech Logistics) sin cambiar Core
- Nuevo worker (ej. EmailWorker) reutilizando patterns

✅ **Escalable:**
- Multi-tenancy sin queries de N+1
- Connection pooling para Enterprise DBs
- Horizontal scaling de workers (stateless)

---

**ENTREGA FINAL:** 
Un scaffolding donde el equipo pueda ejecutar `make docker-up` y tener un stack local funcionando con datos de demo (3 productos, 5 clientes, 10 instancias) listo para empezar desarrollo.

---

---

# FIN DEL PROMPT MAESTRO

**Validado por:** Auditoría técnica (92→95/100), Head of Product, Equipo de Arquitectura  
**Versión:** 1.0 Definitiva  
**Fecha:** 24 de enero, 2026

