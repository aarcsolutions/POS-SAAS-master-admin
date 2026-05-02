import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsApi } from '@/services/tenants';
import { toast } from 'sonner';

/**
 * Tenants Module Hooks (Clean UI Pattern)
 */

export const useTenantsQuery = (params: { page?: number; limit?: number; search?: string } = {}) => {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => tenantsApi.getAll(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useTenantDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['tenants', id],
    queryFn: () => tenantsApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateTenantMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: any) => tenantsApi.create(payload),
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Tenant created successfully");
        queryClient.invalidateQueries({ queryKey: ['tenants'] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create tenant");
    }
  });
};

export const useUpdateTenantMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => tenantsApi.update(id, payload),
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Tenant updated successfully");
        queryClient.invalidateQueries({ queryKey: ['tenants'] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update tenant");
    }
  });
};

export const useDeleteTenantMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => tenantsApi.delete(id),
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Tenant deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['tenants'] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete tenant");
    }
  });
};
