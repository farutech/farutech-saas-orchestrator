/**
 * Componente Sidebar con menú colapsable, categorías y animaciones mejoradas
 */

import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useSidebarStore } from '@/store/sidebarStore'
import { useModuleStore } from '@/store/moduleStore'
import { useConfig } from '@/contexts/ConfigContext'
import type { MenuEntry, MenuCategory, MenuItemBase } from '@/config/menu.config'

import { useMenu } from '@/hooks/useMenu'
import { IconRenderer } from '@/components/ui/IconRenderer'
import { ModuleSwitcher } from '@/components/ui'

function isCategory(item: MenuEntry): item is MenuCategory {
  return !!(item && (item as any).items && Array.isArray((item as any).items))
}

function CategoryItem({ category, isExpanded, onToggle }: { category: MenuCategory; isExpanded: boolean; onToggle: () => void }) {
  const { isMobile, close } = useSidebarStore()

  return (
    <div className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 uppercase tracking-wider group"
      >
        <div className="flex items-center gap-2.5">
          {category.icon && (() => {
            const Icon = category.icon
            return <Icon className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
          })()}
          <span className="transition-colors duration-200">{category.name}</span>
        </div>
        <ChevronRightIcon
          className={clsx(
            'h-3.5 w-3.5 transition-all duration-300 ease-out',
            isExpanded ? 'rotate-90 text-primary-600 dark:text-primary-400' : 'text-gray-400'
          )}
        />
      </button>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
        )}
      >
        <div className="ml-4 space-y-0.5 animate-in slide-in-from-top-2">
          {category.items.map((item: MenuItemBase, index: number) => (
            <NavLink
              key={item.name}
              to={item.href ?? '#'}
              style={{ animationDelay: `${index * 50}ms` }}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:translate-x-0.5'
                )
              }
              onClick={() => isMobile && close()}
            >
              {item.icon && (() => { const Icon = item.icon; return <Icon className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" /> })()}
              <span className="transition-colors duration-200">{item.name}</span>
              {item.badge !== undefined && (
                <span className="ml-auto inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

function CollapsedCategoryItem({ category }: { category: MenuCategory }) {
  const [isHovered, setIsHovered] = useState(false)
  const [popupTop, setPopupTop] = useState<number>(0)
  const { isMobile, close } = useSidebarStore()
  const leaveTimeoutRef = useRef<number | null>(null)

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }

    setIsHovered(true)

    const rect = e.currentTarget.getBoundingClientRect()
    const buttonTop = rect.top - 12
    const popupMaxHeight = Math.min(400, window.innerHeight - 200)
    const spaceBelow = window.innerHeight - rect.bottom

    if (spaceBelow < popupMaxHeight && rect.top > spaceBelow) {
      setPopupTop(buttonTop - popupMaxHeight)
    } else {
      setPopupTop(buttonTop)
    }
  }

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = window.setTimeout(() => {
      setIsHovered(false)
    }, 150)
  }

  const handlePopupMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
    setIsHovered(true)
  }

  const handlePopupMouseLeave = () => {
    setIsHovered(false)
  }

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={clsx(
          'flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 cursor-pointer group',
          isHovered
            ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 scale-105 shadow-md shadow-primary-200/50 dark:shadow-primary-900/30'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        )}
        title={category.name}
      >
        {category.icon && (() => { const Icon = category.icon; return <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" /> })()}
      </div>

      {isHovered && (
        <div
          className="fixed w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 animate-in fade-in slide-in-from-left-3 duration-200 backdrop-blur-xl"
          style={{
            zIndex: 99999,
            left: '64px',
            top: `${popupTop}px`,
          }}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50/50 via-transparent to-transparent dark:from-primary-900/10">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-md">
                {category.icon && (() => { const Icon = category.icon; return <Icon className="h-4 w-4 text-white" /> })()}
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{category.name}</span>
            </div>
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar px-2 py-1">
            {category.items.map((item: MenuItemBase, index: number) => (
              <NavLink
                key={item.name}
                to={item.href ?? '#'}
                style={{ animationDelay: `${index * 30}ms` }}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl text-sm transition-all duration-200 group animate-in slide-in-from-left-2 fade-in',
                    isActive
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 font-semibold shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:translate-x-1'
                  )
                }
                onClick={() => isMobile && close()}
              >
                {item.icon && (() => { const Icon = item.icon; return <Icon className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" /> })()}
                <span className="flex-1">{item.name}</span>
                {item.badge !== undefined && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg shadow-red-600/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { isOpen, isMobile, close, setSidebarWidth } = useSidebarStore()
  const { currentModule, modules, setCurrentModule } = useModuleStore()
  const { config } = useConfig()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [localWidth, setLocalWidth] = useState(256) // Default 256px (w-64)
  const [isResizing, setIsResizing] = useState(false)
  const { menu } = useMenu()
  const navigate = useNavigate()

  const minWidth = 200
  const maxWidth = 400

  const handleCategoryToggle = (categoryName: string) => {
    setExpandedCategory(prev => prev === categoryName ? null : categoryName)
  }

  // Manejar cambio de módulo con navegación
  const handleModuleChange = (moduleId: string) => {
    setCurrentModule(moduleId)
    
    // Navegar al dashboard del módulo
    const moduleRoutes: Record<string, string> = {
      dashboard: '/dashboard',
      crm: '/crm/dashboard',
      ventas: '/ventas/dashboard',
      inventario: '/inventario/dashboard',
      reportes: '/reportes/dashboard',
      gestion: '/users',
      configuracion: '/settings/profile',
      'design-system': '/design-system/tokens',
    }
    
    const route = moduleRoutes[moduleId] || '/dashboard'
    navigate(route)
  }

  /**
   * NOTA IMPORTANTE: NO auto-detectar módulo basándose en la URL
   * 
   * El módulo activo se mantiene estable y solo cambia cuando el usuario
   * hace clic explícitamente en el ModuleSwitcher.
   * 
   * Esto permite que rutas compartidas como /users, /settings/profile, etc.
   * puedan ser accesibles desde múltiples módulos sin cambiar el contexto del menú.
   * 
   * Ejemplo:
   * - Usuario está en CRM
   * - Hace clic en "Gestión > Usuarios" (va a /users)
   * - El módulo sigue siendo CRM
   * - El menú muestra las opciones de CRM
   * - Solo el contenido cambia (con LogoSpinner durante carga)
   */

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (!isOpen || isMobile) return
    setIsResizing(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !isOpen) return
    const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth)
    setLocalWidth(newWidth)
    setSidebarWidth(newWidth)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  // Add event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing])

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={close}
        />
      )}

      <aside
        style={{ 
          width: isOpen && !isMobile ? `${localWidth}px` : undefined 
        }}
        className={clsx(
          'fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl',
          'transition-all duration-500 ease-out',
          // When fully open (expanded) we want the sidebar above content but below modal overlays.
          isOpen ? 'translate-x-0 z-30 w-64' : '-translate-x-full lg:translate-x-0 z-10',
          // collapsed width on lg
          !isOpen && 'lg:w-[63px]',
          // mobile overlay when open
          isMobile && 'w-64 z-50'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-14 px-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 dark:from-gray-800/50">
            <div className={clsx(
              'flex items-center gap-2.5 transition-all duration-300',
              !isOpen && 'lg:justify-center'
            )}>
              <img 
                src={config.logoUrl} 
                alt={`${config.brandName} Logo`}
                className="w-9 h-9 flex-shrink-0 transition-transform duration-300 hover:scale-110 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/Logo.png'
                }}
              />
              {isOpen && (
                <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap leading-tight">
                    {config.brandName}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap leading-tight">
                    Admin Panel
                  </span>
                </div>
              )}
            </div>
            
            {isMobile && (
              <button 
                onClick={close} 
                className="ml-auto lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Module Switcher - Debajo del Logo */}
          {isOpen && (
            <div className="p-2.5 border-b border-gray-200 dark:border-gray-700">
              <ModuleSwitcher
                modules={modules}
                currentModule={currentModule}
                onModuleChange={handleModuleChange}
                searchable={false}
                compact={false}
                className="w-full"
              />
            </div>
          )}

          {/* Navigation with scroll */}
          <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
            {/** Use dynamic menu filtered by permissions **/}
            {menu.map((item) => {
              if (isCategory(item)) {
                if (isOpen) {
                  // Sidebar expandido: mostrar categoría con sub-items
                  return (
                    <CategoryItem 
                      key={item.name} 
                      category={item}
                      isExpanded={expandedCategory === item.name}
                      onToggle={() => handleCategoryToggle(item.name)}
                    />
                  )
                } else {
                  // Sidebar contraído: mostrar categoría como botón con popup
                  return <CollapsedCategoryItem key={item.name} category={item} />
                }
              }
              
              // NavItem simple
              if (isOpen) {
                // Sidebar expandido: mostrar link normal
                return (
          <NavLink
            key={item.name}
            to={item.href ?? '#'}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:translate-x-0.5'
                      )
                    }
                    onClick={() => isMobile && close()}
                  >
                    {(() => { const Icon = item.icon; return Icon ? <IconRenderer icon={Icon} className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" /> : null })()}
                    <span className="transition-colors duration-200">{item.name}</span>
                    {item.badge !== undefined && (
                      <span className="ml-auto inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )
              } else {
                // Sidebar contraído: mostrar solo ícono
                return (
          <NavLink
            key={item.name}
            to={item.href ?? '#'}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center justify-center p-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                        isActive
                          ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 scale-105 shadow-md shadow-primary-200/50 dark:shadow-primary-900/30'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )
                    }
                    onClick={() => isMobile && close()}
                    title={item.name}
                  >
                    {(() => { const Icon = item.icon; return Icon ? <IconRenderer icon={Icon} className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" /> : null })()}
                  </NavLink>
                )
              }
            })}
          </nav>

          {/* Footer */}
          {isOpen ? (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="font-bold text-gray-700 dark:text-gray-300">Admin Panel {config.version}</p>
                <p className="text-[10px] mt-0.5">{config.copyright}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Resize handle */}
        {isOpen && !isMobile && (
          <div
            onMouseDown={handleMouseDown}
            className={clsx(
              'absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary-500 transition-colors duration-200 group',
              isResizing && 'bg-primary-500'
            )}
          >
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1 h-16 bg-primary-500 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        )}
      </aside>
    </>
  )
}
