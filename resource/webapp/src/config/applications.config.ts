/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                   MULTI-TENANT APPLICATION CONFIGURATION                   ║
 * ║                                                                            ║
 * ║  Sistema de configuración dinámico por aplicación                         ║
 * ║  - Soporte multi-tenant                                                   ║
 * ║  - Theming dinámico con gradientes automáticos                            ║
 * ║  - Módulos y rutas configurables                                          ║
 * ║  - Branding personalizable                                                 ║
 * ║                                                                            ║
 * ║  @author    Farid Maloof Suarez                                           ║
 * ║  @company   FaruTech                                                      ║
 * ║  @version   1.0.0                                                         ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

export interface ApplicationBranding {
  /** Identificador único de la aplicación */
  applicationId: string
  
  /** Nombre de la aplicación */
  name: string
  
  /** Logo principal (URL o path) */
  logo: string
  
  /** Logo alternativo para dark mode (opcional) */
  logoDark?: string
  
  /** Favicon (URL o path) */
  favicon: string
  
  /** Imagen de fondo para login/splash (opcional) */
  backgroundImage?: string
  
  /** Título de la página (meta) */
  pageTitle: string
  
  /** Descripción meta */
  description: string
}

export interface ApplicationTheme {
  /** Color primario (hex, rgb, hsl) */
  primaryColor: string
  
  /** Color secundario (opcional, se auto-genera si no se proporciona) */
  secondaryColor?: string
  
  /** Color de acento (opcional) */
  accentColor?: string
  
  /** Color de éxito */
  successColor?: string
  
  /** Color de advertencia */
  warningColor?: string
  
  /** Color de error */
  errorColor?: string
  
  /** Color de información */
  infoColor?: string
  
  /** Fuente primaria */
  fontFamily?: string
  
  /** Radio de bordes (px, rem) */
  borderRadius?: string
  
  /** Tema por defecto: 'light' | 'dark' | 'system' */
  defaultMode?: 'light' | 'dark' | 'system'
  
  /** Usar gradientes automáticos */
  useGradients?: boolean
  
  /** Estilo de gradiente: 'linear' | 'radial' | 'conic' */
  gradientStyle?: 'linear' | 'radial' | 'conic'
  
  /** Dirección del gradiente (en grados para linear) */
  gradientDirection?: number
}

export interface ApplicationModule {
  /** ID único del módulo */
  id: string
  
  /** Nombre visible del módulo */
  name: string
  
  /** Icono del módulo (heroicon name o custom) */
  icon: string
  
  /** Ruta base del módulo */
  path: string
  
  /** Descripción del módulo */
  description?: string
  
  /** Módulo habilitado */
  enabled: boolean
  
  /** Orden de aparición */
  order: number
  
  /** Permisos requeridos (opcional) */
  requiredPermissions?: string[]
  
  /** Submódulos/rutas hijas */
  children?: ApplicationRoute[]
}

export interface ApplicationRoute {
  /** Path de la ruta */
  path: string
  
  /** Nombre de la ruta */
  name: string
  
  /** Icono (opcional) */
  icon?: string
  
  /** Componente a renderizar (lazy loaded) */
  component?: string
  
  /** Permisos requeridos */
  requiredPermissions?: string[]
  
  /** Ocultar en menú */
  hideInMenu?: boolean
  
  /** Ruta exacta */
  exact?: boolean
}

export interface DataSourceConfig {
  /** Tipo de fuente: 'api' | 'static' | 'mock' */
  type: 'api' | 'static' | 'mock'
  
  /** URL del endpoint (para tipo 'api') */
  endpoint?: string
  
  /** Método HTTP */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  
  /** Headers personalizados */
  headers?: Record<string, string>
  
  /** Mapeo de respuesta (JSONPath-like) */
  responseMapper?: {
    data?: string
    total?: string
    currentPage?: string
    perPage?: string
  }
  
  /** Datos estáticos (para tipo 'static') */
  staticData?: any[]
  
  /** Tiempo de caché (ms) */
  cacheTime?: number
  
