// ============================================================================
// FARUTECH - Configuración Centralizada
// ============================================================================
// 
// Este archivo centraliza toda la configuración de la aplicación.
// Los valores se leen desde variables de entorno (.env)
// 
// Para cambiar la configuración:
// 1. Edita el archivo .env en la raíz del proyecto
// 2. Reinicia el servidor de desarrollo
// ============================================================================

/**
 * Configuración del API Backend
 */
export const API_CONFIG = {
  /**
   * URL base del API de Farutech
   * 
   * Prioridad:
   * 1. VITE_API_URL (pasada por Aspire con puerto dinámico)
   * 2. VITE_API_BASE_URL (definida en .env para desarrollo standalone)
   * 3. Fallback: http://localhost:5098
   */
  BASE_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5098',
  
  /**
   * Timeout para peticiones HTTP (en milisegundos)
   * Por defecto: 30 segundos
   */
  TIMEOUT: 30000,
  
  /**
   * Swagger/OpenAPI Documentation URL
   */
  SWAGGER_URL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5098'}/swagger/v1/swagger.json`,
} as const;

/**
 * Configuración de la aplicación
 */
export const APP_CONFIG = {
  /**
   * Nombre de la aplicación
   */
  NAME: 'Farutech',
  
  /**
   * Versión de la aplicación
   */
  VERSION: '1.0.0',
  
  /**
   * Entorno de ejecución
   */
  ENVIRONMENT: import.meta.env.MODE,
  
  /**
   * Modo desarrollo
   */
  IS_DEV: import.meta.env.DEV,
  
  /**
   * Modo producción
   */
  IS_PROD: import.meta.env.PROD,
} as const;

/**
 * Configuración de autenticación
 */
export const AUTH_CONFIG = {
  /**
   * Clave para almacenar el token de acceso en localStorage
   */
  ACCESS_TOKEN_KEY: 'farutech_access_token',
  
  /**
   * Clave para almacenar el token intermedio en sessionStorage
   */
  INTERMEDIATE_TOKEN_KEY: 'farutech_intermediate_token',
  
  /**
   * Clave para almacenar el contexto del tenant en localStorage
   */
  TENANT_CONTEXT_KEY: 'farutech_tenant_context',
} as const;

// ============================================================================
// Logging de Configuración (solo en desarrollo)
// ============================================================================

if (APP_CONFIG.IS_DEV) {
  console.group('🔧 Farutech Configuration');
  console.info('📡 API Base URL:', API_CONFIG.BASE_URL);
  console.info('📖 Swagger URL:', API_CONFIG.SWAGGER_URL);
  console.info('⏱️  API Timeout:', API_CONFIG.TIMEOUT / 1000, 'seconds');
  console.info('🌍 Environment:', APP_CONFIG.ENVIRONMENT);
  console.groupEnd();
}
