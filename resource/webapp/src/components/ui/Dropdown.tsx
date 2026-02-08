/**
 * Componente Dropdown - Lista desplegable
 */

import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export interface DropdownItem {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  disabled?: boolean
  divider?: boolean
}

interface DropdownProps {
  items: DropdownItem[]
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  variant?: 'default' | 'outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Dropdown({
  items,
  label,
  placeholder = 'Seleccionar',
  value,
  onChange,
  className,
  variant = 'default',
  size = 'md'
}: DropdownProps) {
  const selectedItem = items.find(item => item.value === value)

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
    outlined: 'bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
    ghost: 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
  }

  return (
    <Menu as="div" className={clsx('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <Menu.Button
        className={clsx(
          'relative w-full flex items-center justify-between gap-2',
          'border rounded-lg transition-all duration-200',
          'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'text-gray-900 dark:text-white',
          sizeStyles[size],
          variantStyles[variant]
        )}
      >
        <span className="flex items-center gap-2 flex-1 text-left">
          {selectedItem?.icon && <selectedItem.icon className="h-5 w-5" />}
          <span className={clsx(!selectedItem && 'text-gray-500 dark:text-gray-400')}>
            {selectedItem?.label || placeholder}
          </span>
        </span>
        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-full min-w-[200px] origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 focus:outline-none z-50 max-h-60 overflow-auto">
        <div className="p-1">
          {items.map((item) => (
            <div key={item.value}>
              {item.divider ? (
                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
              ) : (
                <Menu.Item disabled={item.disabled}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        onChange?.(item.value)
                        item.onClick?.()
                      }}
                      className={clsx(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                        active && !item.disabled && 'bg-gray-100 dark:bg-gray-700',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        value === item.value && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      )}
                      disabled={item.disabled}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              )}
            </div>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  )
}
