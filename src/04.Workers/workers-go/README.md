# Farutech Orchestrator Workers (Go)

Worker service para procesamiento resiliente de tareas de aprovisionamiento con NATS JetStream.

## 🎯 Características

- ✅ Conexión resiliente a NATS JetStream con reconexión automática
- ✅ Pull-based consumer con procesamiento confiable
- ✅ Retry logic con exponential backoff (hasta 5 intentos)
- ✅ Dead Letter Queue (DLQ) para tareas fallidas
- ✅ Procesamiento idempotente de tareas
- ✅ Graceful shutdown
- ✅ Métricas y logging estructurado

## 📂 Estructura

```
workers-go/
├── cmd/
│   ├── worker/          # Punto de entrada del worker
│   └── publisher/       # Herramienta de prueba para publicar tareas
├── internal/
│   ├── config/          # Configuración desde variables de entorno
│   ├── nats/            # Cliente NATS JetStream y lógica de worker
│   │   ├── client.go    # Conexión NATS
│   │   └── worker.go    # Procesamiento de mensajes y retry
│   ├── handlers/        # Lógica de procesamiento de tareas
│   │   └── provisioner.go
│   └── models/          # Modelos de datos
│       └── task.go
├── bin/                 # Binarios compilados
├── go.mod
├── Makefile
├── build.ps1           # Script de compilación (Windows)
└── run.ps1             # Script de ejecución (Windows)
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Go 1.22+
- NATS JetStream running (usar `.\scripts\start-infra.ps1`)

### Instalación de dependencias

```bash
go mod download
```

### Compilación

**Windows:**
```powershell
.\build.ps1
```

**Linux/Mac:**
```bash
make build
```

### Ejecución

**Windows:**
```powershell
.\run.ps1
```

**Manual:**
```bash
go run ./cmd/worker
```

**Con variables de entorno:**
```bash
$env:NATS_URL = "nats://localhost:4222"
$env:WORKER_ID = "worker-prod-01"
go run ./cmd/worker
```

## 📊 Arquitectura de Retry

### Flujo de Procesamiento

```
┌─────────────────┐
│  NATS Stream    │
│  (provisioning) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pull Consumer  │◄─── Fetch (batch=1)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Process Message │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Success? │
    └────┬────┘
         │
    ┌────┴────────────┐
    │ YES         NO  │
    ▼                 ▼
┌────────┐    ┌──────────────┐
│  ACK   │    │ Attempt < 5? │
└────────┘    └──────┬───────┘
                     │
            ┌────────┴─────────┐
            │ YES          NO  │
            ▼                  ▼
        ┌──────┐          ┌──────┐
        │ NACK │          │ TERM │
        │(retry)│         │ +DLQ │
        └──────┘          └──────┘
```

### Exponential Backoff

- **Attempt 1:** 10s + jitter
- **Attempt 2:** 20s + jitter
- **Attempt 3:** 40s + jitter
- **Attempt 4:** 80s + jitter
- **Attempt 5:** 160s + jitter
- **Max delay:** 300s (5 min)

Jitter: ±20% para evitar thundering herd

## 🧪 Pruebas

### Publicar tareas de prueba

**Compilar publisher:**
```bash
.\build.ps1  # Compila worker y publisher
```

**Enviar 5 tareas:**
```bash
.\bin\publisher.exe -count 5
```

**Enviar tarea específica:**
```bash
.\bin\publisher.exe -type provision -tenant acme-corp -module erp-finance
```

**Opciones del publisher:**
- `-nats` - URL de NATS (default: nats://localhost:4222)
- `-type` - Tipo de tarea: provision, deprovision, update
- `-tenant` - ID del tenant
- `-module` - ID del módulo
- `-count` - Número de tareas a publicar

## 📈 Monitoring

### Ver mensajes en stream

```bash
nats stream info PROVISIONING
```

### Ver DLQ

```bash
nats stream view PROVISIONING --subject provisioning.dlq
```

### Consumer info

```bash
nats consumer info PROVISIONING provisioning-worker
```

## 🔧 Configuración Avanzada

### Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `NATS_URL` | `nats://localhost:4222` | URL del servidor NATS |
| `WORKER_ID` | `worker-001` | Identificador único del worker |

### Parámetros del Stream

- **Retention:** WorkQueue (auto-delete al ACK)
- **Max Age:** 72 horas
- **Storage:** File (persistente)
- **Max Deliver:** 5 intentos
- **ACK Wait:** 30 segundos

## 🐛 Troubleshooting

### Worker no conecta a NATS
```bash
# Verificar que NATS está corriendo
curl http://localhost:8222/healthz

# Verificar logs de NATS
docker-compose logs nats
```

### Mensajes no se procesan
```bash
# Ver consumer lag
nats consumer info PROVISIONING provisioning-worker

# Ver mensajes pendientes
nats stream info PROVISIONING
```

### Tareas en DLQ
```bash
# Ver mensajes en DLQ
nats stream view PROVISIONING --subject provisioning.dlq

# Republicar desde DLQ (manualmente)
# TODO: Implementar herramienta de replay
```

## 🚀 Deployment

### Docker (próximamente)

```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o worker ./cmd/worker

FROM alpine:latest
COPY --from=builder /app/worker /worker
CMD ["/worker"]
```

### Kubernetes (próximamente)

- Deployment con replicas para alta disponibilidad
- HorizontalPodAutoscaler basado en mensajes pendientes
- ConfigMap para configuración
- Secret para credenciales NATS

## 📝 Características

- ✅ Conexión resiliente a NATS con reconexión automática
- ✅ Estructura modular con Clean Architecture
- ✅ Retry logic con backoff exponencial (5 intentos)
- ✅ Dead Letter Queue (DLQ) para tareas fallidas
- ✅ Graceful shutdown
- ✅ Procesamiento idempotente
- 🔜 Métricas con Prometheus
- 🔜 Tracing distribuido
- 🔜 Health checks endpoint
