# 📚 Documentación Técnica - FaruTech Admin Panel

> Documentación completa de arquitectura, componentes, hooks, stores y utilidades del sistema.

**Versión:** 1.0.0  
**Última actualización:** 18 de Noviembre, 2025  
**Desarrollado por:** FaruTech

---

## 📖 Índice General

### 🏗️ Arquitectura
- [**Arquitectura General**](./ARCHITECTURE.md) - Visión general del sistema
- [**Suspense Boundaries**](./SUSPENSE_ARCHITECTURE.md) - Sistema de carga optimizada
- [**Estabilidad de Módulos**](./MODULE_STABILITY_FIX.md) - Gestión de módulos y navegación
- [**Análisis Técnico**](./TECHNICAL_ANALYSIS.md) - Decisiones de arquitectura
- [**Resumen de Documentación**](./DOCUMENTATION_SUMMARY.md) - Overview completo del proyecto
- [**Log de Actualización README**](./README_UPDATE_LOG.md) - Cambios realizados al README principal

### 🧩 Componentes UI

#### Básicos
- [**Button**](./components/Button.md) - Botones y variantes
- [**Input**](./components/Input.md) - Campos de texto y validación
- [**Select**](./components/Select.md) - Selectores y dropdowns
- [**Card**](./components/Card.md) - Tarjetas y contenedores

#### Formularios
- [**Form**](./components/Form.md) - Sistema de formularios con validación
- [**Checkbox**](./components/Checkbox.md) - Checkboxes y grupos
- [**RadioGroup**](./components/RadioGroup.md) - Radio buttons
- [**Switch**](./components/Switch.md) - Toggles e interruptores
- [**DatePicker**](./components/DatePicker.md) - Selectores de fecha/hora
- [**PhoneInput**](./components/PhoneInput.md) - Input de teléfono con formato
- [**MaskedInput**](./components/MaskedInput.md) - Inputs con máscaras
- [**TagInput**](./components/TagInput.md) - Input de tags/etiquetas
- [**ImageUpload**](./components/ImageUpload.md) - Subida de imágenes

#### Navegación
- [**Tabs**](./components/Tabs.md) - Pestañas y navegación
- [**Breadcrumb**](./components/Breadcrumb.md) - Migas de pan
- [**Dropdown**](./components/Dropdown.md) - Menús desplegables
- [**CommandPalette**](./components/CommandPalette.md) - Paleta de comandos (Cmd+K)
- [**ModuleSwitcher**](./components/ModuleSwitcher.md) - Selector de módulos

#### Feedback
- [**Alert**](./components/Alert.md) - Alertas y notificaciones
- [**Toast**](./components/Toast.md) - Notificaciones toast
- [**Modal**](./components/Modal.md) - Modales y diálogos
- [**Drawer**](./components/Drawer.md) - Paneles laterales
- [**Loading**](./components/Loading.md) - Indicadores de carga
- [**Spinner**](./components/Spinner.md) - Spinners animados
- [**LogoSpinner**](./components/LogoSpinner.md) - Spinner con logo
- [**Skeleton**](./components/Skeleton.md) - Skeleton loaders
- [**EmptyState**](./components/EmptyState.md) - Estados vacíos
- [**Tooltip**](./components/Tooltip.md) - Tooltips informativos

#### Visualización
- [**DataTable**](./components/DataTable.md) - Tablas de datos avanzadas
- [**Charts**](./components/Charts.md) - Gráficos y visualizaciones
- [**StatsCard**](./components/StatsCard.md) - Tarjetas de estadísticas
- [**Avatar**](./components/Avatar.md) - Avatares de usuario
- [**Badge**](./components/Badge.md) - Badges e indicadores
- [**ProgressBar**](./components/ProgressBar.md) - Barras de progreso
- [**Stepper**](./components/Stepper.md) - Pasos de proceso
- [**Carousel**](./components/Carousel.md) - Carruseles de imágenes
- [**ListGroup**](./components/ListGroup.md) - Listas de elementos
- [**Scheduler**](./components/Scheduler.md) - Calendario de citas

#### Utilidades
- [**IconRenderer**](./components/IconRenderer.md) - Renderizado de íconos
- [**CodePreview**](./components/CodePreview.md) - Preview de código
- [**Divider**](./components/Divider.md) - Separadores visuales
- [**FloatingActionButton**](./components/FloatingActionButton.md) - FAB
- [**GlobalLoading**](./components/GlobalLoading.md) - Loading global

### 🎣 Hooks

#### Autenticación y Datos
- [**useAuth**](./hooks/useAuth.md) - Gestión de autenticación
- [**useApi**](./hooks/useApi.md) - Cliente HTTP y peticiones
- [**useCrud**](./hooks/useCrud.md) - Operaciones CRUD genéricas

#### UI y Estado
- [**useMenu**](./hooks/useMenu.md) - Gestión de menús dinámicos
- [**useMenuCache**](./hooks/useMenuCache.md) - Caché de menús
- [**useProcess**](./hooks/useProcess.md) - Ejecución de procesos
- [**useDataTableState**](./hooks/useDataTableState.md) - Estado de tablas
- [**useGlobalLoading**](./hooks/useGlobalLoading.md) - Loading global
- [**useStepper**](./hooks/useStepper.md) - Control de steppers
- [**useCommandPalette**](./hooks/useCommandPalette.md) - Paleta de comandos
- [**useModuleSwitcher**](./hooks/useModuleSwitcher.md) - Selector de módulos

### 🗄️ State Management (Zustand)

