# 🎣 Custom Hooks - Referencia Completa

## 📋 Catálogo de Hooks

Los hooks personalizados están organizados por funcionalidad:

```
src/hooks/
├── 🔐 Autenticación (useAuth)
├── 🌐 API y Datos (useApi, useCrud)
├── 🎨 UI y Estado (useMenu, useGlobalLoading)
├── ⚙️ Procesos (useProcess)
└── 📊 Tablas (useDataTableState)
```

---

## 🔐 useAuth

**Archivo:** `src/hooks/useAuth.ts`

Hook principal para gestión de autenticación.

### Características
- ✅ Login/Logout
- ✅ Registro de usuarios
- ✅ Refresh token automático
- ✅ Gestión de sesión
- ✅ Modo demo integrado
- ✅ Remember me (localStorage vs sessionStorage)

### API

```tsx
interface UseAuthReturn {
  // Estado
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Mutaciones
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  
  // Utilidades
  refreshToken: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  permissions?: string[]
}
```

### Ejemplo de Uso

```tsx
import { useAuth } from '@/hooks/useAuth'
import { Button, Input, Form } from '@/components/ui'

function LoginPage() {
  const { login, isLoading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password, rememberMe: true })
      // Usuario autenticado, redirigir
      navigate('/dashboard')
    } catch (error) {
      toast.error('Credenciales inválidas')
    }
  }
  
  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        label="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" loading={isLoading}>
        Iniciar Sesión
      </Button>
    </Form>
  )
}

function ProfileDropdown() {
  const { user, logout } = useAuth()
  
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar src={user?.avatar} name={user?.name} />
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={() => navigate('/profile')}>
          Perfil
        </Dropdown.Item>
        <Dropdown.Item onClick={logout}>
          Cerrar Sesión
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  )
}
```

### Integración con React Query

```tsx
// El hook usa React Query internamente
const { data: user, isLoading } = useQuery({
  queryKey: ['auth', 'user'],
  queryFn: fetchCurrentUser,
  staleTime: 5 * 60 * 1000, // 5 minutos
})
```

### Modo Demo

```tsx
// Para desarrollo, puedes usar el modo demo
// Configurado en api.config.ts
const { login } = useAuth()

// Login demo (no requiere backend)
await login({
  email: 'admin@example.com',
  password: 'password'
})

// Usuario demo es retornado automáticamente
```

---

## 🌐 useApi

**Archivo:** `src/hooks/useApi.ts`

Hook para realizar peticiones HTTP con React Query.

### Características
- ✅ GET, POST, PUT, PATCH, DELETE
- ✅ Caché automático
- ✅ Revalidación en background
- ✅ Retry automático
- ✅ Loading/Error states
- ✅ Optimistic updates
- ✅ CSRF protection

### API

```tsx
interface UseApiReturn<T> {
  // GET request
  useGet: (key: QueryKey, url: string, options?: UseQueryOptions) => UseQueryResult<T>
  
  // POST/PUT/PATCH/DELETE requests
  usePost: (url: string, options?: UseMutationOptions) => UseMutationResult
  usePut: (url: string, options?: UseMutationOptions) => UseMutationResult
  usePatch: (url: string, options?: UseMutationOptions) => UseMutationResult
  useDelete: (url: string, options?: UseMutationOptions) => UseMutationResult
}
```

### Ejemplo de Uso

```tsx
import { useApi } from '@/hooks/useApi'

function UsersList() {
  const api = useApi()
  
  // GET request
  const { 
    data: users, 
    isLoading, 
    error, 
    refetch 
  } = api.useGet(['users'], '/api/users')
  
  // POST request
  const createUser = api.usePost('/api/users', {
    onSuccess: () => {
      toast.success('Usuario creado')
      refetch() // Re-fetch users list
    },
    onError: (error) => {
      toast.error('Error al crear usuario')
    }
  })
  
  const handleCreate = async (data: User) => {
    await createUser.mutateAsync(data)
  }
  
  if (isLoading) return <Loading />
  if (error) return <ErrorState error={error} />
  
  return (
    <div>
      <Button onClick={() => setShowForm(true)}>
        Nuevo Usuario
      </Button>
      <DataTable data={users} columns={columns} />
    </div>
  )
}
```

