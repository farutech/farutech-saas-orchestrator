import { apiClient } from '@/lib/api-client';
import type { MostUsedOrganization, UsageAction, UsageLogRequest } from '@/types/api';

export const usageService = {
  trackUsage: async (organizationId: string, action: UsageAction): Promise<void> => {
    const payload: UsageLogRequest = { organizationId, action };
    await apiClient.post('/api/usage-log', payload);
  },

  getMostUsed: async (limit = 10): Promise<MostUsedOrganization[]> => {
    const { data } = await apiClient.get<unknown>('/api/users/me/most-used', {
      params: { limit }
    });

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter((item): item is MostUsedOrganization => (
      typeof item === 'object' &&
      item !== null &&
      typeof (item as MostUsedOrganization).organizationId === 'string' &&
      typeof (item as MostUsedOrganization).count === 'number' &&
      typeof (item as MostUsedOrganization).lastAccessed === 'string'
    ));
  }
};
