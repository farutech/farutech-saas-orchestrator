# 🚀 Dashboard Multi-Tenant Enterprise

> **Sistema de Dashboard Altamente Reusable, Configurable y Escalable**  
> Desarrollado por **Farid Maloof Suarez - FaruTech**

---

## 📋 Descripción

Este es un **sistema de dashboard enterprise completo** diseñado para alojar **múltiples aplicaciones** de forma dinámica y configurable. Cada aplicación puede tener su propio branding, colores, módulos, rutas y fuentes de datos sin necesidad de modificar el código base.

### ✨ Características Clave

- ✅ **Multi-Tenant**: Múltiples aplicaciones en un solo core
- ✅ **Theming Dinámico**: Colores, gradientes y branding por aplicación
- ✅ **Gestión de Datos Desacoplada**: API, datos estáticos o mock
- ✅ **60+ Componentes Enterprise**: Biblioteca completa y documentada
- ✅ **Acciones Configurables**: Sistema de acciones parametrizable (API, funciones, modales, navegación)
- ✅ **Controles Avanzados**: Selectores con banderas/iniciales, fechas completas, carga de imágenes
- ✅ **DataTable Enterprise**: Filtros, ordenamiento, paginación, selección múltiple, acciones
- ✅ **Performance**: Code splitting, lazy loading, caché inteligente
- ✅ **TypeScript**: 100% tipado estático
- ✅ **Accesibilidad**: WCAG AA compliant
- ✅ **Responsive**: Mobile-first design

---

## 🏗️ Arquitectura

### Capas del Sistema

```
┌─────────────────────────────────────┐
│      PRESENTATION LAYER             │
│  • Components UI (60+)              │
│  • Layout Components                │
│  • Pages                            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      APPLICATION LAYER              │
│  • Application Store (Multi-tenant) │
│  • Theme Store                      │
│  • Module/Auth Stores               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      BUSINESS LAYER                 │
│  • Custom Hooks                     │
│  • Services                         │
│  • Utilities                        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      DATA LAYER                     │
│  • React Query                      │
│  • Axios Client                     │
│  • Data Sources (API/Static/Mock)   │
└─────────────────────────────────────┘
```

### Estructura de Directorios

```
src/
├── config/
│   ├── applications.config.ts    # 🆕 Multi-tenant config
│   ├── api.config.ts
│   └── menu.config.ts
│
├── store/
│   ├── applicationStore.ts       # 🆕 Application management
│   ├── themeStore.ts
│   ├── authStore.ts
│   └── moduleStore.ts
│
├── hooks/
│   ├── useDataSource.ts          # 🆕 Configurable data source
│   ├── useActionExecutor.ts      # 🆕 Action executor
│   ├── useCrud.ts
│   └── useAuth.ts
│
├── components/
│   ├── ui/
│   │   ├── DataTable.tsx
│   │   ├── AdvancedSelect.tsx    # 🆕 Flags, initials, etc
│   │   ├── ImageUploadAdvanced.tsx # 🆕 Image upload
│   │   ├── DateControls.tsx
│   │   └── ... (60+ components)
│   ├── layout/
│   └── crud/
│
├── utils/
│   └── theme-generator.ts        # 🆕 Dynamic theme generation
│
├── pages/
│   └── examples/                 # 🆕 Complete examples
│       ├── ProductsDemoStatic.tsx
│       └── UsersDemoAPI.tsx
│
└── docs/
    └── MULTI_TENANT_ARCHITECTURE.md # 🆕 Complete documentation
```

---

## 🚀 Inicio Rápido

### 1. Instalación

```bash
npm install
```

### 2. Configurar Aplicación

Edita `src/config/applications.config.ts`:

```typescript
export const MY_APP_CONFIG: ApplicationConfig = {
  branding: {
    applicationId: 'my-app',
    name: 'Mi Aplicación',
    logo: '/logo.svg',
    favicon: '/favicon.ico',
    pageTitle: 'Mi App',
    description: 'Dashboard personalizado'
  },
  
  theme: {
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    useGradients: true,
    gradientStyle: 'linear',
    defaultMode: 'light'
  },
  
  modules: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: 'HomeIcon',
      path: '/',
      enabled: true,
      order: 1
    }
  ]
}
```

