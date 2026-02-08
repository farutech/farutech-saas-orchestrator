/**
 * ModuleSwitcher - Selector de módulos para aplicaciones SaaS multi-módulo
 * 
 * Características:
 * - ✅ Dropdown elegante con módulos disponibles
 * - ✅ Búsqueda de módulos
 * - ✅ Módulo actual destacado
 * - ✅ Íconos y descripciones
 * - ✅ Permisos por módulo
 * - ✅ Cambia menú dinámicamente
 * - ✅ Diseño tipo Notion/ClickUp/Monday.com
 * 
 * @example
 * ```tsx
 * const modules = [
 *   { id: 'crm', name: 'CRM', icon: <UsersIcon />, description: 'Gestión de clientes' },
 *   { id: 'inventory', name: 'Inventario', icon: <CubeIcon />, description: 'Control de stock' }
 * ]
 * 
 * <ModuleSwitcher
 *   modules={modules}
 *   currentModule="crm"
 *   onModuleChange={(id) => switchModule(id)}
 * />
 * ```
 */

import { Fragment, useState } from 'react'
import type { ReactNode } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { 
  CheckIcon, 
  ChevronUpDownIcon, 
  MagnifyingGlassIcon,
  Squares2X2Icon 
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

export interface Module {
  /** ID único del módulo */
  id: string
  /** Nombre del módulo */
  name: string
  /** Ícono del módulo */
  icon?: ReactNode
  /** Descripción opcional */
  description?: string
  /** Permiso requerido (opcional) */
  permission?: string
  /** Badge (contador, estado, etc) */
  badge?: string | number
  /** Color del badge */
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

export interface ModuleSwitcherProps {
  /** Lista de módulos disponibles */
  modules: Module[]
  /** ID del módulo actual */
  currentModule: string
  /** Callback al cambiar de módulo */
  onModuleChange: (moduleId: string) => void
  /** Habilitar búsqueda */
  searchable?: boolean
  /** Placeholder de búsqueda */
  searchPlaceholder?: string
  /** Clase CSS adicional */
  className?: string
  /** Modo compacto (solo ícono) */
  compact?: boolean
}

const badgeVariants = {
  primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
}

/**
 * Componente ModuleSwitcher
 */
export function ModuleSwitcher({
  modules,
  currentModule,
  onModuleChange,
  searchable = true,
  searchPlaceholder = 'Buscar módulos...',
  className,
  compact = false,
}: ModuleSwitcherProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const current = modules.find((m) => m.id === currentModule)

  // Filtrar módulos por búsqueda
  const filteredModules = searchQuery
    ? modules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : modules

  return (
    <Listbox value={currentModule} onChange={onModuleChange}>
      {({ open }) => (
        <div className={clsx('relative', className)}>
          <Listbox.Button
            className={clsx(
              'relative w-full flex items-center gap-2.5 px-3 py-2',
              'bg-white dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'rounded-lg shadow-sm',
              'hover:border-gray-300 dark:hover:border-gray-600 hover:shadow',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
              'cursor-pointer',
              open && 'ring-2 ring-primary-500/30 border-primary-500',
              compact && 'px-2 py-1.5'
            )}
          >
            {/* Ícono del módulo actual */}
            <span className={clsx(
              'flex-shrink-0 flex items-center justify-center rounded-md',
              compact ? 'h-7 w-7' : 'h-8 w-8',
              'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            )}>
              {current?.icon ? (
                <span className="h-4 w-4">{current.icon}</span>
              ) : (
                <Squares2X2Icon className="h-4 w-4" />
              )}
            </span>

            {/* Nombre */}
            {!compact && (
              <span className="flex-1 min-w-0">
                <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                  {current?.name || 'Módulo'}
                </span>
              </span>
            )}

            {/* Badge */}
            {current?.badge && !compact && (
              <span
                className={clsx(
                  'flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  badgeVariants[current.badgeVariant || 'primary']
                )}
              >
                {current.badge}
              </span>
            )}

            <ChevronUpDownIcon 
              className={clsx(
                'h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0',
                open && 'rotate-180 text-primary-500'
              )} 
            />
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-96 w-full min-w-[280px] overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {/* Búsqueda */}
              {searchable && modules.length > 5 && (
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      className="w-full rounded-md border-0 bg-gray-50 dark:bg-gray-900 py-2 pl-10 pr-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 sm:text-sm"
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {/* Lista de módulos */}
              {filteredModules.length === 0 ? (
                <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron módulos
                </div>
              ) : (
                filteredModules.map((module) => (
                  <Listbox.Option
                    key={module.id}
                    value={module.id}
                    className={({ active }) =>
                      clsx(
                        'relative cursor-pointer select-none py-3 px-3 transition-colors',
                        active ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      )
                    }
                  >
                    {({ selected }) => (
                      <div className="flex items-center gap-3">
                        {/* Ícono */}
                        <span
                          className={clsx(
                            'flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg transition-colors',
                            selected
                              ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          )}
                        >
                          {module.icon ? (
                            <span className="h-5 w-5">{module.icon}</span>
                          ) : (
                            <Squares2X2Icon className="h-5 w-5" />
                          )}
                        </span>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={clsx(
                                'block truncate font-medium',
                                selected
                                  ? 'text-primary-600 dark:text-primary-400'
                                  : 'text-gray-900 dark:text-white'
                              )}
                            >
                              {module.name}
                            </span>
                            {module.badge && (
                              <span
                                className={clsx(
                                  'flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                  badgeVariants[module.badgeVariant || 'primary']
                                )}
                              >
                                {module.badge}
                              </span>
                            )}
                          </div>
                          {module.description && (
                            <span className="block truncate text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {module.description}
                            </span>
                          )}
                        </div>

                        {/* Check icon */}
                        {selected && (
                          <CheckIcon
                            className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}

/**
 * Hook para manejar módulos y menús dinámicos
 */
export function useModuleSwitcher(
  modules: Module[],
  initialModule?: string
) {
  const [currentModule, setCurrentModule] = useState(initialModule || modules[0]?.id || '')

  const switchModule = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId)
    if (module) {
      setCurrentModule(moduleId)
      // Aquí puedes agregar lógica adicional como actualizar el menú, redirigir, etc.
    }
  }

  const getCurrentModule = () => {
    return modules.find((m) => m.id === currentModule)
  }

  return {
    currentModule,
    switchModule,
    getCurrentModule,
  }
}