### Con Paginación

```tsx
function PaginatedList() {
  const [page, setPage] = useState(1)
  const api = useApi()
  
  const { data, isLoading } = api.useGet(
    ['users', { page }],
    `/api/users?page=${page}&limit=10`
  )
  
  return (
    <div>
      <DataTable data={data?.items} />
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
```

### Optimistic Updates

```tsx
function TodoList() {
  const api = useApi()
  const queryClient = useQueryClient()
  
  const updateTodo = api.usePatch('/api/todos/:id', {
    // Optimistic update
    onMutate: async (newTodo) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries(['todos'])
      
      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(['todos'])
      
      // Optimistically update
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.map(todo => todo.id === newTodo.id ? newTodo : todo)
      )
      
      return { previousTodos }
    },
    
    // Rollback on error
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos)
    },
    
    // Refetch on success
    onSettled: () => {
      queryClient.invalidateQueries(['todos'])
    }
  })
  
  return <TodoItem onUpdate={updateTodo.mutate} />
}
```

---

## 🌐 useCrud

**Archivo:** `src/hooks/useCrud.ts`

Hook para operaciones CRUD genéricas.

### Características
- ✅ Create, Read, Update, Delete
- ✅ List con paginación
- ✅ Search y filtros
- ✅ Sorting
- ✅ Caché inteligente
- ✅ Loading states

### API

```tsx
interface UseCrudReturn<T> {
  // Queries
  items: T[]
  item: T | null
  isLoading: boolean
  error: Error | null
  
  // Mutations
  create: (data: Partial<T>) => Promise<T>
  update: (id: string, data: Partial<T>) => Promise<T>
  remove: (id: string) => Promise<void>
  
  // Utilities
  refetch: () => void
  setFilters: (filters: Record<string, any>) => void
  setPage: (page: number) => void
  setSort: (field: string, direction: 'asc' | 'desc') => void
}
```

### Ejemplo de Uso

```tsx
import { useCrud } from '@/hooks/useCrud'

interface User {
  id: string
  name: string
  email: string
  role: string
}

function UsersManager() {
  const {
    items: users,
    isLoading,
    create,
    update,
    remove,
    setFilters,
  } = useCrud<User>('/api/users')
  
  const handleCreate = async (data: Partial<User>) => {
    await create(data)
    toast.success('Usuario creado')
  }
  
  const handleUpdate = async (id: string, data: Partial<User>) => {
    await update(id, data)
    toast.success('Usuario actualizado')
  }
  
  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar usuario?')) {
      await remove(id)
      toast.success('Usuario eliminado')
    }
  }
  
  return (
    <div>
      <Input
        placeholder="Buscar..."
        onChange={(e) => setFilters({ search: e.target.value })}
      />
      
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          data={users}
          columns={[
            { key: 'name', label: 'Nombre' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Rol' },
          ]}
          actions={[
            {
              label: 'Editar',
              onClick: (user) => handleUpdate(user.id, { /* data */ })
            },
            {
              label: 'Eliminar',
              onClick: (user) => handleDelete(user.id),
              variant: 'danger'
            }
          ]}
        />
      )}
    </div>
  )
}
```

### Con Filtros y Sorting

```tsx
function AdvancedList() {
  const {
    items,
    setFilters,
    setSort,
    setPage,
  } = useCrud('/api/products')
  
  return (
    <div>
      <Filters>
        <Select
          label="Categoría"
          options={categories}
          onChange={(value) => setFilters({ category: value })}
        />
        <Select
          label="Estado"
          options={statusOptions}
          onChange={(value) => setFilters({ status: value })}
        />
      </Filters>
      
      <DataTable
        data={items}
        onSort={(field, direction) => setSort(field, direction)}
        onPageChange={setPage}
      />
    </div>
  )
}
```

