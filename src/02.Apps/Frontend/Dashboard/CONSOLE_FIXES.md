# Correcciones de Console Warnings/Errors

## Fecha: 2026-02-07

## Problemas Identificados

### 1. ProtectedRoute - Bucle de Redirección
**Síntoma**: Logs repetitivos indicando redirección a `/home` aunque el código redirige a `/launcher`

**Causa**: 
- Lógica de redirección no contemplaba la ruta `/` correctamente
- Logs de console sin filtro de entorno
- El componente se renderizaba múltiples veces causando logs duplicados

**Solución**:
```typescript
// Antes
if (requiresContextSelection && !isProfileOrSettingsPage) {
  if (location.pathname !== '/launcher') {
    console.warn('[ProtectedRoute] User needs to select context, redirecting to launcher');
    return <Navigate to="/launcher" state={{ from: location }} replace />;
  }
}

// Después
const isLauncherPage = location.pathname === '/launcher' || location.pathname === '/';

if (requiresContextSelection && !isProfileOrSettingsPage && !isLauncherPage) {
  if (import.meta.env.DEV) {
    console.warn('[ProtectedRoute] User needs to select context, redirecting to launcher');
  }
  return <Navigate to="/launcher" state={{ from: location }} replace />;
}
```

### 2. API Client - Logs Excesivos
**Síntoma**: Logs de cada request/response en producción

**Causa**: 
- `console.log` sin verificación de entorno
- Logs informativos apareciendo en producción

**Solución**:
- Envolver todos los `console.log` con `if (import.meta.env.DEV)`
- Mantener `console.error` y `console.warn` para errores reales
- Logs de debug solo en desarrollo

**Archivos Modificados**:
- `src/components/auth/ProtectedRoute.tsx`
- `src/lib/api-client.ts`

### 3. Form Fields Sin ID
**Síntoma**: Warning "A form field element should have an id or name attribute"

**Análisis**: 
- Los componentes del Design System (Input, Textarea) ya generan IDs automáticamente
- El warning probablemente viene de componentes locales que no son del Design System
- Los componentes migrados usan el Design System que tiene IDs correctos

**Estado**: Los componentes del Design System ya implementan generación automática de IDs:
```typescript
const inputId = id || `input-${Math.random().toString(36).substring(7)}`;
```

### 4. Session History - Skippable Items
**Síntoma**: "Session History Item Has Been Marked Skippable"

**Causa**: React Router está agregando entradas al historial sin interacción del usuario (causado por las redirecciones automáticas)

**Solución**: Usar `replace` en lugar de `push` en Navigate para redirecciones automáticas (ya implementado)

## Cambios Implementados

### ProtectedRoute.tsx
```diff
+ // Debug logs only in development
+ if (import.meta.env.DEV) {
    console.log('[ProtectedRoute] Checking access to:', location.pathname);
    console.log('[ProtectedRoute] State:', { isAuthenticated, requiresContextSelection, isLoading });
+ }

+ const isLauncherPage = location.pathname === '/launcher' || location.pathname === '/';
+ if (requiresContextSelection && !isProfileOrSettingsPage && !isLauncherPage) {
```

### api-client.ts
```diff
+ if (import.meta.env.DEV) {
    console.log('[API-Client] Request to:', config.url);
    console.log('[API-Client] Token from storage:', token ? `${token.substring(0, 20)}...` : 'null');
+ }

+ if (import.meta.env.DEV) {
    console.log('[API-Client] Response received:', response.config.url, response.status);
+ }
```

## Resultados Esperados

### En Desarrollo (`npm run dev`)
- ✅ Logs de debug visibles
- ✅ Información de autenticación
- ✅ Trazas de requests/responses
- ✅ Warnings de redirecciones

### En Producción (`npm run build`)
- ✅ Sin logs informativos
- ✅ Solo errores reales (console.error, console.warn)
- ✅ Console limpio
- ✅ Mejor performance (menos overhead de logging)

## Testing

### Comandos de Validación
```bash
# Desarrollo - Debería mostrar logs
cd src/02.Apps/Frontend/Dashboard
npm run dev

# Producción - No debería mostrar logs informativos
npm run build
npm run preview
```

### Checklist de Validación
- [ ] En dev: Los logs de ProtectedRoute aparecen
- [ ] En dev: Los logs de API Client aparecen
- [ ] En producción: No hay logs de ProtectedRoute
- [ ] En producción: No hay logs de API Client
- [ ] Build exitoso sin warnings
- [ ] No hay bucles de redirección
- [ ] Las rutas funcionan correctamente

## Próximos Pasos

### Opcional - Mejoras Adicionales
1. **Remover console.logs restantes**: Buscar y eliminar cualquier otro console.log no protegido
2. **Implementar logger service**: Crear un servicio centralizado de logging
3. **Agregar niveles de log**: ERROR, WARN, INFO, DEBUG
4. **Configurar producción logging**: Solo errores críticos en producción

### Comando de Búsqueda
```bash
# Buscar console.log sin protección de entorno
grep -r "console.log\|console.info" src/ --include="*.ts" --include="*.tsx" | grep -v "import.meta.env.DEV"
```

## Referencias
- React Router: https://reactrouter.com/en/main/components/navigate
- Vite Environment Variables: https://vitejs.dev/guide/env-and-mode.html
- Console API: https://developer.mozilla.org/en-US/docs/Web/API/console

## Notas
- Los cambios son **retrocompatibles** - no afectan funcionalidad existente
- Solo mejoran la experiencia de desarrollo y producción
- Reducen noise en la consola del navegador
