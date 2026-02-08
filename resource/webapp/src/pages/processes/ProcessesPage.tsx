/**
 * Página de Procesos Especiales
 */

import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { ProcessRunner } from '@/components/process/ProcessRunner'
import type { Process } from '@/types'

// Procesos de ejemplo
const exampleProcesses: Process[] = [
  {
    id: 1,
    name: 'Sincronización de Datos',
    description: 'Sincroniza datos con el sistema externo',
    endpoint: '/api/sync/data',
    method: 'POST',
    params: {
      source: 'external_system',
      force: false,
    },
  },
  {
    id: 2,
    name: 'Generación de Reportes',
    description: 'Genera reportes mensuales automáticamente',
    endpoint: '/api/reports/generate',
    method: 'POST',
    params: {
      period: 'monthly',
      format: 'pdf',
    },
  },
  {
    id: 3,
    name: 'Limpieza de Base de Datos',
    description: 'Elimina registros antiguos y optimiza la base de datos',
    endpoint: '/api/maintenance/cleanup',
    method: 'POST',
    params: {
      days: 30,
      optimize: true,
    },
  },
  {
    id: 4,
    name: 'Respaldo Automático',
    description: 'Crea un respaldo completo del sistema',
    endpoint: '/api/backup/create',
    method: 'POST',
    params: {
      type: 'full',
      compress: true,
    },
  },
]

export function ProcessesPage() {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Procesos Especiales
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Ejecuta procesos personalizados y conecta con APIs externas
        </p>
      </div>

      {/* Info Card */}
      <Card>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Cómo usar
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
            <li>Selecciona un proceso de la lista</li>
            <li>Ajusta los parámetros según sea necesario</li>
            <li>Haz clic en "Ejecutar" para iniciar el proceso</li>
            <li>El sistema monitoreará el progreso automáticamente</li>
          </ul>
        </div>
      </Card>

      {/* Process List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exampleProcesses.map((process) => (
          <Card
            key={process.id}
            hover
            className="cursor-pointer"
            onClick={() => setSelectedProcess(process)}
          >
            <CardHeader
              title={process.name}
              subtitle={process.description}
            />
            <div className="mt-4 flex items-center gap-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {process.method}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {process.endpoint}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Process Runner */}
      {selectedProcess && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Ejecutar Proceso
          </h2>
          <ProcessRunner
            process={selectedProcess}
            onComplete={(result) => {
              console.log('Proceso completado:', result)
            }}
          />
        </div>
      )}

      {/* Custom Process Card */}
      <Card>
        <CardHeader
          title="Proceso Personalizado"
          subtitle="Ejecuta un endpoint personalizado con parámetros custom"
        />
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Nota:</strong> Para ejecutar procesos personalizados, utiliza el hook{' '}
              <code className="px-1 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 rounded">
                useProcess()
              </code>{' '}
              en tu componente.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
              Ejemplo de uso:
            </p>
            <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
{`import { useProcess } from '@/hooks/useProcess'

const { useExecuteProcess } = useProcess()
const execute = useExecuteProcess()

const handleExecute = () => {
  execute.mutate({
    endpoint: '/api/custom-endpoint',
    method: 'POST',
    data: { param1: 'value1' }
  })
}`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProcessesPage
