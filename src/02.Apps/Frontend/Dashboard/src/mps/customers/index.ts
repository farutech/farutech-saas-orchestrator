// ============================================================================
// CUSTOMERS MP - Main Export
// ============================================================================

import type { MpExport } from '@dashboard/types/mp.types';
import { customersConfig } from './mp.config';
import { customersRoutes, CustomersRoutes } from './routes';

export const customersMp: MpExport = {
  config: customersConfig,
  routes: customersRoutes,
};

export { CustomersRoutes };
export default CustomersRoutes;
