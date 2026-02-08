// ============================================================================
// MENU STORE - Zustand Store for Dynamic Menu
// ============================================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { MenuStructure } from '../menu/menu.types';
import type { MpConfig } from '../types/mp.types';
import { MenuBuilder } from '../menu/menu.builder';

interface MenuState {
  // State
  menuStructure: MenuStructure;
  registeredMps: MpConfig[];
  userPermissions: string[];
  
  // Actions
  setUserPermissions: (permissions: string[]) => void;
  registerMps: (mps: MpConfig[]) => void;
  rebuildMenu: () => void;
}

export const useMenuStore = create<MenuState>()(
  devtools(
    (set, get) => ({
      // Initial state
      menuStructure: { categories: [] },
      registeredMps: [],
      userPermissions: [],

      // Set user permissions and rebuild menu
      setUserPermissions: (permissions: string[]) => {
        set({ userPermissions: permissions });
        get().rebuildMenu();
      },

      // Register MPs and rebuild menu
      registerMps: (mps: MpConfig[]) => {
        set({ registeredMps: mps });
        get().rebuildMenu();
      },

      // Rebuild menu from registered MPs
      rebuildMenu: () => {
        const { registeredMps, userPermissions } = get();
        
        const menuBuilder = new MenuBuilder(userPermissions);
        const menuStructure = menuBuilder
          .registerMps(registeredMps)
          .build();

        set({ menuStructure });
      },
    }),
    { name: 'MenuStore' }
  )
);
