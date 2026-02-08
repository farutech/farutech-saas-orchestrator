/**
 * Componente de acciones CRUD (editar, eliminar, ver)
 */

import { Menu } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/solid'
import clsx from 'clsx'
import type { ReactNode } from 'react'

interface Action {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
  show?: boolean
}

interface CrudActionsProps {
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  onDuplicate?: () => void
  customActions?: Action[]
}

export function CrudActions({
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  customActions = [],
}: CrudActionsProps) {
  const defaultActions: Action[] = [
    onView && {
      label: 'Ver detalles',
      icon: <EyeIcon className="h-4 w-4" />,
      onClick: onView,
      show: true,
    },
    onEdit && {
      label: 'Editar',
      icon: <PencilIcon className="h-4 w-4" />,
      onClick: onEdit,
      show: true,
    },
    onDuplicate && {
      label: 'Duplicar',
      icon: <DocumentDuplicateIcon className="h-4 w-4" />,
      onClick: onDuplicate,
      show: true,
    },
    onDelete && {
      label: 'Eliminar',
      icon: <TrashIcon className="h-4 w-4" />,
      onClick: onDelete,
      variant: 'danger' as const,
      show: true,
    },
  ].filter(Boolean) as Action[]

  const allActions = [...defaultActions, ...customActions].filter((action) => action.show !== false)

  if (allActions.length === 0) return null

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        <EllipsisVerticalIcon className="h-5 w-5" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-[100] mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {allActions.map((action, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    action.onClick()
                  }}
                  className={clsx(
                    'flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors',
                    active && 'bg-gray-100 dark:bg-gray-700',
                    action.variant === 'danger'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  {action.icon}
                  {action.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  )
}
