// ============================================================================
// SIDEBAR STORE - Zustand Store for Sidebar State
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SidebarState {
  // State
  isOpen: boolean;
  isMobile: boolean;
  sidebarWidth: number;

  // Actions
  toggle: () => void;
  open: () => void;
  close: () => void;
  setMobile: (isMobile: boolean) => void;
  setSidebarWidth: (width: number) => void;
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isOpen: true,
        isMobile: false,
        sidebarWidth: 280,

        // Toggle sidebar
        toggle: () => set((state) => ({ isOpen: !state.isOpen })),

        // Open sidebar
        open: () => set({ isOpen: true }),

        // Close sidebar
        close: () => set({ isOpen: false }),

        // Set mobile mode
        setMobile: (isMobile: boolean) => set({ isMobile }),

        // Set sidebar width
        setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
      }),
      {
        name: 'sidebar-storage',
        partialize: (state) => ({
          isOpen: state.isOpen,
          sidebarWidth: state.sidebarWidth,
        }),
      }
    ),
    { name: 'SidebarStore' }
  )
);

// Hook para detectar mobile y actualizar el store
if (typeof window !== 'undefined') {
  const checkMobile = () => {
    const isMobile = window.innerWidth < 768;
    useSidebarStore.getState().setMobile(isMobile);
    if (isMobile) {
      useSidebarStore.getState().close();
    }
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);
}
