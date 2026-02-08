/**
 * Store de Zustand para el estado del sidebar
 */

import { create } from 'zustand'

interface SidebarStore {
  isOpen: boolean
  isMobile: boolean
  sidebarWidth: number
  open: () => void
  close: () => void
  toggle: () => void
  setMobile: (isMobile: boolean) => void
  setSidebarWidth: (width: number) => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  isMobile: false,
  sidebarWidth: 256,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setMobile: (isMobile) => set({ isMobile }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
}))
