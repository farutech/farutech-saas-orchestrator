/**
 * Página 404 - No encontrado
 */

import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useConfig } from '@/contexts/ConfigContext'
import {
  HomeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

export function NotFoundPage() {
  const navigate = useNavigate()
  const { config } = useConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 leading-none select-none animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-blob"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Página no encontrada
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Lo sentimos, la página que buscas no existe o ha sido movida a otra ubicación.
            </p>
          </div>

          {/* Search suggestion */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <MagnifyingGlassIcon className="h-6 w-6 flex-shrink-0" />
              <p className="text-sm text-left">
                Intenta usar el buscador presionando <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+K</kbd> o navega desde el menú principal.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
            <Button
              onClick={() => navigate(-1)}
              variant="secondary"
              size="lg"
              className="gap-2 min-w-[200px]"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Volver atrás
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

export default NotFoundPage
