/**
 * TagInput - Componente para agregar/remover tags con búsqueda y creación dinámica
 * 
 * Características:
 * - ✅ Agregar tags escribiendo y presionando Enter
 * - ✅ Eliminar tags con click en X
 * - ✅ Búsqueda/filtrado en lista de tags disponibles
 * - ✅ Creación de nuevos tags (marcados como "nuevos")
 * - ✅ Callback para guardar nuevos tags en BD
 * - ✅ Soporte para objetos completos (no solo strings)
 * - ✅ Validación de duplicados
 * - ✅ Límite máximo de tags (opcional)
 * - ✅ Modo async con loading states
 */

import { useState, useRef, Fragment } from 'react'
import type { KeyboardEvent } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { XMarkIcon, PlusIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export interface Tag {
  id: string | number
  label: string
  color?: string
  isNew?: boolean // Marca si es un tag recién creado
  [key: string]: any // Permite propiedades adicionales
}

export interface TagInputProps {
  // Valores seleccionados
  value: Tag[]
  onChange: (tags: Tag[]) => void

  // Tags disponibles para seleccionar
  availableTags?: Tag[]

  // Callbacks
  onCreateTag?: (label: string) => Promise<Tag> | Tag // Ejecutar cuando se crea un tag nuevo
  onSearchTags?: (query: string) => Promise<Tag[]> | Tag[] // Buscar tags en BD

  // Configuración
  label?: string
  placeholder?: string
  maxTags?: number // Límite de tags
  allowCreate?: boolean // Permitir crear nuevos tags
  disabled?: boolean
  error?: string
  helperText?: string
  
  // Validación
  validateTag?: (label: string) => string | null // Retorna mensaje de error o null

  // UI
  className?: string
  tagColorClass?: string // Clase de color por defecto para tags
  showSearchIcon?: boolean
}

export default function TagInput({
  value = [],
  onChange,
  availableTags = [],
  onCreateTag,
  onSearchTags,
  label,
  placeholder = 'Escribe y presiona Enter...',
  maxTags,
  allowCreate = true,
  disabled = false,
  error,
  helperText,
  validateTag,
  className,
  tagColorClass = 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  showSearchIcon = true,
}: TagInputProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Tag[]>(availableTags)
  const inputRef = useRef<HTMLInputElement>(null)

  // Validar si se alcanzó el límite
  const isMaxReached = maxTags ? value.length >= maxTags : false

  // Filtrar tags disponibles que no estén ya seleccionados
  const filteredTags = searchResults.filter(
    (tag) => !value.some((v) => v.id === tag.id) &&
      tag.label.toLowerCase().includes(query.toLowerCase())
  )

  // Verificar si el query coincide exactamente con un tag existente
  const exactMatch = filteredTags.find(
    (tag) => tag.label.toLowerCase() === query.toLowerCase()
  )

  // Mostrar opción de crear solo si no hay coincidencia exacta y se permite crear
  const showCreateOption = allowCreate && query.trim() !== '' && !exactMatch && !isMaxReached

  // Buscar tags (con debounce simulado)
  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)

    if (onSearchTags && searchQuery.length > 0) {
      setIsLoading(true)
      try {
        const results = await onSearchTags(searchQuery)
        setSearchResults(results)
      } catch (err) {
        console.error('Error al buscar tags:', err)
      } finally {
        setIsLoading(false)
      }
    } else {
      setSearchResults(availableTags)
    }
  }

  // Agregar tag
  const handleAddTag = async (tag: Tag) => {
    if (isMaxReached) return
    if (value.some((v) => v.id === tag.id)) return

    onChange([...value, tag])
    setQuery('')
    inputRef.current?.focus()
  }

  // Crear y agregar nuevo tag
  const handleCreateTag = async () => {
    if (!query.trim() || isMaxReached) return

    // Validar
    if (validateTag) {
      const errorMsg = validateTag(query.trim())
      if (errorMsg) {
        alert(errorMsg) // O mostrar en un estado de error
        return
      }
    }

    let newTag: Tag

    if (onCreateTag) {
      // Ejecutar callback de creación (puede guardar en BD)
      setIsLoading(true)
      try {
        newTag = await onCreateTag(query.trim())
      } catch (err) {
        console.error('Error al crear tag:', err)
        setIsLoading(false)
        return
      }
      setIsLoading(false)
    } else {
      // Crear tag local marcado como nuevo
      newTag = {
        id: `new_${Date.now()}`,
        label: query.trim(),
        isNew: true,
      }
    }

    onChange([...value, newTag])
    setQuery('')
    inputRef.current?.focus()
  }

  // Eliminar tag
  const handleRemoveTag = (tagId: string | number) => {
    onChange(value.filter((tag) => tag.id !== tagId))
  }

  // Manejar Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      if (exactMatch) {
        handleAddTag(exactMatch)
      } else if (showCreateOption) {
        handleCreateTag()
      } else if (filteredTags.length > 0) {
        handleAddTag(filteredTags[0])
      }
    } else if (e.key === 'Backspace' && query === '' && value.length > 0) {
      // Eliminar último tag con Backspace cuando input está vacío
      handleRemoveTag(value[value.length - 1].id)
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {maxTags && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              ({value.length}/{maxTags})
            </span>
          )}
        </label>
      )}

      <Combobox value={null} onChange={(tag) => tag && handleAddTag(tag)} disabled={disabled || isMaxReached}>
        <div className="relative">
          {/* Input Container */}
          <div
            className={clsx(
              'flex flex-wrap gap-2 p-2 min-h-[42px] border rounded-lg transition-colors',
              disabled || isMaxReached
                ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-primary-500',
              error && 'border-red-500 focus-within:ring-red-500'
            )}
          >
            {/* Tags seleccionados */}
            {value.map((tag) => (
              <div
                key={tag.id}
                className={clsx(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium',
                  tag.color || tagColorClass,
                  tag.isNew && 'ring-2 ring-green-400 dark:ring-green-600'
                )}
                style={tag.color ? { backgroundColor: tag.color } : undefined}
              >
                <span>{tag.label}</span>
                {tag.isNew && (
                  <span className="text-xs bg-green-500 text-white px-1 rounded" title="Tag nuevo">
                    NEW
                  </span>
                )}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5 transition-colors"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}

            {/* Input */}
            <div className="flex-1 flex items-center gap-2 min-w-[120px]">
              {showSearchIcon && (
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              )}
              <Combobox.Input
                ref={inputRef}
                className="flex-1 border-none outline-none bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 disabled:cursor-not-allowed"
                placeholder={isMaxReached ? 'Límite alcanzado' : placeholder}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled || isMaxReached}
              />
              {isLoading && (
                <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" />
              )}
            </div>
          </div>

          {/* Dropdown */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {/* Opción de crear nuevo */}
              {showCreateOption && (
                <Combobox.Option
                  value={null}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-pointer select-none py-2 px-3 flex items-center gap-2',
                      active && 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100'
                    )
                  }
                  onClick={handleCreateTag}
                >
                  <PlusIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium">Crear "{query}"</span>
                </Combobox.Option>
              )}

              {/* Tags existentes */}
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <Combobox.Option
                    key={tag.id}
                    value={tag}
                    className={({ active }) =>
                      clsx(
                        'relative cursor-pointer select-none py-2 px-3 flex items-center justify-between',
                        active && 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100'
                      )
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={clsx('block truncate', selected && 'font-medium')}>
                          {tag.label}
                        </span>
                        {selected && (
                          <CheckIcon className={clsx('h-5 w-5', active ? 'text-primary-600' : 'text-primary-600')} />
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              ) : query !== '' && !showCreateOption ? (
                <div className="relative cursor-default select-none py-2 px-3 text-gray-500 dark:text-gray-400">
                  No se encontraron tags
                </div>
              ) : null}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>

      {/* Helper text o error */}
      {(helperText || error) && (
        <p className={clsx('mt-1 text-sm', error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400')}>
          {error || helperText}
        </p>
      )}

      {/* Leyenda de tags nuevos */}
      {value.some((tag) => tag.isNew) && (
        <p className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
          <span className="bg-green-500 text-white px-1 rounded text-[10px]">NEW</span>
          Los tags marcados serán creados al guardar
        </p>
      )}
    </div>
  )
}

export { TagInput }
