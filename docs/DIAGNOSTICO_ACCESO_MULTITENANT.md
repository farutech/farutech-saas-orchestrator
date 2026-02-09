# **Diagnóstico Técnico Completo - Acceso Multi-Tenant**

**Proyecto:** Farutech SaaS Orchestrator  
**Fecha:** 2026-02-08  
**Analista:** Arquitecto Senior especializado en SaaS Multi-Tenant

---

## **1. DIAGNÓSTICO DEL CÓDIGO REAL**

### **DECISIÓN ARQUITECTÓNICA IMPLEMENTADA**

**URL Final:** `https://{appCode}.{orgCode}.app.farutech.com`

**Ejemplo:** `https://8b571b69.FARU6128.app.farutech.com`

**TenantCode Simplificado:** `{orgCode}-{appCode}` (SIN tipo de despliegue)

**Razón:** El campo `DeploymentType` ya existe en la BD y hace redundante incluirlo en el código. Esto permite:
- URLs más limpias
- Facilita cambios futuros (Shared → Dedicated)
- Mejor experiencia de usuario

---

### **1.1 Estructura de Datos Confirmada**

#### **Customer (Organización)**
```csharp
public class Customer : BaseEntity
{
    public required string Code { get; set; }           // Ej: "FARU6128"
    public required string CompanyName { get; set; }
    public required string TaxId { get; set; }
    public required string Email { get; set; }
    public bool IsActive { get; set; } = true;
}
```

**Hallazgos:**
- ✅ `Code` es único por organización
- ✅ Se almacena en tabla `Customers`
- ❌ **NO contiene el formato completo** del tenant code

---

#### **TenantInstance (Aplicación)**
```csharp
public class TenantInstance : BaseEntity
{
    public Guid CustomerId { get; set; }
    public required string TenantCode { get; set; }  // Ej: "FARU6128-Shared-8b571b69"
    public string? Code { get; set; }                 // Ej: "8b571b69" (corto)
    public required string Name { get; set; }
    public string DeploymentType { get; set; } = "Shared"; // "Shared" o "Dedicated"
    public string ApplicationType { get; set; } = "Generic";
    public string Status { get; set; } = "provisioning";
    public string? ApiBaseUrl { get; set; }
}
```

**Hallazgos Críticos:**
- ✅ `TenantCode` SÍ contiene el formato completo: `{OrgCode}-{Type}-{AppCode}`
- ✅ `Code` es el identificador corto de la aplicación (ej: `8b571b69`)
- ✅ `DeploymentType` define si es "Shared" o "Dedicated"
- ✅ Relación: `TenantInstance` → `Customer` (FK)

---

### **1.2 Servicio de Resolución Existente**

#### **ResolveService** (✅ Ya Implementado)
```csharp
public async Task<ResolveResponseDto?> ResolveInstanceAsync(string instanceCode, string organizationCode)
{
    var instance = await _context.TenantInstances
        .Include(t => t.Customer)
        .FirstOrDefaultAsync(t =>
            t.Code == instanceCode &&
            t.Customer.Code == organizationCode &&
            t.Status == "active");

    if (instance == null) return null;

    return new ResolveResponseDto(
        instance.Id,
        instance.Name,
        instance.Customer.Id,
        instance.Customer.CompanyName,
        instance.ApiBaseUrl ?? "/dashboard",
        instance.Status,
        true
    );
}
```

**Análisis:**
- ✅ **YA EXISTE** lógica de resolución por subdominios
- ✅ Busca por `instanceCode` + `organizationCode`
- ✅ Valida que la instancia esté `active`
- ✅ Retorna `ApiBaseUrl` para redireccionamiento
- ⚠️ Requiere pasar ambos códigos por separado

---

#### **ResolveController** (✅ Ya Implementado)
```csharp
[HttpGet("{instance}/{organization}")]
public async Task<ActionResult<ResolveResponseDto>> ResolveInstance(
    string instance, 
    string organization)
{
    var result = await _resolveService.ResolveInstanceAsync(instance, organization);
    if (result == null)
        return NotFound(new { message = "Instancia no encontrada" });
    
    return Ok(result);
}
```

**Endpoint:**
```
GET /api/resolve/{instance}/{organization}
```

**Ejemplo:**
```
GET /api/resolve/8b571b69/FARU6128
```

