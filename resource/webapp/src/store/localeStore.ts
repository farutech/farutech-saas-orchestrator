/**
 * Store para configuración de locale, formatos de fecha y hora
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Tipos de formatos soportados
export type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'd/m/y' | 'yyyy-mm-dd' | 'dd-mm-yyyy'
export type TimeFormat = '12h' | '24h'
export type LocaleCode = 'es' | 'en' | 'pt' | 'fr'

// Configuración de idiomas
export interface LocaleConfig {
  code: LocaleCode
  name: string
  months: string[]
  monthsShort: string[]
  days: string[]
  daysShort: string[]
  dateFormat: DateFormat
  timeFormat: TimeFormat
}

// Configuraciones predefinidas por idioma
export const LOCALE_CONFIGS: Record<LocaleCode, LocaleConfig> = {
  es: {
    code: 'es',
    name: 'Español',
    months: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h',
  },
  en: {
    code: 'en',
    name: 'English',
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dateFormat: 'mm/dd/yyyy',
    timeFormat: '12h',
  },
  pt: {
    code: 'pt',
    name: 'Português',
    months: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h',
  },
  fr: {
    code: 'fr',
    name: 'Français',
    months: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    daysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h',
  },
}

interface LocaleState {
  locale: LocaleCode
  dateFormat: DateFormat
  timeFormat: TimeFormat
  setLocale: (locale: LocaleCode) => void
  setDateFormat: (format: DateFormat) => void
  setTimeFormat: (format: TimeFormat) => void
  getLocaleConfig: () => LocaleConfig
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'es',
      dateFormat: 'dd/mm/yyyy',
      timeFormat: '24h',
      
      setLocale: (locale) => {
        const config = LOCALE_CONFIGS[locale]
        set({ 
          locale,
          dateFormat: config.dateFormat,
          timeFormat: config.timeFormat,
        })
      },
      
      setDateFormat: (format) => set({ dateFormat: format }),
      
      setTimeFormat: (format) => set({ timeFormat: format }),
      
      getLocaleConfig: () => {
        const { locale } = get()
        return LOCALE_CONFIGS[locale]
      },
    }),
    {
      name: 'locale-storage',
    }
  )
)

// Utilidades de formato
export function formatDateWithLocale(
  date: Date | string | null,
  format?: DateFormat,
  includeTime = false,
  timeFormat?: TimeFormat
): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  const { dateFormat: defaultDateFormat, timeFormat: defaultTimeFormat } = useLocaleStore.getState()
  const actualFormat = format || defaultDateFormat
  const actualTimeFormat = timeFormat || defaultTimeFormat

  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  
  const dd = String(day).padStart(2, '0')
  const mm = String(month).padStart(2, '0')
  const d_single = String(day)
  const m_single = String(month)

  let dateStr = ''
  switch (actualFormat) {
    case 'dd/mm/yyyy':
      dateStr = `${dd}/${mm}/${year}`
      break
    case 'mm/dd/yyyy':
      dateStr = `${mm}/${dd}/${year}`
      break
    case 'd/m/y':
      dateStr = `${d_single}/${m_single}/${year}`
      break
    case 'yyyy-mm-dd':
      dateStr = `${year}-${mm}-${dd}`
      break
    case 'dd-mm-yyyy':
      dateStr = `${dd}-${mm}-${year}`
      break
    default:
      dateStr = `${dd}/${mm}/${year}`
  }

  if (!includeTime) {
    return dateStr
  }

  const hours24 = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  
  let timeStr = ''
  if (actualTimeFormat === '24h') {
    timeStr = `${String(hours24).padStart(2, '0')}:${minutes}`
  } else {
    const hours12 = hours24 % 12 || 12
    const ampm = hours24 >= 12 ? 'PM' : 'AM'
    timeStr = `${hours12}:${minutes} ${ampm}`
  }

  return `${dateStr} ${timeStr}`
}

// Parsear fecha según formato
export function parseDateWithFormat(
  dateStr: string,
  format?: DateFormat
): Date | null {
  if (!dateStr) return null

  const { dateFormat: defaultFormat } = useLocaleStore.getState()
  const actualFormat = format || defaultFormat

  const parts = dateStr.split(/[\/\-\s]/)
  if (parts.length < 3) return null

  let day: number, month: number, year: number

  switch (actualFormat) {
    case 'dd/mm/yyyy':
    case 'dd-mm-yyyy':
    case 'd/m/y':
      day = parseInt(parts[0])
      month = parseInt(parts[1]) - 1
      year = parseInt(parts[2])
      break
    case 'mm/dd/yyyy':
      month = parseInt(parts[0]) - 1
      day = parseInt(parts[1])
      year = parseInt(parts[2])
      break
    case 'yyyy-mm-dd':
      year = parseInt(parts[0])
      month = parseInt(parts[1]) - 1
      day = parseInt(parts[2])
      break
    default:
      return null
  }

  const date = new Date(year, month, day)
  return isNaN(date.getTime()) ? null : date
}
