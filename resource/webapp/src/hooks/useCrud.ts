/**
 * Hook genérico para operaciones CRUD
 * Reutilizable para cualquier entidad
 */

import { useApiQuery, useApiMutation } from './useApi'
import type { PaginatedResponse } from '@/types'

interface UseCrudOptions {
  endpoint: string
  queryKey: string
  enableList?: boolean
  enableGet?: boolean
}

interface CrudParams {
  page?: number
  perPage?: number
  search?: string
  filters?: Record<string, any>
  sort?: string
  order?: 'asc' | 'desc'
}

export function useCrud<T = any>(options: UseCrudOptions) {
  const { endpoint, queryKey, enableList = true, enableGet = false } = options

  /**
   * Listar con paginación, búsqueda y filtros
   */
  const useList = (params?: CrudParams) => {
    return useApiQuery<PaginatedResponse<T>>([queryKey, 'list'], {
      url: endpoint,
      params,
      enabled: enableList,
      staleTime: 1000 * 60 * 5, // 5 minutos
    })
  }

  /**
   * Obtener uno por ID
   */
  const useGet = (id: string | number, enabled = true) => {
    return useApiQuery<T>([queryKey, 'detail', String(id)], {
      url: `${endpoint}/${id}`,
      enabled: enableGet && enabled && !!id,
    })
  }

  /**
   * Crear
   */
  const useCreate = () => {
    return useApiMutation<T, Partial<T>>({
      url: endpoint,
      method: 'POST',
      invalidateQueries: [queryKey],
    })
  }

  /**
   * Actualizar
   */
  const useUpdate = () => {
    return useApiMutation<T, { id: string | number; data: Partial<T> }>({
      url: ({ id }) => `${endpoint}/${id}`,
      method: 'PUT',
      invalidateQueries: [queryKey],
    })
  }

  /**
   * Eliminar
   */
  const useDelete = () => {
    return useApiMutation<void, string | number>({
      url: (id) => `${endpoint}/${id}`,
      method: 'DELETE',
      invalidateQueries: [queryKey],
    })
  }

  /**
   * Eliminar múltiples
   */
  const useBulkDelete = () => {
    return useApiMutation<void, (string | number)[]>({
      url: `${endpoint}/bulk-delete`,
      method: 'POST',
      invalidateQueries: [queryKey],
    })
  }

  return {
    useList,
    useGet,
    useCreate,
    useUpdate,
    useDelete,
    useBulkDelete,
  }
}

/**
 * Ejemplo de uso:
 * 
 * const userCrud = useCrud<User>({ 
 *   endpoint: '/users', 
 *   queryKey: 'users' 
 * })
 * 
 * const { data: users, isLoading } = userCrud.useList({ page: 1, perPage: 10 })
 * const createUser = userCrud.useCreate()
 * const updateUser = userCrud.useUpdate()
 * const deleteUser = userCrud.useDelete()
 */
