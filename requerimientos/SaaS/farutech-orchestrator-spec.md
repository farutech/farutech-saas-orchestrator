# Farutech SaaS Orchestrator
## Especificación Técnica Fundacional v1.0

---

## PREFACIO

Este documento establece la arquitectura técnica, el scaffolding y la implementación inicial del **Farutech SaaS Orchestrator**: una plataforma Meta-SaaS que administra, vende y aprovisiona múltiples aplicaciones independientes (Veterinaria, ERP, CRM, POS, etc.).

**Audiencia:** Equipo técnico completo (Backend, DevOps, QA).  
**Validación:** Cumple con auditoría de seguridad, correcciones de resiliencia, y estándares de desacoplamiento.

---

# SECCIÓN 1: ESTRUCTURA DE SOLUCIÓN (SCAFFOLDING)

## 1.1 Árbol de Directorios Global

```
farutech-orchestrator/
│
├── docs/
│   ├── ADR/                           # Architecture Decision Records
│   │   ├── 001-multi-tenancy-strategy.md
│   │   ├── 002-feature-management.md
│   │   └── 003-event-driven-architecture.md
│   └── API/
│       └── openapi.yaml               # Especificación OpenAPI 3.1
│
├── src/
│   │
│   ├── backend-core/                  # 🟢 .NET 9 | Clean Architecture
│   │   ├── Farutech.Orchestrator.API/
│   │   │   ├── Program.cs
│   │   │   ├── appsettings.json
│   │   │   ├── appsettings.{Environment}.json
│   │   │   ├── Controllers/
│   │   │   │   ├── ProductsController.cs
│   │   │   │   ├── CustomersController.cs
│   │   │   │   ├── SubscriptionsController.cs
│   │   │   │   └── TenantsController.cs
│   │   │   ├── Filters/
│   │   │   │   ├── GlobalExceptionFilter.cs
│   │   │   │   └── TenantResolutionFilter.cs
│   │   │   ├── Middleware/
│   │   │   │   ├── TenantMiddleware.cs
│   │   │   │   └── CorrelationIdMiddleware.cs
│   │   │   ├── Extensions/
│   │   │   │   ├── ServiceCollectionExtensions.cs
│   │   │   │   └── LoggingExtensions.cs
│   │   │   └── Dockerfile
│   │   │
│   │   ├── Farutech.Orchestrator.Application/
│   │   │   ├── Contracts/
│   │   │   │   ├── Requests/
│   │   │   │   │   ├── CreateProductRequest.cs
│   │   │   │   │   ├── ProvisionTenantInstanceRequest.cs
│   │   │   │   │   └── UpdateSubscriptionFeaturesRequest.cs
│   │   │   │   └── Responses/
│   │   │   │       └── ProvisionTenantInstanceResponse.cs
│   │   │   ├── Services/
│   │   │   │   ├── ProductManagementService.cs
│   │   │   │   ├── SubscriptionService.cs
│   │   │   │   ├── TenantProvisioningService.cs
│   │   │   │   └── FeatureEvaluationService.cs
│   │   │   ├── Commands/
│   │   │   │   ├── CreateProductCommand.cs
│   │   │   │   ├── ProvisionTenantInstanceCommand.cs
│   │   │   │   ├── UpdateSubscriptionFeaturesCommand.cs
│   │   │   │   └── Handlers/
│   │   │   │       ├── CreateProductCommandHandler.cs
│   │   │   │       ├── ProvisionTenantInstanceCommandHandler.cs
│   │   │   │       └── UpdateSubscriptionFeaturesCommandHandler.cs
│   │   │   ├── Queries/
│   │   │   │   ├── GetCustomerQuery.cs
│   │   │   │   ├── GetActiveSubscriptionQuery.cs
│   │   │   │   └── Handlers/
│   │   │   │       └── GetCustomerQueryHandler.cs
│   │   │   └── Mapper/
│   │   │       └── ApplicationMapper.cs
│   │   │
│   │   ├── Farutech.Orchestrator.Domain/
│   │   │   ├── Aggregates/
│   │   │   │   ├── Product/
│   │   │   │   │   ├── Product.cs              # Root Aggregate
│   │   │   │   │   ├── Module.cs               # Value Object
│   │   │   │   │   ├── Feature.cs              # Value Object
│   │   │   │   │   ├── ProductStatus.cs
│   │   │   │   │   └── Events/
│   │   │   │   │       └── ProductCreatedEvent.cs
│   │   │   │   │
│   │   │   │   ├── Subscription/
│   │   │   │   │   ├── Subscription.cs         # Root Aggregate
│   │   │   │   │   ├── Plan.cs                 # Value Object
│   │   │   │   │   ├── FeatureOverride.cs      # Value Object
│   │   │   │   │   ├── SubscriptionStatus.cs
│   │   │   │   │   └── Events/
│   │   │   │   │       ├── SubscriptionCreatedEvent.cs
│   │   │   │   │       └── FeaturesUpdatedEvent.cs
│   │   │   │   │
│   │   │   │   └── TenantInstance/
│   │   │   │       ├── TenantInstance.cs       # Root Aggregate
│   │   │   │       ├── InstanceStatus.cs
│   │   │   │       └── Events/
│   │   │   │           ├── InstanceProvisioningRequestedEvent.cs
│   │   │   │           └── InstanceProvisioningFailedEvent.cs
│   │   │   │
│   │   │   ├── Entities/
│   │   │   │   ├── Customer.cs
│   │   │   │   └── Entity.cs                   # Base clase
│   │   │   │
│   │   │   ├── ValueObjects/
│   │   │   │   ├── Money.cs
│   │   │   │   ├── Email.cs
│   │   │   │   ├── PhoneNumber.cs
│   │   │   │   └── GlobalInstanceId.cs
│   │   │   │
│   │   │   ├── Repositories/
│   │   │   │   ├── IProductRepository.cs
│   │   │   │   ├── ICustomerRepository.cs
│   │   │   │   ├── ISubscriptionRepository.cs
│   │   │   │   ├── ITenantInstanceRepository.cs
│   │   │   │   └── IUnitOfWork.cs
│   │   │   │
│   │   │   ├── Events/
│   │   │   │   └── IDomainEvent.cs
│   │   │   │
│   │   │   └── Exceptions/
│   │   │       ├── DomainException.cs
│   │   │       ├── InvalidProductException.cs
│   │   │       └── SubscriptionNotFoundException.cs
│   │   │
│   │   ├── Farutech.Orchestrator.Infrastructure/
│   │   │   ├── Data/
│   │   │   │   ├── OrchestratorDbContext.cs
│   │   │   │   ├── Migrations/
│   │   │   │   │   ├── Initial_CreateProductsTable.cs
│   │   │   │   │   └── ...
│   │   │   │   ├── Repositories/
│   │   │   │   │   ├── ProductRepository.cs
│   │   │   │   │   ├── CustomerRepository.cs
│   │   │   │   │   ├── SubscriptionRepository.cs
│   │   │   │   │   ├── TenantInstanceRepository.cs
│   │   │   │   │   └── UnitOfWork.cs
│   │   │   │   ├── EntityConfigurations/
│   │   │   │   │   ├── ProductEntityConfiguration.cs
│   │   │   │   │   └── SubscriptionEntityConfiguration.cs
│   │   │   │   └── Seeders/
│   │   │   │       └── InitialDataSeeder.cs
│   │   │   │
│   │   │   ├── Messaging/
│   │   │   │   ├── NatsEventBusPublisher.cs    # Implementación NATS
│   │   │   │   ├── RabbitMqEventBusPublisher.cs # Alternativa RabbitMQ
│   │   │   │   ├── EventPublishingOutboxProcessor.cs
│   │   │   │   ├── Outbox/
│   │   │   │   │   ├── OutboxEvent.cs
│   │   │   │   │   ├── IOutboxRepository.cs
│   │   │   │   │   └── OutboxRepository.cs
│   │   │   │   └── Models/
│   │   │   │       └── DomainEventMessage.cs
│   │   │   │
│   │   │   ├── Features/
│   │   │   │   ├── LicenseFeatureFilter.cs     # Microsoft.FeatureManagement
│   │   │   │   └── LicenseFeatureContext.cs
│   │   │   │
│   │   │   ├── ExternalServices/
│   │   │   │   ├── KubernetesClient.cs         # Para provisioning
│   │   │   │   ├── DatabaseProvisioningClient.cs
│   │   │   │   └── Contracts/
│   │   │   │       └── ProvisioningRequest.cs
│   │   │   │
│   │   │   └── Configuration/
│   │   │       ├── InfrastructureConfiguration.cs
│   │   │       └── Options/
│   │   │           ├── NatsOptions.cs
│   │   │           ├── DatabaseOptions.cs
│   │   │           └── KubernetesOptions.cs
│   │   │
│   │   ├── Farutech.Orchestrator.sln
│   │   ├── Directory.Build.props
│   │   ├── .editorconfig
│   │   ├── Dockerfile
│   │   ├── Dockerfile.dev
│   │   ├── Makefile
│   │   └── README.md
│   │
│   ├── workers-go/                    # 🔵 Go 1.22+ | Background Processing
│   │   ├── cmd/
│   │   │   ├── provisioning-worker/
│   │   │   │   ├── main.go
│   │   │   │   └── config.go
│   │   │   ├── notification-worker/
│   │   │   │   ├── main.go
│   │   │   │   └── config.go
│   │   │   └── cleanup-worker/
│   │   │       ├── main.go
│   │   │       └── config.go
│   │   │
│   │   ├── internal/
│   │   │   ├── provisioning/
│   │   │   │   ├── handler.go              # Consumidor de eventos
│   │   │   │   ├── provisioner.go          # Lógica de provisioning
│   │   │   │   ├── database.go             # Provisioning de BD
│   │   │   │   ├── kubernetes.go           # Interacción K8s
│   │   │   │   ├── retry.go                # Lógica de reintentos
│   │   │   │   └── dlq.go                  # Dead Letter Queue handling
│   │   │   │
│   │   │   ├── notification/
│   │   │   │   ├── handler.go
│   │   │   │   ├── emailsender.go
│   │   │   │   ├── webhooksender.go
│   │   │   │   └── retry.go
│   │   │   │
│   │   │   ├── messaging/
│   │   │   │   ├── nats_subscriber.go      # Cliente NATS JetStream
│   │   │   │   ├── rabbitmq_subscriber.go  # Alternativa RabbitMQ
│   │   │   │   └── event_models.go         # Structs de eventos
│   │   │   │
│   │   │   ├── logger/
│   │   │   │   └── logger.go               # Structured logging con zap
│   │   │   │
│   │   │   └── config/
│   │   │       ├── config.go
│   │   │       └── environment.go
│   │   │
│   │   ├── pkg/
│   │   │   ├── retry/
│   │   │   │   ├── exponential_backoff.go  # Estrategia de backoff
│   │   │   │   ├── jitter.go               # Jitter para evitar thundering herd
│   │   │   │   └── retry.go                # Lógica de reintento genérica
│   │   │   │
│   │   │   ├── k8sclient/
│   │   │   │   ├── client.go
│   │   │   │   ├── deployment.go
│   │   │   │   └── namespace.go
│   │   │   │
│   │   │   └── validators/
│   │   │       └── instance_validator.go
│   │   │
│   │   ├── tests/
│   │   │   ├── provisioning_test.go
│   │   │   ├── retry_test.go
│   │   │   └── fixtures/
│   │   │       └── events.go
│   │   │
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── Dockerfile
│   │   ├── Dockerfile.dev
│   │   ├── Makefile
│   │   ├── .env.example
│   │   └── README.md
│   │
│   └── sdk-client/                    # 🟡 .NET Standard 2.1 | NuGet Package
│       ├── Farutech.Orchestrator.SDK/
│       │   ├── Configuration/
│       │   │   ├── OrchestratorClientOptions.cs
│       │   │   └── FeatureManagementExtensions.cs
│       │   │
│       │   ├── Clients/
│       │   │   ├── OrchestratorClient.cs      # Cliente HTTP
│       │   │   ├── Features/
│       │   │   │   └── FeatureClient.cs       # Evaluación de features
│       │   │   └── Subscriptions/
│       │   │       └── SubscriptionClient.cs
│       │   │
│       │   ├── Models/
│       │   │   ├── Feature.cs
│       │   │   ├── Subscription.cs
│       │   │   └── TenantConfiguration.cs
│       │   │
│       │   ├── Middleware/
│       │   │   └── TenantContextMiddleware.cs
│       │   │
│       │   └── Farutech.Orchestrator.SDK.csproj
│       │
│       ├── Farutech.Orchestrator.SDK.Tests/
│       │   └── ...
│       │
│       ├── Farutech.Orchestrator.SDK.sln
│       ├── Directory.Build.props
│       ├── Makefile
│       └── README.md
│
├── infra/                             # 🔧 Infraestructura como Código
│   ├── docker-compose.yml             # Desarrollo local
│   ├── docker-compose.prod.yml        # Producción
│   ├── kubernetes/
│   │   ├── base/
│   │   │   ├── orchestrator-api.yaml
│   │   │   ├── provisioning-worker.yaml
│   │   │   ├── nats.yaml
│   │   │   └── postgres.yaml
│   │   ├── overlays/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── prod/
│   │   └── scripts/
│   │       └── deploy.sh
│   │
│   ├── terraform/                    # IaC para cloud (AWS/GCP/Azure)
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── modules/
│   │   │   ├── kubernetes/
│   │   │   ├── database/
│   │   │   └── networking/
│   │   └── environments/
│   │       ├── dev/
│   │       ├── staging/
│   │       └── prod/
│   │
│   ├── helm/
│   │   └── farutech-orchestrator/
│   │       ├── Chart.yaml
│   │       ├── values.yaml
│   │       ├── values-dev.yaml
│   │       └── templates/
│   │
│   └── monitoring/
│       ├── prometheus/
│       │   └── prometheus.yml
│       ├── grafana/
│       │   └── dashboards/
│       └── alerting/
│           └── alerts.yml
│
├── tests/
│   ├── integration/
│   │   ├── api_tests.cs
│   │   ├── provisioning_tests.cs
│   │   └── messaging_tests.cs
│   │
│   ├── performance/
│   │   └── k6_scripts/
│   │       └── subscription_load_test.js
│   │
│   └── e2e/
│       └── playwright/
│           └── full_flow.spec.ts
│
├── .github/
│   ├── workflows/
│   │   ├── ci-backend.yml
│   │   ├── ci-workers.yml
│   │   ├── ci-sdk.yml
│   │   └── cd-deploy.yml
│   │
│   └── ISSUE_TEMPLATE/
│       └── bug_report.md
│
├── scripts/
│   ├── setup-dev-environment.sh
│   ├── run-migrations.sh
│   ├── seed-initial-data.sh
│   └── generate-api-docs.sh
│
├── docker-compose.yml
├── docker-compose.override.yml
├── Makefile                           # Orquestador central de tareas
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
└── README.md
```

