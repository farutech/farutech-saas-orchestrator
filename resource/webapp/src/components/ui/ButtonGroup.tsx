/**
 * Componente ButtonGroup - Grupo de botones conectados
 */

import clsx from 'clsx'
import type { ReactElement } from 'react'

interface ButtonGroupProps {
  children: ReactElement[]
  className?: string
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined'
}

export function ButtonGroup({ 
  children, 
  className,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default'
}: ButtonGroupProps) {
  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div
      className={clsx(
        'inline-flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        variant === 'outlined' && 'border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden',
        className
      )}
      role="group"
    >
      {children.map((child, index) => {
        const isFirst = index === 0
        const isLast = index === children.length - 1

        return (
          <div
            key={index}
            className={clsx(
              sizeStyles[size],
              orientation === 'horizontal' ? [
                !isFirst && !isLast && 'border-x border-gray-300 dark:border-gray-600',
                isFirst && 'rounded-l-lg',
                isLast && 'rounded-r-lg',
                !isFirst && '-ml-px',
              ] : [
                !isFirst && !isLast && 'border-y border-gray-300 dark:border-gray-600',
                isFirst && 'rounded-t-lg',
                isLast && 'rounded-b-lg',
                !isFirst && '-mt-px',
              ]
            )}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
