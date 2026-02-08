/**
 * DataTable - Componente de tabla de datos completo y profesional
 * 
 * Características:
 * - ✅ Búsqueda integrada (sin duplicados)
 * - ✅ Acciones globales (crear, eliminar seleccionados, custom)
 * - ✅ Acciones por fila parametrizables
 * - ✅ Selección múltiple
 * - ✅ Paginación con header/footer opcionales
 * - ✅ Estados vacíos profesionales
 * - ✅ Responsive (cards en mobile)
 * - ✅ Ordenamiento por columnas
 * 
 * @example Con acciones globales
 * ```tsx
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   globalActions={[
 *     { label: 'Crear Usuario', onClick: () => create(), icon: <PlusIcon />, variant: 'primary' },
 *     { label: 'Eliminar', onClick: (ids) => deleteMany(ids), icon: <TrashIcon />, variant: 'danger', requiresSelection: true }
 *   ]}
 * />
 * ```
 */

import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  InboxIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Card } from './Card'
import { Input } from './Input'
import { Select } from './Select'
import { Button } from './Button'
import { DatePicker, DateRangePicker } from './DateControls'
import { CrudActions } from '@/components/crud/CrudActions'
import { CrudPagination } from '@/components/crud/CrudPagination'

/**
 * Configuración de paginación
 */
export interface DataTablePagination {
  page: number
  perPage: number
  total: number
  totalPages?: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
}

/**
 * Tipo de filtro
 */
export type FilterType = 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'numberrange' | 'location' | 'color'

/**
 * Configuración de filtro
 */
export interface DataTableFilter {
  /** ID del filtro (debe coincidir con el accessorKey de la columna) */
  id: string
  /** Etiqueta del filtro */
  label: string
  /** Tipo de filtro */
  type: FilterType
  /** Opciones para select/multiselect */
  options?: Array<{ label: string; value: string | number }>
  /** Placeholder del input */
  placeholder?: string
  /** Ancho del filtro (clases de Tailwind) */
  width?: string
  /** Valor por defecto */
  defaultValue?: any
}

/**
 * Estado de filtros activos
 */
export type FilterState = Record<string, any>

/**
 * Acción global de la tabla
 */
export interface DataTableGlobalAction {
  /** Etiqueta del botón */
  label: string
  /** Ícono opcional */
  icon?: ReactNode
  /** Variante de estilo */
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  /** Función onClick: si requiresSelection=true, recibe los IDs seleccionados */
  onClick: (selectedIds?: Set<string | number>) => void
  /** Requiere que haya filas seleccionadas para habilitarse */
  requiresSelection?: boolean
  /** Mostrar solo cuando hay selección */
  showOnlyWhenSelected?: boolean
}

/**
 * Acciones por fila
 */
export interface DataTableActions<T = any> {
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onDuplicate?: (row: T) => void
  custom?: Array<{
    label: string
    icon?: ReactNode
    onClick: (row: T) => void
    variant?: 'default' | 'danger'
    show?: (row: T) => boolean
  }>
}

/**
 * Props del componente DataTable
 */
export interface DataTableProps<T extends { id: string | number }> {
  data: T[]
  columns: ColumnDef<T, any>[]
  
  // Estados
  isLoading?: boolean
  emptyMessage?: string
  emptyIcon?: ReactNode
  
  // Paginación
  pagination?: DataTablePagination
  /** Mostrar header también en footer (útil para tablas largas) */
  showFooter?: boolean
  
  // Búsqueda
  searchable?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  
  // Filtros
  filters?: DataTableFilter[]
  filterValues?: FilterState
  onFilterChange?: (filters: FilterState) => void
  
  // Selección
  selectable?: boolean
  selectedRows?: Set<string | number>
  onSelectionChange?: (selected: Set<string | number>) => void
  
  // Acciones
  /** Acciones por fila */
  actions?: DataTableActions<T>
  /** Acciones globales (botones arriba de la tabla) */
  globalActions?: DataTableGlobalAction[]
  onRowClick?: (row: T) => void
  
