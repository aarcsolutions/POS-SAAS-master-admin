import api from '../lib/api';

export const permissionsApi = {
  getAll: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const { data } = await api.get('/permissions/getAll', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/permissions/getById/${id}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await api.post('/permissions/create', payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await api.put('/permissions/update', { id, ...payload });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete('/permissions/delete', { data: { id } });
    return data;
  },
};
