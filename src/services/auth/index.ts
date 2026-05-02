import api from '../lib/api';

/**
 * Pure API functions for Authentication (KSR-Parity)
 */
export const authApi = {
  login: async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  
  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },
  
  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  refresh: async (refresh_token: string) => {
    const { data } = await api.post('/auth/refresh', { refresh_token });
    return data;
  }
};
