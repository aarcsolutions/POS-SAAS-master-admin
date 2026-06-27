import api from '../lib/api';

export const subscriptionsApi = {
  getAll: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const { data } = await api.get('/subscriptions/getAll', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/subscriptions/getById/${id}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await api.post('/subscriptions/create', payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await api.put('/subscriptions/update', { id, ...payload });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete('/subscriptions/delete', { data: { id } });
    return data;
  },
};
