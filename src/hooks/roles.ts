import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '@/services/roles';
import { toast } from 'sonner';

/**
 * Roles Module Hooks (Clean UI Pattern)
 */

export const useRolesQuery = (params: { page?: number; limit?: number; search?: string } = {}) => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => rolesApi.getAll(params),
    placeholderData: (previousData) => previousData, // Keep data while fetching new page
  });
};

export const useRoleDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => rolesApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: { title: string }) => rolesApi.create(payload),
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Role created successfully");
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create role");
    }
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => rolesApi.update(id, { title }),
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Role updated successfully");
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update role");
    }
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Role deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete role");
    }
  });
};

export const useRolePermissionsQuery = (roleId: string | null) => {
  return useQuery({
    queryKey: ['role-permissions', roleId],
    queryFn: () => rolesApi.getPermissions(roleId!),
    enabled: !!roleId,
  });
};

export const useUpdatePermissionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any[]) => rolesApi.updatePermissions(payload),
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Permissions updated successfully");
        queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update permissions");
    }
  });
};
