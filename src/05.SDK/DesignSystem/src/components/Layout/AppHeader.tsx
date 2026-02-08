// ============================================================================
// APP HEADER - Enterprise Header with Navigation and User Menu
// ============================================================================
// Componente de header desacoplado para aplicaciones enterprise
// Basado en resource/webapp/Navbar.tsx

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface Notification {
  id: string | number;
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface UserInfo {
  name: string;
  email?: string;
  avatar?: string;
}

export interface AppHeaderProps {
  /** Breadcrumb items para navegación */
  breadcrumbs?: BreadcrumbItem[];
  /** Información del usuario */
  user?: UserInfo;
  /** Notificaciones */
  notifications?: Notification[];
  /** Tema actual */
  theme?: 'light' | 'dark';
  /** Handler para toggle del sidebar */
  onToggleSidebar?: () => void;
  /** Handler para toggle del tema */
  onToggleTheme?: () => void;
  /** Handler para abrir búsqueda */
  onOpenSearch?: () => void;
  /** Handler para logout */
  onLogout?: () => void;
  /** Handler para ir al perfil */
  onGoToProfile?: () => void;
  /** Handler para ir a settings */
  onGoToSettings?: () => void;
  /** Ancho del header (para alineación con sidebar) */
  width?: string;
  /** Posición left del header */
  left?: string;
  /** Clases CSS adicionales */
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    case 'warning':
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
    case 'danger':
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    case 'info':
    default:
      return <InformationCircleIcon className="h-5 w-5 text-blue-600" />;
  }
};

// ============================================================================
// Breadcrumb Component
// ============================================================================

const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="flex-shrink-0 w-4 h-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const AppHeader: React.FC<AppHeaderProps> = ({
  breadcrumbs = [{ label: 'Dashboard' }],
  user = { name: 'Usuario', email: 'usuario@ejemplo.com' },
  notifications = [],
  theme = 'light',
  onToggleSidebar,
  onToggleTheme,
  onOpenSearch,
  onLogout,
  onGoToProfile,
  onGoToSettings,
  width = '100%',
  left = '0px',
  className,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      style={{ width, left }}
      className={cn(
        'fixed top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md',
        'border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm',
        'transition-all duration-500 ease-out',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-xl"
              title="Toggle menú"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          )}

          {/* Breadcrumbs */}
          <div className="hidden sm:block">
            <Breadcrumb items={breadcrumbs} />
          </div>

          {/* Mobile Title */}
          <h1 className="sm:hidden text-base font-bold text-gray-900 dark:text-white">
            {breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard'}
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          {onOpenSearch && (
            <>
              {/* Desktop */}
              <button
                onClick={onOpenSearch}
                className="hidden md:flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100/90 dark:bg-gray-700/60 hover:bg-gray-200/90 dark:hover:bg-gray-600/70 rounded-full transition-all duration-300 group border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md"
                title="Buscar (⌘K)"
              >
                <MagnifyingGlassIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden lg:inline font-medium">Buscar...</span>
                <kbd className="hidden xl:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile */}
              <button
                onClick={onOpenSearch}
                className="md:hidden p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-700/80 shadow-sm hover:shadow-md"
                title="Buscar"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 group"
              title="Cambiar tema"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <MoonIcon className="h-5 w-5 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>
          )}

          {/* Notifications */}
          {notifications.length > 0 && (
            <Menu as="div" className="relative">
              <Menu.Button className="relative p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 group">
                <BellIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full shadow-lg shadow-red-600/50" />
                )}
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 focus:outline-none overflow-hidden backdrop-blur-xl z-50">
                  <div className="p-3">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BellIcon className="h-4 w-4" />
                        Notificaciones
                      </h3>
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-sm">
                          {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <Menu.Item key={notification.id}>
                          {({ active }) => (
                            <button
                              className={cn(
                                'w-full px-3 py-3 text-left transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-0 rounded-lg my-1',
                                active && 'bg-gray-50 dark:bg-gray-700/50 scale-[0.98]',
                                !notification.read &&
                                  'bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10'
                              )}
                            >
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <div
                                    className={cn(
                                      'p-1.5 rounded-lg',
                                      notification.type === 'success' &&
                                        'bg-green-100 dark:bg-green-900/30',
                                      notification.type === 'warning' &&
                                        'bg-yellow-100 dark:bg-yellow-900/30',
                                      notification.type === 'info' &&
                                        'bg-blue-100 dark:bg-blue-900/30',
                                      notification.type === 'danger' &&
                                        'bg-red-100 dark:bg-red-900/30'
                                    )}
                                  >
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                    {notification.time}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="flex-shrink-0 mt-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full shadow-lg shadow-blue-600/50 animate-pulse" />
                                  </div>
                                )}
                              </div>
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                      <button className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 group">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              )}
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.name}
              </span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 focus:outline-none overflow-hidden backdrop-blur-xl z-50">
                <div className="p-2">
                  {/* User Info Header */}
                  <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <UserCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {user.email}
                      </p>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {onGoToProfile && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={onGoToProfile}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200',
                              active
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                : 'text-gray-700 dark:text-gray-300'
                            )}
                          >
                            <UserIcon className="h-5 w-5" />
                            Mi Perfil
                          </button>
                        )}
                      </Menu.Item>
                    )}

                    {onGoToSettings && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={onGoToSettings}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200',
                              active
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                : 'text-gray-700 dark:text-gray-300'
                            )}
                          >
                            <Cog6ToothIcon className="h-5 w-5" />
                            Configuración
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </div>

                  {/* Logout Button */}
                  {onLogout && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-1 pb-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={onLogout}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200',
                              active
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                : 'text-gray-700 dark:text-gray-300'
                            )}
                          >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            Cerrar Sesión
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

AppHeader.displayName = 'AppHeader';
