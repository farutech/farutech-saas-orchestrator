/**
 * Componente para ejecutar procesos especiales
 */

import { useState } from 'react'
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid'
import { Button } from '../ui/Button'
import { Card, CardHeader } from '../ui/Card'
import { Input } from '../ui/Input'
// import { Select } from '../ui/Select'
import type { Process } from '@/types'
import { useProcess } from '@/hooks/useProcess'
import { notify } from '@/store/notificationStore'
import clsx from 'clsx'

interface ProcessRunnerProps {
  process: Process
  onComplete?: (result: any) => void
}

export function ProcessRunner({ process, onComplete }: ProcessRunnerProps) {
  const { useExecuteAndMonitor } = useProcess()
  const { execute, status, isExecuting, isMonitoring, error, reset } = useExecuteAndMonitor()
  
  const [params, setParams] = useState<Record<string, any>>(process.params || {})

  const handleExecute = async () => {
    try {
      const result = await execute({
        endpoint: process.endpoint,
        method: process.method,
        data: params,
      })

      notify.success('Proceso iniciado', 'El proceso se está ejecutando')
      
      if (!isMonitoring) {
        onComplete?.(result)
      }
    } catch (err: any) {
      notify.error('Error', err.message || 'No se pudo ejecutar el proceso')
    }
  }

  const handleParamChange = (key: string, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-600 dark:text-blue-400'
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <CardHeader
          title={process.name}
          subtitle={process.description}
          action={
            <div className="flex items-center gap-2">
              {status && (
                <span className={clsx('text-sm font-medium', getStatusColor(status.status))}>
                  {status.status === 'running' && 'Ejecutando...'}
                  {status.status === 'success' && 'Completado'}
                  {status.status === 'error' && 'Error'}
                </span>
              )}
              
              {isMonitoring ? (
                <Button
                  size="sm"
                  variant="danger"
                  icon={<StopIcon className="h-4 w-4" />}
                  onClick={reset}
                >
                  Detener
                </Button>
              ) : (
                <Button
                  size="sm"
                  icon={<PlayIcon className="h-4 w-4" />}
                  onClick={handleExecute}
                  loading={isExecuting}
                  disabled={isExecuting}
                >
                  Ejecutar
                </Button>
              )}
            </div>
          }
        />

        {/* Parameters */}
        {Object.keys(process.params || {}).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Parámetros
            </h4>
            {Object.entries(process.params || {}).map(([key, defaultValue]) => (
              <Input
                key={key}
                label={key}
                value={params[key] || defaultValue}
                onChange={(e) => handleParamChange(key, e.target.value)}
                disabled={isExecuting || isMonitoring}
              />
            ))}
          </div>
        )}

        {/* Progress indicator */}
        {isMonitoring && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progreso</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {status?.status === 'running' ? 'En proceso...' : 'Procesando...'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full animate-pulse w-full" />
            </div>
          </div>
        )}

        {/* Result */}
        {status?.result && status.status === 'success' && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
              Resultado
            </h4>
            <pre className="text-xs text-green-800 dark:text-green-200 overflow-x-auto">
              {JSON.stringify(status.result, null, 2)}
            </pre>
          </div>
        )}

        {/* Error */}
        {(error || status?.error) && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
              Error
            </h4>
            <p className="text-sm text-red-800 dark:text-red-200">
              {error?.message || status?.error}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