---

## 1.2 Descripción de Cada Directorio Clave

### Backend Core (.NET 9)

| Carpeta | Propósito |
|---------|-----------|
| `API/` | Controllers REST, Filters, Middleware, Configuración de Startup |
| `Application/` | Casos de uso (Commands, Queries, Services), DTOs, Mappings |
| `Domain/` | Lógica de negocio (Aggregates, ValueObjects, Repositories, Events) |
| `Infrastructure/` | Implementación técnica (EF Core, Repositories, NATS, Features) |
| `Dockerfile` | Imagen para deployment del API |

**Principio:** Domain → Application → Infrastructure → API (dependencias unidireccionales).

### Workers Go

| Carpeta | Propósito |
|---------|-----------|
| `cmd/` | Puntos de entrada (main.go) para cada worker |
| `internal/` | Lógica privada de cada worker (handlers, provisioners, retry logic) |
| `pkg/` | Código reutilizable (retry, validators, k8s client) |
| `tests/` | Unit & integration tests |

**Principio:** Cada worker es autónomo. `cmd/provisioning-worker` no depende de `cmd/notification-worker`.

### SDK Client (.NET Standard)

| Carpeta | Propósito |
|---------|-----------|
| `Clients/` | Wrappers HTTP para comunicarse con el Core |
| `Models/` | Tipos que las App hijas consumen |
| `Middleware/` | Extensiones para integración en ASP.NET |

**Principio:** Es una librería NuGet que se publica independientemente.

---

## 1.3 Dockerfiles y Makefiles (Despliegue Independiente)

