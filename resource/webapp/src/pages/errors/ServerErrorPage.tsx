/**
 * Página 500 - Error del servidor
 */

import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useConfig } from '@/contexts/ConfigContext'
import {
  HomeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface ServerErrorPageProps {
  error?: Error
  resetError?: () => void
}

export function ServerErrorPage({ error, resetError }: ServerErrorPageProps) {
  const navigate = useNavigate()
  const { config } = useConfig()

  const handleRefresh = () => {
    if (resetError) {
      resetError()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 500 */}
        <div className="relative mb-8">
          <div className="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-400 leading-none select-none animate-pulse">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-blob"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Error del servidor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Oops! Algo salió mal en nuestros servidores. Estamos trabajando para solucionarlo.
            </p>
          </div>

          {/* Error details (in development) */}
          {error && import.meta.env.DEV && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 max-w-xl mx-auto">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                    Detalles del error (solo en desarrollo):
                  </p>
                  <pre className="text-xs text-red-700 dark:text-red-400 font-mono overflow-x-auto whitespace-pre-wrap break-words">
                    {error.message}
                  </pre>
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-600 dark:text-red-500 cursor-pointer hover:underline">
                        Ver stack trace
                      </summary>
                      <pre className="text-xs text-red-600 dark:text-red-500 font-mono overflow-x-auto whitespace-pre-wrap break-words mt-2">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              ¿Qué puedes hacer?
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400">•</span>
                <span>Intenta recargar la página</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400">•</span>
                <span>Verifica tu conexión a internet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400">•</span>
                <span>Si el problema persiste, contacta a soporte</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
            <Button
              onClick={handleRefresh}
              variant="secondary"
              size="lg"
              className="gap-2 min-w-[200px]"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Recargar página
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              className="gap-2 min-w-[200px]"
            >
              <HomeIcon className="h-5 w-5" />
              Ir al inicio
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>{config.copyright}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServerErrorPage
