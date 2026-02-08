/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                     APPLICATION STORE (Multi-Tenant)                       ║
 * ║                                                                            ║
 * ║  Store Zustand para gestión de aplicaciones multi-tenant                 ║
 * ║  - Cambio dinámico de aplicación                                         ║
 * ║  - Aplicación de theming automático                                       ║
 * ║  - Persistencia de configuración                                          ║
 * ║  - Generación de gradientes dinámicos                                     ║
 * ║                                                                            ║
 * ║  @author    Farid Maloof Suarez                                           ║
 * ║  @company   FaruTech                                                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getApplicationConfig,
  DEFAULT_APPLICATION_ID,
  type ApplicationConfig
} from '@/config/applications.config'
import { generateGradients, applyCSSVariables, hexToRgb } from '@/utils/theme-generator'

interface ApplicationState {
  /** ID de la aplicación activa */
  currentApplicationId: string
  
  /** Configuración de la aplicación activa */
  config: ApplicationConfig
  
  /** Gradientes generados */
  gradients: Record<string, string>
  
  /** Cambiar aplicación */
  setApplication: (applicationId: string) => void
  
  /** Recargar configuración de aplicación actual */
  reloadConfig: () => void
  
  /** Obtener configuración actual */
  getConfig: () => ApplicationConfig
  
  /** Aplicar tema personalizado temporal */
  applyCustomTheme: (theme: Partial<ApplicationConfig['theme']>) => void
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      currentApplicationId: DEFAULT_APPLICATION_ID,
      config: getApplicationConfig(DEFAULT_APPLICATION_ID),
      gradients: {},
      
      setApplication: (applicationId: string) => {
        const config = getApplicationConfig(applicationId)
        const gradients = generateGradients(config.theme)
        
        // Aplicar CSS variables
        applyCSSVariables(config.theme, gradients)
        
        // Aplicar branding
        applyBranding(config)
        
        set({
          currentApplicationId: applicationId,
          config,
          gradients
        })
      },
      
      reloadConfig: () => {
        const { currentApplicationId } = get()
        const config = getApplicationConfig(currentApplicationId)
        const gradients = generateGradients(config.theme)
        
        applyCSSVariables(config.theme, gradients)
        applyBranding(config)
        
        set({ config, gradients })
      },
      
      getConfig: () => get().config,
      
      applyCustomTheme: (customTheme) => {
        const { config } = get()
        const updatedTheme = { ...config.theme, ...customTheme }
        const gradients = generateGradients(updatedTheme)
        
        applyCSSVariables(updatedTheme, gradients)
        
        set({
          config: {
            ...config,
            theme: updatedTheme
          },
          gradients
        })
      }
    }),
    {
      name: 'application-storage',
      partialize: (state) => ({
        currentApplicationId: state.currentApplicationId
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Re-aplicar configuración al hidratar
          const config = getApplicationConfig(state.currentApplicationId)
          const gradients = generateGradients(config.theme)
          applyCSSVariables(config.theme, gradients)
          applyBranding(config)
        }
      }
    }
  )
)

/**
 * Aplicar branding de la aplicación (favicon, title, etc)
 */
function applyBranding(config: ApplicationConfig) {
  // Title
  document.title = config.branding.pageTitle
  
  // Meta description
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', config.branding.description)
  
  // Favicon
  let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
  if (!favicon) {
    favicon = document.createElement('link')
    favicon.rel = 'icon'
    document.head.appendChild(favicon)
  }
  favicon.href = config.branding.favicon
  
  // CSS Custom Property para logo
  document.documentElement.style.setProperty('--app-logo-url', `url(${config.branding.logo})`)
  
  if (config.branding.logoDark) {
    document.documentElement.style.setProperty('--app-logo-dark-url', `url(${config.branding.logoDark})`)
  }
  
  // Background image si existe
  if (config.branding.backgroundImage) {
    document.documentElement.style.setProperty('--app-bg-image', `url(${config.branding.backgroundImage})`)
  }
}

/**
 * Hook para acceso simplificado a configuración
 */
export function useAppConfig() {
  const config = useApplicationStore((state) => state.config)
  return config
}

/**
 * Hook para acceso a branding
 */
export function useAppBranding() {
  const branding = useApplicationStore((state) => state.config.branding)
  return branding
}

/**
 * Hook para acceso a tema
 */
export function useAppTheme() {
  const theme = useApplicationStore((state) => state.config.theme)
  const gradients = useApplicationStore((state) => state.gradients)
  return { theme, gradients }
}

/**
 * Hook para acceso a módulos
 */
export function useAppModules() {
  const modules = useApplicationStore((state) => state.config.modules)
  return modules.filter(m => m.enabled).sort((a, b) => a.order - b.order)
}

/**
 * Hook para verificar si una feature está habilitada
 */
export function useAppFeature(featureName: keyof NonNullable<ApplicationConfig['features']>) {
  const features = useApplicationStore((state) => state.config.features)
  return features?.[featureName] ?? false
}

// Inicializar aplicación al cargar el módulo
if (typeof window !== 'undefined') {
  const store = useApplicationStore.getState()
  const config = getApplicationConfig(store.currentApplicationId)
  const gradients = generateGradients(config.theme)
  applyCSSVariables(config.theme, gradients)
  applyBranding(config)
}