### Backend Core - Dockerfile
```dockerfile
# src/backend-core/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder
WORKDIR /src

COPY ["Farutech.Orchestrator.API/Farutech.Orchestrator.API.csproj", "Farutech.Orchestrator.API/"]
COPY ["Farutech.Orchestrator.Application/Farutech.Orchestrator.Application.csproj", "Farutech.Orchestrator.Application/"]
COPY ["Farutech.Orchestrator.Domain/Farutech.Orchestrator.Domain.csproj", "Farutech.Orchestrator.Domain/"]
COPY ["Farutech.Orchestrator.Infrastructure/Farutech.Orchestrator.Infrastructure.csproj", "Farutech.Orchestrator.Infrastructure/"]

RUN dotnet restore "Farutech.Orchestrator.API/Farutech.Orchestrator.API.csproj"

COPY . .
WORKDIR "/src/Farutech.Orchestrator.API"

RUN dotnet build -c Release -o /app/build
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=builder /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000

EXPOSE 5000
ENTRYPOINT ["dotnet", "Farutech.Orchestrator.API.dll"]
```

### Workers Go - Dockerfile
```dockerfile
# src/workers-go/Dockerfile
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o provisioning-worker ./cmd/provisioning-worker/main.go

FROM alpine:3.19
RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY --from=builder /app/provisioning-worker .

EXPOSE 8080
ENTRYPOINT ["./provisioning-worker"]
```

### Makefile Central
```makefile
# Makefile (root)
.PHONY: help setup-dev up down logs test build deploy clean

help:
	@echo "Farutech SaaS Orchestrator - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make setup-dev              Setup local environment"
	@echo "  make up                     Start all services (docker-compose)"
	@echo "  make down                   Stop all services"
	@echo "  make logs                   View service logs"
	@echo ""
	@echo "Testing:"
	@echo "  make test                   Run all tests"
	@echo "  make test-backend           Run .NET tests"
	@echo "  make test-workers           Run Go tests"
	@echo ""
	@echo "Building:"
	@echo "  make build                  Build all Docker images"
	@echo "  make build-backend          Build .NET image"
	@echo "  make build-workers          Build Go workers image"
	@echo ""
	@echo "Database:"
	@echo "  make migrate                Run EF Core migrations"
	@echo "  make seed                   Seed initial data"
	@echo ""

setup-dev:
	cp .env.example .env
	docker-compose pull
	$(MAKE) migrate
	$(MAKE) seed
	@echo "✅ Development environment ready"

up:
	docker-compose up -d
	@echo "✅ Services started. Check logs with: make logs"

down:
	docker-compose down

logs:
	docker-compose logs -f

test:
	$(MAKE) test-backend
	$(MAKE) test-workers

test-backend:
	cd src/backend-core && dotnet test --logger "console;verbosity=minimal"

test-workers:
	cd src/workers-go && go test ./...

build:
	$(MAKE) build-backend
	$(MAKE) build-workers

build-backend:
	docker build -t farutech/orchestrator-api:latest -f src/backend-core/Dockerfile src/backend-core

build-workers:
	docker build -t farutech/provisioning-worker:latest -f src/workers-go/Dockerfile src/workers-go

migrate:
	cd src/backend-core && dotnet ef database update

seed:
	cd src/backend-core && dotnet run --project Farutech.Orchestrator.API -- --seed

deploy:
	kubectl apply -k infra/kubernetes/overlays/prod
	@echo "✅ Deployment started"

clean:
	docker-compose down -v
	rm -rf bin obj
	rm -f .env
```

---

# SECCIÓN 2: IMPLEMENTACIÓN DEL DOMINIO EN .NET 9

## 2.1 Estructura Base: Entity y AggregateRoot

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Entities/Entity.cs
using System;
using System.Collections.Generic;

namespace Farutech.Orchestrator.Domain.Entities;

/// <summary>
/// Clase base para todas las entidades del dominio.
/// Proporciona identidad y manejo de eventos de dominio.
/// </summary>
public abstract class Entity
{
    public Guid Id { get; protected set; } = Guid.NewGuid();

    protected List<IDomainEvent> _domainEvents = new();

    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void RaiseDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }

    public override bool Equals(object? obj)
    {
        if (obj is not Entity other)
            return false;

        if (ReferenceEquals(this, other))
            return true;

        if (GetType() != other.GetType())
            return false;

        return Id == other.Id;
    }

    public override int GetHashCode()
        => Id.GetHashCode();
}
```

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Events/IDomainEvent.cs
namespace Farutech.Orchestrator.Domain.Events;

/// <summary>
/// Interfaz que marca un evento de dominio.
/// Se publica al Outbox para asegurar consistencia eventual.
/// </summary>
public interface IDomainEvent
{
    Guid AggregateId { get; }
    DateTime OccurredAtUtc { get; }
    string CorrelationId { get; }
}
```

---

## 2.2 Catálogo de Software: Product, Module, Feature

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Aggregates/Product/Feature.cs
namespace Farutech.Orchestrator.Domain.Aggregates.Product;

/// <summary>
/// ValueObject que representa una funcionalidad atómica.
/// Ejemplo: "Control de Lotes", "Consultas por WhatsApp", "Soporte Multi-moneda"
/// </summary>
public sealed record Feature
{
    public required string Code { get; init; }           // "batch_control", "whatsapp_consults"
    public required string Name { get; init; }          // Display name
    public required string Description { get; init; }
    public bool IsPremium { get; init; }                // Feature premium o standard
    public required Guid ModuleId { get; init; }        // Pertenece a un módulo

    public override string ToString()
        => $"{Code} ({Name})";
}
```

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Aggregates/Product/Module.cs
using System;
using System.Collections.Generic;
using System.Linq;

namespace Farutech.Orchestrator.Domain.Aggregates.Product;

/// <summary>
/// ValueObject que representa un agrupador funcional.
/// Ejemplo: "Inventario", "Hospitalización", "Facturación Electrónica"
/// </summary>
public sealed record Module
{
    public required string Code { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required List<Feature> Features { get; init; } = new();

    public IReadOnlyList<Feature> GetFeatures()
        => Features.AsReadOnly();

    public void AddFeature(Feature feature)
    {
        if (Features.Any(f => f.Code == feature.Code))
            throw new InvalidOperationException($"Feature '{feature.Code}' already exists in module '{Code}'");

        Features.Add(feature);
    }

    public override string ToString()
        => $"{Code} ({Name}) - {Features.Count} features";
}
```

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Aggregates/Product/Product.cs
using System;
using System.Collections.Generic;
using System.Linq;
using Farutech.Orchestrator.Domain.Aggregates.Product.Events;
using Farutech.Orchestrator.Domain.Entities;

namespace Farutech.Orchestrator.Domain.Aggregates.Product;

/// <summary>
/// Aggregate Root: Define una aplicación SaaS vendible (Veterinaria, ERP, CRM, etc.)
/// 
/// Estructura jerárquica:
///   Product
///     ├── Module (Inventario)
///     │     ├── Feature (Control de Lotes)
///     │     └── Feature (Códigos de Barras)
///     └── Module (Facturación)
///           ├── Feature (Facturación Local)
///           └── Feature (Facturación Electrónica)
/// </summary>
public sealed class Product : Entity
{
    public string Code { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public ProductStatus Status { get; private set; }
    public List<Module> Modules { get; private set; } = new();
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }
    public string Owner { get; private set; } = string.Empty;  // Usuario o equipo responsable

    private Product() { } // EF Core

    /// <summary>
    /// Factory method para crear un producto nuevo.
    /// </summary>
    public static Result<Product> Create(
        string code,
        string name,
        string description,
        string owner)
    {
        if (string.IsNullOrWhiteSpace(code))
            return Result<Product>.Failure("Product code is required");

        if (string.IsNullOrWhiteSpace(name))
            return Result<Product>.Failure("Product name is required");

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Code = code.ToLowerInvariant(),
            Name = name,
            Description = description,
            Owner = owner,
            Status = ProductStatus.Draft,
            CreatedAtUtc = DateTime.UtcNow,
            Modules = new()
        };

        product.RaiseDomainEvent(new ProductCreatedEvent
        {
            AggregateId = product.Id,
            ProductCode = product.Code,
            ProductName = product.Name,
            OccurredAtUtc = DateTime.UtcNow,
            CorrelationId = Activity.Current?.Id ?? ""
        });

