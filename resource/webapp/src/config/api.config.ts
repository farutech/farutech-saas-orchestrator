/**
 * Configuración de API
 * Aquí defines la URL base de tu backend existente
 */

export const API_CONFIG = {
  // Cambiar esta URL por la de tu backend real
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  userKey: 'user_data',
  // Si el backend usa cookies httpOnly para auth (recomendado), activar esto.
  // Cuando true, las llamadas deben enviarse con `withCredentials: true` y
  // el refresh puede no requerir enviar el refresh token en el body.
  useHttpOnlyCookie: false,
}

export const ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    menu: '/menu',
  },
  // Users
  users: {
    list: '/users',
    create: '/users',
    update: (id: string | number) => `/users/${id}`,
    delete: (id: string | number) => `/users/${id}`,
    show: (id: string | number) => `/users/${id}`,
    bulkDelete: '/users/bulk-delete',
  },
  // Procesos especiales
  processes: {
    list: '/processes',
    execute: '/processes/execute',
    status: (id: string | number) => `/processes/${id}/status`,
    history: '/processes/history',
  },
  // Dashboard
  dashboard: {
    stats: '/dashboard/stats',
    charts: '/dashboard/charts',
    activity: '/dashboard/activity',
  },
}