**Respuesta:**
```json
{
  "instanceId": "guid",
  "instanceName": "Clínica Veterinaria Norte",
  "organizationId": "guid",
  "organizationName": "Farmacias Unidas",
  "applicationUrl": "https://8b571b69.faru6128.app.farutech.com",
  "status": "active",
  "requiresAuthentication": true
}
```

---

### **1.3 Generación de URLs (Provisioning)**

#### **ProvisioningService.GenerateApiBaseUrl**
```csharp
private string GenerateApiBaseUrl(string tenantCode, string? productCode)
{
    var useLocalUrls = bool.TryParse(_configuration["Provisioning:UseLocalUrls"], out var localUrls) && localUrls;
    var productionDomain = _configuration["Provisioning:ProductionDomain"] ?? "farutech.app";
    var basePort = int.TryParse(_configuration["Provisioning:LocalhostBasePort"], out var port) ? port : 5100;

    if (useLocalUrls)
    {
        return $"http://localhost:{targetPort}";
    }
    else
    {
        // Production mode: Use subdomain pattern
        return $"https://{tenantCode}.{productionDomain}";
    }
}
```

**Hallazgo CRÍTICO:**
- ⚠️ La URL se genera con `tenantCode` COMPLETO
- ⚠️ Formato generado: `https://FARU6128-Shared-8b571b69.farutech.app`
- ❌ **NO coincide** con el formato esperado por el usuario: `https://8b571b69.FARU6128.app.domain`

---

### **1.4 Flujo de Autenticación (AuthService)**

#### **GetAvailableTenantsForUserAsync**
```csharp
private async Task<List<TenantOptionDto>> GetAvailableTenantsForUserAsync(Guid userId)
{
    var memberships = await _authRepository.GetUserMembershipsAsync(userId);
    var activeMemberships = new List<TenantOptionDto>();

    foreach (var membership in memberships.Where(m => m.IsActive))
    {
        var customer = await _authRepository.GetCustomerByIdAsync(membership.CustomerId);
        if (customer != null && customer.IsActive)
        {
            var instances = await _authRepository.GetTenantInstancesAsync(customer.Id);
            var instanceDtos = instances.Select(i => new InstanceDto(
                i.Id,
                i.Name,
                i.ApplicationType,
                i.TenantCode,  // AQUÍ: Se retorna TenantCode completo
                i.Status,
                i.ApiBaseUrl ?? ""
            )).ToList();

            activeMemberships.Add(new TenantOptionDto(
                customer.Id,
                customer.CompanyName,
                customer.Code,  // Código de organización
                customer.TaxId,
                membership.Role.ToString(),
                membership.Role == FarutechRole.Owner,
                customer.IsActive,
                instanceDtos
            ));
        }
    }

    return activeMemberships;
}
```

**DTO Retornado:**
```csharp
public record TenantOptionDto(
    Guid TenantId,           // ID de la organización
    string CompanyName,      // Nombre de la empresa
    string CompanyCode,      // FARU6128
    string TaxId,
    string Role,
    bool IsOwner,
    bool IsActive,
    List<InstanceDto> Instances  // Lista de instancias
);

public record InstanceDto(
    Guid InstanceId,
    string Name,
    string Type,
    string Code,   // TenantCode completo: "FARU6128-Shared-8b571b69"
    string Status,
    string Url
);
```

**Hallazgos:**
- ✅ El frontend **SÍ recibe** el `TenantCode` completo en `InstanceDto.Code`
- ✅ También recibe `CompanyCode` (código de organización)
- ✅ El URL está en `InstanceDto.Url` (puede ser nulo)

---

## **2. ANÁLISIS DE LA URL REAL**

### **2.1 Estructura Declarada por el Usuario**
```
https://{tenantCode_application}.{tenantCode_organization}.app.domain
```

**Ejemplo:**
```
https://8b571b69.FARU6128.app.farutech.com
```

**Parsing:**
- `8b571b69` → `tenantCode_application` (código corto de instancia)
- `FARU6128` → `tenantCode_organization` (código de organización)
- `app.farutech.com` → dominio base

---

### **2.2 Tenant Code Completo**
```
{tenantCode_organization}-{Shared|Dedicated}-{tenantCode_application}
```

**Ejemplo:**
```
FARU6128-Shared-8b571b69
```

