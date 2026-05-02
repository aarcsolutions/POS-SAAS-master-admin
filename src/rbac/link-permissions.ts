import { ENTITY_PERMS } from "./permissions-map";

/**
 * Mapping of Dashboard routes to their required permission strings.
 * Exactly matches the KSR ADMIN_LINK_PERM pattern.
 */
export const ADMIN_LINK_PERM: Record<string, string> = {
  "/dashboard":                  ENTITY_PERMS.dashboard.overview,
  "/access-control/roles":       ENTITY_PERMS.roles.list,
  "/access-control/users":       ENTITY_PERMS.users.list,
  "/access-control/modules":     ENTITY_PERMS.modules.list,
  "/access-control/permissions":  ENTITY_PERMS.permissions.list,
  "/tenants":                    ENTITY_PERMS.tenants.list,
  "/subscriptions":              ENTITY_PERMS.subscriptions.list,
};
