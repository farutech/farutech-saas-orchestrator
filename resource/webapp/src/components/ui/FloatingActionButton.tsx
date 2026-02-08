/**
 * FloatingActionButton (FAB) - Botón de acción flotante
 * 
 * Características:
 * - ✅ Posicionamiento fijo en diferentes ubicaciones
 * - ✅ Tamaños configurables (sm, md, lg)
 * - ✅ Variantes de color
 * - ✅ Sub-menú expandible de acciones
 * - ✅ Animaciones suaves
 * - ✅ Soporte para iconos y etiquetas
 * - ✅ Dark mode
 * 
 * @example Simple
 * ```tsx
 * <FloatingActionButton
 *   icon={<PlusIcon />}
 *   onClick={() => createNew()}
 *   position="bottom-right"
 * />
 * ```
 * 
 * @example Con sub-menú
 * ```tsx
 * <FloatingActionButton
 *   icon={<PlusIcon />}
 *   position="bottom-right"
 *   actions={[
 *     { icon: <UserIcon />, label: 'Nuevo Usuario', onClick: () => {} },
 *     { icon: <DocumentIcon />, label: 'Nuevo Documento', onClick: () => {} }
 *   ]}
 * />
 * ```
 */

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export interface FABAction {
  /** Ícono de la acción */
  icon: ReactNode
  /** Etiqueta de la acción */
  label: string
  /** Función onClick */
  onClick: () => void
  /** Variante de color */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  /** Deshabilitar acción */
  disabled?: boolean
}

export interface FloatingActionButtonProps {
  /** Ícono principal del FAB */
  icon: ReactNode
  /** Etiqueta del botón principal (opcional, se muestra al hover) */
  label?: string
  /** Función onClick del botón principal (si no hay sub-acciones) */
  onClick?: () => void
  /** Sub-acciones que se despliegan */
  actions?: FABAction[]
  /** Posición del FAB en la pantalla */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center'
  /** Tamaño del FAB */
  size?: 'sm' | 'md' | 'lg'
  /** Variante de color */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  /** Offset desde el borde (en píxeles) */
  offset?: number
  /** Clase CSS adicional */
  className?: string
  /** Deshabilitar el botón */
  disabled?: boolean
  /** Z-index del FAB */
  zIndex?: number
}

const positionClasses = {
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-14 w-14',
  lg: 'h-16 w-16',
}

const iconSizeClasses = {
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-7 w-7',
}

const variantClasses = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/50',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-gray-500/50',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/50',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/50',
  warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/50',
}

const subActionVariantClasses = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white',
}

export function FloatingActionButton({
  icon,
  label,
  onClick,
  actions = [],
  position = 'bottom-right',
  size = 'md',
  variant = 'primary',
  offset = 24,
  className,
  disabled = false,
  zIndex = 1000,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const fabRef = useRef<HTMLDivElement>(null)

  const hasActions = actions.length > 0

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  const handleMainClick = () => {
    if (disabled) return

    if (hasActions) {
      setIsExpanded(!isExpanded)
    } else if (onClick) {
      onClick()
    }
  }

  const handleActionClick = (action: FABAction) => {
    if (!action.disabled) {
      action.onClick()
      setIsExpanded(false)
    }
  }

  const getActionPosition = (index: number) => {
    const spacing = size === 'sm' ? 56 : size === 'md' ? 64 : 72

    if (position.includes('bottom')) {
      return { bottom: `${(index + 1) * spacing}px` }
    } else {
      return { top: `${(index + 1) * spacing}px` }
    }
  }

  const getLabelPosition = () => {
    if (position.includes('right')) {
      return 'right-full mr-4'
    } else if (position.includes('left')) {
      return 'left-full ml-4'
    } else {
      return 'bottom-full mb-4'
    }
  }

  return (
    <div
      ref={fabRef}
      className={clsx(
        'fixed',
        positionClasses[position],
        className
      )}
      style={{
        padding: `${offset}px`,
        zIndex,
      }}
    >
      {/* Sub-acciones */}
      {hasActions && isExpanded && (
        <div className="absolute" style={{ [position.includes('bottom') ? 'bottom' : 'top']: '100%' }}>
          {actions.map((action, index) => {
            const actionSize = size === 'sm' ? 'h-10 w-10' : size === 'md' ? 'h-11 w-11' : 'h-12 w-12'
            const actionIconSize = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'

            return (
              <div
                key={index}
                className="absolute flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2"
                style={{
                  ...getActionPosition(index),
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both',
                  [position.includes('right') ? 'right' : position.includes('left') ? 'left' : 'left']: position.includes('center') ? '50%' : '0',
                  transform: position.includes('center') ? 'translateX(-50%)' : undefined,
                }}
              >
                {/* Etiqueta de la acción (izquierda en right, derecha en left) */}
                {position.includes('right') && (
                  <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                    {action.label}
                  </div>
                )}

                {/* Botón de acción */}
                <button
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled}
                  className={clsx(
                    actionSize,
                    'rounded-full shadow-lg flex items-center justify-center',
                    'transition-all duration-200',
                    'hover:scale-110 active:scale-95',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                    subActionVariantClasses[action.variant || 'secondary']
                  )}
                >
                  <div className={actionIconSize}>{action.icon}</div>
                </button>

                {/* Etiqueta de la acción (derecha en left) */}
                {position.includes('left') && (
                  <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                    {action.label}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Botón principal */}
      <div className="relative">
        {/* Etiqueta del botón principal al hover */}
        {label && showLabel && !isExpanded && (
          <div
            className={clsx(
              'absolute whitespace-nowrap',
              'bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg',
              'animate-in fade-in slide-in-from-right-2',
              getLabelPosition()
            )}
          >
            {label}
          </div>
        )}

        <button
          onClick={handleMainClick}
          onMouseEnter={() => setShowLabel(true)}
          onMouseLeave={() => setShowLabel(false)}
          disabled={disabled}
          className={clsx(
            sizeClasses[size],
            'rounded-full shadow-2xl',
            'flex items-center justify-center',
            'transition-all duration-300',
            'hover:scale-110 active:scale-95',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            variantClasses[variant],
            isExpanded && 'rotate-45'
          )}
          aria-label={label || 'Acción flotante'}
        >
          <div className={clsx(iconSizeClasses[size], 'transition-transform duration-300')}>
            {isExpanded && hasActions ? <XMarkIcon /> : icon}
          </div>
        </button>
      </div>
    </div>
  )
}

export default FloatingActionButton
