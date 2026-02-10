# Guía de Despliegue Docker - Farutech IAM

Esta guía explica cómo desplegar el sistema IAM utilizando Docker o Podman, sin necesidad de .NET Aspire.

## 📋 Prerrequisitos

### Opción 1: Docker
```bash
# Windows (con Docker Desktop)
winget install Docker.DockerDesktop

# Verificar instalación
docker --version
docker-compose --version
```

### Opción 2: Podman (alternativa sin daemon)
```powershell
# Windows
winget install RedHat.Podman
winget install RedHat.Podman-Desktop

# Verificar instalación
podman --version
podman-compose --version
```

## 🏗️ Arquitectura del Stack

El deployment incluye:

- **PostgreSQL 16**: Base de datos principal
- **Redis 7**: Cache para PublicIds y sesiones
- **NATS 2.10**: Message bus para eventos
- **IAM API**: Servicio de autenticación y autorización
- **MailHog**: Servidor SMTP de prueba (development)
- **Prometheus** (opcional): Recolección de métricas
- **Grafana** (opcional): Visualización de métricas

## 🚀 Despliegue Rápido

### 1. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
notepad .env  # Windows
```

**Valores mínimos requeridos:**
```env
DB_PASSWORD=TuPasswordSeguro123!
REDIS_PASSWORD=RedisSeguro123!
JWT_SECRET=clave-jwt-minimo-32-caracteres-muy-segura-cambiar-en-produccion
PUBLICID_KEY=clave-encriptacion-32-caracteres-minimo
PUBLICID_SALT=salt-16-caracteres
```

### 2. Iniciar Servicios

#### Usando Docker:
```powershell
# Iniciar todos los servicios
.\scripts\deploy-iam.ps1 -Action start

# Iniciar con monitoreo (Prometheus + Grafana)
.\scripts\deploy-iam.ps1 -Action start -Monitoring
```

#### Usando Podman:
```powershell
.\scripts\deploy-iam.ps1 -Action start -Tool podman
```

### 3. Verificar Servicios

```powershell
# Ver estado de servicios
.\scripts\deploy-iam.ps1 -Action status

# Ver logs de todos los servicios
.\scripts\deploy-iam.ps1 -Action logs

# Ver logs de un servicio específico
.\scripts\deploy-iam.ps1 -Action logs -Service iam-api
```

## 🌐 Endpoints Disponibles

Después del despliegue, los servicios estarán disponibles en:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **IAM API** | http://localhost:5001 | API REST principal |
| **Scalar UI** | http://localhost:5001/scalar | Documentación interactiva |
| **Health Check** | http://localhost:5001/health | Estado de la API |
| **PostgreSQL** | localhost:5432 | Base de datos |
| **Redis** | localhost:6379 | Cache (requiere password) |
| **NATS** | localhost:4222 | Message bus |
| **NATS Monitor** | http://localhost:8222 | Panel de NATS |
| **MailHog UI** | http://localhost:8025 | Correos de prueba |
| **Prometheus** | http://localhost:9090 | Métricas (con -Monitoring) |
| **Grafana** | http://localhost:3000 | Dashboards (con -Monitoring) |

## 🔧 Comandos Útiles

### Gestión de Servicios

```powershell
# Detener todos los servicios
.\scripts\deploy-iam.ps1 -Action stop

# Reiniciar servicios
.\scripts\deploy-iam.ps1 -Action restart

# Reconstruir imágenes (después de cambios en código)
.\scripts\deploy-iam.ps1 -Action build

# Limpiar todo (contenedores + volúmenes)
.\scripts\deploy-iam.ps1 -Action clean
```

### Comandos Docker Directo

```bash
# Ver contenedores activos
docker ps

# Ver logs de IAM API
docker logs -f farutech-iam-api

# Conectar a PostgreSQL
docker exec -it farutech-postgres psql -U farutech -d farutech_iam

# Conectar a Redis
docker exec -it farutech-redis redis-cli -a FarutechRedis2024!

# Ver uso de recursos
docker stats
```

### Comandos Podman Directo

```bash
# Ver contenedores activos
podman ps

# Ver logs de IAM API
podman logs -f farutech-iam-api

# Ejecutar comando en contenedor
podman exec -it farutech-postgres psql -U farutech -d farutech_iam
```

## 📊 Base de Datos

### Ejecutar Migraciones

Las migraciones se ejecutan automáticamente al iniciar el contenedor IAM API. Si necesitas ejecutarlas manualmente:

```bash
# Dentro del contenedor
docker exec -it farutech-iam-api dotnet ef database update

# O desde el host (requiere .NET SDK)
cd src/01.Core/Farutech/IAM/API
dotnet ef database update
```

### Ejecutar Script de Seguridad

```bash
# Aplicar la migración de seguridad IAM
docker exec -i farutech-postgres psql -U farutech -d farutech_iam < scripts/iam-security-enhancement-migration.sql
```

### Backup y Restore

```powershell
# Backup
docker exec farutech-postgres pg_dump -U farutech farutech_iam > backup.sql

