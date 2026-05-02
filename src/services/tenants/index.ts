import api from '../lib/api';
import { TenantListResponse, TenantDetailResponse, Tenant } from '@/types/admin.types';

/**
 * Pure API functions for Tenants Module (KSR-Parity)
 */
export const tenantsApi = {
  /**
   * Get all tenants with pagination
   */
  getAll: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const { data } = await api.get<TenantListResponse>('/tenants/getAll', { params });
    return data;
  },

  /**
   * Get single tenant by ID
   */
  getById: async (id: string) => {
    const { data } = await api.get<TenantDetailResponse>(`/tenants/getById/${id}`);
    return data;
  },

  /**
   * Create a new tenant (Onboarding)
   */
  create: async (payload: Partial<Tenant>) => {
    const { data } = await api.post('/tenants/create', payload);
    return data;
  },

  /**
   * Update existing tenant
   */
  update: async (id: string, payload: Partial<Tenant>) => {
    const { data } = await api.put('/tenants/update', { id, ...payload });
    return data;
  },

  /**
   * Delete tenant
   */
  delete: async (id: string) => {
    const { data } = await api.delete('/tenants/delete', { data: { id } });
    return data;
  }
};
