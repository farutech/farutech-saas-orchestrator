// ============================================================================
// PROVISIONING SERVICE - API calls for tenant provisioning
// ============================================================================

import { apiClient } from '@/lib/api-client';
import type {
  ProvisionTenantRequest,
  ProvisionTenantResponse,
} from '@/types/api';

export const provisioningService = {
  /**
   * POST /api/Provisioning/provision
   * Provision a new tenant instance
   */
  provisionTenant: async (request: ProvisionTenantRequest): Promise<ProvisionTenantResponse> => {
    const { data } = await apiClient.post<ProvisionTenantResponse>(
      '/api/Provisioning/provision',
      request
    );
    return data;
  },

  /**
   * DELETE /api/Provisioning/{tenantInstanceId}
   * Deprovision tenant instance
   */
  deprovisionTenant: async (tenantInstanceId: string): Promise<void> => {
    await apiClient.delete(`/api/Provisioning/${tenantInstanceId}`);
  },

  /**
   * PUT /api/Provisioning/{tenantInstanceId}/features
   * Update tenant features
   */
  updateTenantFeatures: async (
    tenantInstanceId: string,
    features: Record<string, unknown>
  ): Promise<void> => {
    await apiClient.put(`/api/Provisioning/${tenantInstanceId}/features`, features);
  },
};