  // Responsive
  responsiveCards?: boolean
  
  // Estilos
  className?: string
  wrapped?: boolean
}

/**
 * Componente DataTable
 */
export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No hay registros disponibles',
  emptyIcon,
  pagination,
  showFooter = false,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearch,
  filters = [],
  filterValues = {},
  onFilterChange,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  actions,
  globalActions = [],
  onRowClick,
  responsiveCards = true,
  className,
  wrapped = true,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [showFilters, setShowFilters] = useState(false)

  // Agregar columna de acciones si está definido
  const enhancedColumns = useMemo(() => {
    if (!actions) return columns

    const actionsColumn: ColumnDef<T, any> = {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <CrudActions
          onView={actions.onView ? () => actions.onView?.(row.original) : undefined}
          onEdit={actions.onEdit ? () => actions.onEdit?.(row.original) : undefined}
          onDelete={actions.onDelete ? () => actions.onDelete?.(row.original) : undefined}
          onDuplicate={actions.onDuplicate ? () => actions.onDuplicate?.(row.original) : undefined}
          customActions={actions.custom?.map((action) => ({
            label: action.label,
            icon: action.icon,
            onClick: () => action.onClick(row.original),
            variant: action.variant,
            show: action.show ? action.show(row.original) : true,
          }))}
        />
      ),
    }

    return [...columns, actionsColumn]
  }, [columns, actions])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    
    if (selectedRows.size === data.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(data.map((row) => row.id)))
    }
  }

  const handleSelectRow = (id: string | number) => {
    if (!onSelectionChange) return
    
    const newSelection = new Set(selectedRows)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    onSelectionChange(newSelection)
  }

  const hasSelection = selectedRows.size > 0
  const visibleGlobalActions = globalActions.filter(
    (action) => !action.showOnlyWhenSelected || hasSelection
  )

  // Manejo de filtros
  const handleFilterChange = (filterId: string, value: any) => {
    if (!onFilterChange) return
    
    const newFilters = { ...filterValues, [filterId]: value }
    
    // Eliminar filtros vacíos
    if (value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[filterId]
    }
    
    onFilterChange(newFilters)
  }

  const handleClearFilters = () => {
    if (!onFilterChange) return
    onFilterChange({})
  }

  const activeFiltersCount = Object.keys(filterValues).length
  const hasFilters = filters.length > 0

  // Renderizar barra de acciones globales y búsqueda
  const renderToolbar = () => {
    const hasToolbar = searchable || visibleGlobalActions.length > 0 || hasFilters

    if (!hasToolbar) return null

    return (
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Búsqueda */}
        {searchable && (
          <div className="flex-1">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              className="w-full"
            />
          </div>
        )}

        {/* Acciones globales + Botón de filtros */}
        {(visibleGlobalActions.length > 0 || hasFilters) && (
          <div className="flex gap-2 flex-wrap">
            {/* Botón de filtros */}
            {hasFilters && (
              <Button
                variant={showFilters ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="whitespace-nowrap"
              >
                <FunnelIcon className="h-4 w-4 mr-1.5" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white/20 rounded">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            )}

            {/* Acciones globales */}
            {visibleGlobalActions.map((action, index) => {
              const isDisabled = action.requiresSelection && !hasSelection

              return (
                <Button
                  key={index}
                  variant={action.variant || 'secondary'}
                  size="sm"
                  onClick={() => action.onClick(selectedRows)}
                  disabled={isDisabled}
                  className="whitespace-nowrap"
                >
                  {action.icon && <span className="mr-1.5">{action.icon}</span>}
                  {action.label}
                  {action.requiresSelection && hasSelection && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white/20 rounded">
                      {selectedRows.size}
                    </span>
                  )}
                </Button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Renderizar filtros
  const renderFilters = () => {
    if (!hasFilters || !showFilters) return null

    return (
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FunnelIcon className="h-4 w-4" />
            Filtros Activos
          </h4>
          {activeFiltersCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              <XMarkIcon className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filters.map((filter) => (
            <div key={filter.id} className={filter.width || 'col-span-1'}>
              {renderFilterControl(filter)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Renderizar control de filtro según tipo
  const renderFilterControl = (filter: DataTableFilter) => {
    const value = filterValues[filter.id]

    switch (filter.type) {
      case 'text':
        return (
          <Input
            label={filter.label}
            placeholder={filter.placeholder || `Buscar por ${filter.label.toLowerCase()}...`}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
          />
        )

      case 'select':
        return (
          <Select
            label={filter.label}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            options={[
              { label: `Todos los ${filter.label.toLowerCase()}`, value: '' },
              ...(filter.options || []),
            ]}
          />
        )

      case 'multiselect':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            <select
              multiple
              value={value || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value)
                handleFilterChange(filter.id, selected)
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mantén Ctrl/Cmd para seleccionar múltiples
            </p>
          </div>
        )

      case 'date':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            <DatePicker
              value={value ? new Date(value) : null}
              onChange={(date) => handleFilterChange(filter.id, date?.toISOString())}
              placeholder={filter.placeholder}
            />
          </div>
        )

      case 'daterange':
        return (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            <DateRangePicker
              value={value ? [new Date(value[0]), new Date(value[1])] : [null, null]}
              onChange={(range) => {
                if (range[0] && range[1]) {
                  handleFilterChange(filter.id, [range[0].toISOString(), range[1].toISOString()])
                } else {
                  handleFilterChange(filter.id, null)
                }
              }}
            />
          </div>
        )

      case 'number':
        return (
          <Input
            type="number"
            label={filter.label}
            placeholder={filter.placeholder || `Filtrar por ${filter.label.toLowerCase()}...`}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value ? Number(e.target.value) : '')}
          />
        )

      case 'numberrange':
        return (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Mínimo"
                value={value?.min || ''}
                onChange={(e) => {
                  const newValue = { ...(value || {}), min: e.target.value ? Number(e.target.value) : undefined }
                  handleFilterChange(filter.id, newValue.min || newValue.max ? newValue : null)
                }}
              />
              <Input
                type="number"
                placeholder="Máximo"
                value={value?.max || ''}
                onChange={(e) => {
                  const newValue = { ...(value || {}), max: e.target.value ? Number(e.target.value) : undefined }
                  handleFilterChange(filter.id, newValue.min || newValue.max ? newValue : null)
                }}
              />
            </div>
          </div>
        )

      case 'location':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            <div className="relative">
              <Input
                placeholder={filter.placeholder || `Buscar ${filter.label.toLowerCase()}...`}
                value={value || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            {filter.options && filter.options.length > 0 && (
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Ubicaciones disponibles: {filter.options.map(o => o.label).join(', ')}
              </div>
            )}
          </div>
        )

      case 'color':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            {filter.options && filter.options.length > 0 ? (
              // Color picker con opciones predefinidas
              <div className="flex flex-wrap gap-2">
                {filter.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFilterChange(filter.id, option.value)}
                    className={clsx(
                      'relative w-10 h-10 rounded-lg border-2 transition-all',
                      value === option.value
                        ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800 border-primary-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    )}
                    style={{ backgroundColor: String(option.value) }}
                    title={option.label}
                  >
                    {value === option.value && (
                      <svg
                        className="absolute inset-0 m-auto h-6 w-6 text-white drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
                {value && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange(filter.id, null)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    title="Limpiar color"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              // Color picker nativo
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value || '#000000'}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  className="h-10 w-20 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <Input
                  placeholder="#000000"
                  value={value || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  className="flex-1"
                />
                {value && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange(filter.id, null)}
                    className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Empty state mejorado
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 dark:text-gray-500 mb-4">
        {emptyIcon || <InboxIcon className="h-16 w-16" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {emptyMessage}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        {searchValue
          ? 'Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.'
          : 'Comienza agregando nuevos registros usando el botón de arriba.'}
      </p>
    </div>
  )

  // Loading skeleton
  const renderLoadingState = () => (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
      ))}
    </div>
  )

  // Renderizar tabla desktop
  const renderDesktopTable = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Header */}
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {selectable && (
              <th className="w-12 px-3 py-3">
                <input
                  type="checkbox"
                  checked={data.length > 0 && selectedRows.size === data.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
              </th>
            )}
            {table.getHeaderGroups()[0]?.headers.map((header) => (
              <th
                key={header.id}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {header.isPlaceholder ? null : (
                  <div
                    className={clsx(
                      'flex items-center gap-2',
                      header.column.getCanSort() && 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className="flex flex-col">
                        <ChevronUpIcon
                          className={clsx(
                            'h-3 w-3 -mb-1',
                            header.column.getIsSorted() === 'asc' ? 'text-primary-600' : 'text-gray-300'
                          )}
                        />
                        <ChevronDownIcon
                          className={clsx(
                            'h-3 w-3',
                            header.column.getIsSorted() === 'desc' ? 'text-primary-600' : 'text-gray-300'
                          )}
                        />
                      </span>
                    )}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={clsx(
                'transition-colors duration-150',
                onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800',
                selectedRows.has(row.original.id) && 'bg-primary-50 dark:bg-primary-900/20'
              )}
              onClick={() => onRowClick?.(row.original)}
            >
              {selectable && (
                <td className="w-12 px-3 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.original.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleSelectRow(row.original.id)
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                  />
                </td>
              )}
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {/* Footer (opcional) */}
        {showFooter && (
          <tfoot className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {selectable && <th className="w-12" />}
              {table.getHeaderGroups()[0]?.headers.map((header) => (
                <th
                  key={`footer-${header.id}`}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )

  // Renderizar cards mobile
  const renderMobileCards = () => {
    if (!responsiveCards) return null

    return (
      <div className="md:hidden space-y-3">
        {table.getRowModel().rows.map((row) => (
          <Card
            key={row.id}
            className={clsx(
              'p-4',
              onRowClick && 'cursor-pointer active:scale-[0.98]',
              selectedRows.has(row.original.id) && 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
            )}
            onClick={() => onRowClick?.(row.original)}
          >
            {selectable && (
              <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.original.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleSelectRow(row.original.id)
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Seleccionar
                  </span>
                </label>
              </div>
            )}

            <div className="space-y-2">
              {row.getVisibleCells().map((cell) => {
                // Saltar columna de acciones en mobile (se muestra al final)
                if (cell.column.id === 'actions') return null

                const header = cell.column.columnDef.header
                const headerText = typeof header === 'string' ? header : cell.column.id

                return (
                  <div key={cell.id} className="flex justify-between items-start gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide min-w-[80px]">
                      {headerText}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 text-right flex-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Acciones al final del card */}
            {actions && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <CrudActions
                  onView={actions.onView ? () => actions.onView?.(row.original) : undefined}
                  onEdit={actions.onEdit ? () => actions.onEdit?.(row.original) : undefined}
                  onDelete={actions.onDelete ? () => actions.onDelete?.(row.original) : undefined}
                  onDuplicate={actions.onDuplicate ? () => actions.onDuplicate?.(row.original) : undefined}
                  customActions={actions.custom?.map((action) => ({
                    label: action.label,
                    icon: action.icon,
                    onClick: () => action.onClick(row.original),
                    variant: action.variant,
                    show: action.show ? action.show(row.original) : true,
                  }))}
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    )
  }

  const content = (
    <div className={className}>
      {renderToolbar()}
      {renderFilters()}

      {isLoading ? (
        renderLoadingState()
      ) : data.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {renderDesktopTable()}
          {renderMobileCards()}
        </>
      )}

      {/* Paginación */}
      {pagination && data.length > 0 && (
        <div className="mt-4">
          <CrudPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages || Math.ceil(pagination.total / pagination.perPage)}
            perPage={pagination.perPage}
            total={pagination.total}
            onPageChange={pagination.onPageChange}
            onPerPageChange={pagination.onPerPageChange}
          />
        </div>
      )}
    </div>
  )

  return wrapped ? <Card>{content}</Card> : content
}
