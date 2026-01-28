// ============================================================================
// API HOOKS - React Query hooks for all API endpoints
// ============================================================================

import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog.service';
import { customersService } from '@/services/customers.service';
import { provisioningService } from '@/services/provisioning.service';
import { instancesService } from '@/services/instances.service';
import { toast } from 'sonner';
import type * as API from '@/types/api';

// ============================================================================
// Query Keys
// ============================================================================

export const queryKeys = {
  products: ['products'] as const,
  product: (id: string) => ['products', id] as const,
  productModules: (productId: string) => ['products', productId, 'modules'] as const,
  modules: ['modules'] as const,
  module: (id: string) => ['modules', id] as const,
  moduleFeatures: (moduleId: string) => ['modules', moduleId, 'features'] as const,
  features: ['features'] as const,
  feature: (id: string) => ['features', id] as const,
  customers: ['customers'] as const,
  customer: (id: string) => ['customers', id] as const,
  instances: ['instances'] as const,
  instance: (id: string) => ['instances', id] as const,
  availableTenants: ['available-tenants'] as const,
};

// ============================================================================
// PRODUCTS
// ============================================================================

export const useProducts = (options?: UseQueryOptions<API.ProductDto[]>) => {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: catalogService.getProducts,
    ...options,
  });
};

export const useProduct = (id: string, options?: UseQueryOptions<API.ProductDto>) => {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => catalogService.getProduct(id),
    enabled: !!id,
    ...options,
  });
};

export const useProductManifest = (id: string, options?: UseQueryOptions<API.ProductManifestDto>) => {
  return useQuery({
    queryKey: [...queryKeys.product(id), 'manifest'],
    queryFn: () => catalogService.getProductManifest(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateProduct = (options?: UseMutationOptions<API.ProductDto, Error, API.CreateProductDto>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: catalogService.createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast.success('Producto creado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al crear producto');
    },
    ...options,
  });
};

export const useUpdateProduct = (options?: UseMutationOptions<API.ProductDto, Error, { id: string; data: API.UpdateProductDto }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => catalogService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.product(variables.id) });
      toast.success('Producto actualizado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al actualizar producto');
    },
    ...options,
  });
};

export const useDeleteProduct = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: catalogService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast.success('Producto eliminado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al eliminar producto');
    },
    ...options,
  });
};

// ============================================================================
// MODULES
// ============================================================================

export const useProductModules = (productId: string, options?: UseQueryOptions<API.ModuleDto[]>) => {
  return useQuery({
    queryKey: queryKeys.productModules(productId),
    queryFn: () => catalogService.getProductModules(productId),
    enabled: !!productId,
    ...options,
  });
};

export const useModule = (id: string, options?: UseQueryOptions<API.ModuleDto>) => {
  return useQuery({
    queryKey: queryKeys.module(id),
    queryFn: () => catalogService.getModule(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateModule = (options?: UseMutationOptions<API.ModuleDto, Error, API.CreateModuleDto>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: catalogService.createModule,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productModules(data.productId) });
      toast.success('Módulo creado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al crear módulo');
    },
    ...options,
  });
};

export const useUpdateModule = (options?: UseMutationOptions<API.ModuleDto, Error, { id: string; data: API.UpdateModuleDto }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => catalogService.updateModule(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.module(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.productModules(data.productId) });
      toast.success('Módulo actualizado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al actualizar módulo');
    },
    ...options,
  });
};

export const useDeleteModule = (options?: UseMutationOptions<void, Error, { id: string; productId: string }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id }) => catalogService.deleteModule(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productModules(variables.productId) });
      toast.success('Módulo eliminado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al eliminar módulo');
    },
    ...options,
  });
};

// ============================================================================
// FEATURES
// ============================================================================

export const useModuleFeatures = (moduleId: string, options?: UseQueryOptions<API.FeatureDto[]>) => {
  return useQuery({
    queryKey: queryKeys.moduleFeatures(moduleId),
    queryFn: () => catalogService.getModuleFeatures(moduleId),
    enabled: !!moduleId,
    ...options,
  });
};

export const useFeature = (id: string, options?: UseQueryOptions<API.FeatureDto>) => {
  return useQuery({
    queryKey: queryKeys.feature(id),
    queryFn: () => catalogService.getFeature(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateFeature = (options?: UseMutationOptions<API.FeatureDto, Error, API.CreateFeatureDto>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: catalogService.createFeature,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moduleFeatures(data.moduleId) });
      toast.success('Feature creada exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al crear feature');
    },
    ...options,
  });
};

export const useUpdateFeature = (options?: UseMutationOptions<API.FeatureDto, Error, { id: string; data: API.UpdateFeatureDto }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => catalogService.updateFeature(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feature(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.moduleFeatures(data.moduleId) });
      toast.success('Feature actualizada exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al actualizar feature');
    },
    ...options,
  });
};

export const useDeleteFeature = (options?: UseMutationOptions<void, Error, { id: string; moduleId: string }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id }) => catalogService.deleteFeature(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moduleFeatures(variables.moduleId) });
      toast.success('Feature eliminada exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al eliminar feature');
    },
    ...options,
  });
};

// ============================================================================
// CUSTOMERS
// ============================================================================

export const useCustomers = (options?: UseQueryOptions<API.Customer[]>) => {
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: customersService.getCustomers,
    ...options,
  });
};

export const useCustomer = (id: string, options?: UseQueryOptions<API.Customer>) => {
  return useQuery({
    queryKey: queryKeys.customer(id),
    queryFn: () => customersService.getCustomer(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateCustomer = (options?: UseMutationOptions<API.CreateCustomerResponse, Error, API.CreateCustomerRequest>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: customersService.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      toast.success('Cliente creado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al crear cliente');
    },
    ...options,
  });
};

export const useUpdateCustomer = (options?: UseMutationOptions<void, Error, { id: string; data: API.UpdateCustomerRequest }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => customersService.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer(variables.id) });
      toast.success('Cliente actualizado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al actualizar cliente');
    },
    ...options,
  });
};

export const useDeleteCustomer = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: customersService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      toast.success('Cliente eliminado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al eliminar cliente');
    },
    ...options,
  });
};

// ============================================================================
// AUTH
// ============================================================================

export const useAvailableTenants = (options?: UseQueryOptions<API.TenantOptionDto[]>) => {
  return useQuery({
    queryKey: queryKeys.availableTenants,
    queryFn: authService.getAvailableTenants,
    ...options,
  });
};

export const useProvisionTenant = (options?: UseMutationOptions<API.ProvisionTenantResponse, Error, API.ProvisionTenantRequest>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: provisioningService.provisionTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      queryClient.invalidateQueries({ queryKey: queryKeys.instances });
      // Note: refreshAvailableTenants will be called from the component
      toast.success('Tenant provisionado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al provisionar tenant');
    },
    ...options,
  });
};

export const useDeprovisionTenant = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: provisioningService.deprovisionTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.instances });
      toast.success('Tenant desprovisionado exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || 'Error al desprovisionar tenant');
    },
    ...options,
  });
};

// ============================================================================
// INSTANCES
// ============================================================================

export const useInstances = (options?: UseQueryOptions<API.TenantInstance[]>) => {
  return useQuery({
    queryKey: queryKeys.instances,
    queryFn: instancesService.getInstances,
    ...options,
  });
};

export const useInstance = (id: string, options?: UseQueryOptions<API.TenantInstance>) => {
  return useQuery({
    queryKey: queryKeys.instance(id),
    queryFn: () => instancesService.getInstance(id),
    enabled: !!id,
    ...options,
  });
};
