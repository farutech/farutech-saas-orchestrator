# Flujo de Selección de Aplicación - Documentación

## 📋 Resumen

Se ha implementado el flujo completo de selección de aplicación/instancia en el frontend. Esto permite que después de que un usuario seleccione su organización, pueda elegir a qué aplicación (como POS, E-commerce, etc.) desea ingresar.

## 🔄 Flujo de Autenticación Completo

### Antes (2 pasos):
1. **Login** → Obtener organizaciones disponibles
2. **Seleccionar Organización** → Acceder al Launcher

### Ahora (3 pasos):
1. **Login** → Obtener organizaciones disponibles
2. **Seleccionar Organización** → Obtener aplicaciones disponibles
3. **Seleccionar Aplicación** → Acceder al dashboard de la aplicación

## 🏗️ Componentes Implementados

### 1. **AuthContext - Actualizado**
**Ubicación:** `src/contexts/AuthContext.tsx`

**Nuevas propiedades de estado:**
```typescript
requiresInstanceSelection: boolean;      // Indica si el usuario debe seleccionar una aplicación
availableInstances: InstanceDto[];       // Lista de aplicaciones disponibles
selectedTenant: TenantOptionDto | null;  // Tenant seleccionado actualmente
```

**Nuevos métodos:**
```typescript
selectInstance(instanceId: string): Promise<void>
```

**AuthUser extendido:**
```typescript
interface AuthUser {
  email: string;
  fullName?: string;
  role?: string;
  tenantId?: string;
  companyName?: string;
  instanceId?: string;      // ← Nuevo
  instanceName?: string;    // ← Nuevo
  instanceType?: string;    // ← Nuevo
  instanceUrl?: string;     // ← Nuevo
}
```

### 2. **SelectInstance Page**
**Ubicación:** `src/pages/SelectInstance.tsx`

**Características:**
- Grid responsivo de aplicaciones disponibles
- Iconos dinámicos según el tipo de aplicación (POS, E-commerce, etc.)
- Badge de estado (Activo, En configuración)
- Deshabilita aplicaciones que no están activas
- Botón para volver a la selección de organizaciones

**Estados visuales:**
- ✅ **Active/Running**: Aplicación lista para usar (verde)
- ⚠️ **Pending/Provisioning**: En configuración (amarillo)
- ⚫ **Otros**: Estado genérico (gris)

## 📊 Tipos de Datos

### InstanceDto
```typescript
interface InstanceDto {
  instanceId: string;    // UUID de la instancia
  name: string;          // "Tienda Principal POS"
  type: string;          // "POS", "ECOMMERCE", "INVENTORY"
  code: string;          // "POS001"
  status: string;        // "active", "pending", "provisioning"
  url: string;           // "https://pos.tuempresa.com"
}
```

### TenantOptionDto (Actualizado)
```typescript
interface TenantOptionDto {
  tenantId: string;
  companyName?: string;
  companyCode?: string;
  taxId?: string;
  role?: string;
  isOwner?: boolean;
  isActive?: boolean;
  instances?: InstanceDto[];  // ← Lista de aplicaciones
}
```

## 🎯 Casos de Uso

### Caso 1: Organización con múltiples aplicaciones
```typescript
// Respuesta del backend en /api/Auth/login
{
  "requiresContextSelection": true,
  "intermediateToken": "eyJ...",
  "availableTenants": [
    {
      "tenantId": "123",
      "companyName": "Mi Empresa",
      "instances": [
        {
          "instanceId": "inst-001",
          "name": "Tienda Principal POS",
          "type": "POS",
          "code": "POS001",
          "status": "active",
          "url": "https://pos.miempresa.com"
        },
        {
          "instanceId": "inst-002",
          "name": "Tienda Online",
          "type": "ECOMMERCE",
          "code": "ECOM001",
          "status": "active",
          "url": "https://shop.miempresa.com"
        }
      ]
    }
  ]
}
```

**Flujo:**
1. Usuario hace login
2. Sistema detecta múltiples tenants → Muestra selector de organización
3. Usuario selecciona "Mi Empresa"
4. Sistema detecta múltiples instancias → Muestra selector de aplicación (`/select-instance`)
5. Usuario selecciona "Tienda Principal POS"
6. Sistema obtiene token final y redirige a `https://pos.miempresa.com`

### Caso 2: Organización con una sola aplicación
```typescript
{
  "requiresContextSelection": true,
  "intermediateToken": "eyJ...",
  "availableTenants": [
    {
      "tenantId": "456",
      "companyName": "Otra Empresa",
      "instances": [
        {
          "instanceId": "inst-003",
          "name": "POS Único",
          "type": "POS",
          "status": "active",
          "url": "https://pos.otraempresa.com"
        }
      ]
    }
  ]
}
```

**Flujo:**
1. Usuario hace login
2. Usuario selecciona "Otra Empresa"
3. Sistema detecta UNA sola instancia → **Selección automática** (sin pantalla de selección)
4. Usuario es redirigido directamente a `https://pos.otraempresa.com`

### Caso 3: Organización sin aplicaciones
```typescript
{
  "requiresContextSelection": true,
  "intermediateToken": "eyJ...",
  "availableTenants": [
    {
      "tenantId": "789",
      "companyName": "Empresa Nueva",
      "instances": []  // ← Sin aplicaciones
    }
  ]
}
```

