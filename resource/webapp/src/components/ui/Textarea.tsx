/**
 * Componente Textarea - Input de texto multilínea con validación regex
 */

import clsx from 'clsx'
import { forwardRef, useState } from 'react'
import type { ChangeEvent } from 'react'

type ValidationMode = 'block' | 'error'

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  /** Regex pattern para validación de entrada */
  pattern?: RegExp
  /** Modo de validación: 'block' bloquea caracteres inválidos, 'error' muestra error */
  validationMode?: ValidationMode
  /** Callback cuando el valor cambia */
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    helperText,
    variant = 'default',
    resize = 'vertical',
    className,
    pattern,
    validationMode = 'block',
    onChange,
    ...props 
  }, ref) => {
    const [validationError, setValidationError] = useState<string>('')

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value

      if (pattern) {
        if (validationMode === 'block') {
          // Modo block: solo permitir caracteres válidos
          if (value === '' || pattern.test(value)) {
            setValidationError('')
            onChange?.(e)
          } else {
            // No actualizar el valor si no cumple el patrón
            e.preventDefault()
          }
        } else {
          // Modo error: permitir entrada pero mostrar error
          if (value === '' || pattern.test(value)) {
            setValidationError('')
            onChange?.(e)
          } else {
            setValidationError('El formato ingresado no es válido')
            onChange?.(e)
          }
        }
      } else {
        // Sin patrón: comportamiento normal
        onChange?.(e)
      }
    }

    const displayError = error || validationError
    const variantStyles = {
      default: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
      filled: 'bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800',
      outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    }

    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          onChange={handleChange}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border transition-all duration-200 min-h-[100px]',
            'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            displayError
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
              : variantStyles[variant],
            resizeStyles[resize]
          )}
          {...props}
        />
        {(displayError || helperText) && (
          <p className={clsx(
            'mt-1 text-sm',
            displayError 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-gray-500 dark:text-gray-400'
          )}>
            {displayError || helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
