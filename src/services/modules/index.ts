import { apiFetch } from '../api';
import { ROUTES } from '../../utils/constants';
import { ModulesListResponse, ModuleItemResponse } from '../../types/admin.types';

export const modulesService = {
  getAll: (page = 1, limit = 10) => 
    apiFetch<ModulesListResponse>(`${ROUTES.ACCESS_CONTROL.MODULES}?page=${page}&limit=${limit}`),
  
  create: (data: any) => 
    apiFetch<ModuleItemResponse>(ROUTES.ACCESS_CONTROL.MODULES, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) => 
    apiFetch<ModuleItemResponse>(`${ROUTES.ACCESS_CONTROL.MODULES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
