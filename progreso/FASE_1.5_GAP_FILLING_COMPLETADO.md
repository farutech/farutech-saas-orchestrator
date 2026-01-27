# 🚀 FASE 1.5 - GAP FILLING: RBAC Y CATÁLOGO POS

## ✅ Resumen de Implementación

Se ha completado la **actualización del Farutech Orchestrator Core** para soportar la App01: Farutech POS con las siguientes implementaciones:

---

## 📦 1. ENTIDADES RBAC (Domain Layer)

### Archivos Creados:
- ✅ `Farutech.Orchestrator.Domain\Entities\Identity\Permission.cs`
- ✅ `Farutech.Orchestrator.Domain\Entities\Identity\Role.cs`
- ✅ `Farutech.Orchestrator.Domain\Entities\Identity\RolePermission.cs`
- ✅ `Farutech.Orchestrator.Domain\Entities\Identity\UserRole.cs`

### Características:
- **Permission**: Permisos granulares con código jerárquico (`module.resource.action`)
- **Role**: Roles con niveles jerárquicos y scope (Global/Tenant/Warehouse)
- **RolePermission**: Relación Many-to-Many con auditoría (GrantedBy, GrantedAt)
- **UserRole**: Asignación de roles a usuarios con contexto de tenant y scope adicional

---

## 🗄️ 2. CONFIGURACIÓN DE BASE DE DATOS (Infrastructure Layer)

### DbContext Actualizado:
- ✅ Agregados DbSets: `Roles`, `Permissions`, `RolePermissions`, `UserRoles`
- ✅ Schema: `identity` (separado de AspNetIdentity)

### Configuraciones EF Core:
- ✅ `PermissionConfiguration.cs` - Índices únicos en Code, filtros de soft delete
- ✅ `RoleConfiguration.cs` - Índices en Code y Level
- ✅ `RolePermissionConfiguration.cs` - Composite key, relaciones cascade
- ✅ `UserRoleConfiguration.cs` - Composite key multi-columna (UserId, RoleId, TenantId, ScopeId)

### Comandos de Migración:

```powershell
# Navegar al proyecto API
cd D:\farutech_2025\src\backend-core\Farutech.Orchestrator.API

# Crear migración
dotnet ef migrations add AddRbacSecurity --project ..\Farutech.Orchestrator.Infrastructure

# Aplicar migración
dotnet ef database update --project ..\Farutech.Orchestrator.Infrastructure

# Verificar tablas creadas
# Deberían existir: identity.permissions, identity.roles, identity.role_permissions, identity.user_roles
```

---

## 🔐 3. SERVICIO DE PERMISOS (Application Layer)

### Interface:
- ✅ `IPermissionService` con 12 métodos

### Implementación:
- ✅ `PermissionService.cs` con caché en memoria (15 minutos)
- ✅ Métodos principales:
  - `HasPermissionAsync()` - Verificación con scope
  - `GetUserPermissionsAsync()` - Obtener permisos del usuario
  - `AssignRoleToUserAsync()` - Asignación de roles
  - `HasRoleAsync()` - Verificación de rol

### Registro en DI:
```csharp
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IPermissionService, PermissionService>();
```

---

## 🌱 4. SEED DATA (Catálogo POS)

### Archivo Creado:
- ✅ `Farutech.Orchestrator.Infrastructure\Seeding\DbSeeder.cs`

### Contenido Seeded:

#### **27 Permisos** agrupados en:
- Datos Maestros (6 permisos)
- Control de Caja (5 permisos) 🔴 CRÍTICO
- Ventas (4 permisos)
- Servicios (2 permisos)
- Inventario (3 permisos)
- Reportes (2 permisos)
- Administración (5 permisos)

#### **5 Roles** predefinidos:
1. **SuperAdmin** (Level 1) - Todos los permisos
2. **Manager** (Level 2) - Gestión completa sin admin
3. **Cashier** (Level 3) - Caja + Ventas + Inventario
4. **Salesperson** (Level 4) - Solo ventas y servicios
5. **Auditor** (Level 5) - Solo lectura y reportes

