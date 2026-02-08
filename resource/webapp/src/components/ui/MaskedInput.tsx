/**
 * MaskedInput - Input con máscaras de formato y validación regex
 * 
 * Características:
 * - ✅ Máscaras predefinidas (phone, date, time, credit-card, etc.)
 * - ✅ Máscaras personalizadas
 * - ✅ Validación regex con feedback visual
 * - ✅ Pre-validación antes de enviar formulario
 * - ✅ Separación entre valor mostrado y valor real
 * - ✅ Formateo automático mientras escribe
 * 
 * @example Teléfono colombiano
 * ```tsx
 * <MaskedInput
 *   mask="phone-co"
 *   value={phone}
 *   onChange={(value, formatted) => setPhone(value)}
 *   label="Teléfono"
 * />
 * // Usuario ve: "+57 321 456 7890"
 * // Valor guardado: "3214567890"
 * ```
 * 
 * @example Máscara personalizada
 * ```tsx
 * <MaskedInput
 *   mask="###-###-###"
 *   maskChar="#"
 *   value={code}
 *   onChange={(value) => setCode(value)}
 *   validation={/^\d{9}$/}
 * />
 * ```
 */

import { forwardRef, useState, useEffect } from 'react'
import type { InputHTMLAttributes, ChangeEvent } from 'react'
import clsx from 'clsx'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

// Máscaras predefinidas
export type PredefinedMask = 
  | 'phone-co'          // +57 xxx xxx xxxx
  | 'phone-us'          // (xxx) xxx-xxxx
  | 'phone-intl'        // +xx xxx xxx xxxx
  | 'date-dmy'          // DD/MM/YYYY
  | 'date-mdy'          // MM/DD/YYYY
  | 'time-24'           // HH:MM
  | 'time-12'           // HH:MM AM/PM
  | 'credit-card'       // xxxx xxxx xxxx xxxx
  | 'credit-card-exp'   // MM/YY
  | 'credit-card-cvv'   // xxx
  | 'ssn'               // xxx-xx-xxxx
  | 'zip-code'          // xxxxx or xxxxx-xxxx
  | 'currency-cop'      // $x,xxx,xxx
  | 'currency-usd'      // $x,xxx.xx
  | 'percentage'        // xx.xx%
  | 'custom'            // Usar customMask

interface MaskConfig {
  /** Formato de máscara (# = dígito, A = letra, * = alfanumérico) */
  format: string
  /** Regex para validar el valor sin máscara */
  validation?: RegExp
  /** Placeholder cuando está vacío */
  placeholder?: string
  /** Función para formatear el valor */
  formatter?: (value: string) => string
  /** Función para extraer el valor sin formato */
  unformatter?: (formatted: string) => string
}