  /** Revalidar al montar */
  revalidateOnMount?: boolean
}

export interface ApplicationActions {
  /** Acciones globales disponibles */
  global?: ActionConfig[]
  
  /** Acciones por recurso */
  perResource?: {
    [resourceKey: string]: ActionConfig[]
  }
}

export interface ActionConfig {
  /** ID único de la acción */
  id: string
  
  /** Label visible */
  label: string
  
  /** Icono */
  icon?: string
  
  /** Variante visual */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  
  /** Tipo de acción */
  type: 'function' | 'api' | 'navigate' | 'modal' | 'download'
  
  /** Configuración según tipo */
  config: {
    /** Para tipo 'function': nombre de la función */
    functionName?: string
    
    /** Para tipo 'api': endpoint */
    endpoint?: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    
    /** Para tipo 'navigate': ruta */
    path?: string
    
    /** Para tipo 'modal': ID del modal */
    modalId?: string
    
    /** Confirmación requerida */
    requireConfirmation?: boolean
    confirmMessage?: string
    
    /** Mensaje de éxito */
    successMessage?: string
    
    /** Mensaje de error */
    errorMessage?: string
  }
  
  /** Permisos requeridos */
  requiredPermissions?: string[]
  
  /** Deshabilitar si condición */
  disabledWhen?: string // Expresión evaluable
}

export interface ApplicationConfig {
  /** Branding de la aplicación */
  branding: ApplicationBranding
  
  /** Configuración de tema */
  theme: ApplicationTheme
  
  /** Módulos habilitados */
  modules: ApplicationModule[]
  
  /** Fuentes de datos por recurso */
  dataSources?: {
    [resourceKey: string]: DataSourceConfig
  }
  
  /** Acciones configurables */
  actions?: ApplicationActions
  
  /** Configuraciones adicionales */
  features?: {
    /** Habilitar búsqueda global */
    globalSearch?: boolean
    
    /** Habilitar notificaciones push */
    pushNotifications?: boolean
    
    /** Habilitar modo offline */
    offlineMode?: boolean
    
    /** Habilitar analytics */
    analytics?: boolean
    
    /** Habilitar exportación de datos */
    dataExport?: boolean
    
    /** Formatos de exportación permitidos */
    exportFormats?: ('csv' | 'xlsx' | 'pdf' | 'json')[]
    
    /** Habilitar multi-idioma */
    i18n?: boolean
    
    /** Idiomas disponibles */
    availableLocales?: string[]
  }
  
  /** API Configuration */
  api?: {
    /** Base URL de la API */
    baseURL: string
    
    /** Timeout (ms) */
    timeout?: number
    
    /** Headers por defecto */
    defaultHeaders?: Record<string, string>
    
    /** Estrategia de autenticación */
    authStrategy?: 'jwt' | 'oauth' | 'apikey' | 'basic'
    
    /** Key para token en localStorage */
    tokenKey?: string
  }
}

// ============================================================================
// APLICACIONES CONFIGURADAS
// ============================================================================

/**
 * Configuración para la aplicación principal de FaruTech
 */
