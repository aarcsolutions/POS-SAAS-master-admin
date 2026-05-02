import { useQuery } from '@tanstack/react-query';
import { dropdownsApi } from '@/services/dropdowns';

/**
 * Global Dropdowns Hooks
 * Allows components to fetch lightweight dropdown lists without loading full module data.
 */

export const useRolesDropdownQuery = () => {
  return useQuery({
    queryKey: ['dropdowns', 'roles'],
    queryFn: dropdownsApi.getRolesDropdown,
  });
};