### 3. Ejecutar

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 📚 Documentación Completa

### 📖 Documentos Principales

| Documento | Descripción |
|-----------|-------------|
| [**Arquitectura Multi-Tenant**](./docs/MULTI_TENANT_ARCHITECTURE.md) | 🆕 Guía completa del sistema multi-tenant |
| [**Componentes UI**](./docs/components/UI_COMPONENTS.md) | 60+ componentes documentados |
| [**Custom Hooks**](./docs/hooks/HOOKS_REFERENCE.md) | Hooks reutilizables |
| [**Stores**](./docs/stores/STORES_REFERENCE.md) | Estado global |
| [**Arquitectura**](./docs/ARCHITECTURE.md) | Arquitectura del sistema |

### 🎯 Guías Rápidas

**Para configurar nueva aplicación:**
1. Leer [Arquitectura Multi-Tenant](./docs/MULTI_TENANT_ARCHITECTURE.md)
2. Configurar en `applications.config.ts`
3. Registrar en `APPLICATIONS_REGISTRY`

**Para crear páginas con datos:**
1. Ver ejemplo con API: `src/pages/examples/UsersDemoAPI.tsx`
2. Ver ejemplo estático: `src/pages/examples/ProductsDemoStatic.tsx`

---

## 🎨 Sistema Multi-Tenant

### Cambiar de Aplicación

```typescript
import { useApplicationStore } from '@/store/applicationStore'

const { setApplication } = useApplicationStore()

// Cambiar aplicación
setApplication('my-app')
```

### Theming Dinámico

El sistema genera automáticamente:
- **Escalas de colores** (50-900) desde color primario
- **Gradientes** configurables (linear, radial, conic)
- **CSS Variables** disponibles globalmente
- **Variantes** para estados (hover, active, disabled)

```typescript
import { useAppTheme } from '@/store/applicationStore'

const { theme, gradients } = useAppTheme()

// Usar en componentes
<div style={{ background: gradients.primary }}>
  <h1 style={{ color: theme.primaryColor }}>Título</h1>
</div>
```

---

## 📊 Gestión de Datos

### Data Source desde API

```typescript
import { useDataSource } from '@/hooks/useDataSource'

const {
  data,
  total,
  isLoading,
  error,
  refetch
} = useDataSource({
  type: 'api',
  endpoint: '/users',
  method: 'GET',
  cacheTime: 300000
}, { page: 1, perPage: 10 })
```

### Data Source Estático

```typescript
const {
  data,
  total,
  params,
  updateParams
} = useLocalDataSource(
  staticData,
  { page: 1, perPage: 10 },
  ['name', 'email'] // Campos buscables
)
```

---

## 🧩 Componentes Avanzados

### Select con Banderas

```typescript
import { CountrySelect } from '@/components/ui/AdvancedSelect'

<CountrySelect
  value={country}
  onChange={setCountry}
  showDialCode
/>
```

### Select con Iniciales

```typescript
<AdvancedSelect
  options={users.map(u => ({
    label: u.name,
    value: u.id,
    initials: getInitials(u.name),
    color: u.color
  }))}
  variant="initials"
  searchable
/>
```

### Multi-Select

```typescript
<MultiSelect
  options={permissions}
  value={selected}
  onChange={setSelected}
  maxSelections={5}
/>
```

### Carga de Imágenes

```typescript
<ImageUploadAdvanced
  value={images}
  onChange={setImages}
  maxFiles={5}
  maxFileSize={5 * 1024 * 1024}
  variant="gradient"
  onUpload={uploadToServer}
/>
```

### Controles de Fecha

```typescript
import { 
  DatePicker,
  DateRangePicker,
  DateTimePicker
} from '@/components/ui/DateControls'

<DateRangePicker
  startDate={start}
  endDate={end}
  onStartDateChange={setStart}
  onEndDateChange={setEnd}
/>
```

---

## ⚙️ Acciones Configurables

### Configurar Acciones

