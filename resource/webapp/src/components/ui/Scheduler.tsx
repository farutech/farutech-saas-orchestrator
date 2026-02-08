/**
 * Scheduler - Componente de calendario y agendamiento profesional
 * 
 * Características:
 * - ✅ Múltiples vistas: día, semana, mes, bimestre, trimestre, semestre, año
 * - ✅ CRUD de citas/eventos
 * - ✅ Drag & drop (próximamente)
 * - ✅ Validación de conflictos
 * - ✅ Configuración parametrizable
 * - ✅ Integración con API
 * - ✅ Filtros dinámicos
 * - ✅ Estados de citas (pendiente, completada, cancelada)
 * - ✅ Hover con información
 * - ✅ Responsive
 */

import { useState, useMemo, Fragment, useEffect } from 'react'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  TrashIcon,
  ClockIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Select } from './Select'
import { DatePicker as DatePickerV2 } from './DateControls'
import { useLocaleStore, formatDateWithLocale } from '@/store/localeStore'

// ============================================================================
// TIPOS
// ============================================================================

export type ViewMode = 'day' | 'week' | 'month' | 'bimonth' | 'quarter' | 'semester' | 'year'

export type AppointmentStatus = 'pending' | 'completed' | 'cancelled'

export interface Appointment {
  id: string | number
  title: string
  description?: string
  start: Date
  end: Date
  status?: AppointmentStatus
  color?: string
  metadata?: Record<string, any>
  [key: string]: any
}

export interface SchedulerConfig {
  // Campos visibles en el formulario
  showDescription?: boolean
  showStatus?: boolean
  customFields?: Array<{
    name: string
    label: string
    type: 'text' | 'select' | 'number'
    options?: string[]
    required?: boolean
  }>

  // Información mostrada en hover
  hoverFields?: string[]

  // Validación
  allowOverlap?: boolean
  minDuration?: number // minutos
  maxDuration?: number // minutos
  workingHours?: { start: string; end: string } // HH:mm

  // Intervalos de tiempo
  timeInterval?: 15 | 30 | 60 // minutos entre cada slot

  // Personalización de locale (opcionales, si no se proveen se usa localeStore)
  customMonths?: string[]      // Array de 12 meses, si faltan se completa con locale
  customMonthsShort?: string[] // Array de 12 meses cortos
  customDays?: string[]        // Array de 7 días
  customDaysShort?: string[]   // Array de 7 días cortos

  // API
  onFetchAppointments?: (start: Date, end: Date) => Promise<Appointment[]>
  onCreateAppointment?: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>
  onUpdateAppointment?: (id: string | number, appointment: Partial<Appointment>) => Promise<Appointment>
  onDeleteAppointment?: (id: string | number) => Promise<void>
}

export interface SchedulerProps {
  appointments?: Appointment[]
  onAppointmentsChange?: (appointments: Appointment[]) => void
  config?: SchedulerConfig
  className?: string
  defaultView?: ViewMode
  defaultDate?: Date
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Obtiene arrays de meses/días con fallback a locale
 * Si se proveen arrays personalizados y faltan elementos, se completan con locale
 */
function getLocaleArrays(config?: SchedulerConfig) {
  const localeConfig = useLocaleStore.getState().getLocaleConfig()
  
  const mergeArray = (custom: string[] | undefined, defaultArray: string[], requiredLength: number): string[] => {
    if (!custom || custom.length === 0) return defaultArray
    if (custom.length >= requiredLength) return custom.slice(0, requiredLength)
    // Si faltan elementos, completar con los del locale
    return [...custom, ...defaultArray.slice(custom.length, requiredLength)]
  }

  return {
    MONTHS: mergeArray(config?.customMonths, localeConfig.months, 12),
    MONTHS_SHORT: mergeArray(config?.customMonthsShort, localeConfig.monthsShort, 12),
    DAYS: mergeArray(config?.customDays, localeConfig.days, 7),
    DAYS_SHORT: mergeArray(config?.customDaysShort, localeConfig.daysShort, 7),
  }
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function getWeekDays(date: Date): Date[] {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    return day
  })
}