        return Result<Product>.Success(product);
    }

    /// <summary>
    /// Agrega un módulo a este producto.
    /// </summary>
    public Result AddModule(Module module)
    {
        if (Status != ProductStatus.Draft)
            return Result.Failure("Cannot add modules to a published product");

        if (Modules.Any(m => m.Code == module.Code))
            return Result.Failure($"Module '{module.Code}' already exists");

        Modules.Add(module);
        UpdatedAtUtc = DateTime.UtcNow;

        return Result.Success();
    }

    /// <summary>
    /// Publica el producto. Una vez publicado no puede modificarse.
    /// </summary>
    public Result Publish()
    {
        if (!Modules.Any())
            return Result.Failure("Product must have at least one module to publish");

        Status = ProductStatus.Published;
        UpdatedAtUtc = DateTime.UtcNow;

        RaiseDomainEvent(new ProductPublishedEvent
        {
            AggregateId = Id,
            ProductCode = Code,
            OccurredAtUtc = DateTime.UtcNow,
            CorrelationId = Activity.Current?.Id ?? ""
        });

        return Result.Success();
    }

    /// <summary>
    /// Obtiene todas las features de un módulo específico.
    /// </summary>
    public IEnumerable<Feature>? GetModuleFeatures(string moduleCode)
    {
        return Modules
            .FirstOrDefault(m => m.Code == moduleCode)?
            .GetFeatures();
    }
}

public enum ProductStatus
{
    Draft,
    Published,
    Deprecated,
    Archived
}

// Events
namespace Farutech.Orchestrator.Domain.Aggregates.Product.Events;

public sealed record ProductCreatedEvent : IDomainEvent
{
    public required Guid AggregateId { get; init; }
    public required string ProductCode { get; init; }
    public required string ProductName { get; init; }
    public DateTime OccurredAtUtc { get; init; }
    public string CorrelationId { get; init; } = string.Empty;
}

public sealed record ProductPublishedEvent : IDomainEvent
{
    public required Guid AggregateId { get; init; }
    public required string ProductCode { get; init; }
    public DateTime OccurredAtUtc { get; init; }
    public string CorrelationId { get; init; } = string.Empty;
}
```

---

## 2.3 Gestión de Clientes y Tenancy

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Aggregates/Customer/Customer.cs
using System;
using Farutech.Orchestrator.Domain.Entities;

namespace Farutech.Orchestrator.Domain.Aggregates.Customer;

/// <summary>
/// Entity: Representa la entidad legal/financiera que contrata servicios.
/// Un Customer puede tener múltiples TenantInstances de diferentes productos.
/// </summary>
public sealed class Customer : Entity
{
    public string LegalName { get; private set; } = string.Empty;
    public string TaxId { get; private set; } = string.Empty;                    // ID tributario (RUT, RFC, NIT, etc.)
    public string Email { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public CustomerStatus Status { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }
    public string Country { get; private set; } = string.Empty;
    public string? BillingAddress { get; private set; }

    private Customer() { } // EF Core

    public static Result<Customer> Create(
        string legalName,
        string taxId,
        string email,
        string phoneNumber,
        string country,
        string? billingAddress = null)
    {
        if (string.IsNullOrWhiteSpace(legalName))
            return Result<Customer>.Failure("Legal name is required");

        if (string.IsNullOrWhiteSpace(taxId))
            return Result<Customer>.Failure("Tax ID is required");

        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            LegalName = legalName,
            TaxId = taxId,
            Email = email,
            PhoneNumber = phoneNumber,
            Country = country,
            BillingAddress = billingAddress,
            Status = CustomerStatus.Active,
            CreatedAtUtc = DateTime.UtcNow
        };

        return Result<Customer>.Success(customer);
    }

    public void Deactivate()
    {
        Status = CustomerStatus.Inactive;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void UpdateContact(string email, string phoneNumber)
    {
        Email = email;
        PhoneNumber = phoneNumber;
        UpdatedAtUtc = DateTime.UtcNow;
    }
}

public enum CustomerStatus
{
    Active,
    Inactive,
    Suspended
}
```

---

## 2.4 TenantInstance: El Despliegue Técnico

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Aggregates/TenantInstance/GlobalInstanceId.cs
using System;

namespace Farutech.Orchestrator.Domain.Aggregates.TenantInstance;

/// <summary>
/// ValueObject: Identificador global único para infraestructura.
/// Formato: farutech-{instanceCode}-{guid}
/// Ejemplo: farutech-norte-7f3b9c2e-1a5d-4c2a-9f8e-d3b5c8a1f6e9
/// </summary>
public sealed record GlobalInstanceId
{
    public string Value { get; }

    public GlobalInstanceId(string instanceCode, Guid uniqueId)
    {
        Value = $"farutech-{instanceCode.ToLowerInvariant()}-{uniqueId:d}";
    }

    public static GlobalInstanceId Create(string instanceCode) 
        => new(instanceCode, Guid.NewGuid());

    public override string ToString()
        => Value;
}
```

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Aggregates/TenantInstance/TenantInstance.cs
using System;
using System.Collections.Generic;
using Farutech.Orchestrator.Domain.Aggregates.TenantInstance.Events;
using Farutech.Orchestrator.Domain.Entities;

namespace Farutech.Orchestrator.Domain.Aggregates.TenantInstance;

/// <summary>
/// Aggregate Root: El despliegue técnico de una aplicación para un cliente.
/// 
/// Ejemplo: Cliente "Grupo Éxito" compra "Sistema Veterinario"
///   - Crea una instancia con code="norte" → GlobalInstanceId="farutech-norte-xxxx"
///   - Crea otra instancia con code="sur" → GlobalInstanceId="farutech-sur-yyyy"
/// 
/// Cada instancia es completamente independiente:
///   - BD propia (si Enterprise) o lógica (si Standard)
///   - Namespace K8s propio
///   - Variables de entorno específicas
/// </summary>
public sealed class TenantInstance : Entity
{
    public Guid CustomerId { get; private set; }
    public Guid ProductId { get; private set; }
    public string InstanceCode { get; private set; } = string.Empty;            // "norte", "sur", "production", etc.
    public GlobalInstanceId GlobalInstanceId { get; private set; } = null!;
    public InstanceStatus Status { get; private set; }
    public string DatabaseTier { get; private set; } = string.Empty;             // "standard" o "enterprise"
    public string? DatabaseConnectionString { get; private set; }
    public string? KubernetesNamespace { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? ProvisionedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }
    public string? ProvisioningErrorMessage { get; private set; }

    private TenantInstance() { } // EF Core

    /// <summary>
    /// Factory: Crea una nueva instancia en estado "Requested".
    /// El provisioning ocurre en background mediante Workers.
    /// </summary>
    public static Result<TenantInstance> Create(
        Guid customerId,
        Guid productId,
        string instanceCode,
        string databaseTier)
    {
        if (customerId == Guid.Empty)
            return Result<TenantInstance>.Failure("CustomerId is required");

        if (productId == Guid.Empty)
            return Result<TenantInstance>.Failure("ProductId is required");

        if (string.IsNullOrWhiteSpace(instanceCode))
            return Result<TenantInstance>.Failure("InstanceCode is required");

        if (!new[] { "standard", "enterprise" }.Contains(databaseTier.ToLower()))
            return Result<TenantInstance>.Failure("DatabaseTier must be 'standard' or 'enterprise'");

        var globalInstanceId = GlobalInstanceId.Create(instanceCode);
        var instance = new TenantInstance
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            ProductId = productId,
            InstanceCode = instanceCode.ToLowerInvariant(),
            GlobalInstanceId = globalInstanceId,
            DatabaseTier = databaseTier.ToLowerInvariant(),
            Status = InstanceStatus.Requested,
            CreatedAtUtc = DateTime.UtcNow
        };

        // Publica evento para que Worker comience provisioning
        instance.RaiseDomainEvent(new InstanceProvisioningRequestedEvent
        {
            AggregateId = instance.Id,
            TenantInstanceId = instance.GlobalInstanceId.Value,
            CustomerId = customerId,
            ProductId = productId,
            DatabaseTier = databaseTier,
            OccurredAtUtc = DateTime.UtcNow,
            CorrelationId = Activity.Current?.Id ?? ""
        });

        return Result<TenantInstance>.Success(instance);
    }

    /// <summary>
    /// Marca la instancia como aprovisionada (éxito).
    /// </summary>
    public void MarkProvisioned(string connectionString, string kubernetesNamespace)
    {
        Status = InstanceStatus.Provisioned;
        DatabaseConnectionString = connectionString;
        KubernetesNamespace = kubernetesNamespace;
        ProvisionedAtUtc = DateTime.UtcNow;
        UpdatedAtUtc = DateTime.UtcNow;

        RaiseDomainEvent(new InstanceProvisioningCompletedEvent
        {
            AggregateId = Id,
            TenantInstanceId = GlobalInstanceId.Value,
            OccurredAtUtc = DateTime.UtcNow,
            CorrelationId = Activity.Current?.Id ?? ""
        });
    }

    /// <summary>
    /// Marca la instancia como fallida (error permanente después de 5 reintentos).
    /// </summary>
    public void MarkProvisioningFailed(string errorMessage)
    {
        Status = InstanceStatus.ProvisioningFailed;
        ProvisioningErrorMessage = errorMessage;
        UpdatedAtUtc = DateTime.UtcNow;

        RaiseDomainEvent(new InstanceProvisioningFailedEvent
        {
            AggregateId = Id,
            TenantInstanceId = GlobalInstanceId.Value,
            ErrorMessage = errorMessage,
            OccurredAtUtc = DateTime.UtcNow,
            CorrelationId = Activity.Current?.Id ?? ""
        });
    }

    /// <summary>
    /// Solicita deprovisioning de la instancia.
    /// </summary>
    public Result RequestDeprovision()
    {
        if (Status != InstanceStatus.Provisioned)
            return Result.Failure("Can only deprovision instances in 'Provisioned' status");

        Status = InstanceStatus.DeprovisioningRequested;
        UpdatedAtUtc = DateTime.UtcNow;

        return Result.Success();
    }
}

public enum InstanceStatus
{
    Requested,                  // Solicitud creada, esperando provisioning
    Provisioning,               // En proceso de provisioning
    Provisioned,                // ✅ Listo para usar
    ProvisioningFailed,         // ❌ Falló después de 5 reintentos
    DeprovisioningRequested,    // Solicitud de deprovision
    Deprovisioned              // Deprovisionado
}

// Events
namespace Farutech.Orchestrator.Domain.Aggregates.TenantInstance.Events;

public sealed record InstanceProvisioningRequestedEvent : IDomainEvent
{
    public required Guid AggregateId { get; init; }
    public required string TenantInstanceId { get; init; }
    public required Guid CustomerId { get; init; }
    public required Guid ProductId { get; init; }
    public required string DatabaseTier { get; init; }
    public DateTime OccurredAtUtc { get; init; }
    public string CorrelationId { get; init; } = string.Empty;
}

public sealed record InstanceProvisioningCompletedEvent : IDomainEvent
{
    public required Guid AggregateId { get; init; }
    public required string TenantInstanceId { get; init; }
    public DateTime OccurredAtUtc { get; init; }
    public string CorrelationId { get; init; } = string.Empty;
}

public sealed record InstanceProvisioningFailedEvent : IDomainEvent
{
    public required Guid AggregateId { get; init; }
    public required string TenantInstanceId { get; init; }
    public required string ErrorMessage { get; init; }
    public DateTime OccurredAtUtc { get; init; }
    public string CorrelationId { get; init; } = string.Empty;
}
```

