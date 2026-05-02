import { useAuthStore } from '@/store/authStore';

/**
 * A simple hook to check for a single permission slug.
 * Matches the KSR pattern for checking individual entity actions.
 * Usage: const canCreate = usePermission('roles/create');
 */
export const usePermission = (permissionSlug: string): boolean => {
  const permissions = useAuthStore((state) => state.permissions);
  return permissions.includes(permissionSlug);
};
