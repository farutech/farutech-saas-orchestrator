# 🧩 Componentes UI - Referencia Completa

## 📋 Catálogo de Componentes

### ✅ Organización por Categorías

Los componentes UI están organizados en las siguientes categorías:

```
src/components/ui/
├── 📦 Básicos (Inputs, Buttons, Cards)
├── 📝 Formularios (Form, Validation, Inputs especializados)
├── 🧭 Navegación (Tabs, Breadcrumb, Menus)
├── 💬 Feedback (Alerts, Modals, Toasts)
├── 📊 Visualización (Tables, Charts, Stats)
└── 🔧 Utilidades (Icons, Loading, Dividers)
```

---

## 📦 Componentes Básicos

### Button
**Archivo:** `src/components/ui/Button.tsx`

Botón versátil con múltiples variantes y tamaños.

**Props:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  children: React.ReactNode
}
```

**Ejemplo:**
```tsx
import { Button } from '@/components/ui'
import { PlusIcon } from '@heroicons/react/24/outline'

<Button variant="primary" size="md" icon={<PlusIcon />}>
  Nuevo Usuario
</Button>

<Button variant="danger" loading>
  Eliminando...
</Button>

<Button variant="ghost" fullWidth>
  Cancelar
</Button>
```

**Variantes:**
- `primary`: Acción principal (azul)
- `secondary`: Acción secundaria (gris)
- `success`: Acción exitosa (verde)
- `danger`: Acción destructiva (rojo)
- `warning`: Advertencia (amarillo)
- `ghost`: Sin fondo
- `link`: Estilo de link

---

### Input
**Archivo:** `src/components/ui/Input.tsx`

Campo de entrada de texto con validación y estados.

**Props:**
```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
}
```

**Ejemplo:**
```tsx
import { Input } from '@/components/ui'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

<Input
  type="email"
  label="Correo Electrónico"
  placeholder="usuario@ejemplo.com"
  leftIcon={<EnvelopeIcon />}
  error="Email inválido"
  required
/>

<Input
  type="password"
  label="Contraseña"
  hint="Mínimo 8 caracteres"
/>
```

**Estados:**
- Normal
- Focus (borde azul)
- Error (borde rojo + mensaje)
- Disabled (gris)
- With icons (left/right)

---

### Card
**Archivo:** `src/components/ui/Card.tsx`

Contenedor de contenido con sombra y bordes.

**Props:**
```tsx
interface CardProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  footer?: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  children: React.ReactNode
}
```

**Ejemplo:**
```tsx
import { Card, CardHeader, Button } from '@/components/ui'

<Card
  title="Usuarios Activos"
  subtitle="Lista de usuarios conectados"
  actions={<Button size="sm">Ver Todo</Button>}
  hover
>
  <p>Contenido de la tarjeta...</p>
</Card>

<Card padding="lg" footer={<Button fullWidth>Guardar</Button>}>
  <Form>...</Form>
</Card>
```

---

### Select
**Archivo:** `src/components/ui/Select.tsx`

Selector desplegable con búsqueda opcional.

**Props:**
```tsx
interface SelectProps {
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  searchable?: boolean
  multiple?: boolean
  disabled?: boolean
}
```

**Ejemplo:**
```tsx
import { Select } from '@/components/ui'

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuario' },
  { value: 'guest', label: 'Invitado' },
]

<Select
  label="Rol"
  options={roles}
  value={selectedRole}
  onChange={setSelectedRole}
  searchable
/>

<Select
  options={countries}
  multiple
  placeholder="Seleccionar países"
/>
```

---

## 📝 Componentes de Formularios

### Form
**Archivo:** `src/components/ui/Form.tsx`

Sistema completo de formularios con validación.

**Componentes:**
- `Form`: Contenedor principal
- `FormRow`: Fila de campos
- `FormGroup`: Grupo de campos
- `FormSection`: Sección con título
- `FormActions`: Botones de acción

**Ejemplo:**
```tsx
import { Form, FormRow, FormSection, FormActions } from '@/components/ui'