- [**authStore**](./stores/authStore.md) - Estado de autenticación
- [**moduleStore**](./stores/moduleStore.md) - Módulos activos
- [**themeStore**](./stores/themeStore.md) - Tema y preferencias visuales
- [**sidebarStore**](./stores/sidebarStore.md) - Estado del sidebar
- [**searchStore**](./stores/searchStore.md) - Búsqueda global
- [**notificationStore**](./stores/notificationStore.md) - Notificaciones
- [**localeStore**](./stores/localeStore.md) - Internacionalización

### 🎨 Layout Components

- [**MainLayout**](./layout/MainLayout.md) - Layout principal
- [**Navbar**](./layout/Navbar.md) - Barra de navegación superior
- [**Sidebar**](./layout/Sidebar.md) - Barra lateral de navegación
- [**RequireAuth**](./layout/RequireAuth.md) - HOC de autenticación
- [**ContentSuspense**](./layout/ContentSuspense.md) - Suspense boundaries
- [**PageTransition**](./layout/PageTransition.md) - Transiciones de página
- [**SearchBar**](./layout/SearchBar.md) - Barra de búsqueda
- [**SearchModal**](./layout/SearchModal.md) - Modal de búsqueda
- [**NotificationPanel**](./layout/NotificationPanel.md) - Panel de notificaciones

### 🔧 Utilidades

- [**auth.ts**](./utils/auth.md) - Utilidades de autenticación
- [**csrf.ts**](./utils/csrf.md) - Protección CSRF
- [**formatters.ts**](./utils/formatters.md) - Formateadores de datos
- [**theme.ts**](./utils/theme.md) - Gestión de temas
- [**hasPermission.ts**](./utils/permissions.md) - Control de permisos

### 🎯 CRUD Components

- [**CrudTable**](./crud/CrudTable.md) - Tabla CRUD
- [**CrudFilters**](./crud/CrudFilters.md) - Filtros CRUD
- [**CrudActions**](./crud/CrudActions.md) - Acciones CRUD
- [**CrudPagination**](./crud/CrudPagination.md) - Paginación CRUD

### ⚙️ Configuración

- [**api.config.ts**](./config/api.md) - Configuración de API
- [**menu.config.ts**](./config/menu.md) - Configuración de menús

### 🔌 Context Providers

- [**ConfigContext**](./contexts/ConfigContext.md) - Configuración global

### 🎨 Services

- [**api.service.ts**](./services/api.md) - Cliente API REST
- [**demo-auth.service.ts**](./services/demo-auth.md) - Autenticación demo

---

## 🚀 Guías de Uso Rápido

### Crear un Nuevo Componente UI

```tsx
import { Button, Card, Input, Form } from '@/components/ui'

function MyComponent() {
  return (
    <Card>
      <Form onSubmit={handleSubmit}>
        <Input label="Nombre" />
        <Button type="submit">Guardar</Button>
      </Form>
    </Card>
  )
}
```

### Usar Hooks de Autenticación

```tsx
import { useAuth } from '@/hooks/useAuth'

function Profile() {
  const { user, login, logout } = useAuth()
  
  return (
    <div>
      <p>Hola, {user?.name}</p>
      <Button onClick={logout}>Cerrar Sesión</Button>
    </div>
  )
}
```

### Gestionar Estado Global

```tsx
import { useModuleStore } from '@/store/moduleStore'

function ModuleDisplay() {
  const { currentModule, setCurrentModule } = useModuleStore()
  
  return (
    <div>
      <p>Módulo actual: {currentModule}</p>
      <Button onClick={() => setCurrentModule('crm')}>
        Cambiar a CRM
      </Button>
    </div>
  )
}
```

### Crear una Tabla con DataTable

```tsx
import { DataTable } from '@/components/ui'

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rol' },
]

function UsersTable() {
  return (
    <DataTable
      columns={columns}
      data={users}
      searchable
      sortable
      pagination
    />
  )
}
```

---

## 📦 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/               # Componentes UI reutilizables
│   ├── layout/           # Componentes de layout
│   ├── crud/             # Componentes CRUD
│   └── process/          # Componentes de procesos
├── hooks/                # Custom hooks
├── store/                # Zustand stores
├── contexts/             # React contexts
├── pages/                # Páginas de la aplicación
├── services/             # Servicios y APIs
├── utils/                # Utilidades
├── types/                # Definiciones de TypeScript
└── config/               # Archivos de configuración
```

---

## 🎨 Principios de Diseño

### 1. **Componentización**
- Componentes pequeños, reutilizables y composables
- Props bien tipadas con TypeScript
- Documentación inline con JSDoc

### 2. **State Management**
- Zustand para estado global
- React Query para estado del servidor
- Local state con useState para UI temporal

### 3. **Performance**
- Code splitting con React.lazy
- Memoization con useMemo/useCallback
- Suspense boundaries para carga optimizada

### 4. **Accesibilidad**
- ARIA labels en componentes interactivos
- Navegación por teclado
- Soporte para lectores de pantalla

### 5. **Responsive Design**
- Mobile-first approach
- Tailwind CSS para estilos
- Breakpoints consistentes

---

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 🔄 Flujo de Trabajo

### Desarrollo
1. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
2. Desarrollar y documentar
3. Correr tests: `npm run test`
4. Build: `npm run build`
5. Crear PR

### Producción
1. Merge a main
2. Build de producción: `npm run build`
3. Deploy a servidor

---

## 📞 Soporte

- **Documentación:** Este directorio `/docs`
- **Issues:** GitHub Issues
- **Desarrollador:** FaruTech

---

## 📄 Licencia

MIT License - Ver LICENSE file

---

**FaruTech Admin Panel** © 2025
