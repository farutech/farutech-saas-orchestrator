/**
 * Componente Switch/Toggle - Interruptor on/off
 */

import { Switch as HeadlessSwitch } from '@headlessui/react'
import clsx from 'clsx'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'error'
  disabled?: boolean
  className?: string
}

const sizeStyles = {
  sm: {
    container: 'h-5 w-9',
    toggle: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    container: 'h-6 w-11',
    toggle: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    container: 'h-7 w-14',
    toggle: 'h-6 w-6',
    translate: 'translate-x-7',
  },
}

const colorStyles = {
  primary: 'bg-primary-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  error: 'bg-red-600',
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  color = 'primary',
  disabled = false,
  className
}: SwitchProps) {
  const sizes = sizeStyles[size]

  return (
    <HeadlessSwitch.Group>
      <div className={clsx('flex items-center justify-between', className)}>
        {(label || description) && (
          <div className="flex-1 mr-4">
            {label && (
              <HeadlessSwitch.Label className="block text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                {label}
              </HeadlessSwitch.Label>
            )}
            {description && (
              <HeadlessSwitch.Description className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </HeadlessSwitch.Description>
            )}
          </div>
        )}
        <HeadlessSwitch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizes.container,
            checked ? colorStyles[color] : 'bg-gray-200 dark:bg-gray-700'
          )}
        >
          <span
            className={clsx(
              'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0',
              'transition-transform duration-200 ease-in-out',
              sizes.toggle,
              checked ? sizes.translate : 'translate-x-0'
            )}
          />
        </HeadlessSwitch>
      </div>
    </HeadlessSwitch.Group>
  )
}
