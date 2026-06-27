import api from '../lib/api';

export const modulesApi = {
  getAll: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const { data } = await api.get('/modules/getAll', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/modules/getById/${id}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await api.post('/modules/create', payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await api.put('/modules/update', { id, ...payload });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete('/modules/delete', { data: { id } });
    return data;
  },
};
