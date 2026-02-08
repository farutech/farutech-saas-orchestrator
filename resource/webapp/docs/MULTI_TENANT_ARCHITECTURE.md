# 🏢 Dashboard Multi-Tenant Enterprise - Arquitectura Completa

> **Sistema de Dashboard Altamente Reusable y Configurable para Aplicaciones Enterprise Multi-Tenant**

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Sistema Multi-Tenant](#sistema-multi-tenant)
4. [Theming Dinámico](#theming-dinámico)
5. [Gestión de Datos](#gestión-de-datos)
6. [Componentes Avanzados](#componentes-avanzados)
7. [Configuración por Aplicación](#configuración-por-aplicación)
8. [Ejemplos de Uso](#ejemplos-de-uso)
9. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Visión General

Este dashboard ha sido diseñado para **alojar múltiples aplicaciones** de forma dinámica y configurable, proporcionando:

### ✨ Características Principales

- ✅ **Multi-Tenant**: Múltiples aplicaciones en un solo core
- ✅ **Theming Dinámico**: Colores, gradientes y branding por aplicación
- ✅ **Gestión de Datos Desacoplada**: API, datos estáticos o mock
- ✅ **Componentes Enterprise**: 60+ componentes reutilizables
- ✅ **Acciones Configurables**: Sistema de acciones parametrizable
- ✅ **Controles Avanzados**: Selectores con banderas, fechas, imágenes
- ✅ **Extensibilidad**: Fácil agregar nuevos módulos y features
- ✅ **Performance**: Code splitting, lazy loading, caché inteligente

### 🎨 Design Principles

1. **Separación de Concerns**: Lógica, datos y presentación desacoplados
2. **Configuration over Code**: Máxima configurabilidad
3. **Reusabilidad**: Componentes y hooks genéricos
4. **Escalabilidad**: Arquitectura modular y extensible
5. **Accesibilidad**: WCAG AA compliant
6. **UX First**: Experiencia de usuario consistente

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  • React Components (UI)                                     │
│  • Layout Components (Sidebar, Header, Footer)               │
│  • Page Components (Dashboard, Users, CRM, etc.)            │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  • Application Store (Multi-tenant config)                   │
│  • Theme Store (Dark/Light mode)                            │
│  • Module Store (Active modules)                            │
│  • Auth Store (Authentication)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    BUSINESS LAYER                            │
│  • Custom Hooks (useDataSource, useActionExecutor, etc.)     │
│  • Services (API Client, Auth Service)                      │
│  • Utilities (Theme Generator, Formatters)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                     DATA LAYER                               │
│  • React Query (Server state cache)                         │
│  • Axios (HTTP Client)                                      │
│  • Data Sources (API / Static / Mock)                       │
└─────────────────────────────────────────────────────────────┘
```

### Estructura de Directorios

```
src/
├── config/                          # Configuraciones
│   ├── applications.config.ts       # 🆕 Configuración multi-tenant
│   ├── api.config.ts                # Endpoints API
│   └── menu.config.ts               # Menús por módulo
│
├── store/                           # Zustand Stores
│   ├── applicationStore.ts          # 🆕 Store de aplicaciones
│   ├── authStore.ts                 # Autenticación
│   ├── themeStore.ts                # Tema dark/light
│   ├── moduleStore.ts               # Módulo activo
│   └── sidebarStore.ts              # Estado del sidebar
│
├── hooks/                           # Custom Hooks
│   ├── useDataSource.ts             # 🆕 Gestión de datos configurable
│   ├── useActionExecutor.ts         # 🆕 Ejecutor de acciones
│   ├── useCrud.ts                   # CRUD genérico
│   ├── useAuth.ts                   # Autenticación
│   └── useApi.ts                    # Cliente HTTP
│
├── components/
│   ├── ui/                          # Componentes UI
│   │   ├── DataTable.tsx            # Tabla enterprise mejorada
│   │   ├── AdvancedSelect.tsx       # 🆕 Selectores avanzados
│   │   ├── ImageUploadAdvanced.tsx  # 🆕 Upload de imágenes
│   │   ├── DateControls.tsx         # Controles de fecha completos
│   │   ├── Button.tsx               # Botones
│   │   ├── Input.tsx                # Inputs
│   │   ├── Card.tsx                 # Cards
│   │   ├── Modal.tsx                # Modales
│   │   └── ... (60+ componentes)
│   │
│   ├── layout/                      # Componentes de layout
│   │   ├── MainLayout.tsx           # Layout principal
│   │   ├── Sidebar.tsx              # Sidebar modular
│   │   └── Navbar.tsx               # Navbar superior
│   │
│   └── crud/                        # Sistema CRUD
│       ├── CrudTable.tsx
│       ├── CrudActions.tsx
│       └── CrudPagination.tsx
│
├── utils/                           # Utilidades
│   ├── theme-generator.ts           # 🆕 Generador de temas dinámicos
│   ├── formatters.ts                # Formateo de datos
│   ├── auth.ts                      # Helpers de auth
│   └── hasPermission.ts             # Sistema de permisos
│
├── pages/                           # Páginas por módulo
│   ├── dashboard/
│   ├── users/
│   ├── crm/
│   └── ...
│
├── services/                        # Servicios
│   ├── api.service.ts               # Cliente API
│   └── demo-auth.service.ts         # Auth demo
│
└── types/                           # TypeScript types
    └── index.ts
```

---

## 🌐 Sistema Multi-Tenant

### Concepto

El sistema permite que **múltiples aplicaciones coexistan** en el mismo core, cada una con su propia configuración de:

- Branding (logo, colores, nombre)
- Módulos habilitados
- Rutas y permisos
- Fuentes de datos
- Acciones disponibles

### Configuración de Aplicación

```typescript
// src/config/applications.config.ts

export interface ApplicationConfig {
  branding: {
    applicationId: string
    name: string
    logo: string
    logoDark?: string
    favicon: string
    pageTitle: string
    description: string
  }
  
  theme: {
    primaryColor: string
    secondaryColor?: string
    useGradients?: boolean
    gradientStyle?: 'linear' | 'radial' | 'conic'
    defaultMode?: 'light' | 'dark' | 'system'
    // ... más opciones
  }
  
  modules: ApplicationModule[]
  dataSources?: Record<string, DataSourceConfig>
  actions?: ApplicationActions
  features?: ApplicationFeatures
  api?: APIConfig
}
```

### Ejemplo: Configurar Nueva Aplicación

```typescript
export const MY_APP_CONFIG: ApplicationConfig = {
  branding: {
    applicationId: 'my-custom-app',
    name: 'Mi Aplicación',
    logo: '/logo-my-app.svg',
    favicon: '/favicon.ico',
    pageTitle: 'Mi App - Dashboard',
    description: 'Dashboard personalizado'
  },
  
  theme: {
    primaryColor: '#10b981', // Verde
    secondaryColor: '#06b6d4', // Cyan
    useGradients: true,
    gradientStyle: 'linear',
    gradientDirection: 135,
    defaultMode: 'light'
  },
  
  modules: [
    {
      id: 'dashboard',
      name: 'Inicio',
      icon: 'HomeIcon',
      path: '/',
      enabled: true,
      order: 1
    },
    {
      id: 'analytics',
      name: 'Analítica',
      icon: 'ChartBarIcon',
      path: '/analytics',
      enabled: true,
      order: 2,
      requiredPermissions: ['analytics.view']
    }
  ],
  
  api: {
    baseURL: 'https://api.my-app.com',
    timeout: 30000,
    authStrategy: 'jwt'
  }
}

// Registrar aplicación
export const APPLICATIONS_REGISTRY: Record<string, ApplicationConfig> = {
  'farutech-dashboard': FARUTECH_APP_CONFIG,
  'my-custom-app': MY_APP_CONFIG
}
```

### Cambiar de Aplicación

```typescript
import { useApplicationStore } from '@/store/applicationStore'

function AppSwitcher() {
  const { setApplication } = useApplicationStore()
  
  return (
    <select onChange={(e) => setApplication(e.target.value)}>
      <option value="farutech-dashboard">FaruTech Dashboard</option>
      <option value="my-custom-app">Mi Aplicación</option>
    </select>
  )
}
```

---

## 🎨 Theming Dinámico

### Sistema de Generación Automática

El sistema genera automáticamente:

1. **Escala de Colores**: 50, 100, 200, ..., 900 basados en el color primario
2. **Gradientes**: Linear, radial o conic según configuración
3. **Variantes**: Hover, active, disabled, etc.
4. **CSS Variables**: Disponibles en todo el sistema

### Ejemplo de Uso

```typescript
import { useAppTheme } from '@/store/applicationStore'
import { generateColorScale, lightenColor } from '@/utils/theme-generator'

function MyComponent() {
  const { theme, gradients } = useAppTheme()
  
  return (
    <div 
      className="card"
      style={{
        background: gradients.primary,
        borderColor: theme.primaryColor
      }}
    >
      <h2 style={{ color: theme.primaryColor }}>
        Título con color primario
      </h2>
    </div>
  )
}
```

### CSS Variables Disponibles

```css
/* Colores base */
--color-primary: #3b82f6
--color-secondary: #8b5cf6
--color-success: #10b981
--color-warning: #f59e0b
--color-error: #ef4444

/* Escala de colores */
--color-primary-50: #eff6ff
--color-primary-100: #dbeafe
--color-primary-500: #3b82f6
--color-primary-900: #1e3a8a

/* Gradientes */
--gradient-primary: linear-gradient(135deg, ...)
--gradient-primaryToSecondary: linear-gradient(...)
--gradient-cardLight: linear-gradient(...)

/* Tipografía y espaciado */
--font-family: Inter, system-ui
--border-radius: 0.5rem
```

### Utilidades de Color

```typescript
import {
  lightenColor,
  darkenColor,
  getComplementaryColor,
  generateColorScale,
  isColorDark,
  getContrastTextColor
} from '@/utils/theme-generator'

// Aclarar color
const lighter = lightenColor('#3b82f6', 20) // 20% más claro

// Oscurecer color
const darker = darkenColor('#3b82f6', 20)

// Color complementario
const complement = getComplementaryColor('#3b82f6')

// Generar escala completa
const scale = generateColorScale('#3b82f6')
// { 50: '#eff6ff', 100: '#dbeafe', ..., 900: '#1e3a8a' }

// Determinar color de texto
const textColor = getContrastTextColor('#3b82f6')
```

---

## 📊 Gestión de Datos

### Data Sources Configurables

El sistema soporta tres tipos de fuentes de datos:

1. **API**: Datos desde endpoints REST
2. **Static**: Datos estáticos/quemados
3. **Mock**: Datos de prueba generados

### Configurar Data Source

```typescript
// En applications.config.ts

export const MY_APP_CONFIG: ApplicationConfig = {
  // ...
  dataSources: {
    users: {
      type: 'api',
      endpoint: '/users',
      method: 'GET',
      cacheTime: 300000, // 5 minutos
      responseMapper: {
        data: 'data.users',
        total: 'data.pagination.total',
        currentPage: 'data.pagination.page',
        perPage: 'data.pagination.perPage'
      }
    },
    
    products: {
      type: 'static',
      staticData: [
        { id: 1, name: 'Producto 1', price: 100 },
        { id: 2, name: 'Producto 2', price: 200 }
      ]
    }
  }
}
```

### Usar Data Source

```typescript
import { useDataSource } from '@/hooks/useDataSource'
import { useAppConfig } from '@/store/applicationStore'

function UsersPage() {
  const config = useAppConfig()
  const dataSourceConfig = config.dataSources?.users
  
  const {
    data,
    total,
    isLoading,
    error,
    isEmpty,
    refetch,
    mutate
  } = useDataSource<User>(
    dataSourceConfig!,
    { page: 1, perPage: 10 }
  )
  
  if (isLoading) return <Loading />
  if (error) return <Error message={error.message} />
  if (isEmpty) return <EmptyState />
  
  return (
    <DataTable
      data={data}
      columns={userColumns}
      pagination={{
        page: 1,
        perPage: 10,
        total,
        onPageChange: (page) => console.log(page)
      }}
    />
  )
}
```

### Datos Locales con Filtrado/Paginación

```typescript
import { useLocalDataSource } from '@/hooks/useDataSource'

function ProductsTable() {
  const staticProducts = [/* ... */]
  
  const {
    data,
    total,
    totalPages,
    params,
    updateParams
  } = useLocalDataSource(
    staticProducts,
    {
      page: 1,
      perPage: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    },
    ['name', 'description'] // Campos buscables
  )
  
  return (
    <div>
      <input
        placeholder="Buscar..."
        onChange={(e) => updateParams({ search: e.target.value })}
      />
      
      <DataTable
        data={data}
        columns={columns}
        pagination={{
          page: params.page || 1,
          perPage: params.perPage || 10,
          total,
          onPageChange: (page) => updateParams({ page })
        }}
      />
    </div>
  )
}
```

---

## ⚙️ Sistema de Acciones Configurables

### Tipos de Acciones

1. **function**: Ejecuta una función JavaScript
2. **api**: Llama a un endpoint
3. **navigate**: Navega a una ruta
4. **modal**: Abre un modal
5. **download**: Descarga un archivo

### Configurar Acciones

```typescript
// En applications.config.ts

export const MY_APP_CONFIG: ApplicationConfig = {
  // ...
  actions: {
    global: [
      {
        id: 'export-data',
        label: 'Exportar',
        icon: 'ArrowDownTrayIcon',
        variant: 'secondary',
        type: 'download',
        config: {
          endpoint: '/export',
          method: 'POST',
          successMessage: 'Exportación iniciada'
        }
      }
    ],
    
    perResource: {
      users: [
        {
          id: 'edit-user',
          label: 'Editar',
          icon: 'PencilIcon',
          variant: 'ghost',
          type: 'navigate',
          config: {
            path: '/users/{id}/edit' // {id} se reemplaza automáticamente
          }
        },
        {
          id: 'delete-user',
          label: 'Eliminar',
          icon: 'TrashIcon',
          variant: 'danger',
          type: 'api',
          config: {
            endpoint: '/users/{id}',
            method: 'DELETE',
            requireConfirmation: true,
            confirmMessage: '¿Eliminar usuario?',
            successMessage: 'Usuario eliminado',
            errorMessage: 'Error al eliminar'
          },
          requiredPermissions: ['users.delete']
        },
        {
          id: 'send-email',
          label: 'Enviar Email',
          icon: 'EnvelopeIcon',
          variant: 'primary',
          type: 'modal',
          config: {
            modalId: 'send-email-modal'
          }
        }
      ]
    }
  }
}
```

### Usar Acciones en DataTable

```typescript
import { useActionExecutor, convertActionConfigToTableAction } from '@/hooks/useActionExecutor'
import { useAppConfig } from '@/store/applicationStore'

function UsersTable() {
  const config = useAppConfig()
  const { executeAction } = useActionExecutor()
  
  // Convertir acciones configuradas a formato de DataTable
  const rowActions = convertActionConfigToTableAction(
    config.actions?.perResource?.users || [],
    executeAction
  )
  
  const globalActions = convertActionConfigToTableAction(
    config.actions?.global || [],
    executeAction
  )
  
  return (
    <DataTable
      data={users}
      columns={columns}
      actions={rowActions}
      globalActions={globalActions}
    />
  )
}
```

### Acción Personalizada con Función

```typescript
// Registrar función global
window.myCustomAction = async (context) => {
  const { record, selectedIds } = context
  
  console.log('Ejecutando acción para:', record)
  
  // Lógica personalizada
  await fetch('/api/custom-action', {
    method: 'POST',
    body: JSON.stringify({ id: record.id })
  })
  
  return { success: true }
}

// En configuración
{
  id: 'custom',
  label: 'Acción Personalizada',
  type: 'function',
  config: {
    functionName: 'myCustomAction',
    successMessage: 'Acción ejecutada'
  }
}
```

---

## 🧩 Componentes Avanzados

### AdvancedSelect (Selectores con Banderas, Iniciales, etc.)

```typescript
import { AdvancedSelect, CountrySelect, MultiSelect } from '@/components/ui/AdvancedSelect'

// Select con banderas
<CountrySelect
  value={country}
  onChange={setCountry}
  label="País"
  showDialCode
/>

// Select con iniciales
<AdvancedSelect
  options={users.map(u => ({
    label: u.name,
    value: u.id,
    initials: u.name.split(' ').map(n => n[0]).join(''),
    color: u.avatarColor
  }))}
  variant="initials"
  searchable
  clearable
/>

// Multi-select
<MultiSelect
  options={permissions}
  value={selectedPermissions}
  onChange={setSelectedPermissions}
  maxSelections={5}
  searchable
/>
```

### ImageUploadAdvanced (Carga de Imágenes)

```typescript
import { ImageUploadAdvanced } from '@/components/ui/ImageUploadAdvanced'

<ImageUploadAdvanced
  value={images}
  onChange={setImages}
  onUpload={async (files) => {
    // Upload a servidor
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))
    
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    })
    
    const { urls } = await response.json()
    return urls
  }}
  maxFiles={5}
  maxFileSize={5 * 1024 * 1024} // 5MB
  maxWidth={1920}
  maxHeight={1080}
  variant="gradient"
  label="Imágenes del producto"
  description="Máximo 5 imágenes, 5MB cada una"
/>
```

### DateControls (Todos los tipos de fechas)

```typescript
import { 
  DatePicker,
  TimePicker,
  DateTimePicker,
  DateRangePicker,
  TimeRangePicker,
  DateTimeRangePicker
} from '@/components/ui/DateControls'

// Fecha simple
<DatePicker
  value={date}
  onChange={setDate}
  label="Fecha"
  minDate={new Date()}
/>

// Rango de fechas
<DateRangePicker
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
  label="Período"
/>

// Fecha y hora combinados
<DateTimePicker
  value={datetime}
  onChange={setDatetime}
  label="Fecha y Hora"
  format="dd/MM/yyyy HH:mm"
/>
```

---

## 📖 Ejemplos de Uso Completos

### Ejemplo 1: Página con Datos desde API

```typescript
import { useDataSource } from '@/hooks/useDataSource'
import { useActionExecutor } from '@/hooks/useActionExecutor'
import { DataTable } from '@/components/ui/DataTable'
import { useAppConfig } from '@/store/applicationStore'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

export function UsersPage() {
  const config = useAppConfig()
  const { executeAction } = useActionExecutor()
  
  // Obtener data source de configuración
  const dataSourceConfig = config.dataSources?.users || {
    type: 'api',
    endpoint: '/users',
    method: 'GET',
    cacheTime: 300000
  }
  
  // Hook de datos
  const {
    data,
    total,
    isLoading,
    error,
    refetch
  } = useDataSource<User>(dataSourceConfig, {
    page: 1,
    perPage: 10
  })
  
  // Columnas
  const columns = [
    {
      header: 'Nombre',
      accessorKey: 'name'
    },
    {
      header: 'Email',
      accessorKey: 'email'
    },
    {
      header: 'Rol',
      accessorKey: 'role',
      cell: ({ row }) => (
        <Badge variant={row.original.role === 'admin' ? 'primary' : 'default'}>
          {row.original.role}
        </Badge>
      )
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'success' : 'warning'}>
          {row.original.status}
        </Badge>
      )
    }
  ]
  
  // Acciones configuradas
  const actions = config.actions?.perResource?.users || []
  const rowActions = actions.map(action => ({
    label: action.label,
    icon: action.icon,
    variant: action.variant,
    onClick: (record) => executeAction(action, { record })
  }))
  
  if (error) {
    return <div>Error: {error.message}</div>
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
      
      <DataTable
        data={data}
        columns={columns}
        actions={rowActions}
        loading={isLoading}
        pagination={{
          page: 1,
          perPage: 10,
          total,
          onPageChange: (page) => console.log(page)
        }}
        searchable
        selectable
      />
    </div>
  )
}
```

### Ejemplo 2: Página con Datos Estáticos

```typescript
import { useLocalDataSource } from '@/hooks/useDataSource'
import { DataTable } from '@/components/ui/DataTable'
import { AdvancedSelect } from '@/components/ui/AdvancedSelect'

