export const ENTITY_PERMS = {
  modules: {
    list:   "modules/getAll",
    create: "modules/create",
    read:   "modules/getById",
    update: "modules/update",
    delete: "modules/delete",
  },
  permissions: {
    list:   "permissions/getAll",
    create: "permissions/create",
    read:   "permissions/getById",
    update: "permissions/update",
    delete: "permissions/delete",
  },
  roles: {
    list:   "roles/getAll",
    create: "roles/create",
    read:   "roles/getById",
    update: "roles/update",
    delete: "roles/delete",
    extras: {
      getRolePerms:   "roles/getAllPermissionsByRoleId",
      updateRolePerms:"roles/updatePermissionsAccessByRoleId",
    },
  },
  users: {
    list:   "users/getAll",
    create: "users/create",
    read:   "users/getById",
    update: "users/update",
    delete: "users/delete",
  },
  tenants: {
    list:   "tenants/getAll",
    create: "tenants/create",
    read:   "tenants/getById",
    update: "tenants/update",
    delete: "tenants/delete",
  },
  subscriptions: {
    list:   "subscriptions/getAll",
    create: "subscriptions/create",
    read:   "subscriptions/getById",
    update: "subscriptions/update",
    delete: "subscriptions/delete",
  },
  dashboard: {
    overview: "dashboard/getAll",
  },
} as const;