#### **Producto POS** con 5 módulos:
1. **master_data** - 3 features (items, warehouses, customers)
2. **cash_control** - 3 features (blind_count, withdrawals, multi_cashier) 💰
3. **sales_services** - 3 features (pos_sales, service_orders, discounts)
4. **inventory** - 3 features (stock_control, batch_tracking, transfers)
5. **reports** - 2 features (basic_reports, advanced_analytics)

**Total:** 14 features (8 Standard + 6 Premium)

### Ejecutar Seed:
```csharp
// En Program.cs o mediante comando CLI
using var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
await Farutech.Orchestrator.Infrastructure.Seeding.DbSeeder.SeedAsync(context);
```

---

## 🌐 5. API ENDPOINT: FEATURES CONTROLLER

### Archivo Creado:
- ✅ `Farutech.Orchestrator.API\Controllers\FeaturesController.cs`

### Endpoints:

#### **POST /api/features/evaluate**
Evalúa si una feature está habilitada para el usuario/tenant actual.

**Request:**
```json
{
  "featureCode": "blind_cash_count",
  "requiredPermission": "cash_control.blind_count",
  "scopeId": "019bf19f-3be5-78e8-a2b4-4d1199eb3ab4",
  "contextData": {
    "warehouseId": "xyz",
    "sessionId": "abc"
  }
}
```

**Response:**
```json
{
  "featureCode": "blind_cash_count",
  "isEnabled": true,
  "hasSubscription": true,
  "hasPermission": true,
  "featureMetadata": {
    "name": "Arqueo Ciego",
    "description": "Cierre de caja sin ver saldo esperado",
    "moduleName": "Control de Caja",
    "productName": "Farutech POS & Services",
    "isPremium": true,
    "additionalCost": 29.99
  },
  "evaluatedAt": "2026-01-25T12:34:56Z"
}
```

**Lógica de Evaluación:**
1. ✅ Feature existe y está activa
2. ✅ Tenant tiene suscripción que incluye la feature
3. ✅ Usuario tiene el permiso RBAC requerido (si aplica)
4. ✅ Usuario tiene acceso al scope (bodega/sucursal) si se especifica

#### **GET /api/features/available**
Lista todas las features disponibles para el tenant actual.

#### **GET /api/features/my-permissions**
Lista todos los permisos del usuario actual en el tenant.

---

## 🔧 6. COMANDOS DE IMPLEMENTACIÓN

### 1. Aplicar Migración
```powershell
cd D:\farutech_2025\src\backend-core\Farutech.Orchestrator.API
dotnet ef migrations add AddRbacSecurity --project ..\Farutech.Orchestrator.Infrastructure
dotnet ef database update
```

### 2. Ejecutar Seed (Opción A - Agregar en Program.cs)
```csharp
// Después de app.Run(), agregar:
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<OrchestratorDbContext>();
    await Farutech.Orchestrator.Infrastructure.Seeding.DbSeeder.SeedAsync(context);
}
```

### 3. Ejecutar Seed (Opción B - Comando CLI)
```powershell
# Crear archivo temporal: SeedCommand.cs
dotnet run --seed
```

### 4. Verificar Tablas
```sql
-- Conectar a PostgreSQL
psql -h localhost -U farutec_admin -d farutec_db

-- Verificar tablas
\dt identity.*

-- Contar registros
SELECT COUNT(*) FROM identity.permissions;  -- 27
SELECT COUNT(*) FROM identity.roles;        -- 5
SELECT COUNT(*) FROM catalog.products WHERE code = 'farutech_pos'; -- 1
SELECT COUNT(*) FROM catalog.modules WHERE product_id = (SELECT id FROM catalog.products WHERE code = 'farutech_pos'); -- 5
SELECT COUNT(*) FROM catalog.features WHERE module_id IN (SELECT id FROM catalog.modules WHERE product_id = (SELECT id FROM catalog.products WHERE code = 'farutech_pos')); -- 14
```

---

## 🧪 7. PRUEBAS DE INTEGRACIÓN

### Caso de Uso: App01 Valida Feature "Arqueo Ciego"

```csharp
// En App01 Startup/Middleware
public async Task<bool> CanUseBlindCashCount()
{
    var request = new FeatureEvaluationRequest
    {
        FeatureCode = "blind_cash_count",
        RequiredPermission = "cash_control.blind_count",
        ScopeId = currentWarehouseId
    };

    var response = await _orchestratorClient.PostAsJsonAsync(
        "/api/features/evaluate", 
        request
    );

    var result = await response.Content.ReadFromJsonAsync<FeatureEvaluationResponse>();
    return result?.IsEnabled ?? false;
}
```