---

## 2.5 Plan y Subscription: Comercialización y Feature Overrides

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Aggregates/Subscription/Plan.cs
using System;
using System.Collections.Generic;

namespace Farutech.Orchestrator.Domain.Aggregates.Subscription;

/// <summary>
/// ValueObject: Define un plan comercial (Starter, Professional, Enterprise, etc.)
/// con features incluidas y políticas de soporte.
/// </summary>
public sealed record Plan
{
    public required string Name { get; init; }                           // "Starter", "Pro", "Enterprise"
    public required List<string> IncludedFeatureCodes { get; init; }     // ["batch_control", "barcode"]
    public required decimal MonthlyPriceUsd { get; init; }
    public required int MaxTenantInstances { get; init; }
    public required int MaxConcurrentUsers { get; init; }
    public required int StorageGbIncluded { get; init; }
    public string SupportLevel { get; init; } = "email";                // "email", "priority", "dedicated"
    public bool HasSLA { get; init; }

    public override string ToString() 
        => $"{Name} (${MonthlyPriceUsd}/mo) - {IncludedFeatureCodes.Count} features";
}
```

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Aggregates/Subscription/FeatureOverride.cs
namespace Farutech.Orchestrator.Domain.Aggregates.Subscription;

/// <summary>
/// ValueObject: Permite customización granular de features por suscripción.
/// 
/// Ejemplo: Cliente contrata plan "Pro" que incluye "Facturación Local",
/// pero quiere agregar "Facturación Electrónica" (normalmente en Enterprise).
/// O bien, quiere DESACTIVAR una feature que el plan incluye.
/// </summary>
public sealed record FeatureOverride
{
    public required string FeatureCode { get; init; }
    public required FeatureOverrideType OverrideType { get; init; }

    public override string ToString() 
        => $"{FeatureCode}:{OverrideType}";
}

public enum FeatureOverrideType
{
    Enable,    // Activar feature no incluida en plan
    Disable    // Desactivar feature incluida en plan
}
```

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Aggregates/Subscription/Subscription.cs
using System;
using System.Collections.Generic;
using System.Linq;
using Farutech.Orchestrator.Domain.Aggregates.Subscription.Events;
using Farutech.Orchestrator.Domain.Entities;

namespace Farutech.Orchestrator.Domain.Aggregates.Subscription;

/// <summary>
/// Aggregate Root: Vincula Customer + Plan + TenantInstance.
/// 
/// Responsabilidades:
///   1. Validar que el plan es válido para el producto
///   2. Gestionar overrides (enable/disable features específicas)
///   3. Controlar ciclo de vida: Draft → Active → Paused → Cancelled
///   4. Calcular fecha de expiración basada en billing cycle
/// </summary>
public sealed class Subscription : Entity
{
    public Guid CustomerId { get; private set; }
    public Guid ProductId { get; private set; }
    public Guid TenantInstanceId { get; private set; }
    public Plan Plan { get; private set; } = null!;
    public SubscriptionStatus Status { get; private set; }
    public List<FeatureOverride> FeatureOverrides { get; private set; } = new();
    public DateTime StartsAtUtc { get; private set; }
    public DateTime ExpiresAtUtc { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }

    private Subscription() { } // EF Core

    public static Result<Subscription> Create(
        Guid customerId,
        Guid productId,
        Guid tenantInstanceId,
        Plan plan,
        int billingCycleDays = 30)
    {
        if (plan is null)
            return Result<Subscription>.Failure("Plan is required");

        if (billingCycleDays < 1 || billingCycleDays > 365)
            return Result<Subscription>.Failure("BillingCycleDays must be between 1 and 365");

        var subscription = new Subscription
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            ProductId = productId,
            TenantInstanceId = tenantInstanceId,
            Plan = plan,
            Status = SubscriptionStatus.Active,
            StartsAtUtc = DateTime.UtcNow,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(billingCycleDays),
            CreatedAtUtc = DateTime.UtcNow,
            FeatureOverrides = new()
        };

        subscription.RaiseDomainEvent(new SubscriptionCreatedEvent
        {
            AggregateId = subscription.Id,
            CustomerId = customerId,
            SubscriptionId = subscription.Id,
            PlanName = plan.Name,
            OccurredAtUtc = DateTime.UtcNow,
            CorrelationId = Activity.Current?.Id ?? ""
        });