**Componentes:**
- `FARU6128` → Organización (Customer.Code)
- `Shared` → Tipo de despliegue (TenantInstance.DeploymentType)
- `8b571b69` → Instancia (TenantInstance.Code)

---

### **2.3 Discrepancia Detectada**

| **Concepto** | **URL Real Usuario** | **Código Backend** | **¿Coincide?** |
|--------------|---------------------|-------------------|----------------|
| Formato URL | `8b571b69.FARU6128.app.domain` | `FARU6128-Shared-8b571b69.farutech.app` | ❌ NO |
| Separadores | Subdominio (`.`) | Guiones (`-`) | ❌ NO |
| Orden | app-org | org-type-app | ❌ NO |

**Conclusión:**
- ⚠️ **El código backend NO genera las URLs en el formato esperado**
- ⚠️ **El endpoint de resolución espera códigos separados, no extrae desde subdominios**

---

## **3. FLUJO ACTUAL DEL ORCHESTRATOR**

### **3.1 Flujo Implementado (POST)**

**Código Frontend Orchestrator:**
- Ubicación: `src/01.Core/Farutech/Frontend/Dashboard`
- Servicio: `useInstanceNavigation.ts` + `navigationService.ts`

**Secuencia:**
1. Usuario selecciona instancia
2. Se invoca `navigateToInstance(tenantId, instanceId, orgCode, instanceCode)`
3. Se construye URL con `InstanceUrlBuilder.buildUrl(instanceCode, orgCode)`
4. Se prepara `sessionData` con token
5. Se ejecuta POST con form data a la URL construida

**POST Data:**
```javascript
{
  farutech_session: base64(JSON.stringify({
    userId, userEmail, userName, token, timestamp, sessionId
  })),
  ts: timestamp,
  sig: signature
}
```

**Hallazgos:**
- ✅ Ya existe lógica de transferencia de sesión
- ✅ Los datos se firman para validación
- ⚠️ La URL construida NO coincide con el formato esperado

---

## **4. PROBLEMAS IDENTIFICADOS**

### **4.1 Problema Principal: Formato de URL**

**Esperado:**
```
https://8b571b69.FARU6128.app.farutech.com
```

**Generado Actualmente:**
```
https://FARU6128-Shared-8b571b69.farutech.app
```

**Impacto:**
- ❌ Las URLs no son navegables por subdominios convencionales
- ❌ El endpoint de resolución no puede extraer desde la URL
- ❌ Requiere reconfigurar DNS/Load Balancer

---

### **4.2 Problema Secundario: Resolución de Tenant**

El endpoint de resolución espera:
```
GET /api/resolve/{instance}/{organization}
```

Pero la URL real es:
```
https://8b571b69.FARU6128.app.farutech.com
```

**Gap:**
- ❌ No hay lógica en el frontend para extraer subdominios
- ❌ No hay endpoint que acepte `hostname` y resuelva automáticamente

---

### **4.3 Problema Terciario: Validación de Acceso en Login**

**Situación:**
- El login actual NO valida tenant específico
- Retorna `IntermediateToken` + lista de tenants
- Requiere `SelectContext` para establecer el tenant

**Gap para Acceso Directo:**
- ❌ No hay forma de validar acceso a un tenant específico durante el login
- ❌ El frontend no puede pasar `tenantCode` en el login request

---

## **5. SOLUCIÓN PROPUESTA (Basada en Código Real)**

### **5.1 Decisión Arquitectónica**

**Opción A: Ajustar URLs al Formato Backend** (✅ Recomendado)
- Usar: `https://FARU6128-Shared-8b571b69.app.farutech.com`
- Beneficio: Código backend funciona SIN cambios
- Costo: DNS debe soportar guiones en subdominios (standard)

**Opción B: Rediseñar Generación de URLs** (❌ Mayor impacto)
- Cambiar: `ProvisioningService.GenerateApiBaseUrl`
- Cambiar: Resolución para extraer de URL con formato `app.org`
- Costo: Cambios en múltiples servicios

**Decisión: Opción A**

---

### **5.2 Cambios Requeridos (Mínimos)**

#### **Backend: Nuevo Endpoint de Resolución**

