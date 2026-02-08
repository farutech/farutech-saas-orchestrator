/**
 * Context para configuración de marca (SaaS)
 * Optimizado para rendimiento sin re-renders innecesarios
 */

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import type { AppConfig } from '@/types'

// Extender Window para la API de consola
declare global {
  interface Window {
    AppConfig?: {
      reset: () => void
      resetToDefault: () => void
      setAsDefault: () => void
      getCurrent: () => AppConfig
      getDefault: () => AppConfig
    }
  }
}

// Configuración por defecto
const DEFAULT_CONFIG: AppConfig = {
  brandName: 'FaruTech',
  pageTitle: 'FaruTech - Admin Panel',
  logoUrl: '/Logo.png',
  logoFullUrl: '/Logo_Full.png',
  version: 'v1.0.0',
  copyright: '© 2025 FaruTech',
  primaryColor: '#ffffff',
  description: 'Gestiona tu negocio de manera eficiente con nuestra plataforma integral de administración',
  supportEmail: 'soporte@farutech.com',
  passwordRecoveryMethod: 'email', // Por defecto: envío automático
}

// Keys para localStorage
const STORAGE_KEY = 'app_brand_config'
const STORAGE_DEFAULT_KEY = 'app_brand_config_default' // Guardar defaults separados
const STORAGE_TIMESTAMP_KEY = 'app_brand_config_timestamp'
const CACHE_DURATION = 1000 * 60 * 60 // 1 hora

interface ConfigContextType {
  config: AppConfig
  defaultConfig: AppConfig // Exponer config por defecto
  updateConfig: (newConfig: Partial<AppConfig>) => Promise<void>
  resetConfig: () => void
  resetToDefault: () => void 
  setAsDefault: () => void
  isLoading: boolean
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

// Hook para usar el context
export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig debe ser usado dentro de ConfigProvider')
  }
  return context
}

// Provider component
export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG)
  const [defaultConfig, setDefaultConfig] = useState<AppConfig>(DEFAULT_CONFIG)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar configuración desde localStorage o API
  useEffect(() => {
    loadConfig()
  }, [])

  // Actualizar document.title cuando cambie pageTitle
  useEffect(() => {
    document.title = config.pageTitle
  }, [config.pageTitle])

  // Actualizar favicon cuando cambie logoUrl
  useEffect(() => {
    updateFavicon(config.logoUrl)
  }, [config.logoUrl])

  // Exponer API en consola para administradores
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.AppConfig = {
        reset: resetConfig,
        resetToDefault,
        setAsDefault,
        getCurrent: () => config,
        getDefault: () => defaultConfig
      }
    }
    
    // Cleanup al desmontar
    return () => {
      if (typeof window !== 'undefined') {
        delete window.AppConfig
      }
    }
  }, [config, defaultConfig])

  const loadConfig = async () => {
    try {
      // 1. Cargar defaults guardados
      const savedDefaults = loadDefaultsFromStorage()
      if (savedDefaults) {
        setDefaultConfig(savedDefaults)
      }

      // 2. Intentar cargar desde cache (localStorage)
      const cached = loadFromCache()
      if (cached) {
        setConfig(cached)
        setIsLoading(false)
        return
      }

      // 3. Si no hay cache válido, cargar desde API
      // TODO: Implementar llamada real al backend
      // const response = await fetch('/api/config/brand')
      // const data = await response.json()
      
      // Por ahora, usar configuración por defecto o la guardada
      const configToUse = savedDefaults || DEFAULT_CONFIG
      
      setConfig(configToUse)
      saveToCache(configToUse)
    } catch (error) {
      console.error('Error loading brand config:', error)
      setConfig(defaultConfig)
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = useCallback(async (newConfig: Partial<AppConfig>) => {
    try {
      // 1. Actualizar en el backend
      // TODO: Implementar llamada real al backend
      // await fetch('/api/config/brand', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newConfig)
      // })

      // 2. Actualizar estado local
      const updatedConfig = { ...config, ...newConfig }
      setConfig(updatedConfig)
      
      // 3. Actualizar cache
      saveToCache(updatedConfig)
    } catch (error) {
      console.error('Error updating brand config:', error)
      throw error
    }
  }, [config])

  const resetConfig = useCallback(() => {
    // Resetear a los defaults guardados (no los originales)
    setConfig(defaultConfig)
    saveToCache(defaultConfig)
  }, [defaultConfig])

  const resetToDefault = useCallback(() => {
    // Resetear a los defaults originales del sistema
    setConfig(DEFAULT_CONFIG)
    setDefaultConfig(DEFAULT_CONFIG)
    saveToCache(DEFAULT_CONFIG)
    saveDefaultsToStorage(DEFAULT_CONFIG)
  }, [])

  const setAsDefault = useCallback(() => {
    // Establecer la configuración actual como nueva configuración por defecto
    setDefaultConfig(config)
    saveDefaultsToStorage(config)
  }, [config])

  // Memoizar el valor del context para evitar re-renders
  const value = useMemo(
    () => ({
      config,
      defaultConfig,
      updateConfig,
      resetConfig,
      resetToDefault,
      setAsDefault,
      isLoading,
    }),
    [config, defaultConfig, updateConfig, resetConfig, resetToDefault, setAsDefault, isLoading]
  )

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

// Helper functions

function loadFromCache(): AppConfig | null {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY)
    
    if (!cached || !timestamp) return null
    
    // Verificar si el cache expiró
    const age = Date.now() - parseInt(timestamp, 10)
    if (age > CACHE_DURATION) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_TIMESTAMP_KEY)
      return null
    }
    
    return JSON.parse(cached) as AppConfig
  } catch (error) {
    console.error('Error loading config from cache:', error)
    return null
  }
}

function loadDefaultsFromStorage(): AppConfig | null {
  try {
    const defaults = localStorage.getItem(STORAGE_DEFAULT_KEY)
    if (!defaults) return null
    return JSON.parse(defaults) as AppConfig
  } catch (error) {
    console.error('Error loading defaults from storage:', error)
    return null
  }
}

function saveDefaultsToStorage(config: AppConfig) {
  try {
    localStorage.setItem(STORAGE_DEFAULT_KEY, JSON.stringify(config))
  } catch (error) {
    console.error('Error saving defaults to storage:', error)
  }
}

function saveToCache(config: AppConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.error('Error saving config to cache:', error)
  }
}

function updateFavicon(logoUrl: string) {
  try {
    // Actualizar favicon
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = logoUrl
  } catch (error) {
    console.error('Error updating favicon:', error)
  }
}

