/**
 * Mock sidebar data from API response
 * Source: Database-seeder-service/src/seeders/seed.ts
 * Shows menu item when permission.is_Show_in_menu === true AND permission.is_allowed === true
 */

export const MOCK_SIDEBAR_MODULES = [
  {
    module_name: "Dashboard",
    module_slug: "dashboard",
    permissions: [
      { permission_name: "Dashboard Overview", is_Show_in_menu: true, permission_slug: "getAll", route: "dashboard/getAll", is_allowed: true }
    ]
  },
  {
    module_name: "Subscriptions",
    module_slug: "subscriptions",
    permissions: [
      { permission_name: "Subscriptions Get All", is_Show_in_menu: true, permission_slug: "getAll", route: "subscriptions/getAll", is_allowed: true }
    ]
  },
  {
    module_name: "Dropdowns",
    module_slug: "dropdowns",
    permissions: [
      { permission_name: "Dropdowns Get All Roles", is_Show_in_menu: false, permission_slug: "getAllRoles", route: "dropdowns/getAllRoles", is_allowed: true },
      { permission_name: "Dropdowns Get All Modules", is_Show_in_menu: false, permission_slug: "getAllModules", route: "dropdowns/getAllModules", is_allowed: true }
    ]
  },
  {
    module_name: "Modules",
    module_slug: "modules",
    permissions: [
      { permission_name: "Modules Create", is_Show_in_menu: false, permission_slug: "create", route: "modules/create", is_allowed: true },
      { permission_name: "Modules Delete", is_Show_in_menu: false, permission_slug: "delete", route: "modules/delete", is_allowed: true },
      { permission_name: "Modules Get All", is_Show_in_menu: true, permission_slug: "getAll", route: "modules/getAll", is_allowed: true },
      { permission_name: "Modules Get By Id", is_Show_in_menu: false, permission_slug: "getById", route: "modules/getById", is_allowed: true },
      { permission_name: "Modules Update", is_Show_in_menu: false, permission_slug: "update", route: "modules/update", is_allowed: true }
    ]
  },
  {
    module_name: "Permissions",
    module_slug: "permissions",
    permissions: [
      { permission_name: "Permissions Create", is_Show_in_menu: false, permission_slug: "create", route: "permissions/create", is_allowed: true },
      { permission_name: "Permissions Delete", is_Show_in_menu: false, permission_slug: "delete", route: "permissions/delete", is_allowed: true },
      { permission_name: "Permissions Get All", is_Show_in_menu: true, permission_slug: "getAll", route: "permissions/getAll", is_allowed: true },
      { permission_name: "Permissions Get By Id", is_Show_in_menu: false, permission_slug: "getById", route: "permissions/getById", is_allowed: true },
      { permission_name: "Permissions Update", is_Show_in_menu: false, permission_slug: "update", route: "permissions/update", is_allowed: true }
    ]
  },
  {
    module_name: "Roles",
    module_slug: "roles",
    permissions: [
      { permission_name: "Roles Create", is_Show_in_menu: false, permission_slug: "create", route: "roles/create", is_allowed: true },
      { permission_name: "Roles Delete", is_Show_in_menu: false, permission_slug: "delete", route: "roles/delete", is_allowed: true },
      { permission_name: "Roles Get All", is_Show_in_menu: true, permission_slug: "getAll", route: "roles/getAll", is_allowed: true },
      { permission_name: "Roles Get All Permissions By Role Id", is_Show_in_menu: false, permission_slug: "getAllPermissionsByRoleId", route: "roles/getAllPermissionsByRoleId", is_allowed: true },
      { permission_name: "Roles Get By Id", is_Show_in_menu: false, permission_slug: "getById", route: "roles/getById", is_allowed: true },
      { permission_name: "Roles Update", is_Show_in_menu: false, permission_slug: "update", route: "roles/update", is_allowed: true },
      { permission_name: "Roles Update Permissions Access By Role Id", is_Show_in_menu: false, permission_slug: "updatePermissionsAccessByRoleId", route: "roles/updatePermissionsAccessByRoleId", is_allowed: true }
    ]
  },
  {
    module_name: "Tenants",
    module_slug: "tenants",
    permissions: [
      { permission_name: "Tenants Create", is_Show_in_menu: false, permission_slug: "create", route: "tenants/create", is_allowed: true },
      { permission_name: "Tenants Delete", is_Show_in_menu: false, permission_slug: "delete", route: "tenants/delete", is_allowed: true },
      { permission_name: "Tenants Get All", is_Show_in_menu: true, permission_slug: "getAll", route: "tenants/getAll", is_allowed: true },
      { permission_name: "Tenants Get By Id", is_Show_in_menu: false, permission_slug: "getById", route: "tenants/getById", is_allowed: true },
      { permission_name: "Tenants Update", is_Show_in_menu: false, permission_slug: "update", route: "tenants/update", is_allowed: true }
    ]
  },
  {
    module_name: "Users",
    module_slug: "users",
    permissions: [
      { permission_name: "Users Create", is_Show_in_menu: false, permission_slug: "create", route: "users/create", is_allowed: true },
      { permission_name: "Users Delete", is_Show_in_menu: false, permission_slug: "delete", route: "users/delete", is_allowed: true },
      { permission_name: "Users Get All", is_Show_in_menu: true, permission_slug: "getAll", route: "users/getAll", is_allowed: true },
      { permission_name: "Users Get By Id", is_Show_in_menu: false, permission_slug: "getById", route: "users/getById", is_allowed: true },
      { permission_name: "Users Update", is_Show_in_menu: false, permission_slug: "update", route: "users/update", is_allowed: true }
    ]
  }
];

/**
 * Filter modules for sidebar display
 * Rule: Show menu item when permission.is_Show_in_menu === true AND permission.is_allowed === true
 */
export const getSidebarModules = () => {
  return MOCK_SIDEBAR_MODULES.filter((module) =>
    module.permissions.some(
      (perm) => perm.is_Show_in_menu === true && perm.is_allowed === true
    )
  );
};