# Restore
Get-Content backup.sql | docker exec -i farutech-postgres psql -U farutech farutech_iam
```

## 🧪 Testing

### Test Manual con Scalar

1. Abrir http://localhost:5001/scalar
2. Probar endpoint POST /api/auth/register
3. Verificar email en http://localhost:8025 (MailHog)
4. Usar token para probar endpoints protegidos

### Test con curl

```bash
# Registrar usuario
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@farutech.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@farutech.com",
    "password": "Test123!"
  }'
```

### Test de Health Check

```bash
curl http://localhost:5001/health
```

## 🐛 Troubleshooting

### El contenedor IAM API no inicia

```powershell
# Ver logs detallados
.\scripts\deploy-iam.ps1 -Action logs -Service iam-api

# Verificar que las dependencias estén saludables
docker ps --filter "health=healthy"

# Reiniciar solo IAM API
docker restart farutech-iam-api
```

### Error de conexión a PostgreSQL

```powershell
# Verificar que PostgreSQL esté corriendo
docker exec farutech-postgres pg_isready -U farutech

# Ver logs de PostgreSQL
docker logs farutech-postgres

# Verificar conectividad de red
docker network inspect farutech-network
```

### Error de conexión a Redis

```bash
# Test de conexión
docker exec farutech-redis redis-cli -a FarutechRedis2024! ping
# Debe responder: PONG

# Ver logs de Redis
docker logs farutech-redis
```

### Puerto ya en uso

```powershell
# Windows: Ver qué proceso usa el puerto
netstat -ano | findstr :5001

# Cambiar puerto en docker-compose.iam.yml
# Modificar la sección ports de iam-api:
# ports:
#   - "5002:8080"  # Cambiar 5001 por otro puerto
```

### Limpiar completamente y reiniciar

```powershell
# Detener todo
.\scripts\deploy-iam.ps1 -Action stop

# Limpiar volúmenes y redes
.\scripts\deploy-iam.ps1 -Action clean

# Reconstruir imágenes
.\scripts\deploy-iam.ps1 -Action build

# Iniciar de nuevo
.\scripts\deploy-iam.ps1 -Action start
```

## 📈 Monitoreo (Opcional)

### Habilitar Prometheus y Grafana

```powershell
.\scripts\deploy-iam.ps1 -Action start -Monitoring
```

### Configurar Grafana

1. Abrir http://localhost:3000
2. Login: admin / admin (o el valor de GRAFANA_PASSWORD)
3. Agregar datasource: Prometheus (http://prometheus:9090)
4. Importar dashboards predefinidos de `monitoring/grafana/dashboards/`

### Métricas Disponibles

- **IAM API**: `/metrics` endpoint con métricas de ASP.NET Core
- **PostgreSQL**: Consultas, conexiones, latencia
- **Redis**: Hits/misses, memoria, comandos
- **Sistema**: CPU, memoria, disco, red

## 🔐 Seguridad en Producción

### Variables de Entorno Críticas

```env
# Generar claves seguras
JWT_SECRET=$(openssl rand -base64 48)
PUBLICID_KEY=$(openssl rand -base64 32)
PUBLICID_SALT=$(openssl rand -base64 16)
DB_PASSWORD=$(openssl rand -base64 24)
REDIS_PASSWORD=$(openssl rand -base64 24)
```

### Recomendaciones

1. **No usar valores por defecto** en producción
2. **Habilitar SSL/TLS** para PostgreSQL y Redis
3. **Usar secretos** de Docker/Kubernetes en lugar de variables
4. **Limitar acceso de red** solo a IPs permitidas
5. **Backups automáticos** de PostgreSQL
6. **Rotación de claves** periódica
7. **Logs centralizados** (ELK Stack, Loki, etc.)

### Configuración HTTPS

Para habilitar HTTPS en IAM API, modificar `docker-compose.iam.yml`:

```yaml
iam-api:
  environment:
    ASPNETCORE_URLS: https://+:8443;http://+:8080
    ASPNETCORE_HTTPS_PORT: 8443
    ASPNETCORE_Kestrel__Certificates__Default__Path: /app/certs/certificate.pfx
    ASPNETCORE_Kestrel__Certificates__Default__Password: ${CERT_PASSWORD}
  volumes:
    - ./certs:/app/certs:ro
  ports:
    - "5001:8443"
    - "5000:8080"
```

## 📚 Referencias

- [Docker Documentation](https://docs.docker.com/)
- [Podman Documentation](https://docs.podman.io/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [NATS Docker Hub](https://hub.docker.com/_/nats)

## 🆘 Soporte

Para problemas o preguntas:

1. Revisar logs: `.\scripts\deploy-iam.ps1 -Action logs`
2. Verificar estado: `.\scripts\deploy-iam.ps1 -Action status`
3. Consultar [PROGRESS.md](../PROGRESS.md) para el estado del proyecto
4. Consultar [docs/IAM_SECURITY_IMPROVEMENTS.md](./IAM_SECURITY_IMPROVEMENTS.md)
