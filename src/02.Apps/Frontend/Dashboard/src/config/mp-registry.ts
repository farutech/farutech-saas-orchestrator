// ============================================================================
// MP REGISTRY - Bootstrap MPs
// ============================================================================

import { useMenuStore } from '../store/menuStore';
import type { MpConfig } from '../types/mp.types';

// Import MP configs
import { customersConfig } from '../mps/customers/mp.config';

/**
 * All available MPs configuration
 */
const ALL_MPS: MpConfig[] = [
  customersConfig,
  // Add more MP configs as they are created:
  // productsConfig,
  // ordersConfig,
];

/**
 * Bootstrap function to register all MPs
 * Call this in App.tsx or main.tsx on app initialization
 */
export const bootstrapMps = () => {
  // Register all MPs in menuStore
  useMenuStore.getState().registerMps(ALL_MPS);

  console.log(`✅ Registered ${ALL_MPS.length} Mini-Programs:`, 
    ALL_MPS.map(mp => `${mp.id} v${mp.version}`).join(', ')
  );
};

/**
 * Get MP config by ID
 */
export const getMpConfig = (mpId: string): MpConfig | undefined => {
  return ALL_MPS.find(mp => mp.id === mpId);
};

/**
 * Get all enabled MPs
 */
export const getEnabledMps = (): MpConfig[] => {
  return ALL_MPS.filter(mp => mp.enabled);
};
