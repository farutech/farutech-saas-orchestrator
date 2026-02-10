# 🚀 Script de Despliegue IAM con Podman

## Estado de Servicios

✅ **Servicios de Infraestructura Saludables**:
- PostgreSQL: `farutech-postgres` (puerto 5432) - HEALTHY
- Redis: `farutech-redis` (puerto 6379) - HEALTHY  
- NATS: `farutech-nats` (puertos 4222, 8222) - HEALTHY

🔄 **Servicios Iniciando**:
- IAM API: `farutech-iam-api` (puerto 5001) - STARTING
- pgAdmin: `farutech_pgadmin` (puerto 5050) - STARTING
- MailHog: `farutech-mailhog` (puertos 1025, 8025) - UP

## Comandos Útiles

### Verificar Estado
```powershell
# Ver todos los contenedores
podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Ver logs del IAM API
podman logs -f farutech-iam-api

# Ver logs de PostgreSQL
podman logs -f farutech-postgres
```

### Gestión de Servicios
```powershell
# Detener todos los servicios
podman compose -f .\docker-compose.iam.yml down

# Iniciar solo infraestructura
podman compose -f .\docker-compose.iam.yml up -d postgres redis nats

# Iniciar todos los servicios
podman compose -f .\docker-compose.iam.yml up -d

# Reiniciar un servicio específico
podman compose -f .\docker-compose.iam.yml restart iam-api
```

### Reconstruir Imagen
```powershell
# Reconstruir la imagen del IAM API
podman compose -f .\docker-compose.iam.yml build iam-api

# Reconstruir sin caché
podman compose -f .\docker-compose.iam.yml build --no-cache iam-api
```

### Health Checks
```powershell
# Health check del API
curl http://localhost:5001/health

# Health check de PostgreSQL  
podman exec farutech-postgres pg_isready -U farutech

# Health check de Redis
podman exec farutech-redis redis-cli --raw incr ping

# Health check de NATS
curl http://localhost:8222/healthz
```

## URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| IAM API | http://localhost:5001 | API principal |
| Scalar UI | http://localhost:5001/scalar | Documentación interactiva |
| pgAdmin | http://localhost:5050 | Administración PostgreSQL |
| MailHog UI | http://localhost:8025 | Testing de emails |
| NATS Monitor | http://localhost:8222 | Monitoreo NATS |

## Credenciales

### PostgreSQL
- Host: localhost:5432
- Database: farutech_iam
- Username: farutech
- Password: FarutechSecure2024!

### pgAdmin
- Email: admin@farutech.com
- Password: Admin@2026

### Redis
- Host: localhost:6379
- Password: FarutechRedis2024!

## Troubleshooting

### API no inicia
```powershell
# Ver logs detallados
podman logs farutech-iam-api

# Verificar que la BD esté lista
podman exec farutech-postgres pg_isready -U farutech

# Reiniciar el contenedor
podman compose -f .\docker-compose.iam.yml restart iam-api
```

### Error de conexión a BD
```powershell
# Verificar network
podman network inspect farutech-saas-orchestrator_farutech-network

# Probar conexión desde el contenedor
podman exec farutech-iam-api curl postgres:5432
```

### Limpiar todo y empezar de nuevo
```powershell
# Detener y eliminar todo
podman compose -f .\docker-compose.iam.yml down -v

# Eliminar imágenes
podman rmi farutech-saas-orchestrator-iam-api

# Reconstruir y levantar
podman compose -f .\docker-compose.iam.yml build
podman compose -f .\docker-compose.iam.yml up -d
```

## Notas Importantes

1. **Primera vez**: El API puede tardar 30-60 segundos en estar listo mientras aplica migraciones de BD
2. **Health check**: El contenedor permanecerá en estado "starting" hasta pasar el health check
3. **.NET 10 Preview**: Se usa la imagen `mcr.microsoft.com/dotnet/aspnet:10.0-preview`
4. **Volúmenes**: Los datos persisten en volúmenes Docker incluso después de `down`

## Siguiente Paso

Una vez que el API esté saludable (status: healthy), acceder a:
- http://localhost:5001/scalar - Documentación Scalar UI
- http://localhost:5001/health - Verificar health status
