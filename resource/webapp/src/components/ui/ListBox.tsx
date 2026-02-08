/**
 * Componente ListBox - Lista seleccionable con imágenes, selección múltiple y deselección
 */

import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Fragment, useState, useEffect, useRef } from 'react'
import React from 'react'

export interface ListBoxOption {
  id: string
  label: string
  description?: string
  image?: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

interface ListBoxProps {
  options: ListBoxOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  label?: string
  placeholder?: string
  className?: string
  error?: string
  /** Permitir selección múltiple */
  multiple?: boolean
  /** Permitir deseleccionar la opción actual */
  allowDeselect?: boolean
  /** Enable search/filter functionality */
  searchable?: boolean
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Minimum characters to start searching (default: 0) */
  minSearchChars?: number
  /** Empty state message when no options match search */
  emptyMessage?: string
  /** Loading state */
  loading?: boolean
}

export function ListBox({
  options,
  value,
  onChange,
  label,
  placeholder = 'Seleccionar opción',
  className,
  error,
  multiple = false,
  allowDeselect = false,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  minSearchChars = 0,
  emptyMessage = 'No se encontraron opciones',
  loading = false,
}: ListBoxProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  const selectedValues = multiple 
    ? (Array.isArray(value) ? value : [])
    : (value ? [value] : [])
  
  const selectedOptions = options.filter(opt => selectedValues.includes(opt.id))

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery.length >= minSearchChars
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  // Reset search when closing
  useEffect(() => {
    if (searchable) {
      return () => setSearchQuery('')
    }
  }, [])

  const handleChange = (newValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      const isSelected = currentValues.includes(newValue)
      
      if (isSelected && allowDeselect) {
        // Deseleccionar
        onChange?.(currentValues.filter(v => v !== newValue))
      } else if (isSelected) {
        // Ya está seleccionado y no se permite deseleccionar
        return
      } else {
        // Agregar a la selección
        onChange?.([...currentValues, newValue])
      }
    } else {
      // Selección simple
      if (value === newValue && allowDeselect) {
        onChange?.('')
      } else {
        onChange?.(newValue)
      }
    }
  }

  const removeOption = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple && Array.isArray(value)) {
      onChange?.(value.filter(v => v !== optionId))
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <Listbox 
        value={typeof value === 'string' ? value : (value?.[0] || '')} 
        onChange={(newValue: string) => {
          if (multiple) {
            handleChange(newValue)
          } else if (value === newValue && allowDeselect) {
            onChange?.('')
          } else {
            onChange?.(newValue)
          }
        }}
      >
        <div className="relative">
          <Listbox.Button
            className={clsx(
              'relative w-full cursor-pointer rounded-xl border py-3 pl-3 pr-10 text-left',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'bg-white dark:bg-gray-800',
              error
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-600',
              multiple && selectedOptions.length > 0 && 'py-2'
            )}
          >
            {multiple && selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map((opt) => (
                  <span
                    key={opt.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm"
                  >
                    {opt.image && (
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="h-4 w-4 rounded object-cover"
                      />
                    )}
                    {opt.icon && React.createElement(opt.icon, { className: "h-4 w-4" })}
                    <span className="font-medium">{opt.label}</span>
                    <button
                      onClick={(e) => removeOption(opt.id, e)}
                      className="hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : selectedOptions.length === 1 && !multiple ? (
              <span className="flex items-center gap-3">
                {selectedOptions[0].image && (
                  <img
                    src={selectedOptions[0].image}
                    alt={selectedOptions[0].label}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                )}
                {selectedOptions[0].icon && 
                  React.createElement(selectedOptions[0].icon, { className: "h-6 w-6 text-gray-500" })
                }
                <span className="block truncate">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedOptions[0].label}
                  </span>
                  {selectedOptions[0].description && (
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {selectedOptions[0].description}
                    </span>
                  )}
                </span>
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                {placeholder}
                {multiple && selectedOptions.length > 0 && ` (${selectedOptions.length})`}
              </span>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 focus:outline-none">
            {/* Search input */}
            {searchable && (
              <div className="sticky top-0 bg-white dark:bg-gray-800 px-2 py-2 border-b border-gray-200 dark:border-gray-700 z-10">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {minSearchChars > 0 && searchQuery.length > 0 && searchQuery.length < minSearchChars && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 px-1">
                    Escribe al menos {minSearchChars} {minSearchChars === 1 ? 'carácter' : 'caracteres'}
                  </p>
                )}
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredOptions.length === 0 && (
              <div className="px-3 py-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}

            {/* Options list */}
            {!loading && filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.id)
              
              return (
                <Listbox.Option
                  key={option.id}
                  value={option.id}
                  disabled={option.disabled}
                  as={Fragment}
                >
                  {({ active }) => (
                    <li
                      className={clsx(
                        'relative cursor-pointer select-none py-3 pl-3 pr-9 mx-1 rounded-lg transition-colors',
                        active && 'bg-primary-50 dark:bg-primary-900/20',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {multiple && (
                          <div
                            className={clsx(
                              'flex items-center justify-center w-5 h-5 rounded border-2 transition-colors',
                              isSelected
                                ? 'bg-primary-600 border-primary-600'
                                : 'border-gray-300 dark:border-gray-600'
                            )}
                          >
                            {isSelected && (
                              <CheckIcon className="h-3 w-3 text-white" />
                            )}
                          </div>
                        )}
                        {option.image && (
                          <img
                            src={option.image}
                            alt={option.label}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                        )}
                        {option.icon && 
                          React.createElement(option.icon, { 
                            className: clsx('h-6 w-6', isSelected ? 'text-primary-600' : 'text-gray-500')
                          })
                        }
                        <span className="block truncate">
                          <span
                            className={clsx(
                              'font-medium',
                              isSelected
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-gray-900 dark:text-white'
                            )}
                          >
                            {option.label}
                          </span>
                          {option.description && (
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                              {option.description}
                            </span>
                          )}
                        </span>
                      </div>
                      {!multiple && isSelected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <CheckIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </span>
                      )}
                    </li>
                  )}
                </Listbox.Option>
              )
            })}
          </Listbox.Options>
        </div>
      </Listbox>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
