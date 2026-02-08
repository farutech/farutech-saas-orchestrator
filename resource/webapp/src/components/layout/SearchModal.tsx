/**
 * SearchModal - Modal flotante de búsqueda global con categorías
 * 
 * Características:
 * - Búsqueda con tecla rápida (Cmd/Ctrl + K)
 * - Resultados agrupados por categorías
 * - Navegación con teclado
 * - Soporte para múltiples fuentes de datos
 * - Elementos no clicleables como separadores
 */

import { Fragment, useState, useEffect, useCallback, useRef } from 'react'
import { Dialog, Transition, Combobox } from '@headlessui/react'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  FolderIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

// Tipos para los resultados de búsqueda
export interface SearchResult {
  id: string
  title: string
  description?: string
  category: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: () => void
  metadata?: Record<string, any>
}

export interface SearchCategory {
  id: string
  name: string
  icon?: React.ComponentType<{ className?: string }>
  isHeader?: boolean // Si es true, no es clickeable (solo separador visual)
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  /** Función personalizada para obtener resultados */
  onSearch?: (query: string) => Promise<SearchResult[]> | SearchResult[]
  /** Datos estáticos (si no se proporciona onSearch) */
  data?: SearchResult[]
  /** Categorías personalizadas */
  categories?: SearchCategory[]
}

// Datos de ejemplo (puedes reemplazar con API)
const defaultCategories: SearchCategory[] = [
  { id: 'pages', name: 'Páginas', icon: DocumentTextIcon },
  { id: 'users', name: 'Usuarios', icon: UserGroupIcon },
  { id: 'settings', name: 'Configuración', icon: CogIcon },
  { id: 'reports', name: 'Reportes', icon: ChartBarIcon },
  { id: 'files', name: 'Archivos', icon: FolderIcon },
  { id: 'commands', name: 'Comandos', icon: CommandLineIcon },
]

const defaultData: SearchResult[] = [
  // Páginas
  { id: '1', title: 'Dashboard', description: 'Panel principal', category: 'pages', href: '/dashboard', icon: ChartBarIcon },
  { id: '2', title: 'Componentes', description: 'Galería de componentes UI', category: 'pages', href: '/components', icon: FolderIcon },
  { id: '3', title: 'Usuarios', description: 'Gestión de usuarios', category: 'pages', href: '/users', icon: UserGroupIcon },
  { id: '4', title: 'Procesos', description: 'Gestión de procesos', category: 'pages', href: '/processes', icon: CogIcon },
  
  // Usuarios (datos de ejemplo)
  { id: '5', title: 'Juan Pérez', description: 'juan.perez@example.com', category: 'users', href: '/users/1', icon: UserGroupIcon },
  { id: '6', title: 'María García', description: 'maria.garcia@example.com', category: 'users', href: '/users/2', icon: UserGroupIcon },
  { id: '7', title: 'Carlos Rodríguez', description: 'carlos.rodriguez@example.com', category: 'users', href: '/users/3', icon: UserGroupIcon },
  
  // Configuración
  { id: '8', title: 'Perfil', description: 'Configurar tu perfil', category: 'settings', href: '/settings/profile', icon: CogIcon },
  { id: '9', title: 'Seguridad', description: 'Roles y permisos', category: 'settings', href: '/security/roles', icon: CogIcon },
  { id: '10', title: 'Sistema', description: 'Configuración del sistema', category: 'settings', href: '/settings/system', icon: CogIcon },
  
  // Reportes
  { id: '11', title: 'Ventas Mensuales', description: 'Reporte de ventas del mes', category: 'reports', icon: ChartBarIcon },
  { id: '12', title: 'Usuarios Activos', description: 'Estadísticas de usuarios', category: 'reports', icon: ChartBarIcon },
]

