/**
 * Hook para gestionar el cache del menú
 * Mantiene el menú cargado sin reconstruirlo al navegar entre páginas del mismo módulo
 */

import { useEffect, useRef } from 'react'
import { useModuleStore } from '@/store/moduleStore'
import type { MenuEntry } from '@/config/menu.config'

interface MenuCache {
  moduleId: string
  menu: MenuEntry[]
  timestamp: number
}

// Cache persistente en memoria (sobrevive a re-renders)
const menuCache = new Map<string, MenuCache>()

// TTL del cache en milisegundos (5 minutos)
const CACHE_TTL = 5 * 60 * 1000

export function useMenuCache() {
  const { currentModule } = useModuleStore()
  const previousModuleRef = useRef<string | null>(null)
  const menuRef = useRef<MenuEntry[] | null>(null)

  /**
   * Obtener menú del cache o cargarlo
   */
  const getMenu = (moduleId: string, getMenuForModule: (id: string) => MenuEntry[]): MenuEntry[] => {
    const now = Date.now()
    const cached = menuCache.get(moduleId)

    // Si hay cache válido, usarlo
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return cached.menu
    }

    // Si no hay cache o expiró, cargar y cachear
    const menu = getMenuForModule(moduleId)
    menuCache.set(moduleId, {
      moduleId,
      menu,
      timestamp: now
    })

    return menu
  }

  /**
   * Invalidar cache de un módulo específico
   */
  const invalidateCache = (moduleId: string) => {
    menuCache.delete(moduleId)
  }

  /**
   * Limpiar todo el cache
   */
  const clearCache = () => {
    menuCache.clear()
  }

  /**
   * Limpiar cache expirado
   */
  const cleanExpiredCache = () => {
    const now = Date.now()
    for (const [key, value] of menuCache.entries()) {
      if ((now - value.timestamp) >= CACHE_TTL) {
        menuCache.delete(key)
      }
    }
  }

  /**
   * Detectar cambio de módulo
   */
  useEffect(() => {
    if (previousModuleRef.current !== null && previousModuleRef.current !== currentModule) {
      // Módulo cambió - limpiar cache expirado
      cleanExpiredCache()
    }
    previousModuleRef.current = currentModule
  }, [currentModule])

  return {
    getMenu,
    invalidateCache,
    clearCache,
    cleanExpiredCache,
    menuRef,
  }
}