function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days: Date[] = []
  const startingDayOfWeek = firstDay.getDay()

  // Días del mes anterior para completar semana
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDay = new Date(firstDay)
    prevDay.setDate(prevDay.getDate() - (i + 1))
    days.push(prevDay)
  }

  // Días del mes actual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }

  // Días del mes siguiente para completar semana
  const remainingDays = 7 - (days.length % 7)
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      const nextDay = new Date(lastDay)
      nextDay.setDate(lastDay.getDate() + i)
      days.push(nextDay)
    }
  }

  return days
}

function checkOverlap(newAppointment: { start: Date; end: Date }, existingAppointments: Appointment[], excludeId?: string | number): boolean {
  return existingAppointments.some((apt) => {
    if (excludeId && apt.id === excludeId) return false

    const newStart = newAppointment.start.getTime()
    const newEnd = newAppointment.end.getTime()
    const existingStart = new Date(apt.start).getTime()
    const existingEnd = new Date(apt.end).getTime()

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    )
  })
}

// ============================================================================
// COMPONENTE: AppointmentModal
// ============================================================================

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment?: Appointment | null
  selectedDate?: Date
  onSave: (appointment: Omit<Appointment, 'id'> | Appointment) => void
  onDelete?: (id: string | number) => void
  config?: SchedulerConfig
  existingAppointments: Appointment[]
}

