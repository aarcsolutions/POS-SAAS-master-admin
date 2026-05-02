import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Centralized Auth Hooks
 */

export const useLoginMutation = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: any) => authApi.login(credentials),
    onSuccess: (response) => {
      if (response.status && response.data) {
        const { user, modules, access_token, refresh_token } = response.data;
        const Cookies = require('js-cookie');
        
        // Update global auth state
        setAuth(user, modules);
        
        // Set tokens
        Cookies.set('access_token', access_token);
        Cookies.set('refresh_token', refresh_token);
        
        toast.success("Secure connection established");
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Access Denied");
    }
  });
};

export const useLogoutMutation = () => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      const Cookies = require('js-cookie');
      // Clear all session markers
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      logout();
      
      // Absolute redirect to clear any residual cache
      window.location.href = '/login';
    }
  });
};