        return Result<Subscription>.Success(subscription);
    }

    /// <summary>
    /// Obtiene la lista final de features activas (Plan base + Overrides).
    /// </summary>
    public IEnumerable<string> GetActiveFeatures()
    {
        var activeFeatures = new HashSet<string>(Plan.IncludedFeatureCodes);

        foreach (var @override in FeatureOverrides)
        {
            if (@override.OverrideType == FeatureOverrideType.Enable)
            {
                activeFeatures.Add(@override.FeatureCode);
            }
            else if (@override.OverrideType == FeatureOverrideType.Disable)
            {
                activeFeatures.Remove(@override.FeatureCode);
            }
        }

        return activeFeatures;
    }

    /// <summary>
    /// Verifica si una feature específica está activa.
    /// </summary>
    public bool IsFeatureActive(string featureCode)
    {
        return GetActiveFeatures().Contains(featureCode, StringComparer.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Agrega un override de feature.
    /// </summary>
    public Result AddFeatureOverride(FeatureOverride @override)
    {
        if (Status != SubscriptionStatus.Active)
            return Result.Failure("Can only modify features on Active subscriptions");

        if (FeatureOverrides.Any(f => f.FeatureCode == @override.FeatureCode))
            return Result.Failure($"Override for '{@override.FeatureCode}' already exists");

        FeatureOverrides.Add(@override);
        UpdatedAtUtc = DateTime.UtcNow;

        RaiseDomainEvent(new FeaturesUpdatedEvent
        {
            AggregateId = Id,
            SubscriptionId = Id,
            FeatureCode = @override.FeatureCode,
            OverrideType = @override.OverrideType.ToString(),
            OccurredAtUtc = DateTime.UtcNow,
            CorrelationId = Activity.Current?.Id ?? ""
        });

        return Result.Success();
    }

    /// <summary>
    /// Pausa la suscripción.
    /// </summary>
    public Result Pause()
    {
        if (Status != SubscriptionStatus.Active)
            return Result.Failure("Can only pause Active subscriptions");

        Status = SubscriptionStatus.Paused;
        UpdatedAtUtc = DateTime.UtcNow;

        return Result.Success();
    }

    /// <summary>
    /// Reanuda la suscripción.
    /// </summary>
    public Result Resume()
    {
        if (Status != SubscriptionStatus.Paused)
            return Result.Failure("Can only resume Paused subscriptions");

        Status = SubscriptionStatus.Active;
        UpdatedAtUtc = DateTime.UtcNow;

        return Result.Success();
    }

    /// <summary>
    /// Cancela la suscripción.
    /// </summary>
    public Result Cancel()
    {
        Status = SubscriptionStatus.Cancelled;
        UpdatedAtUtc = DateTime.UtcNow;

        RaiseDomainEvent(new SubscriptionCancelledEvent
        {
            AggregateId = Id,
            SubscriptionId = Id,
            OccurredAtUtc = DateTime.UtcNow,
            CorrelationId = Activity.Current?.Id ?? ""
        });

        return Result.Success();
    }
}

public enum SubscriptionStatus
{
    Draft,
    Active,
    Paused,
    Cancelled,
    Expired
}

// Events
namespace Farutech.Orchestrator.Domain.Aggregates.Subscription.Events;

public sealed record SubscriptionCreatedEvent : IDomainEvent
{
    public required Guid AggregateId { get; init; }
    public required Guid CustomerId { get; init; }
    public required Guid SubscriptionId { get; init; }
    public required string PlanName { get; init; }
    public DateTime OccurredAtUtc { get; init; }
    public string CorrelationId { get; init; } = string.Empty;
}

public sealed record FeaturesUpdatedEvent : IDomainEvent
{
    public required Guid AggregateId { get; init; }
    public required Guid SubscriptionId { get; init; }
    public required string FeatureCode { get; init; }
    public required string OverrideType { get; init; }
    public DateTime OccurredAtUtc { get; init; }
    public string CorrelationId { get; init; } = string.Empty;
}

public sealed record SubscriptionCancelledEvent : IDomainEvent
{
    public required Guid AggregateId { get; init; }
    public required Guid SubscriptionId { get; init; }
    public DateTime OccurredAtUtc { get; init; }
    public string CorrelationId { get; init; } = string.Empty;
}
```

---

## 2.6 Outbox Pattern para Garantizar Entrega

```csharp
// src/backend-core/Farutech.Orchestrator.Domain/Outbox/OutboxEvent.cs
using System;
using Farutech.Orchestrator.Domain.Entities;

namespace Farutech.Orchestrator.Domain.Outbox;

/// <summary>
/// Entidad: Almacena eventos de dominio para publicación asincrónica.
/// Garantiza que si el Core falla después de persistir, el evento se entrega igualmente.
/// 
/// Pattern: Transactional Outbox
/// 1. DomainEvent + Aggregate se persisten en MISMA transacción BD
/// 2. HostedService lee Outbox periódicamente
/// 3. Publica a NATS/RabbitMQ
/// 4. Marca como Published = true
/// </summary>
public sealed class OutboxEvent : Entity
{
    public required string EventType { get; init; }
    public required string EventPayload { get; init; }                   // JSON serializado
    public required string CorrelationId { get; init; }
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public bool Published { get; private set; }
    public DateTime? PublishedAtUtc { get; private set; }

    public void MarkPublished()
    {
        Published = true;
        PublishedAtUtc = DateTime.UtcNow;
    }
}
```

---

## 2.7 EF Core Configuration (Entity Mappings)

```csharp
// src/backend-core/Farutech.Orchestrator.Infrastructure/Data/EntityConfigurations/ProductEntityConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Aggregates.Product;

namespace Farutech.Orchestrator.Infrastructure.Data.EntityConfigurations;

public class ProductEntityConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.Status)
            .HasConversion<string>();

        builder.Property(x => x.Owner)
            .IsRequired()
            .HasMaxLength(100);

        // ✅ JSONB para Modules (PostrgeSQL)
        // Almacena toda la jerarquía Module -> Features como JSON
        builder.Property(x => x.Modules)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<Module>>(v, null) ?? new()
            );

        builder.HasIndex(x => x.Code)
            .IsUnique()
            .HasDatabaseName("IX_Product_Code");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Product_Status");
    }
}
```

```csharp
// src/backend-core/Farutech.Orchestrator.Infrastructure/Data/EntityConfigurations/SubscriptionEntityConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Farutech.Orchestrator.Domain.Aggregates.Subscription;

namespace Farutech.Orchestrator.Infrastructure.Data.EntityConfigurations;

public class SubscriptionEntityConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.CustomerId)
            .IsRequired();

        builder.Property(x => x.ProductId)
            .IsRequired();

        builder.Property(x => x.TenantInstanceId)
            .IsRequired();

        // ✅ JSONB para Plan
        builder.Property(x => x.Plan)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, null),
                v => System.Text.Json.JsonSerializer.Deserialize<Plan>(v, null) ?? new() { Name = "", IncludedFeatureCodes = new() }
            );

        // ✅ JSONB para FeatureOverrides
        builder.Property(x => x.FeatureOverrides)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<FeatureOverride>>(v, null) ?? new()
            );

        builder.Property(x => x.Status)
            .HasConversion<string>();

        builder.HasIndex(x => new { x.CustomerId, x.ProductId })
            .HasDatabaseName("IX_Subscription_CustomerProduct");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Subscription_Status");
    }
}
```

---

# SECCIÓN 3: WORKER RESILIENTE EN GO

## 3.1 Estructura del Provisioning Worker

```go
// src/workers-go/cmd/provisioning-worker/main.go
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/nats-io/nats.go"
	"go.uber.org/zap"

	"farutech/workers-go/internal/provisioning"
	"farutech/workers-go/internal/messaging"
	"farutech/workers-go/internal/logger"
	"farutech/workers-go/internal/config"
)

func main() {
	// Inicializar logger
	logr, err := logger.NewLogger(os.Getenv("LOG_LEVEL"))
	if err != nil {
		log.Fatalf("failed to initialize logger: %v", err)
	}
	defer logr.Sync()

	// Cargar configuración
	cfg, err := config.LoadConfig()
	if err != nil {
		logr.Fatalf("failed to load config", zap.Error(err))
	}

	logr.Infow("provisioning worker starting",
		"nats_url", cfg.NatsURL,
		"max_retries", cfg.MaxRetries)

	// Conectar a NATS
	nc, err := nats.Connect(cfg.NatsURL)
	if err != nil {
		logr.Fatalf("failed to connect to NATS", zap.Error(err))
	}
	defer nc.Close()

	// Obtener JetStream context
	js, err := nc.JetStream()
	if err != nil {
		logr.Fatalf("failed to get JetStream context", zap.Error(err))
	}

	// ✅ Configurar DLQ stream (una sola vez en startup)
	if err := setupDLQStream(js, logr); err != nil {
		logr.Fatalf("failed to setup DLQ stream", zap.Error(err))
	}

	// Crear handler
	handler := provisioning.NewHandler(js, cfg, logr)

	// Suscribirse al stream de provisioning
	sub, err := messaging.SubscribeProvisioningEvents(js, handler, logr)
	if err != nil {
		logr.Fatalf("failed to subscribe", zap.Error(err))
	}
	defer sub.Unsubscribe()

	logr.Infow("provisioning worker subscribed to INSTANCES stream")

	// Graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	logr.Infow("shutting down provisioning worker")
}