**Agregar en `ResolveController.cs`:**
```csharp
[HttpGet("by-hostname")]
[ProducesResponseType(typeof(ResolveResponseDto), StatusCodes.Status200OK)]
public async Task<IActionResult> ResolveByHostname([FromQuery] string hostname)
{
    // Extraer tenant code del hostname
    // Formato: FARU6128-Shared-8b571b69.app.farutech.com
    var parts = hostname.Split('.');
    if (parts.Length < 3) return NotFound();
    
    var tenantCode = parts[0]; // "FARU6128-Shared-8b571b69"
    
    var result = await _resolveService.ResolveByTenantCodeAsync(tenantCode);
    if (result == null)
        return NotFound(new { message = "Instancia no encontrada" });
    
    return Ok(result);
}
```

**Agregar en `ResolveService.cs`:**
```csharp
public async Task<ResolveResponseDto?> ResolveByTenantCodeAsync(string tenantCode)
{
    var instance = await _context.TenantInstances
        .Include(t => t.Customer)
        .FirstOrDefaultAsync(t =>
            t.TenantCode == tenantCode &&
            t.Status == "active");

    if (instance == null) return null;

    return new ResolveResponseDto(
        instance.Id,
        instance.Name,
        instance.Customer.Id,
        instance.Customer.CompanyName,
        instance.ApiBaseUrl ?? "/dashboard",
        instance.Status,
        true
    );
}
```

---

#### **Backend: Modificar LoginRequest**

**Actualizar `LoginRequest.cs`:**
```csharp
public record LoginRequest(
    string Email,
    string Password,
    bool RememberMe = false,
    string? TenantCode = null  // NUEVO
);
```

**Actualizar `AuthService.LoginAsync`:**
```csharp
public async Task<SecureLoginResponse?> LoginAsync(
    string email, 
    string password, 
    bool rememberMe = false,
    string? tenantCode = null)
{
    // ... validación de usuario existente ...
    
    var activeMemberships = await GetAvailableTenantsForUserAsync(user.Id);
    
    // NUEVO: Si tenantCode viene, validar acceso específico
    if (!string.IsNullOrEmpty(tenantCode))
    {
        var targetTenant = activeMemberships
            .SelectMany(t => t.Instances)
            .FirstOrDefault(i => i.Code == tenantCode);
        
        if (targetTenant == null)
        {
            return null; // Sin acceso
        }
        
        var orgTenant = activeMemberships
            .First(t => t.Instances.Any(i => i.Code == tenantCode));
        
        var accessToken = _tokenService.GenerateAccessToken(
            user,
            orgTenant.TenantId,
            orgTenant.CompanyName,
            orgTenant.Role
        );
        
        return new SecureLoginResponse(
            RequiresContextSelection: false,
            IntermediateToken: null,
            AccessToken: accessToken,
            TokenType: "Bearer",
            ExpiresIn: 3600,
            AvailableTenants: null,
            SelectedTenantId: orgTenant.TenantId,
            CompanyName: orgTenant.CompanyName,
            Role: orgTenant.Role
        );
    }
    
    // ... flujo multi-tenant existente ...
}
```

---

#### **Frontend Dashboard: Resolución de Tenant**

**Agregar en `src/02.Apps/Frontend/Dashboard/src/utils/tenantResolver.ts`:**
```typescript
export const resolveTenantFromHostname = (): string | null => {
  const hostname = window.location.hostname;
  
  // Formato: FARU6128-Shared-8b571b69.app.farutech.com
  const parts = hostname.split('.');
  if (parts.length < 3) return null;
  
  const tenantCode = parts[0]; // "FARU6128-Shared-8b571b69"
  
  // Validar formato básico (tiene al menos 2 guiones)
  const dashCount = (tenantCode.match(/-/g) || []).length;
  if (dashCount < 2) return null;
  
  return tenantCode;
};

export const callResolveApi = async (tenantCode: string) => {
  const response = await fetch(
    `/api/resolve/by-hostname?hostname=${window.location.hostname}`
  );
  
  if (!response.ok) return null;
  
  return await response.json();
};
```

---

#### **Frontend Dashboard: Modificar AuthContext**

