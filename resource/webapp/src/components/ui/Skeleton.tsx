/**
 * Skeleton - Componentes de carga tipo skeleton
 * 
 * Variantes:
 * - SkeletonCard: Skeleton para Card
 * - SkeletonList: Skeleton para Lista
 * - SkeletonTable: Skeleton para Tabla
 * - SkeletonForm: Skeleton para Formulario
 * - SkeletonText: Skeleton para texto/párrafos
 * 
 * @example
 * ```tsx
 * <SkeletonCard />
 * <SkeletonList items={5} />
 * <SkeletonTable rows={10} columns={4} />
 * ```
 */

import clsx from 'clsx'
import { Card } from './Card'

interface SkeletonProps {
  className?: string
}

/**
 * Skeleton básico (barra animada)
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
        className
      )}
    />
  )
}

/**
 * Skeleton para Card
 */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <Card className={clsx('p-5', className)}>
      <div className="animate-pulse space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
        
        {/* Footer */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </Card>
  )
}

/**
 * Skeleton para Lista
 */
export function SkeletonList({ items = 5, className }: SkeletonProps & { items?: number }) {
  return (
    <div className={clsx('space-y-3', className)}>
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton para Tabla
 */
export function SkeletonTable({ 
  rows = 5, 
  columns = 4, 
  className 
}: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Header */}
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="px-3 py-3">
                <Skeleton className="h-4 w-full" />
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Body */}
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="px-3 py-4">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Skeleton para Formulario
 */
export function SkeletonForm({ fields = 5, className }: SkeletonProps & { fields?: number }) {
  return (
    <div className={clsx('space-y-6', className)}>
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

/**
 * Skeleton para Texto/Párrafos
 */
export function SkeletonText({ 
  lines = 3, 
  className 
}: SkeletonProps & { lines?: number }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton 
          key={i} 
          className={clsx(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )} 
        />
      ))}
    </div>
  )
}

/**
 * Skeleton para Avatar
 */
export function SkeletonAvatar({ size = 'md', className }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }
  
  return <Skeleton className={clsx(sizeClasses[size], 'rounded-full', className)} />
}

/**
 * Skeleton para Grid de Cards
 */
export function SkeletonGrid({ items = 6, cols = 3, className }: SkeletonProps & { items?: number; cols?: number }) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }
  
  return (
    <div className={clsx('grid gap-4', gridClasses[cols as keyof typeof gridClasses] || gridClasses[3], className)}>
      {[...Array(items)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
