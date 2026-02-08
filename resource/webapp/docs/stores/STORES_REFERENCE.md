# 🗄️ State Management - Zustand Stores

## 📋 Catálogo de Stores

Los stores globales están organizados por dominio:

```
src/store/
├── 🔐 authStore.ts         # Autenticación y sesión
├── 🎨 themeStore.ts         # Tema y preferencias visuales
├── 📱 sidebarStore.ts       # Estado del sidebar
├── 🔍 searchStore.ts        # Búsqueda global
├── 🔔 notificationStore.ts  # Notificaciones
├── 🧩 moduleStore.ts        # Módulos activos
└── 🌐 localeStore.ts        # Internacionalización
```

---

## 🔐 authStore

**Archivo:** `src/store/authStore.ts`

Store para gestión de autenticación y tokens.

### Características
- ✅ Access token y refresh token
- ✅ Persistencia en localStorage/sessionStorage
- ✅ Remember me functionality
- ✅ Automatic token cleanup
- ✅ Dual storage strategy

### Estado

```tsx
interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  rememberMe: boolean
  
  setTokens: (accessToken: string, refreshToken: string, remember?: boolean) => void
  setAccessToken: (token: string | null) => void
  clearAuth: () => void
}
```

### Uso

```tsx
import { useAuthStore } from '@/store/authStore'

function useLogin() {
  const { setTokens, clearAuth } = useAuthStore()
  
  const login = async (credentials: LoginCredentials) => {
    const { accessToken, refreshToken } = await api.post('/auth/login', credentials)
    
    // Guardar tokens con remember me
    setTokens(accessToken, refreshToken, credentials.rememberMe)
  }
  
  const logout = () => {
    clearAuth()
    navigate('/login')
  }
  
  return { login, logout }
}

// Acceder al token en cualquier lugar
function ApiClient() {
  const { accessToken } = useAuthStore()
  
  const headers = {
    Authorization: `Bearer ${accessToken}`
  }
  
  return axios.create({ headers })
}
```

### Storage Strategy

```tsx
// Remember me = true → localStorage (persiste entre sesiones)
// Remember me = false → sessionStorage (se borra al cerrar navegador)

// Configuración automática basada en rememberMe flag
setTokens(token, refresh, true)  // localStorage
setTokens(token, refresh, false) // sessionStorage
```

---

## 🎨 themeStore

**Archivo:** `src/store/themeStore.ts`

Store para tema y preferencias visuales.

### Características
- ✅ Light/Dark mode
- ✅ System theme detection
- ✅ Custom color schemes
- ✅ Persistencia en localStorage
- ✅ Smooth transitions

### Estado

```tsx
interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  colorScheme: ColorScheme
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
  setColorScheme: (scheme: ColorScheme) => void
}

interface ColorScheme {
  primary: string
  secondary: string
  accent: string
}
```

### Uso

```tsx
import { useThemeStore } from '@/store/themeStore'

function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useThemeStore()
  
  return (
    <div>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
      
      <Select
        value={theme}
        onChange={(value) => setTheme(value)}
        options={[
          { value: 'light', label: 'Claro' },
          { value: 'dark', label: 'Oscuro' },
          { value: 'system', label: 'Sistema' },
        ]}
      />
    </div>
  )
}

// Aplicar tema en el DOM
function App() {
  const { theme } = useThemeStore()
  
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.toggle('dark', systemTheme === 'dark')
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])
  
  return <AppContent />
}
```

### Custom Color Schemes

```tsx
function ColorSchemeSelector() {
  const { colorScheme, setColorScheme } = useThemeStore()
  
  const schemes = [
    { name: 'Blue', primary: '#3b82f6', secondary: '#8b5cf6' },
    { name: 'Green', primary: '#10b981', secondary: '#06b6d4' },
    { name: 'Purple', primary: '#8b5cf6', secondary: '#ec4899' },
  ]
  
  return (
    <div className="flex gap-2">
      {schemes.map(scheme => (
        <button
          key={scheme.name}
          onClick={() => setColorScheme(scheme)}
          className="w-8 h-8 rounded-full"
          style={{ background: scheme.primary }}
        />
      ))}
    </div>
  )
}
```

---

## 📱 sidebarStore

**Archivo:** `src/store/sidebarStore.ts`

Store para estado del sidebar.

### Características
- ✅ Open/Close state
- ✅ Mobile detection
- ✅ Persistent width
- ✅ Auto-collapse on mobile
- ✅ Overlay on mobile

### Estado

```tsx
interface SidebarState {
  isOpen: boolean
  isMobile: boolean
  width: number
  
  toggle: () => void
  open: () => void
  close: () => void
  setWidth: (width: number) => void
  setIsMobile: (mobile: boolean) => void
}
```

### Uso

