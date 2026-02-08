# 🎨 PROPUESTA DE ARQUITECTURA TÉCNICA - DESIGN SYSTEM FARUTECH

**Versión:** 1.0.0  
**Fecha:** 7 de febrero de 2026  
**Documento técnico definitivo**

---

## 🏛️ ARQUITECTURA DE ALTO NIVEL

```
┌─────────────────────────────────────────────────────────────────┐
│                   FARUTECH ECOSYSTEM                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │     @farutech/design-system (Core Package)               │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐             │   │
│  │  │  Tokens   │ │  Themes   │ │Components │             │   │
│  │  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘             │   │
│  │        │             │             │                     │   │
│  │        └─────────────┴─────────────┘                     │   │
│  │                      │                                   │   │
│  └──────────────────────┼───────────────────────────────────┘   │
│                         │                                       │
│           ┌─────────────┴─────────────┐                         │
│           │                           │                         │
│  ┌────────▼────────┐         ┌────────▼────────┐               │
│  │ Core Dashboard  │         │ Apps Dashboard  │               │
│  │  (Orchestrator) │         │ (Multi-Tenant)  │               │
│  └────────┬────────┘         └────────┬────────┘               │
│           │                           │                         │
│           │              ┌────────────┴────────────┐            │
│           │              │                         │            │
│           │     ┌────────▼────────┐       ┌───────▼──────┐     │
│           │     │  MP: Ordeon     │       │  MP: Health  │     │
│           │     │  (POS/Rest)     │       │  (Medical)   │     │
│           │     └─────────────────┘       └──────────────┘     │
│           │                                                     │
│           │     ┌─────────────────┐       ┌──────────────┐     │
│           │     │  MP: Veterinary │       │  MP: ERP     │     │
│           │     └─────────────────┘       └──────────────┘     │
│           │                                                     │
│           └──────────────── All consume DS ────────────────────┘
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 📦 ESTRUCTURA DETALLADA DEL PAQUETE

### Package Exports

```typescript
// Main exports
export * from './components'
export * from './hooks'
export * from './utils'

// Subpath exports (optimización)
export * as tokens from './tokens'
export * as themes from './theme/themes'
export { ThemeProvider, useTheme } from './theme'
```

### Entry Points

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles.css",
    "./tokens": {
      "import": "./dist/tokens/index.mjs",
      "types": "./dist/tokens/index.d.ts"
    },
    "./theme": {
      "import": "./dist/theme/index.mjs",
      "types": "./dist/theme/index.d.ts"
    },
    "./hooks": {
      "import": "./dist/hooks/index.mjs",
      "types": "./dist/hooks/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils/index.mjs",
      "types": "./dist/utils/index.d.ts"
    }
  }
}
```

---

## 🎨 SISTEMA DE TOKENS

### Estructura de Archivos