<Form onSubmit={handleSubmit}>
  <FormSection title="Información Personal">
    <FormRow>
      <Input label="Nombre" name="firstName" required />
      <Input label="Apellido" name="lastName" required />
    </FormRow>
    <Input type="email" label="Email" name="email" />
  </FormSection>
  
  <FormSection title="Dirección">
    <Input label="Calle" name="street" />
    <FormRow>
      <Input label="Ciudad" name="city" />
      <Input label="CP" name="zipCode" />
    </FormRow>
  </FormSection>
  
  <FormActions>
    <Button variant="ghost">Cancelar</Button>
    <Button type="submit">Guardar</Button>
  </FormActions>
</Form>
```

---

### MaskedInput
**Archivo:** `src/components/ui/MaskedInput.tsx`

Input con formato automático (teléfono, tarjeta, etc).

**Máscaras predefinidas:**
- `phone`: (999) 999-9999
- `card`: 9999 9999 9999 9999
- `date`: 99/99/9999
- `ssn`: 999-99-9999
- `custom`: Patrón personalizado

**Ejemplo:**
```tsx
import { MaskedInput } from '@/components/ui'

<MaskedInput
  mask="phone"
  label="Teléfono"
  placeholder="(555) 123-4567"
/>

<MaskedInput
  mask="card"
  label="Tarjeta de Crédito"
/>

<MaskedInput
  mask="custom"
  pattern="##-####-##"
  label="Código Personalizado"
/>
```

---

### DatePicker
**Archivo:** `src/components/ui/DatePicker.tsx`

Selector de fecha/hora con calendario.

**Variantes:**
- `DatePicker`: Selector de fecha
- `DateTimePicker`: Fecha + hora
- `DateRangePicker`: Rango de fechas

**Ejemplo:**
```tsx
import { DatePicker, DateTimePicker, DateRangePicker } from '@/components/ui'

<DatePicker
  label="Fecha de Nacimiento"
  value={birthDate}
  onChange={setBirthDate}
  minDate={new Date('1900-01-01')}
  maxDate={new Date()}
/>

<DateTimePicker
  label="Cita"
  value={appointmentDate}
  onChange={setAppointmentDate}
/>

<DateRangePicker
  label="Período"
  startDate={startDate}
  endDate={endDate}
  onChange={({ start, end }) => {
    setStartDate(start)
    setEndDate(end)
  }}
/>
```

---

## 🧭 Componentes de Navegación

### Tabs
**Archivo:** `src/components/ui/Tabs.tsx`

Pestañas para organizar contenido.

**Ejemplo:**
```tsx
import { Tabs } from '@/components/ui'

const tabs = [
  { id: 'info', label: 'Información', content: <UserInfo /> },
  { id: 'settings', label: 'Configuración', content: <UserSettings /> },
  { id: 'security', label: 'Seguridad', content: <UserSecurity /> },
]

<Tabs tabs={tabs} defaultTab="info" />

// Con badges
const tabsWithBadges = [
  { id: 'all', label: 'Todos', badge: 42, content: <AllItems /> },
  { id: 'active', label: 'Activos', badge: 12, content: <ActiveItems /> },
  { id: 'archived', label: 'Archivados', content: <ArchivedItems /> },
]

<Tabs tabs={tabsWithBadges} variant="pills" />
```

---

### Breadcrumb
**Archivo:** `src/components/ui/Breadcrumb.tsx`

Migas de pan para navegación jerárquica.

**Ejemplo:**
```tsx
import { Breadcrumb } from '@/components/ui'

const items = [
  { label: 'Inicio', href: '/' },
  { label: 'Usuarios', href: '/users' },
  { label: 'Juan Pérez' }, // Current page (no href)
]

<Breadcrumb items={items} />
```

---

### CommandPalette
**Archivo:** `src/components/ui/CommandPalette.tsx`

Paleta de comandos estilo Cmd+K.

**Ejemplo:**
```tsx
import { CommandPalette, useCommandPalette } from '@/components/ui'

const commands = [
  {
    id: 'new-user',
    label: 'Nuevo Usuario',
    icon: <PlusIcon />,
    onSelect: () => navigate('/users/new'),
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: <CogIcon />,
    onSelect: () => navigate('/settings'),
  },
]

