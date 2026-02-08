/**
 * Componente Spinner - Indicadores de carga
 */

import clsx from 'clsx'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'circle' | 'dots' | 'bars' | 'pulse'
  color?: 'primary' | 'white' | 'gray'
  className?: string
  label?: string
}

const sizeStyles = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

const colorStyles = {
  primary: 'text-primary-600',
  white: 'text-white',
  gray: 'text-gray-600',
}

export function Spinner({ 
  size = 'md', 
  variant = 'circle',
  color = 'primary',
  className,
  label = 'Cargando...'
}: SpinnerProps) {
  if (variant === 'circle') {
    return (
      <div className={clsx('flex flex-col items-center gap-3', className)}>
        <svg
          className={clsx('animate-spin', sizeStyles[size], colorStyles[color])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {label && (
          <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              'rounded-full animate-bounce',
              size === 'xs' && 'w-1.5 h-1.5',
              size === 'sm' && 'w-2 h-2',
              size === 'md' && 'w-3 h-3',
              size === 'lg' && 'w-4 h-4',
              size === 'xl' && 'w-5 h-5',
              color === 'primary' && 'bg-primary-600',
              color === 'white' && 'bg-white',
              color === 'gray' && 'bg-gray-600'
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'bars') {
    return (
      <div className={clsx('flex items-center gap-1', className)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={clsx(
              'animate-pulse',
              size === 'xs' && 'w-1 h-3',
              size === 'sm' && 'w-1.5 h-4',
              size === 'md' && 'w-2 h-6',
              size === 'lg' && 'w-2.5 h-8',
              size === 'xl' && 'w-3 h-10',
              color === 'primary' && 'bg-primary-600',
              color === 'white' && 'bg-white',
              color === 'gray' && 'bg-gray-600'
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={clsx('flex flex-col items-center gap-3', className)}>
        <div className="relative">
          <div
            className={clsx(
              'rounded-full animate-ping absolute',
              sizeStyles[size],
              color === 'primary' && 'bg-primary-600',
              color === 'white' && 'bg-white',
              color === 'gray' && 'bg-gray-600',
              'opacity-75'
            )}
          />
          <div
            className={clsx(
              'rounded-full relative',
              sizeStyles[size],
              color === 'primary' && 'bg-primary-600',
              color === 'white' && 'bg-white',
              color === 'gray' && 'bg-gray-600'
            )}
          />
        </div>
        {label && (
          <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        )}
      </div>
    )
  }

  return null
}

// Progress Spinner con porcentaje
interface ProgressSpinnerProps {
  progress: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  className?: string
}

export function ProgressSpinner({
  progress,
  size = 'md',
  color = 'primary',
  showLabel = true,
  className
}: ProgressSpinnerProps) {
  const sizePx = {
    sm: 64,
    md: 96,
    lg: 128,
  }

  const strokeWidth = 8
  const radius = (sizePx[size] - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const colorStyles = {
    primary: 'text-primary-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  }

  return (
    <div className={clsx('relative inline-flex', className)}>
      <svg
        width={sizePx[size]}
        height={sizePx[size]}
        className="transform -rotate-90"
      >
        <circle
          cx={sizePx[size] / 2}
          cy={sizePx[size] / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={sizePx[size] / 2}
          cy={sizePx[size] / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={clsx('transition-all duration-300', colorStyles[color])}
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}
