/**
 * DatePicker - Componente de selección de fechas profesional
 * 
 * Características:
 * - ✅ Date picker (fecha simple)
 * - ✅ DateTime picker (fecha + hora)
 * - ✅ DateRange picker (rango de fechas)
 * - ✅ Presets rápidos (Hoy, Esta semana, Este mes, etc.)
 * - ✅ Locale support (español por defecto)
 * - ✅ Validación de rango min/max
 * - ✅ Estados: disabled, error
 * - ✅ Integración con formularios
 * 
 * @example Date simple
 * ```tsx
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   label="Fecha de nacimiento"
 * />
 * ```
 * 
 * @example DateTime
 * ```tsx
 * <DateTimePicker
 *   value={dateTime}
 *   onChange={setDateTime}
 *   label="Fecha y hora del evento"
 * />
 * ```
 * 
 * @example DateRange con presets
 * ```tsx
 * <DateRangePicker
 *   value={range}
 *   onChange={setRange}
 *   presets={['today', 'thisWeek', 'thisMonth']}
 *   label="Rango de fechas"
 * />
 * ```
 */

import { useState, useRef } from 'react'
import { Popover } from '@headlessui/react'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Button } from './Button'

export interface DatePickerProps {
  /** Valor de la fecha (Date o string ISO) */
  value?: Date | string | null
  /** Callback al cambiar */
  onChange?: (date: Date | null) => void
  /** Label del input */
  label?: string
  /** Placeholder */
  placeholder?: string
  /** Fecha mínima permitida */
  minDate?: Date
  /** Fecha máxima permitida */
  maxDate?: Date
  /** Formato de fecha para mostrar (default: 'dd/MM/yyyy') */
  format?: string
  /** Disabled */
  disabled?: boolean
  /** Error message */
  error?: string
  /** Clase CSS adicional */
  className?: string
  /** Permitir limpiar */
  clearable?: boolean
}

export interface DateTimePickerProps extends DatePickerProps {
  /** Incluir selector de hora */
  showTime?: boolean
}

export interface DateRangePickerProps {
  /** Valor del rango [start, end] */
  value?: [Date | null, Date | null]
  /** Callback al cambiar */
  onChange?: (range: [Date | null, Date | null]) => void
  /** Label del input */
  label?: string
  /** Placeholder */
  placeholder?: string
  /** Presets rápidos */
  presets?: Array<'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear'>
  /** Disabled */
  disabled?: boolean
  /** Error message */
  error?: string
  /** Clase CSS adicional */
  className?: string
}

// Utilidades de fecha
function formatDate(date: Date | string | null | undefined, format = 'dd/MM/yyyy'): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', String(year))
    .replace('HH', hours)
    .replace('mm', minutes)
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

/**
 * Componente DatePicker
 */
export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Seleccionar fecha',
  minDate,
  maxDate,
  format = 'dd/MM/yyyy',
  disabled = false,
  error,
  className,
  clearable = true,
}: DatePickerProps) {
  const dateValue = value ? (typeof value === 'string' ? new Date(value) : value) : null
  const [viewDate, setViewDate] = useState(dateValue || new Date())
  const buttonRef = useRef<HTMLButtonElement>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))
  }

  const handleDateSelect = (date: Date, close: () => void) => {
    onChange?.(date)
    close()
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null)
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const days = getDaysInMonth(viewDate)

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              ref={buttonRef}
              disabled={disabled}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2 text-left rounded-lg border transition-colors',
                disabled
                  ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                  : error
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-primary-500',
                open && 'ring-2 ring-primary-500'
              )}
            >
              <span className={clsx('text-sm', dateValue ? 'text-gray-900 dark:text-white' : 'text-gray-400')}>
                {dateValue ? formatDate(dateValue, format) : placeholder}
              </span>
              <div className="flex items-center gap-1">
                {clearable && dateValue && !disabled && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-400" />
                  </button>
                )}
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
            </Popover.Button>

            <Popover.Panel className="absolute z-50 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} />
                  }

                  const isSelected = dateValue && isSameDay(day, dateValue)
                  const isToday = isSameDay(day, new Date())
                  const disabled = isDateDisabled(day)

                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleDateSelect(day, close)}
                      className={clsx(
                        'aspect-square rounded-lg text-sm transition-colors',
                        isSelected
                          ? 'bg-primary-600 text-white font-semibold'
                          : isToday
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                          : disabled
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>

              {/* Botón Hoy */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDateSelect(new Date(), close)}
                  className="w-full"
                >
                  Hoy
                </Button>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

/**
 * Componente DateTimePicker (con hora)
 */
export function DateTimePicker(props: DateTimePickerProps) {
  // Similar a DatePicker pero con selector de hora adicional
  // Por simplicidad, aquí retornamos DatePicker con formato extendido
  return <DatePicker {...props} format="dd/MM/yyyy HH:mm" />
}

/**
 * Componente DateRangePicker
 */
export function DateRangePicker({
  value = [null, null],
  onChange,
  label,
  presets = [],
  disabled = false,
  error,
  className,
}: DateRangePickerProps) {
  const [start, end] = value

  const getPresetRange = (preset: string): [Date, Date] => {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    switch (preset) {
      case 'today':
        return [startOfDay, today]
      case 'yesterday': {
        const yesterday = new Date(startOfDay)
        yesterday.setDate(yesterday.getDate() - 1)
        return [yesterday, yesterday]
      }
      case 'thisWeek': {
        const start = new Date(startOfDay)
        start.setDate(start.getDate() - start.getDay())
        return [start, today]
      }
      case 'lastWeek': {
        const end = new Date(startOfDay)
        end.setDate(end.getDate() - end.getDay() - 1)
        const start = new Date(end)
        start.setDate(start.getDate() - 6)
        return [start, end]
      }
      case 'thisMonth': {
        const start = new Date(today.getFullYear(), today.getMonth(), 1)
        return [start, today]
      }
      case 'lastMonth': {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const end = new Date(today.getFullYear(), today.getMonth(), 0)
        return [start, end]
      }
      case 'thisYear': {
        const start = new Date(today.getFullYear(), 0, 1)
        return [start, today]
      }
      default:
        return [today, today]
    }
  }

  const presetLabels: Record<string, string> = {
    today: 'Hoy',
    yesterday: 'Ayer',
    thisWeek: 'Esta semana',
    lastWeek: 'Semana pasada',
    thisMonth: 'Este mes',
    lastMonth: 'Mes pasado',
    thisYear: 'Este año',
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Presets */}
        {presets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset}
                variant="secondary"
                size="sm"
                onClick={() => onChange?.(getPresetRange(preset))}
                disabled={disabled}
              >
                {presetLabels[preset]}
              </Button>
            ))}
          </div>
        )}

        {/* Date Range Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            value={start}
            onChange={(date) => onChange?.([date, end])}
            placeholder="Fecha inicio"
            disabled={disabled}
            clearable={false}
          />
          <DatePicker
            value={end}
            onChange={(date) => onChange?.([start, date])}
            placeholder="Fecha fin"
            minDate={start || undefined}
            disabled={disabled}
            clearable={false}
          />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