```typescript
// src/tokens/colors.ts
export const colors = {
  // Brand colors
  brand: {
    primary: {
      hsl: '215 90% 52%',
      hex: '#1E88E5',
      rgb: 'rgb(30, 136, 229)',
    },
    secondary: {
      hsl: '222 47% 11%',
      hex: '#1A2332',
      rgb: 'rgb(26, 35, 50)',
    },
    accent: {
      hsl: '170 80% 45%',
      hex: '#16A085',
      rgb: 'rgb(22, 160, 133)',
    },
  },
  
  // Semantic colors
  semantic: {
    success: { hsl: '142 76% 36%', hex: '#2E7D32' },
    warning: { hsl: '38 92% 50%', hex: '#F9A825' },
    error: { hsl: '0 84% 60%', hex: '#EF5350' },
    info: { hsl: '199 89% 48%', hex: '#0288D1' },
  },
  
  // Neutral scale (0-900)
  neutral: {
    50: '#F5F6FA',
    100: '#E0E0E0',
    200: '#BDBDBD',
    300: '#9E9E9E',
    400: '#757575',
    500: '#616161',
    600: '#424242',
    700: '#303030',
    800: '#212121',
    900: '#121212',
  },
  
  // Text colors
  text: {
    primary: 'var(--neutral-900)',
    secondary: 'var(--neutral-500)',
    tertiary: 'var(--neutral-300)',
    inverse: '#FFFFFF',
  },
  
  // Module-specific colors
  modules: {
    medical: {
      primary: { hsl: '174 72% 46%', hex: '#2BBBAD' },
      secondary: { hsl: '168 76% 42%', hex: '#26A69A' },
      accent: { hsl: '180 68% 52%', hex: '#4DD0E1' },
    },
    vet: {
      primary: { hsl: '25 95% 53%', hex: '#FF8A00' },
      secondary: { hsl: '21 90% 48%', hex: '#E97E00' },
      accent: { hsl: '142 69% 45%', hex: '#4CAF50' },
    },
    erp: {
      primary: { hsl: '215 90% 52%', hex: '#1E88E5' },
      secondary: { hsl: '222 47% 11%', hex: '#1A2332' },
      accent: { hsl: '170 80% 45%', hex: '#16A085' },
    },
    pos: {
      primary: { hsl: '280 87% 57%', hex: '#9C27B0' },
      secondary: { hsl: '292 84% 52%', hex: '#BA68C8' },
      accent: { hsl: '267 83% 60%', hex: '#7E57C2' },
    },
  },
} as const

export type ColorToken = typeof colors
```

### CSS Variables Generation

```typescript
// src/tokens/cssVariables.ts
import { colors } from './colors'

export function generateCSSVariables(theme: 'light' | 'dark' = 'light'): string {
  return `
    :root {
      /* Brand */
      --color-primary: ${colors.brand.primary.hsl};
      --color-secondary: ${colors.brand.secondary.hsl};
      --color-accent: ${colors.brand.accent.hsl};
      
      /* Semantic */
      --color-success: ${colors.semantic.success.hsl};
      --color-warning: ${colors.semantic.warning.hsl};
      --color-error: ${colors.semantic.error.hsl};
      --color-info: ${colors.semantic.info.hsl};
      
      /* Neutral */
      ${Object.entries(colors.neutral).map(([key, value]) => 
        `--color-neutral-${key}: ${value};`
      ).join('\n      ')}
    }
  `
}
```

---

## 🌗 SISTEMA DE THEMING

### Theme Interface

```typescript
// src/theme/types.ts
export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    border: string
    text: {
      primary: string
      secondary: string
      tertiary: string
    }
  }
  spacing: typeof spacing
  typography: typeof typography
  shadows: typeof shadows
  borderRadius: typeof borderRadius
}

export type ThemeMode = 'light' | 'dark'
export type ModuleTheme = 'medical' | 'vet' | 'erp' | 'pos'
```

### Theme Creation

```typescript
// src/theme/createTheme.ts
import { colors, spacing, typography, shadows, borderRadius } from '../tokens'
import type { Theme, ModuleTheme } from './types'

export function createTheme(module: ModuleTheme): Theme {
  const moduleColors = colors.modules[module]
  
  return {
    name: module,
    colors: {
      primary: moduleColors.primary.hsl,
      secondary: moduleColors.secondary.hsl,
      accent: moduleColors.accent.hsl,
      background: colors.neutral[50],
      surface: '#FFFFFF',
      border: colors.neutral[100],
      text: {
        primary: colors.neutral[900],
        secondary: colors.neutral[500],
        tertiary: colors.neutral[300],
      },
    },
    spacing,
    typography,
    shadows,
    borderRadius,
  }
}

// Pre-built themes
export const medicalTheme = createTheme('medical')
export const vetTheme = createTheme('vet')
export const erpTheme = createTheme('erp')
export const posTheme = createTheme('pos')
```

### Theme Provider

