/**
 * useDataTableState - Hook para manejar el estado independiente de cada DataTable
 * 
 * Este hook encapsula toda la lógica de estado de una tabla (paginación, selección, búsqueda, etc.)
 * garantizando que cada instancia de tabla tenga su propio estado independiente.
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   const table1 = useDataTableState({ initialPerPage: 10 })
 *   const table2 = useDataTableState({ initialPerPage: 5 })
 *   
 *   return (
 *     <>
 *       <DataTable {...table1.getTableProps()} data={data1} columns={columns1} />
 *       <DataTable {...table2.getTableProps()} data={data2} columns={columns2} />
 *     </>
 *   )
 * }
 * ```
 */

import { useState } from 'react'

export interface UseDataTableStateOptions {
  /** Página inicial (default: 1) */
  initialPage?: number
  /** Elementos por página inicial (default: 10) */
  initialPerPage?: number
  /** Habilitar selección (default: false) */
  selectable?: boolean
  /** Habilitar búsqueda (default: false) */
  searchable?: boolean
  /** Valor inicial de búsqueda */
  initialSearch?: string
}

export interface UseDataTableStateReturn {
  /** Página actual */
  page: number
  /** Elementos por página */
  perPage: number
  /** IDs de filas seleccionadas */
  selectedRows: Set<string | number>
  /** Valor de búsqueda */
  searchValue: string
  /** Cambiar página */
  setPage: (page: number) => void
  /** Cambiar elementos por página */
  setPerPage: (perPage: number) => void
  /** Cambiar selección */
  setSelectedRows: (selected: Set<string | number>) => void
  /** Cambiar búsqueda */
  setSearch: (search: string) => void
  /** Limpiar selección */
  clearSelection: () => void
  /** Limpiar búsqueda */
  clearSearch: () => void
  /** Resetear todo el estado */
  reset: () => void
  /** Props para pasar al DataTable */
  getTableProps: () => {
    searchable?: boolean
    searchValue?: string
    onSearch?: (value: string) => void
    selectable?: boolean
    selectedRows?: Set<string | number>
    onSelectionChange?: (selected: Set<string | number>) => void
    pagination?: {
      page: number
      perPage: number
      onPageChange: (page: number) => void
      onPerPageChange: (perPage: number) => void
    }
  }
  /** Función helper para filtrar datos por búsqueda */
  filterData: <T extends Record<string, any>>(
    data: T[],
    searchableFields: (keyof T)[]
  ) => T[]
  /** Función helper para paginar datos */
  paginateData: <T>(data: T[]) => T[]
}

/**
 * Hook para manejar el estado de un DataTable
 */
export function useDataTableState(
  options: UseDataTableStateOptions = {}
): UseDataTableStateReturn {
  const {
    initialPage = 1,
    initialPerPage = 10,
    selectable = false,
    searchable = false,
    initialSearch = '',
  } = options

  const [page, setPage] = useState(initialPage)
  const [perPage, setPerPage] = useState(initialPerPage)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [searchValue, setSearch] = useState(initialSearch)

  const clearSelection = () => setSelectedRows(new Set())
  const clearSearch = () => setSearch('')

  const reset = () => {
    setPage(initialPage)
    setPerPage(initialPerPage)
    clearSelection()
    clearSearch()
  }

  const filterData = <T extends Record<string, any>>(
    data: T[],
    searchableFields: (keyof T)[]
  ): T[] => {
    if (!searchValue) return data

    const searchLower = searchValue.toLowerCase()
    return data.filter((item) =>
      searchableFields.some((field) => {
        const value = item[field]
        if (value == null) return false
        return String(value).toLowerCase().includes(searchLower)
      })
    )
  }

  const paginateData = <T,>(data: T[]): T[] => {
    const start = (page - 1) * perPage
    return data.slice(start, start + perPage)
  }

  const getTableProps = () => {
    const props: ReturnType<UseDataTableStateReturn['getTableProps']> = {}

    if (searchable) {
      props.searchable = true
      props.searchValue = searchValue
      props.onSearch = setSearch
    }

    if (selectable) {
      props.selectable = true
      props.selectedRows = selectedRows
      props.onSelectionChange = setSelectedRows
    }

    // Siempre incluir paginación si se quiere control
    props.pagination = {
      page,
      perPage,
      onPageChange: setPage,
      onPerPageChange: setPerPage,
    }

    return props
  }

  return {
    page,
    perPage,
    selectedRows,
    searchValue,
    setPage,
    setPerPage,
    setSelectedRows,
    setSearch,
    clearSelection,
    clearSearch,
    reset,
    getTableProps,
    filterData,
    paginateData,
  }
}
