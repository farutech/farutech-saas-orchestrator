/**
 * Hook personalizado para hacer llamadas a la API con React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'
import type { ApiResponse, ApiError } from '@/types'

interface UseApiQueryOptions<T> extends Omit<UseQueryOptions<ApiResponse<T>, ApiError>, 'queryKey' | 'queryFn'> {
  url: string
  params?: Record<string, any>
}

interface UseApiMutationOptions<TData, TVariables> extends UseMutationOptions<ApiResponse<TData>, ApiError, TVariables> {
  url: string | ((variables: TVariables) => string)
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  invalidateQueries?: string[]
}

/**
 * Hook para peticiones GET con caché
 */
export function useApiQuery<T = any>(
  queryKey: string | string[],
  options: UseApiQueryOptions<T>
) {
  const { url, params, ...queryOptions } = options

  return useQuery<ApiResponse<T>, ApiError>({
    queryKey: Array.isArray(queryKey) ? [...queryKey, params] : [queryKey, params],
    queryFn: () => apiService.get<T>(url, { params }),
    ...queryOptions,
  })
}

/**
 * Hook para mutaciones (POST, PUT, DELETE, PATCH)
 */
export function useApiMutation<TData = any, TVariables = any>(
  options: UseApiMutationOptions<TData, TVariables>
) {
  const queryClient = useQueryClient()
  const { url, method = 'POST', invalidateQueries = [], ...mutationOptions } = options

  return useMutation<ApiResponse<TData>, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const endpoint = typeof url === 'function' ? url(variables) : url

      switch (method) {
        case 'POST':
          return apiService.post<TData>(endpoint, variables)
        case 'PUT':
          return apiService.put<TData>(endpoint, variables)
        case 'DELETE':
          return apiService.delete<TData>(endpoint)
        case 'PATCH':
          return apiService.patch<TData>(endpoint, variables)
        default:
          throw new Error(`Método ${method} no soportado`)
      }
    },
    onSuccess: (data, variables, context, extra) => {
      // Invalidar queries especificadas
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })

      // Llamar al callback original si existe
      mutationOptions.onSuccess?.(data, variables, context, extra)
    },
    ...mutationOptions,
  })
}

/**
 * Hook para subir archivos
 */
export function useUploadFile(
  url: string,
  options?: {
    onProgress?: (progress: number) => void
    onSuccess?: (data: any) => void
    onError?: (error: ApiError) => void
  }
) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<any>, ApiError, FormData>({
    mutationFn: (formData) => apiService.upload(url, formData, options?.onProgress),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
