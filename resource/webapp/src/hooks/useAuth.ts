/**
 * Hook de autenticación
 * Maneja login, logout, registro y estado del usuario
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'
import { demoAuthService, isDemoModeEnabled } from '@/services/demo-auth.service'
import { AUTH_CONFIG, ENDPOINTS } from '../config/api.config'
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types'
import { getAccessToken, setTokens, clearTokens } from '@/utils/auth'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { setTokens: setStoreTokens, clearAuth, rememberMe } = useAuthStore()

  // Obtener usuario actual
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = getAccessToken()
      if (!token) return null

      try {
        const response = await apiService.get<User>(ENDPOINTS.auth.me)
        return response.data
      } catch {
        // Si falla, limpiar token inválido
        clearTokens()
        clearAuth()
        return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  })

  // On app boot, attempt silent refresh if no token
  useEffect(() => {
    const trySilentRefresh = async () => {
      const token = getAccessToken()
      if (token) return

      try {
        const response = await apiService.post<AuthResponse>(ENDPOINTS.auth.refresh)
        if (response && response.data) {
          setTokens(response.data.token, response.data.refreshToken || '')
          setStoreTokens(response.data.token, response.data.refreshToken || '', rememberMe)
          queryClient.setQueryData(['auth', 'user'], response.data.user)
        }
      } catch {
        // ignore — user remains unauthenticated
      }
    }

    trySilentRefresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Login con remember me
  const loginMutation = useMutation({
    mutationFn: async (params: { credentials: LoginCredentials; remember?: boolean }) => {
      const { credentials, remember = false } = params
      
      // Primero intentar con el servicio demo si está habilitado
      if (isDemoModeEnabled()) {
        try {
          const demoResponse = await demoAuthService.login(credentials)
          return { ...demoResponse, remember }
        } catch (demoError) {
          console.log('Demo auth failed, trying real API...')
        }
      }

      // Intentar con API real
      try {
        const response = await apiService.post<AuthResponse>(ENDPOINTS.auth.login, credentials)
        return { ...response.data, remember }
      } catch (apiError: any) {
        if (isDemoModeEnabled()) {
          throw new Error('Credenciales inválidas. Usa: demo@farutech.com / demo123')
        }
        throw apiError
      }
    },
    onSuccess: (data) => {
      const { token, refreshToken, user, remember } = data
      setTokens(token, refreshToken || '')
      setStoreTokens(token, refreshToken || '', remember)
      
      if (user) {
        try {
          localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user))
        } catch {}
        queryClient.setQueryData(['auth', 'user'], user)
      }
      navigate('/dashboard')
    },
  })

  // Registro
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiService.post<AuthResponse>(ENDPOINTS.auth.register, data)
      return response.data
    },
    onSuccess: (data) => {
      setTokens(data.token, data.refreshToken)
      if (data.user) {
        try {
          localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user))
        } catch {}
        queryClient.setQueryData(['auth', 'user'], data.user)
      }
      navigate('/dashboard')
    },
  })

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiService.post(ENDPOINTS.auth.logout)
      } catch {
        // Continuar con logout local aunque falle la API
      }
    },
    onSuccess: () => {
      clearTokens()
      clearAuth()
      queryClient.setQueryData(['auth', 'user'], null)
      queryClient.clear()
      navigate('/login')
      // broadcast logout to other tabs
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('auth')
          bc.postMessage({ type: 'logout' })
          bc.close()
        } else {
          localStorage.setItem('auth_event', JSON.stringify({ type: 'logout', ts: Date.now() }))
        }
      } catch {}
    },
  })

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: (credentials: LoginCredentials, remember?: boolean) => 
      loginMutation.mutate({ credentials, remember }),
    loginAsync: (credentials: LoginCredentials, remember?: boolean) => 
      loginMutation.mutateAsync({ credentials, remember }),
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  }
}
