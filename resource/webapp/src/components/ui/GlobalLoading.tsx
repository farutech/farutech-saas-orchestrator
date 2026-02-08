/**
 * GlobalLoading - Componente de carga global configurable
 * 
 * Permite mostrar un spinner mientras carga cualquier elemento.
 * - Por defecto usa LogoSpinner con variante aleatoria
 * - Permite especificar variante específica
 * - Permite usar componente de carga personalizado
 * 
 * @example
 * // Con variante aleatoria (por defecto)
 * <GlobalLoading />
 * 
 * @example
 * // Con variante específica
 * <GlobalLoading variant="flip" />
 * 
 * @example
 * // Con componente personalizado
 * <GlobalLoading customLoader={<MiSpinnerCustom />} />
 */

import { useMemo, type ReactNode } from 'react'
import { LogoSpinner } from './LogoSpinner'

type SpinnerVariant = 'spin' | 'flip' | 'flipHorizontal' | 'random'
type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

interface GlobalLoadingProps {
  /** Variante del spinner: 'spin', 'flip', 'flipHorizontal' o 'random' (default) */
  variant?: SpinnerVariant
  /** Tamaño del spinner */
  size?: SpinnerSize
  /** Mensaje a mostrar debajo del spinner */
  message?: string
  /** Componente de carga personalizado (sobrescribe el spinner por defecto) */
  customLoader?: ReactNode
  /** Usar pantalla completa (default: true) */
  fullScreen?: boolean
  /** Clase CSS adicional */
  className?: string
}

export function GlobalLoading({
  variant = 'random',
  size = 'xl',
  message = 'Cargando...',
  customLoader,
  fullScreen = true,
  className = '',
}: GlobalLoadingProps) {
  // Generar variante aleatoria si se especifica 'random'
  const resolvedVariant = useMemo(() => {
    if (variant !== 'random') return variant
    const variants: Array<'spin' | 'flip' | 'flipHorizontal'> = ['spin', 'flip', 'flipHorizontal']
    return variants[Math.floor(Math.random() * variants.length)]
  }, [variant])

  const containerClass = fullScreen
    ? 'flex flex-col items-center justify-center h-screen gap-4'
    : 'flex flex-col items-center justify-center gap-4'

  return (
    <div className={`${containerClass} ${className}`}>
      {customLoader ? (
        customLoader
      ) : (
        <>
          <LogoSpinner variant={resolvedVariant} speed="normal" size={size} />
          {message && (
            <p className="text-gray-500 dark:text-gray-400 text-lg animate-pulse">
              {message}
            </p>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Hook para mostrar loading global con configuración
 */
export function useGlobalLoading() {
  return {
    LoadingComponent: GlobalLoading,
  }
}

export default GlobalLoading
