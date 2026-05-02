import { apiFetch } from '../api';
import { ROUTES } from '../../utils/constants';
import { UsersListResponse, UserItemResponse } from '../../types/admin.types';

export const usersService = {
  getAll: (page = 1, limit = 10) => 
    apiFetch<UsersListResponse>(`${ROUTES.ACCESS_CONTROL.USERS}?page=${page}&limit=${limit}`),
  
  getById: (id: string) => 
    apiFetch<UserItemResponse>(`${ROUTES.ACCESS_CONTROL.USERS}/${id}`),
  
  create: (data: any) => 
    apiFetch<UserItemResponse>(ROUTES.ACCESS_CONTROL.USERS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) => 
    apiFetch<UserItemResponse>(`${ROUTES.ACCESS_CONTROL.USERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