function App() {
  const { isOpen, open, close } = useCommandPalette()
  
  // Abrir con Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  
  return (
    <CommandPalette
      commands={commands}
      isOpen={isOpen}
      onClose={close}
      placeholder="Buscar comando..."
    />
  )
}
```

---

## 💬 Componentes de Feedback

### Alert
**Archivo:** `src/components/ui/Alert.tsx`

Alertas para mostrar mensajes importantes.

**Variantes:** `info`, `success`, `warning`, `error`

**Ejemplo:**
```tsx
import { Alert } from '@/components/ui'

<Alert variant="success" title="¡Éxito!">
  Usuario creado correctamente
</Alert>

<Alert variant="error" dismissible onClose={handleClose}>
  Error al guardar los datos
</Alert>

<Alert variant="warning" icon={<ExclamationIcon />}>
  Esta acción no se puede deshacer
</Alert>
```

---

### Toast
**Archivo:** `src/components/ui/Toast.tsx`

Notificaciones toast no intrusivas.

**Ejemplo:**
```tsx
import { ToastContainer, toast } from '@/components/ui/Toast'

// En App.tsx
<ToastContainer />

// En cualquier componente
toast.success('Usuario guardado')
toast.error('Error al eliminar')
toast.info('Procesando...')
toast.warning('Advertencia importante')

// Con opciones
toast.success('Guardado', {
  duration: 5000,
  position: 'top-right',
  icon: <CheckIcon />,
})
```

---

### Modal
**Archivo:** `src/components/ui/Modal.tsx`

Modales para diálogos y formularios.

**Ejemplo:**
```tsx
import { Modal, Button } from '@/components/ui'

function DeleteModal() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Eliminar</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmar Eliminación"
        size="md"
      >
        <p>¿Estás seguro de eliminar este usuario?</p>
        
        <div className="flex gap-2 mt-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </>
  )
}
```

**Tamaños:** `xs`, `sm`, `md`, `lg`, `xl`, `full`

---

### Drawer
**Archivo:** `src/components/ui/Drawer.tsx`

Panel lateral deslizable.

**Ejemplo:**
```tsx
import { Drawer, DrawerFooter, Button } from '@/components/ui'

<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Filtros"
  position="right" // left, right, top, bottom
  size="md"
>
  <div className="space-y-4">
    <Select label="Estado" options={statusOptions} />
    <DateRangePicker label="Período" />
  </div>
  
  <DrawerFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancelar
    </Button>
    <Button onClick={applyFilters}>
      Aplicar Filtros
    </Button>
  </DrawerFooter>
</Drawer>
```

---

## 📊 Componentes de Visualización

### DataTable
**Archivo:** `src/components/ui/DataTable.tsx`

Tabla de datos completa con filtros, ordenamiento y paginación.

**Features:**
- ✅ Ordenamiento por columnas
- ✅ Búsqueda global
- ✅ Filtros por columna
- ✅ Paginación
- ✅ Selección múltiple
- ✅ Acciones por fila
- ✅ Exportación (CSV, Excel)
- ✅ Responsive

**Ejemplo:**
```tsx
import { DataTable } from '@/components/ui'

const columns = [
  { 
    key: 'name', 
    label: 'Nombre',
    sortable: true,
    searchable: true,
  },
  { 
    key: 'email', 
    label: 'Email',
    render: (value) => <a href={`mailto:${value}`}>{value}</a>,
  },
  { 
    key: 'status', 
    label: 'Estado',
    render: (value) => (
      <Badge variant={value === 'active' ? 'success' : 'gray'}>
        {value}
      </Badge>
    ),
    filterable: true,
    filterOptions: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
    ],
  },
  {
    key: 'actions',
    label: 'Acciones',
    render: (_, row) => (
      <div className="flex gap-2">
        <Button size="xs" onClick={() => handleEdit(row)}>
          Editar
        </Button>
        <Button size="xs" variant="danger" onClick={() => handleDelete(row)}>
          Eliminar
        </Button>
      </div>
    ),
  },
]

<DataTable
  columns={columns}
  data={users}
  searchable
  searchPlaceholder="Buscar usuarios..."
  pagination
  pageSize={10}
  onRowClick={(row) => navigate(`/users/${row.id}`)}
  selectable
  onSelectionChange={(selected) => setSelected(selected)}
  globalActions={[
    {
      label: 'Exportar CSV',
      icon: <DownloadIcon />,
      onClick: (selected) => exportToCSV(selected),
    },
    {
      label: 'Eliminar Seleccionados',
      icon: <TrashIcon />,
      onClick: (selected) => deleteMultiple(selected),
      variant: 'danger',
    },
  ]}
