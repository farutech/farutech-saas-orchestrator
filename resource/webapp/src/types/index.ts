/**
 * Tipos globales de la aplicación
 */

// Usuario
export interface User {
  id: string | number
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user' | 'moderator'
  // Permisos asignados al usuario (códigos/strings)
  permissions?: string[]
  // Atajos o accesos específicos (opcional)
  accesses?: string[]
  createdAt: string
  updatedAt?: string
}

// Auth
export interface AuthResponse {
  token: string
  refreshToken?: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
}

// API Response
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

// CRUD
export interface CrudColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface CrudAction<T = any> {
  label: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  show?: (row: T) => boolean
}

export interface CrudFilter {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'daterange'
  options?: { label: string; value: any }[]
}

// Proceso
export interface Process {
  id: string | number
  name: string
  description?: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, any>
  status?: 'idle' | 'running' | 'success' | 'error'
  lastRun?: string
}

export interface ProcessExecution {
  id: string | number
  processId: string | number
  status: 'running' | 'success' | 'error'
  startedAt: string
  finishedAt?: string
  result?: any
  error?: string
}

// Brand Configuration (SaaS)
export interface BrandConfig {
  // Nombre de la marca (reemplaza "FaruTech")
  brandName: string
  // Título del tab del navegador
  pageTitle: string
  // URL del logo corto (para sidebar, favicon, etc.)
  logoUrl: string
  // URL del logo completo (para login, navbar, etc.)
  logoFullUrl: string
  // Versión de la aplicación (solo lectura, viene del backend)
  version?: string
  // Copyright (solo lectura, viene del backend)
  copyright?: string
  // Color primario (hex)
  primaryColor?: string
  // Descripción breve
  description?: string
}

// App Configuration
export interface AppConfig extends BrandConfig {
  // Configuraciones adicionales del sistema
  maintenanceMode?: boolean
  maxUploadSize?: number
  supportEmail?: string
  supportPhone?: string
  // Método de recuperación de contraseña: 'email' o 'admin_request'
  passwordRecoveryMethod?: 'email' | 'admin_request'
}

// Dashboard
export interface DashboardStats {
  users: number
  revenue: number
  orders: number
  growth: number
}

export interface ChartData {
  name: string
  value: number
}

// Theme
export type Theme = 'light' | 'dark' | 'system'

// Notificación
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}