```tsx
import { useSidebarStore } from '@/store/sidebarStore'

function Sidebar() {
  const { isOpen, isMobile, toggle, close } = useSidebarStore()
  
  return (
    <>
      {/* Overlay on mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={close}
        />
      )}
      
      {/* Sidebar */}
      <aside className={clsx(
        'fixed h-full bg-white dark:bg-gray-800',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        isMobile && 'z-50'
      )}>
        <nav>...</nav>
      </aside>
    </>
  )
}

function Navbar() {
  const { toggle, isMobile } = useSidebarStore()
  
  return (
    <header>
      {isMobile && (
        <button onClick={toggle}>
          <Bars3Icon />
        </button>
      )}
    </header>
  )
}

// Detect mobile on resize
function AppLayout() {
  const { setIsMobile } = useSidebarStore()
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return <MainLayout />
}
```

---

## 🔍 searchStore

**Archivo:** `src/store/searchStore.ts`

Store para búsqueda global.

### Características
- ✅ Global search state
- ✅ Recent searches
- ✅ Search results cache
- ✅ Debounced search
- ✅ Keyboard shortcuts

### Estado

```tsx
interface SearchState {
  query: string
  isOpen: boolean
  results: SearchResult[]
  recentSearches: string[]
  isLoading: boolean
  
  setQuery: (query: string) => void
  setResults: (results: SearchResult[]) => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  open: () => void
  close: () => void
}

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'user' | 'product' | 'order' | 'page'
  url: string
}
```

### Uso

```tsx
import { useSearchStore } from '@/store/searchStore'

function GlobalSearch() {
  const {
    query,
    isOpen,
    results,
    recentSearches,
    setQuery,
    addRecentSearch,
    open,
    close
  } = useSearchStore()
  
  // Debounced search
  const debouncedQuery = useDebounce(query, 300)
  
  useEffect(() => {
    if (debouncedQuery) {
      searchApi(debouncedQuery).then(setResults)
    }
  }, [debouncedQuery])
  
  const handleSelect = (result: SearchResult) => {
    addRecentSearch(query)
    navigate(result.url)
    close()
  }
  
  return (
    <CommandPalette
      isOpen={isOpen}
      onClose={close}
      placeholder="Buscar..."
      value={query}
      onChange={setQuery}
    >
      {results.length > 0 ? (
        results.map(result => (
          <CommandPalette.Item
            key={result.id}
            onClick={() => handleSelect(result)}
          >
            {result.title}
          </CommandPalette.Item>
        ))
      ) : (
        <div>
          <p>Búsquedas recientes:</p>
          {recentSearches.map(search => (
            <button onClick={() => setQuery(search)}>
              {search}
            </button>
          ))}
        </div>
      )}
    </CommandPalette>
  )
}

// Keyboard shortcut
function App() {
  const { open } = useSearchStore()
  
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
  
  return <AppContent />
}
```

---

## 🔔 notificationStore

**Archivo:** `src/store/notificationStore.ts`

Store para notificaciones del sistema.

### Características
- ✅ Push notifications
- ✅ In-app notifications
- ✅ Notification center
- ✅ Mark as read/unread
- ✅ Notification preferences

### Estado

```tsx
interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences
  
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  setPreferences: (prefs: NotificationPreferences) => void
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationPreferences {
  push: boolean
  email: boolean
  sound: boolean
  types: {
    system: boolean
    orders: boolean
    users: boolean
    messages: boolean
  }
}
```

### Uso

```tsx
import { useNotificationStore } from '@/store/notificationStore'

function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification
  } = useNotificationStore()
  
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button className="relative">
          <BellIcon />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1">
              {unreadCount}
            </Badge>
          )}
        </button>
      </Dropdown.Trigger>
      
      <Dropdown.Content className="w-80">
        <div className="flex justify-between p-2">
          <h3>Notificaciones</h3>
          <Button size="sm" variant="ghost" onClick={markAllAsRead}>
            Marcar todo como leído
          </Button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.map(notif => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
            />
          ))}
        </div>
      </Dropdown.Content>
    </Dropdown>
  )
}

// Agregar notificación
function OrderCreated() {
  const { addNotification } = useNotificationStore()
  
  const handleCreateOrder = async () => {
    const order = await createOrder()
    
    addNotification({
      id: crypto.randomUUID(),
      title: 'Orden Creada',
      message: `Orden #${order.id} creada exitosamente`,
      type: 'success',
      timestamp: new Date(),
      read: false,
      action: {
        label: 'Ver Orden',
        onClick: () => navigate(`/orders/${order.id}`)
      }
    })
  }
}
```

---

## 🧩 moduleStore

**Archivo:** `src/store/moduleStore.ts`

Store para gestión de módulos del sistema.

### Características
- ✅ Current active module
- ✅ Available modules list
- ✅ Module switching
- ✅ Module metadata (icons, descriptions)
- ✅ Persistent selection

### Estado

```tsx
interface ModuleStore {
  currentModule: string
  modules: Module[]
  
