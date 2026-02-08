/**
 * Common Types - Farutech Design System
 */

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline'
export type Status = 'success' | 'warning' | 'error' | 'info'

export interface BaseComponentProps {
  className?: string
  id?: string
}

export interface WithChildren {
  children?: React.ReactNode
}