const MASK_CONFIGS: Record<PredefinedMask, MaskConfig> = {
  'phone-co': {
    format: '+57 ### ### ####',
    validation: /^\d{10}$/,
    placeholder: '+57 321 456 7890',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 10)
      if (cleaned.length === 0) return ''
      if (cleaned.length <= 3) return `+57 ${cleaned}`
      if (cleaned.length <= 6) return `+57 ${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
      return `+57 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 10),
  },
  'phone-us': {
    format: '(###) ###-####',
    validation: /^\d{10}$/,
    placeholder: '(555) 123-4567',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 10)
      if (cleaned.length === 0) return ''
      if (cleaned.length <= 3) return `(${cleaned}`
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 10),
  },
  'phone-intl': {
    format: '+## ### ### ####',
    validation: /^\d{11,13}$/,
    placeholder: '+1 555 123 4567',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 13)
      if (cleaned.length === 0) return ''
      if (cleaned.length <= 2) return `+${cleaned}`
      if (cleaned.length <= 5) return `+${cleaned.slice(0, 2)} ${cleaned.slice(2)}`
      if (cleaned.length <= 8) return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 13),
  },
  'date-dmy': {
    format: 'DD/MM/YYYY',
    validation: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    placeholder: '31/12/2024',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 8)
      if (cleaned.length === 0) return ''
      if (cleaned.length <= 2) return cleaned
      if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 8),
  },
  'date-mdy': {
    format: 'MM/DD/YYYY',
    validation: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
    placeholder: '12/31/2024',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 8)
      if (cleaned.length === 0) return ''
      if (cleaned.length <= 2) return cleaned
      if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 8),
  },
  'time-24': {
    format: 'HH:MM',
    validation: /^([01][0-9]|2[0-3]):[0-5][0-9]$/,
    placeholder: '23:59',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 4)
      if (cleaned.length === 0) return ''
      if (cleaned.length <= 2) return cleaned
      return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 4),
  },
  'time-12': {
    format: 'HH:MM AM/PM',
    validation: /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
    placeholder: '12:30 PM',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 4)
      if (cleaned.length === 0) return ''
      if (cleaned.length <= 2) return cleaned
      const time = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`
      const hour = parseInt(cleaned.slice(0, 2))
      const suffix = hour >= 12 ? ' PM' : ' AM'
      return time + suffix
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 4),
  },
  'credit-card': {
    format: '#### #### #### ####',
    validation: /^\d{16}$/,
    placeholder: '1234 5678 9012 3456',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 16)
      const parts = cleaned.match(/.{1,4}/g) || []
      return parts.join(' ')
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 16),
  },
  'credit-card-exp': {
    format: 'MM/YY',
    validation: /^(0[1-9]|1[0-2])\/\d{2}$/,
    placeholder: '12/25',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 4)
      if (cleaned.length === 0) return ''
      if (cleaned.length <= 2) return cleaned
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 4),
  },
  'credit-card-cvv': {
    format: '###',
    validation: /^\d{3,4}$/,
    placeholder: '123',
    formatter: (value) => value.replace(/\D/g, '').slice(0, 4),
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 4),
  },
  'ssn': {
    format: '###-##-####',
    validation: /^\d{9}$/,
    placeholder: '123-45-6789',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 9)
      if (cleaned.length === 0) return ''
      if (cleaned.length <= 3) return cleaned
      if (cleaned.length <= 5) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 9),
  },
  'zip-code': {
    format: '#####-####',
    validation: /^\d{5}(-\d{4})?$/,
    placeholder: '12345-6789',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 9)
      if (cleaned.length === 0) return ''
      if (cleaned.length <= 5) return cleaned
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`
    },
    unformatter: (formatted) => formatted.replace(/\D/g, '').slice(0, 9),
  },
  'currency-cop': {
    format: '$#,###,###',
    validation: /^\d+$/,
    placeholder: '$1,234,567',
    formatter: (value) => {
      const cleaned = value.replace(/\D/g, '')
      if (cleaned === '') return ''
      return `$${parseInt(cleaned).toLocaleString('es-CO')}`
    },
    unformatter: (formatted) => formatted.replace(/\D/g, ''),
  },
  'currency-usd': {
    format: '$#,###.##',
    validation: /^\d+(\.\d{1,2})?$/,
    placeholder: '$1,234.56',
    formatter: (value) => {
      const cleaned = value.replace(/[^\d.]/g, '')
      if (cleaned === '') return ''
      const [integer, decimal] = cleaned.split('.')
      const formattedInt = parseInt(integer || '0').toLocaleString('en-US')
      return decimal !== undefined ? `$${formattedInt}.${decimal.slice(0, 2)}` : `$${formattedInt}`
    },
    unformatter: (formatted) => formatted.replace(/[^\d.]/g, ''),
  },
  'percentage': {
    format: '##.##%',
    validation: /^\d{1,3}(\.\d{1,2})?$/,
    placeholder: '99.99%',
    formatter: (value) => {
      const cleaned = value.replace(/[^\d.]/g, '')
      if (cleaned === '') return ''
      return `${cleaned}%`
    },
    unformatter: (formatted) => formatted.replace(/[^\d.]/g, ''),
  },
  'custom': {
    format: '',
    placeholder: '',
  },
}

