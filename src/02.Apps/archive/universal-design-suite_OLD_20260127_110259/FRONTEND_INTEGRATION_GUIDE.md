# Farutech POS & Services - Frontend Integration Guide

## Overview
This guide explains how to integrate the new backend APIs for product marketplace and permission-based access control in the frontend.

## Backend APIs Added

### 1. Product Manifest API
**Endpoint:** `GET /api/Catalog/products/{productId}/manifest`
**Purpose:** Retrieve complete product information including modules, features, and required permissions

**Response Structure:**
```typescript
interface ProductManifestDto {
  id: string;
  name?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  modules?: ModuleManifestDto[];
}

interface ModuleManifestDto {
  id: string;
  code?: string;
  name?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  features?: FeatureManifestDto[];
}

interface FeatureManifestDto {
  id: string;
  code?: string;
  name?: string;
  description?: string;
  isActive: boolean;
  requiresLicense: boolean;
  additionalCost?: number;
  createdAt: string;
  updatedAt?: string;
  permissions?: PermissionDto[];
}
```

### 2. User Permissions API
**Endpoint:** `GET /api/Auth/me/permissions`
**Purpose:** Get current user's permissions for access control

**Response Structure:**
```typescript
interface PermissionDto {
  id: string;
  code?: string;
  name?: string;
  description?: string;
  module?: string;
  category?: string;
  isCritical: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
```

## Frontend Implementation

### 1. Services Updated

#### Catalog Service (`src/services/catalog.service.ts`)
Added `getProductManifest` function:
```typescript
getProductManifest: async (productId: string): Promise<ProductManifestDto> => {
  const { data } = await apiClient.get<ProductManifestDto>(
    `/api/Catalog/products/${productId}/manifest`
  );
  return data;
}
```

#### Auth Service (`src/services/auth.service.ts`)
Added `getMyPermissions` function:
```typescript
getMyPermissions: async (): Promise<PermissionDto[]> => {
  const { data } = await apiClient.get<PermissionDto[]>('/api/Auth/me/permissions');
  return data;
}
```

### 2. Custom Hook for Permissions

#### `usePermissions` Hook (`src/hooks/usePermissions.ts`)
Provides permission checking utilities:
```typescript
const {
  permissions,
  loading,
  error,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  refetch
} = usePermissions();

// Check single permission
if (hasPermission('dashboard:access')) {
  // Show dashboard
}

// Check any of multiple permissions
if (hasAnyPermission(['customers:list', 'customers:create'])) {
  // Show customer management
}

// Check all permissions required
if (hasAllPermissions(['products:list', 'stock:manage'])) {
  // Show full inventory control
}
```

### 3. Permission Codes Available

The system includes these permission codes:

#### Dashboard
- `dashboard:access` - Access to main dashboard

#### Customer Management
- `customers:list` - View customers
- `customers:create` - Create new customers
- `customers:update` - Update customer information
- `customers:delete` - Delete customers

#### Product Management
- `products:list` - View products
- `products:create` - Create new products
- `products:update` - Update product information
- `products:delete` - Delete products

#### Stock Management
- `stock:manage` - Manage inventory/stock levels

#### POS Operations
- `pos:open_session` - Open POS session
- `pos:close_session` - Close POS session
- `pos:sales` - Process sales transactions

#### Provisioning
- `provisioning:create` - Create new instances
- `provisioning:update` - Update instance settings
- `provisioning:delete` - Delete instances

### 4. Example Components

#### Marketplace Page (`src/pages/Marketplace.tsx`)
Shows product catalog with manifest details and permission-based provisioning buttons.

#### Dashboard Access Control (`src/pages/Dashboard.tsx`)
Updated to check `dashboard:access` permission before allowing access.

#### Permissions Demo (`src/components/PermissionsDemo.tsx`)
Example component showing how to use permission checks in UI.

## Usage Examples

### 1. Marketplace Integration
```typescript
import { catalogService } from '@/services/catalog.service';

const loadMarketplace = async () => {
  // Load available products
  const products = await catalogService.getProducts();

  // Load detailed manifest for a product
  const manifest = await catalogService.getProductManifest(productId);

  // Display modules and features with pricing
  manifest.modules?.forEach(module => {
    console.log(`${module.name}: ${module.description}`);
    module.features?.forEach(feature => {
      if (feature.requiresLicense) {
        console.log(`  ${feature.name} - $${feature.additionalCost}/month`);
      }
    });
  });
};
```

### 2. Permission-Based UI
```typescript
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { hasPermission, hasAnyPermission } = usePermissions();

  return (
    <div>
      {hasPermission('customers:list') && (
        <button>View Customers</button>
      )}

      {hasAnyPermission(['products:create', 'products:update']) && (
        <button>Manage Products</button>
      )}

      {hasPermission('pos:open_session') && (
        <POSInterface />
      )}
    </div>
  );
}
```

### 3. Dashboard Guard
```typescript
import { usePermissions } from '@/hooks/usePermissions';

function Dashboard() {
  const { hasPermission, loading } = usePermissions();

  if (loading) return <LoadingSpinner />;

  if (!hasPermission('dashboard:access')) {
    return <AccessDenied />;
  }

  return <DashboardContent />;
}
```

## Database Seeding

The backend includes comprehensive seeding that populates:

1. **Permissions**: All CRUD permissions for customers, products, stock, POS, and dashboard
2. **Products**: "Farutech POS & Services" with CRM, Inventory, and Sales modules
3. **Roles**: Owner role with all permissions assigned

Run the backend API to automatically seed the database on startup.

## Next Steps

1. **Test the APIs**: Ensure backend is running and APIs respond correctly
2. **Update existing components**: Add permission checks where needed
3. **Create marketplace UI**: Build product selection and provisioning flow
4. **Implement access controls**: Add guards throughout the application

## Notes

- All permission checks are done client-side for UI purposes
- Critical operations should also validate permissions server-side
- The permission system is extensible - new permissions can be added to the database
- Product manifests include pricing information for marketplace display