```typescript
// En applications.config.ts
{
  actions: {
    perResource: {
      users: [
        {
          id: 'edit',
          label: 'Editar',
          type: 'navigate',
          config: { path: '/users/{id}/edit' }
        },
        {
          id: 'delete',
          label: 'Eliminar',
          type: 'api',
          config: {
            endpoint: '/users/{id}',
            method: 'DELETE',
            requireConfirmation: true
          }
        },
        {
          id: 'send-email',
          label: 'Enviar Email',
          type: 'modal',
          config: { modalId: 'email-modal' }
        }
      ]
    }
  }
}
```

### Usar Acciones

```typescript
import { useActionExecutor } from '@/hooks/useActionExecutor'

const { executeAction } = useActionExecutor()

const handleAction = async (action, record) => {
  await executeAction(action, { record })
}
```

---

## 💡 Ejemplos Completos

### Ejemplo 1: Productos con Datos Estáticos

```typescript
// src/pages/examples/ProductsDemoStatic.tsx
✅ Data source local
✅ Filtrado y paginación
✅ Cards de estadísticas
✅ DataTable completa
✅ Modal de detalle
✅ Theming dinámico
```

### Ejemplo 2: Usuarios con API

```typescript
// src/pages/examples/UsersDemoAPI.tsx
✅ Data desde JSONPlaceholder API
✅ Loading y error states
✅ Acciones configurables
✅ Mutaciones
✅ Refetch manual
✅ Estados responsive
```

---

## 🛠️ Tech Stack

### Core
- **React 19.1.1** - Framework UI
- **TypeScript 5.6.3** - Type safety
- **Vite 7.2.2** - Build tool

### Estado y Data
- **TanStack Query 5** - Server state
- **Zustand 5** - Client state
- **Axios 1.7** - HTTP client

### UI
- **TailwindCSS 3.4** - Styling
- **Headless UI 2.2** - Accessible components
- **Framer Motion 12** - Animations
- **Heroicons 2.2** - Icons

### Forms & Tables
- **React Hook Form 7.54** - Forms
- **TanStack Table 8.20** - Tables
- **Zod 3.24** - Validation

---

## 📈 Performance

- ✅ **Build Time**: ~14.60s
- ✅ **Bundle Size**: 374 KB (gzip: 102 KB)
- ✅ **Code Splitting**: 30+ chunks lazy-loaded
- ✅ **Tree Shaking**: Optimizado
- ✅ **Caché Inteligente**: React Query

---

## 🔐 Seguridad

- ✅ JWT Tokens con refresh automático
- ✅ Autenticación dual storage (localStorage/sessionStorage)
- ✅ Interceptores HTTP
- ✅ Sistema de permisos integrable
- ✅ CSRF Protection

---

## 📝 Contribuir

1. Fork el repositorio
2. Crea tu branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add some AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Ver archivo [LICENSE](./LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Farid Maloof Suarez**  
🏢 **FaruTech**  
📧 Email: [contacto]  
🌐 Website: [farutech.com]  
📅 Año: 2025

---

<div align="center">

## 🎯 Nuevas Features Implementadas

### 🆕 Sistema Multi-Tenant
- ✅ Configuración por aplicación
- ✅ Theming dinámico con gradientes
- ✅ Branding personalizable

### 🆕 Gestión de Datos
- ✅ Data sources configurables (API/Static/Mock)
- ✅ Hook `useDataSource`
- ✅ Filtrado y paginación local

### 🆕 Acciones Configurables
- ✅ Sistema de acciones parametrizable
- ✅ Tipos: API, Function, Navigate, Modal, Download
- ✅ Hook `useActionExecutor`

### 🆕 Componentes Avanzados
- ✅ `AdvancedSelect` - Selectores con banderas, iniciales, iconos
- ✅ `MultiSelect` - Selección múltiple avanzada
- ✅ `CountrySelect` - Selector de países
- ✅ `ImageUploadAdvanced` - Carga de imágenes profesional

### 🆕 Ejemplos Completos
- ✅ Productos con datos estáticos
- ✅ Usuarios con datos desde API
- ✅ Documentación completa

---

**© 2025 Farid Maloof Suarez - FaruTech**

*Dashboard Enterprise Multi-Tenant - Desarrollado con* ❤️ *por FaruTech*

</div>
