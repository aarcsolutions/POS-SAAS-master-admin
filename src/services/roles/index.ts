import api from '../lib/api';
import { RolesListResponse, RoleDetailResponse, RolePermissionsResponse, UpdatePermissionPayload } from '@/types/admin.types';

/**
 * Pure API functions for Roles Module (KSR-Parity)
 */
export const rolesApi = {
  /**
   * Get all roles with pagination and search
   */
  getAll: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const { data } = await api.get<RolesListResponse>('/roles/getAll', { params });
    return data;
  },

  /**
   * Get single role by ID
   */
  getById: async (id: string) => {
    const { data } = await api.get<RoleDetailResponse>(`/roles/getById/${id}`);
    return data;
  },

  /**
   * Create a new role
   */
  create: async (payload: { title: string }) => {
    const { data } = await api.post('/roles/create', payload);
    return data;
  },

  /**
   * Update existing role
   */
  update: async (id: string, payload: { title: string }) => {
    const { data } = await api.put('/roles/update', { id, ...payload });
    return data;
  },

  /**
   * Delete role
   */
  delete: async (id: string) => {
    const { data } = await api.delete('/roles/delete', { data: { id } });
    return data;
  },

  /**
   * Get all permissions for a specific role
   */
  getPermissions: async (roleId: string) => {
    const { data } = await api.get<RolePermissionsResponse>(`/roles/getAllPermissionsByRoleId/${roleId}`);
    return data;
  },

  /**
   * Update permission access for a specific role
   */
  updatePermissions: async (payload: UpdatePermissionPayload[]) => {
    // Transform payload to match backend DTO structure
    // Backend expects: { roleId, modulesWithPermissions: [{ moduleSlug, permissions: [{ id, permissionSlug, isAllowed }] }] }

    // Group permissions by extracting module info from permission data
    // For now, we'll use a simple grouping approach
    const permissionsMap = payload.map(item => ({
      id: item.permissionId,
      permissionSlug: 'permission', // This should ideally come from permission data
      isAllowed: item.isAllowed
    }));

    const modulesWithPermissions = [
      {
        moduleSlug: 'default',
        permissions: permissionsMap
      }
    ];

    const { data } = await api.put('/roles/updatePermissionsAccessByRoleId', {
      roleId: payload[0]?.roleId,
      modulesWithPermissions
    });
    return data;
  }
};
