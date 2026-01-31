import { useState, useMemo } from 'react';
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

export interface UseDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageSize?: number;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  globalFilterFn?: string;
}

export interface UseDataTableReturn<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  sorting: SortingState;
  setSorting: (value: SortingState) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (value: ColumnFiltersState) => void;
  columnVisibility: VisibilityState;
  setColumnVisibility: (value: VisibilityState) => void;
  rowSelection: RowSelectionState;
  setRowSelection: (value: RowSelectionState) => void;
  selectedRows: TData[];
  pageSize: number;
  setPageSize: (size: number) => void;
  pageIndex: number;
  setPageIndex: (index: number) => void;
  totalRows: number;
  totalPages: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  resetSelection: () => void;
  resetFilters: () => void;
  resetSorting: () => void;
}

export function useDataTable<TData>({
  data,
  columns,
  pageSize = 10,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableRowSelection = false,
  enableColumnVisibility = true,
  globalFilterFn = 'includesString',
}: UseDataTableOptions<TData>): UseDataTableReturn<TData> {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
    ...(enableFiltering && { getFilteredRowModel: getFilteredRowModel() }),
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    onColumnVisibilityChange: enableColumnVisibility ? setColumnVisibility : undefined,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFn as any,
    state: {
      sorting: enableSorting ? sorting : [],
      columnFilters: enableFiltering ? columnFilters : [],
      columnVisibility: enableColumnVisibility ? columnVisibility : {},
      rowSelection: enableRowSelection ? rowSelection : {},
      globalFilter,
    },
    initialState: {
      pagination: { pageSize },
    },
  });

  const selectedRows = useMemo(() => {
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  }, [table]);

  const resetSelection = () => setRowSelection({});
  const resetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter('');
  };
  const resetSorting = () => setSorting([]);

  return {
    table,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    selectedRows,
    pageSize: table.getState().pagination.pageSize,
    setPageSize: (size: number) => table.setPageSize(size),
    pageIndex: table.getState().pagination.pageIndex,
    setPageIndex: (index: number) => table.setPageIndex(index),
    totalRows: table.getFilteredRowModel().rows.length,
    totalPages: table.getPageCount(),
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
    resetSelection,
    resetFilters,
    resetSorting,
  };
}