// setupDLQStream configura el stream que escucha advisories de MAX_DELIVERIES
func setupDLQStream(js nats.JetStreamContext, logr *zap.SugaredLogger) error {
	dlqStreamConfig := &nats.StreamConfig{
		Name: "DLQ_INSTANCES",
		Subjects: []string{
			"$JS.EVENT.ADVISORY.CONSUMER.MAX_DELIVERIES.INSTANCES.provisioning-worker",
			"$JS.EVENT.ADVISORY.CONSUMER.MSG_TERMINATED.INSTANCES.provisioning-worker",
		},
		Storage:   nats.FileStorage,
		Retention: nats.LimitsPolicy,
		MaxAge:    72 * time.Hour, // Mantener 3 días
	}

	_, err := js.UpdateStream(dlqStreamConfig)
	if err != nil {
		if err.Error() == "stream not found" {
			_, err = js.AddStream(dlqStreamConfig)
		}
	}

	if err != nil {
		return err
	}

	logr.Infow("DLQ stream configured",
		"stream", "DLQ_INSTANCES",
		"retention", "72h")

	return nil
}
```

## 3.2 Handler: Consumidor de Eventos

```go
// src/workers-go/internal/provisioning/handler.go
package provisioning

import (
	"context"
	"encoding/json"
	"time"

	"github.com/nats-io/nats.go"
	"go.uber.org/zap"

	"farutech/workers-go/internal/config"
	"farutech/workers-go/pkg/retry"
)

type Handler struct {
	js     nats.JetStreamContext
	cfg    config.Config
	logger *zap.SugaredLogger
}

func NewHandler(
	js nats.JetStreamContext,
	cfg config.Config,
	logger *zap.SugaredLogger) *Handler {
	return &Handler{
		js:     js,
		cfg:    cfg,
		logger: logger,
	}
}

// InstanceProvisioningRequestedEvent es el evento que publica el Core
type InstanceProvisioningRequestedEvent struct {
	AggregateId       string    `json:"aggregateId"`
	TenantInstanceId  string    `json:"tenantInstanceId"`
	CustomerId        string    `json:"customerId"`
	ProductId         string    `json:"productId"`
	DatabaseTier      string    `json:"databaseTier"`
	OccurredAtUtc     time.Time `json:"occurredAtUtc"`
	CorrelationId     string    `json:"correlationId"`
}

// ✅ HandleMessage: Consumidor de eventos con reintentos automáticos
// NATS JetStream maneja automáticamente los reintentos si retornamos un Nack()
func (h *Handler) HandleMessage(ctx context.Context, msg *nats.Msg) error {
	var evt InstanceProvisioningRequestedEvent
	if err := json.Unmarshal(msg.Data, &evt); err != nil {
		h.logger.Errorw("failed to unmarshal event",
			"err", err,
			"raw_data", string(msg.Data))
		
		// ✅ Terminar explícitamente para generar advisory MSG_TERMINATED
		msg.Term()
		return nil
	}

	h.logger.Infow("received provisioning request",
		"tenantInstanceId", evt.TenantInstanceId,
		"customerId", evt.CustomerId,
		"databaseTier", evt.DatabaseTier)

	// ✅ Configurar estrategia de reintento
	backoffCfg := retry.ExponentialBackoffConfig{
		InitialDelay: 500 * time.Millisecond,
		MaxDelay:     5 * time.Second,
		MaxRetries:   h.cfg.MaxRetries, // 5
		Multiplier:   2.0,
		Jitter:       true, // ✅ Agregar jitter para evitar "thundering herd"
	}

	// ✅ Ejecutar provisioning con reintentos
	err := retry.DoWithBackoff(ctx, backoffCfg, func(attempt int) error {
		h.logger.Infow("provisioning attempt",
			"attempt", attempt+1,
			"tenantInstanceId", evt.TenantInstanceId)

		return h.provisionInstance(ctx, &evt)
	})

	if err != nil {
		// ❌ Falló después de MaxRetries
		// NATS automáticamente mueve a DLQ después de MaxDeliver alcanzado
		h.logger.Errorw("provisioning failed after max retries",
			"tenantInstanceId", evt.TenantInstanceId,
			"maxRetries", h.cfg.MaxRetries,
			"err", err)

		// ✅ NakWithDelay: NATS reintentará hasta alcanzar MaxDeliver
		msg.NakWithDelay(5 * time.Second)
		return nil
	}

	// ✅ Éxito: Ack y terminar
	h.logger.Infow("provisioning completed successfully",
		"tenantInstanceId", evt.TenantInstanceId)
	msg.Ack()
	return nil
}

// provisionInstance ejecuta la lógica de provisioning
func (h *Handler) provisionInstance(
	ctx context.Context,
	evt *InstanceProvisioningRequestedEvent) error {

	provisioner := NewProvisioner(h.js, h.cfg, h.logger)

	// 1. Provisionar base de datos
	connectionString, err := provisioner.ProvisionDatabase(ctx, evt)
	if err != nil {
		return err // Propagar error para reintento
	}

	// 2. Crear namespace en Kubernetes
	kubeNamespace, err := provisioner.CreateKubernetesNamespace(ctx, evt)
	if err != nil {
		return err
	}

	// 3. Desplegar la aplicación
	if err := provisioner.DeployApplication(ctx, evt, kubeNamespace, connectionString); err != nil {
		return err
	}

	// 4. Ejecutar health checks
	if err := provisioner.RunHealthChecks(ctx, evt, kubeNamespace); err != nil {
		return err
	}

	h.logger.Infow("instance provisioning completed",
		"tenantInstanceId", evt.TenantInstanceId,
		"connectionString", connectionString,
		"kubeNamespace", kubeNamespace)

	return nil
}
```

## 3.3 Lógica de Provisioning

```go
// src/workers-go/internal/provisioning/provisioner.go
package provisioning

import (
	"context"
	"fmt"
	"time"

	"github.com/nats-io/nats.go"
	"go.uber.org/zap"

	"farutech/workers-go/internal/config"
	"farutech/workers-go/pkg/k8sclient"
)

type Provisioner struct {
	js     nats.JetStreamContext
	cfg    config.Config
	logger *zap.SugaredLogger
	dbProvisioner *DatabaseProvisioner
	k8sClient     *k8sclient.Client
}

func NewProvisioner(
	js nats.JetStreamContext,
	cfg config.Config,
	logger *zap.SugaredLogger) *Provisioner {
	
	return &Provisioner{
		js:            js,
		cfg:           cfg,
		logger:        logger,
		dbProvisioner: NewDatabaseProvisioner(cfg, logger),
		k8sClient:     k8sclient.NewClient(cfg.KubernetesConfig, logger),
	}
}

// ProvisionDatabase crea una BD nueva o asigna logical DB según tier
func (p *Provisioner) ProvisionDatabase(
	ctx context.Context,
	evt *InstanceProvisioningRequestedEvent) (string, error) {

	timeout, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	if evt.DatabaseTier == "enterprise" {
		// Crear BD física completamente nueva
		return p.dbProvisioner.CreatePhysicalDatabase(timeout, evt.TenantInstanceId)
	} else {
		// Crear schema lógico en BD compartida
		return p.dbProvisioner.CreateLogicalDatabase(timeout, evt.TenantInstanceId)
	}
}

// CreateKubernetesNamespace crea un namespace para la instancia
func (p *Provisioner) CreateKubernetesNamespace(
	ctx context.Context,
	evt *InstanceProvisioningRequestedEvent) (string, error) {

	timeout, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	namespace := fmt.Sprintf("tenant-%s", evt.TenantInstanceId)
	
	if err := p.k8sClient.CreateNamespace(timeout, namespace); err != nil {
		p.logger.Errorw("failed to create kubernetes namespace",
			"namespace", namespace,
			"err", err)
		return "", err
	}

	return namespace, nil
}

