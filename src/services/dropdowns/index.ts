import api from '../lib/api';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface RolesDropdownResponse {
  status: boolean;
  message: string;
  heading: string;
  data: {
    rolesDropdown: DropdownOption[];
  };
}

/**
 * Global Dropdowns API Service
 * Centralized service to handle lightweight list fetching for all dropdowns across the system.
 */
export const dropdownsApi = {
  /**
   * Get Roles Dropdown
   * Uses /dropdowns/getAllRoles to fetch minimal {label, value} array
   */
  getRolesDropdown: async () => {
    const { data } = await api.get<RolesDropdownResponse>('/dropdowns/getAllRoles');
    return data;
  },
};
