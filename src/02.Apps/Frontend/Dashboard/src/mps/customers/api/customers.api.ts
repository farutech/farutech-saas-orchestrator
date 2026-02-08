// ============================================================================
// CUSTOMERS API - API Client for Customers
// ============================================================================

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CustomerCreateDto {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export interface CustomerUpdateDto extends Partial<CustomerCreateDto> {
  status?: 'active' | 'inactive';
}

export const customersApi = {
  /**
   * Get all customers
   */
  async getAll(params?: { page?: number; limit?: number; search?: string }): Promise<{
    data: Customer[];
    total: number;
  }> {
    const response = await axios.get(`${API_BASE_URL}/customers`, { params });
    return response.data;
  },

  /**
   * Get customer by ID
   */
  async getById(id: string): Promise<Customer> {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
    return response.data;
  },

  /**
   * Create new customer
   */
  async create(data: CustomerCreateDto): Promise<Customer> {
    const response = await axios.post(`${API_BASE_URL}/customers`, data);
    return response.data;
  },

  /**
   * Update customer
   */
  async update(id: string, data: CustomerUpdateDto): Promise<Customer> {
    const response = await axios.put(`${API_BASE_URL}/customers/${id}`, data);
    return response.data;
  },

  /**
   * Delete customer
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/customers/${id}`);
  },

  /**
   * Bulk delete customers
   */
  async bulkDelete(ids: string[]): Promise<void> {
    await axios.post(`${API_BASE_URL}/customers/bulk-delete`, { ids });
  },
};