const PRODUCTS = [
  { id: 1, name: 'Laptop Dell', category: 'electronics', price: 1200, stock: 15 },
  { id: 2, name: 'Mouse Logitech', category: 'electronics', price: 25, stock: 50 },
  { id: 3, name: 'Teclado Mecánico', category: 'electronics', price: 80, stock: 30 },
  { id: 4, name: 'Monitor LG 27"', category: 'electronics', price: 300, stock: 20 }
]

export function ProductsPage() {
  const {
    data,
    total,
    totalPages,
    params,
    updateParams
  } = useLocalDataSource(
    PRODUCTS,
    { page: 1, perPage: 10, sortBy: 'name', sortOrder: 'asc' },
    ['name', 'category']
  )
  
  const columns = [
    { header: 'Nombre', accessorKey: 'name' },
    { header: 'Categoría', accessorKey: 'category' },
    {
      header: 'Precio',
      accessorKey: 'price',
      cell: ({ row }) => `$${row.original.price.toFixed(2)}`
    },
    { header: 'Stock', accessorKey: 'stock' }
  ]
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>
      
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
          className="flex-1 rounded-lg border p-2"
        />
        
        <AdvancedSelect
          options={[
            { label: 'Todos', value: '' },
            { label: 'Electrónicos', value: 'electronics' },
            { label: 'Ropa', value: 'clothing' }
          ]}
          value={params.filters?.category || ''}
          onChange={(val) => updateParams({ 
            filters: { ...params.filters, category: val },
            page: 1
          })}
          placeholder="Categoría"
        />
      </div>
      
      <DataTable
        data={data}
        columns={columns}
        pagination={{
          page: params.page || 1,
          perPage: params.perPage || 10,
          total,
          totalPages,
          onPageChange: (page) => updateParams({ page }),
          onPerPageChange: (perPage) => updateParams({ perPage, page: 1 })
        }}
      />
    </div>
  )
}
```

### Ejemplo 3: Formulario con Controles Avanzados

```typescript
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CountrySelect, MultiSelect } from '@/components/ui/AdvancedSelect'
import { ImageUploadAdvanced } from '@/components/ui/ImageUploadAdvanced'
import { DateTimePicker } from '@/components/ui/DateControls'
import { Button, Input, Textarea } from '@/components/ui'

