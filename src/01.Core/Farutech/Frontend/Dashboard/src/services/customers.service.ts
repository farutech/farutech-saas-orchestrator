// ============================================================================
// CUSTOMERS SERVICE - API calls for customer management
// ============================================================================

import { apiClient } from '@/lib/api-client';
import type {
  Customer,
  CreateCustomerRequest,
  CreateCustomerResponse,
  UpdateCustomerRequest,
  PagedOrganizationsResponse,
} from '@/types/api';

export const customersService = {
  /**
   * GET /api/Customers
   * Get all customers
   */
  getCustomers: async (): Promise<PagedOrganizationsResponse> => {
    const { data } = await apiClient.get<Partial<PagedOrganizationsResponse> | null | undefined>('/api/Customers');
    const organizations = Array.isArray(data?.organizations) ? data.organizations : [];

    return {
      organizations,
      totalCount: typeof data?.totalCount === 'number' ? data.totalCount : organizations.length,
      pageNumber: typeof data?.pageNumber === 'number' ? data.pageNumber : 1,
      pageSize: typeof data?.pageSize === 'number' ? data.pageSize : organizations.length,
      totalPages: typeof data?.totalPages === 'number' ? data.totalPages : 1,
    };
  },

  /**
   * GET /api/Customers/{id}
   * Get specific customer by ID
   */
  getCustomer: async (id: string): Promise<Customer> => {
    const { data } = await apiClient.get<Customer>(`/api/Customers/${id}`);
    return data;
  },

  /**
   * POST /api/Customers
   * Create a new customer
   */
  createCustomer: async (customer: CreateCustomerRequest): Promise<CreateCustomerResponse> => {
    const { data } = await apiClient.post<CreateCustomerResponse>('/api/Customers', customer);
    return data;
  },

  /**
   * PUT /api/Customers/{id}
   * Update existing customer
   */
  updateCustomer: async (id: string, customer: UpdateCustomerRequest): Promise<void> => {
    await apiClient.put(`/api/Customers/${id}`, customer);
  },

  /**
   * DELETE /api/Customers/{id}
   * Delete customer
   */
  deleteCustomer: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Customers/${id}`);
  },
};
