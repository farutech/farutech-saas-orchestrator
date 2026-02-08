/**
 * Tabla CRUD reutilizable con acciones
 */

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface CrudTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  isLoading?: boolean
  onRowClick?: (row: T) => void
  emptyMessage?: string
  selectable?: boolean
  selectedRows?: Set<string | number>
  onSelectionChange?: (selected: Set<string | number>) => void
  /** Mostrar vista en cards para pantallas pequeñas (mobile) */
  responsiveCards?: boolean
}

export function CrudTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  emptyMessage = 'No hay datos disponibles',
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  responsiveCards = true,
}: CrudTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    
    if (selectedRows.size === data.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(data.map((row) => row.id)))
    }
  }

  const handleSelectRow = (id: string | number) => {
    if (!onSelectionChange) return
    
    const newSelection = new Set(selectedRows)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    onSelectionChange(newSelection)
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Tabla para pantallas medianas en adelante */}
      <div className={responsiveCards ? 'hidden md:block overflow-x-auto' : 'overflow-x-auto'}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {selectable && (
                <th className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={clsx(
                        'flex items-center gap-2',
                        header.column.getCanSort() && 'cursor-pointer select-none'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="flex flex-col">
                          <ChevronUpIcon
                            className={clsx(
                              'h-3 w-3',
                              header.column.getIsSorted() === 'asc'
                                ? 'text-primary-600'
                                : 'text-gray-400'
                            )}
                          />
                          <ChevronDownIcon
                            className={clsx(
                              'h-3 w-3 -mt-1',
                              header.column.getIsSorted() === 'desc'
                                ? 'text-primary-600'
                                : 'text-gray-400'
                            )}
                          />
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={clsx(
                'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(row.original)}
            >
              {selectable && (
                <td className="px-6 py-4 w-12" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.original.id)}
                    onChange={() => handleSelectRow(row.original.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
              )}
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Vista tipo 'cards' para pantallas pequeñas */}
      {responsiveCards && (
        <div className="md:hidden space-y-3">
          {table.getRowModel().rows.map((row) => {
            const actionCell = row.getVisibleCells().find((c) => c.column.id === 'actions' || (c.column.columnDef as any).id === 'actions')
            return (
              <div
                key={row.id}
                className={clsx(
                  'p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm',
                  'hover:shadow-md transition-shadow',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row.original)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {row.getVisibleCells().map((cell) => (
                      <div key={cell.id} className="mb-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {typeof cell.column.columnDef.header === 'string'
                            ? (cell.column.columnDef.header as any)
                            : cell.column.id}
                        </div>
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectable && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.original.id)}
                        onChange={() => handleSelectRow(row.original.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                  )}
                </div>

                {actionCell && (
                  <div className="mt-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
                    {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
