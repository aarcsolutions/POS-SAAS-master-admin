import { apiFetch } from '../api';
import { ROUTES } from '../../utils/constants';
import { PermissionsListResponse, PermissionItemResponse } from '../../types/admin.types';

export const permissionsService = {
  getAll: (page = 1, limit = 10) => 
    apiFetch<PermissionsListResponse>(`${ROUTES.ACCESS_CONTROL.PERMISSIONS}?page=${page}&limit=${limit}`),
  
  create: (data: any) => 
    apiFetch<PermissionItemResponse>(ROUTES.ACCESS_CONTROL.PERMISSIONS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
