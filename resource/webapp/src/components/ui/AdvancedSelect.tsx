/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADVANCED SELECT COMPONENTS                             ║
 * ║                                                                            ║
 * ║  Selectores avanzados enterprise con soporte para:                        ║
 * ║  - Banderas de países                                                     ║
 * ║  - Indicativos telefónicos                                                ║
 * ║  - Iniciales de usuarios                                                  ║
 * ║  - Multi-select                                                           ║
 * ║  - Autocompletado                                                         ║
 * ║  - Búsqueda integrada                                                     ║
 * ║                                                                            ║
 * ║  @author    Farid Maloof Suarez                                           ║
 * ║  @company   FaruTech                                                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { Fragment, useState, useMemo } from 'react'
import { Listbox, Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

// ============================================================================
// TYPES
// ============================================================================

export interface SelectOption<T = any> {
  label: string
  value: T
  description?: string
  disabled?: boolean
  icon?: React.ReactNode
  flag?: string // Emoji o URL de bandera
  dialCode?: string // Código de marcación telefónica
  initials?: string // Iniciales de nombre
  color?: string // Color para iniciales
  metadata?: Record<string, any>
}

export interface AdvancedSelectProps<T = any> {
  options: SelectOption<T>[]
  value?: T
  onChange: (value: T) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  variant?: 'default' | 'flag' | 'dialCode' | 'initials' | 'icon'
  searchable?: boolean
  clearable?: boolean
}

export interface MultiSelectProps<T = any> extends Omit<AdvancedSelectProps<T>, 'value' | 'onChange'> {
  value?: T[]
  onChange: (value: T[]) => void
  maxSelections?: number
}

// ============================================================================
// COMPONENT: AdvancedSelect
// ============================================================================

export function AdvancedSelect<T = any>({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  label,
  error,
  disabled = false,
  required = false,
  className,
  variant = 'default',
  searchable = false,
  clearable = false
}: AdvancedSelectProps<T>) {
  const [query, setQuery] = useState('')

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  )

  const filteredOptions = useMemo(() => {
    if (!searchable || !query) return options

    const lowerQuery = query.toLowerCase()
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerQuery) ||
        opt.description?.toLowerCase().includes(lowerQuery) ||
        opt.dialCode?.includes(lowerQuery)
    )
  }, [options, query, searchable])

  const renderOption = (option: SelectOption<T>, selected: boolean, active: boolean) => {
    return (
      <div className={clsx('flex items-center gap-3', active && 'font-medium')}>
        {/* Bandera */}
        {variant === 'flag' && option.flag && (
          <span className="text-2xl">{option.flag}</span>
        )}

        {/* Indicativo telefónico */}
        {variant === 'dialCode' && (
          <div className="flex items-center gap-2">
            {option.flag && <span className="text-xl">{option.flag}</span>}
            {option.dialCode && (
              <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                {option.dialCode}
              </span>
            )}
          </div>
        )}

        {/* Iniciales */}
        {variant === 'initials' && option.initials && (
          <div
            className={clsx(
              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white',
              option.color || 'bg-gradient-to-br from-blue-500 to-purple-600'
            )}
            style={option.color ? { backgroundColor: option.color } : undefined}
          >
            {option.initials}
          </div>
        )}

        {/* Icono personalizado */}
        {variant === 'icon' && option.icon && (
          <div className="flex h-6 w-6 items-center justify-center">
            {option.icon}
          </div>
        )}

        {/* Label y descripción */}
        <div className="flex-1">
          <div className={clsx('text-sm', active && 'font-medium')}>{option.label}</div>
          {option.description && (
            <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
          )}
        </div>

        {/* Check si está seleccionado */}
        {selected && (
          <CheckIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
        )}
      </div>
    )
  }

  const SelectComponent = searchable ? Combobox : Listbox

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <SelectComponent
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <div className="relative">
          <SelectComponent.Button
            className={clsx(
              'relative w-full cursor-pointer rounded-lg border py-2.5 pl-3 pr-10 text-left shadow-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              disabled && 'cursor-not-allowed bg-gray-100 dark:bg-gray-800',
              !disabled && 'bg-white dark:bg-gray-900',
              error
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700',
              'text-sm'
            )}
          >
            <span className="block truncate">
              {selectedOption ? (
                <div className="flex items-center gap-2">
                  {variant === 'flag' && selectedOption.flag && (
                    <span className="text-xl">{selectedOption.flag}</span>
                  )}
                  {variant === 'dialCode' && (
                    <>
                      {selectedOption.flag && <span className="text-lg">{selectedOption.flag}</span>}
                      {selectedOption.dialCode && (
                        <span className="font-mono text-gray-600 dark:text-gray-400">
                          {selectedOption.dialCode}
                        </span>
                      )}
                    </>
                  )}
                  {variant === 'initials' && selectedOption.initials && (
                    <div
                      className={clsx(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white',
                        selectedOption.color || 'bg-gradient-to-br from-blue-500 to-purple-600'
                      )}
                      style={selectedOption.color ? { backgroundColor: selectedOption.color } : undefined}
                    >
                      {selectedOption.initials}
                    </div>
                  )}
                  {variant === 'icon' && selectedOption.icon}
                  <span>{selectedOption.label}</span>
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              {clearable && selectedOption && !disabled ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange(null as any)
                  }}
                  className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </span>
          </SelectComponent.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <SelectComponent.Options
              className={clsx(
                'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg',
                'bg-white dark:bg-gray-900',
                'border border-gray-200 dark:border-gray-700',
                'shadow-lg ring-1 ring-black ring-opacity-5',
                'focus:outline-none text-sm'
              )}
            >
              {searchable && (
                <div className="sticky top-0 bg-white dark:bg-gray-900 p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      className={clsx(
                        'w-full rounded-lg border border-gray-300 dark:border-gray-700',
                        'bg-white dark:bg-gray-800',
                        'pl-10 pr-3 py-2 text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500'
                      )}
                      placeholder="Buscar..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {filteredOptions.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron resultados
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <SelectComponent.Option
                    key={String(option.value)}
                    value={option.value}
                    disabled={option.disabled}
                    className={({ active }) =>
                      clsx(
                        'relative cursor-pointer select-none py-3 px-4',
                        active
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100'
                          : 'text-gray-900 dark:text-gray-100',
                        option.disabled && 'cursor-not-allowed opacity-50'
                      )
                    }
                  >
                    {({ selected, active }) => renderOption(option, selected, active)}
                  </SelectComponent.Option>
                ))
              )}
            </SelectComponent.Options>
          </Transition>
        </div>
      </SelectComponent>

      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