export function SearchModal({
  isOpen,
  onClose,
  onSearch,
  data = defaultData,
  categories = defaultCategories,
}: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  // Búsqueda
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    try {
      if (onSearch) {
        // Usar función personalizada
        const searchResults = await onSearch(searchQuery)
        setResults(searchResults)
      } else {
        // Búsqueda local en los datos
        const filtered = data.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setResults(filtered)
      }
    } catch (error) {
      console.error('Error en búsqueda:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [onSearch, data])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Focus input cuando se abre y limpiar al cerrar
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      // Limpiar búsqueda cuando se cierra el modal
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Agrupar resultados por categoría
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  const handleSelect = (result: SearchResult) => {
    if (result.action) {
      result.action()
    } else if (result.href) {
      navigate(result.href)
    }
    onClose()
    // El query se limpiará automáticamente por el useEffect cuando isOpen cambie a false
  }

  // Función para limpiar la búsqueda
  const handleClear = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  // Atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          // Necesitarías una prop para abrir desde fuera
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-[10vh]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                <Combobox<SearchResult | null> value={null} onChange={(value) => value && handleSelect(value)}>
                  {/* Search Input */}
                  <div className="relative border-b border-gray-200 dark:border-gray-700">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Combobox.Input
                      ref={inputRef}
                      className="h-14 w-full border-0 bg-transparent pl-12 pr-10 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-0 text-base"
                      placeholder="Buscar páginas, usuarios, configuración..."
                      onChange={(event) => setQuery(event.target.value)}
                      value={query}
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleClear()
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group z-20 cursor-pointer"
                        title="Limpiar búsqueda"
                      >
                        <XMarkIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      </button>
                    )}
                  </div>

                  {/* Results */}
                  {(query || results.length > 0) && (
                    <Combobox.Options
                      static
                      className="max-h-[60vh] scroll-py-2 overflow-y-auto border-t border-gray-100 dark:border-gray-700"
                    >
                      {isLoading ? (
                        <div className="px-4 py-14 text-center">
                          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Buscando...
                          </p>
                        </div>
                      ) : results.length === 0 && query ? (
                        <div className="px-4 py-14 text-center">
                          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-4 text-sm text-gray-900 dark:text-gray-100">
                            No se encontraron resultados
                          </p>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Intenta con otros términos de búsqueda
                          </p>
                        </div>
                      ) : (
                        <div className="py-2">
                          {categories.map((category) => {
                            const categoryResults = groupedResults[category.id]
                            if (!categoryResults || categoryResults.length === 0) return null

                            const CategoryIcon = category.icon

                            return (
                              <div key={category.id} className="mb-2">
                                {/* Category Header (no clickeable) */}
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50">
                                  {CategoryIcon && <CategoryIcon className="h-4 w-4" />}
                                  {category.name}
                                </div>

                                {/* Results */}
                                {categoryResults.map((result) => {
                                  const ResultIcon = result.icon
                                  return (
                                    <Combobox.Option
                                      key={result.id}
                                      value={result}
                                      className={({ active }) =>
                                        clsx(
                                          'cursor-pointer select-none px-4 py-3 flex items-center gap-3 transition-colors',
                                          active
                                            ? 'bg-primary-600 text-white'
                                            : 'text-gray-900 dark:text-gray-100'
                                        )
                                      }
                                    >
                                      {({ active }) => (
                                        <>
                                          {ResultIcon && (
                                            <ResultIcon
                                              className={clsx(
                                                'h-5 w-5 flex-shrink-0',
                                                active
                                                  ? 'text-white'
                                                  : 'text-gray-400 dark:text-gray-500'
                                              )}
                                            />
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                              {result.title}
                                            </p>
                                            {result.description && (
                                              <p
                                                className={clsx(
                                                  'text-sm truncate',
                                                  active
                                                    ? 'text-white/80'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                )}
                                              >
                                                {result.description}
                                              </p>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </Combobox.Option>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </Combobox.Options>
                  )}

                  {/* Footer con atajos */}
                  {!query && (
                    <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                            ↑↓
                          </kbd>
                          <span>Navegar</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                            ↵
                          </kbd>
                          <span>Seleccionar</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                            Esc
                          </kbd>
                          <span>Cerrar</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                          ⌘K
                        </kbd>
                        <span>o</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                          Ctrl+K
                        </kbd>
                      </div>
                    </div>
                  )}
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
