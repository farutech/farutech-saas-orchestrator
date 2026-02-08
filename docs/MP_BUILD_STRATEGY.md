# ⚠️ MP Build Strategy - Dynamic Runtime Loading

## Problem
Los MPs están ubicados fuera del contexto de build de Dashboard (`src/02.Apps/Ordeon/MP`), lo que causa que Vite intente incluirlos en el bundle principal durante `build`, provocando errores de resolución de dependencias.

## Solution: Runtime Dynamic Loading

### Estrategia Implementada

**Dashboard compila SOLO su código core**, sin incluir MPs:
- ✅ AppShell, Sidebar, MenuBuilder, stores, etc.
- ✅ Home page, Auth pages
- ❌ NO incluye MPs en build

**MPs se cargan en RUNTIME** cuando el usuario navega a ellos:
- En **development**: Vite sirve MPs con HMR
- En **production**: MPs se compilan por separado y se sirven como módulos independientes

### Implementation Steps

#### 1. Excluir MPs del Build Principal

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      // Excluir MPs del bundle principal
      external: (id) => {
        return id.includes('/Ordeon/MP/');
      },
    },
  },
});
```

#### 2. Compilar MPs Por Separado

Cada MP tiene su propio build:

```bash
# En producción
cd src/02.Apps/Ordeon/MP/customers
npm run build  # Genera dist/
```

#### 3. Servir MPs en Runtime

Dashboard carga MPs dinámicamente desde:
- **Dev:** `http://localhost:5173/src/02.Apps/Ordeon/MP/customers`
- **Prod:** `/mps/customers/index.js`

### Directory Structure

```
src/02.Apps/
├── Frontend/Dashboard/           # Compila su propio bundle
│   ├── dist/                     # Dashboard bundle
│   └── vite.config.ts            # Excluye MPs
├── Ordeon/MP/                    # MPs independientes
│   ├── customers/
│   │   ├── dist/                 # MP bundle
│   │   ├── vite.config.ts        # Build config de MP
│   │   └── package.json
│   └── products/
```

### Alternative: Move MPs Inside Dashboard

Otra opción es mover MPs dentro de Dashboard:

```
src/02.Apps/Frontend/Dashboard/
├── src/
│   ├── core/                     # Dashboard core
│   ├── mps/                      # MPs aquí
│   │   ├── customers/
│   │   └── products/
│   └── App.tsx
```

Esto permite:
- ✅ Único build process
- ✅ Compartir node_modules
- ✅ TypeScript paths funcionan directamente
- ❌ Menos separación arquitectural

## Recommended Approach

Para esta fase inicial, **mover MPs dentro de Dashboard** es más simple:

```bash
mkdir src/02.Apps/Frontend/Dashboard/src/mps
mv src/02.Apps/Ordeon/MP/customers src/02.Apps/Frontend/Dashboard/src/mps/
```

Luego actualizar imports:

```typescript
// MpLoader.tsx
const MP_REGISTRY = {
  customers: () => import('../mps/customers'),
};
```

Esta estructura permite:
- Compilar todo junto en desarrollo
- Code splitting automático en producción
- Mantener la arquitectura de MPs
