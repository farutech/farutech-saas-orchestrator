# DataTable Component

Componente de tabla de datos completo, moderno y fácil de usar para React + TypeScript.

## 🎯 Características

- ✅ **Paginación integrada** - Control completo de paginación client-side o server-side
- ✅ **Ordenamiento** - Click en headers para ordenar columnas
- ✅ **Búsqueda** - Input de búsqueda integrado
- ✅ **Selección múltiple** - Checkboxes para seleccionar filas
- ✅ **Responsive** - Vista de cards automática en móviles
- ✅ **Acciones por fila** - Ver, editar, eliminar y acciones personalizadas
- ✅ **Estados** - Loading y empty states incluidos
- ✅ **TypeScript** - Completamente tipado con JSDoc
- ✅ **Accesible** - ARIA labels y keyboard navigation

## 📦 Instalación

El componente ya está disponible en el proyecto. Simplemente impórtalo:

```tsx
import { DataTable } from '@/components/ui/DataTable'
import type { DataTableProps, DataTablePagination, DataTableActions } from '@/components/ui/DataTable'
```

## 🚀 Uso Básico

### Ejemplo 1: Tabla simple

```tsx
import { DataTable } from '@/components/ui/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface User {
  id: number
  name: string
  email: string
  role: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    enableSorting: true, // Habilitar ordenamiento
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: 'Rol',
  },
]

const users: User[] = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'User' },
]

function MyComponent() {
  return <DataTable data={users} columns={columns} />
}
```

### Ejemplo 2: Con paginación

```tsx
import { useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'

function MyComponent() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  
  // Simular datos paginados
  const totalUsers = 100
  const users = generateUsers(page, perPage) // Tu función para obtener datos

  return (
    <DataTable
      data={users}
      columns={columns}
      pagination={{
        page,
        perPage,
        total: totalUsers,
        onPageChange: setPage,
        onPerPageChange: setPerPage,
      }}
    />
  )
}
```

### Ejemplo 3: Con búsqueda

```tsx
import { useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filtrar datos localmente
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DataTable
      data={filteredUsers}
      columns={columns}
      searchable
      searchPlaceholder="Buscar usuarios..."
      searchValue={searchTerm}
      onSearch={setSearchTerm}
    />
  )
}
```

### Ejemplo 4: Con acciones

```tsx
import { DataTable } from '@/components/ui/DataTable'
import type { DataTableActions } from '@/components/ui/DataTable'
import { notify } from '@/store/notificationStore'

function MyComponent() {
  const actions: DataTableActions<User> = {
    onView: (user) => {
      console.log('Ver', user)
      notify.info('Usuario', `Viendo detalles de ${user.name}`)
    },
    onEdit: (user) => {
      console.log('Editar', user)
      // Abrir modal de edición
    },
    onDelete: (user) => {
      if (confirm(`¿Eliminar a ${user.name}?`)) {
        // Llamar API para eliminar
        console.log('Eliminar', user)
      }
    },
  }

  return (
    <DataTable
      data={users}
      columns={columns}
      actions={actions}
    />
  )
}
```

### Ejemplo 5: Con selección múltiple

```tsx
import { useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { TrashIcon } from '@heroicons/react/24/outline'

function MyComponent() {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const handleBulkDelete = () => {
    if (selected.size === 0) return
    console.log('Eliminar seleccionados:', Array.from(selected))
    setSelected(new Set())
  }

  return (
    <>
      {selected.size > 0 && (
        <div className="mb-4">
          <Button
            variant="danger"
            icon={<TrashIcon className="h-5 w-5" />}
            onClick={handleBulkDelete}
          >
            Eliminar {selected.size} seleccionados
          </Button>
        </div>
      )}
      
      <DataTable
        data={users}
        columns={columns}
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
      />
    </>
  )
}
```

### Ejemplo 6: Completo (Server-side con API)