// ============================================================================
// COMPONENT: MultiSelect
// ============================================================================

export function MultiSelect<T = any>({
  options,
  value = [],
  onChange,
  placeholder = 'Seleccionar múltiples...',
  label,
  error,
  disabled = false,
  required = false,
  className,
  variant = 'default',
  searchable = true,
  maxSelections,
}: MultiSelectProps<T>) {
  const [query, setQuery] = useState('')

  const selectedOptions = useMemo(
    () => options.filter((opt) => value.includes(opt.value)),
    [options, value]
  )

  const filteredOptions = useMemo(() => {
    if (!searchable || !query) return options

    const lowerQuery = query.toLowerCase()
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerQuery) ||
        opt.description?.toLowerCase().includes(lowerQuery)
    )
  }, [options, query, searchable])

  const handleToggle = (optionValue: T) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return
      }
      onChange([...value, optionValue])
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
          {maxSelections && (
            <span className="ml-2 text-xs text-gray-500">
              ({value.length}/{maxSelections})
            </span>
          )}
        </label>
      )}

      <Listbox value={value} onChange={onChange} disabled={disabled} multiple>
        <div className="relative">
          <Listbox.Button
            className={clsx(
              'relative w-full cursor-pointer rounded-lg border py-2.5 pl-3 pr-10 text-left shadow-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              disabled && 'cursor-not-allowed bg-gray-100 dark:bg-gray-800',
              !disabled && 'bg-white dark:bg-gray-900',
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700',
              'text-sm min-h-[42px]'
            )}
          >
            <span className="block">
              {selectedOptions.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map((option) => (
                    <span
                      key={String(option.value)}
                      className={clsx(
                        'inline-flex items-center gap-1 rounded-md px-2 py-1',
                        'bg-primary-100 dark:bg-primary-900/30',
                        'text-xs font-medium text-primary-700 dark:text-primary-300'
                      )}
                    >
                      {variant === 'flag' && option.flag && (
                        <span className="text-sm">{option.flag}</span>
                      )}
                      {variant === 'initials' && option.initials && (
                        <div
                          className={clsx(
                            'flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-white'
                          )}
                          style={option.color ? { backgroundColor: option.color } : undefined}
                        >
                          {option.initials}
                        </div>
                      )}
                      {option.label}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={clsx(
                'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg',
                'bg-white dark:bg-gray-900',
                'border border-gray-200 dark:border-gray-700',
                'shadow-lg ring-1 ring-black ring-opacity-5',
                'focus:outline-none text-sm'
              )}
            >
              {searchable && (
                <div className="sticky top-0 bg-white dark:bg-gray-900 p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      className={clsx(
                        'w-full rounded-lg border border-gray-300 dark:border-gray-700',
                        'bg-white dark:bg-gray-800',
                        'pl-10 pr-3 py-2 text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500'
                      )}
                      placeholder="Buscar..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {filteredOptions.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron resultados
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value)
                  const isDisabled = option.disabled || (maxSelections ? value.length >= maxSelections && !isSelected : false)

                  return (
                    <Listbox.Option
                      key={String(option.value)}
                      value={option.value}
                      disabled={isDisabled}
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none py-3 px-4 flex items-center gap-3',
                          active
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100'
                            : 'text-gray-900 dark:text-gray-100',
                          isDisabled && 'cursor-not-allowed opacity-50'
                        )
                      }
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(option.value)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        onClick={(e) => e.stopPropagation()}
                      />

                      {variant === 'flag' && option.flag && (
                        <span className="text-xl">{option.flag}</span>
                      )}

                      {variant === 'initials' && option.initials && (
                        <div
                          className={clsx(
                            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white'
                          )}
                          style={option.color ? { backgroundColor: option.color } : undefined}
                        >
                          {option.initials}
                        </div>
                      )}

                      {variant === 'icon' && option.icon}

                      <div className="flex-1">
                        <div className="text-sm font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </Listbox.Option>
                  )
                })
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

// ============================================================================
// PRESET: CountrySelect (con banderas)
// ============================================================================

export interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
}

// Lista de países más comunes (agregar más según necesidad)
export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'ES', name: 'España', flag: '🇪🇸', dialCode: '+34' },
  { code: 'MX', name: 'México', flag: '🇲🇽', dialCode: '+52' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪', dialCode: '+51' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
]

export interface CountrySelectProps {
  value?: string
  onChange: (countryCode: string) => void
  label?: string
  error?: string
  showDialCode?: boolean
  className?: string
}

export function CountrySelect({
  value,
  onChange,
  label = 'País',
  error,
  showDialCode = false,
  className
}: CountrySelectProps) {
  const options: SelectOption<string>[] = COUNTRIES.map((country) => ({
    label: country.name,
    value: country.code,
    flag: country.flag,
    dialCode: country.dialCode
  }))

  return (
    <AdvancedSelect
      options={options}
      value={value}
      onChange={onChange}
      label={label}
      error={error}
      className={className}
      variant={showDialCode ? 'dialCode' : 'flag'}
      searchable
      clearable
    />
  )
}

export default AdvancedSelect
