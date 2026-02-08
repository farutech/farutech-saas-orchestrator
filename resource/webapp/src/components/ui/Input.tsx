/**
 * Componente Input reutilizable con soporte para formularios y validación regex
 */

import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes, ReactNode, ChangeEvent } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

type ValidationMode = 'block' | 'error'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'pattern'> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  /** Regex pattern para validación de entrada */
  pattern?: RegExp
  /** Modo de validación: 'block' bloquea caracteres inválidos, 'error' muestra error */
  validationMode?: ValidationMode
  /** Callback cuando el valor cambia (solo se llama con valores válidos si pattern está definido) */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  /** Show password toggle for password inputs (default: true) */
  showPasswordToggle?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      fullWidth = true,
      className,
      id,
      pattern,
      validationMode = 'block',
      onChange,
      type,
      showPasswordToggle = true,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(7)}`
    const [validationError, setValidationError] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)
    
    // Determine if this is a password input
    const isPassword = type === 'password'
    const effectiveType = isPassword && showPassword ? 'text' : type

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            onChange={handleChange}
            className={clsx(
              'input',
              icon && iconPosition === 'left' && 'pl-10',
              (icon && iconPosition === 'right') || (isPassword && showPasswordToggle) ? 'pr-10' : '',
              displayError && 'border-red-500 focus:ring-red-500',
              className
            )}
            style={isPassword && showPasswordToggle ? {
              // Desactivar el icono nativo de mostrar contraseña del navegador
              WebkitTextSecurity: showPassword ? 'none' : 'disc',
            } as React.CSSProperties : undefined}
            {...props}
          />

          {/* Password visibility toggle */}
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 z-10"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Right icon (only if not password or password toggle is disabled) */}
          {icon && iconPosition === 'right' && !(isPassword && showPasswordToggle) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
        </div>

        {displayError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{displayError}</p>
        )}

        {helperText && !displayError && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