export function CreateEventForm() {
  const { register, handleSubmit, watch, setValue } = useForm()
  const [images, setImages] = useState([])
  
  const onSubmit = async (data) => {
    console.log('Form data:', data)
    
    // Enviar a API
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nombre del Evento"
        {...register('name', { required: true })}
        placeholder="Ej: Conferencia Tech 2024"
        required
      />
      
      <Textarea
        label="Descripción"
        {...register('description')}
        rows={4}
      />
      
      <DateTimePicker
        label="Fecha y Hora del Evento"
        value={watch('datetime')}
        onChange={(val) => setValue('datetime', val)}
        required
      />
      
      <CountrySelect
        label="País del Evento"
        value={watch('country')}
        onChange={(val) => setValue('country', val)}
      />
      
      <MultiSelect
        label="Categorías"
        options={[
          { label: 'Tecnología', value: 'tech' },
          { label: 'Negocios', value: 'business' },
          { label: 'Marketing', value: 'marketing' }
        ]}
        value={watch('categories') || []}
        onChange={(val) => setValue('categories', val)}
        maxSelections={3}
      />
      
      <ImageUploadAdvanced
        label="Imágenes del Evento"
        value={images}
        onChange={setImages}
        maxFiles={5}
        variant="gradient"
        showPreview
      />
      
      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost">
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Crear Evento
        </Button>
      </div>
    </form>
  )
}
```

---

## 🚀 Mejores Prácticas

### 1. Configuración

✅ **DO**:
- Usar configuración externa en `applications.config.ts`
- Definir data sources en la configuración
- Mantener acciones configurables
- Usar tipos TypeScript estrictos

❌ **DON'T**:
- Hardcodear valores en componentes
- Mezclar lógica de negocio con UI
- Duplicar configuraciones

### 2. Theming

✅ **DO**:
- Usar CSS variables para colores
- Aprovechar gradientes generados
- Respetar el tema del usuario (dark/light)
- Mantener contraste accesible

❌ **DON'T**:
- Usar colores hardcodeados
- Ignorar el tema activo
- Crear gradientes inline

### 3. Datos

✅ **DO**:
- Usar `useDataSource` para consistencia
- Implementar caché adecuado
- Manejar estados de loading/error
- Validar datos recibidos

❌ **DON'T**:
- Hacer fetch directamente en componentes
- Ignorar errores de red
- Olvidar estados de carga

### 4. Componentes

✅ **DO**:
- Reutilizar componentes existentes
- Props tipados con TypeScript
- Mantener componentes pequeños y enfocados
- Documentar props complejos

❌ **DON'T**:
- Crear componentes específicos innecesarios
- Duplicar componentes similares
- Props sin tipos

### 5. Performance

✅ **DO**:
- Usar `React.memo` para componentes pesados
- Lazy loading de páginas/módulos
- Debounce en búsquedas
- Virtualización para listas largas

❌ **DON'T**:
- Renderizar listas grandes sin virtualización
- Filtrar/ordenar en cada render
- Olvidar memoización

---

## 📚 Recursos Adicionales

### Documentación Interna

- [Componentes UI](./components/UI_COMPONENTS.md) - 60+ componentes documentados
- [Custom Hooks](./hooks/HOOKS_REFERENCE.md) - Hooks reutilizables
- [Stores](./stores/STORES_REFERENCE.md) - Estado global
- [Arquitectura](./ARCHITECTURE.md) - Arquitectura del sistema

### Referencias Externas

- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Headless UI](https://headlessui.com/)

---

<div align="center">

**© 2025 Farid Maloof Suarez - FaruTech**

*Dashboard Enterprise Multi-Tenant*

**Desarrollado con** ❤️ **por FaruTech**

</div>
