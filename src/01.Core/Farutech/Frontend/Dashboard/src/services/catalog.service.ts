// ============================================================================
// CATALOG SERVICE - API calls for products, modules, and features
// ============================================================================

import { apiClient } from '@/lib/api-client';
import type {
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
  ModuleDto,
  CreateModuleDto,
  UpdateModuleDto,
  FeatureDto,
  CreateFeatureDto,
  UpdateFeatureDto,
  ProductManifestDto,
} from '@/types/api';

// ============================================================================
// Products
// ============================================================================

export const catalogService = {
  // Products
  getProducts: async (): Promise<ProductDto[]> => {
    const { data } = await apiClient.get<ProductDto[]>('/api/Catalog/products');
    return data;
  },

  getProduct: async (id: string): Promise<ProductDto> => {
    const { data } = await apiClient.get<ProductDto>(`/api/Catalog/products/${id}`);
    return data;
  },

  createProduct: async (product: CreateProductDto): Promise<ProductDto> => {
    const { data } = await apiClient.post<ProductDto>('/api/Catalog/products', product);
    return data;
  },

  updateProduct: async (id: string, product: UpdateProductDto): Promise<ProductDto> => {
    const { data } = await apiClient.put<ProductDto>(`/api/Catalog/products/${id}`, product);
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Catalog/products/${id}`);
  },

  // Modules
  getProductModules: async (productId: string): Promise<ModuleDto[]> => {
    const { data } = await apiClient.get<ModuleDto[]>(`/api/Catalog/products/${productId}/modules`);
    return data;
  },

  getModule: async (id: string): Promise<ModuleDto> => {
    const { data } = await apiClient.get<ModuleDto>(`/api/Catalog/modules/${id}`);
    return data;
  },

  createModule: async (module: CreateModuleDto): Promise<ModuleDto> => {
    const { data } = await apiClient.post<ModuleDto>('/api/Catalog/modules', module);
    return data;
  },

  updateModule: async (id: string, module: UpdateModuleDto): Promise<ModuleDto> => {
    const { data } = await apiClient.put<ModuleDto>(`/api/Catalog/modules/${id}`, module);
    return data;
  },

  deleteModule: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Catalog/modules/${id}`);
  },

  // Features
  getModuleFeatures: async (moduleId: string): Promise<FeatureDto[]> => {
    const { data } = await apiClient.get<FeatureDto[]>(`/api/Catalog/modules/${moduleId}/features`);
    return data;
  },

  getFeature: async (id: string): Promise<FeatureDto> => {
    const { data } = await apiClient.get<FeatureDto>(`/api/Catalog/features/${id}`);
    return data;
  },

  createFeature: async (feature: CreateFeatureDto): Promise<FeatureDto> => {
    const { data } = await apiClient.post<FeatureDto>('/api/Catalog/features', feature);
    return data;
  },

  updateFeature: async (id: string, feature: UpdateFeatureDto): Promise<FeatureDto> => {
    const { data } = await apiClient.put<FeatureDto>(`/api/Catalog/features/${id}`, feature);
    return data;
  },

  deleteFeature: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Catalog/features/${id}`);
  },

  // Product Manifest (for marketplace and provisioning)
  getProductManifest: async (productId: string): Promise<ProductManifestDto> => {
    const { data } = await apiClient.get<ProductManifestDto>(`/api/Catalog/products/${productId}/manifest`);
    return data;
  },
};
