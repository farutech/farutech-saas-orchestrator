/**
 * Componente Carousel - Carrusel de contenido totalmente personalizable
 */

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CarouselProps {
  /** Array de elementos a mostrar en el carrusel */
  children: ReactNode[]
  /** Clase CSS personalizada para el contenedor */
  className?: string
  /** Ancho personalizado (Tailwind class o CSS) */
  width?: string
  /** Altura personalizada (Tailwind class o CSS) */
  height?: string
  /** Mostrar borde */
  bordered?: boolean
  /** Estilo del borde */
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  /** Color del borde (Tailwind class) */
  borderColor?: string
  /** Radio de borde (Tailwind class) */
  borderRadius?: string
  /** Reproducción automática */
  autoPlay?: boolean
  /** Intervalo de autoplay en milisegundos */
  interval?: number
  /** Mostrar controles de navegación */
  showControls?: boolean
  /** Mostrar indicadores */
  showIndicators?: boolean
  /** Posición de los indicadores */
  indicatorPosition?: 'bottom' | 'top'
  /** Estilo de los controles */
  controlsVariant?: 'default' | 'arrows' | 'minimal'
  /** Función callback al cambiar de slide */
  onSlideChange?: (index: number) => void
}

export function Carousel({ 
  children, 
  className,
  width,
  height = 'h-96',
  bordered = false,
  borderStyle = 'solid',
  borderColor = 'border-gray-300 dark:border-gray-600',
  borderRadius = 'rounded-xl',
  autoPlay = false,
  interval = 3000,
  showControls = true,
  showIndicators = true,
  indicatorPosition = 'bottom',
  controlsVariant = 'default',
  onSlideChange,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalSlides = children.length

  const goToSlide = (index: number) => {
    const newIndex = (index + totalSlides) % totalSlides
    setCurrentIndex(newIndex)
    onSlideChange?.(newIndex)
  }

  const goToPrevious = () => {
    goToSlide(currentIndex - 1)
  }

  const goToNext = () => {
    goToSlide(currentIndex + 1)
  }

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(goToNext, interval)
    return () => clearInterval(timer)
  }, [currentIndex, autoPlay, interval])

  const borderStyleClass = {
    solid: 'border',
    dashed: 'border border-dashed',
    dotted: 'border border-dotted',
  }

  const controlsStyles = {
    default: {
      button: 'p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white shadow-lg hover:bg-white dark:hover:bg-gray-800',
      icon: 'h-6 w-6',
    },
    arrows: {
      button: 'p-3 bg-primary-600/90 backdrop-blur-sm text-white shadow-xl hover:bg-primary-700',
      icon: 'h-7 w-7',
    },
    minimal: {
      button: 'p-1.5 bg-transparent text-white/80 hover:text-white hover:bg-white/10',
      icon: 'h-8 w-8 stroke-[2.5]',
    },
  }

  const currentControlStyle = controlsStyles[controlsVariant]

  return (
    <div 
      className={clsx(
        'relative overflow-hidden',
        height,
        width,
        borderRadius,
        bordered && borderStyleClass[borderStyle],
        bordered && borderColor,
        className
      )}
    >
      {/* Slides */}
      <div className="relative h-full w-full">
        {children.map((child, index) => (
          <div
            key={index}
            className={clsx(
              'absolute inset-0 transition-all duration-500 ease-in-out',
              index === currentIndex
                ? 'opacity-100 translate-x-0 z-10'
                : index < currentIndex
                ? 'opacity-0 -translate-x-full z-0'
                : 'opacity-0 translate-x-full z-0'
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Controls */}
      {showControls && totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={clsx(
              'absolute left-4 top-1/2 -translate-y-1/2 z-20',
              'transition-all duration-200 hover:scale-110',
              currentControlStyle.button
            )}
            aria-label="Anterior"
          >
            <ChevronLeftIcon className={currentControlStyle.icon} />
          </button>
          <button
            onClick={goToNext}
            className={clsx(
              'absolute right-4 top-1/2 -translate-y-1/2 z-20',
              'transition-all duration-200 hover:scale-110',
              currentControlStyle.button
            )}
            aria-label="Siguiente"
          >
            <ChevronRightIcon className={currentControlStyle.icon} />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && totalSlides > 1 && (
        <div 
          className={clsx(
            'absolute left-1/2 -translate-x-1/2 z-20 flex gap-2',
            indicatorPosition === 'bottom' ? 'bottom-4' : 'top-4'
          )}
        >
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={clsx(
                'h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-8 bg-white shadow-lg'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
