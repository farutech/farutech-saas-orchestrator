<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## SECCIÓN 1: Estructura de Solución (Scaffolding y Carpetas)

La solución se diseña desde el día 1 para repositorios Git separados, pero con convención de nombres y boundaries claros.

### 1.1 Vista de alto nivel (repositorios)

- `farutech.orchestrator.core` → Backend .NET 9 (Control Plane)
- `farutech.orchestrator.workers` → Workers Go (infra y tareas pesadas)
- `farutech.orchestrator.sdk.dotnet` → SDK cliente para Apps Farutech*
- (Opcional futuro) `farutech.orchestrator.ui` → Panel web para operaciones

\*Las Apps hijas (Farutech Vet, ERP, CRM…) son repositorios independientes, consumen el SDK.

### 1.2 Estructura del backend Core (.NET 9, Clean Architecture)

Repositorio: `farutech.orchestrator.core`

```text
/                      # raíz del repo
├─ src/
│  ├─ Farutech.Orchestrator.Api/
│  │  ├─ Program.cs
│  │  ├─ appsettings.json
│  │  ├─ Controllers/
│  │  │  ├─ ProductsController.cs
│  │  │  ├─ CustomersController.cs
│  │  │  ├─ TenantInstancesController.cs
│  │  │  ├─ SubscriptionsController.cs
│  │  │  └─ PlansController.cs
│  │  ├─ Middleware/
│  │  │  ├─ TenantResolutionMiddleware.cs   # Resuelve Customer/Tenant desde headers/path
│  │  │  └─ CorrelationIdMiddleware.cs
│  │  ├─ Filters/
│  │  │  └─ ApiExceptionFilter.cs
│  │  ├─ Config/
│  │  │  ├─ SwaggerConfig.cs
│  │  │  ├─ AuthConfig.cs
│  │  │  └─ MessagingConfig.cs
│  │  └─ DI/
│  │     └─ ServiceCollectionExtensions.cs
│  │
│  ├─ Farutech.Orchestrator.Domain/
│  │  ├─ Abstractions/
│  │  │  ├─ Entity.cs
│  │  │  ├─ AggregateRoot.cs
│  │  │  ├─ IHasTenant.cs
│  │  │  └─ ValueObject.cs
│  │  ├─ Products/
│  │  │  ├─ Product.cs
│  │  │  ├─ Module.cs
│  │  │  └─ Feature.cs
│  │  ├─ Plans/
│  │  │  └─ Plan.cs
│  │  ├─ Customers/
│  │  │  └─ Customer.cs
│  │  ├─ Tenants/
│  │  │  └─ TenantInstance.cs
│  │  ├─ Subscriptions/
│  │  │  └─ Subscription.cs
│  │  ├─ Licensing/
│  │  │  └─ SubscriptionFeatureOverride.cs
│  │  ├─ Enums/
│  │  │  ├─ DatabaseTier.cs
│  │  │  ├─ SubscriptionStatus.cs
│  │  │  └─ TenantInstanceStatus.cs
│  │  ├─ Events/
│  │  │  ├─ InstanceProvisioningRequested.cs
│  │  │  ├─ InstanceProvisioningFailed.cs
│  │  │  └─ InstanceProvisioned.cs
│  │  └─ Specifications/
│  │     └─ SubscriptionSpecifications.cs
│  │
│  ├─ Farutech.Orchestrator.Application/
│  │  ├─ Abstractions/
│  │  │  ├─ IMediator.cs
│  │  │  ├─ IUnitOfWork.cs
│  │  │  ├─ IEventBus.cs           # wrapper sobre NATS/Rabbit
│  │  │  └─ ITenantContext.cs
│  │  ├─ Products/
│  │  │  ├─ Commands/
│  │  │  │  └─ CreateProduct/
│  │  │  │     ├─ CreateProductCommand.cs
│  │  │  │     ├─ CreateProductHandler.cs
│  │  │  │     └─ CreateProductValidator.cs
│  │  │  └─ Queries/
│  │  │     └─ GetProducts/
│  │  ├─ Subscriptions/
│  │  │  ├─ Commands/
│  │  │  │  ├─ CreateSubscription/
│  │  │  │  └─ UpdateSubscriptionFeatures/
│  │  │  └─ Queries/
│  │  ├─ Tenants/
│  │  │  ├─ Commands/
│  │  │  │  └─ ProvisionTenantInstance/
│  │  │  └─ Queries/
│  │  ├─ Customers/
│  │  └─ Common/
│  │     ├─ Behaviors/             # pipeline behaviors, logging, validation
│  │     └─ DTOs/
│  │
│  ├─ Farutech.Orchestrator.Infrastructure/
│  │  ├─ Persistence/
│  │  │  ├─ OrchestratorDbContext.cs
│  │  │  ├─ EntityTypeConfigurations/
│  │  │  ├─ Migrations/
│  │  │  └─ TenantDbContextFactory.cs   # estrategia híbrida: shared vs db per tenant
│  │  ├─ Messaging/
│  │  │  ├─ NatsEventBus.cs            # integración con NATS JetStream
│  │  │  └─ NatsOptions.cs
│  │  ├─ Identity/
│  │  ├─ Outbox/
│  │  └─ Logging/
│  │
│  └─ Farutech.Orchestrator.Contracts/  # DTOs compartidos entre Core y Workers/SDK
│     ├─ Events/
│     │  └─ InstanceProvisioningRequestedEvent.cs
│     ├─ Messages/
│     └─ Enums/
│
├─ tests/
│  ├─ Farutech.Orchestrator.Domain.Tests/
│  ├─ Farutech.Orchestrator.Application.Tests/
│  └─ Farutech.Orchestrator.Api.IntegrationTests/
│
└─ build/
   ├─ docker/
   └─ ci/
```


