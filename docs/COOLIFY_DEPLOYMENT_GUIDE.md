# 🚀 Guía de Despliegue para Coolify - Farutech IAM API

**Versión**: 1.0.0  
**Fecha**: 2026-02-09  
**Estado**: ✅ Producción Ready

---

## 📦 Imagen Docker

```bash
Repository: farutech-saas-orchestrator-iam-api
Tag: latest
Plataforma: linux/amd64
Base: .NET 10.0-preview (ASP.NET Core Runtime)
```

### Construcción Local

```bash
cd C:\Users\farid\farutech-saas-orchestrator
podman build -t farutech-saas-orchestrator-iam-api:latest \
  -f src/01.Core/Farutech/IAM/API/Dockerfile .
```

---

## 🔧 Variables de Entorno Requeridas

### Configuración Básica

```bash
# Entorno
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
ASPNETCORE_HTTP_PORTS=8080

# Base de Datos PostgreSQL
ConnectionStrings__PostgreSQL=Host=postgres;Port=5432;Database=farutech_iam;Username=farutech;Password=TU_PASSWORD_SEGURO

# Redis Cache
ConnectionStrings__Redis=redis:6379,password=TU_REDIS_PASSWORD,defaultDatabase=0

# NATS Message Bus
ConnectionStrings__NATS=nats://nats:4222

# JWT Settings
Jwt__SecretKey=TU_JWT_SECRET_KEY_MINIMO_32_CARACTERES
Jwt__Issuer=Farutech.IAM
Jwt__Audience=Farutech.Services
Jwt__ExpirationMinutes=60
```

### Seguridad

```bash
# Public ID Encryption
Security__PublicId__EncryptionKey=TU_ENCRYPTION_KEY_32_CARACTERES_MINIMO
Security__PublicId__Salt=TU_SALT_16_CHARS
Security__PublicId__CacheDurationMinutes=60

# Sesiones
Security__Session__NormalSessionSeconds=3600
Security__Session__ExtendedSessionSeconds=86400
Security__Session__AdminSessionSeconds=28800
Security__Session__MaxConcurrentSessions=3
Security__Session__MaxDevicesPerUser=5
Security__Session__InactivityTimeoutSeconds=1800
Security__Session__AlertOnNewDevice=true
Security__Session__RequireDeviceVerification=false
```

### Email (Opcional - SMTP)

```bash
Email__Provider=SMTP
Email__Smtp__Host=smtp.tu-servidor.com
Email__Smtp__Port=587
Email__Smtp__EnableSsl=true
Email__Smtp__Username=tu_usuario
Email__Smtp__Password=tu_password
Email__Smtp__FromEmail=noreply@farutech.com
Email__Smtp__FromName=Farutech IAM
```

---

## 🗄️ Servicios Dependientes

### PostgreSQL 16

```yaml
image: postgres:16-alpine
environment:
  POSTGRES_DB: farutech_iam
  POSTGRES_USER: farutech
  POSTGRES_PASSWORD: ${DB_PASSWORD}
ports:
  - "5432:5432"
volumes:
  - postgres_data:/var/lib/postgresql/data
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U farutech"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### Redis 7

```yaml
image: redis:7-alpine
command: redis-server --requirepass ${REDIS_PASSWORD}
ports:
  - "6379:6379"
volumes:
  - redis_data:/data
healthcheck:
  test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
  interval: 10s
  timeout: 3s
  retries: 5
```

### NATS 2.10 (Opcional para eventos)

```yaml
image: nats:2.10-alpine
command: "-js -m 8222"
ports:
  - "4222:4222"  # Client
  - "8222:8222"  # Monitoring
healthcheck:
  test: ["CMD", "wget", "--spider", "-q", "http://localhost:8222/healthz"]
  interval: 10s
  timeout: 3s
  retries: 5
```

---

## 🔌 Puertos Expuestos

| Puerto | Protocolo | Propósito |
|--------|-----------|-----------|
| 8080   | HTTP      | API Principal |
| 8081   | HTTP      | Health Check (opcional) |

**Mapeo en Coolify**: `5001:8080` (o el puerto que prefieras)

---

## 🏥 Health Checks

### Endpoint de Health Check

```bash
GET http://localhost:8080/health
```

**Respuesta esperada**: HTTP 200

### Configuración en Dockerfile

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1
```

---

## 📚 Endpoints de Documentación

### Scalar UI (Interactive API Docs)

```
http://localhost:5001/scalar
```

### OpenAPI Specification

```
http://localhost:5001/openapi/v1.json
```

---

## 🗃️ Migraciones de Base de Datos

Las migraciones se aplican **automáticamente** al iniciar el contenedor.

### Migración Actual

```
20260209211743_InitialCreate
```

### Tablas Creadas

- `iam.Users` - Usuarios del sistema
- `iam.Tenants` - Organizaciones/Empresas
- `iam.TenantMemberships` - Membresías de usuarios en tenants
- `iam.Roles` - Roles del sistema
- `iam.Permissions` - Permisos granulares
- `iam.RolePermissions` - Relación roles-permisos
- `iam.Sessions` - Sesiones activas
- `iam.RefreshTokens` - Tokens de refresco
- `iam.UserDevices` - Dispositivos de usuarios
- `iam.SecurityEvents` - Eventos de seguridad
- `iam.AuditLogs` - Logs de auditoría
- Y más... (ver código fuente)

### Seed Data

El sistema crea automáticamente:
- ✅ Roles por defecto (SuperAdmin, Admin, User, etc.)
- ✅ Permisos del sistema
- ✅ Usuario administrador inicial

---

## 📋 Configuración en Coolify

### 1. Crear Nuevo Service

```
Type: Docker Image
Name: farutech-iam-api
Image: farutech-saas-orchestrator-iam-api:latest
```

