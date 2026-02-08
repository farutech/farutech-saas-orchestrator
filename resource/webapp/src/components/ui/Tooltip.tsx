/**
 * Componente Tooltip - Información flotante al hover con soporte para tipos
 */

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import type { ReactNode } from 'react'

export type TooltipType = 'info' | 'warning' | 'success' | 'error' | 'default'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
  type?: TooltipType
  showIcon?: boolean
}

const typeConfig = {
  info: {
    bg: 'bg-blue-600 dark:bg-blue-500',
    text: 'text-white',
    border: 'border-t-blue-600 dark:border-t-blue-500',
    icon: InformationCircleIcon,
  },
  warning: {
    bg: 'bg-amber-600 dark:bg-amber-500',
    text: 'text-white',
    border: 'border-t-amber-600 dark:border-t-amber-500',
    icon: ExclamationTriangleIcon,
  },
  success: {
    bg: 'bg-green-600 dark:bg-green-500',
    text: 'text-white',
    border: 'border-t-green-600 dark:border-t-green-500',
    icon: CheckCircleIcon,
  },
  error: {
    bg: 'bg-red-600 dark:bg-red-500',
    text: 'text-white',
    border: 'border-t-red-600 dark:border-t-red-500',
    icon: XCircleIcon,
  },
  default: {
    bg: 'bg-gray-900 dark:bg-gray-700',
    text: 'text-white',
    border: 'border-t-gray-900 dark:border-t-gray-700',
    icon: null,
  },
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
  type = 'default',
  showIcon = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const config = typeConfig[type]
  const Icon = config.icon

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    let x = 0
    let y = 0

    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.top - tooltipRect.height - 8
        break
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.bottom + 8
        break
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
      case 'right':
        x = triggerRect.right + 8
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
    }

    // Ajustar si se sale de la pantalla
    if (x < 8) x = 8
    if (x + tooltipRect.width > window.innerWidth - 8) {
      x = window.innerWidth - tooltipRect.width - 8
    }
    if (y < 8) y = 8
    if (y + tooltipRect.height > window.innerHeight - 8) {
      y = window.innerHeight - tooltipRect.height - 8
    }

    setCoords({ x, y })
  }

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)

      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isVisible])

  const arrowPositionStyles = {
    top: `bottom-[-6px] left-1/2 -translate-x-1/2 border-t-${config.bg.replace('bg-', '')}`,
    bottom: `top-[-6px] left-1/2 -translate-x-1/2 border-b-${config.bg.replace('bg-', '')}`,
    left: `right-[-6px] top-1/2 -translate-y-1/2 border-l-${config.bg.replace('bg-', '')}`,
    right: `left-[-6px] top-1/2 -translate-y-1/2 border-r-${config.bg.replace('bg-', '')}`,
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: 'fixed',
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              zIndex: 9999,
            }}
            className="animate-in fade-in zoom-in-95 duration-200"
          >
            <div className={clsx(
              'relative px-3 py-2 text-sm rounded-lg shadow-xl max-w-xs flex items-center gap-2',
              config.bg,
              config.text
            )}>
              {showIcon && Icon && (
                <Icon className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{content}</span>
              <div
                className={clsx(
                  'absolute w-0 h-0 border-[6px] border-transparent',
                  arrowPositionStyles[position]
                )}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
