/**
 * Store para sistema de notificaciones toast
 */

import { create } from 'zustand'
import type { Notification } from '@/types'

interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7)
    const newNotification: Notification = {
      id,
      duration: 5000, // 5 segundos por defecto
      ...notification,
    }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // Auto-remover después de la duración
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      }, newNotification.duration)
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearAll: () => {
    set({ notifications: [] })
  },
}))

// Helper para uso rápido
export const notify = {
  success: (title: string, message?: string) => {
    useNotificationStore.getState().addNotification({ type: 'success', title, message })
  },
  error: (title: string, message?: string) => {
    useNotificationStore.getState().addNotification({ type: 'error', title, message })
  },
  warning: (title: string, message?: string) => {
    useNotificationStore.getState().addNotification({ type: 'warning', title, message })
  },
  info: (title: string, message?: string) => {
    useNotificationStore.getState().addNotification({ type: 'info', title, message })
  },
}
