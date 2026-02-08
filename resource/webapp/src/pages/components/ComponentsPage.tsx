/**
 * Página de demostración de componentes UI
 * Muestra todos los componentes disponibles con ejemplos y todas sus variantes
 */

import { useState } from 'react'
import clsx from 'clsx'
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  Checkbox,
  CheckboxGroup,
  Divider,
  Dropdown,
  FloatingActionButton,
  Input,
  MaskedInput,
  TagInput,
  ListBox,
  ListGroup,
  Modal,
  PhoneInput,
  ProgressBar,
  MultiProgressBar,
  RadioGroup,
  SectionHeader,
  Select,
  Spinner,
  ProgressSpinner,
  LogoSpinner,
  Switch,
  Tabs,
  Textarea,
  Tooltip,
} from '@/components/ui'
import { 
  DatePickerV2, 
  DateRangePickerV2, 
  TimeRangePicker,
  Scheduler,
} from '@/components/ui'
import type { Appointment, SchedulerConfig, Tag } from '@/components/ui'
import { SearchModal } from '@/components/layout/SearchModal'
import { 
  UserIcon, 
  HomeIcon, 
  CogIcon, 
  BellIcon,
  HeartIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon,
  DocumentIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline'
import type { BreadcrumbItem, DropdownItem, ListBoxOption, ListGroupItem, RadioOption, TabItem } from '@/components/ui'
import { DataTable } from '@/components/ui/DataTable'
import type { DataTableActions } from '@/components/ui/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import type { User } from '@/types'
import { notify } from '@/store/notificationStore'
import { useLocaleStore, type LocaleCode, type DateFormat, type TimeFormat, LOCALE_CONFIGS } from '@/store/localeStore'

export default function ComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [switchValue, setSwitchValue] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [checkboxGroupValue, setCheckboxGroupValue] = useState<string[]>([])
  
  // Locale store
  const { locale, dateFormat, timeFormat, setLocale, setDateFormat, setTimeFormat } = useLocaleStore()
  const [radioValue, setRadioValue] = useState('option1')
  const [dropdownValue, setDropdownValue] = useState('')
  const [listBoxValue, setListBoxValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')

  // --- DataTable demo component (local to this page) ---
  // NOTA: useDataTableState está disponible para crear estados independientes por tabla
  // Ejemplo de uso: const table1 = useDataTableState({ initialPerPage: 10, searchable: true })
  function DataTableDemo() {
    // Estado compartido para la demo (para simplicidad en esta página de ejemplos)
    const [tablePage, setTablePage] = useState(1)
    const [tablePerPage, setTablePerPage] = useState(5)
    const [tableSelected, setTableSelected] = useState<Set<string | number>>(new Set())
    const [tableSearch, setTableSearch] = useState('')

    // Filtrar por búsqueda
    const mockUsers: User[] = [
      { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', avatar: '', createdAt: '2024-01-15' },
      { id: 2, name: 'María García', email: 'maria@example.com', role: 'user', avatar: '', createdAt: '2024-01-16' },
      { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'moderator', avatar: '', createdAt: '2024-01-17' },
      { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'user', avatar: '', createdAt: '2024-01-18' },
      { id: 5, name: 'Pedro Sánchez', email: 'pedro@example.com', role: 'user', avatar: '', createdAt: '2024-01-19' },
      { id: 6, name: 'Lucía Rivera', email: 'lucia@example.com', role: 'user', avatar: '', createdAt: '2024-01-20' },
      { id: 7, name: 'Andrés Gómez', email: 'andres@example.com', role: 'moderator', avatar: '', createdAt: '2024-01-21' },
    ]

    const filteredUsers = tableSearch
      ? mockUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(tableSearch.toLowerCase())
        )
      : mockUsers

    const columns: ColumnDef<User>[] = [
      { accessorKey: 'name', header: 'Nombre', enableSorting: true },
      { accessorKey: 'email', header: 'Email', enableSorting: true },
      {
        accessorKey: 'role',
        header: 'Rol',
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200">
            {row.original.role}
          </span>
        ),
      },
      { accessorKey: 'createdAt', header: 'Creado', enableSorting: true },
    ]

    const actions: DataTableActions<User> = {
      onView: (user) => notify.info('Ver', `Viendo detalles de ${user.name}`),
      onEdit: (user) => notify.info('Editar', `Editando ${user.name}`),
      onDelete: (user) => {
        if (confirm(`¿Eliminar a ${user.name}?`)) {
          notify.success('Eliminado', `${user.name} ha sido eliminado`)
        }
      },
    }

    const start = (tablePage - 1) * tablePerPage
    const pageData = filteredUsers.slice(start, start + tablePerPage)

    return (
      <div className="space-y-6">
        {/* Ejemplo 1: Básico */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Ejemplo 1: Tabla Básica
          </h4>
          <DataTable data={pageData} columns={columns} wrapped={false} />
        </div>

        <Divider />

        {/* Ejemplo 2: Con búsqueda */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Ejemplo 2: Con Búsqueda
          </h4>
          <DataTable
            data={pageData}
            columns={columns}
            searchable
            searchPlaceholder="Buscar por nombre o email..."
            searchValue={tableSearch}
            onSearch={setTableSearch}
            wrapped={false}
          />
        </div>

        <Divider />

        {/* Ejemplo 3: Con paginación */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Ejemplo 3: Con Paginación
          </h4>
          <DataTable
            data={pageData}
            columns={columns}
            pagination={{
              page: tablePage,
              perPage: tablePerPage,
              total: filteredUsers.length,
              onPageChange: setTablePage,
              onPerPageChange: setTablePerPage,
            }}
            wrapped={false}
          />
        </div>

        <Divider />

        {/* Ejemplo 4: Con acciones */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Ejemplo 4: Con Acciones (Ver, Editar, Eliminar)
          </h4>
          <DataTable data={pageData} columns={columns} actions={actions} wrapped={false} />
        </div>

        <Divider />

        {/* Ejemplo 5: Con selección */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Ejemplo 5: Con Selección Múltiple
          </h4>
          {tableSelected.size > 0 && (
            <div className="mb-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <p className="text-sm text-primary-700 dark:text-primary-300">
                ✓ {tableSelected.size} {tableSelected.size === 1 ? 'fila seleccionada' : 'filas seleccionadas'}
              </p>
            </div>
          )}
          <DataTable
            data={pageData}
            columns={columns}
            selectable
            selectedRows={tableSelected}
            onSelectionChange={setTableSelected}
            wrapped={false}
          />
        </div>

        <Divider />

        {/* Ejemplo 6: Completo */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Ejemplo 6: Todo Junto (Búsqueda + Paginación + Acciones + Selección + Acciones Globales)
          </h4>
          <DataTable
            data={pageData}
            columns={columns}
            searchable
            searchPlaceholder="Buscar usuarios..."
            searchValue={tableSearch}
            onSearch={setTableSearch}
            pagination={{
              page: tablePage,
              perPage: tablePerPage,
              total: filteredUsers.length,
              onPageChange: setTablePage,
              onPerPageChange: setTablePerPage,
            }}
            selectable
            selectedRows={tableSelected}
            onSelectionChange={setTableSelected}
            actions={actions}
            globalActions={[
              {
                label: 'Crear Usuario',
                icon: <PlusIcon className="h-4 w-4" />,
                variant: 'primary',
                onClick: () => notify.success('Crear', 'Abriendo formulario de creación...')
              },
              {
                label: 'Eliminar Seleccionados',
                icon: <TrashIcon className="h-4 w-4" />,
                variant: 'danger',
                requiresSelection: true,
                onClick: (selectedIds?: Set<string | number>) => {
                  if (confirm(`¿Eliminar ${selectedIds?.size} usuarios?`)) {
                    notify.success('Eliminado', `${selectedIds?.size} usuarios eliminados`)
                    setTableSelected(new Set())
                  }
                }
              }
            ]}
            onRowClick={(user: User) => notify.info('Click', `Click en ${user.name}`)}
            emptyMessage="No se encontraron usuarios que coincidan con tu búsqueda"
            showFooter={true}
          />
        </div>
        
        <Divider />

        {/* Ejemplo 7: Con Filtros Parametrizables */}
        <FiltersDemo />
        
        <Divider />
        
        {/* Ejemplo 8: Filtros Avanzados (Location + Color) */}
        <AdvancedFiltersDemo />
      </div>
    )
  }

  // --- Filters Demo ---
  function FiltersDemo() {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({})
    
    // Datos de ejemplo con más variedad para filtrar
    const sampleProducts = [
      { id: 1, name: 'Laptop HP', category: 'electronics', price: 899, stock: 15, status: 'active', createdAt: '2024-01-10' },
      { id: 2, name: 'Mouse Logitech', category: 'electronics', price: 25, stock: 50, status: 'active', createdAt: '2024-01-12' },
      { id: 3, name: 'Teclado Mecánico', category: 'electronics', price: 120, stock: 30, status: 'active', createdAt: '2024-01-15' },
      { id: 4, name: 'Monitor Samsung', category: 'electronics', price: 350, stock: 8, status: 'low_stock', createdAt: '2024-01-18' },
      { id: 5, name: 'Silla Gamer', category: 'furniture', price: 299, stock: 5, status: 'low_stock', createdAt: '2024-01-20' },
      { id: 6, name: 'Escritorio', category: 'furniture', price: 450, stock: 3, status: 'low_stock', createdAt: '2024-02-01' },
      { id: 7, name: 'Audífonos Sony', category: 'electronics', price: 180, stock: 0, status: 'out_of_stock', createdAt: '2024-02-05' },
      { id: 8, name: 'Webcam Logitech', category: 'electronics', price: 75, stock: 25, status: 'active', createdAt: '2024-02-10' },
      { id: 9, name: 'Lámpara LED', category: 'furniture', price: 45, stock: 40, status: 'active', createdAt: '2024-02-15' },
      { id: 10, name: 'Router WiFi', category: 'electronics', price: 65, stock: 20, status: 'active', createdAt: '2024-02-20' },
    ]

    // Aplicar filtros
    const filteredProducts = sampleProducts.filter((product) => {
      // Filtro de texto (nombre)
      if (filterValues.name && !product.name.toLowerCase().includes(filterValues.name.toLowerCase())) {
        return false
      }

      // Filtro de categoría
      if (filterValues.category && product.category !== filterValues.category) {
        return false
      }

      // Filtro de estado
      if (filterValues.status && product.status !== filterValues.status) {
        return false
      }

      // Filtro de rango de precio
      if (filterValues.priceRange) {
        if (filterValues.priceRange.min && product.price < filterValues.priceRange.min) return false
        if (filterValues.priceRange.max && product.price > filterValues.priceRange.max) return false
      }

      // Filtro de fecha
      if (filterValues.createdAfter && new Date(product.createdAt) < new Date(filterValues.createdAfter)) {
        return false
      }

      return true
    })

    const productColumns: ColumnDef<any>[] = [
      { accessorKey: 'name', header: 'Producto', enableSorting: true },
      { 
        accessorKey: 'category', 
        header: 'Categoría',
        cell: ({ row }) => (
          <span className={clsx(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            row.original.category === 'electronics' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
          )}>
            {row.original.category === 'electronics' ? 'Electrónica' : 'Muebles'}
          </span>
        )
      },
      { 
        accessorKey: 'price', 
        header: 'Precio',
        cell: ({ row }) => `$${row.original.price}`,
        enableSorting: true 
      },
      { 
        accessorKey: 'stock', 
        header: 'Stock',
        enableSorting: true 
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => {
          const statusConfig = {
            active: { label: 'Activo', className: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' },
            low_stock: { label: 'Stock Bajo', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' },
            out_of_stock: { label: 'Agotado', className: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' },
          }
          const config = statusConfig[row.original.status as keyof typeof statusConfig]
          return (
            <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.className)}>
              {config.label}
            </span>
          )
        },
      },
      { accessorKey: 'createdAt', header: 'Fecha', enableSorting: true },
    ]

    const filters = [
      {
        id: 'name',
        label: 'Nombre del Producto',
        type: 'text' as const,
        placeholder: 'Buscar por nombre...',
      },
      {
        id: 'category',
        label: 'Categoría',
        type: 'select' as const,
        options: [
          { label: 'Electrónica', value: 'electronics' },
          { label: 'Muebles', value: 'furniture' },
        ],
      },
      {
        id: 'status',
        label: 'Estado',
        type: 'select' as const,
        options: [
          { label: 'Activo', value: 'active' },
          { label: 'Stock Bajo', value: 'low_stock' },
          { label: 'Agotado', value: 'out_of_stock' },
        ],
      },
      {
        id: 'priceRange',
        label: 'Rango de Precio',
        type: 'numberrange' as const,
        width: 'col-span-2',
      },
      {
        id: 'createdAfter',
        label: 'Creado Después de',
        type: 'date' as const,
      },
    ]

    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Ejemplo 7: Con Filtros Parametrizables
        </h4>
        <DataTable
          data={filteredProducts}
          columns={productColumns}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={setFilterValues}
          wrapped={false}
        />
        
        {/* Información de filtros activos */}
        {Object.keys(filterValues).length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Filtros Activos ({Object.keys(filterValues).length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filterValues).map(([key, value]) => (
                <span key={key} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
                  {key}: {JSON.stringify(value)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // --- Advanced Filters Demo (Location + Color) ---
  function AdvancedFiltersDemo() {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({})
    
    // Datos de ejemplo con ubicación y color
    const sampleVehicles = [
      { id: 1, model: 'Toyota Corolla', location: 'Bogotá', color: '#FF0000', year: 2023, price: 85000, status: 'available' },
      { id: 2, model: 'Honda Civic', location: 'Medellín', color: '#0000FF', year: 2023, price: 88000, status: 'available' },
      { id: 3, model: 'Mazda 3', location: 'Cali', color: '#000000', year: 2022, price: 75000, status: 'sold' },
      { id: 4, model: 'Chevrolet Onix', location: 'Bogotá', color: '#FFFFFF', year: 2023, price: 60000, status: 'available' },
      { id: 5, model: 'Nissan Versa', location: 'Cartagena', color: '#C0C0C0', year: 2022, price: 55000, status: 'reserved' },
      { id: 6, model: 'Volkswagen Jetta', location: 'Medellín', color: '#808080', year: 2023, price: 95000, status: 'available' },
      { id: 7, model: 'Hyundai Accent', location: 'Barranquilla', color: '#FF0000', year: 2022, price: 52000, status: 'available' },
      { id: 8, model: 'Kia Rio', location: 'Cali', color: '#0000FF', year: 2023, price: 58000, status: 'available' },
    ]

    // Aplicar filtros
    const filteredVehicles = sampleVehicles.filter((vehicle) => {
      // Filtro de ubicación
      if (filterValues.location && !vehicle.location.toLowerCase().includes(filterValues.location.toLowerCase())) {
        return false
      }

      // Filtro de color
      if (filterValues.color && vehicle.color !== filterValues.color) {
        return false
      }

      // Filtro de estado
      if (filterValues.status && vehicle.status !== filterValues.status) {
        return false
      }

      // Filtro de rango de precio
      if (filterValues.priceRange) {
        if (filterValues.priceRange.min && vehicle.price < filterValues.priceRange.min) return false
        if (filterValues.priceRange.max && vehicle.price > filterValues.priceRange.max) return false
      }

      return true
    })

    const vehicleColumns: ColumnDef<any>[] = [
      { accessorKey: 'model', header: 'Modelo', enableSorting: true },
      { 
        accessorKey: 'location', 
        header: 'Ubicación',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {row.original.location}
          </span>
        )
      },
      { 
        accessorKey: 'color', 
        header: 'Color',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: row.original.color }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">{row.original.color}</span>
          </div>
        )
      },
      { 
        accessorKey: 'year', 
        header: 'Año',
        enableSorting: true 
      },
      { 
        accessorKey: 'price', 
        header: 'Precio',
        cell: ({ row }) => `$${row.original.price.toLocaleString()}`,
        enableSorting: true 
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => {
          const statusConfig = {
            available: { label: 'Disponible', className: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' },
            reserved: { label: 'Reservado', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' },
            sold: { label: 'Vendido', className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200' },
          }
          const config = statusConfig[row.original.status as keyof typeof statusConfig]
          return (
            <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.className)}>
              {config.label}
            </span>
          )
        },
      },
    ]

    const filters = [
      {
        id: 'location',
        label: 'Ubicación',
        type: 'location' as const,
        placeholder: 'Buscar ciudad...',
        options: [
          { label: 'Bogotá', value: 'Bogotá' },
          { label: 'Medellín', value: 'Medellín' },
          { label: 'Cali', value: 'Cali' },
          { label: 'Barranquilla', value: 'Barranquilla' },
          { label: 'Cartagena', value: 'Cartagena' },
        ],
      },
      {
        id: 'color',
        label: 'Color del Vehículo',
        type: 'color' as const,
        options: [
          { label: 'Rojo', value: '#FF0000' },
          { label: 'Azul', value: '#0000FF' },
          { label: 'Negro', value: '#000000' },
          { label: 'Blanco', value: '#FFFFFF' },
          { label: 'Plata', value: '#C0C0C0' },
          { label: 'Gris', value: '#808080' },
        ],
      },
      {
        id: 'status',
        label: 'Estado',
        type: 'select' as const,
        options: [
          { label: 'Disponible', value: 'available' },
          { label: 'Reservado', value: 'reserved' },
          { label: 'Vendido', value: 'sold' },
        ],
      },
      {
        id: 'priceRange',
        label: 'Rango de Precio ($)',
        type: 'numberrange' as const,
        width: 'col-span-2',
      },
    ]

    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Ejemplo 8: Filtros Avanzados (Ubicación + Color)
        </h4>
        <DataTable
          data={filteredVehicles}
          columns={vehicleColumns}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={setFilterValues}
          wrapped={false}
        />
        
        {/* Información de filtros activos */}
        {Object.keys(filterValues).length > 0 && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
              Filtros Activos ({Object.keys(filterValues).length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filterValues).map(([key, value]) => (
                <span key={key} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200">
                  {key === 'color' && value ? (
                    <>
                      <div className="w-3 h-3 rounded-full mr-1.5 border border-purple-300" style={{ backgroundColor: value }} />
                      {value}
                    </>
                  ) : (
                    `${key}: ${JSON.stringify(value)}`
                  )}
                </span>
              ))}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
              Mostrando {filteredVehicles.length} de {sampleVehicles.length} vehículos
            </p>
          </div>
        )}
      </div>
    )
  }

  // --- MaskedInput demo component ---
  function MaskedInputDemo() {
    const [phone, setPhone] = useState('')
    const [phoneUS, setPhoneUS] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [creditCard, setCreditCard] = useState('')
    const [expDate, setExpDate] = useState('')
    const [cvv, setCvv] = useState('')
    const [currency, setCurrency] = useState('')
    const [percentage, setPercentage] = useState('')
    const [customCode, setCustomCode] = useState('')
    const [customEmail, setCustomEmail] = useState('')
    const [nit, setNit] = useState('')

    return (
      <section>
        <SectionHeader 
          title="🎭 Masked Inputs" 
          subtitle="Inputs inteligentes con máscaras de formato, validación automática y separación de valores"
        />
        
        {/* Banner explicativo */}
        <Alert variant="info" className="mb-6">
          <div className="space-y-2">
            <p className="font-semibold">💡 ¿Qué son los Masked Inputs?</p>
            <p className="text-sm">
              Son inputs que separan el <strong>valor mostrado</strong> (con formato visual) del <strong>valor guardado</strong> (datos puros).
              Perfectos para teléfonos, fechas, tarjetas, monedas, etc.
            </p>
            <div className="mt-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">👁️ Usuario ve:</span>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">+57 321 456 7890</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">💾 Base de datos:</span>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">3214567890</code>
              </div>
            </div>
          </div>
        </Alert>

        <Card>
          <div className="space-y-8">
            {/* Teléfonos */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📱</span>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Teléfonos
                </h4>
                <Badge variant="primary" className="ml-auto">Máscaras Predefinidas</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Formatea automáticamente mientras el usuario escribe. Solo guarda los números puros.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MaskedInput
                  mask="phone-co"
                  value={phone}
                  onChange={(unmasked, formatted) => {
                    setPhone(unmasked)
                    console.log('📞 Valor guardado:', unmasked, '| Mostrado:', formatted)
                  }}
                  label="Teléfono Colombia"
                  helperText="Solo números, formato automático"
                />
                <MaskedInput
                  mask="phone-us"
                  value={phoneUS}
                  onChange={(unmasked) => setPhoneUS(unmasked)}
                  label="Teléfono USA"
                  helperText="10 dígitos con formato (555) 123-4567"
                />
              </div>
              {phone && (
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">💾</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                        Valor en Base de Datos
                      </p>
                      <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">
                        {phone}
                      </code>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ✓ Sin formato, listo para guardar
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fechas y Horas */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📅</span>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Fechas y Horas
                </h4>
                <Badge variant="success" className="ml-auto">Auto-formato</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Inserta separadores automáticamente. Valida formato en tiempo real.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MaskedInput
                  mask="date-dmy"
                  value={date}
                  onChange={(unmasked) => setDate(unmasked)}
                  label="Fecha (DD/MM/YYYY)"
                  helperText="Formato día/mes/año"
                />
                <MaskedInput
                  mask="time-24"
                  value={time}
                  onChange={(unmasked) => setTime(unmasked)}
                  label="Hora (24h)"
                  helperText="Formato 24 horas"
                />
              </div>
            </div>

            {/* Tarjeta de Crédito */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💳</span>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Información de Pago
                </h4>
                <Badge variant="warning" className="ml-auto">Seguro</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Formatos estándar para pagos. Validación de Luhn disponible (agregar si necesario).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <MaskedInput
                    mask="credit-card"
                    value={creditCard}
                    onChange={(unmasked) => setCreditCard(unmasked)}
                    label="Número de Tarjeta"
                    helperText="16 dígitos con espacios automáticos"
                  />
                </div>
                <MaskedInput
                  mask="credit-card-exp"
                  value={expDate}
                  onChange={(unmasked) => setExpDate(unmasked)}
                  label="Vencimiento"
                  helperText="MM/YY"
                />
              </div>
              <div className="mt-4 max-w-xs">
                <MaskedInput
                  mask="credit-card-cvv"
                  value={cvv}
                  onChange={(unmasked) => setCvv(unmasked)}
                  label="CVV"
                  helperText="3-4 dígitos"
                />
              </div>
            </div>

            {/* Monedas y Porcentajes */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💰</span>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Números Formateados
                </h4>
                <Badge variant="success" className="ml-auto">Localized</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Formatos localizados para monedas y porcentajes. Miles, decimales automáticos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MaskedInput
                  mask="currency-cop"
                  value={currency}
                  onChange={(unmasked, formatted) => {
                    setCurrency(unmasked)
                    console.log('💵 Moneda - Guardado:', unmasked, '| Mostrado:', formatted)
                  }}
                  label="Monto (COP)"
                  helperText="Formato: $1,234,567"
                />
                <MaskedInput
                  mask="percentage"
                  value={percentage}
                  onChange={(unmasked) => setPercentage(unmasked)}
                  label="Porcentaje"
                  helperText="Formato: 99.99%"
                />
              </div>
              {currency && (
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🔢</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                        Valor Numérico Puro
                      </p>
                      <code className="text-sm font-mono text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                        {currency}
                      </code>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ✓ Sin símbolos ni separadores, perfecto para cálculos
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Máscaras Personalizadas */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎨</span>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Máscaras Personalizadas
                </h4>
                <Badge variant="primary" className="ml-auto">Custom</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Crea tus propias máscaras con <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">customFormatter</code> y regex de validación.
              </p>
              
              <div className="space-y-4">
                {/* Ejemplo 1: Código simple con máscara */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2 uppercase">
                    Ejemplo 1: Código con Guiones (Máscara Simple)
                  </p>
                  <MaskedInput
                    customFormatter={(value) => {
                      const cleaned = value.replace(/\D/g, '').slice(0, 9)
                      if (cleaned.length === 0) return ''
                      if (cleaned.length <= 3) return cleaned
                      if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
                      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}`
                    }}
                    customUnformatter={(formatted) => formatted.replace(/\D/g, '').slice(0, 9)}
                    validation={/^\d{9}$/}
                    value={customCode}
                    onChange={(unmasked) => setCustomCode(unmasked)}
                    label="Código de Producto"
                    placeholder="123-456-789"
                    helperText="9 dígitos con formato automático"
                  />
                  {customCode && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      💾 Guardado: <code className="px-1 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded">{customCode}</code>
                    </div>
                  )}
                </div>

                {/* Ejemplo 2: Email con dominio predefinido */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2 uppercase">
                    Ejemplo 2: Email Corporativo (con dominio fijo)
                  </p>
                  <MaskedInput
                    customFormatter={(value) => {
                      const cleaned = value.replace(/@.*/g, '').toLowerCase().replace(/[^a-z0-9._-]/g, '')
                      return cleaned ? `${cleaned}@empresa.com` : ''
                    }}
                    customUnformatter={(formatted) => formatted.replace(/@empresa\.com$/i, '')}
                    validation={/^[a-z0-9._-]+$/}
                    value={customEmail}
                    onChange={(unmasked) => setCustomEmail(unmasked)}
                    label="Email Corporativo"
                    placeholder="usuario@empresa.com"
                    helperText="Solo escribe tu usuario, el dominio se agrega automáticamente"
                  />
                  {customEmail && (
                    <div className="mt-2 text-xs space-y-1">
                      <div className="text-gray-500 dark:text-gray-400">
                        👁️ Mostrado: <code className="px-1 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded">{customEmail}@empresa.com</code>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        💾 Guardado: <code className="px-1 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded">{customEmail}</code>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ejemplo 3: NIT Colombia */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2 uppercase">
                    Ejemplo 3: NIT Colombia (con dígito de verificación)
                  </p>
                  <MaskedInput
                    customFormatter={(value) => {
                      const cleaned = value.replace(/\D/g, '').slice(0, 10)
                      if (cleaned.length === 0) return ''
                      const parts = cleaned.match(/.{1,3}/g) || []
                      return parts.join('.')
                    }}
                    customUnformatter={(formatted) => formatted.replace(/\D/g, '').slice(0, 10)}
                    validation={/^\d{9,10}$/}
                    value={nit}
                    onChange={(unmasked) => setNit(unmasked)}
                    label="NIT"
                    placeholder="900.123.456-7"
                    helperText="9-10 dígitos con puntos automáticos"
                  />
                </div>

                {/* Nota de código */}
                <div className="p-3 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                    📝 Código de Ejemplo:
                  </p>
                  <pre className="text-xs bg-gray-900 dark:bg-gray-950 text-gray-100 p-3 rounded overflow-x-auto">
{`<MaskedInput
  customFormatter={(value) => {
    const cleaned = value.replace(/\\D/g, '')
    return cleaned.match(/.{1,3}/g)?.join('-') || ''
  }}
  customUnformatter={(formatted) => 
    formatted.replace(/\\D/g, '')
  }
  validation={/^\\d{9}$/}
  value={code}
  onChange={(unmasked) => setCode(unmasked)}
/>`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Tabla de referencia */}
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  📚 Máscaras Predefinidas Disponibles
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Máscara</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Formato</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ejemplo</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Uso</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { mask: 'phone-co', format: '+57 ### ### ####', example: '+57 321 456 7890', use: 'Teléfonos Colombia' },
                      { mask: 'phone-us', format: '(###) ###-####', example: '(555) 123-4567', use: 'Teléfonos USA' },
                      { mask: 'date-dmy', format: 'DD/MM/YYYY', example: '31/12/2024', use: 'Fechas' },
                      { mask: 'time-24', format: 'HH:MM', example: '23:59', use: 'Hora 24h' },
                      { mask: 'credit-card', format: '#### #### #### ####', example: '1234 5678 9012 3456', use: 'Tarjetas' },
                      { mask: 'currency-cop', format: '$#,###,###', example: '$1,234,567', use: 'Pesos colombianos' },
                      { mask: 'percentage', format: '##.##%', example: '99.99%', use: 'Porcentajes' },
                    ].map((item) => (
                      <tr key={item.mask} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-2 text-sm">
                          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded text-xs">
                            {item.mask}
                          </code>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-mono">{item.format}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.example}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{item.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nota explicativa final */}
            <Alert variant="success">
              <div className="space-y-2">
                <p className="font-semibold">✅ Beneficios de MaskedInput:</p>
                <ul className="ml-4 list-disc text-sm space-y-1">
                  <li><strong>Datos limpios:</strong> La BD solo recibe valores puros sin formato</li>
                  <li><strong>UX mejorada:</strong> El usuario ve formato amigable automáticamente</li>
                  <li><strong>Validación integrada:</strong> Regex + feedback visual instantáneo</li>
                  <li><strong>Flexible:</strong> 15 máscaras predefinidas + opción 100% personalizable</li>
                  <li><strong>Sin dependencias:</strong> No requiere librerías externas</li>
                </ul>
              </div>
            </Alert>
          </div>
        </Card>
      </section>
    )
  }

  // Breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Componentes', href: '/components' },
    { label: 'UI', href: '/components/ui' },
    { label: 'Demo' },
  ]

  // Dropdown items
  const dropdownItems: DropdownItem[] = [
    { label: 'Perfil', value: 'profile', icon: UserIcon },
    { label: 'Configuración', value: 'settings', icon: CogIcon },
    { label: 'Notificaciones', value: 'notifications', icon: BellIcon },
    { divider: true, label: '', value: 'divider' },
    { label: 'Cerrar sesión', value: 'logout' },
  ]

  // ListBox options
  const listBoxOptions: ListBoxOption[] = [
    {
      id: '1',
      label: 'Usuario Premium',
      description: 'Acceso completo a todas las funciones',
      icon: StarIcon,
    },
    {
      id: '2',
      label: 'Usuario Estándar',
      description: 'Acceso a funciones básicas',
      icon: UserIcon,
    },
    {
      id: '3',
      label: 'Usuario Gratuito',
      description: 'Acceso limitado',
      icon: UserIcon,
      disabled: true,
    },
  ]

  // ListGroup items
  const listGroupItems: ListGroupItem[] = [
    { id: '1', content: 'Inicio', icon: HomeIcon, badge: '5', active: true },
    { id: '2', content: 'Configuración', icon: CogIcon },
    { id: '3', content: 'Notificaciones', icon: BellIcon, badge: 12 },
    { id: '4', content: 'Favoritos', icon: HeartIcon },
  ]

  // Radio options
  const radioOptions: RadioOption[] = [
    { value: 'option1', label: 'Opción 1', description: 'Esta es la primera opción' },
    { value: 'option2', label: 'Opción 2', description: 'Esta es la segunda opción' },
    { value: 'option3', label: 'Opción 3', disabled: true },
  ]

  // Checkbox options
  const checkboxOptions = [
    { value: 'option1', label: 'Opción 1', description: 'Primera opción' },
    { value: 'option2', label: 'Opción 2', description: 'Segunda opción' },
    { value: 'option3', label: 'Opción 3' },
  ]

  // Tabs
  const tabs: TabItem[] = [
    {
      id: 'tab1',
      label: 'General',
      icon: HomeIcon,
      content: <div className="p-4">Contenido de la pestaña General</div>,
    },
    {
      id: 'tab2',
      label: 'Configuración',
      icon: CogIcon,
      content: <div className="p-4">Contenido de Configuración</div>,
    },
    {
      id: 'tab3',
      label: 'Notificaciones',
      icon: BellIcon,
      content: <div className="p-4">Contenido de Notificaciones</div>,
    },
  ]

  // --- TagInput Demo ---
  function TagInputDemo() {
    // Tags simples
    const [simpleTags, setSimpleTags] = useState<Tag[]>([
      { id: 1, label: 'React' },
      { id: 2, label: 'TypeScript' },
    ])

    // Tags con colores
    const [coloredTags, setColoredTags] = useState<Tag[]>([
      { id: 1, label: 'Urgente', color: '#ef4444' },
      { id: 2, label: 'En progreso', color: '#3b82f6' },
    ])

    // Tags con búsqueda async
    const [searchedTags, setSearchedTags] = useState<Tag[]>([])

    // Tags con límite
    const [limitedTags, setLimitedTags] = useState<Tag[]>([])

    // Tags disponibles para seleccionar
    const availableTags: Tag[] = [
      { id: 1, label: 'JavaScript' },
      { id: 2, label: 'TypeScript' },
      { id: 3, label: 'React' },
      { id: 4, label: 'Vue' },
      { id: 5, label: 'Angular' },
      { id: 6, label: 'Node.js' },
      { id: 7, label: 'Python' },
      { id: 8, label: 'Django' },
      { id: 9, label: 'FastAPI' },
      { id: 10, label: 'PostgreSQL' },
      { id: 11, label: 'MongoDB' },
      { id: 12, label: 'Redis' },
    ]

    const categoryTags: Tag[] = [
      { id: 1, label: 'Tecnología', color: '#3b82f6' },
      { id: 2, label: 'Diseño', color: '#8b5cf6' },
      { id: 3, label: 'Marketing', color: '#10b981' },
      { id: 4, label: 'Ventas', color: '#f59e0b' },
      { id: 5, label: 'Soporte', color: '#ef4444' },
    ]

    // Simular búsqueda en BD
    const handleSearchTags = async (query: string): Promise<Tag[]> => {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      return availableTags.filter((tag) =>
        tag.label.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Simular creación en BD
    const handleCreateTag = async (label: string): Promise<Tag> => {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      notify.success('Tag creado', `"${label}" creado exitosamente`)

      return {
        id: Date.now(),
        label,
        isNew: true, // Marcarlo como nuevo
      }
    }

    // Validar tag
    const validateTag = (label: string): string | null => {
      if (label.length < 2) {
        return 'El tag debe tener al menos 2 caracteres'
      }
      if (label.length > 20) {
        return 'El tag no puede tener más de 20 caracteres'
      }
      if (!/^[a-zA-Z0-9\s\-_]+$/.test(label)) {
        return 'El tag solo puede contener letras, números, espacios, guiones y guiones bajos'
      }
      return null
    }

    return (
      <div className="space-y-8">
        {/* Simple */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">🏷️ TagInput Simple</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Escribe y presiona Enter para agregar. Backspace para eliminar el último.
          </p>
          <TagInput
            value={simpleTags}
            onChange={setSimpleTags}
            availableTags={availableTags}
            label="Tecnologías"
            placeholder="Escribe una tecnología..."
            helperText="Selecciona o crea nuevas tecnologías"
          />
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
              Tags seleccionados:
            </p>
            <pre className="text-xs text-gray-600 dark:text-gray-400">
              {JSON.stringify(simpleTags, null, 2)}
            </pre>
          </div>
        </Card>

        {/* Con colores */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">🎨 TagInput con Colores</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Tags con colores personalizados para categorías
          </p>
          <TagInput
            value={coloredTags}
            onChange={setColoredTags}
            availableTags={categoryTags}
            label="Categorías"
            placeholder="Selecciona categorías..."
          />
        </Card>

        {/* Con búsqueda async */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">🔍 TagInput con Búsqueda Async</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Busca tags en la base de datos mientras escribes
          </p>
          <TagInput
            value={searchedTags}
            onChange={setSearchedTags}
            onSearchTags={handleSearchTags}
            onCreateTag={handleCreateTag}
            label="Habilidades"
            placeholder="Busca o crea habilidades..."
            showSearchIcon
            helperText="Los tags nuevos se guardarán en la BD automáticamente"
          />
        </Card>

        {/* Con límite y validación */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">⚠️ TagInput con Límite y Validación</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Máximo 3 tags, con validación de formato
          </p>
          <TagInput
            value={limitedTags}
            onChange={setLimitedTags}
            availableTags={availableTags}
            maxTags={3}
            validateTag={validateTag}
            label="Tags importantes"
            placeholder="Máximo 3 tags..."
            helperText="Solo letras, números, espacios, guiones y guiones bajos (2-20 caracteres)"
          />
        </Card>

        {/* Características */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">✨ Características</h3>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2 list-disc list-inside">
              <li>✅ Agregar tags escribiendo y presionando Enter</li>
              <li>✅ Eliminar con click en X o Backspace (último tag)</li>
              <li>✅ Búsqueda en tiempo real con filtrado</li>
              <li>✅ Creación dinámica de nuevos tags</li>
              <li>✅ Tags marcados como "NEW" hasta guardar</li>
              <li>✅ Callback async para guardar en BD</li>
              <li>✅ Validación personalizada</li>
              <li>✅ Límite máximo de tags</li>
              <li>✅ Colores personalizados por tag</li>
              <li>✅ Loading states durante búsqueda/creación</li>
              <li>✅ Prevención de duplicados</li>
            </ul>
          </div>
        </Card>

        {/* Ejemplo de uso */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">💻 Ejemplo de Código</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs">
{`// Uso básico
<TagInput
  value={tags}
  onChange={setTags}
  availableTags={availableTags}
  label="Etiquetas"
  placeholder="Escribe y presiona Enter..."
/>

// Con creación async en BD
<TagInput
  value={tags}
  onChange={setTags}
  onSearchTags={async (query) => {
    const results = await api.searchTags(query)
    return results
  }}
  onCreateTag={async (label) => {
    const newTag = await api.createTag({ label })
    return newTag
  }}
  maxTags={5}
  validateTag={(label) => {
    if (label.length < 2) return 'Muy corto'
    return null
  }}
/>

// Al guardar el formulario, filtrar tags nuevos
const newTags = tags.filter(tag => tag.isNew)
if (newTags.length > 0) {
  await api.createTags(newTags)
}
await api.updateRecord({ 
  tags: tags.map(t => t.id) 
})`}
            </pre>
          </div>
        </Card>
      </div>
    )
  }

  // --- Date & Time Controls Demo ---
  function DateTimeControlsDemo() {
    const [singleDate, setSingleDate] = useState<Date | null>(null)
    const [dateTime, setDateTime] = useState<Date | null>(null)
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
    const [timeRange, setTimeRange] = useState<[string, string]>(['09:00', '17:00'])

    return (
      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">📅 Date Picker Simple</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Selector de fecha único con calendario desplegable
          </p>
          <DatePickerV2
            label="Selecciona una fecha"
            value={singleDate}
            onChange={setSingleDate}
            placeholder="DD/MM/YYYY"
            placement="auto"
          />
          {singleDate && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                ✓ Fecha seleccionada: {singleDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">🕐 Date Time Picker</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Selector de fecha y hora combinado
          </p>
          <DatePickerV2
            label="Selecciona fecha y hora"
            value={dateTime}
            onChange={setDateTime}
            showTime
            placeholder="DD/MM/YYYY HH:MM"
            placement="auto"
          />
          {dateTime && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                ✓ Fecha y hora: {dateTime.toLocaleString('es-ES', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">📆 Date Range Picker</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Selector de rango de fechas con presets rápidos
          </p>
          <DateRangePickerV2
            label="Selecciona un rango de fechas"
            value={dateRange}
            onChange={setDateRange}
            presets={['today', 'thisWeek', 'thisMonth', 'lastMonth', 'last7days', 'last30days']}
            placeholder="Seleccionar rango"
            placement="auto"
          />
          {(dateRange[0] || dateRange[1]) && (
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg space-y-1">
              <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">
                📍 Desde: {dateRange[0] ? dateRange[0].toLocaleDateString('es-ES') : 'Sin definir'}
              </p>
              <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">
                📍 Hasta: {dateRange[1] ? dateRange[1].toLocaleDateString('es-ES') : 'Sin definir'}
              </p>
              {dateRange[0] && dateRange[1] && (
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                  ⏱ Duración: {Math.ceil((dateRange[1].getTime() - dateRange[0].getTime()) / (1000 * 60 * 60 * 24))} días
                </p>
              )}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">⏰ Time Range Picker</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Selector de rango de horas (ej: horario laboral)
          </p>
          <TimeRangePicker
            label="Selecciona un rango de horas"
            value={timeRange}
            onChange={setTimeRange}
            step={15}
            placement="auto"
          />
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              🕐 Horario seleccionado: {timeRange[0]} - {timeRange[1]}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Intervalo de 15 minutos
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">🎯 Características Avanzadas</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <DatePickerV2
                  label="Con fecha mínima"
                  value={null}
                  onChange={() => {}}
                  minDate={new Date()}
                  placeholder="Solo fechas futuras"
                  placement="auto"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Bloquea fechas pasadas
                </p>
              </div>
              <div>
                <DatePickerV2
                  label="Con fecha máxima"
                  value={null}
                  onChange={() => {}}
                  maxDate={new Date()}
                  placeholder="Solo fechas pasadas"
                  placement="auto"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Bloquea fechas futuras
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                ✨ Funcionalidades incluidas:
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                <li>Navegación con botones &lt;&lt; y &gt;&gt; para años</li>
                <li>Navegación con botones &lt; y &gt; para meses</li>
                <li>Click en mes o año para selección rápida</li>
                <li>Validación automática de rangos</li>
                <li>Formato flexible (fecha sola o con hora)</li>
                <li>Validación: fecha inicio debe ser menor que fecha fin</li>
                <li>Presets rápidos para rangos comunes</li>
                <li>Posicionamiento inteligente (auto, top, bottom)</li>
                <li>Soporte completo para modo oscuro</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // --- Scheduler Demo ---
  function SchedulerDemo() {
    const [appointments, setAppointments] = useState<Appointment[]>([
      {
        id: 1,
        title: 'Reunión de equipo',
        description: 'Revisión semanal del proyecto',
        start: new Date(2025, 10, 18, 10, 0),
        end: new Date(2025, 10, 18, 11, 0),
        status: 'pending',
        color: '#3b82f6',
      },
      {
        id: 2,
        title: 'Presentación cliente',
        description: 'Demo del nuevo producto',
        start: new Date(2025, 10, 18, 14, 0),
        end: new Date(2025, 10, 18, 15, 30),
        status: 'completed',
        color: '#10b981',
      },
      {
        id: 3,
        title: 'Workshop técnico',
        start: new Date(2025, 10, 19, 9, 0),
        end: new Date(2025, 10, 19, 12, 0),
        status: 'pending',
        color: '#f59e0b',
      },
    ])

    const config: SchedulerConfig = {
      showDescription: true,
      showStatus: true,
      allowOverlap: false,
      workingHours: { start: '08:00', end: '18:00' },
      minDuration: 30,
      hoverFields: ['description', 'status'],
      customFields: [
        {
          name: 'location',
          label: 'Ubicación',
          type: 'select',
          options: ['Oficina Central', 'Sala de Juntas', 'Remoto', 'Cliente'],
          required: false,
        },
      ],
    }

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
            🗓️ Sistema completo de agendamiento
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Múltiples vistas: Día, Semana, Mes, Bimestre, Trimestre, Semestre, Año</li>
            <li>CRUD completo de citas (Crear, Leer, Actualizar, Eliminar)</li>
            <li>Estados: Pendiente, Completada, Cancelada</li>
            <li>Validación de conflictos de horarios</li>
            <li>Hover con información detallada</li>
            <li>Filtros dinámicos por estado</li>
            <li>Campos personalizables</li>
            <li>Configuración de horario laboral</li>
            <li>Duración mínima/máxima</li>
            <li>Integración con API (callbacks configurables)</li>
            <li>Responsive y totalmente funcional</li>
          </ul>
        </div>

        <Card className="p-0">
          <Scheduler
            appointments={appointments}
            onAppointmentsChange={setAppointments}
            config={config}
            defaultView="week"
            defaultDate={new Date(2025, 10, 18)}
          />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Integración con API</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            El componente Scheduler puede integrarse fácilmente con tu backend mediante callbacks:
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <pre className="text-xs overflow-x-auto">
              <code>{`const config: SchedulerConfig = {
  onFetchAppointments: async (start, end) => {
    const response = await api.get('/appointments', {
      params: { start, end }
    })
    return response.data
  },
  onCreateAppointment: async (appointment) => {
    const response = await api.post('/appointments', appointment)
    return response.data
  },
  onUpdateAppointment: async (id, appointment) => {
    const response = await api.put(\`/appointments/\${id}\`, appointment)
    return response.data
  },
  onDeleteAppointment: async (id) => {
    await api.delete(\`/appointments/\${id}\`)
  }
}`}</code>
            </pre>
          </div>
        </Card>
      </div>
    )
  }

  // --- FloatingActionButton Demo ---
  function FABDemo() {
    const [showFabs, setShowFabs] = useState(true)

    return (
      <div className="space-y-6">
        {/* Toggle para mostrar/ocultar FABs */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Visualización de FABs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Los FABs se muestran en la pantalla con posicionamiento absoluto</p>
            </div>
            <Switch
              checked={showFabs}
              onChange={setShowFabs}
              label="Mostrar FABs"
            />
          </div>
        </Card>

        {/* FABs en diferentes posiciones */}
        {showFabs && (
          <>
            {/* FAB simple bottom-right */}
            <FloatingActionButton
              icon={<PlusIcon />}
              label="Nueva acción"
              position="bottom-right"
              onClick={() => notify.success('FAB clicked', 'Acción principal ejecutada')}
            />

            {/* FAB con sub-menú bottom-left */}
            <FloatingActionButton
              icon={<PlusIcon />}
              position="bottom-left"
              size="md"
              variant="success"
              actions={[
                {
                  icon: <UserIcon className="h-5 w-5" />,
                  label: 'Nuevo Usuario',
                  onClick: () => notify.info('Usuario', 'Crear nuevo usuario'),
                  variant: 'primary',
                },
                {
                  icon: <DocumentIcon className="h-5 w-5" />,
                  label: 'Nuevo Documento',
                  onClick: () => notify.info('Documento', 'Crear nuevo documento'),
                  variant: 'secondary',
                },
                {
                  icon: <EnvelopeIcon className="h-5 w-5" />,
                  label: 'Nuevo Email',
                  onClick: () => notify.info('Email', 'Componer nuevo email'),
                  variant: 'warning',
                },
                {
                  icon: <ChatBubbleLeftIcon className="h-5 w-5" />,
                  label: 'Nuevo Chat',
                  onClick: () => notify.info('Chat', 'Iniciar nuevo chat'),
                  variant: 'success',
                },
              ]}
            />
          </>
        )}

        {/* Descripción */}
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Características del FAB</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Posicionamiento fijo en diferentes ubicaciones (bottom-right, bottom-left, top-right, top-left, bottom-center)</li>
                <li>Tamaños configurables (sm, md, lg)</li>
                <li>Variantes de color (primary, secondary, success, danger, warning)</li>
                <li>Sub-menú expandible con múltiples acciones</li>
                <li>Animaciones suaves al expandir/contraer</li>
                <li>Etiquetas con tooltip al hover</li>
                <li>Icono rotativo al expandir (X cuando está abierto)</li>
                <li>Click fuera para cerrar automáticamente</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">FABs en esta demo:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>Bottom-Right:</strong> FAB simple con acción directa (azul)</li>
                <li><strong>Bottom-Left:</strong> FAB con 4 sub-acciones expandibles (verde)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Código de ejemplo */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Código de Ejemplo</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">FAB Simple:</h4>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{`<FloatingActionButton
  icon={<PlusIcon />}
  label="Nueva acción"
  position="bottom-right"
  onClick={() => handleAction()}
/>`}</code>
              </pre>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">FAB con Sub-menú:</h4>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{`<FloatingActionButton
  icon={<PlusIcon />}
  position="bottom-left"
  size="md"
  variant="success"
  actions={[
    {
      icon: <UserIcon />,
      label: 'Nuevo Usuario',
      onClick: () => createUser(),
      variant: 'primary',
    },
    {
      icon: <DocumentIcon />,
      label: 'Nuevo Documento',
      onClick: () => createDocument(),
      variant: 'secondary',
    },
  ]}
/>`}</code>
              </pre>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Biblioteca de Componentes UI
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Colección completa de componentes modernos y reutilizables con soporte para modo oscuro y animaciones fluidas
        </p>
      </div>

      {/* Configuración de Locale y Formato */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              🌍 Configuración Global de Idioma y Formato
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Los componentes DatePicker, DateRangePicker y otros se adaptan automáticamente al idioma y formato seleccionado
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Selector de Idioma */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Idioma / Locale
                </label>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as LocaleCode)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(LOCALE_CONFIGS).map(([code, config]) => (
                    <option key={code} value={code}>
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Formato de Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Formato de Fecha
                </label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value as DateFormat)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dd/mm/yyyy">dd/mm/yyyy (31/12/2024)</option>
                  <option value="mm/dd/yyyy">mm/dd/yyyy (12/31/2024)</option>
                  <option value="d/m/y">d/m/y (31/12/2024)</option>
                  <option value="yyyy-mm-dd">yyyy-mm-dd (2024-12-31)</option>
                  <option value="dd-mm-yyyy">dd-mm-yyyy (31-12-2024)</option>
                </select>
              </div>

              {/* Selector de Formato de Hora */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Formato de Hora
                </label>
                <select
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value as TimeFormat)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="24h">24 horas (14:30)</option>
                  <option value="12h">12 horas (2:30 PM)</option>
                </select>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>📝 Nota:</strong> Estos cambios afectan globalmente a todos los componentes de fecha.
                Puedes sobreescribir el formato individualmente usando las props <code className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded">dateFormat</code> y <code className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded">timeFormat</code> en cada componente.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Divider />

      {/* Breadcrumb */}
      <section>
        <SectionHeader 
          title="Breadcrumb" 
          subtitle="Navegación de migas de pan con múltiples estilos"
        />
        <Card>
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            <Breadcrumb items={breadcrumbItems} separator="slash" showHome={false} />
          </div>
        </Card>
      </section>

      <Divider />

      {/* Alerts */}
      <section>
        <SectionHeader 
          title="Alerts" 
          subtitle="Alertas con 4 variantes de color y opción de cierre"
        />
        <div className="space-y-4">
          <Alert variant="success" title="¡Éxito!">
            La operación se completó correctamente.
          </Alert>
          <Alert variant="error" title="Error" onClose={() => {}}>
            Ocurrió un error al procesar la solicitud.
          </Alert>
          <Alert variant="warning">
            Esta acción no se puede deshacer.
          </Alert>
          <Alert variant="info">
            Tienes 3 notificaciones nuevas.
          </Alert>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <SectionHeader 
          title="Buttons & Button Groups" 
          subtitle="Botones con múltiples variantes y grupos de botones"
        />
        <Card>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <ButtonGroup>
              <Button>Izquierda</Button>
              <Button>Centro</Button>
              <Button>Derecha</Button>
            </ButtonGroup>
          </div>
        </Card>
      </section>

      <Divider />

      {/* Avatars */}
      <section>
        <SectionHeader 
          title="Avatars" 
          subtitle="Avatares con tamaños, estados y grupos de usuarios"
        />
        <Card>
          <div className="flex items-center gap-4">
            <Avatar name="Juan Pérez" size="xs" status="online" />
            <Avatar name="María García" size="sm" status="away" />
            <Avatar name="Pedro López" size="md" status="busy" />
            <Avatar name="Ana Martínez" size="lg" />
            <Avatar name="Carlos Rodríguez" size="xl" shape="square" />
          </div>
          <div className="mt-4">
            <AvatarGroup
              avatars={[
                { name: 'Usuario 1' },
                { name: 'Usuario 2' },
                { name: 'Usuario 3' },
                { name: 'Usuario 4' },
                { name: 'Usuario 5' },
              ]}
              max={3}
            />
          </div>
        </Card>
      </section>

      <Divider />

      {/* Spinners */}
      <section>
        <SectionHeader 
          title="Spinners" 
          subtitle="Indicadores de carga con múltiples estilos y animaciones"
        />
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Spinners Estándar
            </h3>
            <div className="flex gap-8 items-center">
              <Spinner variant="circle" size="sm" />
              <Spinner variant="dots" size="md" />
              <Spinner variant="bars" size="lg" />
              <Spinner variant="pulse" size="md" />
              <ProgressSpinner progress={75} size="md" />
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Logo Spinners - Con Marca FaruTech
            </h3>
            <div className="flex gap-8 items-center flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="spin" speed="slow" size="sm" />
                <p className="text-xs text-gray-500">Spin Slow</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="spin" speed="normal" size="md" />
                <p className="text-xs text-gray-500">Spin Normal</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="spin" speed="fast" size="lg" />
                <p className="text-xs text-gray-500">Spin Fast</p>
              </div>
            </div>
            
            <Divider />
            
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 mt-4">
              Flip 3D Vertical (Moneda)
            </h3>
            <div className="flex gap-8 items-center flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flip" speed="slow" size="sm" />
                <p className="text-xs text-gray-500">Flip Vertical Slow</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flip" speed="normal" size="md" />
                <p className="text-xs text-gray-500">Flip Vertical Normal</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flip" speed="fast" size="lg" />
                <p className="text-xs text-gray-500">Flip Vertical Fast</p>
              </div>
            </div>
            
            <Divider />
            
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 mt-4">
              Flip 3D Horizontal (Moneda Completa)
            </h3>
            <div className="flex gap-8 items-center flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flipHorizontal" speed="slow" size="sm" />
                <p className="text-xs text-gray-500">Flip Horizontal Slow</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flipHorizontal" speed="normal" size="md" />
                <p className="text-xs text-gray-500">Flip Horizontal Normal</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flipHorizontal" speed="fast" size="lg" />
                <p className="text-xs text-gray-500">Flip Horizontal Fast</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Divider />

      {/* Progress Bars */}
      <section>
        <SectionHeader 
          title="Progress Bars" 
          subtitle="Barras de progreso simples y múltiples con variantes animadas"
        />
        <Card>
          <div className="space-y-4">
            <ProgressBar value={30} label="Progreso básico" showLabel />
            <ProgressBar value={60} variant="gradient" color="success" />
            <ProgressBar value={80} variant="striped" color="warning" />
            <MultiProgressBar
              items={[
                { label: 'Completado', value: 40, color: 'success' },
                { label: 'En progreso', value: 30, color: 'warning' },
                { label: 'Pendiente', value: 30, color: 'error' },
              ]}
            />
          </div>
        </Card>
      </section>

      <Divider />

      {/* Form Controls */}
      <section>
        <SectionHeader 
          title="Form Controls" 
          subtitle="Controles de formulario completos: inputs, selects, checkboxes, radios y más"
        />
        <Card>
          <div className="space-y-6">
            <Input label="Nombre" placeholder="Ingresa tu nombre" />
            <Textarea label="Descripción" placeholder="Escribe una descripción" />
            <PhoneInput
              label="Teléfono"
              value={phoneValue}
              onChange={setPhoneValue}
            />
            <Select
              label="País"
              options={[
                { label: 'México', value: 'mx' },
                { label: 'España', value: 'es' },
                { label: 'Colombia', value: 'co' },
              ]}
            />
            <Switch
              checked={switchValue}
              onChange={setSwitchValue}
              label="Recibir notificaciones"
              description="Te enviaremos actualizaciones por correo"
            />
            <Checkbox
              checked={checkboxValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckboxValue(e.target.checked)}
              label="Acepto los términos y condiciones"
            />
            <CheckboxGroup
              label="Intereses"
              options={checkboxOptions}
              value={checkboxGroupValue}
              onChange={setCheckboxGroupValue}
            />
            <RadioGroup
              label="Selecciona una opción"
              options={radioOptions}
              value={radioValue}
              onChange={setRadioValue}
              variant="card"
            />
          </div>
        </Card>
      </section>

      <Divider />

      {/* Masked Inputs */}
      <MaskedInputDemo />

      <Divider />

      {/* Tag Input */}
      <section>
        <SectionHeader
          title="Tag Input"
          subtitle="Input para agregar/remover tags con búsqueda y creación dinámica"
        />
        <TagInputDemo />
      </section>

      <Divider />

      {/* Data Table (demo) */}
      <section>
        <SectionHeader
          title="Data Table"
          subtitle="Ejemplo de tabla CRUD con selección, ordenamiento y paginación"
        />
        <Card>
          {/* Mock data para demo */}
          <DataTableDemo />
        </Card>
      </section>

      <Divider />

      {/* Dropdowns & ListBox */}
      <section>
        <SectionHeader 
          title="Dropdowns & ListBox" 
          subtitle="Menús desplegables y listas seleccionables con iconos y descripciones"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dropdown
            label="Menú desplegable"
            items={dropdownItems}
            value={dropdownValue}
            onChange={setDropdownValue}
            placeholder="Selecciona una opción"
          />
          <ListBox
            label="Lista con imágenes"
            options={listBoxOptions}
            value={listBoxValue}
            onChange={(value) => {
              if (typeof value === 'string') {
                setListBoxValue(value)
              }
            }}
            placeholder="Selecciona un tipo de usuario"
          />
        </div>
      </section>

      <Divider />

      {/* ListGroup */}
      <section>
        <SectionHeader 
          title="List Groups" 
          subtitle="Listas interactivas con 3 variantes de estilo"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ListGroup items={listGroupItems} variant="default" />
          <ListGroup items={listGroupItems} variant="flush" />
          <ListGroup items={listGroupItems} variant="bordered" />
        </div>
      </section>

      <Divider />

      {/* Tabs */}
      <section>
        <SectionHeader 
          title="Tabs" 
          subtitle="Pestañas con iconos en variantes underline y pills"
        />
        <Card>
          <Tabs tabs={tabs} defaultTab="tab1" />
          <div className="mt-4">
            <Tabs tabs={tabs} variant="pills" />
          </div>
        </Card>
      </section>

      <Divider />

      {/* Carousel */}
      <section>
        <SectionHeader 
          title="Carousel" 
          subtitle="Carrusel de imágenes con autoplay y controles de navegación"
        />
        <Carousel className="h-64" autoPlay interval={5000}>
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            Slide 1
          </div>
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
            Slide 2
          </div>
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
            Slide 3
          </div>
        </Carousel>
      </section>

      <Divider />

      {/* Tooltips */}
      <section>
        <SectionHeader 
          title="Tooltips" 
          subtitle="Tooltips con posicionamiento en 4 direcciones y tipos"
        />
        <Card>
          <div className="space-y-6">
            {/* Posiciones */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Posiciones</h4>
              <div className="flex gap-4 flex-wrap">
                <Tooltip content="Tooltip arriba" position="top">
                  <Button>Hover Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip abajo" position="bottom">
                  <Button>Hover Bottom</Button>
                </Tooltip>
                <Tooltip content="Tooltip izquierda" position="left">
                  <Button>Hover Left</Button>
                </Tooltip>
                <Tooltip content="Tooltip derecha" position="right">
                  <Button>Hover Right</Button>
                </Tooltip>
              </div>
            </div>

            <Divider />

            {/* Tipos con iconos */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tipos (con iconos)</h4>
              <div className="flex gap-4 flex-wrap">
                <Tooltip content="Información útil" type="info" showIcon>
                  <Button variant="secondary">
                    <InformationCircleIcon className="w-4 h-4" />
                    Info
                  </Button>
                </Tooltip>
                <Tooltip content="¡Operación exitosa!" type="success" showIcon>
                  <Button variant="success">
                    <CheckCircleIcon className="w-4 h-4" />
                    Success
                  </Button>
                </Tooltip>
                <Tooltip content="Ten cuidado con esta acción" type="warning" showIcon>
                  <Button>
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    Warning
                  </Button>
                </Tooltip>
                <Tooltip content="Error al procesar" type="error" showIcon>
                  <Button variant="danger">
                    <XCircleIcon className="w-4 h-4" />
                    Error
                  </Button>
                </Tooltip>
                <Tooltip content="Tooltip por defecto" type="default">
                  <Button variant="secondary">Default</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Divider />

      {/* Modal */}
      <section>
        <SectionHeader 
          title="Modal" 
          subtitle="Ventanas modales con overlay y animaciones suaves"
        />
        <Button onClick={() => setIsModalOpen(true)}>Abrir Modal</Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Modal de ejemplo"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Este es un ejemplo de modal con contenido personalizado.
          </p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setIsModalOpen(false)}>Aceptar</Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </div>
        </Modal>
      </section>

      <Divider />

      {/* Badges */}
      <section>
        <SectionHeader 
          title="Badges" 
          subtitle="Etiquetas de estado con 5 variantes de color"
        />
        <Card>
          <div className="flex gap-2">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </Card>
      </section>

      <Divider />

      {/* Search Modal */}
      <section>
        <SectionHeader 
          title="Search Modal" 
          subtitle="Buscador global con navegación por teclado (⌘K o Ctrl+K)"
        />
        <Card>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Modal de búsqueda con resultados agrupados por categorías, soporte para múltiples fuentes de datos y atajos de teclado.
            </p>
            <Button onClick={() => setIsSearchModalOpen(true)}>
              Abrir Buscador (o presiona ⌘K)
            </Button>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>✨ Características:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Navegación con teclado (↑↓ Enter Esc)</li>
                <li>Resultados agrupados por categorías</li>
                <li>Headers no clicleables como separadores</li>
                <li>Soporte para API externa o datos locales</li>
                <li>Búsqueda con debounce automático</li>
              </ul>
            </div>
          </div>
        </Card>
        <SearchModal 
          isOpen={isSearchModalOpen} 
          onClose={() => setIsSearchModalOpen(false)} 
        />
      </section>

      <Divider />

      {/* Logo Spinner Mejorado */}
      <section>
        <SectionHeader 
          title="Logo Spinner" 
          subtitle="Spinner del logo con múltiples variantes y opción de inversión de colores"
        />
        <Card>
          <div className="space-y-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Animación mejorada con opción de invertir colores a mitad del giro. 
              La inversión mantiene la ilusión visual en logos diagonales tipo "S cursiva".
            </p>
            
            {/* Con inversión de colores */}
            <div>
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4">
                ✨ Con Inversión de Colores (invertColors=true)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Secuencia: <span className="font-mono">Positivo (0°) → Negativo (180°) → Positivo (360°)</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Spin 2D</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="spin" size="lg" speed="normal" invertColors={true} />
                  </div>
                  <p className="text-xs text-gray-500">Rotación 2D con inversión</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=true
                  </code>
                </div>

                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Flip 3D Vertical</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="flip" size="lg" speed="normal" invertColors={true} />
                  </div>
                  <p className="text-xs text-gray-500">Flip vertical con inversión</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=true
                  </code>
                </div>

                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Flip 3D Horizontal</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="flipHorizontal" size="lg" speed="normal" invertColors={true} />
                  </div>
                  <p className="text-xs text-gray-500">Flip horizontal con inversión</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=true
                  </code>
                </div>
              </div>
            </div>

            <Divider />

            {/* Sin inversión de colores */}
            <div>
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4">
                🎨 Sin Inversión de Colores (invertColors=false)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Animación normal sin cambios de color. El logo mantiene sus colores originales durante todo el giro.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Spin 2D</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="spin" size="lg" speed="normal" invertColors={false} />
                  </div>
                  <p className="text-xs text-gray-500">Rotación 2D normal</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=false
                  </code>
                </div>

                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Flip 3D Vertical</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="flip" size="lg" speed="normal" invertColors={false} />
                  </div>
                  <p className="text-xs text-gray-500">Flip vertical normal</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=false
                  </code>
                </div>

                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Flip 3D Horizontal</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="flipHorizontal" size="lg" speed="normal" invertColors={false} />
                  </div>
                  <p className="text-xs text-gray-500">Flip horizontal normal</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=false
                  </code>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Velocidades (con inversión)</h4>
              <div className="flex justify-around">
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="md" speed="slow" invertColors />
                  <p className="text-xs text-gray-500">Lento (2s)</p>
                </div>
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="md" speed="normal" invertColors />
                  <p className="text-xs text-gray-500">Normal (1.5s)</p>
                </div>
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="md" speed="fast" invertColors />
                  <p className="text-xs text-gray-500">Rápido (1s)</p>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tamaños</h4>
              <div className="flex justify-around items-end">
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="sm" speed="normal" invertColors />
                  <p className="text-xs text-gray-500">Small</p>
                </div>
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="md" speed="normal" invertColors />
                  <p className="text-xs text-gray-500">Medium</p>
                </div>
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="lg" speed="normal" invertColors />
                  <p className="text-xs text-gray-500">Large</p>
                </div>
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="xl" speed="normal" invertColors />
                  <p className="text-xs text-gray-500">Extra Large</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Divider />

      {/* Date & Time Controls */}
      <section>
        <SectionHeader
          title="Date & Time Controls" 
          subtitle="Controles avanzados de fecha y hora con navegación mejorada y validación"
        />
        <DateTimeControlsDemo />
      </section>

      <Divider />

      {/* Scheduler / Calendar */}
      <section>
        <SectionHeader
          title="Scheduler / Calendar" 
          subtitle="Calendario y agendamiento con múltiples vistas y gestión completa de citas"
        />
        <SchedulerDemo />
      </section>

      <Divider />

      {/* Floating Action Button */}
      <section>
        <SectionHeader
          title="Floating Action Button (FAB)" 
          subtitle="Botón de acción flotante con sub-menú expandible y diferentes posiciones"
        />
        <FABDemo />
      </section>
    </div>
  )
}
