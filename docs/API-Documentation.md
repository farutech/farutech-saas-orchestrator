# Farutech SaaS Orchestrator - Documentación de APIs

## 📋 Índice

- [Autenticación](#autenticación)
- [Organizaciones](#organizaciones)
- [Aplicaciones](#aplicaciones)
- [Marketplace](#marketplace)
- [Facturación](#facturación)
- [Workers](#workers)
- [Resolución](#resolución)

## 🔐 Autenticación

### POST /api/auth/login
**Descripción**: Autentica usuario y retorna token intermedio para selección de contexto.

**Request**:
```json
{
  "email": "user@company.com",
  "password": "password123",
  "rememberMe": false
}
```

**Response**:
```json
{
  "requiresContextSelection": true,
  "intermediateToken": "eyJ...",
  "availableTenants": [...]
}
```

### POST /api/auth/select-context
**Descripción**: Intercambia token intermedio por token de acceso completo.

**Request**:
```json
{
  "intermediateToken": "eyJ...",
  "tenantId": "uuid"
}
```

## 🏢 Organizaciones

### GET /api/customers
**Descripción**: Lista organizaciones donde el usuario es Owner.

**Parámetros Query**:
- `pageNumber` (int, default: 1)
- `pageSize` (int, default: 10, max: 100)
- `filter` (string, opcional): Búsqueda por nombre, email o NIT

### POST /api/customers
**Descripción**: Crea nueva organización y asigna usuario como Owner.

**Request**:
```json
{
  "companyName": "Mi Empresa S.A.",
  "email": "contact@empresa.com",
  "phone": "+1234567890",
  "address": "Calle 123",
  "taxId": "123456789"
}
```

## 📱 Aplicaciones

### GET /api/organizations/{organizationId}/applications
**Descripción**: Lista aplicaciones de una organización.

### POST /api/provisioning/provision
**Descripción**: Provisiona nueva instancia de aplicación.

**Request**:
```json
{
  "customerId": "uuid",
  "productId": "uuid",
  "deploymentType": "Shared",
  "subscriptionPlanId": "uuid",
  "code": "MI-APP",
  "name": "Mi Aplicación"
}
```

## 🛒 Marketplace

### GET /api/marketplace/applications
**Descripción**: Catálogo completo de aplicaciones disponibles.

### GET /api/marketplace/plans/{appId}
**Descripción**: Planes disponibles para una aplicación específica.

## 💰 Facturación

### GET /api/billing/organizations/{organizationId}
**Descripción**: Estado de facturación de una organización.

### POST /api/billing/subscriptions/{subscriptionId}/upgrade
**Descripción**: Actualiza plan de suscripción.

**Request**:
```json
{
  "newPlanId": "uuid",
  "userId": "uuid"
}
```

## ⚙️ Workers

### GET /api/workers/{appId}/queue
**Descripción**: Estado de colas de procesamiento de una aplicación.

### POST /api/workers/{appId}/retry/{taskId}
**Descripción**: Reintenta tarea fallida.

## 🔍 Resolución

### GET /api/resolve/{instance}/{organization}
**Descripción**: Resuelve subdominio y retorna información de aplicación.

**Ejemplo**: `GET /api/resolve/myapp/mycompany`

---

## 🔗 URLs de Documentación

- **Scalar UI**: `http://localhost:5000/scalar`

  - Autenticación: `/scalar/auth`
  - Organizaciones: `/scalar/organizations`
  - Aplicaciones: `/scalar/applications`
  - Marketplace: `/scalar/marketplace`
  - Facturación: `/scalar/billing`
  - Workers: `/scalar/workers`

## 📊 Estados de Aplicaciones

- `provisioning`: En proceso de creación
- `active`: Activa y disponible
- `suspended`: Suspendida por falta de pago
- `deprovisioned`: Eliminada

## 🔒 Autenticación

Todos los endpoints requieren token JWT en header `Authorization: Bearer {token}`, excepto:
- `POST /api/auth/login`
- `POST /api/auth/select-context`
- `GET /api/resolve/*`

## 📝 Notas Importantes

- Las organizaciones se identifican por `CustomerId` (UUID)
- Las aplicaciones se identifican por `TenantInstanceId` (UUID)
- Los códigos de aplicación son únicos por organización
- Los subdominios siguen patrón: `{instance}.{organization}.app.{domain}`