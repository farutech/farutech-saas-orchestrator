// ============================================================================
// CUSTOMERS SERVICE - API calls for customer management
// ============================================================================

import { apiClient } from '@/lib/api-client';
import type {
  Customer,
  CreateCustomerRequest,
  CreateCustomerResponse,
  UpdateCustomerRequest,
} from '@/types/api';

export const customersService = {
  /**
   * GET /api/Customers
   * Get all customers
   */
  getCustomers: async (): Promise<Customer[]> => {
    const { data } = await apiClient.get<Customer[]>('/api/Customers');
    return data;
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