export const FARUTECH_APP_CONFIG: ApplicationConfig = {
  branding: {
    applicationId: 'farutech-dashboard',
    name: 'FaruTech Dashboard',
    logo: '/logo-farutech.svg',
    logoDark: '/logo-farutech-dark.svg',
    favicon: '/favicon-farutech.ico',
    pageTitle: 'FaruTech - Panel de Administración',
    description: 'Dashboard empresarial desarrollado por FaruTech'
  },
  
  theme: {
    primaryColor: '#3b82f6', // Blue
    secondaryColor: '#8b5cf6', // Purple
    accentColor: '#06b6d4', // Cyan
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '0.5rem',
    defaultMode: 'system',
    useGradients: true,
    gradientStyle: 'linear',
    gradientDirection: 135
  },
  
  modules: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: 'HomeIcon',
      path: '/',
      description: 'Panel principal con métricas y análisis',
      enabled: true,
      order: 1
    },
    {
      id: 'users',
      name: 'Usuarios',
      icon: 'UsersIcon',
      path: '/users',
      description: 'Gestión de usuarios del sistema',
      enabled: true,
      order: 2,
      requiredPermissions: ['users.view']
    },
    {
      id: 'crm',
      name: 'CRM',
      icon: 'UserGroupIcon',
      path: '/crm',
      description: 'Customer Relationship Management',
      enabled: true,
      order: 3
    },
    {
      id: 'sales',
      name: 'Ventas',
      icon: 'ShoppingCartIcon',
      path: '/ventas',
      description: 'Gestión de ventas y pedidos',
      enabled: true,
      order: 4
    },
    {
      id: 'inventory',
      name: 'Inventario',
      icon: 'CubeIcon',
      path: '/inventario',
      description: 'Control de inventario y almacén',
      enabled: true,
      order: 5
    },
    {
      id: 'reports',
      name: 'Reportes',
      icon: 'ChartBarIcon',
      path: '/reportes',
      description: 'Reportes y análisis de datos',
      enabled: true,
      order: 6
    }
  ],
  
  features: {
    globalSearch: true,
    pushNotifications: true,
    offlineMode: false,
    analytics: true,
    dataExport: true,
    exportFormats: ['csv', 'xlsx', 'pdf'],
    i18n: false
  },
  
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 30000,
    authStrategy: 'jwt',
    tokenKey: 'auth_token'
  }
}

/**
 * Configuración para aplicación de cliente externo (ejemplo)
 */
export const CLIENT_DEMO_APP_CONFIG: ApplicationConfig = {
  branding: {
    applicationId: 'client-portal',
    name: 'Portal Cliente Demo',
    logo: '/logo-client.svg',
    favicon: '/favicon-client.ico',
    backgroundImage: '/bg-client.jpg',
    pageTitle: 'Portal Cliente - Demo',
    description: 'Portal de cliente personalizado'
  },
  
  theme: {
    primaryColor: '#10b981', // Green
    secondaryColor: '#06b6d4', // Cyan
    fontFamily: 'Roboto, sans-serif',
    borderRadius: '0.75rem',
    defaultMode: 'light',
    useGradients: true,
    gradientStyle: 'linear',
    gradientDirection: 90
  },
  
  modules: [
    {
      id: 'dashboard',
      name: 'Inicio',
      icon: 'HomeIcon',
      path: '/',
      enabled: true,
      order: 1
    },
    {
      id: 'projects',
      name: 'Proyectos',
      icon: 'BriefcaseIcon',
      path: '/projects',
      enabled: true,
      order: 2
    },
    {
      id: 'invoices',
      name: 'Facturas',
      icon: 'DocumentTextIcon',
      path: '/invoices',
      enabled: true,
      order: 3
    },
    {
      id: 'support',
      name: 'Soporte',
      icon: 'QuestionMarkCircleIcon',
      path: '/support',
      enabled: true,
      order: 4
    }
  ],
  
  features: {
    globalSearch: false,
    pushNotifications: false,
    dataExport: false,
    i18n: true,
    availableLocales: ['es', 'en']
  },
  
  api: {
    baseURL: 'https://api.client-demo.com',
    timeout: 15000,
    authStrategy: 'oauth'
  }
}

/**
 * Registro de todas las aplicaciones disponibles
 */
export const APPLICATIONS_REGISTRY: Record<string, ApplicationConfig> = {
  'farutech-dashboard': FARUTECH_APP_CONFIG,
  'client-portal': CLIENT_DEMO_APP_CONFIG
}

/**
 * Obtener configuración por ID de aplicación
 */
export function getApplicationConfig(applicationId: string): ApplicationConfig {
  const config = APPLICATIONS_REGISTRY[applicationId]
  
  if (!config) {
    console.warn(`Application '${applicationId}' not found. Using default (FaruTech).`)
    return FARUTECH_APP_CONFIG
  }
  
  return config
}

/**
 * Aplicación activa por defecto
 */
export const DEFAULT_APPLICATION_ID = 'farutech-dashboard'

export default APPLICATIONS_REGISTRY