**Actualizar `src/02.Apps/Frontend/Dashboard/src/contexts/AuthContext.tsx`:**
```typescript
const initializeAuth = async () => {
  try {
    // 1. Resolver tenant desde URL
    const tenantCode = resolveTenantFromHostname();
    setResolvedTenantCode(tenantCode);
    
    if (tenantCode) {
      // Validar tenant con backend
      const tenantInfo = await callResolveApi(tenantCode);
      if (!tenantInfo) {
        navigate('/auth/tenant-not-found');
        return;
      }
    }
    
    // 2. Check URL params (desde Orchestrator)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('access_token');
    
    if (urlToken) {
      // Establecer sesión desde params
      // ... código existente ...
    }
    
    // 3. Inicialización normal
    // ... código existente ...
  } catch (error) {
    // ...
  }
};

const login = async (credentials: LoginRequest) => {
  const request = {
    ...credentials,
    tenantCode: resolvedTenantCode
  };
  
  const response = await authService.login(request);
  // ... resto del flujo ...
};
```

---

## **6. PLAN DE IMPLEMENTACIÓN**

### **Fase 1: Backend** (Prioritario)

1. ✅ Agregar endpoint `GET /api/resolve/by-hostname`
2. ✅ Agregar método `ResolveByTenantCodeAsync` en `ResolveService`
3. ✅ Modificar `LoginRequest` para aceptar `TenantCode`
4. ✅ Modificar `AuthService.LoginAsync` para validar tenant específico
5. ✅ Agregar pruebas unitarias

**Tiempo estimado:** 4 horas

---

### **Fase 2: Frontend Dashboard** (Crítico)

1. ✅ Crear `tenantResolver.ts` con lógica de extracción
2. ✅ Modificar `AuthContext` para resolver tenant en `initializeAuth`
3. ✅ Actualizar `login` para pasar `tenantCode`
4. ✅ Agregar página de error `/auth/tenant-not-found`
5. ✅ Probar flujo completo

**Tiempo estimado:** 3 horas

---

### **Fase 3: Validación y Testing**

1. ✅ Build completo sin errores
2. ✅ Pruebas de acceso desde Orchestrator
3. ✅ Pruebas de acceso directo por URL
4. ✅ Pruebas de validación de permisos

**Tiempo estimado:** 2 horas

---

## **7. CRITERIOS DE ACEPTACIÓN**

### **Funcionales:**
1. ✅ Usuario accede desde Orchestrator → POST transfiere sesión
2. ✅ Usuario accede por URL directa → Resuelve tenant → Login
3. ✅ Login valida acceso al tenant específico
4. ✅ Acceso denegado muestra mensaje claro
5. ✅ Dashboard se adapta según tenant

### **No Funcionales:**
1. ✅ No rompe flujo existente del Orchestrator
2. ✅ Build completo sin errores
3. ✅ Resolución de tenant < 100ms
4. ✅ Logs de intentos de acceso no autorizado

---

## **8. RIESGOS Y MITIGACIONES**

| **Riesgo** | **Probabilidad** | **Impacto** | **Mitigación** |
|------------|-----------------|-------------|----------------|
| URLs con guiones no funcionan en DNS | Baja | Alto | Validar con DevOps |
| Tenant code malformado en URL | Media | Medio | Validación estricta + error claro |
| Acceso sin permisos | Baja | Alto | Validación doble (login + backend) |
| Impacto en flujo existente | Baja | Alto | Testing exhaustivo |

---

## **9. CONCLUSIONES**

### **✅ Lo que YA existe y funciona:**
- Servicio de resolución (`ResolveService`)
- Validación de membresías (`AuthService`)
- Transferencia de sesión vía POST (Orchestrator → Dashboard)
- Estructura de datos completa (Customer, TenantInstance)

### **❌ Lo que falta implementar:**
- Endpoint de resolución por hostname completo
- Lógica de extracción de tenant code desde subdominios
- Validación de tenant específico en login
- Manejo de acceso directo en frontend

### **⚠️ Lo que NO debe tocarse:**
- Estructura de BD (Customer, TenantInstance)
- Flujo multi-tenant existente (intermediate token)
- POST desde Orchestrator (ya funcional)
- Generación de URLs en provisioning

---

## **10. PRÓXIMOS PASOS RECOMENDADOS**

1. **Validar con DevOps:**
   - ¿DNS soporta `FARU6128-Shared-8b571b69.app.domain`?
   - ¿Load balancer puede rutear por subdominios?

2. **Implementar cambios backend** (Fase 1)

3. **Implementar cambios frontend** (Fase 2)

4. **Ejecutar build completo y validar**

5. **Testing en entorno de desarrollo**

---

**Fin del Diagnóstico**
