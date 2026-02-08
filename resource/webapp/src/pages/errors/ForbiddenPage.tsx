/**
 * Página 403 - Acceso denegado
 */

import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useConfig } from '@/contexts/ConfigContext'
import {
  HomeIcon,
  ArrowLeftIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'

export function ForbiddenPage() {
  const navigate = useNavigate()
  const { config } = useConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 403 */}
        <div className="relative mb-8">
          <div className="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-400 leading-none select-none animate-pulse">
            403
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-blob"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Acceso denegado
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              No tienes permisos suficientes para acceder a esta página o realizar esta acción.
            </p>
          </div>

          {/* Info box */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <ShieldExclamationIcon className="h-8 w-8 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  ¿Por qué veo este mensaje?
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
                  <li>• Tu rol no tiene los permisos necesarios</li>
                  <li>• Esta sección está restringida a administradores</li>
                  <li>• Tu sesión puede haber expirado</li>
                </ul>
              </div>
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

          {/* Help text */}
          <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>

          {/* Footer */}
          <div className="pt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>{config.copyright}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForbiddenPage
