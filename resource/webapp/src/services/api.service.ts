/**
 * Servicio centralizado para hacer llamadas a la API
 */

import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG, AUTH_CONFIG, ENDPOINTS } from '../config/api.config'
import type { ApiError, ApiResponse } from '@/types'
import { getAccessToken, getRefreshToken, setTokens, clearTokens, isTokenExpired } from '@/utils/auth'
import { attachCsrfHeader } from '@/utils/csrf'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
      withCredentials: !!AUTH_CONFIG.useHttpOnlyCookie,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - añadir token
    this.api.interceptors.request.use(
      (config) => {
        const token = getAccessToken()
        // Evitar enviar token expirado si podemos detectarlo
        if (token && !isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Adjuntar header CSRF para peticiones mutantes si está disponible
        const method = (config.method || 'get').toLowerCase()
        if (['post', 'put', 'patch', 'delete'].includes(method)) {
          // Merge CSRF header into existing headers. Casts are required because
          // Axios typings for headers are strict (AxiosHeaders) while our helper
          // returns a plain object.
          const csrf = attachCsrfHeader((config.headers as any) || {})
          Object.assign(config.headers || {}, csrf)
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - manejar errores
    // Implementamos un queue para refresh para evitar multiple refresh calls
    let isRefreshing = false
    let failedQueue: Array<{
      resolve: (value?: any) => void
      reject: (error: any) => void
    }> = []

    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach((p) => {
        if (error) {
          p.reject(error)
        } else {
          p.resolve(token)
        }
      })
      failedQueue = []
    }

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
          // marcar para no reintentar infinitamente
          originalRequest._retry = true

          if (isRefreshing) {
            // Si ya hay un refresh en curso, encolar la petición
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                if (originalRequest.headers && token) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                }
                return this.api(originalRequest)
              })
              .catch((err) => Promise.reject(err))
          }

          isRefreshing = true

          try {
            const refreshToken = getRefreshToken()

            let refreshResponse

            if (AUTH_CONFIG.useHttpOnlyCookie) {
              // Si el backend usa cookie, sólo llamar al endpoint y confiar en cookie
              refreshResponse = await axios.post(`${API_CONFIG.baseURL}${ENDPOINTS.auth.refresh}`, null, {
                withCredentials: true,
              })
            } else {
              // Enviar refresh token en body
              refreshResponse = await axios.post(`${API_CONFIG.baseURL}${ENDPOINTS.auth.refresh}`, {
                refreshToken,
              })
            }

            const newToken = refreshResponse?.data?.token
            const newRefresh = refreshResponse?.data?.refreshToken

            if (newToken) {
              setTokens(newToken, newRefresh)
              processQueue(null, newToken)

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
              }

              return this.api(originalRequest)
            }

            // Si no vino token, forzar logout
            clearTokens()
            processQueue(new Error('No hay token en refresh'))
            window.location.href = '/login'
            return Promise.reject(error)
          } catch (refreshError) {
            clearTokens()
            processQueue(refreshError, null)
            window.location.href = '/login'
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        }

        return Promise.reject(this.normalizeError(error))
      }
    )
  }

  private normalizeError(error: AxiosError<ApiError>): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Error en la solicitud',
        errors: error.response.data?.errors,
        statusCode: error.response.status,
      }
    }

    if (error.request) {
      return {
        message: 'No se pudo conectar con el servidor',
        statusCode: 0,
      }
    }

    return {
      message: error.message || 'Error desconocido',
    }
  }

  // NOTE: token storage/clearing is handled by helpers in `src/utils/auth.ts`

  // Métodos HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, config)
    return response.data
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data, config)
    return response.data
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data, config)
    return response.data
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url, config)
    return response.data
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.patch(url, data, config)
    return response.data
  }

  // Método para subir archivos
  async upload<T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
    return response.data
  }

  // Obtener instancia de axios para casos especiales
  getInstance(): AxiosInstance {
    return this.api
  }
}

export const apiService = new ApiService()
