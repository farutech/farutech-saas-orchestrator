/**
 * CommandPalette - Búsqueda global tipo Spotlight con atajo de teclado
 * 
 * Características:
 * - ✅ Atajo de teclado: Ctrl+K / Cmd+K
 * - ✅ Búsqueda de páginas, acciones, usuarios, etc.
 * - ✅ Navegación por teclado (arriba/abajo, Enter)
 * - ✅ Grupos de resultados (Páginas, Acciones, Recientes)
 * - ✅ Comandos custom
 * - ✅ Diseño tipo Vercel/Linear/GitHub
 * 
 * @example
 * ```tsx
 * const commands = [
 *   { id: '1', title: 'Dashboard', group: 'Páginas', action: () => navigate('/dashboard'), icon: <HomeIcon /> },
 *   { id: '2', title: 'Crear Usuario', group: 'Acciones', action: () => createUser(), icon: <PlusIcon /> }
 * ]
 * 
 * <CommandPalette commands={commands} />
 * ```
 */

import { Fragment, useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { Dialog, Combobox, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export interface Command {
  /** ID único */
  id: string
  /** Título del comando */
  title: string
  /** Descripción opcional */
  description?: string
  /** Grupo (Páginas, Acciones, etc.) */
  group?: string
  /** Ícono */
  icon?: ReactNode
  /** Acción al ejecutar */
  action: () => void
  /** Keywords para búsqueda */
  keywords?: string[]
  /** Atajo de teclado (para mostrar) */
  shortcut?: string
}

export interface CommandPaletteProps {
  /** Lista de comandos disponibles */
  commands: Command[]
  /** Comandos recientes (IDs) */
  recentCommands?: string[]
  /** Placeholder de búsqueda */
  placeholder?: string
  /** Clase CSS adicional */
  className?: string
}

/**
 * Componente CommandPalette
 */
export function CommandPalette({
  commands,
  recentCommands = [],
  placeholder = 'Buscar o ejecutar un comando...',
  className,
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  // Manejar atajo de teclado
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filtrar comandos por búsqueda
  const filteredCommands = useMemo(() => {
    if (!query) {
      // Sin búsqueda, mostrar recientes primero
      const recent = commands.filter((cmd) => recentCommands.includes(cmd.id))
      const others = commands.filter((cmd) => !recentCommands.includes(cmd.id))
      return [...recent, ...others]
    }

    const lowerQuery = query.toLowerCase()

    return commands.filter((command) => {
      const titleMatch = command.title.toLowerCase().includes(lowerQuery)
      const descMatch = command.description?.toLowerCase().includes(lowerQuery)
      const keywordsMatch = command.keywords?.some((k) => k.toLowerCase().includes(lowerQuery))

      return titleMatch || descMatch || keywordsMatch
    })
  }, [query, commands, recentCommands])

  // Agrupar comandos
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {}

    filteredCommands.forEach((command) => {
      const group = command.group || 'Otros'
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(command)
    })

    return Object.entries(groups)
  }, [filteredCommands])

  const handleSelect = (command: Command) => {
    setIsOpen(false)
    setQuery('')
    command.action()
  }

  return (
    <>
      {/* Trigger Button (opcional, para mostrar el atajo) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={clsx(
          'group relative flex h-9 w-full items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-400 transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500',
          className
        )}
      >
        <MagnifyingGlassIcon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left">Buscar...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 px-1.5 font-mono text-xs font-medium text-gray-500 dark:text-gray-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <Transition.Root show={isOpen} as={Fragment} afterLeave={() => setQuery('')}>
        <Dialog as="div" className="relative z-[100]" onClose={setIsOpen}>
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

          <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <Combobox<Command> onChange={(command) => command && handleSelect(command)}>
                  {/* Search Input */}
                  <div className="relative">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Combobox.Input
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      placeholder={placeholder}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>

                  {/* Results */}
                  {filteredCommands.length > 0 && (
                    <Combobox.Options
                      static
                      className="max-h-96 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800 dark:text-gray-200"
                    >
                      {groupedCommands.map(([group, commands]) => (
                        <div key={group}>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {group}
                          </div>
                          {commands.map((command) => (
                            <Combobox.Option
                              key={command.id}
                              value={command}
                              className={({ active }) =>
                                clsx(
                                  'flex cursor-pointer select-none items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors',
                                  active
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-900 dark:text-white'
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  {/* Icon */}
                                  {command.icon && (
                                    <div
                                      className={clsx(
                                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                                        active
                                          ? 'bg-primary-100 dark:bg-primary-900/40'
                                          : 'bg-gray-100 dark:bg-gray-700'
                                      )}
                                    >
                                      <span className="h-4 w-4">{command.icon}</span>
                                    </div>
                                  )}

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{command.title}</div>
                                    {command.description && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {command.description}
                                      </div>
                                    )}
                                  </div>

                                  {/* Shortcut */}
                                  {command.shortcut && (
                                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 px-1.5 font-mono text-xs font-medium text-gray-500 dark:text-gray-400">
                                      {command.shortcut}
                                    </kbd>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </div>
                      ))}
                    </Combobox.Options>
                  )}

                  {/* Empty State */}
                  {query !== '' && filteredCommands.length === 0 && (
                    <div className="px-6 py-14 text-center text-sm sm:px-14">
                      <p className="text-gray-900 dark:text-white font-semibold">No se encontraron resultados</p>
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        No pudimos encontrar nada con ese término. Intenta con otra búsqueda.
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1">
                        <kbd className="rounded bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 font-mono">↑↓</kbd>
                        Navegar
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="rounded bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 font-mono">↵</kbd>
                        Seleccionar
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 font-mono">Esc</kbd>
                      Cerrar
                    </span>
                  </div>
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

/**
 * Hook para usar CommandPalette globalmente
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  }
}
