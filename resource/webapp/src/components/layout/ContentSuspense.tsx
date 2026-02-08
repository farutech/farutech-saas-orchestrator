/**
 * Suspense Boundary para contenido de páginas
 * 
 * Muestra el logo spinner solo en el área de contenido
 * mientras React lazy-load carga el componente
 */

import { Suspense, type ReactNode } from 'react'
import { LogoSpinner } from '@/components/ui/LogoSpinner'

interface ContentSuspenseProps {
  children: ReactNode
  /**
   * Fallback personalizado (opcional)
   * Por defecto muestra LogoSpinner centrado
   */
  fallback?: ReactNode
}

/**
 * Wrapper de Suspense optimizado para contenido de páginas
 * 
 * Características:
 * - Muestra spinner solo en el área de contenido (no recarga sidebar/navbar)
 * - Transiciones suaves entre páginas
 * - Mantiene el contexto del módulo activo
 * 
 * @example
 * <ContentSuspense>
 *   <UsersPage />
 * </ContentSuspense>
 */
export function ContentSuspense({ children, fallback }: ContentSuspenseProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] w-full">
      <div className="flex flex-col items-center gap-4">
        <LogoSpinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Cargando contenido...
        </p>
      </div>
    </div>
  )

  return (
    <Suspense fallback={fallback ?? defaultFallback}>
      {children}
    </Suspense>
  )
}