```typescript
// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Theme, ThemeMode } from './types'
import { erpTheme } from './themes'

interface ThemeContextValue {
  theme: Theme
  mode: ThemeMode
  setTheme: (theme: Theme) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultMode?: ThemeMode
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = erpTheme,
  defaultMode = 'light',
  storageKey = 'farutech-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mode, setMode] = useState<ThemeMode>(defaultMode)

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const { mode: storedMode } = JSON.parse(stored)
      setMode(storedMode)
    }
  }, [storageKey])

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    
    // Apply CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value)
      }
    })
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify({ mode }))
  }, [theme, mode, storageKey])

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

---

## 🧱 ARQUITECTURA DE COMPONENTES

### Component Pattern

Cada componente sigue esta estructura:

```
components/
└── Button/
    ├── Button.tsx          # Main component
    ├── Button.types.ts     # TypeScript types
    ├── Button.styles.ts    # Variant styles (CVA)
    ├── Button.test.tsx     # Tests
    └── index.ts            # Export
```

### Component Template

```typescript
// components/Button/Button.tsx
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils'
import type { ButtonProps } from './Button.types'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-white hover:bg-secondary/90',
        danger: 'bg-error text-white hover:bg-error/90',
        ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-11 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={loading}
        {...props}
      >
        {loading && <Spinner className="mr-2" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

### Component Types

```typescript
// components/Button/Button.types.ts
import type { ButtonHTMLAttributes } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from './Button.styles'

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}
```

---

## 🏆 COMPONENTE DATATABLE - ARQUITECTURA

### Features Core

```typescript
interface DataTableFeatures {
  // Search
  search: {
    enabled: boolean
    fields: string[]
    placeholder: string
    debounce: number
  }
  
  // Filters
  filters: {
    enabled: boolean
    config: FilterConfig[]
  }
  
  // Sorting
  sorting: {
    enabled: boolean
    defaultSort?: SortConfig
  }
  
  // Pagination
  pagination: {
    enabled: boolean
    mode: 'client' | 'server'
    pageSize: number
    pageSizeOptions: number[]
  }
  
  // Selection
  selection: {
    enabled: boolean
    mode: 'single' | 'multi'
  }
  
  // Actions
  actions: {
    row?: RowActions
    bulk?: BulkActions
    global?: GlobalActions
  }
  
  // States
  states: {
    loading: boolean
    empty: EmptyStateConfig
    error?: ErrorStateConfig
  }
  
  // Responsive
  responsive: {
    enabled: boolean
    breakpoint: 'sm' | 'md' | 'lg'
    mobileView: 'cards' | 'scroll'
  }
}
```

### Column Definition

```typescript
interface DataTableColumn<T> {
  id: string
  header: string | React.ReactNode
  accessorKey?: keyof T
  accessorFn?: (row: T) => any
  cell?: (info: CellContext<T>) => React.ReactNode
  
  // Sorting
  enableSorting?: boolean
  sortingFn?: SortingFn<T>
  
  // Filtering
  enableColumnFilter?: boolean
  filterFn?: FilterFn<T>
  
  // Display
  size?: number
  minSize?: number
  maxSize?: number
  
  // Responsive
  hideOnMobile?: boolean
  priority?: number
}
```

### Usage Example

```typescript
<DataTable
  data={users}
  columns={[
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.original.avatar} />
          <span>{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      hideOnMobile: true,
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => (
        <Badge variant={getRoleVariant(row.getValue('role'))}>
          {row.getValue('role')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <RowActions
          actions={[
            { label: 'Edit', onClick: () => edit(row.original) },
            { label: 'Delete', onClick: () => deleteUser(row.original), variant: 'danger' },
          ]}
        />
      ),
    },
  ]}
  features={{
    search: {
      enabled: true,
      fields: ['name', 'email'],
      placeholder: 'Search users...',
    },
    filters: {
      enabled: true,
      config: [
        { type: 'select', field: 'role', label: 'Role', options: roles },
        { type: 'daterange', field: 'created', label: 'Created' },
      ],
    },
    pagination: {
      enabled: true,
      mode: 'server',
      pageSize: 10,
    },
    selection: {
      enabled: true,
      mode: 'multi',
    },
    actions: {
      global: [
        { label: 'Create User', onClick: createUser, variant: 'primary' },
        { label: 'Export', onClick: exportUsers },
      ],
      bulk: [
        { label: 'Delete Selected', onClick: deleteBulk, requiresSelection: true },
      ],
    },
  }}
/>
```

---

## 🪝 HOOKS ARCHITECTURE

### useCrud Hook

```typescript
// hooks/useCrud.ts
export interface UseCrudOptions<T> {
  endpoint: string
  queryKey: string[]
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useCrud<T>(options: UseCrudOptions<T>) {
  const queryClient = useQueryClient()
  
  // Read
  const { data, isLoading, error } = useQuery({
    queryKey: options.queryKey,
    queryFn: () => api.get<T[]>(options.endpoint),
  })
  
  // Create
  const createMutation = useMutation({
    mutationFn: (item: Omit<T, 'id'>) => api.post(options.endpoint, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
      options.onSuccess?.()
    },
  })
  
  // Update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
      api.patch(`${options.endpoint}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    },
  })
  
  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`${options.endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey })
    },
  })
  
  return {
    data,
    isLoading,
    error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
```

