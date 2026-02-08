# Mini-Program (MP) Development Guide

## 📋 Table of Contents
- [Introduction](#introduction)
- [Architecture Overview](#architecture-overview)
- [MP Structure](#mp-structure)
- [Creating a New MP](#creating-a-new-mp)
- [CRUD Configuration](#crud-configuration)
- [Permissions](#permissions)
- [Best Practices](#best-practices)

---

## Introduction

Mini-Programs (MPs) are **autonomous, self-contained applications** within the Farutech ecosystem. Each MP represents a complete functional domain (e.g., Customers, Products, Orders) with its own:
- ✅ Business logic
- ✅ CRUD operations
- ✅ API integration
- ✅ Forms and validations
- ✅ Internal routing

**Dashboard = Orchestrator ONLY**. It should NOT contain business logic or CRUDs.

---

## Architecture Overview

```
Dashboard (Orchestrator)
├── AppShell (Layout)
│   ├── AppHeader
│   ├── Sidebar (Dynamic Menu from MP configs)
│   └── Main Content (MP render area)
├── MpLoader (Dynamic lazy loading)
└── MenuBuilder (Constructs menu from MPs)

Mini-Program (MP)
├── mp.config.ts (MP contract)
├── routes.tsx (Internal routes)
├── api/ (API clients)
├── crud/ (CRUD configs)
├── pages/ (UI pages)
├── components/ (Reusable components)
└── index.ts (Main export)
```

**Key Principles:**
1. **Dashboard:** Shell only, no business logic
2. **MPs:** Complete applications with full CRUD
3. **Dynamic Menu:** Built from MP configs at runtime
4. **Lazy Loading:** MPs loaded on-demand with Suspense
5. **Permissions:** MP-level and route-level permissions
6. **Design System:** All UI from `@farutech/design-system`

---

## MP Structure

Every MP **MUST** follow this structure:

```
src/02.Apps/Ordeon/MP/<mp-name>/
├── mp.config.ts          ✅ REQUIRED - MP configuration
├── routes.tsx            ✅ REQUIRED - Internal routes
├── index.ts              ✅ REQUIRED - Main export
├── api/
│   └── <entity>.api.ts   ✅ API client
├── crud/
│   └── <entity>.crud.ts  ✅ CRUD configuration
├── pages/
│   ├── <Entity>List.tsx  ✅ List page
│   ├── <Entity>Create.tsx ✅ Create page
│   └── <Entity>Edit.tsx   ✅ Edit page
└── components/
    └── <Entity>Form.tsx   ✅ Reusable form
```

### Example: Customers MP

```
src/02.Apps/Ordeon/MP/customers/
├── mp.config.ts
├── routes.tsx
├── index.ts
├── api/
│   └── customers.api.ts
├── crud/
│   └── customers.crud.ts
├── pages/
│   ├── CustomersList.tsx
│   ├── CustomerCreate.tsx
│   └── CustomerEdit.tsx
└── components/
    └── CustomerForm.tsx
```

---

## Creating a New MP

### Step 1: Create MP Configuration

**File:** `mp.config.ts`

```typescript
import type { MpConfig } from '../../../../Frontend/Dashboard/src/types/mp.types';

export const customersConfig: MpConfig = {
  id: 'customers',              // Unique ID
  name: 'Clientes',             // Display name
  basePath: '/customers',       // Base route
  icon: 'UserGroupIcon',        // Heroicon name
  version: '1.0.0',             // Semantic version
  permissions: ['customers.read', 'customers.write'],
  category: 'CRM',              // Menu category
  order: 1,                     // Display order
  enabled: true,                // Enable/disable MP
  metadata: {
    description: 'Gestión completa de clientes',
    author: 'Farutech',
  },
};
```

### Step 2: Create API Client

**File:** `api/customers.api.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface CustomerCreateDto {
  name: string;
  email: string;
  phone: string;
}

export const customersApi = {
  async getAll(params?: { page?: number; search?: string }) {
    const response = await axios.get(`${API_BASE_URL}/customers`, { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
    return response.data;
  },

  async create(data: CustomerCreateDto) {
    const response = await axios.post(`${API_BASE_URL}/customers`, data);
    return response.data;
  },

  async update(id: string, data: Partial<CustomerCreateDto>) {
    const response = await axios.put(`${API_BASE_URL}/customers/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await axios.delete(`${API_BASE_URL}/customers/${id}`);
  },
};
```

### Step 3: Create Internal Routes

**File:** `routes.tsx`

```typescript
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { MpRoute } from '../../../../Frontend/Dashboard/src/types/mp.types';

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
```

### Step 4: Create Main Export

**File:** `index.ts`

```typescript
import type { MpExport } from '../../../Frontend/Dashboard/src/types/mp.types';
import { customersConfig } from './mp.config';
import { customersRoutes, CustomersRoutes } from './routes';

export const customersMp: MpExport = {
  config: customersConfig,
  routes: customersRoutes,
};

export { CustomersRoutes };
export default CustomersRoutes;
```

### Step 5: Register in MP_REGISTRY

**File:** `Dashboard/src/routing/MpLoader.tsx`

```typescript
const MP_REGISTRY: Record<string, () => Promise<any>> = {
  customers: () => import('../../../../Ordeon/MP/customers'),
  products: () => import('../../../../Ordeon/MP/products'),  // Add new MP
};
```

### Step 6: Register in mp-registry.ts

**File:** `Dashboard/src/config/mp-registry.ts`

```typescript
import { customersConfig } from '../../../Ordeon/MP/customers/mp.config';
import { productsConfig } from '../../../Ordeon/MP/products/mp.config';  // Add import

const ALL_MPS: MpConfig[] = [
  customersConfig,
  productsConfig,  // Add config
];
```

### Step 7: Add Route in App.tsx

**File:** `Dashboard/src/App.tsx`

```typescript
<Route path="/customers/*" element={<MpLoader mpId="customers" />} />
<Route path="/products/*" element={<MpLoader mpId="products" />} />  {/* Add route */}
```

---

## CRUD Configuration

MPs use **configuration-driven CRUD**, not manual implementations.

**File:** `crud/<entity>.crud.ts`

```typescript
import type { CrudColumn, CrudAction } from '@farutech/design-system';
import type { Customer } from '../api/customers.api';

export const customersCrudConfig = {
  /**
   * Table columns
   */
  columns: [
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      searchable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      searchable: true,
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      render: (value: string) => (
        <span className={`badge ${value === 'active' ? 'badge-success' : 'badge-gray'}`}>
          {value === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ] as CrudColumn<Customer>[],

  /**
   * Global actions (top of table)
   */
  globalActions: [
    {
      key: 'create',
      label: 'Nuevo Cliente',
      icon: 'PlusIcon',
      variant: 'primary',
      permissions: ['customers.write'],
    },
    {
      key: 'export',
      label: 'Exportar',
      icon: 'ArrowDownTrayIcon',
      variant: 'secondary',
    },
  ] as CrudAction[],

  /**
   * Row actions (per record)
   */
  rowActions: [
    {
      key: 'edit',
      label: 'Editar',
      icon: 'PencilIcon',
      variant: 'primary',
      permissions: ['customers.write'],
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: 'TrashIcon',
      variant: 'danger',
      requiresConfirmation: true,
      permissions: ['customers.delete'],
    },
  ] as CrudAction[],

  /**
   * Pagination
   */
  pagination: {
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
  },
};
```

---

## Permissions

### MP-Level Permissions

Defined in `mp.config.ts`:

```typescript
permissions: ['customers.read', 'customers.write']
```

User must have **ALL** listed permissions to access the MP.

### Route-Level Permissions

Defined in `routes.tsx`:

```typescript
{
  path: '/create',
  component: CustomerCreate,
  permissions: ['customers.write'],
}
```

User must have **ALL** route permissions to access that specific route.

### Checking Permissions in Code

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { hasPermission, hasAllPermissions } = useAuth();

// Single permission
if (hasPermission('customers.write')) {
  // Show create button
}

// Multiple permissions
if (hasAllPermissions(['customers.write', 'customers.admin'])) {
  // Show admin actions
}
```

---

## Best Practices

### ✅ DO

1. **Use Design System components** (`@farutech/design-system`)
2. **Follow CRUD config pattern** (no manual table implementations)
3. **Lazy load all pages** with `React.lazy()`
4. **Use TypeScript strictly** for all interfaces
5. **Handle loading and error states** in API calls
6. **Use semantic versioning** for MP versions
7. **Keep MPs autonomous** (no cross-MP dependencies)
8. **Export MpExport contract** in `index.ts`
9. **Use consistent naming** (`<Entity>List`, `<Entity>Create`, `<Entity>Edit`)
10. **Document API contracts** with JSDoc

### ❌ DON'T

1. **Don't add business logic to Dashboard**
2. **Don't create manual CRUD tables** (use config)
3. **Don't hardcode API URLs** (use env variables)
4. **Don't skip permission checks**
5. **Don't import one MP from another** (MPs are isolated)
6. **Don't use legacy routing** (use MP routes)
7. **Don't skip error boundaries**
8. **Don't forget to update MP_REGISTRY** when creating new MPs

---

## Complete Example: Products MP

### 1. mp.config.ts
```typescript
export const productsConfig: MpConfig = {
  id: 'products',
  name: 'Productos',
  basePath: '/products',
  icon: 'ShoppingBagIcon',
  version: '1.0.0',
  permissions: ['products.read'],
  category: 'Inventario',
  order: 2,
  enabled: true,
  metadata: {
    description: 'Gestión de catálogo de productos',
    author: 'Farutech',
  },
};
```

### 2. api/products.api.ts
```typescript
export const productsApi = {
  async getAll() { /* ... */ },
  async getById(id: string) { /* ... */ },
  async create(data: ProductCreateDto) { /* ... */ },
  async update(id: string, data: ProductUpdateDto) { /* ... */ },
  async delete(id: string) { /* ... */ },
};
```

### 3. routes.tsx
```typescript
export const productsRoutes: MpRoute[] = [
  { path: '/', component: ProductsList, permissions: ['products.read'] },
  { path: '/create', component: ProductCreate, permissions: ['products.write'] },
  { path: '/:id/edit', component: ProductEdit, permissions: ['products.write'] },
];
```

### 4. index.ts
```typescript
export const productsMp: MpExport = {
  config: productsConfig,
  routes: productsRoutes,
};

export default ProductsRoutes;
```

---

## Questions?

For more information, contact the architecture team or review:
- [MP Type Definitions](../Dashboard/src/types/mp.types.ts)
- [MenuBuilder](../Dashboard/src/menu/menu.builder.ts)
- [MpLoader](../Dashboard/src/routing/MpLoader.tsx)
- [Example: Customers MP](../Ordeon/MP/customers/)
