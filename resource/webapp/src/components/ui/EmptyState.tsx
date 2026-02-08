/**
 * EmptyState - Componente de estado vacío profesional
 * 
 * Características:
 * - ✅ Ícono/ilustración grande
 * - ✅ Título principal
 * - ✅ Descripción secundaria
 * - ✅ Botón de acción (CTA)
 * - ✅ Variantes temáticas
 * - ✅ Tamaños configurables
 * 
 * @example Uso básico
 * ```tsx
 * <EmptyState
 *   icon={<InboxIcon />}
 *   title="No hay datos"
 *   description="Comienza agregando tu primer registro"
 *   action={{ label: 'Crear ahora', onClick: () => create() }}
 * />
 * ```
 */

import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Button } from './Button'

export interface EmptyStateProps {
  /** Ícono o ilustración */
  icon?: ReactNode
  /** Título principal */
  title: string
  /** Descripción secundaria */
  description?: string
  /** Botón de acción principal */
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'success'
    icon?: ReactNode
  }
  /** Botón de acción secundaria */
  secondaryAction?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
  /** Variante de color del ícono */
  variant?: 'primary' | 'gray' | 'info' | 'warning' | 'danger' | 'success'
  /** Tamaño del componente */
  size?: 'sm' | 'md' | 'lg'
  /** Clase CSS adicional */
  className?: string
}

const variantStyles = {
  primary: 'text-primary-400 dark:text-primary-500',
  gray: 'text-gray-400 dark:text-gray-500',
  info: 'text-blue-400 dark:text-blue-500',
  warning: 'text-yellow-400 dark:text-yellow-500',
  danger: 'text-red-400 dark:text-red-500',
  success: 'text-green-400 dark:text-green-500',
}

const sizeStyles = {
  sm: {
    icon: 'h-12 w-12',
    title: 'text-base',
    description: 'text-sm',
    padding: 'py-8',
  },
  md: {
    icon: 'h-16 w-16',
    title: 'text-lg',
    description: 'text-base',
    padding: 'py-12',
  },
  lg: {
    icon: 'h-20 w-20',
    title: 'text-xl',
    description: 'text-lg',
    padding: 'py-16',
  },
}

/**
 * Componente EmptyState
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'gray',
  size = 'md',
  className,
}: EmptyStateProps) {
  const styles = sizeStyles[size]
  const iconColor = variantStyles[variant]

  return (
    <div className={clsx('flex flex-col items-center justify-center px-4 text-center', styles.padding, className)}>
      {/* Ícono */}
      {icon && (
        <div className={clsx('mb-4', iconColor, styles.icon)}>
          {icon}
        </div>
      )}

      {/* Título */}
      <h3 className={clsx('font-semibold text-gray-900 dark:text-white mb-2', styles.title)}>
        {title}
      </h3>

      {/* Descripción */}
      {description && (
        <p className={clsx('text-gray-500 dark:text-gray-400 max-w-md mb-6', styles.description)}>
          {description}
        </p>
      )}

      {/* Acciones */}
      {(action || secondaryAction) && (
        <div className="flex gap-3 flex-wrap justify-center">
          {action && (
            <Button
              variant={action.variant || 'primary'}
              onClick={action.onClick}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.icon && <span className="mr-2">{secondaryAction.icon}</span>}
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Variantes predefinidas comunes
 */

export function NoDataState(props: Omit<EmptyStateProps, 'title'>) {
  return <EmptyState title="No hay datos disponibles" variant="gray" {...props} />
}

export function NoResultsState(props: Omit<EmptyStateProps, 'title' | 'description'>) {
  return (
    <EmptyState
      title="No se encontraron resultados"
      description="Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas"
      variant="info"
      {...props}
    />
  )
}

export function NoPermissionState(props: Omit<EmptyStateProps, 'title' | 'description'>) {
  return (
    <EmptyState
      title="Sin permisos"
      description="No tienes los permisos necesarios para acceder a esta sección"
      variant="warning"
      {...props}
    />
  )
}

export function ErrorState(props: Omit<EmptyStateProps, 'title' | 'description'>) {
  return (
    <EmptyState
      title="Algo salió mal"
      description="Ocurrió un error al cargar los datos. Por favor, intenta nuevamente"
      variant="danger"
      {...props}
    />
  )
}
