import { useMemo } from 'react'
import { getMenuForModule, type MenuEntry, type MenuCategory, type MenuItemBase } from '@/config/menu.config'
import { useAuth } from './useAuth'
import { useModuleStore } from '@/store/moduleStore'
import { useMenuCache } from './useMenuCache'
import type { User } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/services/api.service'
import { ENDPOINTS } from '@/config/api.config'

function canView(user: User | null | undefined, permission?: string) {
  if (!permission) return true
  if (!user) return false
  if (!user.permissions || user.permissions.length === 0) return false
  return user.permissions.includes(permission)
}

export function useMenu() {
  const { user } = useAuth()
  const { currentModule } = useModuleStore()
  const { getMenu } = useMenuCache()

  // Try to fetch server-provided menu (override) using react-query
  const { data: serverMenu } = useQuery<MenuEntry[]>({
    queryKey: ['menu', user?.id, currentModule],
    queryFn: async () => {
      try {
        const res = await apiService.get<MenuEntry[]>(ENDPOINTS.auth.menu)
        return res.data
      } catch {
        return []
      }
    },
    enabled: !!user, // only try when user is available
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  const menu = useMemo(() => {
    /**
     * Sistema de Cache de Menú:
     * - El menú se cachea en memoria por módulo
     * - Al navegar entre páginas del MISMO módulo, el menú se reutiliza (no se reconstruye)
     * - Solo se recarga cuando cambias de módulo o cuando expira el cache (5 min)
     * - Esto permite que rutas compartidas (ej: /users) mantengan el menú del módulo actual
     */
    const source = (serverMenu && serverMenu.length > 0) ? serverMenu : getMenu(currentModule, getMenuForModule)
    const result: MenuEntry[] = []

    for (const entry of source) {
      if ('items' in entry && Array.isArray((entry as MenuCategory).items)) {
        const items = (entry as MenuCategory).items.filter((it) => canView(user, (it as any).permission))
        if (items.length > 0) {
          result.push({ ...(entry as MenuCategory), items })
        }
      } else {
        const item = entry as MenuItemBase
        if (canView(user, (item as any).permission)) {
          result.push(item)
        }
      }
    }

    return result
  }, [serverMenu, currentModule, user])

  return { menu, user }
}
