// ============================================================================
// FARUTECH API CLIENT - Axios Configuration with Interceptors
// ============================================================================

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ProblemDetails } from '@/types/api';
import { API_CONFIG, AUTH_CONFIG } from '@/config/app.config';

// ============================================================================
// Token Management
// ============================================================================

export const TokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, token);
  },

  getIntermediateToken: (): string | null => {
    return sessionStorage.getItem(AUTH_CONFIG.INTERMEDIATE_TOKEN_KEY);
  },

  setIntermediateToken: (token: string): void => {
    sessionStorage.setItem(AUTH_CONFIG.INTERMEDIATE_TOKEN_KEY, token);
  },

  clearIntermediateToken: (): void => {
    sessionStorage.removeItem(AUTH_CONFIG.INTERMEDIATE_TOKEN_KEY);
  },

  clearAllTokens: (): void => {
    localStorage.removeItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_CONFIG.INTERMEDIATE_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.TENANT_CONTEXT_KEY);
    localStorage.removeItem('farutech_user_info');
  },

  // Tenant Context
  getTenantContext: () => {
    const context = localStorage.getItem(AUTH_CONFIG.TENANT_CONTEXT_KEY);
    return context ? JSON.parse(context) : null;
  },

  setTenantContext: (context: {
    tenantId: string;
    companyName?: string;
    role?: string;
  }) => {
    localStorage.setItem(AUTH_CONFIG.TENANT_CONTEXT_KEY, JSON.stringify(context));
  },

  clearTenantContext: () => {
    localStorage.removeItem(AUTH_CONFIG.TENANT_CONTEXT_KEY);
  },
};

// ============================================================================
// Axios Instance Creation
// ============================================================================

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ============================================================================
  // Request Interceptor - Attach JWT Token
  // ============================================================================
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Try access token first, fallback to intermediate token for management endpoints
      let token = TokenManager.getAccessToken();
      
      // Endpoints que aceptan intermediate token (gestión sin contexto seleccionado)
      // Estos endpoints requieren usuario autenticado pero NO requieren contexto de tenant
      const managementEndpoints = [
        '/api/Auth/me',
        '/api/Auth/profile',
        '/api/Auth/context',
        '/api/Auth/available-tenants', // Listar tenants disponibles (requiere usuario, no tenant)
        '/api/Customers',  // Gestión de organizaciones
        '/api/Catalog',     // Catálogo de productos para provisioning
        '/api/Provisioning' // Provisioning de instancias
      ];
      
      const isManagementEndpoint = managementEndpoints.some(endpoint => 
        config.url?.includes(endpoint)
      );
      
      if (!token && isManagementEndpoint) {
        token = TokenManager.getIntermediateToken();
        console.log('[API-Client] Using intermediate token for management endpoint');
      }
      
      console.log('[API-Client] Request to:', config.url);
      console.log('[API-Client] Token from storage:', token ? `${token.substring(0, 20)}...` : 'null');

      if (token && token.trim().length > 0) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token.trim()}`;
        console.log('[API-Client] Authorization header set successfully');
      } else {
        console.warn('[API-Client] No valid token found for request to:', config.url);
      }

      // Add tenant context if available (for multi-tenant routing)
      const tenantContext = TokenManager.getTenantContext();
      if (tenantContext?.tenantId && config.headers) {
        config.headers['X-Tenant-Id'] = tenantContext.tenantId;
        console.log('[API-Client] Tenant context added:', tenantContext.tenantId);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // ============================================================================
  // Response Interceptor - Handle Errors Globally
  // ============================================================================
  client.interceptors.response.use(
    (response) => {
      console.log('[API-Client] Response received:', response.config.url, response.status);
      return response;
    },
    (error: AxiosError<ProblemDetails>) => {
      console.error('[API-Client] === ERROR IN RESPONSE ===');
      console.error('[API-Client] URL:', error.config?.url);
      console.error('[API-Client] Status:', error.response?.status);
      console.error('[API-Client] Error:', error.message);
      
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        status: error.response?.status,
        details: error.response?.data,
      };

      if (error.response) {
        // Server responded with error status
        switch (error.response.status) {
          case 405:
            // CORS preflight failure - backend configuration issue
            apiError.message = 
              '⚠️ CORS Error: El backend no está configurado para aceptar peticiones desde este origen.\n' +
              '🔧 Solución: Configura CORS en el backend (Program.cs).\n' +
              '📖 Ver: CORS_ERROR_405.md para más detalles.';
            console.error('❌ CORS Configuration Required!');
            console.error('📋 Backend needs CORS policy for:', window.location.origin);
            console.error('📖 See CORS_ERROR_405.md for configuration steps');
            break;

          case 401:
            apiError.message = 'Unauthorized. Please login again.';
            // Clear tokens and redirect to login
            // EXCEPT for available-tenants which can fail during refresh without meaning session expired
            const isAvailableTenantsEndpoint = error.config?.url?.includes('/api/Auth/available-tenants');
            if (!isAvailableTenantsEndpoint) {
              TokenManager.clearAllTokens();
              if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
              }
            } else {
              console.warn('[API-Client] 401 on available-tenants - not clearing session (may be normal during context selection)');
            }
            break;

          case 403:
            apiError.message =
              error.response.data?.detail ||
              'Access forbidden. You do not have permission.';
            break;

          case 404:
            apiError.message =
              error.response.data?.detail || 'Resource not found.';
            break;

          case 400:
            apiError.message =
              error.response.data?.detail || 'Invalid request data.';
            break;

          case 500:
            apiError.message =
              error.response.data?.detail ||
              'Internal server error. Please try again later.';
            break;

          default:
            apiError.message =
              error.response.data?.detail ||
              error.response.statusText ||
              'An error occurred';
        }
      } else if (error.request) {
        // Request made but no response - likely CORS or network issue
        if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
          apiError.message =
            '🚫 Error de Conexión:\n' +
            '- El backend no está corriendo, o\n' +
            '- CORS no está configurado correctamente\n\n' +
            '✅ Verifica que el API esté corriendo en: ' + API_CONFIG.BASE_URL;
          console.error('❌ Network Error - Check backend status and CORS configuration');
        } else {
          apiError.message =
            'No response from server. Please check your connection.';
        }
      } else {
        // Error in request setup
        apiError.message = error.message || 'Request configuration error';
      }

      return Promise.reject(apiError);
    }
  );

  return client;
};

// ============================================================================
// Singleton Instance
// ============================================================================

export const apiClient = createApiClient();

// ============================================================================
// API Client Utilities
// ============================================================================

export const ApiClientUtils = {
  /**
   * Update base URL dynamically (useful for tenant-specific endpoints)
   */
  setBaseURL: (url: string) => {
    apiClient.defaults.baseURL = url;
  },

  /**
   * Get current base URL
   */
  getBaseURL: (): string => {
    return apiClient.defaults.baseURL || API_BASE_URL;
  },

  /**
   * Set custom header
   */
  setHeader: (key: string, value: string) => {
    apiClient.defaults.headers.common[key] = value;
  },

  /**
   * Remove custom header
   */
  removeHeader: (key: string) => {
    delete apiClient.defaults.headers.common[key];
  },
};

export default apiClient;