---

## 🎨 useMenu

**Archivo:** `src/hooks/useMenu.ts`

Hook para gestión de menús dinámicos con caché.

### Características
- ✅ Menús basados en módulo activo
- ✅ Caché de 5 minutos
- ✅ Filtrado por permisos
- ✅ Soporte para menús del servidor
- ✅ Fallback a menú local

### API

```tsx
interface UseMenuReturn {
  menu: MenuEntry[]
  isLoading: boolean
  refetch: () => void
}

interface MenuEntry {
  name: string
  href?: string
  icon?: React.ComponentType
  badge?: number
  items?: MenuEntry[] // Para categorías
}
```

### Ejemplo de Uso

```tsx
import { useMenu } from '@/hooks/useMenu'
import { Sidebar } from '@/components/layout'

function AppSidebar() {
  const { menu, isLoading } = useMenu()
  
  if (isLoading) return <Skeleton />
  
  return (
    <Sidebar>
      {menu.map((item) => (
        <SidebarItem key={item.name} {...item} />
      ))}
    </Sidebar>
  )
}
```

### Con Permisos

```tsx
// El menú se filtra automáticamente por permisos
const { menu } = useMenu()

// Solo muestra items que el usuario puede ver
// Basado en user.permissions del authStore
```

---

## 🎨 useMenuCache

**Archivo:** `src/hooks/useMenuCache.ts`

Hook para caché de menús por módulo.

### Características
- ✅ Caché en memoria (Map)
- ✅ TTL de 5 minutos
- ✅ Invalidación manual
- ✅ Limpieza automática de expirados

### API

```tsx
interface UseMenuCacheReturn {
  getMenu: (moduleId: string, fallback: Function) => MenuEntry[]
  invalidateCache: (moduleId?: string) => void
  clearCache: () => void
}
```

### Ejemplo de Uso

```tsx
import { useMenuCache } from '@/hooks/useMenuCache'
import { getMenuForModule } from '@/config/menu.config'

function useMenu() {
  const { currentModule } = useModuleStore()
  const { getMenu, invalidateCache } = useMenuCache()
  
  // Obtener menú con caché
  const menu = getMenu(currentModule, getMenuForModule)
  
  // Invalidar caché cuando cambia módulo
  useEffect(() => {
    return () => invalidateCache(currentModule)
  }, [currentModule])
  
  return { menu }
}
```

---

## ⚙️ useProcess

**Archivo:** `src/hooks/useProcess.ts`

Hook para ejecutar procesos en background.

### Características
- ✅ Ejecución asíncrona
- ✅ Progress tracking
- ✅ Pause/Resume
- ✅ Logs en tiempo real
- ✅ Manejo de errores

### API

```tsx
interface UseProcessReturn {
  execute: (processId: string, params?: any) => Promise<void>
  pause: () => void
  resume: () => void
  cancel: () => void
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error'
  progress: number
  logs: string[]
}
```

### Ejemplo de Uso

```tsx
import { useProcess } from '@/hooks/useProcess'

function DataImporter() {
  const {
    execute,
    status,
    progress,
    logs,
    cancel
  } = useProcess()
  
  const handleImport = async () => {
    try {
      await execute('import-users', { file: selectedFile })
      toast.success('Importación completada')
    } catch (error) {
      toast.error('Error en importación')
    }
  }
  
  return (
    <div>
      <Button onClick={handleImport} disabled={status === 'running'}>
        Importar Datos
      </Button>
      
      {status === 'running' && (
        <div>
          <ProgressBar value={progress} />
          <div className="logs">
            {logs.map((log, i) => (
              <p key={i}>{log}</p>
            ))}
          </div>
          <Button onClick={cancel} variant="danger">
            Cancelar
          </Button>
        </div>
      )}
    </div>
  )
}
```

---

## 📊 useDataTableState

**Archivo:** `src/hooks/useDataTableState.ts`

Hook para gestionar estado de DataTable.