```tsx
import { useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { useCrud } from '@/hooks/useCrud'

function UsersPage() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())

  // Hook para operaciones CRUD
  const userCrud = useCrud<User>({ endpoint: '/users', queryKey: 'users' })
  const { data, isLoading } = userCrud.useList({ page, perPage, search })
  const deleteMutation = userCrud.useDelete()

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'name', header: 'Nombre', enableSorting: true },
    { accessorKey: 'email', header: 'Email', enableSorting: true },
    { accessorKey: 'role', header: 'Rol' },
    { accessorKey: 'createdAt', header: 'Fecha de Creación', enableSorting: true },
  ]

  const actions: DataTableActions<User> = {
    onView: (user) => {
      // Navegar a detalles
      navigate(`/users/${user.id}`)
    },
    onEdit: (user) => {
      // Abrir modal de edición
      setCurrentUser(user)
      setIsEditModalOpen(true)
    },
    onDelete: (user) => {
      if (confirm(`¿Eliminar a ${user.name}?`)) {
        deleteMutation.mutate(user.id)
      }
    },
  }

  return (
    <div>
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No se encontraron usuarios"
        pagination={{
          page,
          perPage,
          total: data?.total || 0,
          totalPages: data?.totalPages,
          onPageChange: setPage,
          onPerPageChange: setPerPage,
        }}
        searchable
        searchPlaceholder="Buscar usuarios por nombre o email..."
        searchValue={search}
        onSearch={setSearch}
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
        actions={actions}
        onRowClick={(user) => console.log('Click en fila:', user)}
      />
    </div>
  )
}
```

## 📋 Props API

### DataTable Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `data` | `T[]` | **requerido** | Array de datos a mostrar. Cada item debe tener un `id` |
| `columns` | `ColumnDef<T>[]` | **requerido** | Definición de columnas (TanStack Table) |
| `isLoading` | `boolean` | `false` | Mostrar estado de carga con skeleton |
| `emptyMessage` | `string` | `'No hay datos disponibles'` | Mensaje cuando no hay datos |
| `pagination` | `DataTablePagination` | `undefined` | Configuración de paginación |
| `searchable` | `boolean` | `false` | Habilitar búsqueda |
| `searchPlaceholder` | `string` | `'Buscar...'` | Placeholder del input de búsqueda |
| `searchValue` | `string` | `undefined` | Valor de búsqueda (controlado) |
| `onSearch` | `(value: string) => void` | `undefined` | Callback al buscar |
| `selectable` | `boolean` | `false` | Habilitar selección múltiple |
| `selectedRows` | `Set<string \| number>` | `new Set()` | Filas seleccionadas (IDs) |
| `onSelectionChange` | `(selected: Set) => void` | `undefined` | Callback al cambiar selección |
| `actions` | `DataTableActions<T>` | `undefined` | Configuración de acciones por fila |
| `onRowClick` | `(row: T) => void` | `undefined` | Callback al hacer click en una fila |
| `responsiveCards` | `boolean` | `true` | Vista de cards en mobile |
| `className` | `string` | `undefined` | Clase CSS adicional |
| `wrapped` | `boolean` | `true` | Envolver en componente Card |

### DataTablePagination

```typescript
interface DataTablePagination {
  page: number                           // Página actual (1-based)
  perPage: number                        // Items por página
  total: number                          // Total de items
  totalPages?: number                    // Total de páginas (calculado si se omite)
  onPageChange: (page: number) => void   // Callback al cambiar página
  onPerPageChange?: (perPage: number) => void  // Callback al cambiar items por página
}
```

### DataTableActions

```typescript
interface DataTableActions<T> {
  onView?: (row: T) => void              // Ver detalles
  onEdit?: (row: T) => void              // Editar
  onDelete?: (row: T) => void            // Eliminar
  onDuplicate?: (row: T) => void         // Duplicar
  custom?: Array<{                       // Acciones personalizadas
    label: string
    icon?: ReactNode
    onClick: (row: T) => void
    variant?: 'default' | 'danger'
    show?: (row: T) => boolean
  }>
}
```

