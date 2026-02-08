/**
 * DateControls - Suite completa de controles de fecha y hora
 * 
 * Componentes incluidos:
 * - DatePicker: Selector de fecha simple
 * - DateTimePicker: Selector de fecha y hora
 * - DateRangePicker: Selector de rango de fechas
 * - TimeRangePicker: Selector de rango de horas
 * - DateIntervalPicker: Selector de intervalo con validación
 * 
 * Características:
 * - ✅ Navegación avanzada (<<, >>, <, >)
 * - ✅ Validación de rangos
 * - ✅ Formato flexible (con/sin hora)
 * - ✅ Soporte de locale (español)
 * - ✅ Desacoplado y reutilizable
 * - ✅ Integración con formularios
 */

import { useState, useRef, Fragment, useEffect } from 'react'
import { Popover, Transition, Listbox } from '@headlessui/react'
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Button } from './Button'
import { useLocaleStore, formatDateWithLocale, type DateFormat, type TimeFormat } from '@/store/localeStore'

// ============================================================================
// TIPOS Y UTILIDADES
// ============================================================================

export interface BaseDatePickerProps {
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
  clearable?: boolean
  placement?: 'top' | 'bottom' | 'auto' // Posición del panel
  /** Formato de fecha personalizado (sobrescribe el del store) */
  dateFormat?: DateFormat
  /** Formato de hora personalizado (sobrescribe el del store) */
  timeFormat?: TimeFormat
}

export interface SingleDatePickerProps extends BaseDatePickerProps {
  value?: Date | string | null
  onChange?: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  showTime?: boolean
  format?: 'date' | 'datetime' | 'time'
}

export interface DateRangePickerProps extends BaseDatePickerProps {
  value?: [Date | null, Date | null]
  onChange?: (range: [Date | null, Date | null]) => void
  showTime?: boolean
  presets?: Array<'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'last7days' | 'last30days' | 'thisYear'>
}

export interface TimeRangePickerProps extends BaseDatePickerProps {
  value?: [string, string] // HH:mm format
  onChange?: (range: [string, string]) => void
  minTime?: string
  maxTime?: string
  step?: number // minutos
}

