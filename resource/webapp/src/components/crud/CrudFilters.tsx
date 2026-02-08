/**
 * Componente de filtros avanzados para CRUD
 */

import { useState } from 'react'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Modal } from '../ui/Modal'

interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number'
  options?: { label: string; value: any }[]
  placeholder?: string
}

interface CrudFiltersProps {
  fields: FilterField[]
  onApply: (filters: Record<string, any>) => void
  onReset?: () => void
}

export function CrudFilters({ fields, onApply, onReset }: CrudFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleApply = () => {
    setActiveFilters(filters)
    onApply(filters)
    setIsOpen(false)
  }

  const handleReset = () => {
    setFilters({})
    setActiveFilters({})
    onReset?.()
    setIsOpen(false)
  }

  const activeFilterCount = Object.keys(activeFilters).filter(
    (key) => activeFilters[key] !== '' && activeFilters[key] !== undefined
  ).length

  return (
    <>
      <Button
        variant="secondary"
        icon={<FunnelIcon className="h-5 w-5" />}
        onClick={() => setIsOpen(true)}
      >
        Filtros
        {activeFilterCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filtros Avanzados"
        size="md"
      >
        <div className="space-y-4">
          {fields.map((field) => {
            if (field.type === 'select') {
              return (
                <Select
                  key={field.key}
                  label={field.label}
                  options={field.options || []}
                  value={filters[field.key] || ''}
                  onChange={(e) => handleFilterChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              )
            }

            return (
              <Input
                key={field.key}
                label={field.label}
                type={field.type}
                value={filters[field.key] || ''}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            )
          })}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            icon={<XMarkIcon className="h-5 w-5" />}
            onClick={handleReset}
          >
            Limpiar filtros
          </Button>
          
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApply}>
              Aplicar filtros
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
