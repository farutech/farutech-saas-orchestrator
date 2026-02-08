/**
 * Componente Checkbox - Casilla de verificación
 */

import { CheckIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { forwardRef } from 'react'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  description?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'circle'
  indeterminate?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    label, 
    description,
    error,
    size = 'md',
    variant = 'default',
    indeterminate = false,
    className,
    ...props 
  }, ref) => {
    const sizeStyles = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }

    const inputId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={className}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <div className="relative">
              <input
                ref={ref}
                type="checkbox"
                id={inputId}
                className="sr-only peer"
                {...props}
              />
              <label
                htmlFor={inputId}
                className={clsx(
                  'flex items-center justify-center border-2 transition-all duration-200 cursor-pointer',
                  'peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2',
                  'peer-checked:bg-primary-600 peer-checked:border-primary-600',
                  'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
                  error
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600',
                  variant === 'circle' ? 'rounded-full' : 'rounded-lg',
                  sizeStyles[size]
                )}
              >
                <CheckIcon 
                  className={clsx(
                    'text-white transition-all duration-200',
                    'peer-checked:scale-100 peer-checked:opacity-100',
                    'scale-0 opacity-0',
                    size === 'sm' && 'h-3 w-3',
                    size === 'md' && 'h-4 w-4',
                    size === 'lg' && 'h-5 w-5'
                  )}
                />
              </label>
            </div>
          </div>
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label 
                  htmlFor={inputId}
                  className="font-medium text-gray-900 dark:text-white cursor-pointer"
                >
                  {label}
                </label>
              )}
              {description && (
                <p className="text-gray-500 dark:text-gray-400">{description}</p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

// CheckboxGroup
interface CheckboxGroupProps {
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
  value?: string[]
  onChange?: (value: string[]) => void
  label?: string
  error?: string
  className?: string
}

export function CheckboxGroup({
  options,
  value = [],
  onChange,
  label,
  error,
  className
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange?.([...value, optionValue])
    } else {
      onChange?.(value.filter(v => v !== optionValue))
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {label}
        </label>
      )}
      <div className="space-y-3">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            description={option.description}
            checked={value.includes(option.value)}
            onChange={(e) => handleChange(option.value, e.target.checked)}
            disabled={option.disabled}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