// Utilidades de fecha (ahora vienen del store de locale)
// Las funciones usan el locale seleccionado automáticamente

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function getDaysInMonth(date: Date) {
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

// ============================================================================
// COMPONENTE INTERNO: CalendarNavigation
// ============================================================================

interface CalendarNavigationProps {
  viewDate: Date
  onPrevYear: () => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onNextYear: () => void
  onYearSelect?: (year: number) => void
  onMonthSelect?: (month: number) => void
  enableYearNavigation?: boolean
}

function CalendarNavigation({
  viewDate,
  onPrevYear,
  onPrevMonth,
  onNextMonth,
  onNextYear,
  onYearSelect,
  onMonthSelect,
  enableYearNavigation = true,
}: CalendarNavigationProps) {

  
  const currentYear = viewDate.getFullYear()
  const currentMonth = viewDate.getMonth()
  
  // Obtener meses del locale actual
  const localeConfig = useLocaleStore((state) => state.getLocaleConfig())
  const MONTHS = localeConfig.months

  // Generar años (10 años antes y después)
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Navegación de año */}
      {enableYearNavigation && (
        <button
          type="button"
          onClick={onPrevYear}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Año anterior"
        >
          <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Navegación de mes */}
      <button
        type="button"
        onClick={onPrevMonth}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Mes anterior"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Selector de mes y año */}
      <div className="flex items-center gap-2">
        {onMonthSelect ? (
          <Listbox value={currentMonth} onChange={(value) => {
            onMonthSelect(value)
          }}>
            <div className="relative">
              <Listbox.Button className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                {MONTHS[currentMonth]}
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-[9999] mt-1 max-h-60 w-40 overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {MONTHS.map((month, idx) => (
                    <Listbox.Option
                      key={idx}
                      value={idx}
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none py-2 px-3',
                          active ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'
                        )
                      }
                    >
                      {({ selected }) => (
                        <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                          {month}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        ) : (
          <span className="font-semibold text-gray-900 dark:text-white">
            {MONTHS[currentMonth]}
          </span>
        )}

        {onYearSelect && enableYearNavigation ? (
          <Listbox value={currentYear} onChange={(value) => {
            onYearSelect(value)
          }}>
            <div className="relative">
              <Listbox.Button className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                {currentYear}
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-[9999] mt-1 max-h-60 w-24 overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {years.map((year) => (
                    <Listbox.Option
                      key={year}
                      value={year}
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none py-2 px-3',
                          active ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'
                        )
                      }
                    >
                      {({ selected }) => (
                        <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                          {year}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        ) : (
          <span className="font-semibold text-gray-900 dark:text-white">
            {currentYear}
          </span>
        )}
      </div>

      {/* Navegación de mes derecha */}
      <button
        type="button"
        onClick={onNextMonth}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Mes siguiente"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Navegación de año derecha */}
      {enableYearNavigation && (
        <button
          type="button"
          onClick={onNextYear}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Año siguiente"
        >
          <ChevronDoubleRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENTE INTERNO: CalendarGrid
// ============================================================================

interface CalendarGridProps {
  viewDate: Date
  selectedDate?: Date | null
  minDate?: Date
  maxDate?: Date
  onDateSelect: (date: Date) => void
  rangeStart?: Date | null
  rangeEnd?: Date | null
  isRangeMode?: boolean
}

function CalendarGrid({
  viewDate,
  selectedDate,
  minDate,
  maxDate,
  onDateSelect,
  rangeStart,
  rangeEnd,
  isRangeMode = false,
}: CalendarGridProps) {
  const days = getDaysInMonth(viewDate)
  
  // Obtener días de la semana del locale actual
  const localeConfig = useLocaleStore((state) => state.getLocaleConfig())
  const DAYS = localeConfig.daysShort

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isInRange = (date: Date) => {
    if (!isRangeMode || !rangeStart || !rangeEnd) return false
    return date >= rangeStart && date <= rangeEnd
  }

  return (
    <>
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

          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isToday = isSameDay(day, new Date())
          const disabled = isDateDisabled(day)
          const inRange = isInRange(day)
          const isRangeStartDay = rangeStart && isSameDay(day, rangeStart)
          const isRangeEndDay = rangeEnd && isSameDay(day, rangeEnd)

          return (
            <button
              key={index}
              type="button"
              disabled={disabled}
              onClick={() => onDateSelect(day)}
              className={clsx(
                'aspect-square rounded-lg text-sm transition-all duration-200',
                isSelected || isRangeStartDay || isRangeEndDay
                  ? 'bg-primary-600 text-white font-semibold shadow-md'
                  : inRange
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100'
                  : isToday
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium ring-2 ring-primary-600 dark:ring-primary-400'
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
    </>
  )
}

// ============================================================================
// COMPONENTE INTERNO: TimePicker
// ============================================================================

interface TimePickerProps {
  value: Date
  onChange: (date: Date) => void
}

function TimePicker({ value, onChange }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const handleHourChange = (hour: number) => {
    const newDate = new Date(value)
    newDate.setHours(hour)
    onChange(newDate)
  }

  const handleMinuteChange = (minute: number) => {
    const newDate = new Date(value)
    newDate.setMinutes(minute)
    onChange(newDate)
  }

  return (
    <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
      <ClockIcon className="h-5 w-5 text-gray-400" />
      
      {/* Selector de hora */}
      <Listbox value={value.getHours()} onChange={handleHourChange}>
        <div className="relative">
          <Listbox.Button className="relative w-16 cursor-pointer rounded-lg bg-white dark:bg-gray-700 py-2 px-3 text-left shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm">
            <span className="block truncate">{String(value.getHours()).padStart(2, '0')}</span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-[9999] mt-1 max-h-60 w-16 overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {hours.map((hour) => (
                <Listbox.Option
                  key={hour}
                  value={hour}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-pointer select-none py-2 px-3',
                      active ? 'bg-primary-100 dark:bg-primary-900/50' : ''
                    )
                  }
                >
                  {String(hour).padStart(2, '0')}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      <span className="text-gray-500 dark:text-gray-400 font-bold">:</span>

      {/* Selector de minutos */}
      <Listbox value={value.getMinutes()} onChange={handleMinuteChange}>
        <div className="relative">
          <Listbox.Button className="relative w-16 cursor-pointer rounded-lg bg-white dark:bg-gray-700 py-2 px-3 text-left shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm">
            <span className="block truncate">{String(value.getMinutes()).padStart(2, '0')}</span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-[9999] mt-1 max-h-60 w-16 overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {minutes.map((minute) => (
                <Listbox.Option
                  key={minute}
                  value={minute}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-pointer select-none py-2 px-3',
                      active ? 'bg-primary-100 dark:bg-primary-900/50' : ''
                    )
                  }
                >
                  {String(minute).padStart(2, '0')}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL: DatePicker
// ============================================================================

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Seleccionar fecha',
  minDate,
  maxDate,
  showTime = false,
  disabled = false,
  error,
  className,
  clearable = true,
  placement = 'auto', // Por defecto 'auto' detecta espacio disponible
  dateFormat,
  timeFormat,
}: SingleDatePickerProps) {
  const dateValue = value ? (typeof value === 'string' ? new Date(value) : value) : null
  const [viewDate, setViewDate] = useState(dateValue || new Date())
  const [timeValue, setTimeValue] = useState(dateValue || new Date())
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [panelPlacement, setPanelPlacement] = useState<'top' | 'bottom'>('bottom')

  const handleDateSelect = (date: Date, close: () => void) => {
    if (showTime) {
      // Combinar fecha seleccionada con hora actual
      const combined = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        timeValue.getHours(),
        timeValue.getMinutes()
      )
      onChange?.(combined)
    } else {
      onChange?.(date)
      close()
    }
  }

  const handleTimeChange = (date: Date) => {
    setTimeValue(date)
    if (dateValue) {
      const combined = new Date(
        dateValue.getFullYear(),
        dateValue.getMonth(),
        dateValue.getDate(),
        date.getHours(),
        date.getMinutes()
      )
      onChange?.(combined)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null)
  }

  // Calcular posición del panel al abrir
  useEffect(() => {
    if (placement === 'auto' && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const panelHeight = 400 // Altura aproximada del panel

      // Si no hay espacio abajo pero sí arriba, mostrar arriba
      setPanelPlacement(spaceBelow < panelHeight && spaceAbove > panelHeight ? 'top' : 'bottom')
    } else if (placement !== 'auto') {
      setPanelPlacement(placement)
    }
  }, [placement])

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <Popover className="relative">
        {({ open, close }) => {
          // Recalcular posición cuando se abre
          if (open && placement === 'auto' && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top
            const panelHeight = 400

            const newPlacement = spaceBelow < panelHeight && spaceAbove > panelHeight ? 'top' : 'bottom'
            if (newPlacement !== panelPlacement) {
              setPanelPlacement(newPlacement)
            }
          }

          return (
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
                {dateValue ? formatDateWithLocale(dateValue, dateFormat, showTime, timeFormat) : placeholder}
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

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className={clsx(
                "absolute z-[9999] w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4",
                panelPlacement === 'top' ? 'bottom-full mb-2' : 'mt-2'
              )}>
                <CalendarNavigation
                  viewDate={viewDate}
                  onPrevYear={() => setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth()))}
                  onPrevMonth={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
                  onNextMonth={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
                  onNextYear={() => setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth()))}
                  onYearSelect={(year) => setViewDate(new Date(year, viewDate.getMonth()))}
                  onMonthSelect={(month) => setViewDate(new Date(viewDate.getFullYear(), month))}
                />

                <CalendarGrid
                  viewDate={viewDate}
                  selectedDate={dateValue}
                  minDate={minDate}
                  maxDate={maxDate}
                  onDateSelect={(date) => handleDateSelect(date, close)}
                />

                {showTime && (
                  <TimePicker value={timeValue} onChange={handleTimeChange} />
                )}

                {/* Botón Hoy */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const today = new Date()
                      setViewDate(today)
                      handleDateSelect(today, close)
                    }}
                    className="flex-1"
                  >
                    Hoy
                  </Button>
                  {showTime && dateValue && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => close()}
                      className="flex-1"
                    >
                      Confirmar
                    </Button>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}}
      </Popover>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENTE: DateRangePicker
// ============================================================================

export function DateRangePicker({
  value = [null, null],
  onChange,
  label,
  placeholder = 'Seleccionar rango',
  showTime = false,
  presets = [],
  disabled = false,
  error,
  className,
  clearable = true,
  placement = 'auto', // Por defecto 'auto' detecta espacio disponible
  dateFormat,
  timeFormat,
}: DateRangePickerProps) {
  const [start, end] = value
  const [viewDate, setViewDate] = useState(start || new Date())
  const [selectingStart, setSelectingStart] = useState(true)
  const [tempStart, setTempStart] = useState<Date | null>(start)
  const [tempEnd, setTempEnd] = useState<Date | null>(end)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [panelPlacement, setPanelPlacement] = useState<'top' | 'bottom'>('bottom')

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
      case 'last7days': {
        const start = new Date(startOfDay)
        start.setDate(start.getDate() - 6)
        return [start, today]
      }
      case 'last30days': {
        const start = new Date(startOfDay)
        start.setDate(start.getDate() - 29)
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
    last7days: 'Últimos 7 días',
    last30days: 'Últimos 30 días',
    thisYear: 'Este año',
  }

  const handleDateSelect = (date: Date) => {
    if (selectingStart || !tempStart) {
      setTempStart(date)
      setTempEnd(null)
      setSelectingStart(false)
    } else {
      if (date < tempStart) {
        // Si la fecha final es menor que la inicial, invertir
        setTempStart(date)
        setTempEnd(tempStart)
      } else {
        setTempEnd(date)
      }
      
      // No cerrar inmediatamente si showTime está activado
      if (!showTime) {
        onChange?.([tempStart, date < tempStart ? tempStart : date])
        setSelectingStart(true)
      }
    }
  }

  const handleConfirm = (close: () => void) => {
    if (tempStart && tempEnd) {
      // Validar que start < end
      if (tempEnd < tempStart) {
        onChange?.([tempEnd, tempStart])
      } else {
        onChange?.([tempStart, tempEnd])
      }
    } else if (tempStart) {
      onChange?.([tempStart, null])
    }
    setSelectingStart(true)
    close()
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.([null, null])
    setTempStart(null)
    setTempEnd(null)
    setSelectingStart(true)
  }

  const displayText = () => {
    if (!start && !end) return placeholder
    if (start && !end) return `${formatDateWithLocale(start, dateFormat, showTime, timeFormat)} - ...`
    if (start && end) return `${formatDateWithLocale(start, dateFormat, showTime, timeFormat)} - ${formatDateWithLocale(end, dateFormat, showTime, timeFormat)}`
    return placeholder
  }

  // Calcular posición del panel al abrir
  useEffect(() => {
    if (placement === 'auto' && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const panelHeight = 500 // Altura aproximada del panel (mayor que DatePicker)

      setPanelPlacement(spaceBelow < panelHeight && spaceAbove > panelHeight ? 'top' : 'bottom')
    } else if (placement !== 'auto') {
      setPanelPlacement(placement)
    }
  }, [placement])

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <Popover className="relative">
        {({ open, close }) => {
          // Recalcular posición cuando se abre
          if (open && placement === 'auto' && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top
            const panelHeight = 500

            const newPlacement = spaceBelow < panelHeight && spaceAbove > panelHeight ? 'top' : 'bottom'
            if (newPlacement !== panelPlacement) {
              setPanelPlacement(newPlacement)
            }
          }

          return (
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
              <span className={clsx('text-sm', (start || end) ? 'text-gray-900 dark:text-white' : 'text-gray-400')}>
                {displayText()}
              </span>
              <div className="flex items-center gap-1">
                {clearable && (start || end) && !disabled && (
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

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className={clsx(
                "absolute z-[9999] w-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4",
                panelPlacement === 'top' ? 'bottom-full mb-2' : 'mt-2'
              )}>
                <div className="flex gap-4">
                  {/* Presets */}
                  {presets.length > 0 && (
                    <div className="flex flex-col gap-1 pr-4 border-r border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Atajos rápidos</p>
                      {presets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            const range = getPresetRange(preset)
                            onChange?.(range)
                            if (!showTime) close()
                          }}
                          className="text-left px-3 py-2 text-sm rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap"
                        >
                          {presetLabels[preset]}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Calendario */}
                  <div className="w-80">
                    <div className="mb-2 flex items-center gap-2 text-sm">
                      <span className={clsx(
                        'px-2 py-1 rounded',
                        selectingStart ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-500'
                      )}>
                        Inicio: {tempStart ? formatDateWithLocale(tempStart, dateFormat, showTime, timeFormat) : '-'}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className={clsx(
                        'px-2 py-1 rounded',
                        !selectingStart ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-500'
                      )}>
                        Fin: {tempEnd ? formatDateWithLocale(tempEnd, dateFormat, showTime, timeFormat) : '-'}
                      </span>
                    </div>

                    <CalendarNavigation
                      viewDate={viewDate}
                      onPrevYear={() => setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth()))}
                      onPrevMonth={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
                      onNextMonth={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
                      onNextYear={() => setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth()))}
                      onYearSelect={(year) => setViewDate(new Date(year, viewDate.getMonth()))}
                      onMonthSelect={(month) => setViewDate(new Date(viewDate.getFullYear(), month))}
                    />

                    <CalendarGrid
                      viewDate={viewDate}
                      selectedDate={selectingStart ? tempStart : tempEnd}
                      onDateSelect={handleDateSelect}
                      rangeStart={tempStart}
                      rangeEnd={tempEnd}
                      isRangeMode={true}
                    />

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setTempStart(null)
                          setTempEnd(null)
                          setSelectingStart(true)
                        }}
                        className="flex-1"
                      >
                        Limpiar
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirm(close)}
                        disabled={!tempStart}
                        className="flex-1"
                      >
                        Confirmar
                      </Button>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}}
      </Popover>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENTE: TimeRangePicker
// ============================================================================

export function TimeRangePicker({
  value = ['09:00', '17:00'],
  onChange,
  label,
  minTime,
  maxTime,
  step = 15,
  disabled = false,
  error,
  className,
  placement = 'auto', // Por defecto 'auto' detecta espacio disponible
}: TimeRangePickerProps) {
  const [startTime, endTime] = value
  const startButtonRef = useRef<HTMLButtonElement>(null)
  const endButtonRef = useRef<HTMLButtonElement>(null)
  const [startPlacement, setStartPlacement] = useState<'top' | 'bottom'>('bottom')
  const [endPlacement, setEndPlacement] = useState<'top' | 'bottom'>('bottom')

  // Calcular posición de los dropdowns
  useEffect(() => {
    if (placement === 'auto') {
      if (startButtonRef.current) {
        const rect = startButtonRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top
        const dropdownHeight = 250 // Altura aproximada del dropdown

        setStartPlacement(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'top' : 'bottom')
      }
      if (endButtonRef.current) {
        const rect = endButtonRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top
        const dropdownHeight = 250

        setEndPlacement(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'top' : 'bottom')
      }
    } else {
      setStartPlacement(placement)
      setEndPlacement(placement)
    }
  }, [placement])

  // Generar opciones de tiempo
  const generateTimeOptions = () => {
    const options: string[] = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += step) {
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        options.push(time)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  const handleStartChange = (time: string) => {
    if (endTime && time >= endTime) {
      // Si el tiempo de inicio es mayor o igual al de fin, ajustar el fin
      const startIdx = timeOptions.indexOf(time)
      const newEnd = timeOptions[Math.min(startIdx + 1, timeOptions.length - 1)]
      onChange?.([time, newEnd])
    } else {
      onChange?.([time, endTime])
    }
  }

  const handleEndChange = (time: string) => {
    if (startTime && time <= startTime) {
      // Si el tiempo de fin es menor o igual al de inicio, ajustar el inicio
      const endIdx = timeOptions.indexOf(time)
      const newStart = timeOptions[Math.max(endIdx - 1, 0)]
      onChange?.([newStart, time])
    } else {
      onChange?.([startTime, time])
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div className="flex items-center gap-3">
        {/* Selector hora inicio */}
        <Listbox value={startTime} onChange={handleStartChange} disabled={disabled}>
          <div className="relative flex-1">
            <Listbox.Button
              ref={startButtonRef}
              className={clsx(
                'relative w-full cursor-pointer rounded-lg py-2 pl-3 pr-10 text-left shadow-sm transition-colors',
                disabled
                  ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
            >
              <span className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="block truncate text-sm">{startTime}</span>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className={clsx(
                "absolute z-[9999] max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                startPlacement === 'top' ? 'bottom-full mb-1' : 'mt-1'
              )}>
                {timeOptions.map((time) => (
                  <Listbox.Option
                    key={time}
                    value={time}
                    disabled={!!(minTime && time < minTime)}
                    className={({ active, disabled }) =>
                      clsx(
                        'relative cursor-pointer select-none py-2 px-3',
                        active && !disabled ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100' : '',
                        disabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-900 dark:text-gray-100'
                      )
                    }
                  >
                    {({ selected }) => (
                      <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                        {time}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        <span className="text-gray-400 font-bold">-</span>

        {/* Selector hora fin */}
        <Listbox value={endTime} onChange={handleEndChange} disabled={disabled}>
          <div className="relative flex-1">
            <Listbox.Button
              ref={endButtonRef}
              className={clsx(
                'relative w-full cursor-pointer rounded-lg py-2 pl-3 pr-10 text-left shadow-sm transition-colors',
                disabled
                  ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
            >
              <span className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="block truncate text-sm">{endTime}</span>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className={clsx(
                "absolute z-[9999] max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                endPlacement === 'top' ? 'bottom-full mb-1' : 'mt-1'
              )}>
                {timeOptions.map((time) => (
                  <Listbox.Option
                    key={time}
                    value={time}
                    disabled={!!(maxTime && time > maxTime)}
                    className={({ active, disabled }) =>
                      clsx(
                        'relative cursor-pointer select-none py-2 px-3',
                        active && !disabled ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100' : '',
                        disabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-900 dark:text-gray-100'
                      )
                    }
                  >
                    {({ selected }) => (
                      <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                        {time}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

// Exportar todo
export { CalendarNavigation, CalendarGrid, TimePicker }