/>
```

---

### StatsCard
**Archivo:** `src/components/ui/StatsCard.tsx`

Tarjeta de estadísticas con métricas.

**Ejemplo:**
```tsx
import { StatsCard, StatsCardGroup } from '@/components/ui'
import { UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline'

<StatsCardGroup>
  <StatsCard
    title="Usuarios Totales"
    value="1,234"
    change="+12.5%"
    trend="up"
    icon={<UsersIcon />}
    color="blue"
  />
  
  <StatsCard
    title="Ingresos"
    value="$45,231"
    change="-3.2%"
    trend="down"
    icon={<ChartBarIcon />}
    color="green"
  />
  
  <StatsCard
    title="Tasa de Conversión"
    value="3.2%"
    change="+0.5%"
    trend="up"
    subtitle="vs mes anterior"
  />
</StatsCardGroup>
```

---

### Charts
**Archivo:** `src/components/ui/Charts.tsx`

Gráficos basados en Chart.js y Recharts.

**Tipos disponibles:**
- Line Chart
- Bar Chart
- Pie Chart
- Doughnut Chart
- Area Chart
- Radar Chart

**Ejemplo:**
```tsx
import { LineChart, BarChart, PieChart } from '@/components/ui/Charts'

// Line Chart
<LineChart
  data={[
    { month: 'Ene', sales: 4000, revenue: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
  ]}
  xKey="month"
  yKeys={['sales', 'revenue']}
  colors={['#3b82f6', '#10b981']}
/>

// Bar Chart
<BarChart
  data={productSales}
  xKey="product"
  yKey="sales"
  title="Ventas por Producto"
/>

// Pie Chart
<PieChart
  data={[
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 200 },
  ]}
/>
```

---

## 🔧 Componentes de Utilidad

### Loading & Spinner
**Archivos:** `src/components/ui/Loading.tsx`, `LogoSpinner.tsx`, `Spinner.tsx`

Indicadores de carga con diferentes estilos.

**Ejemplo:**
```tsx
import { 
  Loading, 
  LogoSpinner, 
  Spinner,
  Skeleton,
  TableSkeleton,
  CardSkeleton 
} from '@/components/ui'

// Loading completo
<Loading text="Cargando..." />

// Logo spinner (con rotación aleatoria)
<LogoSpinner size="lg" />

// Spinner simple
<Spinner size="md" color="primary" />

// Skeletons
<Skeleton height={20} />
<TableSkeleton rows={5} columns={4} />
<CardSkeleton />
```

---

### EmptyState
**Archivo:** `src/components/ui/EmptyState.tsx`

Estados vacíos con ilustraciones.

**Variantes predefinidas:**
- `NoDataState`: Sin datos
- `NoResultsState`: Sin resultados de búsqueda
- `NoPermissionState`: Sin permisos
- `ErrorState`: Error general

**Ejemplo:**
```tsx
import { 
  EmptyState,
  NoDataState,
  NoResultsState,
  NoPermissionState 
} from '@/components/ui'

// Custom empty state
<EmptyState
  icon={<UsersIcon />}
  title="No hay usuarios"
  description="Crea tu primer usuario para comenzar"
  action={
    <Button onClick={() => navigate('/users/new')}>
      Crear Usuario
    </Button>
  }
/>

// Predefinidos
<NoDataState resource="usuarios" onCreate={() => {}} />
<NoResultsState onClear={clearFilters} />
<NoPermissionState />
```

---

### Avatar
**Archivo:** `src/components/ui/Avatar.tsx`

Avatares de usuario con grupos.

**Ejemplo:**
```tsx
import { Avatar, AvatarGroup } from '@/components/ui'

// Avatar simple
<Avatar
  src="/images/user.jpg"
  alt="Juan Pérez"
  size="md"
/>

// Avatar con iniciales
<Avatar
  name="Juan Pérez"
  size="lg"
/>

// Avatar con status
<Avatar
  src="/images/user.jpg"
  status="online" // online, offline, away, busy
  size="md"
/>

// Grupo de avatares
<AvatarGroup max={3}>
  <Avatar src="/user1.jpg" />
  <Avatar src="/user2.jpg" />
  <Avatar src="/user3.jpg" />
  <Avatar src="/user4.jpg" />
  <Avatar src="/user5.jpg" />
</AvatarGroup>
```

---

### Badge
**Archivo:** `src/components/ui/Badge.tsx`

Insignias e indicadores.

**Ejemplo:**
```tsx
import { Badge } from '@/components/ui'

<Badge variant="success">Activo</Badge>
<Badge variant="error">Inactivo</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="info">Nuevo</Badge>

// Con punto
<Badge dot variant="success">En línea</Badge>

// Pill style
<Badge pill>Beta</Badge>

// Con remove
<Badge onRemove={handleRemove}>Tag</Badge>
```

---

## 🎯 Componentes Avanzados

### Scheduler
**Archivo:** `src/components/ui/Scheduler.tsx`

Calendario de citas y eventos.

**Ejemplo:**
```tsx
import { Scheduler } from '@/components/ui'

const appointments = [
  {
    id: '1',
    title: 'Reunión con Cliente',
    start: new Date(2025, 10, 18, 10, 0),
    end: new Date(2025, 10, 18, 11, 0),
    status: 'confirmed',
    attendees: ['Juan', 'María'],
  },
]

<Scheduler
  appointments={appointments}
  viewMode="week" // day, week, month
  onAppointmentClick={handleClick}
  onSlotClick={handleNewAppointment}
  businessHours={{ start: 9, end: 18 }}
  slotDuration={30}
/>
```

---

### Stepper
**Archivo:** `src/components/ui/Stepper.tsx`

Pasos de proceso con validación.

**Ejemplo:**
```tsx
import { Stepper, useStepper } from '@/components/ui'

const steps = [
  { id: 'info', label: 'Información', optional: false },
  { id: 'address', label: 'Dirección', optional: true },
  { id: 'payment', label: 'Pago', optional: false },
  { id: 'confirm', label: 'Confirmar', optional: false },
]

function CheckoutFlow() {
  const { 
    currentStep, 
    goToNext, 
    goToPrevious, 
    goToStep,
    isLastStep 
  } = useStepper(steps, 0)
  
  return (
    <div>
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={goToStep}
      />
      
      <div className="p-6">
        {currentStep === 0 && <PersonalInfo />}
        {currentStep === 1 && <Address />}
        {currentStep === 2 && <Payment />}
        {currentStep === 3 && <Confirmation />}
      </div>
      
      <div className="flex justify-between">
        <Button onClick={goToPrevious} disabled={currentStep === 0}>
          Anterior
        </Button>
        <Button onClick={goToNext}>
          {isLastStep ? 'Finalizar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  )
}
```

---

## 🎨 Mejores Prácticas

### 1. **Importación Centralizada**
```tsx
// ✅ Bueno
import { Button, Input, Card, Modal } from '@/components/ui'

// ❌ Malo
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
```

### 2. **Composición de Componentes**
```tsx
// ✅ Bueno - Componentes composables
<Card>
  <CardHeader title="Usuarios" />
  <DataTable data={users} />
  <CardFooter>
    <Button>Ver Más</Button>
  </CardFooter>
</Card>

// ❌ Malo - Todo en props
<Card 
  title="Usuarios" 
  content={<DataTable />} 
  footer={<Button>Ver Más</Button>}
/>
```

### 3. **Type Safety**
```tsx
// ✅ Bueno - Props tipadas
interface UserFormProps {
  onSubmit: (data: User) => void
  initialValues?: Partial<User>
}

// ❌ Malo - Props sin tipar
function UserForm({ onSubmit, initialValues }: any) {}
```

### 4. **Accesibilidad**
```tsx
// ✅ Bueno - Accesible
<Button aria-label="Cerrar modal" onClick={onClose}>
  <XMarkIcon />
</Button>

// ❌ Malo - Sin label
<Button onClick={onClose}>
  <XMarkIcon />
</Button>
```

---

## 📚 Recursos Adicionales

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Heroicons](https://heroicons.com)
- [React Hook Form](https://react-hook-form.com)
- [Headless UI](https://headlessui.com)

---

**Última actualización:** 18 de Noviembre, 2025