**Flujo:**
1. Usuario hace login
2. Usuario selecciona "Empresa Nueva"
3. Sistema no detecta instancias → Redirige al `/launcher` (vista vacía)
4. Launcher muestra mensaje: "No tienes aplicaciones asignadas"

## 🔧 Configuración en Program.cs (Backend)

Para que esto funcione, el backend debe incluir las instancias en la respuesta de login:

```csharp
// En AuthController.cs - Login endpoint
var availableTenants = userRoles.Select(ur => new TenantOptionDto
{
    TenantId = ur.Tenant.Id,
    CompanyName = ur.Tenant.Organization.Name,
    Role = ur.Role.Name,
    IsOwner = ur.Role.Name == "Owner",
    IsActive = ur.Tenant.IsActive,
    Instances = ur.Tenant.Instances
        .Where(i => i.IsActive)
        .Select(i => new InstanceDto
        {
            InstanceId = i.Id,
            Name = i.Name,
            Type = i.Type,  // "POS", "ECOMMERCE", etc.
            Code = i.Code,
            Status = i.Status,
            Url = i.Url
        })
        .ToList()
}).ToList();
```

## 🎨 UI/UX

### Diseño Visual
- **Gradiente de fondo:** Morado a azul (consistente con el theme de Farutech)
- **Cards con hover effect:** Escala 1.05 al pasar el mouse
- **Iconos dinámicos:** Store (POS), ShoppingBag (E-commerce), Warehouse (Inventory)
- **Badges de estado:** Códigos de color según estado de la aplicación

### Responsividad
- **Mobile:** 1 columna
- **Tablet:** 2 columnas
- **Desktop:** 3 columnas

### Accesibilidad
- Aplicaciones inactivas están deshabilitadas visualmente (opacity: 0.75)
- Feedback visual claro al hacer hover
- Toast notifications para confirmaciones

## 🔐 Seguridad

1. **Token Management:**
   - El `intermediateToken` se mantiene durante la selección
   - Se limpia inmediatamente después de obtener el `accessToken` final
   - No se permite acceso a `/select-instance` sin token intermedio válido

2. **Validación de Estado:**
   - Solo aplicaciones con `status: "active"` son clickeables
   - Aplicaciones en provisioning muestran mensaje de espera

3. **Session Storage:**
   - `farutech_available_instances` - Instancias disponibles (temporal)
   - `farutech_selected_tenant` - Tenant seleccionado (temporal)
   - Se limpian al completar la selección o al cerrar sesión

## 🚀 Navegación

### Rutas Agregadas
```typescript
// App.tsx
<Route path="/select-instance" element={<SelectInstance />} />
```

### Flujo de Navegación
```
/login
  ↓
/launcher (selección de organización)
  ↓
/select-instance (selección de aplicación) ← NUEVO
  ↓
https://pos.miempresa.com (dashboard de la app)
```

## 📝 Ejemplo de Integración

### Frontend - Mostrar instancias en Launcher
```typescript
// En LauncherPage.tsx
const { selectContext, availableTenants } = useAuth();

const handleSelectTenant = (tenantId: string) => {
  // El AuthContext se encargará de detectar múltiples instancias
  // y redirigir a /select-instance si es necesario
  selectContext(tenantId);
};
```

### Backend - Respuesta de Login
```json
{
  "requiresContextSelection": true,
  "intermediateToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "availableTenants": [
    {
      "tenantId": "550e8400-e29b-41d4-a716-446655440000",
      "companyName": "Farutech Solutions",
      "role": "Owner",
      "isOwner": true,
      "isActive": true,
      "instances": [
        {
          "instanceId": "inst-pos-001",
          "name": "POS Tienda Centro",
          "type": "POS",
          "code": "POS-TC-001",
          "status": "active",
          "url": "http://localhost:3001"
        },
        {
          "instanceId": "inst-pos-002",
          "name": "POS Tienda Norte",
          "type": "POS",
          "code": "POS-TN-001",
          "status": "provisioning",
          "url": "http://localhost:3002"
        }
      ]
    }
  ]
}
```

## ✅ Testing Manual

### Escenario 1: Login con múltiples apps
1. Login con usuario que tiene 2+ aplicaciones
2. Seleccionar organización en Launcher
3. Verificar redirección a `/select-instance`
4. Ver grid de aplicaciones
5. Click en aplicación activa
6. Verificar redirección a URL de la app

### Escenario 2: Login con una app
1. Login con usuario que tiene 1 aplicación
2. Seleccionar organización en Launcher
3. Verificar que NO muestra `/select-instance`
4. Verificar redirección directa a la app

### Escenario 3: Login sin apps
1. Login con usuario sin aplicaciones
2. Seleccionar organización en Launcher
3. Verificar que muestra mensaje de "sin apps"

## 🔄 Sincronización con Backend

El backend debe:
1. ✅ Incluir `instances[]` en `TenantOptionDto`
2. ✅ Consultar instancias activas por tenant
3. ✅ Filtrar solo instancias con estado "active" o "running"
4. ✅ Generar URLs de acceso para cada instancia

## 📦 Estado del Proyecto

**Frontend:** ✅ Completado
- AuthContext actualizado
- SelectInstance page creada
- Rutas configuradas
- UI/UX implementado

**Backend:** ⚠️ Pendiente
- Agregar campo `instances[]` a TenantOptionDto
- Endpoint para consultar instancias por tenant
- Lógica de provisioning de instancias

---

**Fecha de Implementación:** 2026-01-25  
**Versión:** 1.0.0