  setCurrentModule: (moduleId: string) => void
  addModule: (module: Module) => void
  removeModule: (moduleId: string) => void
  getCurrentModule: () => Module | undefined
}

interface Module {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  badge?: number
}
```

### Uso

```tsx
import { useModuleStore } from '@/store/moduleStore'

function ModuleSwitcher() {
  const { modules, currentModule, setCurrentModule } = useModuleStore()
  
  return (
    <Select
      value={currentModule}
      onChange={setCurrentModule}
      options={modules.map(m => ({
        value: m.id,
        label: m.name,
        icon: m.icon
      }))}
    />
  )
}

function Sidebar() {
  const { currentModule } = useModuleStore()
  const { menu } = useMenu() // Menu basado en módulo activo
  
  return (
    <aside>
      {/* Menú cambia según módulo activo */}
      {menu.map(item => (
        <NavItem key={item.name} {...item} />
      ))}
    </aside>
  )
}

// Navegación al cambiar módulo
function handleModuleChange(moduleId: string) {
  setCurrentModule(moduleId)
  
  const routes = {
    dashboard: '/dashboard',
    crm: '/crm/dashboard',
    ventas: '/ventas/dashboard',
    inventario: '/inventario/dashboard',
  }
  
  navigate(routes[moduleId] || '/dashboard')
}
```

**IMPORTANTE:** El módulo activo NO debe cambiar automáticamente basándose en la URL. Solo debe cambiar cuando el usuario hace clic explícitamente en el ModuleSwitcher. Ver [MODULE_STABILITY_FIX.md](../MODULE_STABILITY_FIX.md) para más detalles.

---

## 🌐 localeStore

**Archivo:** `src/store/localeStore.ts`

Store para internacionalización (i18n).

### Características
- ✅ Multiple languages
- ✅ Date/number formatting
- ✅ RTL support
- ✅ Language persistence
- ✅ Translation keys

### Estado

```tsx
interface LocaleState {
  locale: string
  availableLocales: Locale[]
  translations: Record<string, string>
  
  setLocale: (locale: string) => void
  t: (key: string, params?: Record<string, any>) => string
  formatDate: (date: Date) => string
  formatNumber: (num: number) => string
}

interface Locale {
  code: string
  name: string
  flag: string
  rtl: boolean
}
```

### Uso

```tsx
import { useLocaleStore } from '@/store/localeStore'

function LanguageSelector() {
  const { locale, availableLocales, setLocale } = useLocaleStore()
  
  return (
    <Select
      value={locale}
      onChange={setLocale}
      options={availableLocales.map(l => ({
        value: l.code,
        label: l.name,
        icon: l.flag
      }))}
    />
  )
}

function WelcomeMessage() {
  const { t } = useLocaleStore()
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.message', { name: user.name })}</p>
    </div>
  )
}

// Formateo de fechas y números
function InvoiceDetails({ invoice }) {
  const { formatDate, formatNumber } = useLocaleStore()
  
  return (
    <div>
      <p>Fecha: {formatDate(invoice.date)}</p>
      <p>Total: {formatNumber(invoice.total)}</p>
    </div>
  )
}
```

---

## 🎯 Patrones y Mejores Prácticas

### 1. **Selectors**

```tsx
// ✅ Bueno - Selectors específicos
const useIsAuthenticated = () => useAuthStore(state => !!state.accessToken)
const useUserRole = () => useAuthStore(state => state.user?.role)

// ❌ Malo - Seleccionar todo el estado
const { accessToken, refreshToken, user, ... } = useAuthStore()
```

### 2. **Actions Derivadas**

```tsx
// ✅ Bueno - Crear acciones reutilizables
function useThemeActions() {
  const setTheme = useThemeStore(state => state.setTheme)
  
  const setLightTheme = () => setTheme('light')
  const setDarkTheme = () => setTheme('dark')
  const setSystemTheme = () => setTheme('system')
  
  return { setLightTheme, setDarkTheme, setSystemTheme }
}
```

### 3. **Persistencia Selectiva**

```tsx
// ✅ Bueno - Persistir solo lo necesario
const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Solo persistir tokens, no otro estado temporal
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      })
    }
  )
)
```

### 4. **Evitar Re-renders**

```tsx
// ✅ Bueno - Usar shallow equality
import shallow from 'zustand/shallow'

function MyComponent() {
  const { user, login, logout } = useAuthStore(
    state => ({ user: state.user, login: state.login, logout: state.logout }),
    shallow
  )
}
```

### 5. **DevTools**

```tsx
// ✅ Bueno - Habilitar devtools en desarrollo
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools(
    (set) => ({
      // estado...
    }),
    { name: 'MyStore' }
  )
)
```

---

## 📚 Recursos Adicionales

- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Zustand Patterns](https://github.com/pmndrs/zustand/wiki/Recipes)
- [State Management Best Practices](https://kentcdodds.com/blog/application-state-management-with-react)

---

**Última actualización:** 18 de Noviembre, 2025
