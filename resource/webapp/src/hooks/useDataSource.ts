/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                    CONFIGURABLE DATA SOURCE HOOK                           ║
 * ║                                                                            ║
 * ║  Hook para gestión de datos desacoplada con soporte para:                ║
 * ║  - Datos desde API (con mapeo configurable)                              ║
 * ║  - Datos estáticos/mock                                                   ║
 * ║  - Caché inteligente                                                      ║
 * ║  - Loading, error y estados vacíos                                        ║
 * ║                                                                            ║
 * ║  @author    Farid Maloof Suarez                                           ║
 * ║  @company   FaruTech                                                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import { useState, useMemo, useCallback } from 'react'
import axios, type { AxiosRequestConfig } from 'axios'
import type { DataSourceConfig } from '@/config/applications.config'

// ============================================================================
// TYPES
// ============================================================================

export interface DataSourceState<T> {
  /** Datos obtenidos */
  data: T[]
  
  /** Total de registros (para paginación) */
  total: number
  
  /** Página actual */
  currentPage: number
  
  /** Registros por página */
  perPage: number
  
  /** Está cargando */
  isLoading: boolean
  
  /** Está refrescando */
  isRefetching: boolean
  
  /** Error si existe */
  error: Error | null
  
  /** Estado vacío */
  isEmpty: boolean
  
  /** Refrescar datos */
  refetch: () => void
  
  /** Mutar datos (optimistic update) */
  mutate: (newData: T[]) => void
  
  /** Invalidar caché */
  invalidate: () => void
}

export interface PaginationParams {
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
  search?: string
}

// ============================================================================
// HOOK: useDataSource
// ============================================================================

/**
 * Hook principal para gestión de datos configurables
 */
export function useDataSource<T = any>(
  config: DataSourceConfig,
  params?: PaginationParams,
  options?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'>
): DataSourceState<T> {
  const queryClient = useQueryClient()
  const [localData, setLocalData] = useState<T[]>([])

  // Generar query key única
  const queryKey = useMemo(
    () => ['dataSource', config.endpoint || 'static', params],
    [config.endpoint, params]
  )

  // Función para obtener datos según tipo
  const fetchData = useCallback(async (): Promise<T[]> => {
    if (config.type === 'static' || config.type === 'mock') {
      // Datos estáticos
      return config.staticData || []
    }

    if (config.type === 'api' && config.endpoint) {
      // Datos desde API
      const axiosConfig: AxiosRequestConfig = {
        method: config.method || 'GET',
        url: config.endpoint,
        headers: config.headers,
        params: params
      }

      const response = await axios(axiosConfig)

      // Mapear respuesta si hay configuración de mapeo
      if (config.responseMapper) {
        const { data, total, currentPage, perPage } = config.responseMapper

        return {
          data: data ? getNestedValue(response.data, data) : response.data,
          total: total ? getNestedValue(response.data, total) : undefined,
          currentPage: currentPage ? getNestedValue(response.data, currentPage) : undefined,
          perPage: perPage ? getNestedValue(response.data, perPage) : undefined
        }
      }

      return response.data
    }

    return []
  }, [config, params])

  // Query de React Query
  const query = useQuery({
    queryKey,
    queryFn: fetchData,
    enabled: config.type === 'api',
    staleTime: config.cacheTime || 5 * 60 * 1000, // 5 minutos por defecto
    refetchOnMount: config.revalidateOnMount ?? true,
    ...options
  })

  // Datos finales (API o estáticos)
  const finalData = useMemo(() => {
    if (config.type === 'static' || config.type === 'mock') {
      return config.staticData || []
    }
    return query.data || []
  }, [config.type, config.staticData, query.data])

  // Mutación para actualizar datos localmente (optimistic update)
  const mutateFn = useCallback((newData: T[]) => {
    if (config.type === 'static' || config.type === 'mock') {
      setLocalData(newData)
    } else {
      queryClient.setQueryData(queryKey, newData)
    }
  }, [config.type, queryKey, queryClient])

  // Invalidar caché
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [queryKey, queryClient])

  return {
    data: finalData,
    total: finalData.length,
    currentPage: params?.page || 1,
    perPage: params?.perPage || 10,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    isEmpty: finalData.length === 0,
    refetch: query.refetch,
    mutate: mutateFn,
    invalidate
  }
}

// ============================================================================
// HOOK: useDataSourceMutation
// ============================================================================

export interface DataSourceMutationConfig {
  endpoint: string
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  invalidateQueries?: string[]
}

/**
 * Hook para mutaciones (create, update, delete)
 */
export function useDataSourceMutation<TData = any, TVariables = any>(
  config: DataSourceMutationConfig
) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await axios({
        method: config.method || 'POST',
        url: config.endpoint,
        data: variables,
        headers: config.headers
      })
      return response.data
    },
    onSuccess: (data) => {
      // Invalidar queries relacionados
      if (config.invalidateQueries) {
        config.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] })
        })
      }
      config.onSuccess?.(data)
    },
    onError: (error) => {
      config.onError?.(error)
    }
  })
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Obtiene valor anidado de un objeto usando notación de punto
 * Ejemplo: getNestedValue({ user: { name: 'John' } }, 'user.name') => 'John'
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Filtra datos localmente (para datos estáticos)
 */
export function filterDataLocally<T>(
  data: T[],
  filters?: Record<string, any>,
  searchTerm?: string,
  searchFields?: (keyof T)[]
): T[] {
  let filtered = [...data]

  // Aplicar filtros
  if (filters) {
    filtered = filtered.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === '') return true
        return (item as any)[key] === value
      })
    })
  }

  // Aplicar búsqueda
  if (searchTerm && searchFields && searchFields.length > 0) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter((item) => {
      return searchFields.some((field) => {
        const value = (item as any)[field]
        return String(value).toLowerCase().includes(term)
      })
    })
  }

  return filtered
}

/**
 * Ordena datos localmente
 */
export function sortDataLocally<T>(
  data: T[],
  sortBy?: keyof T,
  sortOrder: 'asc' | 'desc' = 'asc'
): T[] {
  if (!sortBy) return data

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

/**
 * Pagina datos localmente
 */
export function paginateDataLocally<T>(
  data: T[],
  page: number = 1,
  perPage: number = 10
): { data: T[]; total: number; currentPage: number; perPage: number; totalPages: number } {
  const total = data.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    data: data.slice(start, end),
    total,
    currentPage: page,
    perPage,
    totalPages
  }
}

/**
 * Hook completo con filtrado, ordenamiento y paginación local
 */
export function useLocalDataSource<T>(
  data: T[],
  params?: PaginationParams,
  searchFields?: (keyof T)[]
) {
  const [localParams, setLocalParams] = useState<PaginationParams>({
    page: 1,
    perPage: 10,
    sortBy: undefined,
    sortOrder: 'asc',
    filters: {},
    search: '',
    ...params
  })

  const processedData = useMemo(() => {
    let result = [...data]

    // Filtrar
    result = filterDataLocally(result, localParams.filters, localParams.search, searchFields)

    // Ordenar
    result = sortDataLocally(result, localParams.sortBy as keyof T, localParams.sortOrder)

    // Paginar
    return paginateDataLocally(result, localParams.page, localParams.perPage)
  }, [data, localParams, searchFields])

  const updateParams = useCallback((newParams: Partial<PaginationParams>) => {
    setLocalParams((prev) => ({ ...prev, ...newParams }))
  }, [])

  return {
    ...processedData,
    params: localParams,
    updateParams,
    isLoading: false,
    error: null,
    isEmpty: processedData.data.length === 0
  }
}

export default useDataSource
