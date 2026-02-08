/**
 * Componente Breadcrumb - Navegación de migas de pan
 */

import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: 'chevron' | 'slash' | 'dot'
  showHome?: boolean
}

export function Breadcrumb({ 
  items, 
  className, 
  separator = 'chevron',
  showHome = true 
}: BreadcrumbProps) {
  const allItems = showHome 
    ? [{ label: 'Inicio', href: '/', icon: HomeIcon }, ...items]
    : items

  const Separator = () => {
    switch (separator) {
      case 'slash':
        return <span className="text-gray-400 dark:text-gray-500 mx-2">/</span>
      case 'dot':
        return <span className="text-gray-400 dark:text-gray-500 mx-2">•</span>
      default:
        return <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-2" />
    }
  }

  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center', className)}>
      <ol className="flex items-center space-x-0">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const ItemIcon = item.icon

          return (
            <li key={index} className="flex items-center">
              {index > 0 && <Separator />}
              
              {isLast || !item.href ? (
                <span
                  className={clsx(
                    'flex items-center gap-1.5 text-sm font-semibold',
                    isLast 
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {ItemIcon && <ItemIcon className="h-4 w-4" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className={clsx(
                    'flex items-center gap-1.5 text-sm font-medium transition-colors duration-200',
                    'text-gray-600 dark:text-gray-400',
                    'hover:text-primary-600 dark:hover:text-primary-400',
                    'hover:underline'
                  )}
                >
                  {ItemIcon && <ItemIcon className="h-4 w-4" />}
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