## 🎨 Columnas Personalizadas

Puedes personalizar las columnas usando TanStack Table:

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
        {row.original.role}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const isActive = row.original.status === 'active'
      return (
        <span className={isActive ? 'text-green-600' : 'text-red-600'}>
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  },
]
```

## 🔍 Búsqueda

### Client-side (búsqueda local)

```tsx
const [search, setSearch] = useState('')

// Filtrar datos localmente
const filteredData = data.filter((item) =>
  Object.values(item).some((value) =>
    String(value).toLowerCase().includes(search.toLowerCase())
  )
)

<DataTable
  data={filteredData}
  columns={columns}
  searchable
  onSearch={setSearch}
/>
```

### Server-side (búsqueda en API)

```tsx
const [search, setSearch] = useState('')
const { data, isLoading } = useApiQuery({
  url: '/users',
  params: { search }, // Enviar al backend
})

<DataTable
  data={data?.data || []}
  columns={columns}
  isLoading={isLoading}
  searchable
  searchValue={search}
  onSearch={setSearch}
/>
```

## 📱 Responsive

Por defecto, `DataTable` es completamente responsive:

- **Desktop (md+)**: Tabla tradicional
- **Mobile (<md)**: Cards con toda la información

Para desactivar la vista de cards:

```tsx
<DataTable
  data={users}
  columns={columns}
  responsiveCards={false}
/>
```

## 🎭 Estados

### Loading

```tsx
<DataTable
  data={[]}
  columns={columns}
  isLoading={true}
/>
```

### Empty

```tsx
<DataTable
  data={[]}
  columns={columns}
  emptyMessage="No se encontraron resultados para tu búsqueda"
/>
```

## 🔧 Troubleshooting

### Error: "Property 'id' does not exist"

Asegúrate de que tu tipo de datos tenga un campo `id`:

```tsx
interface MyData {
  id: number  // ✅ Requerido
  name: string
  // ...
}
```

### Paginación no funciona

Verifica que estás pasando el objeto `pagination` completo:

```tsx
// ❌ Incorrecto
<DataTable data={users} columns={columns} />

// ✅ Correcto
<DataTable
  data={users}
  columns={columns}
  pagination={{
    page,
    perPage,
    total,
    onPageChange: setPage,
    onPerPageChange: setPerPage,
  }}
/>
```

### Acciones no aparecen

Asegúrate de pasar el objeto `actions`:

```tsx
// ❌ Incorrecto
<DataTable data={users} columns={columns} />

// ✅ Correcto
<DataTable
  data={users}
  columns={columns}
  actions={{
    onEdit: (row) => console.log('Edit', row),
    onDelete: (row) => console.log('Delete', row),
  }}
/>
```

## 🎓 Tips para Principiantes

1. **Empieza simple**: Usa primero solo `data` y `columns`
2. **Agrega features gradualmente**: Paginación → Búsqueda → Acciones
3. **Usa TypeScript**: Los tipos te guiarán sobre qué props necesitas
4. **Revisa los ejemplos**: Copia y adapta los ejemplos de arriba
5. **Console.log**: Usa console.log en los callbacks para debuggear

## 📚 Recursos

- [TanStack Table Docs](https://tanstack.com/table/v8/docs/guide/introduction)
- [Proyecto ejemplo en /src/pages/users/UsersPage.tsx](../pages/users/UsersPage.tsx)
- [Demo en /src/pages/components/ComponentsPage.tsx](../pages/components/ComponentsPage.tsx)

## 🤝 Soporte

Si tienes dudas:
1. Revisa los ejemplos en este README
2. Mira los componentes de ejemplo en el proyecto
3. Consulta la documentación de TanStack Table
4. Pregunta al equipo senior

---

**Hecho con ❤️ por el equipo de FaruTech**
