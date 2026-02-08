# 🏗️ PLAN DE IMPLEMENTACIÓN - FARUTECH DESIGN SYSTEM

**Versión:** 1.0.0  
**Fecha:** 7 de febrero de 2026  
**Aprobación requerida antes de implementar**

---

## 🎯 OBJETIVO

Construir un **Design System enterprise-grade** centralizado en `src/05.SDK/DesignSystem` que:

1. Unifique los 3 repositorios existentes bajo una única fuente de verdad visual
2. Elimine duplicación y deuda técnica
3. Facilite escalabilidad y mantenibilidad
4. Proporcione experiencia de desarrollo superior
5. Permita versionado y publicación como paquete reusable

---

## 📦 ENTREGABLES PRINCIPALES

| Entregable | Descripción | Consumidores |
|------------|-------------|--------------|
| **@farutech/design-system** | Paquete npm publicable | Core Dashboard, Apps Dashboard, futuros MPs |
| **Tokens System** | Variables de diseño centralizadas | Todos los consumidores |
| **Theme Engine** | Sistema de theming multi-módulo | Todos los dashboards |
| **Component Library** | 60+ componentes UI enterprise | Todos los consumidores |
| **CRUD System** | Componente DataTable + CrudManager completo | MPs, dashboards |
| **Hooks Library** | 10+ hooks reutilizables | Todos los consumidores |
| **Documentation** | Guías, ejemplos, API docs | Desarrolladores |

---

## 🗂️ ARQUITECTURA FINAL

### Estructura del Paquete

```
@farutech/design-system/
├── dist/                      # Build output
│   ├── index.js              # CJS
│   ├── index.mjs             # ESM
│   ├── index.d.ts            # TypeScript definitions
│   └── styles.css            # CSS bundle
│
├── src/
│   ├── tokens/               # Design tokens
│   ├── theme/                # Theme system
│   ├── components/           # UI components
│   ├── hooks/                # React hooks
│   ├── utils/                # Utilities
│   ├── types/                # TypeScript types
│   └── styles/               # Global styles
│
└── docs/                     # Documentation
```

### Exports Strategy

```typescript
// Main export
import { Button, Card, DataTable } from '@farutech/design-system'

// Tokens
import { colors, spacing } from '@farutech/design-system/tokens'

// Theme
import { ThemeProvider, useTheme } from '@farutech/design-system/theme'

// Hooks
import { useCrud, useDataTable } from '@farutech/design-system/hooks'

// Styles
import '@farutech/design-system/styles'
```

---

## 🔧 STACK TECNOLÓGICO

### Core Dependencies

