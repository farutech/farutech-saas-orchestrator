# ESTRATEGIA DE CONEXIÓN Y MULTI-TENANCY

El sistema usa PostgreSQL. La conexión se determina dinámicamente según el tipo de Organización.

## Lógica de Enrutamiento (Connection Factory)

### Caso A: Cliente Estándar (Shared Infrastructure)
Si la Organización es `IsDedicated = false`:
- **Servidor/DB:** `farutech_db_customers` (Base de datos central compartida).
- **Schema:** `tenant_{TenantId}` (Aislamiento lógico por esquema).
- *Nota:* Todos los clientes pequeños viven aquí, cada uno en su propio esquema.

### Caso B: Cliente Enterprise (Dedicated Infrastructure)
Si la Organización es `IsDedicated = true`:
- **Servidor/DB:** `farutech_db_customer_{OrgIdentifier}` (Base de datos FÍSICA independiente).
    - Ejemplo: `farutech_db_customer_exito`, `farutech_db_customer_cocacola`.
- **Schema:** `tenant_{TenantId}`.
- *Nota:* Aunque la DB es dedicada, seguimos usando el prefijo de esquema para mantener compatibilidad con las migraciones.

## Limpieza de Deuda Técnica
Actualmente existen esquemas huérfanos o mal nombrados (`public`, `schema1`, etc.).
- **Acción:** El sistema debe usar SIEMPRE el patrón `tenant_{GUID}`.
- **Acción:** El esquema `public` solo debe contener tablas de administración global si es necesario, o estar vacío.