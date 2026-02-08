/**
 * Componente ProgressBar - Barra de progreso
 */

import clsx from 'clsx'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'striped'
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  className?: string
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const colorStyles = {
  primary: 'bg-primary-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  error: 'bg-red-600',
  info: 'bg-blue-600',
}

const gradientStyles = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
  success: 'bg-gradient-to-r from-green-500 to-green-600',
  warning: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
  error: 'bg-gradient-to-r from-red-500 to-red-600',
  info: 'bg-gradient-to-r from-blue-500 to-blue-600',
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = false,
  size = 'md',
  variant = 'default',
  color = 'primary',
  className
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={className}>
      {(label || showLabel) && (
        <div className="flex justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          sizeStyles[size]
        )}
      >
        <div
          className={clsx(
            'h-full transition-all duration-500 ease-out',
            variant === 'gradient' ? gradientStyles[color] : colorStyles[color],
            variant === 'striped' && 'bg-stripes animate-stripes'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Multiple Progress Bars
interface MultiProgressBarProps {
  items: Array<{
    label: string
    value: number
    color: 'primary' | 'success' | 'warning' | 'error' | 'info'
  }>
  max?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MultiProgressBar({
  items,
  max = 100,
  size = 'md',
  className
}: MultiProgressBarProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className={className}>
      <div className="flex justify-between mb-2">
        {items.map((item) => {
          const percentage = (item.value / max) * 100
          return (
            <div key={item.label} className="flex items-center gap-2">
              <div className={clsx('w-3 h-3 rounded-full', colorStyles[item.color])} />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {item.label}: {Math.round(percentage)}%
              </span>
            </div>
          )
        })}
      </div>
      <div
        className={clsx(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex',
          sizeStyles[size]
        )}
      >
        {items.map((item) => {
          const percentage = (item.value / total) * 100
          return (
            <div
              key={item.label}
              className={clsx('h-full transition-all duration-500', colorStyles[item.color])}
              style={{ width: `${percentage}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}