```json
{
  "dependencies": {
    "@headlessui/react": "^2.2.9",      // Accessible UI primitives
    "@heroicons/react": "^2.2.0",       // Icon system
    "@tanstack/react-table": "^8.21.3", // Table engine
    "clsx": "^2.1.1",                   // Conditional classes
    "framer-motion": "^12.23.24",       // Animations
    "tailwind-merge": "^2.6.0",         // Merge Tailwind classes
    "zustand": "^5.0.8"                 // State management
  },
  
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### Build Tools

```json
{
  "devDependencies": {
    "@types/react": "^18.3.23",
    "@vitejs/plugin-react": "^5.0.4",
    "typescript": "^5.8.3",
    "vite": "^6.3.4",
    "vite-plugin-dts": "^4.0.0",        // Generate .d.ts files
    "vite-plugin-lib-inject-css": "^2.0.0" // Inject CSS in components
  }
}
```

---

## 📋 FASES DE IMPLEMENTACIÓN

### **FASE 1: SETUP Y FUNDAMENTOS** (2-3 días)

#### 1.1 Inicializar Proyecto
- [x] Auditoría completada
- [ ] Limpiar `src/05.SDK/DesignSystem`
- [ ] Setup package.json
- [ ] Configurar Vite para library mode
- [ ] Setup TypeScript (strict mode)
- [ ] Configurar ESLint + Prettier

#### 1.2 Sistema de Tokens
- [ ] Crear estructura de carpetas
- [ ] Migrar tokens de Golden Source
- [ ] Unificar colores (CSS vars + HSL)
- [ ] Definir tipografía
- [ ] Definir espaciado
- [ ] Definir shadows, radius, z-index

#### 1.3 Theme System
- [ ] Crear ThemeProvider
- [ ] Implementar useTheme hook
- [ ] Definir default theme
- [ ] Crear themes: medical, vet, erp, pos
- [ ] Sistema de dark mode

**Entregable:** Tokens y theming funcionando

---

### **FASE 2: COMPONENTES BASE** (1 semana)

#### 2.1 Layout Components
- [ ] AppShell (MainLayout)
- [ ] Sidebar (colapsable, multi-nivel)
- [ ] Header/Navbar
- [ ] Container/Grid

#### 2.2 Form Inputs (Básicos)
- [ ] Button (6 variants, loading)
- [ ] Input (prefix/suffix, validation)
- [ ] Select (search, multi)
- [ ] Checkbox
- [ ] Switch
- [ ] Textarea

#### 2.3 Display Components
- [ ] Card (header, footer, variants)
- [ ] Badge (colors, sizes)
- [ ] Avatar (sizes, groups)
- [ ] Tooltip

#### 2.4 Feedback Components
- [ ] Alert (4 types)
- [ ] Toast/Notification
- [ ] Modal
- [ ] Loading/Skeleton

**Entregable:** 20+ componentes base funcionando

---

### **FASE 3: COMPONENTES AVANZADOS** (1-2 semanas)

#### 3.1 Form Inputs (Avanzados)
- [ ] MaskedInput (email, phone, CPF, custom)
- [ ] PhoneInput (country selector)
- [ ] DatePicker (range, presets)
- [ ] TagInput
- [ ] ImageUpload (drag-drop, crop)
- [ ] Form wrapper (validation, layout helpers)

#### 3.2 Navigation
- [ ] Breadcrumb
- [ ] Tabs (horizontal/vertical)
- [ ] Pagination
- [ ] CommandPalette

#### 3.3 Data Display
- [ ] Table básico
- [ ] Charts wrapper (Recharts)
- [ ] StatsCard
- [ ] EmptyState

**Entregable:** 35+ componentes avanzados

---

### **FASE 4: CRUD ENTERPRISE SYSTEM** (1-2 semanas)

#### 4.1 DataTable Component

**Features críticas:**
```typescript
<DataTable
  data={items}
  columns={columns}
  
  // Search
  searchable
  searchFields={['name', 'email']}
  
  // Filters
  filters={[
    { type: 'text', field: 'name', label: 'Nombre' },
    { type: 'select', field: 'status', options: statusOptions },
    { type: 'daterange', field: 'created', label: 'Fecha' }
  ]}
  
  // Actions
  actions={{
    onView: (row) => navigate(`/view/${row.id}`),
    onEdit: (row) => openEditModal(row),
    onDelete: (row) => deleteItem(row.id),
    custom: [
      { label: 'Duplicar', icon: <DuplicateIcon />, onClick: duplicate }
    ]
  }}
  
  // Global Actions
  globalActions={[
    { label: 'Crear', variant: 'primary', onClick: create },
    { label: 'Exportar CSV', onClick: exportCSV },
    { label: 'Eliminar seleccionados', variant: 'danger', 
      onClick: deleteMany, requiresSelection: true }
  ]}
  
  // Selection
  selectable
  onSelectionChange={setSelected}
  
  // Pagination
  pagination={{
    page,
    perPage,
    total,
    onPageChange,
    onPerPageChange
  }}
  
  // States
  isLoading
  emptyMessage="No hay registros"
  emptyIcon={<InboxIcon />}
  
  // Responsive
  responsiveCards // Mobile cards view
