/**
 * Componente Tabs - Navegación por pestañas
 */

import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  content: ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'line' | 'pills' | 'enclosed'
  className?: string
}

export function Tabs({ 
  tabs, 
  defaultTab, 
  onChange,
  variant = 'line',
  className 
}: TabsProps) {
  const defaultIndex = defaultTab 
    ? tabs.findIndex(tab => tab.id === defaultTab) 
    : 0

  return (
    <Tab.Group 
      defaultIndex={defaultIndex >= 0 ? defaultIndex : 0}
      onChange={(index) => onChange?.(tabs[index].id)}
    >
      <div className={className}>
        {/* Tab List */}
        <Tab.List
          className={clsx(
            'flex',
            variant === 'line' && 'border-b border-gray-200 dark:border-gray-700 gap-4',
            variant === 'pills' && 'gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl',
            variant === 'enclosed' && 'border-b border-gray-200 dark:border-gray-700 gap-0'
          )}
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <Tab
                key={tab.id}
                disabled={tab.disabled}
                className={({ selected }) =>
                  clsx(
                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    variant === 'line' && [
                      selected
                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent',
                      '-mb-px',
                    ],
                    variant === 'pills' && [
                      'rounded-lg',
                      selected
                        ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50',
                    ],
                    variant === 'enclosed' && [
                      'border border-transparent',
                      selected
                        ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-gray-200 dark:border-gray-700 border-b-white dark:border-b-gray-800 rounded-t-lg -mb-px'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
                    ]
                  )
                }
              >
                {TabIcon && <TabIcon className="h-5 w-5" />}
                {tab.label}
              </Tab>
            )
          })}
        </Tab.List>

        {/* Tab Panels */}
        <Tab.Panels className="mt-4">
          {tabs.map((tab) => (
            <Tab.Panel
              key={tab.id}
              className={clsx(
                'rounded-xl p-4',
                'focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </Tab.Group>
  )
}
