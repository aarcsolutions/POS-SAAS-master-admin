"use client";

import { useAuthStore } from "@/store/authStore";
import { ENTITY_PERMS } from "./permissions-map";

type EntityKey = keyof typeof ENTITY_PERMS;

/**
 * Advanced RBAC hook matching the KSR pattern.
 * Provides granular canCreate, canUpdate, etc. flags for a given entity.
 */
export function useEntityPerms(entity: EntityKey) {
  const { hasPermission } = useAuthStore();
  const PERM = ENTITY_PERMS[entity];

  return {
    canList:   !!('list' in PERM && hasPermission(PERM.list)),
    canCreate: !!('create' in PERM && hasPermission(PERM.create)),
    canRead:   !!('read' in PERM && hasPermission(PERM.read)),
    canUpdate: !!('update' in PERM && hasPermission(PERM.update)),
    canDelete: !!('delete' in PERM && hasPermission(PERM.delete)),
    // Extra specific permissions (e.g., for roles module)
    canViewRolePerms:   entity === "roles" ? !!hasPermission(ENTITY_PERMS.roles.extras.getRolePerms) : false,
    canUpdateRolePerms: entity === "roles" ? !!hasPermission(ENTITY_PERMS.roles.extras.updateRolePerms) : false,
    PERM,
  };
}

/**
 * Simple permission check hook for generic use cases.
 */
export function useHasPermission(permissionSlug: string) {
  const { hasPermission } = useAuthStore();
  return hasPermission(permissionSlug);
}
