// ============================================================================
// INSTANCES SERVICE - API calls for tenant instances
// ============================================================================

import { apiClient } from '@/lib/api-client';
import type { TenantInstance } from '@/types/api';

export const instancesService = {
  /**
   * GET /api/Instances
   * Get all tenant instances for current user
   */
  getInstances: async (): Promise<TenantInstance[]> => {
    const { data } = await apiClient.get<TenantInstance[]>('/api/Instances');
    return data;
  },

  /**
   * GET /api/Instances/{id}
   * Get specific tenant instance by ID
   */
  getInstance: async (id: string): Promise<TenantInstance> => {
    const { data } = await apiClient.get<TenantInstance>(`/api/Instances/${id}`);
    return data;
  },
};
