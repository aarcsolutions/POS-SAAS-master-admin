import api from '../lib/api';

export const usersApi = {
  getAll: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const { data } = await api.get('/users/getAll', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/users/getById/${id}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await api.post('/users/create', payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await api.put('/users/update', { id, ...payload });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete('/users/delete', { data: { id } });
    return data;
  },
};