/>
```

#### 4.2 CrudManager Component

**Abstracción de alto nivel:**
```typescript
<CrudManager
  title="Usuarios"
  endpoint="/api/users"
  columns={columns}
  
  // CRUD Config
  config={{
    create: { 
      enabled: true, 
      modal: true,
      form: UserForm 
    },
    edit: { 
      enabled: true, 
      modal: true,
      form: UserForm 
    },
    delete: { 
      enabled: true, 
      confirm: true 
    }
  }}
  
  // Filters
  filters={filterConfig}
  
  // Bulk Operations
  bulkActions={bulkConfig}
  
  // Permissions
  permissions={{
    create: hasPermission('users.create'),
    edit: hasPermission('users.edit'),
    delete: hasPermission('users.delete')
  }}
/>
```

#### 4.3 Custom Hooks
- [ ] useCrud (CRUD operations)
- [ ] useDataTable (table state management)
- [ ] useFilters (filter state)
- [ ] usePagination

**Entregable:** Sistema CRUD completo y reusable

---

### **FASE 5: HOOKS Y UTILITIES** (3-5 días)

#### 5.1 Hooks
- [ ] useTheme
- [ ] useCrud
- [ ] useDataTable
- [ ] useApi
- [ ] useAuth
- [ ] useMediaQuery
- [ ] useDebounce
- [ ] useLocalStorage
- [ ] useClickOutside
- [ ] useKeyPress

#### 5.2 Utilities
- [ ] cn() - clsx + tailwind-merge
- [ ] formatters (date, currency, number)
- [ ] validators (email, phone, etc)
- [ ] helpers (debounce, throttle, etc)

**Entregable:** 10+ hooks + utilidades

---

### **FASE 6: BUILD Y PACKAGING** (2-3 días)

#### 6.1 Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FarutechDesignSystem',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  plugins: [
    react(),
    dts({ include: ['src'] })
  ]
})
```

#### 6.2 Package.json
```json
{
  "name": "@farutech/design-system",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles.css",
    "./tokens": {
      "import": "./dist/tokens/index.mjs",
      "require": "./dist/tokens/index.js",
      "types": "./dist/tokens/index.d.ts"
    }
  },
  "sideEffects": ["*.css"]
}
```

#### 6.3 Testing
- [ ] Setup Vitest
- [ ] Unit tests para utils
- [ ] Component tests (React Testing Library)
- [ ] Integration tests

**Entregable:** Paquete buildable y testeable

---

### **FASE 7: MIGRACIÓN DASHBOARD CORE** (1 semana)

#### 7.1 Instalación
```bash
cd src/01.Core/Farutech/Frontend/Dashboard
npm install @farutech/design-system@1.0.0
```

#### 7.2 Reemplazos Críticos

| Componente Actual | Reemplazar Por | Impacto |
|-------------------|----------------|---------|
| shadcn/ui Button | DS Button | ALTO |
| shadcn/ui Card | DS Card | ALTO |
| MainLayout custom | DS AppShell | CRÍTICO |
| Sidebar custom | DS Sidebar | CRÍTICO |
| Custom forms | DS Form components | ALTO |

#### 7.3 Theming
```typescript
// App.tsx
import { ThemeProvider } from '@farutech/design-system/theme'
import { erpTheme } from '@farutech/design-system/themes'

function App() {
  return (
    <ThemeProvider theme={erpTheme}>
      <Router>...</Router>
    </ThemeProvider>
  )
}
```

#### 7.4 Testing de Regresión
- [ ] Visual regression tests
- [ ] Functional tests
- [ ] Performance benchmarks

**Entregable:** Dashboard Core migrado sin regresiones

---

### **FASE 8: DASHBOARD MULTI-TENANT** (1 semana)

#### 8.1 Setup Orquestador
```typescript
// 02.Apps/Frontend/Dashboard/App.tsx
import { AppShell, ThemeProvider } from '@farutech/design-system'
import { useTheme } from '@farutech/design-system/hooks'

function OrchestratorDashboard() {
  const { currentTheme, setTheme } = useTheme()
  
  return (
    <AppShell
      sidebar={<OrchestratorSidebar />}
      header={<OrchestratorHeader />}
    >
      <ModuleLoader />
    </AppShell>
  )
}
```

#### 8.2 Module Federation
- [ ] Setup Webpack Module Federation o Vite Federation
- [ ] Configurar módulos remotos
- [ ] Lazy loading de MPs
- [ ] Shared dependencies config