### useDataTable Hook

```typescript
// hooks/useDataTable.ts
export function useDataTable<T>(data: T[], options: DataTableOptions) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: options.pageSize || 10,
  })
  
  const table = useReactTable({
    data,
    columns: options.columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  
  return {
    table,
    sorting,
    setSorting,
    filters: columnFilters,
    setFilters: setColumnFilters,
    search: globalFilter,
    setSearch: setGlobalFilter,
    pagination,
    setPagination,
  }
}
```

---

## 🔧 BUILD CONFIGURATION

### Vite Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      rollupTypes: true,
    }),
  ],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FarutechDesignSystem',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'tailwindcss',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        // Preserve module structure
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
    
    // CSS
    cssCodeSplit: true,
    
    // Sourcemaps
    sourcemap: true,
    
    // Target
    target: 'es2020',
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

### TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "sourceMap": true,
    
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

---

## 📚 DOCUMENTACIÓN STRUCTURE

```
docs/
├── README.md                  # Main documentation
│
├── getting-started/
│   ├── installation.md
│   ├── setup.md
│   └── first-component.md
│
├── components/
│   ├── layout/
│   │   ├── app-shell.md
│   │   ├── sidebar.md
│   │   └── header.md
│   ├── inputs/
│   │   ├── button.md
│   │   ├── input.md
│   │   └── select.md
│   └── advanced/
│       ├── data-table.md
│       └── crud-manager.md
│
├── theming/
│   ├── overview.md
│   ├── custom-themes.md
│   ├── dark-mode.md
│   └── module-themes.md
│
├── hooks/
│   ├── use-crud.md
│   ├── use-data-table.md
│   └── use-theme.md
│
├── guides/
│   ├── migration-from-shadcn.md
│   ├── building-custom-components.md
│   ├── performance-optimization.md
│   └── accessibility.md
│
└── api/
    ├── tokens.md
    ├── types.md
    └── utilities.md
```

---

## ✅ CONCLUSIÓN

Esta arquitectura proporciona:

1. **Escalabilidad:** Fácil añadir nuevos componentes y features
2. **Mantenibilidad:** Estructura clara y predecible
3. **Performance:** Tree-shaking, code splitting, lazy loading
4. **Developer Experience:** TypeScript strict, IntelliSense completo
5. **Accesibilidad:** ARIA, keyboard navigation, screen readers
6. **Theming:** Multi-módulo, dark mode, customizable
7. **Testing:** Unit, integration, visual regression

**Listo para implementación.**
