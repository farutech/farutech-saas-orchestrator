# Configuración de Base de Datos y NATS para Todos los Entornos

## Base de Datos PostgreSQL

- **Nombre del servicio:** `postgres`
- **Nombre de la base de datos:** `farutec_db`
- **Usuario:** `postgres` (o el que definas por variable)
- **Puerto:** `5432`

### Variables de entorno recomendadas

- `POSTGRES_DB=farutec_db`
- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=una_contraseña_segura`

### Cadena de conexión estándar

```
Host=postgres;Port=5432;Database=farutec_db;Username=postgres;Password=TU_PASSWORD
```

- En Aspire, Docker, Kubernetes, Podman, etc., usa siempre el mismo nombre de servicio y base de datos para facilitar la portabilidad.
- En ambientes QA, Staging, Prod, define la cadena de conexión por variable/secreto: `Parameters:postgres-conn-string`.

---

## NATS

- **Nombre del servicio:** `nats`
- **Puerto:** `4222`

### Variables de entorno recomendadas

- `NATS_HOST=nats`
- `NATS_PORT=4222`
- `NATS_USER=usuario` (opcional)
- `NATS_PASSWORD=contraseña` (opcional)

---

## Health Check API

- El endpoint de health check real es: `/health/live`
- El sistema espera a que la base de datos esté lista antes de aplicar migraciones.
- El estado de salud debe ser positivo si la base de datos y NATS están accesibles.

---

## Notas para despliegue

- Todos los valores pueden ser sobreescritos por variables de entorno o parámetros Aspire.
- Para exponer el puerto de Postgres fuera de Aspire, usa la configuración de tu orquestador (Docker Compose, Kubernetes, etc.).
- No expongas puertos a internet sin protección.
- Usa secretos para credenciales en producción.

---

## Ejemplo de conexión desde otro servicio

```
Host=postgres;Port=5432;Database=farutec_db;Username=postgres;Password=TU_PASSWORD
```

## Ejemplo de health check

```
GET http://localhost:<puerto-api>/health/live
```

---

Para más detalles, revisa el archivo `AppHost.cs` y la configuración de tu orquestador.
