# Pruebas de Navegación - Farutech Dashboard

## Descripción
Este documento describe las pruebas para validar el sistema de navegación unificada entre el dashboard del orquestrador y las aplicaciones tenant.

## Problemas Resueltos
- ✅ **Navegación incorrecta a `/app/{id}`**: Ahora navega directamente a URLs de aplicaciones tenant
- ✅ **`/select-instance` no navega**: Ahora usa navegación externa correcta
- ✅ **Sesión transferida por POST**: Datos de sesión no visibles en URL
- ✅ **Debug en desarrollo**: Panel visual para monitorear navegaciones

## Secuencia de Testing

### 1. Configuración Inicial
```bash
# Verificar que todo esté en orden
npm run test:navigation

# Iniciar servidor de desarrollo
npm run dev

# Abrir navegador
# http://localhost:62310
```

### 2. Flujo de Pruebas

#### Paso 1: Login
- Iniciar sesión en el dashboard
- Verificar que se redirige a `/home`

#### Paso 2: Navegación a Instancia Individual
- Expandir organización "Farutech SAS"
- **Click en primera aplicación** (ej: "POS Principal")
- **Resultado esperado**:
  - Nueva pestaña/ventana con URL tipo: `http://localhost:3000/?instance=4f5c3fd5&org=faru4ac2`
  - Sesión transferida por POST (no visible en URL)
  - Logs en consola: `🚀 Iniciando navegación`, `✅ URL construida`, `📤 Redirigiendo`

#### Paso 3: Navegación a Selector de Instancias
- **Click en "Ver X aplicaciones restantes"**
- **Resultado esperado**:
  - Navegación interna a `/select-instance`
  - Lista de aplicaciones disponibles

#### Paso 4: Selección desde Selector
- En `/select-instance`, **click en cualquier aplicación**
- **Resultado esperado**:
  - Nueva pestaña con URL de aplicación tenant
  - Sesión transferida correctamente

### 3. Debug y Monitoreo

#### Panel de Debug (Solo en desarrollo)
- Panel flotante en esquina inferior derecha
- Muestra logs de navegación en tiempo real
- Botones para copiar logs y limpiar

#### Logs de Consola
```
🖱️ Click en instancia: { tenantId, instanceId, orgCode, instanceCode }
🔍 Datos resueltos: { resolvedOrgCode, resolvedInstanceCode }
🚀 Llamando a navigateToInstance...
🚀 Iniciando navegación a instancia: { tenantId, instanceId, orgCode, instanceCode }
✅ URL construida: http://localhost:3000/...
📤 Redirigiendo a aplicación tenant: http://localhost:3000/...
```

#### LocalStorage Debug
- `nav_debug`: Últimos 10 logs de navegación
- `farutech_last_*`: Últimos valores de navegación

## Variables de Entorno

### Desarrollo
```env
VITE_APP_DOMAIN=localhost:62310
VITE_USE_SUBDOMAIN=false
VITE_TENANT_APP_PORT=3000
VITE_DASHBOARD_URL=http://localhost:62310
VITE_API_URL=http://localhost:3000/api
VITE_SESSION_SECRET=dev_secret_key_123
```

### Producción
```env
VITE_APP_DOMAIN=farutech.io
VITE_USE_SUBDOMAIN=true
VITE_DASHBOARD_URL=https://dashboard.farutech.io
VITE_API_URL=https://api.farutech.io
VITE_SESSION_SECRET=prod_secret_key_change_this
```

## Comandos Útiles

```bash
# Verificar build
npm run build

# Desarrollo con debug
npm run dev:debug

# Ejecutar pruebas de navegación
npm run test:navigation

# Verificar TypeScript
npx tsc --noEmit

# Preview de build
npm run preview
```

## Validación Final

✅ **Click en app individual** → URL de app tenant
✅ **Click en "Ver X apps"** → `/select-instance`
✅ **Click en app desde select-instance** → URL de app tenant
✅ **Sesión transferida por POST** (no visible en URL)
✅ **Debug en desarrollo** para monitorear
✅ **Build limpio** sin warnings

## Troubleshooting

### Error: "URL externa detectada, no navegar internamente"
- ✅ Correcto: Significa que detectó URL externa y no navegó internamente

### Error: "No se pudo obtener código de instancia"
- ❌ Problema: Verificar que `OrganizationCard` pase `orgCode` e `instanceCode`

### Error: Build falla
- Verificar imports y tipos TypeScript
- Ejecutar `npm run lint` para errores de linting

### Aplicación tenant no recibe sesión
- Verificar que `SessionReceiver` esté configurado en app tenant
- Revisar `VITE_SESSION_SECRET` en ambas apps

---

## Playwright E2E Tests (Legacy)

Quick start:

1. Install deps (project root / frontend):

```bash
pnpm install
```

2. Start the dashboard dev server (Vite):

```bash
pnpm --filter frontend dev
```

3. Run Playwright tests from repo root:

```bash
npx playwright test --config=src/01.Core/Farutech/Frontend/Dashboard/playwright.config.ts
```

Notes:
- The test env file `src/01.Core/Farutech\Frontend\Dashboard/.env.playwright` sets `VITE_` variables used by the app and a `VITE_ASPIRE_API_URL` for Aspire local services.
- `SessionBridgeProvider` is mounted in the app tree (see `App.tsx`) so session generation/validation endpoints should be reachable by the dev server (CORS/proxy may be required).