### Características
- ✅ Paginación
- ✅ Sorting
- ✅ Filtros
- ✅ Búsqueda
- ✅ Selección
- ✅ Persistencia en URL

### API

```tsx
interface UseDataTableStateReturn {
  // Paginación
  page: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  
  // Sorting
  sortBy: string | null
  sortDirection: 'asc' | 'desc'
  setSort: (field: string) => void
  
  // Filtros
  filters: Record<string, any>
  setFilters: (filters: Record<string, any>) => void
  
  // Búsqueda
  search: string
  setSearch: (query: string) => void
  
  // Selección
  selected: Set<string>
  toggleSelection: (id: string) => void
  selectAll: () => void
  clearSelection: () => void
}
```

### Ejemplo de Uso

```tsx
import { useDataTableState } from '@/hooks/useDataTableState'

function ProductsTable() {
  const {
    page,
    pageSize,
    sortBy,
    sortDirection,
    filters,
    search,
    selected,
    setPage,
    setSort,
    setFilters,
    setSearch,
    toggleSelection,
  } = useDataTableState()
  
  // Fetch data con estado de la tabla
  const { data } = useQuery(['products', {
    page,
    pageSize,
    sortBy,
    sortDirection,
    filters,
    search
  }], fetchProducts)
  
  return (
    <div>
      <Input
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <DataTable
        data={data?.items}
        columns={columns}
        page={page}
        pageSize={pageSize}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onPageChange={setPage}
        onSort={(field) => setSort(field)}
        selected={selected}
        onSelectionChange={toggleSelection}
      />
    </div>
  )
}
```

---

## 🎨 useGlobalLoading

**Archivo:** `src/components/ui/GlobalLoading.tsx`

Hook para controlar el loading global.

### API

```tsx
interface UseGlobalLoadingReturn {
  show: () => void
  hide: () => void
  isVisible: boolean
}
```

### Ejemplo de Uso

```tsx
import { useGlobalLoading } from '@/components/ui'

function DataExporter() {
  const loading = useGlobalLoading()
  
  const handleExport = async () => {
    loading.show()
    try {
      await exportData()
      toast.success('Exportación completa')
    } finally {
      loading.hide()
    }
  }
  
  return (
    <Button onClick={handleExport}>
      Exportar Datos
    </Button>
  )
}
```

---

## 🎯 Mejores Prácticas

### 1. **Composición de Hooks**

```tsx
// ✅ Bueno - Hooks componibles
function useUserManagement() {
  const { items: users, create, update, remove } = useCrud('/api/users')
  const { user: currentUser } = useAuth()
  
  const canEdit = (user: User) => {
    return currentUser?.role === 'admin' || currentUser?.id === user.id
  }
  
  return { users, create, update, remove, canEdit }
}

// Usar en componente
function UsersPage() {
  const { users, canEdit, update } = useUserManagement()
  // ...
}
```

### 2. **Memoization**

```tsx
// ✅ Bueno - Memoizar valores costosos
function useFilteredUsers() {
  const { items: users } = useCrud('/api/users')
  const [filters, setFilters] = useState({})
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Filtrado complejo...
    })
  }, [users, filters])
  
  return { filteredUsers, setFilters }
}
```

### 3. **Cleanup**

```tsx
// ✅ Bueno - Limpiar efectos
function useAutoSave(data: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      saveData(data)
    }, 1000)
    
    // Cleanup
    return () => clearTimeout(timer)
  }, [data])
}
```

### 4. **Error Handling**

```tsx
// ✅ Bueno - Manejo de errores
function useDataWithErrorHandling() {
  const { data, error, isLoading } = useQuery(...)
  
  useEffect(() => {
    if (error) {
      toast.error('Error al cargar datos')
      console.error(error)
    }
  }, [error])
  
  return { data, isLoading }
}
```

---

## 📚 Recursos Adicionales

- [React Query Docs](https://tanstack.com/query/latest)
- [React Hooks Docs](https://react.dev/reference/react)
- [Custom Hooks Patterns](https://usehooks.com)

---

**Última actualización:** 18 de Noviembre, 2025
