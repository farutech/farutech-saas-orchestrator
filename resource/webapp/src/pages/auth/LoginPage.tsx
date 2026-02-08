/**
 * Página de Login con diseño mejorado
 */

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useConfig } from '@/contexts/ConfigContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Alert } from '@/components/ui/Alert'
import { 
  UserIcon, 
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export function LoginPage() {
  const { config } = useConfig()
  // useAuth.navigate performs navigation on success
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const { loginAsync, isLoggingIn, loginError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const credentials = { email: formData.email, password: formData.password }
    try {
      await loginAsync(credentials, formData.remember)
    } catch (err) {
      // el hook maneja el error en loginError
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.href = '/forgot-password'
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Logo and branding */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-600/30 ring-4 ring-primary-200 dark:ring-primary-900/50 transform group-hover:scale-105 transition-all duration-300">
                  <img 
                    src={config.logoUrl}
                    alt={`${config.brandName} Logo`}
                    className="w-14 h-14 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/Logo.png'
                    }}
                  />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              {config.brandName}
            </h1>
            <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-1 flex items-center justify-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              Admin Panel
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {config.description}
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Email input */}
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                label="Correo electrónico"
                placeholder="tu@email.com"
                icon={<UserIcon className="h-5 w-5" />}
                iconPosition="left"
              />

              {/* Password input */}
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                label="Contraseña"
                placeholder="••••••••"
                showPasswordToggle={true}
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  label="Recordarme"
                />
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoggingIn}
              fullWidth
              size="lg"
              className="group"
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar sesión</span>&nbsp;
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </Button>

            {/* Mostrar errores del login */}
            {loginError && (
              <Alert 
                variant="error" 
                title="Error al iniciar sesión"
              >
                {(loginError as any)?.message || 'Credenciales inválidas. Por favor verifica e intenta de nuevo.'}
              </Alert>
            )}

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                🔐 Credenciales de prueba:
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 font-mono">
                Email: demo@farutech.com<br />
                Password: demo123
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            <p>{config.copyright}</p>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-primary-600/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-8 text-white w-full">
          <div className="max-w-xl w-full space-y-8">
            {/* Header Section */}
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <div>
                <h2 className="text-5xl font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-100 to-white">
                  Bienvenido de vuelta
                </h2>
                <p className="text-lg text-primary-50/90 leading-relaxed max-w-md mx-auto">
                  Tu plataforma de administración inteligente para gestionar todo tu negocio en un solo lugar
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-black">500+</div>
                  </div>
                  <div className="text-sm font-medium text-primary-100">Empresas activas</div>
                  <div className="mt-1 text-xs text-primary-200/60">Confiando en nuestra plataforma</div>
                </div>
              </div>

              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-black">99.9%</div>
                  </div>
                  <div className="text-sm font-medium text-primary-100">Uptime garantizado</div>
                  <div className="mt-1 text-xs text-primary-200/60">Disponibilidad excepcional</div>
                </div>
              </div>

              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-black">24/7</div>
                  </div>
                  <div className="text-sm font-medium text-primary-100">Soporte técnico</div>
                  <div className="mt-1 text-xs text-primary-200/60">Siempre disponibles para ti</div>
                </div>
              </div>

              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-black">⚡</div>
                  </div>
                  <div className="text-sm font-medium text-primary-100">Velocidad extrema</div>
                  <div className="mt-1 text-xs text-primary-200/60">Rendimiento optimizado</div>
                </div>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-primary-50/80 group hover:text-white transition-colors duration-300">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Acceso seguro con autenticación de dos factores</span>
              </div>
              <div className="flex items-center gap-3 text-primary-50/80 group hover:text-white transition-colors duration-300">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Panel de control intuitivo y fácil de usar</span>
              </div>
              <div className="flex items-center gap-3 text-primary-50/80 group hover:text-white transition-colors duration-300">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Reportes y analíticas en tiempo real</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
