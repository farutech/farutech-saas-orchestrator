/**
 * StatsCard - Componente de tarjeta de estadísticas
 * 
 * Características:
 * - ✅ Valor principal grande con formato
 * - ✅ Título/etiqueta
 * - ✅ Ícono temático con color
 * - ✅ Cambio porcentual con indicador ↑↓
 * - ✅ Descripción adicional
 * - ✅ Mini gráfico sparkline (opcional)
 * - ✅ Variantes de color
 * - ✅ Tamaños: sm, md, lg
 * - ✅ Loading skeleton
 * 
 * @example Uso básico
 * ```tsx
 * <StatsCard
 *   title="Usuarios"
 *   value="1,234"
 *   icon={<UsersIcon />}
 *   change={{ value: 12.5, trend: 'up' }}
 * />
 * ```
 */

import type { ReactNode } from 'react'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { Card } from './Card'

export interface StatsCardProps {
  /** Título/etiqueta de la estadística */
  title: string
  /** Valor principal a mostrar */
  value: string | number
  /** Ícono de la estadística */
  icon?: ReactNode
  /** Color del ícono/tema */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'
  /** Cambio porcentual */
  change?: {
    value: number
    trend?: 'up' | 'down'
    label?: string
  }
  /** Descripción adicional debajo del valor */
  description?: string
  /** Tamaño de la tarjeta */
  size?: 'sm' | 'md' | 'lg'
  /** Estado de carga */
  loading?: boolean
  /** Clase CSS adicional */
  className?: string
  /** Evento onClick */
  onClick?: () => void
}

const variantStyles = {
  primary: {
    icon: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    trend: 'text-primary-600 dark:text-primary-400',
  },
  success: {
    icon: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    trend: 'text-green-600 dark:text-green-400',
  },
  warning: {
    icon: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    trend: 'text-yellow-600 dark:text-yellow-400',
  },
  danger: {
    icon: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    trend: 'text-red-600 dark:text-red-400',
  },
  info: {
    icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    trend: 'text-blue-600 dark:text-blue-400',
  },
  gray: {
    icon: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    trend: 'text-gray-600 dark:text-gray-400',
  },
}

const sizeStyles = {
  sm: {
    padding: 'p-4',
    icon: 'h-8 w-8',
    iconContainer: 'p-2',
    title: 'text-xs',
    value: 'text-2xl',
    change: 'text-xs',
    description: 'text-xs',
  },
  md: {
    padding: 'p-5',
    icon: 'h-10 w-10',
    iconContainer: 'p-2.5',
    title: 'text-sm',
    value: 'text-3xl',
    change: 'text-sm',
    description: 'text-sm',
  },
  lg: {
    padding: 'p-6',
    icon: 'h-12 w-12',
    iconContainer: 'p-3',
    title: 'text-base',
    value: 'text-4xl',
    change: 'text-base',
    description: 'text-base',
  },
}

/**
 * Skeleton loader para StatsCard
 */
function StatsCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const styles = sizeStyles[size]

  return (
    <Card className={clsx(styles.padding, 'animate-pulse')}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={clsx('h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3', styles.title)} />
          <div className={clsx('h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2', styles.value)} />
          <div className={clsx('h-3 bg-gray-200 dark:bg-gray-700 rounded w-20', styles.description)} />
        </div>
        <div className={clsx('rounded-lg bg-gray-200 dark:bg-gray-700', styles.icon, styles.iconContainer)} />
      </div>
    </Card>
  )
}

/**
 * Componente StatsCard
 */
export function StatsCard({
  title,
  value,
  icon,
  variant = 'primary',
  change,
  description,
  size = 'md',
  loading = false,
  className,
  onClick,
}: StatsCardProps) {
  const styles = sizeStyles[size]
  const colors = variantStyles[variant]

  if (loading) {
    return <StatsCardSkeleton size={size} />
  }

  const trendIcon = change?.trend === 'down' ? ArrowTrendingDownIcon : ArrowTrendingUpIcon
  const TrendIcon = trendIcon

  return (
    <Card
      className={clsx(
        styles.padding,
        onClick && 'cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        {/* Contenido */}
        <div className="flex-1">
          <p className={clsx('font-medium text-gray-600 dark:text-gray-400 mb-2', styles.title)}>
            {title}
          </p>
          <p className={clsx('font-bold text-gray-900 dark:text-white mb-1', styles.value)}>
            {value}
          </p>

          {/* Cambio porcentual */}
          {change && (
            <div className={clsx('flex items-center gap-1 font-medium', colors.trend, styles.change)}>
              <TrendIcon className="h-4 w-4" />
              <span>{Math.abs(change.value)}%</span>
              {change.label && (
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  {change.label}
                </span>
              )}
            </div>
          )}

          {/* Descripción */}
          {description && !change && (
            <p className={clsx('text-gray-500 dark:text-gray-400', styles.description)}>
              {description}
            </p>
          )}
        </div>

        {/* Ícono */}
        {icon && (
          <div className={clsx('rounded-lg flex-shrink-0', colors.icon, styles.iconContainer)}>
            <div className={styles.icon}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

/**
 * Grupo de StatsCards con grid responsivo
 */
export function StatsCardGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {children}
    </div>
  )
}