### 1.3 Estructura del SDK .NET

Repositorio: `farutech.orchestrator.sdk.dotnet`

```text
/ src/
│ └─ Farutech.Orchestrator.Sdk/
│    ├─ Farutech.Orchestrator.Sdk.csproj   # .NET Standard / .NET 8 compatible
│    ├─ Configuration/
│    │  └─ OrchestratorClientOptions.cs
│    ├─ Tenancy/
│    │  └─ TenantConfigProvider.cs
│    ├─ Licensing/
│    │  └─ FeatureEvaluator.cs
│    ├─ Http/
│    │  └─ OrchestratorHttpClient.cs
│    └─ Abstractions/
│       └─ IOrchestratorClient.cs
```

Las Apps hijas referencian esta lib para descubrir sus `TenantInstanceId`, features activas, endpoints del Core, etc.

### 1.4 Estructura de Workers en Go

Repositorio: `farutech.orchestrator.workers`

```text
/                      # raíz
├─ cmd/
│  ├─ provisioning-worker/
│  │  └─ main.go       # worker que provisiona BD/infra de instancias
│  ├─ email-worker/
│  └─ billing-worker/
│
├─ internal/
│  ├─ config/
│  │  └─ config.go     # carga config (env, yaml)
│  ├─ nats/
│  │  ├─ connection.go # conexión JetStream
│  │  ├─ consumer.go   # creación de consumer con MaxDeliver, etc.
│  │  └─ dlq.go        # helper para DLQ
│  ├─ logger/
│  │  └─ logger.go
│  ├─ provisioning/
│  │  ├─ handler.go    # lógica de negocio: ProvisionDatabase, etc.
│  │  └─ models.go     # DTOs de eventos InstanceProvisioningRequested
│  └─ retry/
│     └─ backoff.go    # implementación de exponential backoff
│
└─ pkg/
   └─ utils/
      └─ correlation.go
```


***

## SECCIÓN 2: Implementación del Dominio en .NET 9 (C\# 13)

Se asume EF Core 8/9, multi‑tenant híbrido: columna `CustomerId`/`TenantInstanceId` para Standard, y DB por tenant para Enterprise.[^1][^2]

### 2.1 Abstracciones base (Domain)

```csharp
namespace Farutech.Orchestrator.Domain.Abstractions;

public abstract class Entity
{
    public Guid Id { get; protected init; } = Guid.NewGuid();
}

public abstract class AggregateRoot : Entity
{
    private readonly List<object> _domainEvents = new();

    public IReadOnlyCollection<object> DomainEvents => _domainEvents.AsReadOnly();

    protected void AddDomainEvent(object @event)
        => _domainEvents.Add(@event);

    public void ClearDomainEvents()
        => _domainEvents.Clear();
}
```


### 2.2 Modelo de catálogo: Product, Module, Feature, Plan