#### 8.3 Micro-Frontends
```typescript
// MP Structure
farutech-mp-ordeon/
├── src/
│   ├── pages/
│   │   ├── OrdersPage.tsx    // Usa DataTable
│   │   └── MenuPage.tsx      // Usa CrudManager
│   ├── forms/
│   │   ├── OrderForm.tsx     // Usa DS Form components
│   │   └── ProductForm.tsx
│   └── services/
│       └── ordersApi.ts
└── package.json               // Consume @farutech/design-system
```

**Entregable:** Dashboard multi-tenant operativo

---

### **FASE 9: DOCUMENTACIÓN** (1 semana)

#### 9.1 README Principal
- [ ] Getting Started
- [ ] Installation
- [ ] Basic Usage
- [ ] Configuration

#### 9.2 Component Docs
- [ ] Props documentation
- [ ] Usage examples
- [ ] Best practices
- [ ] API reference

#### 9.3 Guides
- [ ] Theming guide
- [ ] Token customization
- [ ] Building custom components
- [ ] Migration guide (shadcn → DS)

#### 9.4 Storybook (Opcional)
- [ ] Setup Storybook
- [ ] Stories para todos los componentes
- [ ] Interactive playground

**Entregable:** Documentación completa

---

### **FASE 10: PUBLICACIÓN Y CI/CD** (2-3 días)

#### 10.1 GitHub Packages
```yaml
# .github/workflows/publish.yml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

#### 10.2 Versionado Semántico
- [ ] Setup semantic-release
- [ ] Changelog automation
- [ ] Git tags

#### 10.3 NPM Scripts
```json
{
  "scripts": {
    "build": "vite build",
    "test": "vitest run",
    "lint": "eslint src",
    "prepublishOnly": "npm run build && npm test",
    "release": "semantic-release"
  }
}
```

**Entregable:** Sistema de publicación automatizado

---

## 🎯 MÉTRICAS DE ÉXITO

### Performance

| Métrica | Target | Crítico |
|---------|--------|---------|
| Bundle size (gzip) | < 150KB | < 200KB |
| Tree-shaking | 100% | 90% |
| Build time | < 30s | < 60s |
| First paint | < 1s | < 2s |

### Code Quality

| Métrica | Target |
|---------|--------|
| TypeScript coverage | 100% |
| Test coverage | > 80% |
| ESLint errors | 0 |
| Accessibility (a11y) | AAA |

### Developer Experience

- ✅ IntelliSense completo
- ✅ Props documentadas
- ✅ Examples funcionales
- ✅ Hot reload < 100ms

---

## ⚠️ RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Breaking changes en migración | ALTA | ALTO | Versionado semántico, changelog detallado |
| Performance degradation | MEDIA | ALTO | Benchmarks continuos, code splitting |
| Inconsistencias visuales | MEDIA | MEDIO | Visual regression tests |
| Dependencias obsoletas | BAJA | MEDIO | Renovate/Dependabot |
| Adopción lenta | MEDIA | MEDIO | Documentación exhaustiva, training |

---

## 📅 TIMELINE ESTIMADO

```
Semana 1-2:  Fases 1-2 (Fundamentos + Componentes Base)
Semana 3-4:  Fases 3-4 (Avanzados + CRUD)
Semana 5:    Fase 5 (Hooks + Utils)
Semana 6:    Fase 6 (Build + Packaging)
Semana 7-8:  Fases 7-8 (Migraciones)
Semana 9:    Fase 9 (Documentación)
Semana 10:   Fase 10 (Publicación + Buffer)

TOTAL: 8-10 semanas (2-2.5 meses)
```

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. ✅ **Aprobar este plan** con stakeholders
2. **Crear branch** `feature/design-system-v1`
3. **Limpiar** `src/05.SDK/DesignSystem`
4. **Setup inicial** (package.json, tsconfig, vite.config)
5. **Implementar tokens** como POC

---

**Documento Vivo:** Actualizar conforme avance la implementación.

**Responsable:** Senior Frontend Engineer  
**Revisión:** Semanal  
**Status:** ⏳ Pendiente de aprobación
