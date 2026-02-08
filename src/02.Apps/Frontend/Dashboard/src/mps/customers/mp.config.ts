// ============================================================================
// CUSTOMERS MP - Configuration
// ============================================================================

import type { MpConfig } from '@dashboard/types/mp.types';

export const customersConfig: MpConfig = {
  id: 'customers',
  name: 'Clientes',
  basePath: '/customers',
  icon: 'UserGroupIcon',
  version: '1.0.0',
  permissions: ['customers.read', 'customers.write'],
  category: 'CRM',
  order: 1,
  enabled: true,
  metadata: {
    description: 'Gestión completa de clientes',
    author: 'Farutech',
  },
};
