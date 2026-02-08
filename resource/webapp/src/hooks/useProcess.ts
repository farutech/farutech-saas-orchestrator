/**
 * Hook para ejecutar procesos especiales y conectar con otras APIs
 * Permite ejecutar endpoints personalizados con monitoreo de estado
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'
import type { Process, ProcessExecution } from '@/types'
import { ENDPOINTS } from '../config/api.config'

interface ExecuteProcessParams {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  params?: Record<string, any>
}

export function useProcess() {
  const queryClient = useQueryClient()

  /**
   * Listar procesos disponibles
   */
  const useProcessList = () => {
    return useQuery<Process[]>({
      queryKey: ['processes', 'list'],
      queryFn: async () => {
        const response = await apiService.get<Process[]>(ENDPOINTS.processes.list)
        return response.data
      },
      staleTime: 1000 * 60 * 10, // 10 minutos
    })
  }

  /**
   * Ejecutar un proceso especial
   */
  const useExecuteProcess = () => {
    return useMutation({
      mutationFn: async (params: ExecuteProcessParams) => {
        const { endpoint, method = 'POST', data, params: queryParams } = params

        let response
        switch (method) {
          case 'GET':
            response = await apiService.get(endpoint, { params: queryParams })
            break
          case 'POST':
            response = await apiService.post(endpoint, data)
            break
          case 'PUT':
            response = await apiService.put(endpoint, data)
            break
          case 'DELETE':
            response = await apiService.delete(endpoint)
            break
          default:
            throw new Error(`Método ${method} no soportado`)
        }

        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['processes', 'history'] })
      },
    })
  }

  /**
   * Obtener estado de un proceso en ejecución
   */
  const useProcessStatus = (processId: string | number | null, enabled = true) => {
    return useQuery<ProcessExecution>({
      queryKey: ['processes', 'status', processId],
      queryFn: async () => {
        if (!processId) throw new Error('Process ID is required')
        const response = await apiService.get<ProcessExecution>(
          ENDPOINTS.processes.status(processId)
        )
        return response.data
      },
      enabled: enabled && !!processId,
      refetchInterval: (query) => {
        const data = query.state.data
        // Refetch cada 2 segundos si está en ejecución
        return data?.status === 'running' ? 2000 : false
      },
    })
  }

  /**
   * Obtener historial de procesos ejecutados
   */
  const useProcessHistory = (filters?: { limit?: number; processId?: string | number }) => {
    return useQuery<ProcessExecution[]>({
      queryKey: ['processes', 'history', filters],
      queryFn: async () => {
        const response = await apiService.get<ProcessExecution[]>(
          ENDPOINTS.processes.history,
          { params: filters }
        )
        return response.data
      },
    })
  }

  /**
   * Hook combinado para ejecutar y monitorear
   */
  const useExecuteAndMonitor = () => {
    const executeMutation = useExecuteProcess()
    const [currentProcessId, setCurrentProcessId] = React.useState<string | number | null>(null)
    
    const { data: status } = useProcessStatus(
      currentProcessId,
      !!currentProcessId && executeMutation.isSuccess
    )

    const execute = async (params: ExecuteProcessParams) => {
      const result = await executeMutation.mutateAsync(params)
      if (result?.id) {
        setCurrentProcessId(result.id)
      }
      return result
    }

    return {
      execute,
      status,
      isExecuting: executeMutation.isPending,
      isMonitoring: !!currentProcessId && status?.status === 'running',
      error: executeMutation.error,
      reset: () => {
        setCurrentProcessId(null)
        executeMutation.reset()
      },
    }
  }

  return {
    useProcessList,
    useExecuteProcess,
    useProcessStatus,
    useProcessHistory,
    useExecuteAndMonitor,
  }
}

// Para usar en componentes
import React from 'react'

/**
 * Ejemplo de uso:
 * 
 * const { useExecuteProcess, useProcessStatus } = useProcess()
 * const execute = useExecuteProcess()
 * 
 * const handleExecute = () => {
 *   execute.mutate({
 *     endpoint: '/api/custom-process',
 *     method: 'POST',
 *     data: { param1: 'value1' }
 *   })
 * }
 * 
 * // Con monitoreo:
 * const { execute, status, isExecuting } = useExecuteAndMonitor()
 * 
 * await execute({
 *   endpoint: '/api/long-running-process',
 *   method: 'POST'
 * })
 * 
 * // status se actualizará automáticamente
 */
