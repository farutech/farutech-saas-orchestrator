/**
 * Demo Authentication Service - Local fallback for development
 * Este servicio simula un backend de autenticación localmente
 */

import type { AuthResponse, LoginCredentials, User } from '@/types'

// Base de datos local de usuarios demo
const DEMO_USERS: Array<{ email: string; password: string; user: User }> = [
  {
    email: 'demo@farutech.com',
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@farutech.com',
      name: 'Usuario Demo',
      role: 'admin',
      permissions: ['users.view', 'users.create', 'users.edit', 'users.delete', 'processes.view', 'reports.view', 'settings.manage'],
      accesses: ['dashboard', 'users', 'processes', 'reports', 'settings'],
      createdAt: new Date().toISOString(),
    },
  },
  {
    email: 'admin@farutech.com',
    password: 'admin123',
    user: {
      id: '2',
      email: 'admin@farutech.com',
      name: 'Administrador',
      role: 'admin',
      permissions: ['*'], // Todos los permisos
      accesses: ['*'], // Todos los accesos
      createdAt: new Date().toISOString(),
    },
  },
  {
    email: 'user@farutech.com',
    password: 'user123',
    user: {
      id: '3',
      email: 'user@farutech.com',
      name: 'Usuario Básico',
      role: 'user',
      permissions: ['dashboard.view', 'reports.view'],
      accesses: ['dashboard', 'reports'],
      createdAt: new Date().toISOString(),
    },
  },
]

/**
 * Simula un delay de red para hacer el demo más realista
 */
const simulateNetworkDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Autenticación demo local
 */
export const demoAuthService = {
  /**
   * Login con usuarios locales
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await simulateNetworkDelay(300)

    const demoUser = DEMO_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    )

    if (!demoUser) {
      throw new Error('Credenciales inválidas. Verifica tu email y contraseña.')
    }

    // Generar tokens simulados
    const token = `demo-access-token-${Date.now()}`
    const refreshToken = `demo-refresh-token-${Date.now()}`

    return {
      token,
      refreshToken,
      user: demoUser.user,
    }
  },

  /**
   * Verificar si el usuario actual es válido
   */
  async me(token: string): Promise<User> {
    await simulateNetworkDelay(200)

    // En un escenario real, validaríamos el token
    // Por ahora, retornamos el primer usuario demo
    if (token.startsWith('demo-access-token')) {
      return DEMO_USERS[0].user
    }

    throw new Error('Token inválido')
  },

  /**
   * Refresh token
   */
  async refresh(refreshToken: string): Promise<AuthResponse> {
    await simulateNetworkDelay(200)

    if (refreshToken.startsWith('demo-refresh-token')) {
      const token = `demo-access-token-${Date.now()}`
      const newRefreshToken = `demo-refresh-token-${Date.now()}`

      return {
        token,
        refreshToken: newRefreshToken,
        user: DEMO_USERS[0].user,
      }
    }

    throw new Error('Refresh token inválido')
  },

  /**
   * Logout (no hace nada en modo demo)
   */
  async logout(): Promise<void> {
    await simulateNetworkDelay(100)
    // No-op en modo demo
  },

  /**
   * Obtener lista de usuarios demo (para referencia)
   */
  getDemoUsers(): Array<{ email: string; password: string }> {
    return DEMO_USERS.map(u => ({
      email: u.email,
      password: u.password,
    }))
  },
}

/**
 * Verifica si el modo demo está habilitado
 */
export const isDemoModeEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false' // Habilitado por defecto en desarrollo
}
