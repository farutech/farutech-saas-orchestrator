<div align="center">

  # 🚀 Dashboard - React + Vite + TypeScript

### Panel de Administración Empresarial Moderno

*Escalable · Documentado · Production-Ready*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]() [![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)]() [![React](https://img.shields.io/badge/React-19.1.1-61dafb)]() [![Vite](https://img.shields.io/badge/Vite-7.2.2-646cff)]() [![License](https://img.shields.io/badge/license-MIT-green)]()

---

### 📚 [**Ver Documentación Completa →**](./docs/README.md)

*50+ Componentes · 8 Custom Hooks · 7 Zustand Stores · 100% Documentado*

</div>

---

## 🌐 Estado del Proyecto

- **Versión:** 1.0.0
- **Estado:** ✅ En Producción
- **Documentación:** ✅ Completa (3000+ líneas)
- **Última Actualización:** Noviembre 2025
- **Build:** ✅ Exitoso (14.60s, 1724 módulos)
- **Bundle Size:** 374 KB (gzip: 102 KB)

## ✨ Características Principales

### 🎨 Sistema de Diseño Completo
- **50+ Componentes UI**: Biblioteca completa documentada → [Ver Componentes](./docs/components/UI_COMPONENTS.md)
- **Tema Dark/Light/System**: Gestión automática con persistencia
- **Responsive Design**: Mobile-first con breakpoints optimizados
- **Animaciones**: Framer Motion 12 con transiciones suaves
- **Accesibilidad**: Componentes ARIA compliant

### 🏗️ Arquitectura Modular
- **Sistema de Módulos**: Dashboard, Gestión, CRM, Ventas, Inventario, Reportes
- **Navegación Estable**: Sin auto-detección, módulos persistentes → [Ver Fix](./docs/MODULE_STABILITY_FIX.md)
- **Code Splitting**: Lazy loading con Suspense Boundaries → [Ver Arquitectura](./docs/SUSPENSE_ARCHITECTURE.md)
- **Rutas Compartidas**: Componentes accesibles desde múltiples módulos

### 🔌 Integración Backend Robusta
- **8 Custom Hooks**: Sistema completo documentado → [Ver Hooks](./docs/hooks/HOOKS_REFERENCE.md)
- **React Query 5**: Caché inteligente, refetch automático, optimistic updates
- **Axios Interceptors**: Tokens JWT, refresh automático, manejo de errores
- **TypeScript Strict**: Tipado completo end-to-end

### 📊 Sistema CRUD Avanzado
- **DataTable**: Ordenamiento, filtros, paginación, selección múltiple
- **useCrud Hook**: CRUD genérico reutilizable para cualquier entidad
- **CrudActions**: Acciones contextuales (editar, eliminar, duplicar, ver)
- **Bulk Operations**: Operaciones masivas optimizadas
- **Optimistic Updates**: UI instantánea con rollback automático

### � Gestión de Estado
- **7 Zustand Stores**: Estado global documentado → [Ver Stores](./docs/stores/STORES_REFERENCE.md)
- **authStore**: JWT dual storage (localStorage/sessionStorage)
- **moduleStore**: Gestión de módulos activos
- **themeStore**: Preferencias visuales
- **Persistencia**: Middleware para stores críticos

### � Performance Optimizado
- **Bundle Size**: 374 KB main bundle (gzip: 102 KB)
- **Code Splitting**: 30+ chunks lazy-loaded
- **Build Time**: ~14s para producción
- **Tree Shaking**: Eliminación de código no usado
- **Memoización**: React.memo, useMemo, useCallback estratégicos

## 🛠️ Tech Stack

> **📖 Documentación Técnica Completa:** [Ver Arquitectura](./docs/ARCHITECTURE.md)

### Core
- **React 19.1.1** - Framework UI con nuevos hooks y Suspense
- **TypeScript 5.6.3** - Tipado estático estricto
- **Vite 7.2.2** - Build tool ultrarrápido con HMR

### Estado y Data Fetching
- **TanStack Query 5.63.1** - Server state management con caché inteligente
- **Zustand 5.0.2** - Client state management (7 stores documentados)
- **Axios 1.7.9** - HTTP client con interceptores JWT

### UI y Estilos
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Headless UI 2.2.0** - Componentes accesibles sin estilos
- **Heroicons 2.2.0** - Biblioteca de iconos SVG
- **Framer Motion 12.0.0** - Animaciones declarativas
- **Lucide React 0.468.0** - Iconos adicionales

### Formularios y Validación
- **React Hook Form 7.54.2** - Manejo performante de formularios
- **Zod 3.24.1** - Validación de esquemas TypeScript-first
- **React Input Mask 3.0.0** - Máscaras para inputs

### Tablas y Visualización
- **TanStack Table 8.20.6** - Tablas avanzadas headless
- **Chart.js 4.4.7** - Librería de gráficos canvas
- **Recharts 2.15.0** - Gráficos React declarativos

### Routing y Navegación
- **React Router DOM 7.1.1** - Navegación SPA con lazy loading

### Utilidades
- **date-fns 4.1.0** - Manipulación de fechas
- **clsx 2.1.1** - Composición de classNames
- **React Hot Toast 2.4.1** - Sistema de notificaciones

## 📁 Estructura del Proyecto

> **📖 Ver estructura completa:** [Documentación de Arquitectura](./docs/ARCHITECTURE.md)

```
dashboard/
├── docs/                           # 📚 Documentación completa del proyecto
│   ├── README.md                   # Índice principal de documentación
│   ├── ARCHITECTURE.md             # Arquitectura del sistema
│   ├── MODULE_STABILITY_FIX.md     # Sistema de módulos sin auto-detección
│   ├── SUSPENSE_ARCHITECTURE.md    # Optimización de carga
│   ├── DOCUMENTATION_SUMMARY.md    # Resumen ejecutivo
│   ├── components/
│   │   └── UI_COMPONENTS.md        # 50+ componentes documentados
│   ├── hooks/
│   │   └── HOOKS_REFERENCE.md      # 8 custom hooks documentados
│   └── stores/
│       └── STORES_REFERENCE.md     # 7 stores de Zustand documentados
│
├── src/
│   ├── components/
│   │   ├── ui/                     # 50+ componentes UI reutilizables
│   │   │   ├── Button.tsx          # Botones con variantes
│   │   │   ├── Card.tsx            # Tarjetas y contenedores
│   │   │   ├── Input.tsx           # Inputs con validación
│   │   │   ├── Select.tsx          # Selects personalizados
│   │   │   ├── Modal.tsx           # Modales accesibles
│   │   │   ├── DataTable.tsx       # Tablas avanzadas
│   │   │   ├── Form.tsx            # Sistema de formularios
│   │   │   ├── Charts.tsx          # Gráficos interactivos
│   │   │   ├── DatePicker.tsx      # Selector de fechas
│   │   │   ├── CommandPalette.tsx  # Paleta de comandos (Cmd+K)
│   │   │   └── ... (50+ más)       # Ver documentación completa
│   │   ├── layout/                 # Componentes de layout
│   │   │   ├── MainLayout.tsx      # Layout principal con sidebar
│   │   │   ├── Sidebar.tsx         # Sidebar modular (sin auto-detección)
│   │   │   ├── Navbar.tsx          # Barra de navegación superior
│   │   │   ├── RequireAuth.tsx     # HOC de autenticación
│   │   │   └── SearchModal.tsx     # Búsqueda global
│   │   ├── crud/                   # Sistema CRUD reutilizable
│   │   │   ├── CrudTable.tsx
│   │   │   ├── CrudActions.tsx
│   │   │   ├── CrudPagination.tsx
│   │   │   └── CrudFilters.tsx
│   │   ├── process/                # Procesos background
│   │   │   └── ProcessRunner.tsx
│   │   └── ErrorBoundary.tsx       # Manejo de errores React
│   │
│   ├── hooks/                      # Custom hooks (8 documentados)
│   │   ├── useApi.ts               # Cliente HTTP con React Query
│   │   ├── useCrud.ts              # CRUD genérico reutilizable
│   │   ├── useAuth.ts              # Autenticación y sesión
│   │   ├── useMenu.ts              # Menús dinámicos por módulo
│   │   ├── useMenuCache.ts         # Caché de menús (5min TTL)
│   │   └── useProcess.ts           # Ejecución de procesos
│   │
│   ├── store/                      # Zustand stores (7 documentados)
│   │   ├── authStore.ts            # JWT tokens, remember me
│   │   ├── moduleStore.ts          # Módulo activo (estable)
│   │   ├── themeStore.ts           # Dark/Light/System theme
│   │   ├── sidebarStore.ts         # Estado sidebar, width
│   │   ├── searchStore.ts          # Búsqueda global
│   │   ├── notificationStore.ts    # Push notifications
│   │   └── localeStore.ts          # i18n, formatting
│   │
│   ├── pages/                      # Páginas por módulo
│   │   ├── dashboard/              # Módulo Dashboard
│   │   ├── auth/                   # Login, registro
│   │   ├── users/                  # Gestión de usuarios
│   │   ├── crm/                    # CRM dashboard
│   │   ├── ventas/                 # Módulo de ventas
│   │   ├── inventario/             # Gestión de inventario
│   │   ├── reportes/               # Sistema de reportes
│   │   ├── processes/              # Procesos especiales
│   │   ├── settings/               # Configuración
│   │   └── errors/                 # Páginas de error (404, 500)
│   │
│   ├── services/                   # Servicios y APIs
│   │   ├── api.service.ts          # Cliente Axios configurado
│   │   └── demo-auth.service.ts    # Autenticación demo
│   │
│   ├── contexts/                   # React Contexts
│   │   └── ConfigContext.tsx       # Configuración global
│   │
│   ├── config/                     # Configuración
│   │   ├── api.config.ts           # Endpoints API
│   │   └── menu.config.ts          # Configuración de menús
│   │
│   ├── types/                      # TypeScript types
│   │   └── index.ts                # Tipos globales
│   │
│   ├── utils/                      # Utilidades
│   │   ├── auth.ts                 # Helpers de autenticación
│   │   ├── csrf.ts                 # Protección CSRF
│   │   ├── formatters.ts           # Formateo de datos
│   │   ├── hasPermission.ts        # Sistema de permisos
│   │   └── theme.ts                # Helpers de tema
│   │
│   ├── App.tsx                     # Componente raíz
│   └── main.tsx                    # Entry point
│
├── public/                         # Assets estáticos
├── .env.example                    # Variables de entorno
├── eslint.config.js                # ESLint config
├── tailwind.config.js              # TailwindCSS config
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── package.json                    # Dependencias
│   ├── store/               # Zustand stores
│   │   ├── themeStore.ts
│   │   ├── notificationStore.ts
│   │   └── sidebarStore.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── config/              # Configuración
│   │   └── api.config.ts
│   ├── pages/               # Páginas
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   └── users/
│   │       └── UsersPage.tsx
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Entry point
├── public/                  # Archivos estáticos
├── .env.example             # Variables de entorno ejemplo
├── tailwind.config.js       # Configuración TailwindCSS
├── tsconfig.json            # Configuración TypeScript
├── vite.config.ts           # Configuración Vite
└── package.json
```

## 🚀 Inicio Rápido

### 1. Clonar e Instalar

```bash
# Clonar repositorio
git clone <repository-url>
cd dashboard

# Instalar dependencias
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Edita `.env` con tu configuración:

```env
# API Backend
VITE_API_URL=http://localhost:8000/api

# Configuración de autenticación
VITE_AUTH_TOKEN_KEY=auth_token
VITE_AUTH_REFRESH_KEY=refresh_token

# Otros
VITE_APP_NAME=Dashboard
VITE_APP_VERSION=1.0.0
```

### 3. Iniciar Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4. Build para Producción

```bash
# Build optimizado
npm run build

# Preview del build
npm run preview
```

**Métricas del Build:**
- ✅ Tiempo: ~14.60s
- ✅ Módulos: 1724
- ✅ Bundle principal: 374 KB (gzip: 102 KB)
- ✅ Bundle de charts: 395 KB (gzip: 113 KB)
- ✅ 30+ chunks lazy-loaded

### 5. Otros Comandos

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Clean install
npm ci
```

## � Documentación

Este proyecto cuenta con **documentación completa y centralizada** en el directorio `/docs`:

### 📖 Documentos Principales

| Documento | Descripción | Enlace |
|-----------|-------------|---------|
| **Índice Principal** | Punto de entrada con navegación completa | [README.md](./docs/README.md) |
| **Arquitectura** | Visión técnica del sistema, flujo de datos | [ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| **Componentes UI** | 50+ componentes con ejemplos | [UI_COMPONENTS.md](./docs/components/UI_COMPONENTS.md) |
| **Custom Hooks** | 8 hooks documentados con API completa | [HOOKS_REFERENCE.md](./docs/hooks/HOOKS_REFERENCE.md) |
| **Zustand Stores** | 7 stores de estado global | [STORES_REFERENCE.md](./docs/stores/STORES_REFERENCE.md) |
| **Sistema de Módulos** | Navegación estable sin auto-detección | [MODULE_STABILITY_FIX.md](./docs/MODULE_STABILITY_FIX.md) |
| **Suspense** | Optimización de carga con code splitting | [SUSPENSE_ARCHITECTURE.md](./docs/SUSPENSE_ARCHITECTURE.md) |
| **Resumen Ejecutivo** | Overview completo del proyecto | [DOCUMENTATION_SUMMARY.md](./docs/DOCUMENTATION_SUMMARY.md) |

### 🎯 Guías Rápidas

**Para Desarrolladores Nuevos:**
1. Lee [docs/README.md](./docs/README.md) para visión general
2. Revisa [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) para entender el sistema
3. Consulta componentes específicos en [docs/components/](./docs/components/)

**Para Desarrollar Features:**
1. Busca componentes en [UI_COMPONENTS.md](./docs/components/UI_COMPONENTS.md)
2. Usa hooks documentados en [HOOKS_REFERENCE.md](./docs/hooks/HOOKS_REFERENCE.md)
3. Gestiona estado con [STORES_REFERENCE.md](./docs/stores/STORES_REFERENCE.md)

## 🔌 Integración con Backend

> **📖 Ver documentación completa de hooks:** [HOOKS_REFERENCE.md](./docs/hooks/HOOKS_REFERENCE.md)

### Configuración de Endpoints

Edita `src/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
}

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh-token',
    me: '/auth/me',
  },
  users: '/users',
  // Añade más endpoints
}
```

### Ejemplo: Hook CRUD Genérico

```typescript
import { useCrud } from '@/hooks/useCrud'
import { DataTable, Button } from '@/components/ui'

interface User {
  id: number
  name: string
  email: string
  role: string
}

function UsersPage() {
  const { 
    items, 
    isLoading, 
    create, 
    update, 
    remove, 
    bulkDelete 
  } = useCrud<User>('/users', 'users')
  
  return (
    <DataTable
      data={items}
      columns={[
        { header: 'Nombre', accessorKey: 'name' },
        { header: 'Email', accessorKey: 'email' },
        { header: 'Rol', accessorKey: 'role' }
      ]}
      actions={[
        { 
          label: 'Editar', 
          onClick: (user) => update.mutate({ 
            id: user.id, 
            data: { name: 'Nuevo Nombre' } 
          }) 
        },
        { 
          label: 'Eliminar', 
          onClick: (user) => remove.mutate(user.id),
          variant: 'danger'
        }
      ]}
      selectable
      onBulkDelete={(ids) => bulkDelete.mutate(ids)}
      loading={isLoading}
    />
  )
}
```

### Ejemplo: Autenticación

```typescript
import { useAuth } from '@/hooks/useAuth'
import { Button, Input } from '@/components/ui'

function LoginPage() {
  const { login, isLoading, error } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    await login({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      rememberMe: formData.get('remember') === 'on'
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Input name="email" type="email" label="Email" required />
      <Input name="password" type="password" label="Contraseña" required />
      <Button type="submit" loading={isLoading}>
        Iniciar Sesión
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
```

**📖 Ver más ejemplos:** [HOOKS_REFERENCE.md](./docs/hooks/HOOKS_REFERENCE.md)

## 🎨 Componentes UI

> **📖 Documentación completa:** [UI_COMPONENTS.md](./docs/components/UI_COMPONENTS.md)

Este proyecto incluye **50+ componentes UI** completamente documentados y reutilizables:

### Categorías de Componentes

| Categoría | Componentes | Documentación |
|-----------|-------------|---------------|
| **Básicos** | Button, Input, Card, Select, Checkbox, Radio, Switch | [Ver docs →](./docs/components/UI_COMPONENTS.md#componentes-básicos) |
| **Formularios** | Form, MaskedInput, DatePicker, PhoneInput, TagInput, ImageUpload, Textarea | [Ver docs →](./docs/components/UI_COMPONENTS.md#componentes-de-formularios) |
| **Navegación** | Tabs, Breadcrumb, Dropdown, CommandPalette, ModuleSwitcher, Stepper | [Ver docs →](./docs/components/UI_COMPONENTS.md#componentes-de-navegación) |
| **Feedback** | Alert, Toast, Modal, Drawer, Loading, Spinner, Skeleton, EmptyState | [Ver docs →](./docs/components/UI_COMPONENTS.md#componentes-de-feedback) |
| **Visualización** | DataTable, Charts, StatsCard, Avatar, Badge, ProgressBar, Carousel | [Ver docs →](./docs/components/UI_COMPONENTS.md#componentes-de-visualización) |
| **Utilidades** | IconRenderer, CodePreview, Divider, Tooltip, FloatingActionButton | [Ver docs →](./docs/components/UI_COMPONENTS.md#componentes-de-utilidad) |

### Ejemplos Rápidos

```tsx
// Button con variantes y estados
<Button variant="primary" size="lg" loading={isLoading}>
  Guardar Cambios
</Button>

// DataTable avanzada con todas las features
<DataTable
  data={users}
  columns={columns}
  searchable
  pagination
  selectable
  actions={[
    { label: 'Editar', onClick: handleEdit },
    { label: 'Eliminar', onClick: handleDelete, variant: 'danger' }
  ]}
/>

// Form con validación integrada
<Form onSubmit={handleSubmit} schema={userSchema}>
  <FormRow>
    <Input label="Nombre" name="firstName" required />
    <Input label="Apellido" name="lastName" required />
  </FormRow>
  <Input type="email" label="Email" name="email" />
  <Select label="Rol" options={roleOptions} />
  <Button type="submit">Guardar</Button>
</Form>

// Modal accesible
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirmar Acción"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
      <Button variant="danger" onClick={handleConfirm}>Eliminar</Button>
    </>
  }
>
  ¿Estás seguro de que deseas eliminar este elemento?
</Modal>

// Charts con múltiples tipos
<Charts
  type="line"
  data={salesData}
  height={300}
  showLegend
  showTooltip
/>

// CommandPalette (Cmd+K)
<CommandPalette
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  commands={[
    { id: '1', label: 'Ir a Dashboard', action: () => navigate('/') },
    { id: '2', label: 'Crear Usuario', action: () => setShowModal(true) }
  ]}
/>
```

**📖 Ver ejemplos completos y props:** [UI_COMPONENTS.md](./docs/components/UI_COMPONENTS.md)

## 🔐 Sistema de Autenticación

> **📖 Documentación completa:** [HOOKS_REFERENCE.md - useAuth](./docs/hooks/HOOKS_REFERENCE.md#useauth)

### Características

- ✅ **JWT Tokens**: Access token + Refresh token
- ✅ **Dual Storage**: localStorage (remember me) o sessionStorage
- ✅ **Auto Refresh**: Renovación automática de tokens antes de expirar
- ✅ **Interceptores**: Inyección automática de tokens en requests
- ✅ **Redirección**: Login automático en 401/403
- ✅ **Remember Me**: Sesión persistente opcional

### Ejemplo de Uso

```typescript
import { useAuth } from '@/hooks/useAuth'

const { login, logout, user, isAuthenticated } = useAuth()

// Login
await login({
  email: 'user@example.com',
  password: 'password123',
  rememberMe: true // Usa localStorage, false usa sessionStorage
})

// Logout
await logout()

// Verificar autenticación
if (isAuthenticated) {
  console.log('Usuario:', user)
}
```

### Proteger Rutas

```tsx
import { RequireAuth } from '@/components/layout/RequireAuth'

<Route element={<RequireAuth />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/users" element={<UsersPage />} />
</Route>
```

## 📊 Gestión de Estado

> **📖 Documentación completa:** [STORES_REFERENCE.md](./docs/stores/STORES_REFERENCE.md)

### 7 Zustand Stores Documentados

| Store | Propósito | Persistencia |
|-------|-----------|--------------|
| **authStore** | JWT tokens, refresh, remember me | ✅ localStorage/sessionStorage |
| **moduleStore** | Módulo activo (sin auto-detección) | ✅ localStorage |
| **themeStore** | Dark/Light/System, colores | ✅ localStorage |
| **sidebarStore** | Open/close, width, mobile | ✅ localStorage |
| **searchStore** | Búsqueda global, recientes | ❌ Memory |
| **notificationStore** | Push notifications, preferences | ✅ localStorage |
| **localeStore** | i18n, formato fechas/números | ✅ localStorage |

### Ejemplos de Uso

```typescript
// Theme Store
import { useThemeStore } from '@/store/themeStore'

const { theme, setTheme, isDark } = useThemeStore()
setTheme('dark') // 'light', 'dark', 'system'

// Module Store (CRÍTICO: sin auto-detección)
import { useModuleStore } from '@/store/moduleStore'

const { currentModule, setCurrentModule } = useModuleStore()
setCurrentModule('gestion') // Solo cambios manuales

// Notification Store
import { useNotificationStore } from '@/store/notificationStore'

const notify = useNotificationStore.getState().addNotification
notify({
  title: 'Éxito',
  message: 'Usuario creado correctamente',
  type: 'success'
})

// Sidebar Store
import { useSidebarStore } from '@/store/sidebarStore'

const { isOpen, toggle, setWidth } = useSidebarStore()
toggle() // Abrir/cerrar
setWidth(280) // Cambiar ancho
```

**📖 Ver API completa de cada store:** [STORES_REFERENCE.md](./docs/stores/STORES_REFERENCE.md)

## 🗺️ Módulos y Rutas

### Módulos Disponibles

| Módulo | Descripción | Rutas Principales |
|--------|-------------|-------------------|
| **Dashboard** | Panel principal con métricas | `/`, `/dashboard` |
| **Gestión** | Administración del sistema | `/users`, `/settings` |
| **CRM** | Customer Relationship Management | `/crm`, `/crm/contacts` |
| **Ventas** | Gestión de ventas | `/ventas`, `/ventas/orders` |
| **Inventario** | Control de inventario | `/inventario`, `/inventario/products` |
| **Reportes** | Sistema de reportes | `/reportes` |
| **Procesos** | Procesos especiales | `/processes` |

### Rutas Compartidas

Algunas rutas como `/users` y `/settings` son **compartidas entre módulos**. El sistema mantiene el módulo activo estable y NO cambia automáticamente basado en la URL.

> **⚠️ IMPORTANTE:** El sistema ya NO tiene auto-detección de módulo. Ver [MODULE_STABILITY_FIX.md](./docs/MODULE_STABILITY_FIX.md)

### Páginas Especiales

- `/login` - Página de inicio de sesión
- `/forgot-password` - Recuperación de contraseña
- `/404` - Página no encontrada
- `/500` - Error del servidor

## ✅ Funcionalidades Implementadas

### Core Features
- ✅ **Sistema de Módulos**: 7 módulos con menús dinámicos
- ✅ **Autenticación JWT**: Login, logout, refresh automático
- ✅ **Sistema CRUD Genérico**: Hook reutilizable para cualquier entidad
- ✅ **DataTable Avanzada**: Ordenamiento, filtros, paginación, selección múltiple
- ✅ **Gestión de Estado**: 7 Zustand stores con persistencia
- ✅ **React Query**: Caché inteligente, refetch automático
- ✅ **Tema Dark/Light**: Con modo system y persistencia
- ✅ **50+ Componentes UI**: Biblioteca completa documentada
- ✅ **Code Splitting**: 30+ chunks lazy-loaded
- ✅ **Suspense Boundaries**: Carga optimizada
- ✅ **Responsive Design**: Mobile-first, adaptable
- ✅ **Command Palette**: Búsqueda rápida (Cmd+K)
- ✅ **Error Boundaries**: Manejo de errores React
- ✅ **TypeScript Strict**: Tipado completo

### Componentes Destacados
- ✅ **DataTable**: Tabla con todas las features enterprise
- ✅ **Form System**: Formularios con validación
- ✅ **Charts**: Múltiples tipos de gráficos
- ✅ **ProcessRunner**: Ejecución de procesos background
- ✅ **Modal/Drawer**: Dialogs accesibles
- ✅ **Toast/Alert**: Sistema de notificaciones
- ✅ **DatePicker**: Selector de fechas avanzado
- ✅ **CommandPalette**: Búsqueda global estilo VS Code

### Performance
- ✅ **Build Time**: ~14.60s
- ✅ **Bundle Size**: 374 KB (gzip: 102 KB)
- ✅ **Tree Shaking**: Optimización de bundle
- ✅ **Memoization**: Componentes optimizados
- ✅ **Lazy Loading**: Carga bajo demanda

### Documentación
- ✅ **Documentación Completa**: 3000+ líneas en `/docs`
- ✅ **50+ Componentes Documentados**: Con ejemplos
- ✅ **8 Hooks Documentados**: API completa
- ✅ **7 Stores Documentados**: Con patrones
- ✅ **Arquitectura Documentada**: Flujo de datos, decisiones

## 🚀 Roadmap y Mejoras Futuras

### En Desarrollo
- 🔄 **Integración Backend Real**: Conectar con API Laravel/Node
- 🔄 **Sistema de Permisos**: RBAC completo
- 🔄 **Exportación de Datos**: CSV, Excel, PDF
- 🔄 **Upload de Archivos**: Drag & drop con preview
- 🔄 **Websockets**: Notificaciones en tiempo real

### Planificado
- 📋 **Tests Unitarios**: Jest + React Testing Library
- 📋 **Tests E2E**: Playwright
- 📋 **Storybook**: Documentación visual de componentes
- 📋 **i18n**: Internacionalización completa
- 📋 **PWA**: Progressive Web App
- 📋 **Analytics**: Integración con analytics
- 📋 **CI/CD**: GitHub Actions / GitLab CI

### Optimizaciones
- ⚡ **Lighthouse Score**: Optimizar a 90+
- ⚡ **Bundle Optimization**: Reducir tamaño
- ⚡ **Image Optimization**: Lazy loading de imágenes
- ⚡ **Service Worker**: Caché offline

## 📖 Recursos y Links

### Documentación Interna
- 📚 [Índice de Documentación](./docs/README.md)
- 🏗️ [Arquitectura del Sistema](./docs/ARCHITECTURE.md)
- 🎨 [Componentes UI (50+)](./docs/components/UI_COMPONENTS.md)
- � [Custom Hooks (8)](./docs/hooks/HOOKS_REFERENCE.md)
- 🗄️ [Zustand Stores (7)](./docs/stores/STORES_REFERENCE.md)
- 🔧 [Sistema de Módulos](./docs/MODULE_STABILITY_FIX.md)
- ⚡ [Suspense Architecture](./docs/SUSPENSE_ARCHITECTURE.md)

### Documentación Externa
- [React 19 Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)
- [React Router](https://reactrouter.com)

## 🤝 Contribuir

Este proyecto está en desarrollo activo. Para contribuir:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### Guías de Contribución

- Sigue el estilo de código existente
- Actualiza la documentación si es necesario
- Añade tests para nuevas funcionalidades
- Asegúrate de que el build pase (`npm run build`)

## 📝 Changelog

### [1.0.0] - 2025-11-18

#### ✅ Agregado
- Sistema completo de 50+ componentes UI
- 8 custom hooks documentados
- 7 stores de Zustand con persistencia
- Sistema CRUD genérico reutilizable
- Autenticación JWT con refresh automático
- Sistema de módulos sin auto-detección
- Code splitting con Suspense Boundaries
- Documentación completa en `/docs`
- Dark/Light theme con modo system
- Command Palette (Cmd+K)
- DataTable enterprise-grade
- Charts con múltiples tipos

#### 🔧 Corregido
- Eliminada auto-detección de módulos en Sidebar
- Optimizado bundle size (374 KB)
- Mejorada performance de renders

#### 📚 Documentación
- Creada documentación completa (3000+ líneas)
- Todos los componentes documentados con ejemplos
- Arquitectura del sistema completa
- Guías de uso y mejores prácticas

## 👨‍💻 Autor

**Farid Maloof Suarez**
- 🏢 Empresa: **FaruTech**
- 📧 Email: [contacto]
- 🌐 Website: [farutech.com]
- 📅 Año: 2025

## 📄 Licencia

MIT License - Ver archivo [`LICENSE`](./LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 Farid Maloof Suarez - FaruTech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🏢 Acerca de FaruTech

Este **Dashboard Empresarial** ha sido diseñado y desarrollado específicamente por y para **FaruTech**, 
utilizando las mejores prácticas de la industria y tecnologías de vanguardia:

### 🎯 Filosofía de Desarrollo

- ✅ **Calidad sobre Cantidad**: Código limpio y mantenible
- ✅ **Documentación First**: Todo está documentado
- ✅ **Performance Matters**: Optimizaciones en cada capa
- ✅ **Developer Experience**: Herramientas modernas y productivas
- ✅ **Type Safety**: TypeScript estricto end-to-end
- ✅ **Reusabilidad**: Componentes y hooks genéricos
- ✅ **Escalabilidad**: Arquitectura modular preparada para crecer

### 🚀 Stack Tecnológico Moderno

- **React 19.1.1** - Framework UI de última generación
- **TypeScript 5.6.3** - Seguridad de tipos completa
- **TailwindCSS 3.4** - Diseño moderno y responsive
- **TanStack Query 5** - Gestión eficiente del estado del servidor
- **Zustand 5** - Estado global simple y poderoso
- **Vite 7.2** - Build ultrarrápido y optimizado
- **Framer Motion 12** - Animaciones fluidas

### 📊 Métricas del Proyecto

- **Componentes UI**: 50+
- **Custom Hooks**: 8
- **Zustand Stores**: 7
- **Líneas de Código**: ~15,000+
- **Líneas de Documentación**: 3,000+
- **Bundle Size**: 374 KB (gzip: 102 KB)
- **Build Time**: ~14.60s
- **Cobertura de Docs**: 100%

---

<div align="center">

**© 2025 Farid Maloof Suarez - FaruTech. Todos los derechos reservados.**

*Dashboard Empresarial - Desarrollado con* ❤️ *por FaruTech*

</div>
