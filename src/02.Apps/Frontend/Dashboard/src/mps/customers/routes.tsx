// ============================================================================
// CUSTOMERS MP - Internal Routes
// ============================================================================

import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { MpRoute } from '@dashboard/types/mp.types';

// Lazy load pages
const CustomersList = lazy(() => import('./pages/CustomersList').then(m => ({ default: m.CustomersList })));
const CustomerCreate = lazy(() => import('./pages/CustomerCreate').then(m => ({ default: m.CustomerCreate })));
const CustomerEdit = lazy(() => import('./pages/CustomerEdit').then(m => ({ default: m.CustomerEdit })));

export const customersRoutes: MpRoute[] = [
  {
    path: '/',
    component: CustomersList,
    exact: true,
    permissions: ['customers.read'],
  },
  {
    path: '/create',
    component: CustomerCreate,
    exact: true,
    permissions: ['customers.write'],
  },
  {
    path: '/:id/edit',
    component: CustomerEdit,
    exact: false,
    permissions: ['customers.write'],
  },
];

// Routes Component for MP
export const CustomersRoutes = () => {
  return (
    <Routes>
      {customersRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<route.component />}
        />
      ))}
    </Routes>
  );
};
