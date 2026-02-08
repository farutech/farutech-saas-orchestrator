/**
 * Página de recuperación de contraseña
 * Soporta dos flujos según configuración:
 * 1. Envío de email automático
 * 2. Solicitud manual al administrador
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useConfig } from '@/contexts/ConfigContext'
import { Input, Button, Alert, Card } from '@/components/ui'
import { 
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

type RecoveryMethod = 'email' | 'admin_request'
type RecoveryStep = 'input' | 'email_sent' | 'request_sent' | 'error'

export function ForgotPasswordPage() {
  const { config } = useConfig()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<RecoveryStep>('input')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Configuración del método de recuperación
  // TODO: Esto debería venir de la configuración general del sistema
  const recoveryMethod: RecoveryMethod = config.passwordRecoveryMethod || 'email'
  const adminEmail = config.supportEmail || 'soporte@farutech.com'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (recoveryMethod === 'email') {
        // Flujo: Envío automático de email
        // TODO: Implementar llamada real a API
        // await apiService.post('/auth/forgot-password', { email })
        setStep('email_sent')
      } else {
        // Flujo: Solicitud al administrador
        // TODO: Implementar llamada real a API para crear ticket
        // await apiService.post('/auth/request-password-reset', { email })
        setStep('request_sent')
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al procesar la solicitud')
      setStep('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setEmail('')
    setStep('input')
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full">
        <Card className="p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <EnvelopeIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recuperar Contraseña
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {recoveryMethod === 'email' 
                ? 'Te enviaremos un enlace para restablecer tu contraseña'
                : 'Tu solicitud será revisada por un administrador'
              }
            </p>
          </div>

          {/* Formulario o Estados */}
          {step === 'input' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Correo electrónico"
                placeholder="tu@email.com"
                icon={<EnvelopeIcon className="h-5 w-5" />}
                iconPosition="left"
                helperText="Ingresa el correo asociado a tu cuenta"
              />

              {recoveryMethod === 'admin_request' && (
                <Alert variant="info" className="text-sm">
                  <p className="font-medium">Proceso de recuperación manual</p>
                  <p className="mt-1 text-xs">
                    Tu solicitud será enviada al equipo de administración. 
                    Recibirás una respuesta en un plazo de 24 horas hábiles.
                  </p>
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                className="group"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {recoveryMethod === 'email' 
                        ? 'Enviar enlace de recuperación' 
                        : 'Enviar solicitud'
                      }
                    </span>
                  </>
                )}
              </Button>
            </form>
          )}

          {step === 'email_sent' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ¡Email Enviado!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Revisa tu bandeja de entrada y sigue las instrucciones.
                </p>
              </div>
              <Alert variant="info" className="text-xs">
                Si no recibes el correo en 5 minutos, revisa tu carpeta de spam o intenta nuevamente.
              </Alert>
              <Button
                variant="secondary"
                fullWidth
                onClick={handleReset}
              >
                Enviar otro correo
              </Button>
            </div>
          )}

          {step === 'request_sent' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Solicitud Enviada
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tu solicitud de recuperación de contraseña ha sido enviada al equipo de administración.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Usuario: <strong>{email}</strong>
                </p>
              </div>
              <Alert variant="info" className="text-xs">
                <p className="font-medium">Tiempo estimado de respuesta: 24 horas hábiles</p>
                <p className="mt-1">
                  El administrador revisará tu solicitud y te contactará a través del correo: {adminEmail}
                </p>
              </Alert>
              <Button
                variant="secondary"
                fullWidth
                onClick={handleReset}
              >
                Hacer otra solicitud
              </Button>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Error al Procesar
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {errorMessage}
                </p>
              </div>
              <Button
                variant="secondary"
                fullWidth
                onClick={handleReset}
              >
                Intentar nuevamente
              </Button>
            </div>
          )}

          {/* Volver al login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>

          {/* Info de configuración (solo en desarrollo) */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                🔧 Configuración actual:
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Método: <strong>{recoveryMethod === 'email' ? 'Email automático' : 'Solicitud manual'}</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Para cambiar, actualiza <code>passwordRecoveryMethod</code> en ConfigContext
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
