/**
 * Componente Alert - Alertas y notificaciones
 */

import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import type { ReactNode } from 'react'

export type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  onClose?: () => void
  className?: string
}

const variantStyles = {
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-300',
    text: 'text-green-700 dark:text-green-400',
    IconComponent: CheckCircleIcon,
  },
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-300',
    text: 'text-red-700 dark:text-red-400',
    IconComponent: XCircleIcon,
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-300',
    text: 'text-yellow-700 dark:text-yellow-400',
    IconComponent: ExclamationTriangleIcon,
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-300',
    text: 'text-blue-700 dark:text-blue-400',
    IconComponent: InformationCircleIcon,
  },
}

export function Alert({ variant = 'info', title, children, onClose, className }: AlertProps) {
  const styles = variantStyles[variant]
  const { IconComponent } = styles

  return (
    <div
      className={clsx(
        'rounded-xl border p-4 shadow-sm transition-all duration-200',
        styles.container,
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <IconComponent className={clsx('h-5 w-5', styles.icon)} />
        </div>
        <div className="flex-1">
          {title && (
            <h3 className={clsx('text-sm font-bold mb-1', styles.title)}>
              {title}
            </h3>
          )}
          <div className={clsx('text-sm', styles.text)}>
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={clsx(
              'flex-shrink-0 rounded-lg p-1 transition-colors duration-200',
              'hover:bg-black/5 dark:hover:bg-white/5',
              styles.icon
            )}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
