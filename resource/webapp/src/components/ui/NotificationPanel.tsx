/**
 * NotificationPanel - Panel de notificaciones en navbar
 * 
 * Características:
 * - ✅ Badge con contador de no leídas
 * - ✅ Lista de notificaciones
 * - ✅ Mark as read / Mark all as read
 * - ✅ Filtrar por tipo
 * - ✅ Link a detalle
 * - ✅ Timestamps relativos
 * - ✅ Empty state
 * 
 * @example
 * ```tsx
 * const notifications = [
 *   { id: '1', title: 'Nuevo usuario', message: 'Juan se ha registrado', type: 'info', read: false, timestamp: new Date() },
 *   { id: '2', title: 'Error', message: 'Fallo en el sistema', type: 'error', read: false, timestamp: new Date() }
 * ]
 * 
 * <NotificationPanel notifications={notifications} onMarkAsRead={handleRead} />
 * ```
 */

import { Fragment, useState } from 'react'
import type { ReactNode } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { 
  BellIcon, 
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Badge } from './Badge'

export interface Notification {
  /** ID único */
  id: string
  /** Título */
  title: string
  /** Mensaje */
  message: string
  /** Tipo */
  type?: 'info' | 'success' | 'warning' | 'error'
  /** Leída */
  read: boolean
  /** Timestamp */
  timestamp: Date
  /** Ícono custom */
  icon?: ReactNode
  /** Link opcional */
  link?: string
  /** Acción al hacer click */
  onClick?: () => void
}

export interface NotificationPanelProps {
  /** Lista de notificaciones */
  notifications: Notification[]
  /** Callback al marcar como leída */
  onMarkAsRead?: (id: string) => void
  /** Callback al marcar todas como leídas */
  onMarkAllAsRead?: () => void
  /** Callback al eliminar notificación */
  onDelete?: (id: string) => void
  /** Callback al hacer click en notificación */
  onNotificationClick?: (notification: Notification) => void
  /** Límite de notificaciones a mostrar */
  limit?: number
  /** Mostrar todas (link) */
  showAllLink?: string
  /** Clase CSS adicional */
  className?: string
}

const typeStyles = {
  info: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    icon: InformationCircleIcon,
  },
  success: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    icon: CheckCircleIcon,
  },
  warning: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    icon: ExclamationTriangleIcon,
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
    icon: XCircleIcon,
  },
}

// Formatear timestamp relativo
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes}m`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 7) return `Hace ${days}d`
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

/**
 * Componente NotificationPanel
 */
export function NotificationPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNotificationClick,
  limit = 5,
  showAllLink,
  className,
}: NotificationPanelProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter((n) => !n.read)
    : notifications

  const displayedNotifications = filteredNotifications.slice(0, limit)

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }

    if (notification.onClick) {
      notification.onClick()
    } else if (notification.link) {
      window.location.href = notification.link
    } else if (onNotificationClick) {
      onNotificationClick(notification)
    }
  }

  return (
    <Popover className={clsx('relative', className)}>
      {({ open }) => (
        <>
          {/* Bell Button */}
          <Popover.Button
            className={clsx(
              'relative rounded-lg p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors',
              open && 'bg-gray-100 dark:bg-gray-800'
            )}
          >
            <span className="sr-only">Ver notificaciones</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-50 mt-2 w-80 sm:w-96 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Notificaciones
                  {unreadCount > 0 && (
                    <Badge variant="danger" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </h3>

                {unreadCount > 0 && onMarkAllAsRead && (
                  <button
                    type="button"
                    onClick={onMarkAllAsRead}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    Marcar todas leídas
                  </button>
                )}
              </div>

              {/* Filters */}
              {notifications.length > 0 && (
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={clsx(
                      'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                      filter === 'all'
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={clsx(
                      'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                      filter === 'unread'
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    No leídas ({unreadCount})
                  </button>
                </div>
              )}

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {displayedNotifications.length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <BellIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      No hay notificaciones
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'Cuando tengas notificaciones, aparecerán aquí'}
                    </p>
                  </div>
                ) : (
                  displayedNotifications.map((notification) => {
                    const styles = typeStyles[notification.type || 'info']

                    return (
                      <div
                        key={notification.id}
                        className={clsx(
                          'group relative flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0',
                          !notification.read && 'bg-primary-50/30 dark:bg-primary-900/10'
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {/* Icon */}
                        <div className={clsx('flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg', styles.bg)}>
                          {notification.icon ? (
                            <span className={clsx('h-5 w-5', styles.text)}>{notification.icon}</span>
                          ) : (
                            (() => {
                              const IconComponent = styles.icon
                              return <IconComponent className={clsx('h-5 w-5', styles.text)} />
                            })()
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="flex-shrink-0 h-2 w-2 bg-primary-600 rounded-full" />
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            {formatRelativeTime(notification.timestamp)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && onMarkAsRead && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onMarkAsRead(notification.id)
                              }}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                              title="Marcar como leída"
                            >
                              <CheckIcon className="h-4 w-4 text-gray-400" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDelete(notification.id)
                              }}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                              title="Eliminar"
                            >
                              <XMarkIcon className="h-4 w-4 text-gray-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              {showAllLink && filteredNotifications.length > limit && (
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                  <a
                    href={showAllLink}
                    className="block text-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Ver todas las notificaciones ({filteredNotifications.length})
                  </a>
                </div>
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