### Prueba Manual con Swagger:
1. Iniciar API: `dotnet run --project Farutech.Orchestrator.API`
2. Abrir: `http://localhost:5098/swagger`
3. Autenticarse (POST /api/Auth/login)
4. Copiar token y usar "Authorize" button
5. Probar POST /api/features/evaluate

---

## 📊 8. ESTRUCTURA DE DATOS FINAL

### Tablas Creadas:
```
identity.permissions       (27 registros)
identity.roles             (5 registros)
identity.role_permissions  (~150 registros - calculado por asignaciones)
identity.user_roles        (0 registros - se llenan al asignar roles a usuarios)

catalog.products           (+1 nuevo: farutech_pos)
catalog.modules            (+5 nuevos)
catalog.features           (+14 nuevas)
```

### Relaciones:
```
Permission 1---* RolePermission *---1 Role
Role 1---* UserRole *---1 ApplicationUser
TenantInstance 1---* Subscription *---* Feature
```

---

## 🎯 9. PRÓXIMOS PASOS

### Para Iniciar App01:
1. ✅ SDK Client ya puede consumir `/api/features/evaluate`
2. ✅ Implementar Feature Flags en App01 usando el endpoint
3. ✅ Crear Middleware en App01 que valide permisos antes de ejecutar operaciones
4. ✅ Implementar UI de gestión de roles/permisos (opcional)

### Ejemplo de Uso en App01:
```csharp
// App01: Services/FeatureService.cs
public class FeatureService
{
    private readonly HttpClient _orchestratorClient;

    public async Task<bool> IsFeatureEnabledAsync(string featureCode, string? permission = null)
    {
        var request = new FeatureEvaluationRequest
        {
            FeatureCode = featureCode,
            RequiredPermission = permission
        };

        var response = await _orchestratorClient.PostAsJsonAsync(
            "/api/features/evaluate",
            request
        );

        if (!response.IsSuccessStatusCode)
            return false;

        var result = await response.Content.ReadFromJsonAsync<FeatureEvaluationResponse>();
        return result?.IsEnabled ?? false;
    }
}

// App01: Controllers/CashRegisterController.cs
[HttpPost("open")]
public async Task<IActionResult> OpenCashRegister()
{
    // Validar feature y permiso antes de proceder
    var canOpen = await _featureService.IsFeatureEnabledAsync(
        "blind_cash_count",
        "cash_control.register.open"
    );

    if (!canOpen)
        return Forbid("No tienes permiso o la feature no está habilitada");

    // Lógica de apertura de caja...
    return Ok();
}
```

---

## ✅ CHECKLIST FINAL

- [x] Entidades RBAC creadas (4 archivos)
- [x] Configuraciones EF Core (4 archivos)
- [x] DbContext actualizado
- [x] IPermissionService definido
- [x] PermissionService implementado con caché
- [x] DbSeeder con 27 permisos + 5 roles + producto POS
- [x] FeaturesController con 3 endpoints
- [x] Servicio registrado en DI (Program.cs)
- [ ] Migración aplicada (ejecutar comando)
- [ ] Seed ejecutado (ejecutar comando)
- [ ] Pruebas en Swagger (manual)

---

## 📚 Documentación Adicional

### Arquitectura de Seguridad:
```
User --> UserRole --> Role --> RolePermission --> Permission
   |                    |
   +--> TenantId        +--> Scope (Global/Tenant/Warehouse)
   +--> ScopeId (opcional: warehouseId)
```

### Flujo de Evaluación:
```
App01 --> POST /api/features/evaluate
  |
  +--> 1. Validar JWT (user + tenant)
  +--> 2. Buscar Feature en catálogo
  +--> 3. Verificar suscripción activa
  +--> 4. Verificar permiso RBAC (si aplica)
  +--> 5. Verificar scope (si aplica)
  |
  <-- Response: { isEnabled: true/false, metadata: {...} }
```

---

**🎉 CORE ACTUALIZADO Y LISTO PARA APP01 POS**

Ahora puedes proceder con la construcción de la App01 usando este Core como base sólida.