export interface MaskedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Máscara predefinida o 'custom' */
  mask?: PredefinedMask
  /** Máscara personalizada (solo si mask='custom') */
  customMask?: string
  /** Función formateadora personalizada (para máscaras custom avanzadas) */
  customFormatter?: (value: string) => string
  /** Función para extraer valor sin formato (para máscaras custom avanzadas) */
  customUnformatter?: (formatted: string) => string
  /** Carácter de máscara (default: #) */
  maskChar?: string
  /** Valor sin formato (el que se guarda) */
  value?: string
  /** Callback con valor sin formato y valor formateado */
  onChange?: (unmaskedValue: string, formattedValue: string) => void
  /** Regex de validación personalizada (sobrescribe la predefinida) */
  validation?: RegExp
  /** Label del input */
  label?: string
  /** Texto de ayuda */
  helperText?: string
  /** Mensaje de error externo */
  error?: string
  /** Mostrar indicador de validación */
  showValidation?: boolean
  /** Full width */
  fullWidth?: boolean
  /** Validar en tiempo real */
  validateOnChange?: boolean
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      mask = 'custom',
      customMask,
      customFormatter,
      customUnformatter,
      maskChar = '#',
      value = '',
      onChange,
      validation: customValidation,
      label,
      helperText,
      error: externalError,
      showValidation = true,
      fullWidth = true,
      validateOnChange = true,
      className,
      placeholder: customPlaceholder,
      disabled,
      ...props
    },
    ref
  ) => {
    const maskConfig = mask === 'custom' 
      ? { 
          format: customMask || '', 
          placeholder: customPlaceholder || '', 
          validation: customValidation,
          formatter: customFormatter,
          unformatter: customUnformatter,
        }
      : MASK_CONFIGS[mask]

    const [formattedValue, setFormattedValue] = useState('')
    const [internalError, setInternalError] = useState('')
    const [touched, setTouched] = useState(false)

    // Validación regex
    const validationRegex = customValidation || maskConfig.validation
    const isValid = validationRegex ? validationRegex.test(value) : true
    const showError = touched && (externalError || internalError)
    const showSuccess = touched && showValidation && !showError && isValid && value.length > 0

    // Formatear valor inicial
    useEffect(() => {
      if (maskConfig.formatter) {
        setFormattedValue(maskConfig.formatter(value))
      } else {
        setFormattedValue(value)
      }
    }, [value, mask])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      
      // Aplicar formatter
      const formatted = maskConfig.formatter ? maskConfig.formatter(inputValue) : inputValue
      const unmasked = maskConfig.unformatter ? maskConfig.unformatter(formatted) : formatted

      setFormattedValue(formatted)

      // Validar si es necesario
      if (validateOnChange && validationRegex && unmasked.length > 0) {
        if (!validationRegex.test(unmasked)) {
          setInternalError(`Formato inválido. Ejemplo: ${maskConfig.placeholder}`)
        } else {
          setInternalError('')
        }
      }

      // Llamar onChange con valor sin máscara
      onChange?.(unmasked, formatted)
    }

    const handleBlur = () => {
      setTouched(true)
      
      // Validar al salir del campo
      if (validationRegex && value.length > 0 && !validationRegex.test(value)) {
        setInternalError(`Formato inválido. Ejemplo: ${maskConfig.placeholder}`)
      }
    }

    const displayError = externalError || internalError
    const inputId = props.id || `masked-input-${Math.random().toString(36).substring(7)}`

    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="text"
            value={formattedValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={maskConfig.placeholder}
            disabled={disabled}
            className={clsx(
              'input',
              showValidation && 'pr-10',
              displayError && 'border-red-500 focus:ring-red-500',
              showSuccess && 'border-green-500 focus:ring-green-500',
              className
            )}
            {...props}
          />

          {/* Indicador de validación */}
          {showValidation && !disabled && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {displayError ? (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              ) : showSuccess ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : touched && value.length > 0 && !isValid ? (
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
              ) : null}
            </div>
          )}
        </div>

        {/* Mensajes de ayuda/error */}
        {displayError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{displayError}</p>
        )}

        {helperText && !displayError && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}

        {/* Indicador de formato esperado */}
        {!displayError && !helperText && maskConfig.placeholder && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Formato: {maskConfig.placeholder}
          </p>
        )}
      </div>
    )
  }
)

MaskedInput.displayName = 'MaskedInput'
