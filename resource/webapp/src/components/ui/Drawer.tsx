/**
 * Drawer - Panel lateral deslizable (Offcanvas)
 * 
 * Características:
 * - ✅ Slide desde cualquier lado (left, right, top, bottom)
 * - ✅ Tamaños configurables (sm, md, lg, full)
 * - ✅ Overlay con blur
 * - ✅ Cierre automático al hacer clic fuera
 * - ✅ Animaciones suaves
 * - ✅ Header con título y botón cerrar
 * - ✅ Footer opcional para acciones
 * 
 * @example
 * ```tsx
 * <Drawer
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Editar Usuario"
 *   position="right"
 *   size="md"
 * >
 *   <p>Contenido del drawer...</p>
 * </Drawer>
 * ```
 */

import { Fragment, type ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Button } from './Button'

export interface DrawerProps {
  /** Estado de apertura */
  isOpen: boolean
  /** Callback al cerrar */
  onClose: () => void
  /** Título del drawer */
  title?: string
  /** Contenido del drawer */
  children: ReactNode
  /** Posición del drawer */
  position?: 'left' | 'right' | 'top' | 'bottom'
  /** Tamaño del drawer */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Footer con acciones */
  footer?: ReactNode
  /** Ocultar botón de cerrar */
  hideCloseButton?: boolean
  /** Clase CSS adicional */
  className?: string
}

const sizeStyles = {
  left: {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  },
  right: {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  },
  top: {
    sm: 'max-h-32',
    md: 'max-h-48',
    lg: 'max-h-64',
    xl: 'max-h-96',
    full: 'max-h-full',
  },
  bottom: {
    sm: 'max-h-32',
    md: 'max-h-48',
    lg: 'max-h-64',
    xl: 'max-h-96',
    full: 'max-h-full',
  },
}

const positionStyles = {
  left: {
    panel: 'inset-y-0 left-0',
    enter: 'transition ease-out duration-300 transform',
    enterFrom: '-translate-x-full',
    enterTo: 'translate-x-0',
    leave: 'transition ease-in duration-200 transform',
    leaveFrom: 'translate-x-0',
    leaveTo: '-translate-x-full',
  },
  right: {
    panel: 'inset-y-0 right-0',
    enter: 'transition ease-out duration-300 transform',
    enterFrom: 'translate-x-full',
    enterTo: 'translate-x-0',
    leave: 'transition ease-in duration-200 transform',
    leaveFrom: 'translate-x-0',
    leaveTo: 'translate-x-full',
  },
  top: {
    panel: 'inset-x-0 top-0',
    enter: 'transition ease-out duration-300 transform',
    enterFrom: '-translate-y-full',
    enterTo: 'translate-y-0',
    leave: 'transition ease-in duration-200 transform',
    leaveFrom: 'translate-y-0',
    leaveTo: '-translate-y-full',
  },
  bottom: {
    panel: 'inset-x-0 bottom-0',
    enter: 'transition ease-out duration-300 transform',
    enterFrom: 'translate-y-full',
    enterTo: 'translate-y-0',
    leave: 'transition ease-in duration-200 transform',
    leaveFrom: 'translate-y-0',
    leaveTo: 'translate-y-full',
  },
}

/**
 * Componente Drawer
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  footer,
  hideCloseButton = false,
  className,
}: DrawerProps) {
  const posStyles = positionStyles[position]
  const sizeClass = sizeStyles[position][size]
  const isVertical = position === 'left' || position === 'right'

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={clsx('pointer-events-none fixed flex', posStyles.panel, isVertical ? 'w-screen' : 'h-screen')}>
              <Transition.Child
                as={Fragment}
                enter={posStyles.enter}
                enterFrom={posStyles.enterFrom}
                enterTo={posStyles.enterTo}
                leave={posStyles.leave}
                leaveFrom={posStyles.leaveFrom}
                leaveTo={posStyles.leaveTo}
              >
                <Dialog.Panel
                  className={clsx(
                    'pointer-events-auto w-full',
                    sizeClass,
                    'flex flex-col bg-white dark:bg-gray-900 shadow-xl',
                    className
                  )}
                >
                  {/* Header */}
                  {(title || !hideCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      {title && (
                        <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                          {title}
                        </Dialog.Title>
                      )}
                      {!hideCloseButton && (
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          onClick={onClose}
                        >
                          <span className="sr-only">Cerrar</span>
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {children}
                  </div>

                  {/* Footer */}
                  {footer && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      {footer}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

/**
 * Drawer Footer Helper - Para botones de acción estándar
 */
export function DrawerFooter({
  onCancel,
  onConfirm,
  cancelLabel = 'Cancelar',
  confirmLabel = 'Guardar',
  confirmVariant = 'primary',
  confirmDisabled = false,
  loading = false,
}: {
  onCancel: () => void
  onConfirm: () => void
  cancelLabel?: string
  confirmLabel?: string
  confirmVariant?: 'primary' | 'success' | 'danger'
  confirmDisabled?: boolean
  loading?: boolean
}) {
  return (
    <>
      <Button variant="secondary" onClick={onCancel} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm} disabled={confirmDisabled || loading}>
        {loading ? 'Guardando...' : confirmLabel}
      </Button>
    </>
  )
}
