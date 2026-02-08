/**
 * Componente Form - Sistema de formularios con grid responsivo tipo Bootstrap
 */

import React from 'react'
import clsx from 'clsx'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  className?: string
}

/**
 * Form - Contenedor principal del formulario
 * @example
 * <Form onSubmit={handleSubmit}>
 *   <FormRow>
 *     <FormGroup cols={{ default: 12, md: 6 }}>
 *       <Input label="Nombre" />
 *     </FormGroup>
 *   </FormRow>
 * </Form>
 */
export function Form({ children, className, ...props }: FormProps) {
  return (
    <form className={clsx('space-y-6', className)} {...props}>
      {children}
    </form>
  )
}

interface FormRowProps {
  children: React.ReactNode
  className?: string
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * FormRow - Fila que contiene FormGroups en un grid responsivo
 * @example
 * <FormRow gap="md">
 *   <FormGroup cols={{ default: 12, md: 6 }}>
 *     <Input label="Campo 1" />
 *   </FormGroup>
 *   <FormGroup cols={{ default: 12, md: 6 }}>
 *     <Input label="Campo 2" />
 *   </FormGroup>
 * </FormRow>
 */
export function FormRow({ children, className, gap = 'md' }: FormRowProps) {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  return (
    <div className={clsx('grid grid-cols-12', gapClasses[gap], className)}>
      {children}
    </div>
  )
}

type ColumnSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface FormGroupProps {
  children: React.ReactNode
  className?: string
  /** Configuración de columnas por breakpoint */
  cols?: {
    default?: ColumnSize
    sm?: ColumnSize
    md?: ColumnSize
    lg?: ColumnSize
    xl?: ColumnSize
    '2xl'?: ColumnSize
  }
  /** Atajo: usar un solo valor para todas las pantallas */
  col?: ColumnSize
}

/**
 * FormGroup - Grupo de formulario con sistema de columnas responsivo
 * Similar al sistema de grid de Bootstrap (col-md-6, etc.)
 * @example
 * // Ocupa 12 columnas en móvil, 6 en tablet, 4 en desktop
 * <FormGroup cols={{ default: 12, md: 6, lg: 4 }}>
 *   <Input label="Nombre" />
 * </FormGroup>
 * 
 * // Atajo: ocupa 6 columnas en todas las pantallas
 * <FormGroup col={6}>
 *   <Input label="Email" />
 * </FormGroup>
 */
export function FormGroup({ children, className, cols, col }: FormGroupProps) {
  // Si se usa el atajo 'col', aplicar a todas las pantallas
  const columnConfig = col ? { default: col } : cols

  // Generar clases de columnas responsivas
  const colClasses = columnConfig
    ? Object.entries(columnConfig).map(([breakpoint, size]) => {
        if (breakpoint === 'default') {
          return `col-span-${size}`
        }
        return `${breakpoint}:col-span-${size}`
      })
    : ['col-span-12']

  return (
    <div className={clsx(...colClasses, className)}>
      {children}
    </div>
  )
}

interface FormSectionProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

/**
 * FormSection - Sección de formulario con título y descripción opcional
 * @example
 * <FormSection 
 *   title="Información Personal" 
 *   description="Completa tus datos personales"
 * >
 *   <FormRow>...</FormRow>
 * </FormSection>
 */
export function FormSection({ 
  children, 
  title, 
  description, 
  className 
}: FormSectionProps) {
  return (
    <div className={clsx('space-y-4', className)}>
      {(title || description) && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

interface FormActionsProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'between'
}

/**
 * FormActions - Contenedor para botones de acción del formulario
 * @example
 * <FormActions align="right">
 *   <Button variant="secondary">Cancelar</Button>
 *   <Button type="submit">Guardar</Button>
 * </FormActions>
 */
export function FormActions({ children, className, align = 'right' }: FormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div className={clsx('flex items-center gap-3', alignClasses[align], className)}>
      {children}
    </div>
  )
}