```csharp
namespace Farutech.Orchestrator.Domain.Products;

public sealed class Product(string name, string code) : AggregateRoot
{
    public required string Name { get; init; } = name;
    public required string Code { get; init; } = code; // unique, e.g. "FARUTECH_VET"

    private readonly List<Module> _modules = new();
    public IReadOnlyCollection<Module> Modules => _modules;

    public void AddModule(Module module)
    {
        // validaciones dominio
        _modules.Add(module);
    }
}

public sealed class Module(string name, string code, Guid productId) : Entity
{
    public required string Name { get; init; } = name;
    public required string Code { get; init; } = code;    // e.g. "INVENTORY"
    public required Guid ProductId { get; init; } = productId;

    private readonly List<Feature> _features = new();
    public IReadOnlyCollection<Feature> Features => _features;

    public void AddFeature(Feature feature)
        => _features.Add(feature);
}

public sealed class Feature(string name, string code, Guid moduleId) : Entity
{
    public required string Name { get; init; } = name;
    public required string Code { get; init; } = code;       // e.g. "BATCH_CONTROL"
    public required Guid ModuleId { get; init; } = moduleId;
    public bool IsPremium { get; init; }
}
```

Planes comerciales:

```csharp
namespace Farutech.Orchestrator.Domain.Plans;

public enum PlanType
{
    Standard = 1,
    Professional = 2,
    Enterprise = 3
}

public sealed class Plan(string name, string code, Guid productId, PlanType type) : AggregateRoot
{
    public required string Name { get; init; } = name;
    public required string Code { get; init; } = code;           // e.g. "ERP_GOLD"
    public required Guid ProductId { get; init; } = productId;
    public required PlanType Type { get; init; } = type;

    // Conjunto de features incluidas por defecto en el plan
    private readonly HashSet<string> _includedFeatureCodes = new(StringComparer.OrdinalIgnoreCase);
    public IReadOnlyCollection<string> IncludedFeatureCodes => _includedFeatureCodes;

    public void IncludeFeature(string featureCode)
        => _includedFeatureCodes.Add(featureCode);
    public void ExcludeFeature(string featureCode)
        => _includedFeatureCodes.Remove(featureCode);
}
```


### 2.3 Customers, TenantInstance y multi‑tenancy

```csharp
namespace Farutech.Orchestrator.Domain.Customers;

public sealed class Customer(string legalName, string taxId) : AggregateRoot
{
    public required string LegalName { get; init; } = legalName;
    public required string TaxId { get; init; } = taxId;  // NIT, RUT, etc.
    public string? BillingEmail { get; private set; }
    public bool IsActive { get; private set; } = true;

    public void SetBillingEmail(string email)
        => BillingEmail = email;
    public void Deactivate()
        => IsActive = false;
}

namespace Farutech.Orchestrator.Domain.Enums;

public enum DatabaseTier
{
    Standard = 1,   // shared DB + logical isolation
    Enterprise = 2  // dedicated DB
}

public enum TenantInstanceStatus
{
    Provisioning = 1,
    Active = 2,
    Failed = 3,
    Suspended = 4,
    Decommissioned = 5
}

namespace Farutech.Orchestrator.Domain.Tenants;

using Farutech.Orchestrator.Domain.Enums;

public sealed class TenantInstance(
    Guid customerId,
    Guid productId,
    string instanceCode,
    DatabaseTier databaseTier) : AggregateRoot
{
    // Quien paga
    public required Guid CustomerId { get; init; } = customerId;
    // Qué producto (Vet, ERP, etc.)
    public required Guid ProductId { get; init; } = productId;

    // Código legible dentro del scope del Customer ("norte", "sucursal-1")
    public required string InstanceCode { get; init; } = instanceCode;

    // ID global para infraestructura (GUID)
    public string GlobalInstanceId { get; private set; } = Guid.NewGuid().ToString("N");

    public required DatabaseTier DatabaseTier { get; init; } = databaseTier;
    public string? ConnectionString { get; private set; }   // Enterprise: DB propia, Standard: puede ser shared

    public TenantInstanceStatus Status { get; private set; } = TenantInstanceStatus.Provisioning;
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;

    public void MarkActive()
        => Status = TenantInstanceStatus.Active;
    public void MarkFailed()
        => Status = TenantInstanceStatus.Failed;

    public void SetConnectionString(string connectionString)
        => ConnectionString = connectionString;
}
```


