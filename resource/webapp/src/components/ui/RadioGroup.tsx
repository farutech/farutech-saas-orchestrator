/**
 * Componente RadioGroup - Botones de radio
 */

import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string
  error?: string
  variant?: 'default' | 'card' | 'button'
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

export function RadioGroup({
  options,
  value,
  onChange,
  label,
  error,
  variant = 'default',
  orientation = 'vertical',
  className
}: RadioGroupProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {label}
        </label>
      )}
      <HeadlessRadioGroup value={value} onChange={onChange}>
        <div
          className={clsx(
            'space-y-2',
            orientation === 'horizontal' && 'flex gap-2 space-y-0'
          )}
        >
          {options.map((option) => {
            const OptionIcon = option.icon
            return (
              <HeadlessRadioGroup.Option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={({ checked, disabled }) =>
                  clsx(
                    'cursor-pointer focus:outline-none',
                    disabled && 'opacity-50 cursor-not-allowed',
                    variant === 'default' && 'flex items-start',
                    variant === 'card' && [
                      'relative flex rounded-xl border-2 p-4 transition-all duration-200',
                      checked
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400',
                    ],
                    variant === 'button' && [
                      'flex-1 text-center rounded-lg border-2 px-4 py-2 transition-all duration-200',
                      checked
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-primary-600',
                    ]
                  )
                }
              >
                {({ checked }) => (
                  <>
                    {variant === 'default' && (
                      <>
                        <div className="flex items-center h-5">
                          <div
                            className={clsx(
                              'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                              checked
                                ? 'border-primary-600 bg-primary-600'
                                : 'border-gray-300 dark:border-gray-600'
                            )}
                          >
                            {checked && (
                              <div className="h-2 w-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <HeadlessRadioGroup.Label
                            className={clsx(
                              'block text-sm font-medium',
                              checked
                                ? 'text-primary-900 dark:text-primary-100'
                                : 'text-gray-900 dark:text-white'
                            )}
                          >
                            {option.label}
                          </HeadlessRadioGroup.Label>
                          {option.description && (
                            <HeadlessRadioGroup.Description className="text-sm text-gray-500 dark:text-gray-400">
                              {option.description}
                            </HeadlessRadioGroup.Description>
                          )}
                        </div>
                      </>
                    )}

                    {variant === 'card' && (
                      <>
                        <div className="flex items-center flex-1">
                          {OptionIcon && (
                            <OptionIcon
                              className={clsx(
                                'h-6 w-6 mr-3',
                                checked
                                  ? 'text-primary-600'
                                  : 'text-gray-400'
                              )}
                            />
                          )}
                          <div className="flex-1">
                            <HeadlessRadioGroup.Label
                              className={clsx(
                                'block text-sm font-semibold',
                                checked
                                  ? 'text-primary-900 dark:text-primary-100'
                                  : 'text-gray-900 dark:text-white'
                              )}
                            >
                              {option.label}
                            </HeadlessRadioGroup.Label>
                            {option.description && (
                              <HeadlessRadioGroup.Description className="text-sm text-gray-500 dark:text-gray-400">
                                {option.description}
                              </HeadlessRadioGroup.Description>
                            )}
                          </div>
                        </div>
                        {checked && (
                          <CheckCircleIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
                        )}
                      </>
                    )}

                    {variant === 'button' && (
                      <HeadlessRadioGroup.Label className="text-sm font-medium">
                        {option.label}
                      </HeadlessRadioGroup.Label>
                    )}
                  </>
                )}
              </HeadlessRadioGroup.Option>
            )
          })}
        </div>
      </HeadlessRadioGroup>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
