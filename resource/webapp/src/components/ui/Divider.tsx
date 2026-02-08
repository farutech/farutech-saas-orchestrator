/**
 * Componente Divider - Separador de secciones
 */

import clsx from 'clsx'

interface DividerProps {
  label?: string
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  className?: string
  spacing?: 'sm' | 'md' | 'lg'
}

export function Divider({ 
  label, 
  orientation = 'horizontal',
  variant = 'solid',
  className,
  spacing = 'md'
}: DividerProps) {
  const spacingStyles = {
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-8',
  }

  const lineStyles = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={clsx(
          'inline-block h-full border-l border-gray-300 dark:border-gray-600',
          lineStyles[variant],
          'mx-4',
          className
        )}
      />
    )
  }

  if (label) {
    return (
      <div className={clsx('flex items-center', spacingStyles[spacing], className)}>
        <div className={clsx('flex-1 border-t border-gray-300 dark:border-gray-600', lineStyles[variant])} />
        <span className="px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
        <div className={clsx('flex-1 border-t border-gray-300 dark:border-gray-600', lineStyles[variant])} />
      </div>
    )
  }

  return (
    <hr
      className={clsx(
        'border-gray-300 dark:border-gray-600',
        lineStyles[variant],
        spacingStyles[spacing],
        className
      )}
    />
  )
}

// Section Header Component
interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={clsx('mb-6', className)}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
      <div className="mt-3 h-1 w-16 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" />
    </div>
  )
}
