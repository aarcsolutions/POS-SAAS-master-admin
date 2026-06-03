import api from '../lib/api';

/**
 * Pure API functions for Authentication (KSR-Parity)
 * TEMPORARILY MOCKED - Bypassing backend for local access
 */
export const authApi = {
  login: async (credentials: any) => {
    // MOCK: Return successful login without hitting backend
    return {
      status: true,
      statusCode: 200,
      message: "Login successful",
      data: {
        user: {
          id: "local-admin-001",
          email: credentials.email || "admin@saaspos.com",
          name: "Local Admin",
          role: "superadmin"
        },
        access_token: "mock-local-access-token",
        refresh_token: "mock-local-refresh-token",
        modules: [
          {
            module_name: "Dashboard",
            module_slug: "dashboard",
            permissions: [
              { permission_name: "View", is_Show_in_menu: true, permission_slug: "view", route: "/dashboard", is_allowed: true }
            ]
          },
          {
            module_name: "Settings",
            module_slug: "settings",
            permissions: [
              { permission_name: "View", is_Show_in_menu: true, permission_slug: "view", route: "/settings", is_allowed: true }
            ]
          }
        ]
      }
    };
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
