// ============================================================================
// DASHBOARD SIDEBAR - Dynamic Menu from MPs
// ============================================================================

import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useSidebarStore } from '../store/sidebarStore';
import { useMenuStore } from '../store/menuStore';
import clsx from 'clsx';

export const DashboardSidebar: React.FC = () => {
  const { isOpen, isMobile, close, sidebarWidth } = useSidebarStore();
  const { menuStructure } = useMenuStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['crm', 'ventas']) // Expandidos por defecto
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  if (!isOpen && !isMobile) {
    return (
      <aside
        className="fixed left-0 top-14 h-[calc(100vh-56px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm z-30 transition-all duration-500"
        style={{ width: '63px' }}
      >
        <div className="flex flex-col items-center gap-4 p-3">
          {menuStructure.categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => {}}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={category.name}
              >
                {Icon && <Icon className="h-5 w-5" />}
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: isMobile ? '280px' : `${sidebarWidth}px` }}
        className={clsx(
          'fixed top-14 h-[calc(100vh-56px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-40 transition-all duration-500 overflow-y-auto',
          isMobile && !isOpen && '-left-full',
          isMobile && isOpen && 'left-0'
        )}
      >
        {/* Header Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Menú
          </h2>
          {isMobile && (
            <button
              onClick={close}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Menu Categories */}
        <nav className="p-3 space-y-2">
          {menuStructure.categories.map(category => {
            const isExpanded = expandedCategories.has(category.id);
            const Icon = category.icon;

            return (
              <div key={category.id} className="overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 uppercase tracking-wider group"
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && (
                      <Icon className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    )}
                    <span>{category.name}</span>
                  </div>
                  <ChevronRightIcon
                    className={clsx(
                      'h-3.5 w-3.5 transition-all duration-300',
                      isExpanded
                        ? 'rotate-90 text-primary-600 dark:text-primary-400'
                        : 'text-gray-400'
                    )}
                  />
                </button>

                {/* Category Items */}
                <div
                  className={clsx(
                    'overflow-hidden transition-all duration-300',
                    isExpanded
                      ? 'max-h-96 opacity-100 mt-1'
                      : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="ml-4 space-y-0.5">
                    {category.items.map(item => {
                      const ItemIcon = item.icon;
                      return (
                        <NavLink
                          key={item.id}
                          to={item.href}
                          className={({ isActive }) =>
                            clsx(
                              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group',
                              isActive
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:translate-x-0.5'
                            )
                          }
                          onClick={() => isMobile && close()}
                        >
                          {ItemIcon && (
                            <ItemIcon className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                          )}
                          <span>{item.name}</span>
                          {item.badge !== undefined && (
                            <span className="ml-auto inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Farutech Dashboard v1.0
          </p>
        </div>
      </aside>
    </>
  );
};

DashboardSidebar.displayName = 'DashboardSidebar';