### 2.4 Subscription + Feature Overrides (punto crítico)

Necesitamos:

- Plan base → lista de features incluidas.
- Subscription → referencia a plan + capacidad de “override” (activar/desactivar algunas features específicas para ese cliente/instancia).
- Evaluación rápida para saber si una feature está activa.

Modelo:

- Tabla `Subscriptions`
- Tabla `SubscriptionFeatureOverrides`
    - `OverrideType`: Enable / Disable.

Entidad:

```csharp
namespace Farutech.Orchestrator.Domain.Enums;

public enum SubscriptionStatus
{
    Pending = 1,
    Active = 2,
    Suspended = 3,
    Cancelled = 4
}

public enum FeatureOverrideType
{
    Enable = 1,
    Disable = 2
}
```

```csharp
namespace Farutech.Orchestrator.Domain.Subscriptions;

using Farutech.Orchestrator.Domain.Enums;

public sealed class Subscription(
    Guid customerId,
    Guid tenantInstanceId,
    Guid planId) : AggregateRoot
{
    public required Guid CustomerId { get; init; } = customerId;
    public required Guid TenantInstanceId { get; init; } = tenantInstanceId;
    public required Guid PlanId { get; init; } = planId;

    public SubscriptionStatus Status { get; private set; } = SubscriptionStatus.Pending;
    public DateTime StartsAtUtc { get; init; } = DateTime.UtcNow;
    public DateTime? ExpiresAtUtc { get; private set; }

    // Overrides: “en esta suscripción, esta feature se habilita o se deshabilita explícitamente”
    private readonly List<SubscriptionFeatureOverride> _featureOverrides = new();
    public IReadOnlyCollection<SubscriptionFeatureOverride> FeatureOverrides => _featureOverrides;

    public void Activate()
    {
        Status = SubscriptionStatus.Active;
    }

    public void Suspend()
        => Status = SubscriptionStatus.Suspended;

    public void Cancel()
    {
        Status = SubscriptionStatus.Cancelled;
        ExpiresAtUtc = DateTime.UtcNow;
    }

    public void SetFeatureOverride(string featureCode, FeatureOverrideType overrideType)
    {
        var existing = _featureOverrides
            .FirstOrDefault(o => o.FeatureCode.Equals(featureCode, StringComparison.OrdinalIgnoreCase));

        if (existing is not null)
        {
            existing.SetOverrideType(overrideType);
        }
        else
        {
            _featureOverrides.Add(new SubscriptionFeatureOverride(featureCode, overrideType));
        }
    }

    public void RemoveFeatureOverride(string featureCode)
    {
        var existing = _featureOverrides
            .FirstOrDefault(o => o.FeatureCode.Equals(featureCode, StringComparison.OrdinalIgnoreCase));
        if (existing is not null)
        {
            _featureOverrides.Remove(existing);
        }
    }
}

public sealed class SubscriptionFeatureOverride(string featureCode, FeatureOverrideType overrideType) : Entity
{
    // Referencia a Subscription vía FK en EF
    public Guid SubscriptionId { get; private set; }

    public required string FeatureCode { get; init; } = featureCode;
    public FeatureOverrideType OverrideType { get; private set; } = overrideType;

    public void SetOverrideType(FeatureOverrideType type)
        => OverrideType = type;
}
```

Patrón de evaluación de features (en Application Layer, pero usando este modelo):

```csharp
// Servicio de dominio / aplicación
public sealed class SubscriptionFeatureEvaluator(
    Plan plan,
    Subscription subscription)
{
    private readonly HashSet<string> _baseFeatures =
        new(plan.IncludedFeatureCodes, StringComparer.OrdinalIgnoreCase);

    private readonly Dictionary<string, FeatureOverrideType> _overrides =
        subscription.FeatureOverrides
            .ToDictionary(
                x => x.FeatureCode,
                x => x.OverrideType,
                StringComparer.OrdinalIgnoreCase);

    public bool IsFeatureActive(string featureCode)
    {
        if (_overrides.TryGetValue(featureCode, out var overrideType))
        {
            return overrideType == FeatureOverrideType.Enable;
        }

        // Si no hay override, manda el plan base
        return _baseFeatures.Contains(featureCode);
    }
}
```