function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  selectedDate,
  onSave,
  onDelete,
  config = {},
  existingAppointments,
}: AppointmentModalProps) {
  const isEditing = !!appointment

  const [formData, setFormData] = useState<Partial<Appointment>>(() => {
    if (appointment) {
      return { ...appointment }
    }
    const now = selectedDate || new Date()
    const start = new Date(now)
    start.setMinutes(0, 0, 0)
    const end = new Date(start)
    end.setHours(end.getHours() + 1)
    return {
      title: '',
      description: '',
      start,
      end,
      status: 'pending' as AppointmentStatus,
      color: '#3b82f6',
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Actualizar fechas cuando cambia selectedDate o appointment
  useEffect(() => {
    if (appointment) {
      setFormData({ ...appointment })
    } else if (selectedDate) {
      const start = new Date(selectedDate)
      start.setMinutes(0, 0, 0)
      const end = new Date(start)
      end.setHours(end.getHours() + 1)
      setFormData({
        title: '',
        description: '',
        start,
        end,
        status: 'pending' as AppointmentStatus,
        color: '#3b82f6',
      })
    }
  }, [appointment, selectedDate])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'El título es requerido'
    }

    if (!formData.start) {
      newErrors.start = 'La fecha de inicio es requerida'
    }

    if (!formData.end) {
      newErrors.end = 'La fecha de fin es requerida'
    }

    if (formData.start && formData.end) {
      if (formData.end <= formData.start) {
        newErrors.end = 'La fecha de fin debe ser posterior a la de inicio'
      }

      const duration = (formData.end.getTime() - formData.start.getTime()) / (1000 * 60)

      if (config.minDuration && duration < config.minDuration) {
        newErrors.end = `La duración mínima es ${config.minDuration} minutos`
      }

      if (config.maxDuration && duration > config.maxDuration) {
        newErrors.end = `La duración máxima es ${config.maxDuration} minutos`
      }

      // Validar horario laboral
      if (config.workingHours) {
        const [startHour, startMin] = config.workingHours.start.split(':').map(Number)
        const [endHour, endMin] = config.workingHours.end.split(':').map(Number)

        const aptStartHour = formData.start.getHours()
        const aptStartMin = formData.start.getMinutes()
        const aptEndHour = formData.end.getHours()
        const aptEndMin = formData.end.getMinutes()

        const aptStartTime = aptStartHour * 60 + aptStartMin
        const aptEndTime = aptEndHour * 60 + aptEndMin
        const workStartTime = startHour * 60 + startMin
        const workEndTime = endHour * 60 + endMin

        if (aptStartTime < workStartTime || aptEndTime > workEndTime) {
          newErrors.start = `El horario debe estar entre ${config.workingHours.start} y ${config.workingHours.end}`
        }
      }

      // Validar solapamiento
      if (!config.allowOverlap) {
        const hasOverlap = checkOverlap(
          { start: formData.start, end: formData.end },
          existingAppointments,
          appointment?.id
        )

        if (hasOverlap) {
          newErrors.start = 'Ya existe una cita en este horario'
        }
      }
    }

    // Validar campos personalizados
    if (config.customFields) {
      config.customFields.forEach((field) => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = `${field.label} es requerido`
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    onSave(formData as any)
    onClose()
  }

  const handleDelete = () => {
    if (appointment && onDelete && confirm('¿Estás seguro de eliminar esta cita?')) {
      onDelete(appointment.id)
      onClose()
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-visible rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center justify-between">
                  {isEditing ? 'Editar cita' : 'Nueva cita'}
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Título */}
                  <Input
                    label="Título"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    error={errors.title}
                    required
                  />

                  {/* Descripción */}
                  {config.showDescription !== false && (
                    <Textarea
                      label="Descripción"
                      value={formData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={3}
                    />
                  )}

                  {/* Fecha y hora inicio y fin en el mismo renglón */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <DatePickerV2
                        label="Fecha y Hora de Inicio"
                        value={formData.start || null}
                        onChange={(date) => handleChange('start', date)}
                        showTime
                        placeholder="Seleccionar fecha y hora de inicio"
                      />
                      {errors.start && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.start}</p>}
                    </div>

                    <div>
                      <DatePickerV2
                        label="Fecha y Hora de Fin"
                        value={formData.end || null}
                        onChange={(date) => handleChange('end', date)}
                        showTime
                        placeholder="Seleccionar fecha y hora de fin"
                      />
                      {errors.end && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.end}</p>}
                    </div>
                  </div>

                  {/* Estado */}
                  {config.showStatus !== false && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estado
                      </label>
                      <Listbox value={formData.status || 'pending'} onChange={(value) => handleChange('status', value)}>
                        <div className="relative">
                          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <span className="block truncate">
                              {formData.status === 'completed' ? 'Completada' : formData.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                            </span>
                          </Listbox.Button>
                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Listbox.Option value="pending" className={({ active }) => clsx('cursor-pointer select-none py-2 px-3', active && 'bg-primary-100 dark:bg-primary-900/50')}>
                              Pendiente
                            </Listbox.Option>
                            <Listbox.Option value="completed" className={({ active }) => clsx('cursor-pointer select-none py-2 px-3', active && 'bg-primary-100 dark:bg-primary-900/50')}>
                              Completada
                            </Listbox.Option>
                            <Listbox.Option value="cancelled" className={({ active }) => clsx('cursor-pointer select-none py-2 px-3', active && 'bg-primary-100 dark:bg-primary-900/50')}>
                              Cancelada
                            </Listbox.Option>
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>
                  )}

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color
                    </label>
                    <div className="flex gap-2">
                      {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleChange('color', color)}
                          className={clsx(
                            'w-8 h-8 rounded-full border-2 transition-all',
                            formData.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Campos personalizados */}
                  {config.customFields?.map((field) => (
                    <div key={field.name}>
                      {field.type === 'text' && (
                        <Input
                          label={field.label}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          error={errors[field.name]}
                          required={field.required}
                        />
                      )}
                      {field.type === 'select' && (
                        <Select
                          label={field.label}
                          value={formData[field.name] || ''}
                          onChange={(value) => handleChange(field.name, value)}
                          options={(field.options || []).map(opt => ({ value: opt, label: opt }))}
                          placeholder="Seleccionar..."
                          error={errors[field.name]}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}

                  {/* Botones */}
                  <div className="flex gap-2 pt-4">
                    {isEditing && onDelete && (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={handleDelete}
                        className="flex-1"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    )}
                    <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1">
                      {isEditing ? 'Guardar' : 'Crear'}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

// ============================================================================
// COMPONENTE: AppointmentCard
// ============================================================================

interface AppointmentCardProps {
  appointment: Appointment
  onClick: () => void
  config?: SchedulerConfig
}

function AppointmentCard({ appointment, onClick, config }: AppointmentCardProps) {
  const statusIcons = {
    completed: <CheckCircleIcon className="h-4 w-4 text-green-600" />,
    cancelled: <XCircleIcon className="h-4 w-4 text-red-600" />,
    pending: <ClockIcon className="h-4 w-4 text-yellow-600" />,
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2 rounded-lg text-xs hover:shadow-md transition-all group relative"
      style={{ backgroundColor: appointment.color || '#3b82f6', color: 'white' }}
    >
      <div className="font-semibold truncate">{appointment.title}</div>
      <div className="text-white/80 text-[10px]">
        {formatDateWithLocale(new Date(appointment.start), undefined, true)} - {formatDateWithLocale(new Date(appointment.end), undefined, true)}
      </div>
      {appointment.status && (
        <div className="absolute top-1 right-1">
          {statusIcons[appointment.status]}
        </div>
      )}

      {/* Hover tooltip */}
      <div className="absolute z-50 left-0 top-full mt-1 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-gray-900 dark:text-white">
        <div className="font-semibold text-sm mb-2">{appointment.title}</div>
        {appointment.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{appointment.description}</p>
        )}
        <div className="text-xs space-y-1">
          <div>
            <span className="font-medium">Inicio:</span> {formatDateWithLocale(new Date(appointment.start), undefined, true)}
          </div>
          <div>
            <span className="font-medium">Fin:</span> {formatDateWithLocale(new Date(appointment.end), undefined, true)}
          </div>
          {config?.hoverFields?.map((field) => (
            appointment[field] && (
              <div key={field}>
                <span className="font-medium capitalize">{field}:</span> {appointment[field]}
              </div>
            )
          ))}
        </div>
      </div>
    </button>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL: Scheduler
// ============================================================================

export function Scheduler({
  appointments: initialAppointments = [],
  onAppointmentsChange,
  config = {},
  className,
  defaultView = 'month',
  defaultDate = new Date(),
}: SchedulerProps) {
  const [currentDate, setCurrentDate] = useState(defaultDate)
  const [view, setView] = useState<ViewMode>(defaultView)
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'all'>('all')

  // Sincronizar con prop appointments
  useMemo(() => {
    if (initialAppointments.length > 0) {
      setAppointments(initialAppointments)
    }
  }, [initialAppointments])

  const viewLabels: Record<ViewMode, string> = {
    day: 'Día',
    week: 'Semana',
    month: 'Mes',
    bimonth: 'Bimestre',
    quarter: 'Trimestre',
    semester: 'Semestre',
    year: 'Año',
  }

  // Filtrar citas
  const filteredAppointments = useMemo(() => {
    if (filterStatus === 'all') return appointments
    return appointments.filter((apt) => apt.status === filterStatus)
  }, [appointments, filterStatus])

  // Navegación
  const handlePrev = () => {
    const newDate = new Date(currentDate)
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1)
        break
      case 'week':
        newDate.setDate(newDate.getDate() - 7)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case 'bimonth':
        newDate.setMonth(newDate.getMonth() - 2)
        break
      case 'quarter':
        newDate.setMonth(newDate.getMonth() - 3)
        break
      case 'semester':
        newDate.setMonth(newDate.getMonth() - 6)
        break
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1)
        break
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1)
        break
      case 'week':
        newDate.setDate(newDate.getDate() + 7)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case 'bimonth':
        newDate.setMonth(newDate.getMonth() + 2)
        break
      case 'quarter':
        newDate.setMonth(newDate.getMonth() + 3)
        break
      case 'semester':
        newDate.setMonth(newDate.getMonth() + 6)
        break
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1)
        break
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  // CRUD operations
  const handleCreateAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    if (config.onCreateAppointment) {
      const created = await config.onCreateAppointment(appointment)
      const updated = [...appointments, created]
      setAppointments(updated)
      onAppointmentsChange?.(updated)
    } else {
      const newAppointment = { ...appointment, id: Date.now() }
      const updated = [...appointments, newAppointment as Appointment]
      setAppointments(updated)
      onAppointmentsChange?.(updated)
    }
  }

  const handleUpdateAppointment = async (appointment: Appointment) => {
    if (config.onUpdateAppointment) {
      const updated = await config.onUpdateAppointment(appointment.id, appointment)
      const newAppointments = appointments.map((apt) => (apt.id === appointment.id ? updated : apt))
      setAppointments(newAppointments)
      onAppointmentsChange?.(newAppointments)
    } else {
      const newAppointments = appointments.map((apt) => (apt.id === appointment.id ? appointment : apt))
      setAppointments(newAppointments)
      onAppointmentsChange?.(newAppointments)
    }
  }

  const handleDeleteAppointment = async (id: string | number) => {
    if (config.onDeleteAppointment) {
      await config.onDeleteAppointment(id)
    }
    const updated = appointments.filter((apt) => apt.id !== id)
    setAppointments(updated)
    onAppointmentsChange?.(updated)
  }

  const handleSave = (appointment: Omit<Appointment, 'id'> | Appointment) => {
    if ('id' in appointment) {
      handleUpdateAppointment(appointment as Appointment)
    } else {
      handleCreateAppointment(appointment)
    }
  }

  const openModal = (appointment?: Appointment, date?: Date) => {
    setSelectedAppointment(appointment || null)
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  // Obtener título de la vista actual
  const getViewTitle = () => {
    const { MONTHS, DAYS } = getLocaleArrays(config)
    const monthName = MONTHS[currentDate.getMonth()]
    const year = currentDate.getFullYear()

    switch (view) {
      case 'day':
        return `${DAYS[currentDate.getDay()]}, ${currentDate.getDate()} de ${monthName} ${year}`
      case 'week':
        const weekDays = getWeekDays(currentDate)
        return `${formatDateWithLocale(weekDays[0])} - ${formatDateWithLocale(weekDays[6])}`
      case 'month':
        return `${monthName} ${year}`
      case 'bimonth':
        const nextMonth = new Date(currentDate)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        return `${monthName} - ${MONTHS[nextMonth.getMonth()]} ${year}`
      case 'quarter':
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1
        return `Q${quarter} ${year}`
      case 'semester':
        const semester = currentDate.getMonth() < 6 ? 1 : 2
        return `Semestre ${semester} ${year}`
      case 'year':
        return `${year}`
    }
  }

  // Renderizar vista según el tipo
  const renderView = () => {
    switch (view) {
      case 'day':
        return <DayView currentDate={currentDate} appointments={filteredAppointments} onAppointmentClick={openModal} onDateClick={(date) => openModal(undefined, date)} config={config} />
      case 'week':
        return <WeekView currentDate={currentDate} appointments={filteredAppointments} onAppointmentClick={openModal} onDateClick={(date) => openModal(undefined, date)} config={config} />
      case 'month':
        return <MonthView currentDate={currentDate} appointments={filteredAppointments} onAppointmentClick={openModal} onDateClick={(date) => openModal(undefined, date)} config={config} />
      case 'bimonth':
        return <BimonthView currentDate={currentDate} appointments={filteredAppointments} onAppointmentClick={openModal} onDateClick={(date) => openModal(undefined, date)} config={config} />
      case 'quarter':
        return <QuarterView currentDate={currentDate} appointments={filteredAppointments} onAppointmentClick={openModal} onDateClick={(date) => openModal(undefined, date)} config={config} />
      case 'semester':
        return <SemesterView currentDate={currentDate} appointments={filteredAppointments} onAppointmentClick={openModal} onDateClick={(date) => openModal(undefined, date)} config={config} />
      case 'year':
        return <YearView currentDate={currentDate} appointments={filteredAppointments} onAppointmentClick={openModal} onDateClick={(date) => openModal(undefined, date)} config={config} />
      default:
        return <MonthView currentDate={currentDate} appointments={filteredAppointments} onAppointmentClick={openModal} onDateClick={(date) => openModal(undefined, date)} config={config} />
    }
  }

  return (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4', className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Navegación */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrev}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={handleToday}>
            Hoy
          </Button>
          <Button variant="secondary" size="sm" onClick={handleNext}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <h2 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">{getViewTitle()}</h2>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          {/* Filtro de estado */}
          <Listbox value={filterStatus} onChange={setFilterStatus}>
            <div className="relative">
              <Listbox.Button className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                <FunnelIcon className="h-4 w-4" />
                {filterStatus === 'all' ? 'Todas' : filterStatus === 'completed' ? 'Completadas' : filterStatus === 'cancelled' ? 'Canceladas' : 'Pendientes'}
              </Listbox.Button>
              <Listbox.Options className="absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                <Listbox.Option value="all" className={({ active }) => clsx('cursor-pointer px-3 py-2 text-sm', active && 'bg-gray-100 dark:bg-gray-700')}>
                  Todas
                </Listbox.Option>
                <Listbox.Option value="pending" className={({ active }) => clsx('cursor-pointer px-3 py-2 text-sm', active && 'bg-gray-100 dark:bg-gray-700')}>
                  Pendientes
                </Listbox.Option>
                <Listbox.Option value="completed" className={({ active }) => clsx('cursor-pointer px-3 py-2 text-sm', active && 'bg-gray-100 dark:bg-gray-700')}>
                  Completadas
                </Listbox.Option>
                <Listbox.Option value="cancelled" className={({ active }) => clsx('cursor-pointer px-3 py-2 text-sm', active && 'bg-gray-100 dark:bg-gray-700')}>
                  Canceladas
                </Listbox.Option>
              </Listbox.Options>
            </div>
          </Listbox>

          {/* Selector de vista */}
          <Listbox value={view} onChange={setView}>
            <div className="relative">
              <Listbox.Button className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
                {viewLabels[view]}
              </Listbox.Button>
              <Listbox.Options className="absolute right-0 z-10 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                {Object.entries(viewLabels).map(([key, label]) => (
                  <Listbox.Option key={key} value={key} className={({ active }) => clsx('cursor-pointer px-3 py-2 text-sm', active && 'bg-gray-100 dark:bg-gray-700')}>
                    {label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>

          {/* Botón nueva cita */}
          <Button variant="primary" size="sm" onClick={() => openModal(undefined, currentDate)}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Nueva cita
          </Button>
        </div>
      </div>

      {/* Vista */}
      {renderView()}

      {/* Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedAppointment(null)
          setSelectedDate(undefined)
        }}
        appointment={selectedAppointment}
        selectedDate={selectedDate}
        onSave={handleSave}
        onDelete={handleDeleteAppointment}
        config={config}
        existingAppointments={appointments}
      />
    </div>
  )
}

// ============================================================================
// VISTAS
// ============================================================================

interface ViewProps {
  currentDate: Date
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
  onDateClick?: (date: Date) => void
  config?: SchedulerConfig
}

function MonthView({ currentDate, appointments, onAppointmentClick, onDateClick, config }: ViewProps) {
  const days = getMonthDays(currentDate)
  const { DAYS_SHORT } = getLocaleArrays(config)

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.start), date))
  }

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Días de la semana */}
      {DAYS_SHORT.map((day) => (
        <div key={day} className="bg-gray-50 dark:bg-gray-800 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">
          {day}
        </div>
      ))}

      {/* Días del mes */}
      {days.map((date, index) => {
        const dayAppointments = getAppointmentsForDay(date)
        const isCurrentMonth = date.getMonth() === currentDate.getMonth()
        const isToday = isSameDay(date, new Date())

        return (
          <div
            key={index}
            className={clsx(
              'min-h-[100px] bg-white dark:bg-gray-800 p-2',
              !isCurrentMonth && 'bg-gray-50 dark:bg-gray-900/50 text-gray-400'
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={clsx(
                  'text-sm font-medium',
                  isToday && 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
                )}
              >
                {date.getDate()}
              </span>
              {isCurrentMonth && onDateClick && (
                <button
                  onClick={() => onDateClick(date)}
                  className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-1">
              {dayAppointments.slice(0, 3).map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} onClick={() => onAppointmentClick(apt)} config={config} />
              ))}
              {dayAppointments.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">+{dayAppointments.length - 3} más</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function WeekView({ currentDate, appointments, onAppointmentClick, onDateClick, config }: ViewProps) {
  const weekDays = getWeekDays(currentDate)
  const timeInterval = config?.timeInterval || 60
  const slotsPerHour = 60 / timeInterval
  const totalSlots = 24 * slotsPerHour
  const { DAYS_SHORT } = getLocaleArrays(config)

  const getAppointmentsForDayAndSlot = (date: Date, hour: number, minute: number) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.start)
      return isSameDay(aptDate, date) && aptDate.getHours() === hour && aptDate.getMinutes() >= minute && aptDate.getMinutes() < minute + timeInterval
    })
  }

  const handleSlotClick = (date: Date, hour: number, minute: number) => {
    if (onDateClick) {
      const clickedDate = new Date(date)
      clickedDate.setHours(hour, minute, 0, 0)
      onDateClick(clickedDate)
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-8 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800" />
          {weekDays.map((date, index) => {
            const isToday = isSameDay(date, new Date())
            return (
              <div
                key={index}
                className={clsx(
                  'bg-gray-50 dark:bg-gray-800 text-center py-2',
                  isToday && 'bg-primary-50 dark:bg-primary-900/30'
                )}
              >
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">{DAYS_SHORT[date.getDay()]}</div>
                <div className={clsx('text-lg font-bold', isToday && 'text-primary-600 dark:text-primary-400')}>
                  {date.getDate()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-8 gap-px bg-gray-200 dark:bg-gray-700 border-l border-r border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: totalSlots }, (_, i) => {
            const hour = Math.floor(i / slotsPerHour)
            const minute = (i % slotsPerHour) * timeInterval
            const showHourLabel = minute === 0

            return (
              <Fragment key={i}>
                <div className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 text-right p-2">
                  {showHourLabel && `${String(hour).padStart(2, '0')}:00`}
                </div>
                {weekDays.map((date, dayIndex) => {
                  const slotAppointments = getAppointmentsForDayAndSlot(date, hour, minute)
                  return (
                    <button
                      key={`${i}-${dayIndex}`}
                      onClick={() => handleSlotClick(date, hour, minute)}
                      className="bg-white dark:bg-gray-800 min-h-[60px] p-1 border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer text-left group"
                    >
                      {slotAppointments.map((apt) => (
                        <AppointmentCard key={apt.id} appointment={apt} onClick={() => onAppointmentClick(apt)} config={config} />
                      ))}
                    </button>
                  )
                })}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DayView({ currentDate, appointments, onAppointmentClick, onDateClick, config }: ViewProps) {
  const timeInterval = config?.timeInterval || 60
  const slotsPerHour = 60 / timeInterval
  const totalSlots = 24 * slotsPerHour

  const getAppointmentsForSlot = (hour: number, minute: number) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.start)
      return isSameDay(aptDate, currentDate) && aptDate.getHours() === hour && aptDate.getMinutes() >= minute && aptDate.getMinutes() < minute + timeInterval
    })
  }

  const handleSlotClick = (hour: number, minute: number) => {
    if (onDateClick) {
      const clickedDate = new Date(currentDate)
      clickedDate.setHours(hour, minute, 0, 0)
      onDateClick(clickedDate)
    }
  }

  return (
    <div className="space-y-px">
      {Array.from({ length: totalSlots }, (_, i) => {
        const hour = Math.floor(i / slotsPerHour)
        const minute = (i % slotsPerHour) * timeInterval
        const slotAppointments = getAppointmentsForSlot(hour, minute)
        const showHourLabel = minute === 0

        return (
          <div key={i} className="flex gap-px">
            <div className="w-20 bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 text-right p-2">
              {showHourLabel && `${String(hour).padStart(2, '0')}:00`}
            </div>
            <button
              onClick={() => handleSlotClick(hour, minute)}
              className="flex-1 bg-white dark:bg-gray-800 min-h-[60px] p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer text-left group"
            >
              {slotAppointments.length === 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')} - Click para crear cita
                </span>
              )}
              {slotAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} onClick={() => onAppointmentClick(apt)} config={config} />
              ))}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// COMPONENTES: Vistas Múltiples de Meses
// ============================================================================

interface MiniCalendarProps {
  date: Date
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
  onDateClick?: (date: Date) => void
  config?: SchedulerConfig
}

function MiniCalendar({ date, appointments, onAppointmentClick, onDateClick, config }: MiniCalendarProps) {
  const days = getMonthDays(date)
  const { MONTHS, DAYS_SHORT } = getLocaleArrays(config)
  const monthName = MONTHS[date.getMonth()]
  const year = date.getFullYear()

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.start), day))
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Header del mes */}
      <div className="bg-primary-600 dark:bg-primary-700 text-white text-center py-2 px-1">
        <div className="text-sm font-semibold">{monthName}</div>
        <div className="text-xs opacity-90">{year}</div>
      </div>

      {/* Mini calendario */}
      <div className="p-2">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {DAYS_SHORT.map((day) => (
            <div key={day} className="text-center text-[10px] font-medium text-gray-500 dark:text-gray-400">
              {day.charAt(0)}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day, index) => {
            const dayAppointments = getAppointmentsForDay(day)
            const isCurrentMonth = day.getMonth() === date.getMonth()
            const isToday = isSameDay(day, new Date())
            const hasAppointments = dayAppointments.length > 0

            return (
              <button
                key={index}
                onClick={() => {
                  if (isCurrentMonth && dayAppointments.length === 1) {
                    onAppointmentClick(dayAppointments[0])
                  } else if (isCurrentMonth && onDateClick) {
                    onDateClick(day)
                  }
                }}
                className={clsx(
                  'aspect-square text-[11px] rounded relative flex items-center justify-center',
                  'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                  !isCurrentMonth && 'text-gray-300 dark:text-gray-600',
                  isCurrentMonth && 'text-gray-700 dark:text-gray-300',
                  isToday && 'bg-primary-100 dark:bg-primary-900/30 font-bold text-primary-700 dark:text-primary-300',
                  hasAppointments && isCurrentMonth && !isToday && 'bg-blue-50 dark:bg-blue-900/20'
                )}
                disabled={!isCurrentMonth}
              >
                {day.getDate()}
                {hasAppointments && isCurrentMonth && (
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    {dayAppointments.slice(0, 3).map((apt, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: apt.color || '#3b82f6' }}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Vista de 2 meses (Bimestre)
function BimonthView({ currentDate, appointments, onAppointmentClick, onDateClick, config }: ViewProps) {
  const months = [
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {months.map((month, index) => (
        <MiniCalendar
          key={index}
          date={month}
          appointments={appointments}
          onAppointmentClick={onAppointmentClick}
          onDateClick={onDateClick}
          config={config}
        />
      ))}
    </div>
  )
}

// Vista de 3 meses (Trimestre)
function QuarterView({ currentDate, appointments, onAppointmentClick, onDateClick, config }: ViewProps) {
  const quarterStart = Math.floor(currentDate.getMonth() / 3) * 3
  const months = [
    new Date(currentDate.getFullYear(), quarterStart, 1),
    new Date(currentDate.getFullYear(), quarterStart + 1, 1),
    new Date(currentDate.getFullYear(), quarterStart + 2, 1),
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {months.map((month, index) => (
        <MiniCalendar
          key={index}
          date={month}
          appointments={appointments}
          onAppointmentClick={onAppointmentClick}
          onDateClick={onDateClick}
          config={config}
        />
      ))}
    </div>
  )
}

// Vista de 6 meses (Semestre)
function SemesterView({ currentDate, appointments, onAppointmentClick, onDateClick, config }: ViewProps) {
  const semesterStart = currentDate.getMonth() < 6 ? 0 : 6
  const months = Array.from({ length: 6 }, (_, i) => 
    new Date(currentDate.getFullYear(), semesterStart + i, 1)
  )

  return (
    <div className="grid grid-cols-3 gap-4">
      {months.map((month, index) => (
        <MiniCalendar
          key={index}
          date={month}
          appointments={appointments}
          onAppointmentClick={onAppointmentClick}
          onDateClick={onDateClick}
          config={config}
        />
      ))}
    </div>
  )
}

// Vista de 12 meses (Año)
function YearView({ currentDate, appointments, onAppointmentClick, onDateClick, config }: ViewProps) {
  const months = Array.from({ length: 12 }, (_, i) => 
    new Date(currentDate.getFullYear(), i, 1)
  )

  return (
    <div className="grid grid-cols-3 gap-4">
      {months.map((month, index) => (
        <MiniCalendar
          key={index}
          date={month}
          appointments={appointments}
          onAppointmentClick={onAppointmentClick}
          onDateClick={onDateClick}
          config={config}
        />
      ))}
    </div>
  )
}

export default Scheduler
