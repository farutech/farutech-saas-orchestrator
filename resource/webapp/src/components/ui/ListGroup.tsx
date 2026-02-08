/**
 * Componente ListGroup - Lista de elementos con estilos
 */

import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface ListGroupItem {
  id: string
  content: ReactNode
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

interface ListGroupProps {
  items: ListGroupItem[]
  variant?: 'default' | 'flush' | 'bordered'
  className?: string
}

export function ListGroup({ items, variant = 'default', className }: ListGroupProps) {
  const containerStyles = {
    default: 'bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden',
    flush: '',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden',
  }

  return (
    <ul className={clsx(containerStyles[variant], className)}>
      {items.map((item, index) => {
        const ItemIcon = item.icon
        const isFirst = index === 0
        const isLast = index === items.length - 1

        return (
          <li
            key={item.id}
            className={clsx(
              'relative flex items-center justify-between px-4 py-3 transition-all duration-200',
              !isLast && 'border-b border-gray-200 dark:border-gray-700',
              variant === 'default' && [
                isFirst && 'rounded-t-xl',
                isLast && 'rounded-b-xl',
              ],
              item.active && 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
              !item.disabled && !item.active && 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
              item.disabled && 'opacity-50 cursor-not-allowed',
              item.onClick && !item.disabled && 'cursor-pointer'
            )}
            onClick={item.disabled ? undefined : item.onClick}
          >
            <div className="flex items-center gap-3 flex-1">
              {ItemIcon && (
                <ItemIcon
                  className={clsx(
                    'h-5 w-5',
                    item.active
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                />
              )}
              <div
                className={clsx(
                  'text-sm',
                  item.active
                    ? 'font-semibold text-primary-700 dark:text-primary-300'
                    : 'font-medium text-gray-900 dark:text-white'
                )}
              >
                {item.content}
              </div>
            </div>
            {item.badge !== undefined && (
              <span
                className={clsx(
                  'px-2.5 py-0.5 text-xs font-semibold rounded-full',
                  item.active
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}
              >
                {item.badge}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