En EF Core, esto se mapea de forma estándar: `Subscription` (1)–(N) `SubscriptionFeatureOverride`. El lookup de features se hace en memoria sobre las colecciones ya cargadas.

***

## SECCIÓN 3: Worker Resiliente en Go (NATS JetStream + Retries + DLQ)

Se asume NATS JetStream con un stream para eventos del Orchestrator, p.ej. `ORCH_INSTANCES` y subject `orchestrator.instance.provision`.[^3][^4][^5][^6]

### 3.1 Estructura mínima del worker (cmd + internal)

`cmd/provisioning-worker/main.go`:

```go
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"farutech.orchestrator.workers/internal/config"
	"farutech.orchestrator.workers/internal/logger"
	"farutech.orchestrator.workers/internal/nats"
	"farutech.orchestrator.workers/internal/provisioning"
)

func main() {
	cfg := config.Load()

	logr := logger.New(cfg.LogLevel)

	nc, js, err := nats.ConnectJetStream(cfg, logr)
	if err != nil {
		log.Fatalf("failed to connect to NATS: %v", err)
	}
	defer nc.Drain()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	handler := provisioning.NewHandler(js, cfg, logr)

	if err := handler.Start(ctx); err != nil {
		log.Fatalf("failed to start provisioning handler: %v", err)
	}

	// Esperar señales para shutdown limpio
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	<-sigCh

	logr.Info("shutting down provisioning worker")
}
```


### 3.2 Conexión a NATS y JetStream

`internal/nats/connection.go` (esquema simplificado):

```go
package nats

import (
	"fmt"
	"time"

	"github.com/nats-io/nats.go"
	"go.uber.org/zap"
)

type Config interface {
	GetNatsUrl() string
	GetNatsUser() string
	GetNatsPassword() string
}

func ConnectJetStream(cfg Config, logger *zap.SugaredLogger) (*nats.Conn, nats.JetStreamContext, error) {
	opts := []nats.Option{
		nats.Name("farutech-provisioning-worker"),
		nats.Timeout(5 * time.Second),
	}

	if u := cfg.GetNatsUser(); u != "" {
		opts = append(opts, nats.UserInfo(cfg.GetNatsUser(), cfg.GetNatsPassword()))
	}

	nc, err := nats.Connect(cfg.GetNatsUrl(), opts...)
	if err != nil {
		return nil, nil, fmt.Errorf("connect nats: %w", err)
	}

	js, err := nc.JetStream()
	if err != nil {
		return nil, nil, fmt.Errorf("jetstream: %w", err)
	}

	logger.Infow("connected to NATS", "url", cfg.GetNatsUrl())
	return nc, js, nil
}
```


### 3.3 Handler de Provisioning con retries + DLQ

`internal/provisioning/handler.go`:

```go
package provisioning

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"farutech.orchestrator.workers/internal/retry"

	"github.com/nats-io/nats.go"
	"go.uber.org/zap"
)

// Evento que viene del Orchestrator Core (Contracts compartidos)
type InstanceProvisioningRequested struct {
	TenantInstanceId string `json:"tenantInstanceId"`
	CustomerId       string `json:"customerId"`
	ProductId        string `json:"productId"`
	DatabaseTier     string `json:"databaseTier"` // "Standard" | "Enterprise"
	CorrelationId    string `json:"correlationId"`
}

type Config interface {
	GetProvisioningStream() string
	GetProvisioningSubject() string
	GetProvisioningConsumer() string
	GetDlqSubject() string
}

type Handler struct {
	js     nats.JetStreamContext
	cfg    Config
	logger *zap.SugaredLogger
}

func NewHandler(js nats.JetStreamContext, cfg Config, logger *zap.SugaredLogger) *Handler {
	return &Handler{
		js:     js,
		cfg:    cfg,
		logger: logger,
	}
}

func (h *Handler) Start(ctx context.Context) error {
	// Consumer duradero
	_, err := h.js.AddConsumer(ctx, h.cfg.GetProvisioningStream(), &nats.ConsumerConfig{
		Durable:       h.cfg.GetProvisioningConsumer(),
		AckPolicy:     nats.AckExplicitPolicy,
		MaxDeliver:    5,                      // JetStream también reintenta, pero nosotros controlamos en app
		FilterSubject: h.cfg.GetProvisioningSubject(),
	})
	if err != nil && !errors.Is(err, nats.ErrConsumerNameAlreadyInUse) {
		return err
	}

	sub, err := h.js.PullSubscribe(
		h.cfg.GetProvisioningSubject(),
		h.cfg.GetProvisioningConsumer(),
	)
	if err != nil {
		return err
	}

	h.logger.Infow("provisioning handler started",
		"subject", h.cfg.GetProvisioningSubject())

	go h.loop(ctx, sub)

	return nil
}

func (h *Handler) loop(ctx context.Context, sub *nats.Subscription) {
	for {
		select {
		case <-ctx.Done():
			h.logger.Info("context cancelled, stopping loop")
			return
		default:
			msgs, err := sub.Fetch(10, nats.MaxWait(2*time.Second))
			if err != nil && !errors.Is(err, nats.ErrTimeout) {
				h.logger.Errorw("fetch error", "err", err)
				continue
			}
			for _, msg := range msgs {
				h.handleMessage(ctx, msg)
			}
		}
	}
}

func (h *Handler) handleMessage(ctx context.Context, msg *nats.Msg) {
	var evt InstanceProvisioningRequested
	if err := json.Unmarshal(msg.Data, &evt); err != nil {
		h.logger.Errorw("failed to unmarshal message, sending to DLQ",
			"err", err, "data", string(msg.Data))
		h.sendToDLQ(ctx, msg, "unmarshal_error: "+err.Error())
		_ = msg.Ack() // ack original para no reintentar basura
		return
	}

	h.logger.Infow("received provisioning event",
		"tenantInstanceId", evt.TenantInstanceId,
		"correlationId", evt.CorrelationId)

	// Retry con exponential backoff hasta 5 intentos
	backoff := retry.NewExponentialBackoff(
		5,                    // maxAttempts
		500*time.Millisecond, // initialDelay
		5*time.Second,        // maxDelay
	)

	err := retry.Do(ctx, backoff, func() error {
		return h.processProvisioning(ctx, &evt)
	})

	if err != nil {
		h.logger.Errorw("provisioning failed after retries, sending to DLQ",
			"tenantInstanceId", evt.TenantInstanceId,
			"err", err.Error())
		h.sendToDLQ(ctx, msg, err.Error())
		_ = msg.Ack() // ya lo manejamos en DLQ
		return
	}

	// todo OK, confirmar
	if err := msg.Ack(); err != nil {
		h.logger.Errorw("failed to ack message", "err", err)
	}
}

// processProvisioning simula la tarea pesada (crear BD, aplicar migrations, etc.)
func (h *Handler) processProvisioning(ctx context.Context, evt *InstanceProvisioningRequested) error {
	// Ejemplo: ProvisionDatabase puede fallar
	if err := ProvisionDatabase(ctx, evt); err != nil {
		h.logger.Warnw("ProvisionDatabase failed, will retry",
			"tenantInstanceId", evt.TenantInstanceId,
			"err", err.Error())
		return err
	}

	// Aquí se podrían encadenar otras tareas:
	// - Registrar instancia en sistemas externos
	// - Notificar al Core vía otro subject/evento
	h.logger.Infow("provisioning completed",
		"tenantInstanceId", evt.TenantInstanceId)
	return nil
}

func (h *Handler) sendToDLQ(ctx context.Context, msg *nats.Msg, reason string) {
	dlqPayload := map[string]any{
		"subject":      msg.Subject,
		"data":         string(msg.Data),
		"headers":      msg.Header,
		"failedReason": reason,
		"failedAt":     time.Now().UTC().Format(time.RFC3339),
	}
	b, _ := json.Marshal(dlqPayload)

	if _, err := h.js.PublishMsg(&nats.Msg{
		Subject: h.cfg.GetDlqSubject(),
		Data:    b,
	}); err != nil {
		h.logger.Errorw("failed to publish to DLQ", "err", err)
	}
}
```


### 3.4 Backoff exponencial (reutilizable)

`internal/retry/backoff.go`:

```go
package retry

import (
	"context"
	"errors"
	"math"
	"time"
)

// ExponentialBackoff define los parámetros de reintento.
type ExponentialBackoff struct {
	MaxAttempts   int
	InitialDelay  time.Duration
	MaxDelay      time.Duration
}

func NewExponentialBackoff(maxAttempts int, initialDelay, maxDelay time.Duration) ExponentialBackoff {
	return ExponentialBackoff{
		MaxAttempts:  maxAttempts,
		InitialDelay: initialDelay,
		MaxDelay:     maxDelay,
	}
}

// Do ejecuta fn con backoff exponencial hasta MaxAttempts.
func Do(ctx context.Context, b ExponentialBackoff, fn func() error) error {
	var lastErr error

	for attempt := 1; attempt <= b.MaxAttempts; attempt++ {
		if ctx.Err() != nil {
			return ctx.Err()
		}

		if err := fn(); err != nil {
			lastErr = err
			if attempt == b.MaxAttempts {
				break
			}
			delay := calcDelay(b.InitialDelay, b.MaxDelay, attempt)
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(delay):
			}
			continue
		}
		// éxito
		return nil
	}

	if lastErr == nil {
		lastErr = errors.New("unknown error")
	}
	return lastErr
}

func calcDelay(initial, max time.Duration, attempt int) time.Duration {
	multiplier := math.Pow(2, float64(attempt-1))
	delay := time.Duration(float64(initial) * multiplier)
	if delay > max {
		return max
	}
	return delay
}
```


### 3.5 Simulación de `ProvisionDatabase`

`internal/provisioning/models.go`:

```go
package provisioning

import (
	"context"
	"errors"
	"math/rand"
	"time"
)

// ProvisionDatabase simula la creación de la BD/Schema de un tenant.
func ProvisionDatabase(ctx context.Context, evt *InstanceProvisioningRequested) error {
	// simulación de operación remota
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-time.After(500 * time.Millisecond):
	}

	// Simulación de fallo aleatorio para demostrar reintentos
	if rand.Float32() < 0.3 {
		return errors.New("transient error provisioning database")
	}

	// En código real aquí usarías el API de tu proveedor (K8s, RDS, etc.)
	return nil
}
```


***

Con esta base:

- Tienes un Core .NET 9 con dominio rico (Catálogo, Customers, Tenancy, Subscriptions, overrides de features) listo para EF Core y multi‑tenancy híbrido.[^2][^1]
- El patrón de overrides en `Subscription` permite que el Plan sea la configuración por defecto y una tabla pequeña de overrides aplique reglas específicas sin condicionales dispersos.
- Los Workers Go implementan un patrón robusto de consumo de eventos con reintentos y DLQ sobre NATS JetStream, listo para extender a otros tipos de tareas (emails, billing, etc.).[^4][^5][^6][^3]
- El SDK .NET proporciona el punto de integración limpio para que las Apps hijas lean TenantInstance, configuración y features sin acoplarse al Core.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://learn.microsoft.com/en-us/ef/core/miscellaneous/multitenancy

[^2]: https://www.milanjovanovic.tech/blog/multi-tenant-applications-with-ef-core

[^3]: https://streamtrace.io/articles/nats-jetstream-dead-letter-queue-implementation/

[^4]: https://dev.to/antonmihaylov/implementing-a-retry-and-dlq-strategy-in-nats-jetstream-4k2k

[^5]: https://docs.nats.io/using-nats/developer/develop_jetstream/consumers

[^6]: https://www.synadia.com/blog/building-a-job-queue-with-nats-io-and-go

[^7]: https://learn.microsoft.com/th-th/ef/core/miscellaneous/multitenancy

[^8]: https://antondevtips.com/blog/how-to-implement-multitenancy-in-asp-net-core-with-ef-core

[^9]: https://www.youtube.com/watch?v=Gf1sCvikpgI

[^10]: https://www.linkedin.com/posts/sameer8saini_dotnet-9-tip-primary-constructors-everywhere-activity-7378284928666480640-r5Wd

[^11]: https://github.com/dotnet/EntityFramework.Docs/blob/main/entity-framework/core/miscellaneous/multitenancy.md

[^12]: https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/primary-constructors

[^13]: https://dev.to/raibtoffoletto/multi-tenancy-using-schemas-with-entity-framework-and-postgresql-4pe9

[^14]: https://devblogs.microsoft.com/dotnet/csharp-13-explore-preview-features/

[^15]: https://www.reddit.com/r/dotnet/comments/1ex2dcs/how_to_implement_multitenancy_in_aspnet_core_with/