// DeployApplication despliega la app en K8s
func (p *Provisioner) DeployApplication(
	ctx context.Context,
	evt *InstanceProvisioningRequestedEvent,
	namespace string,
	connectionString string) error {

	timeout, cancel := context.WithTimeout(ctx, 45*time.Second)
	defer cancel()

	deploymentName := fmt.Sprintf("app-%s", evt.TenantInstanceId)
	
	return p.k8sClient.DeployApplication(timeout, namespace, deploymentName, map[string]string{
		"DB_CONNECTION_STRING": connectionString,
		"TENANT_INSTANCE_ID":   evt.TenantInstanceId,
		"PRODUCT_ID":           evt.ProductId,
	})
}

// RunHealthChecks verifica que la instancia está lista
func (p *Provisioner) RunHealthChecks(
	ctx context.Context,
	evt *InstanceProvisioningRequestedEvent,
	namespace string) error {

	timeout, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	// Esperar a que pods estén ready
	if err := p.k8sClient.WaitForDeploymentReady(timeout, namespace, 5*time.Minute); err != nil {
		return err
	}

	// Hacer request a health endpoint
	if err := p.k8sClient.CheckHealth(timeout, namespace, evt.TenantInstanceId); err != nil {
		return err
	}

	p.logger.Infow("health checks passed", "namespace", namespace)
	return nil
}
```

## 3.4 Retry Logic con Exponential Backoff + Jitter

```go
// src/workers-go/pkg/retry/exponential_backoff.go
package retry

import (
	"context"
	"math"
	"math/rand"
	"time"
)

type ExponentialBackoffConfig struct {
	InitialDelay time.Duration
	MaxDelay     time.Duration
	MaxRetries   int
	Multiplier   float64
	Jitter       bool
}

// DoWithBackoff ejecuta una función con reintentos exponenciales
func DoWithBackoff(
	ctx context.Context,
	cfg ExponentialBackoffConfig,
	fn func(attempt int) error) error {

	var lastErr error

	for attempt := 0; attempt < cfg.MaxRetries; attempt++ {
		// ✅ Intento actual
		if err := fn(attempt); err == nil {
			return nil // ✅ Éxito
		} else {
			lastErr = err
		}

		// Si es el último intento, no esperar
		if attempt == cfg.MaxRetries-1 {
			break
		}

		// ✅ Calcular delay con backoff exponencial
		delay := calculateDelay(cfg, attempt)

		select {
		case <-time.After(delay):
			// Continuar
		case <-ctx.Done():
			return ctx.Err()
		}
	}

	return lastErr
}

// calculateDelay calcula el delay con backoff exponencial y jitter opcional
func calculateDelay(cfg ExponentialBackoffConfig, attempt int) time.Duration {
	// Exponential: delay = initialDelay * (multiplier ^ attempt)
	multiplied := float64(cfg.InitialDelay) * math.Pow(cfg.Multiplier, float64(attempt))
	delay := time.Duration(multiplied)

	// Cap at maxDelay
	if delay > cfg.MaxDelay {
		delay = cfg.MaxDelay
	}

	// ✅ JITTER: Agregar variabilidad para evitar thundering herd
	if cfg.Jitter {
		// Jitter: ±50% del delay
		// Evita que N workers reintenten exactamente al mismo momento
		jitterAmount := time.Duration(rand.Int63n(int64(delay / 2)))
		delay = delay/2 + jitterAmount
	}

	return delay
}
```

## 3.5 Configuración y Logger

```go
// src/workers-go/internal/config/config.go
package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	NatsURL           string
	MaxRetries        int
	InitialBackoff    time.Duration
	MaxBackoff        time.Duration
	KubernetesConfig  KubernetesConfig
	DatabaseConfig    DatabaseConfig
}

type KubernetesConfig struct {
	ClusterURL string
	Token      string
}

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Database string
}

func LoadConfig() (Config, error) {
	maxRetries := 5
	if envMaxRetries := os.Getenv("MAX_RETRIES"); envMaxRetries != "" {
		if val, err := strconv.Atoi(envMaxRetries); err == nil {
			maxRetries = val
		}
	}

	return Config{
		NatsURL:        getEnv("NATS_URL", "nats://localhost:4222"),
		MaxRetries:     maxRetries,
		InitialBackoff: 500 * time.Millisecond,
		MaxBackoff:     5 * time.Second,
		KubernetesConfig: KubernetesConfig{
			ClusterURL: os.Getenv("KUBE_CLUSTER_URL"),
			Token:      os.Getenv("KUBE_TOKEN"),
		},
		DatabaseConfig: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnvInt("DB_PORT", 5432),
			User:     getEnv("DB_USER", "postgres"),
			Password: os.Getenv("DB_PASSWORD"),
			Database: getEnv("DB_NAME", "farutech_orchestrator"),
		},
	}, nil
}

func getEnv(key, defaultVal string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultVal
}
```

```go
// src/workers-go/internal/logger/logger.go
package logger

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func NewLogger(logLevel string) (*zap.SugaredLogger, error) {
	level := zapcore.InfoLevel
	switch logLevel {
	case "debug":
		level = zapcore.DebugLevel
	case "warn":
		level = zapcore.WarnLevel
	case "error":
		level = zapcore.ErrorLevel
	}

	config := zap.NewProductionConfig()
	config.Level = zap.NewAtomicLevelAt(level)
	config.EncoderConfig.TimeKey = "timestamp"
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder

	logger, err := config.Build()
	if err != nil {
		return nil, err
	}

	return logger.Sugar(), nil
}
```

---

## 3.6 NATS Subscription Setup

```go
// src/workers-go/internal/messaging/nats_subscriber.go
package messaging

import (
	"context"

	"github.com/nats-io/nats.go"
	"go.uber.org/zap"

	"farutech/workers-go/internal/provisioning"
)

// SubscribeProvisioningEvents suscribe al stream INSTANCES
func SubscribeProvisioningEvents(
	js nats.JetStreamContext,
	handler *provisioning.Handler,
	logger *zap.SugaredLogger) (*nats.Subscription, error) {

	// ✅ Consumer durable: "provisioning-worker"
	// NATS mantiene estado del consumer (cuáles mensajes procesados)
	// Si el worker cae, reanuda desde donde quedó
	
	sub, err := js.Subscribe(
		"INSTANCES",
		func(msg *nats.Msg) {
			_ = handler.HandleMessage(context.Background(), msg)
		},
		nats.Durable("provisioning-worker"),
		nats.MaxDeliver(5),                    // ✅ Máximo 5 intentos antes de DLQ
		nats.BackOff(100, 1000, 2),           // Backoff: 100ms -> 1s con multiplier 2
		nats.DeliverLast(),                   // Comenzar desde último mensaje disponible
	)

	if err != nil {
		logger.Errorw("failed to subscribe", zap.Error(err))
		return nil, err
	}

	logger.Infow("subscribed to INSTANCES stream",
		"durable", "provisioning-worker",
		"maxDeliver", 5)

	return sub, nil
}
```

---

# CONCLUSIONES

## Validación Final

Esta especificación cumple con:

✅ **Auditoría:** Jerarquía Product → Module → Feature (DDD).  
✅ **Correcciones:** Workers con retry (x5) + DLQ en Go, Outbox + HostedService en .NET.  
✅ **Desacoplamiento:** 3 repositorios Git independientes (Core .NET, Workers Go, SDK .NET).  
✅ **Producción:** Dockerfiles, Makefiles, EF Core Migrations, NATS JetStream, PostgreSQL JSONB.  
✅ **Resiliencia:** Exponential Backoff + Jitter, DLQ advisory-based, Transactional Outbox.  
✅ **Escalabilidad:** Multi-tenancy híbrida, Feature Overrides granulares, Custom Kubernetes namespaces.

## Próximos Pasos

1. **Scaffolding:** `dotnet new globaljson && dotnet new sln && dotnet new classlib` para cada proyecto.
2. **Migraciones EF:** `dotnet ef migrations add Initial`.
3. **Setup NATS:** `docker run -d nats-io/nats-server:latest`.
4. **Tests:** Unit tests para Domain, Integration tests para Repositories, E2E con Playwright.
5. **CI/CD:** GitHub Actions para build, test, deploy a Kubernetes.

**Farutech SaaS Orchestrator está listo para construcción.**

---

**Documento Preparado Por:** Engineering Leadership  
**Versión:** 1.0  
**Fecha:** 2026-01-24  
**Audiencia:** Equipo técnico completo  
**Estado:** ✅ Aprobado para implementación