### 2. Configurar Variables de Entorno

Copiar las variables de la sección "Variables de Entorno Requeridas" y ajustar:
- Nombres de hosts (usar nombres de servicios en Coolify)
- Passwords seguros
- JWT Secret Key (generar uno nuevo)
- Encryption keys

### 3. Configurar Dependencias

**Orden de inicio**:
1. PostgreSQL
2. Redis
3. NATS (opcional)
4. IAM API

**Health Check Dependencies**:
- Esperar a que PostgreSQL esté `healthy`
- Esperar a que Redis esté `healthy`

### 4. Configurar Red

```
Network Mode: Bridge
Ports: 5001:8080
```

### 5. Configurar Volúmenes (Opcional)

```
/app/keys -> Para claves RSA persistentes (opcional)
```

---

## 🔐 Seguridad

### Consideraciones Importantes

1. **Cambiar TODAS las contraseñas por defecto**
   - PostgreSQL password
   - Redis password
   - JWT secret key
   - Encryption keys

2. **Generar claves seguras**
   ```bash
   # JWT Secret (min 32 chars)
   openssl rand -base64 32
   
   # Encryption Key (min 32 chars)
   openssl rand -base64 32
   
   # Salt (16 chars)
   openssl rand -base64 16
   ```

3. **Configurar HTTPS**
   - Usar un reverse proxy (Nginx/Traefik)
   - Certificados SSL/TLS
   - Coolify lo hace automáticamente con Caddy

4. **Rate Limiting** (ya implementado en el código)
   - Login: 5 intentos/minuto
   - Register: 3 intentos/minuto
   - Token refresh: 10 intentos/minuto

---

## 🚀 Despliegue Paso a Paso en Coolify

### Paso 1: Subir Imagen a Registry

```bash
# Opción A: Docker Hub
docker tag farutech-saas-orchestrator-iam-api:latest usuario/farutech-iam-api:latest
docker push usuario/farutech-iam-api:latest

# Opción B: GitHub Container Registry
docker tag farutech-saas-orchestrator-iam-api:latest ghcr.io/farutech/iam-api:latest
docker push ghcr.io/farutech/iam-api:latest

# Opción C: Registry Privado
docker tag farutech-saas-orchestrator-iam-api:latest tu-registry.com/iam-api:latest
docker push tu-registry.com/iam-api:latest
```

### Paso 2: Crear Services en Coolify

1. **PostgreSQL**
   - Image: `postgres:16-alpine`
   - Environment: Ver sección "Servicios Dependientes"
   - Volume: `postgres_data:/var/lib/postgresql/data`

2. **Redis**
   - Image: `redis:7-alpine`
   - Command: `redis-server --requirepass TU_PASSWORD`
   - Volume: `redis_data:/data`

3. **IAM API**
   - Image: `usuario/farutech-iam-api:latest` (o tu registry)
   - Environment: Ver sección "Variables de Entorno"
   - Port: `5001:8080` (o el puerto que prefieras)
   - Depends On: postgres (healthy), redis (healthy)

### Paso 3: Configurar Dominio

```
Domain: iam.tudominio.com
HTTPS: Enabled (Automatic SSL)
```

### Paso 4: Deploy

```bash
# Coolify hace esto automáticamente
docker pull usuario/farutech-iam-api:latest
docker compose up -d
```

---

## 📊 Monitoreo

### Logs

```bash
# En Coolify
Ver logs en tiempo real desde la UI

# Docker directo
docker logs -f farutech-iam-api
```

### Métricas

```bash
# Health Check
curl http://localhost:5001/health

# Redis monitoring
redis-cli --raw incr ping

# PostgreSQL monitoring
pg_isready -U farutech

# NATS monitoring
curl http://localhost:8222/healthz
```

---

## 🔄 Actualización de la Imagen

```bash
# 1. Construir nueva versión
docker build -t farutech-saas-orchestrator-iam-api:v1.0.1 .

# 2. Subir a registry
docker push usuario/farutech-iam-api:v1.0.1

# 3. Actualizar en Coolify
# - Cambiar tag de imagen a v1.0.1
# - Click en "Redeploy"
```

---

## ⚠️ Troubleshooting

### La aplicación no inicia

1. Verificar logs: `docker logs farutech-iam-api`
2. Verificar que PostgreSQL esté accessible
3. Verificar que Redis esté accessible
4. Verificar variables de entorno

### Error de migraciones

```bash
# Aplicar manualmente
dotnet ef database update --startup-project API --context IamDbContext \
  --connection "Host=postgres;Port=5432;Database=farutech_iam;Username=farutech;Password=TU_PASSWORD"
```

### Error 401 en todos los endpoints

- Verificar que JWT secret key esté configurado
- Verificar que la base de datos tenga datos seed

### Scalar UI no carga

- Verificar que ASPNETCORE_ENVIRONMENT esté en "Production" o "Development"
- La ruta es `/scalar` (no `/swagger`)

---

## 📞 Soporte

**Documentación Técnica**: Ver `/docs` en el repositorio  
**API Documentation**: http://localhost:5001/scalar

---

## ✅ Checklist Pre-Producción

- [ ] Todas las contraseñas cambiadas
- [ ] JWT secret key generado (>32 caracteres)
- [ ] Encryption keys generados
- [ ] PostgreSQL con backups configurados
- [ ] Redis con persistencia activada
- [ ] HTTPS/SSL configurado
- [ ] Dominio apuntando correctamente
- [ ] Health checks pasando
- [ ] Logs monitoreándose
- [ ] Variables de entorno documentadas
- [ ] Estrategia de rollback definida

---

**✨ La imagen está lista para despliegue en Coolify o cualquier plataforma de contenedores.**
